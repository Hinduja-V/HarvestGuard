
"""
HarvestGuard AI - Image Processing Service
Handles image validation, Pillow resizing, RGB conversion, and normalization.
"""

import io
from typing import Any, Dict, Optional, Tuple

import tensorflow as tf

try:
    from PIL import Image
    import numpy as np
except ImportError:
    Image = None
    np = None

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg"
}

TARGET_SIZE: Tuple[int, int] = (224, 224)


def validate_and_preprocess_image(
    file_bytes: bytes,
    *,
    resampling: Optional[int] = None,
    training_preprocessing: bool = False,
) -> Dict[str, Any]:
    """
    Validate image data, convert it to RGB, resize it,
    normalize pixels, and return the processed image.
    """

    if not file_bytes:
        raise ValueError(
            "No image data provided. Please upload an image."
        )

    if Image is None:
        raise RuntimeError(
            "Pillow is not installed. Install it using pip install Pillow."
        )

    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
    except Exception as e:
        raise ValueError(
            "Invalid image file. Upload a valid JPEG, PNG, or WebP image."
        ) from e

    try:
        # Reopen the image after verification
        img = Image.open(io.BytesIO(file_bytes))
        original_size = img.size

        if img.mode != "RGB":
            img = img.convert("RGB")

        if training_preprocessing:
            image_array = np.asarray(img, dtype=np.uint8)
            resized_tensor = tf.image.resize(image_array, TARGET_SIZE)
            image_tensor = tf.keras.applications.mobilenet_v2.preprocess_input(
                resized_tensor
            )
            img_tensor = tf.expand_dims(image_tensor, axis=0).numpy()
            img_resized = img.resize(TARGET_SIZE, Image.Resampling.BILINEAR)
        else:
            img_resized = img.resize(
                TARGET_SIZE,
                Image.Resampling.LANCZOS if resampling is None else resampling,
            )
            img_array = np.array(img_resized, dtype=np.float32)
            img_array = (img_array / 127.5) - 1.0
            img_tensor = np.expand_dims(img_array, axis=0)

    except Exception as e:
        raise ValueError(
            "Invalid image file. Upload a valid JPEG, PNG, or WebP image."
        ) from e

    return {
        "original_width": original_size[0],
        "original_height": original_size[1],
        "target_size": TARGET_SIZE,
        "processed_tensor": img_tensor,
        "pil_image": img_resized
    }
