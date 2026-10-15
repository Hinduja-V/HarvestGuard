
from pathlib import Path
import json

import numpy as np
import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.utils import image_dataset_from_directory

# Paths
PROJECT_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(r"C:\Users\HP\Downloads\FGrade-main\FGrade-main\data")
TRAIN_DIR = DATA_DIR / "Training_set"
TEST_DIR = DATA_DIR / "Testing_set"

MODEL_DIR = PROJECT_DIR / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15

# Proposed mapping: folder 0 is assumed to be grade 1.
# This three-category grouping is a project decision,
# not an official mapping supplied by the dataset.
GRADE_TO_CATEGORY = {
    0: 0, 1: 0, 2: 0,
    3: 1, 4: 1, 5: 1, 6: 1,
    7: 2, 8: 2, 9: 2,
}
CATEGORY_NAMES = ["Fresh", "Aging", "Spoiled"]


def load_dataset(directory, shuffle, validation_split=None, subset=None):
    dataset = image_dataset_from_directory(
        directory,
        labels="inferred",
        label_mode="int",
        class_names=[str(i) for i in range(10)],
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=shuffle,
        seed=42,
        validation_split=validation_split,
        subset=subset,
    )

    def preprocess(images, labels):
        images = tf.keras.applications.mobilenet_v2.preprocess_input(images)
        mapping = tf.constant([GRADE_TO_CATEGORY[i] for i in range(10)])
        labels = tf.gather(mapping, labels)
        return images, labels

    return dataset.map(
        preprocess,
        num_parallel_calls=tf.data.AUTOTUNE,
    ).prefetch(tf.data.AUTOTUNE)


def main():
    if not TRAIN_DIR.exists() or not TEST_DIR.exists():
        raise FileNotFoundError(
            f"Could not find Training_set or Testing_set under {DATA_DIR}"
        )

    print("Loading training subset...")
    train_ds = load_dataset(
        TRAIN_DIR,
        shuffle=True,
        validation_split=0.2,
        subset="training",
    )

    print("Loading validation subset...")
    val_ds = load_dataset(
        TRAIN_DIR,
        shuffle=False,
        validation_split=0.2,
        subset="validation",
    )

    # Approximate category counts for class weights.
    # Counts are based on the training folders; the validation
    # subset is not included in this estimate.
    grade_counts = {
        grade: len(list((TRAIN_DIR / str(grade)).glob("*.jpg")))
        for grade in range(10)
    }
    category_counts = {
        category: sum(
            count for grade, count in grade_counts.items()
            if GRADE_TO_CATEGORY[grade] == category
        )
        for category in range(3)
    }

    print("Images by proposed category (before validation split):")
    for index, name in enumerate(CATEGORY_NAMES):
        print(f"  {name}: {category_counts[index]}")

    # Calculate class weights using the relative category frequencies.
    y_for_weights = np.concatenate([
        np.full(count, category, dtype=np.int32)
        for category, count in category_counts.items()
    ])
    weights = compute_class_weight(
        class_weight="balanced",
        classes=np.array([0, 1, 2]),
        y=y_for_weights,
    )
    class_weights = {i: float(weights[i]) for i in range(3)}
    print("Class weights:", class_weights)

    base_model = MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = False

    inputs = layers.Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(3, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    best_model_path = MODEL_DIR / "freshness_model.keras"
    callbacks = [
        ModelCheckpoint(
            filepath=str(best_model_path),
            monitor="val_loss",
            save_best_only=True,
        ),
        EarlyStopping(
            monitor="val_loss",
            patience=3,
            restore_best_weights=True,
        ),
    ]

    print("Training model...")
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    # Save the best checkpoint and its label/preprocessing metadata.
    metadata = {
        "category_names": CATEGORY_NAMES,
        "grade_to_category": {
            str(grade): GRADE_TO_CATEGORY[grade]
            for grade in range(10)
        },
        "image_size": list(IMAGE_SIZE),
        "preprocessing": "mobilenet_v2_preprocess_input",
        "mapping_note": (
            "Proposed grouping: grades 1-3 Fresh, 4-7 Aging, "
            "8-10 Spoiled; not an official dataset 3-class mapping."
        ),
    }
    (MODEL_DIR / "freshness_metadata.json").write_text(
        json.dumps(metadata, indent=2),
        encoding="utf-8",
    )

    print(f"Best model saved to: {best_model_path}")
    print(f"Metadata saved to: {MODEL_DIR / 'freshness_metadata.json'}")

    # Testing_set is deliberately not used during training.
    # We will use it for a separate evaluation after training.


if __name__ == "__main__":
    main()
