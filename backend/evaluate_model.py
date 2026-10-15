
from pathlib import Path
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from sklearn.metrics import classification_report, confusion_matrix

PROJECT_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(r"C:\Users\HP\Downloads\FGrade-main\FGrade-main\data")
TEST_DIR = DATA_DIR / "Testing_set"
MODEL_PATH = PROJECT_DIR / "model" / "freshness_model.keras"
METADATA_PATH = PROJECT_DIR / "model" / "freshness_metadata.json"

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
GRADE_TO_CATEGORY = {
    0: 0, 1: 0, 2: 0,
    3: 1, 4: 1, 5: 1, 6: 1,
    7: 2, 8: 2, 9: 2,
}
CATEGORY_NAMES = ["Fresh", "Aging", "Spoiled"]


def main():
    if not TEST_DIR.is_dir():
        raise FileNotFoundError(f"Testing dataset not found: {TEST_DIR}")
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

    with open(METADATA_PATH, "r", encoding="utf-8") as file:
        metadata = json.load(file)

    print("Loading testing dataset...")
    test_ds = tf.keras.utils.image_dataset_from_directory(
        TEST_DIR,
        labels="inferred",
        label_mode="int",
        class_names=[str(i) for i in range(10)],
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False,
    )

    def prepare(images, grades):
        images = preprocess_input(images)
        categories = tf.gather(
            tf.constant([GRADE_TO_CATEGORY[i] for i in range(10)]),
            grades,
        )
        return images, categories

    test_ds = test_ds.map(prepare).prefetch(tf.data.AUTOTUNE)

    print("Loading trained model...")
    model = tf.keras.models.load_model(MODEL_PATH)

    print("Evaluating on test images...")
    loss, accuracy = model.evaluate(test_ds, verbose=1)
    print(f"\nTest loss: {loss:.4f}")
    print(f"Test accuracy: {accuracy:.2%}")

    true_labels = np.concatenate(
        [labels.numpy() for _, labels in test_ds], axis=0
    )
    probabilities = model.predict(test_ds, verbose=1)
    predicted_labels = np.argmax(probabilities, axis=1)

    print("\nClassification report:")
    print(classification_report(
        true_labels,
        predicted_labels,
        labels=[0, 1, 2],
        target_names=CATEGORY_NAMES,
        zero_division=0,
    ))

    print("Confusion matrix (rows = actual, columns = predicted):")
    print(confusion_matrix(true_labels, predicted_labels, labels=[0, 1, 2]))


if __name__ == "__main__":
    main()