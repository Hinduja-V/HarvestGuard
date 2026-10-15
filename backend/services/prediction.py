"""
HarvestGuard AI - Prediction & Decision Engine
Evaluates classification probabilities and generates Sell-First inventory recommendations.
"""

from typing import Any, Dict

CLASSES = ["Fresh", "Aging", "Spoiled"]
POTATO_CLASSES = ["Fresh", "Rotten"]
CONFIDENCE_THRESHOLD = 0.60

DECISION_MATRIX = {
    "Fresh": {
        "priority": "NORMAL",
        "action": "REGULAR_STOCK",
        "badge_color": "emerald",
        "recommendation": "Regular Selling",
        "action_instruction": "Keep with normal stock. Produce is in optimal condition.",
        "reason": "Visual inspection indicates smooth, firm skin and vibrant pigmentation."
    },
    "Aging": {
        "priority": "HIGH",
        "action": "SELL_FIRST",
        "badge_color": "amber",
        "recommendation": "SELL FIRST",
        "action_instruction": "Prioritize this produce for sale before fresher stock.",
        "reason": "Visible signs of aging were detected by the image classification model (slight softening or surface wrinkles)."
    },
    "Spoiled": {
        "priority": "REMOVE",
        "action": "SEPARATE_STOCK",
        "badge_color": "rose",
        "recommendation": "Remove from sellable stock",
        "action_instruction": "Separate and inspect the item immediately to protect adjacent inventory.",
        "reason": "Significant degradation, deep blemishes, or fungal discoloration detected."
    }
}


POTATO_DECISION_MATRIX = {
    "Fresh": {
        "priority": "NORMAL",
        "action": "REGULAR_STOCK",
        "badge_color": "emerald",
        "recommendation": "Regular Stock",
        "action_instruction": "Keep with regular stock. The potato is classified as fresh.",
        "reason": "Visual inspection indicates the potato is in good condition."
    },
    "Rotten": {
        "priority": "REMOVE",
        "action": "SEPARATE_STOCK",
        "badge_color": "rose",
        "recommendation": "Remove from sellable stock",
        "action_instruction": "Remove this potato from sellable stock and separate it for inspection.",
        "reason": "The potato model classified this item as rotten."
    }
}


def _build_prediction_result(
    produce: str,
    predicted_class: str,
    confidence_score: float,
    class_probabilities: Dict[str, float],
    decision: Dict[str, str],
) -> Dict[str, Any]:
    is_low_confidence = confidence_score < CONFIDENCE_THRESHOLD
    response = {
        "produce": produce,
        "prediction": predicted_class,
        "confidence": round(float(confidence_score), 4),
        "confidence_percentage": int(round(confidence_score * 100)),
        "is_low_confidence": is_low_confidence,
        "priority": decision["priority"],
        "action": decision["action"],
        "recommendation": decision["recommendation"],
        "action_instruction": decision["action_instruction"],
        "reason": decision["reason"],
        "probabilities": class_probabilities,
        "model_architecture": "MobileNetV2 Transfer Learning (TensorFlow/Keras)",
        "disclaimer": "Model confidence indicates prediction confidence, not an exact measurement of shelf life or food safety."
    }

    if is_low_confidence:
        response["warning"] = "Low confidence result. The AI is not confident enough in this image. Please capture a clearer image with better lighting or inspect the produce manually."

    return response


def generate_decision(
    produce: str,
    predicted_class: str,
    confidence_score: float,
    class_probabilities: Dict[str, float],
) -> Dict[str, Any]:
    """
    Applies the produce-specific inventory decision to a model prediction.
    """
    normalized_produce = produce.strip().lower()
    if normalized_produce == "tomato":
        canonical_produce = "Tomato"
        decision_matrix = DECISION_MATRIX
        allowed_classes = CLASSES
    elif normalized_produce == "potato":
        canonical_produce = "Potato"
        decision_matrix = POTATO_DECISION_MATRIX
        allowed_classes = POTATO_CLASSES
    else:
        raise ValueError(f"Unsupported produce type: {produce}")

    if predicted_class not in allowed_classes:
        raise ValueError(
            f"Unsupported {canonical_produce.lower()} prediction class: "
            f"{predicted_class}"
        )

    return _build_prediction_result(
        produce=canonical_produce,
        predicted_class=predicted_class,
        confidence_score=confidence_score,
        class_probabilities=class_probabilities,
        decision=decision_matrix[predicted_class],
    )


def generate_potato_decision(
    predicted_class: str,
    confidence_score: float,
    class_probabilities: Dict[str, float],
) -> Dict[str, Any]:
    """Keep the potato-specific decision helper available to existing callers."""
    return generate_decision(
        produce="Potato",
        predicted_class=predicted_class,
        confidence_score=confidence_score,
        class_probabilities=class_probabilities,
    )
