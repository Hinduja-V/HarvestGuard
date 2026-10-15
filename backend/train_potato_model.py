from pathlib import Path
import json

import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint


# --------------------------------------------------
# 1. PATHS
# --------------------------------------------------

PROJECT_DIR = Path(__file__).resolve().parent

DATA_DIR = Path(__file__).resolve().parent / "potato_dataset"

MODEL_DIR = PROJECT_DIR / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "potato_freshness_model.keras"
METADATA_PATH = MODEL_DIR / "potato_freshness_metadata.json"

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 15
SEED = 42

CLASS_NAMES = ["freshpotato", "rottenpotato"]


# --------------------------------------------------
# 2. CHECK DATASET
# --------------------------------------------------

def main():
    for class_name in CLASS_NAMES:
        folder = DATA_DIR / class_name

        if not folder.is_dir():
            raise FileNotFoundError(
                f"Dataset folder not found: {folder}"
            )

        count = sum(
            1
            for file in folder.iterdir()
            if file.is_file()
            and file.suffix.lower() in {".jpg", ".jpeg", ".png"}
        )

        print(f"{class_name}: {count} images")

        if count == 0:
            raise ValueError(
                f"No supported images found in {folder}"
            )

    # --------------------------------------------------
    # 3. LOAD A STRATIFIED TRAINING/VALIDATION SPLIT
    # --------------------------------------------------

    print("\nLoading training and validation data...")

    image_paths = []
    image_labels = []

    for label, class_name in enumerate(CLASS_NAMES):
        folder = DATA_DIR / class_name

        for file_path in folder.iterdir():
            if (
                file_path.is_file()
                and file_path.suffix.lower() in {".jpg", ".jpeg", ".png"}
            ):
                image_paths.append(str(file_path))
                image_labels.append(label)

    train_paths, val_paths, train_labels, val_labels = train_test_split(
        image_paths,
        image_labels,
        test_size=0.2,
        random_state=SEED,
        stratify=image_labels,
    )

    print("Training images:", len(train_paths))
    print("Validation images:", len(val_paths))
    print("Class order:", CLASS_NAMES)

    print("Training Fresh:", sum(label == 0 for label in train_labels))
    print("Training Rotten:", sum(label == 1 for label in train_labels))

    print("Validation Fresh:", sum(label == 0 for label in val_labels))
    print("Validation Rotten:", sum(label == 1 for label in val_labels))

    def load_image(path, label):
        image = tf.io.read_file(path)
        image = tf.io.decode_image(
            image,
            channels=3,
            expand_animations=False,
        )
        image.set_shape([None, None, 3])
        image = tf.image.resize(image, IMAGE_SIZE)
        image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
        return image, label

    train_ds = tf.data.Dataset.from_tensor_slices(
        (train_paths, train_labels)
    )
    train_ds = train_ds.shuffle(
        len(train_paths),
        seed=SEED,
    )
    train_ds = train_ds.map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE,
    )
    train_ds = train_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    val_ds = tf.data.Dataset.from_tensor_slices(
        (val_paths, val_labels)
    )
    val_ds = val_ds.map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE,
    )
    val_ds = val_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    # --------------------------------------------------
    # 4. CALCULATE CLASS WEIGHTS
    # --------------------------------------------------

    train_labels_array = np.array(train_labels)

    class_weights_array = compute_class_weight(
        class_weight="balanced",
        classes=np.arange(len(CLASS_NAMES)),
        y=train_labels_array,
    )

    class_weights = {
        i: float(weight)
        for i, weight in enumerate(class_weights_array)
    }

    print(
        "Training image counts:",
        np.bincount(
            train_labels_array,
            minlength=len(CLASS_NAMES),
        ).tolist(),
    )
    print("Class weights:", class_weights)

    # --------------------------------------------------
    # 5. BUILD MOBILENETV2 MODEL
    # --------------------------------------------------

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

    outputs = layers.Dense(
        len(CLASS_NAMES),
        activation="softmax",
    )(x)

    model = models.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=0.001
        ),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )

    model.summary()

    # --------------------------------------------------
    # 6. SAVE THE BEST MODEL
    # --------------------------------------------------

    callbacks = [
        ModelCheckpoint(
            filepath=str(MODEL_PATH),
            monitor="val_loss",
            save_best_only=True,
            verbose=1,
        ),
        EarlyStopping(
            monitor="val_loss",
            patience=3,
            restore_best_weights=True,
            verbose=1,
        ),
    ]

    # --------------------------------------------------
    # 7. TRAIN
    # --------------------------------------------------

    print("\nStarting Potato model training...")

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    # --------------------------------------------------
    # 8. EVALUATE VALIDATION PERFORMANCE
    # --------------------------------------------------

    # Confirm that both classes exist in validation
    print("\nValidation label counts:")
    print("Fresh:", sum(label == 0 for label in val_labels))
    print("Rotten:", sum(label == 1 for label in val_labels))

    assert 0 in val_labels, "Validation set has no Fresh potatoes!"
    assert 1 in val_labels, "Validation set has no Rotten potatoes!"

    best_model = tf.keras.models.load_model(MODEL_PATH)

    y_true = np.concatenate([
        labels.numpy()
        for _, labels in val_ds
    ])

    probabilities = best_model.predict(val_ds, verbose=1)
    y_pred = np.argmax(probabilities, axis=1)

    print("\nValidation classification report:")

    print(
        classification_report(
            y_true,
            y_pred,
            labels=[0, 1],
            target_names=["Fresh", "Rotten"],
            zero_division=0,
        )
    )

    print("Validation confusion matrix:")
    print(confusion_matrix(y_true, y_pred, labels=[0, 1]))

    # --------------------------------------------------
    # 9. SAVE MODEL METADATA
    # --------------------------------------------------

    metadata = {
        "produce": "Potato",
        "class_names": ["Fresh", "Rotten"],
        "folder_to_label": {
            "freshpotato": 0,
            "rottenpotato": 1,
        },
        "image_size": list(IMAGE_SIZE),
        "preprocessing": "mobilenet_v2_preprocess_input",
        "validation_split": 0.2,
        "seed": SEED,
    }

    METADATA_PATH.write_text(
        json.dumps(metadata, indent=2),
        encoding="utf-8",
    )

    print("\nPotato training completed.")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Metadata saved to: {METADATA_PATH}")


if __name__ == "__main__":
    main()