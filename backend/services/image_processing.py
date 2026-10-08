"""
HarvestGuard AI - Image Processing Service
Handles image validation, Pillow resizing, RGB conversion, and normalization.
"""

import io
from typing import Tuple, Dict, Any

try:
    from PIL import Image
    import numpy as np
except ImportError:
    Image = None
    np = None

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
TARGET_SIZE: Tuple[int, int] = (224, 224)

def validate_and_preprocess_image(file_bytes: bytes) -> Dict[str, Any]:
    """
    Validates uploaded image byte stream, checks dimensions, converts to RGB,
    and returns preprocessed array and metadata.
    """
    if not file_bytes:
        raise ValueError("No image data provided. Please upload an image.")

    if Image is None:
        return {
            "status": "pillow_unavailable",
            "message": "Pillow not installed in this environment"
        }

    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()  # Verify image integrity
    except Exception as e:
        raise ValueError("Invalid image file format. Please upload a clear JPEG, PNG, or WebP photo.") from e

    # Re-open after verify() closes the file
    img = Image.open(io.BytesIO(file_bytes))
    original_size = img.size

    # Convert color mode to RGB (handles RGBA, Grayscale, etc.)
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Resize to model standard input dimensions using high-quality lanczos filter
    img_resized = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

    # Convert to numpy array if numpy is available
    if np is not None:
        img_array = np.array(img_resized, dtype=np.float32) / 255.0
        # Expand dims for batch inference: (1, 224, 224, 3)
        img_tensor = np.expand_dims(img_array, axis=0)
    else:
        img_tensor = None

    return {
        "original_width": original_size[0],
        "original_height": original_size[1],
        "target_size": TARGET_SIZE,
        "processed_tensor": img_tensor,
        "pil_image": img_resized
    }
