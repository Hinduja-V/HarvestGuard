"""
HarvestGuard AI - FastAPI Backend Service
Provides REST API endpoints for produce freshness classification and inventory decision support.
"""

from pathlib import Path
from typing import Any, Dict, Optional
import json
import logging
import os

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from backend.services.image_processing import validate_and_preprocess_image
from backend.services.prediction import (
    CLASSES,
    POTATO_CLASSES,
    generate_decision,
)

logger = logging.getLogger(__name__)
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATHS = {
    "Tomato": MODEL_DIR / "freshness_model.keras",
    "Potato": MODEL_DIR / "potato_freshness_model.keras",
}
POTATO_METADATA_PATH = MODEL_DIR / "potato_freshness_metadata.json"
MAX_IMAGE_BYTES = 10 * 1024 * 1024
DIAGNOSTICS_ENABLED = os.getenv("HARVESTGUARD_DIAGNOSTICS", "").lower() in {
    "1",
    "true",
    "yes",
}
if DIAGNOSTICS_ENABLED:
    logger.setLevel(logging.INFO)
    logger.propagate = False
    diagnostic_handler = logging.StreamHandler()
    diagnostic_handler.setFormatter(
        logging.Formatter("%(levelname)s:%(name)s:%(message)s")
    )
    logger.addHandler(diagnostic_handler)


def _load_produce_model(produce: str, model_path: Path) -> Any:
    if not model_path.is_file():
        raise FileNotFoundError(f"Trained {produce} model not found: {model_path}")

    if produce == "Potato":
        with POTATO_METADATA_PATH.open(encoding="utf-8") as metadata_file:
            metadata = json.load(metadata_file)

        expected_folder_labels = {"freshpotato": 0, "rottenpotato": 1}
        if (
            metadata.get("produce") != "Potato"
            or metadata.get("class_names") != POTATO_CLASSES
            or metadata.get("folder_to_label") != expected_folder_labels
            or metadata.get("image_size") != [224, 224]
            or metadata.get("preprocessing") != "mobilenet_v2_preprocess_input"
        ):
            raise ValueError(
                "Potato model metadata does not match the trained class order "
                "or preprocessing pipeline."
            )

    return tf.keras.models.load_model(model_path)


models: Dict[str, Any] = {}
for produce_name, produce_model_path in MODEL_PATHS.items():
    try:
        models[produce_name] = _load_produce_model(
            produce_name,
            produce_model_path,
        )
    except Exception:
        logger.exception("Could not load the %s model", produce_name)

app = FastAPI(
    title="HarvestGuard AI REST API",
    description="AI-powered produce freshness classification and Sell-First inventory decision support.",
    version="1.0.0"
)

# Enable CORS for local Vite development and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": "HarvestGuard AI",
        "status": "online",
        "version": "1.0.0",
        "supported_produce": list(models),
        "classes": CLASSES,
        "sdg_impact": ["SDG 12: Responsible Consumption and Production", "SDG 2: Zero Hunger"]
    }

@app.get("/api/health")
def health_check():
    is_healthy = bool(models)
    return {
        "status": "healthy" if is_healthy else "degraded",
        "service": "HarvestGuard AI Inference Engine",
        "supported_produce": list(models),
        "models": {
            produce: "available" if produce in models else "unavailable"
            for produce in MODEL_PATHS
        },
        "pipeline": "Pillow preprocessing -> produce-specific MobileNetV2 CNN -> inventory decision layer"
    }

@app.get("/api/produce-types")
def get_supported_produce():
    descriptions = {
        "Tomato": "Three-class visual freshness classification.",
        "Potato": "Two-class visual freshness classification.",
    }
    return {
        "current_mvp": [
            {
                "id": produce.lower(),
                "name": produce,
                "status": "active",
                "classes": CLASSES if produce == "Tomato" else POTATO_CLASSES,
                "description": descriptions[produce],
            }
            for produce in MODEL_PATHS
            if produce in models
        ],
        "upcoming": [
            {
                "id": "onion",
                "name": "Onion",
                "status": "coming_soon",
                "notice": "Onion prediction is not supported yet."
            }
        ]
    }

@app.post("/api/predict")
async def predict_freshness(
    produce: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    """
    Primary endpoint:
    Receives produce image -> pre-processes -> infers freshness -> returns sell-first decision.
    """
    normalized_produce = produce.strip().lower()
    produce_name = {
        "tomato": "Tomato",
        "potato": "Potato",
    }.get(normalized_produce)
    if produce_name is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported produce type '{produce}'. "
                "Supported produce types are Tomato and Potato."
            ),
        )

    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a produce image first."
        )

    if produce_name not in models:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                f"The {produce_name} model is unavailable. "
                "Check the model file and metadata, then restart the backend."
            ),
        )

    try:
        content = await file.read()
    except Exception as exc:
        logger.exception("Could not read uploaded image")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read uploaded image. Please provide a valid file."
        ) from exc

    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Uploaded image is empty. Please choose a valid image file.",
        )

    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image is too large. Upload an image smaller than 10 MB.",
        )

    try:
        if produce_name == "Potato":
            processed = validate_and_preprocess_image(
                content,
                training_preprocessing=True,
            )
        else:
            processed = validate_and_preprocess_image(content)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.exception("%s image preprocessing failed", produce_name)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image preprocessing failed unexpectedly.",
        ) from exc

    image_tensor = processed.get("processed_tensor")

    if image_tensor is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image preprocessing failed to produce a valid tensor."
        )

    class_names = CLASSES if produce_name == "Tomato" else POTATO_CLASSES
    try:
        output = np.asarray(models[produce_name].predict(image_tensor, verbose=0))
    except Exception as exc:
        logger.exception("%s model inference failed", produce_name)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"The {produce_name} model could not process this image.",
        ) from exc

    if output.ndim != 2 or output.shape[0] != 1:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model output has an unexpected shape.",
        )

    probabilities = output[0]
    if (
        len(probabilities) != len(class_names)
        or not np.all(np.isfinite(probabilities))
        or np.any(probabilities < 0)
        or np.any(probabilities > 1)
        or not np.isclose(float(np.sum(probabilities)), 1.0, atol=1e-3)
    ):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model output does not match the expected class probabilities.",
        )

    predicted_index = int(np.argmax(probabilities))
    predicted_class = class_names[predicted_index]
    confidence_score = float(probabilities[predicted_index])

    if DIAGNOSTICS_ENABLED:
        logger.info(
            "Prediction diagnostics: requested_produce=%r selected_model=%s "
            "image_filename=%r image_dimensions=%sx%s output_probabilities=%s "
            "final_mapped_class=%s",
            produce,
            MODEL_PATHS[produce_name].name,
            file.filename or "<unknown>",
            processed["original_width"],
            processed["original_height"],
            probabilities.tolist(),
            predicted_class,
        )

    class_probabilities = {
        name: round(float(probability), 4)
        for name, probability in zip(class_names, probabilities)
    }

    return generate_decision(
        produce=produce_name,
        predicted_class=predicted_class,
        confidence_score=confidence_score,
        class_probabilities=class_probabilities,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
