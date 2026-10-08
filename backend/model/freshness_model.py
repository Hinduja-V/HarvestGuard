"""
HarvestGuard AI - Tomato Freshness Model Architecture
Transfer Learning using MobileNetV2 pre-trained on ImageNet
Adapted for 3-class Produce Freshness Classification:
0: Fresh
1: Aging
2: Spoiled
"""

import os
from typing import Tuple

CLASSES = ["Fresh", "Aging", "Spoiled"]

def build_transfer_learning_model(input_shape: Tuple[int, int, int] = (224, 224, 3)):
    """
    Builds a lightweight transfer learning CNN for produce freshness assessment.
    Uses MobileNetV2 as a frozen feature extractor base with fine-tuning heads.
    """
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models
        from tensorflow.keras.applications import MobileNetV2

        base_model = MobileNetV2(
            input_shape=input_shape,
            include_top=False,
            weights="imagenet"
        )
        base_model.trainable = False  # Freeze base layers for initial feature extraction

        model = models.Sequential([
            layers.Input(shape=input_shape),
            layers.Rescaling(1.0 / 255.0),
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.BatchNormalization(),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.3),
            layers.Dense(len(CLASSES), activation="softmax", name="freshness_output")
        ])

        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
            loss="categorical_crossentropy",
            metrics=["accuracy"]
        )
        return model
    except ImportError:
        # Fallback representation when TensorFlow is not locally installed
        return None
