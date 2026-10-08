"""
HarvestGuard AI - Prediction & Decision Engine
Evaluates classification probabilities and generates Sell-First inventory recommendations.
"""

from typing import Dict, Any, List

CLASSES = ["Fresh", "Aging", "Spoiled"]
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

def generate_decision(
    produce: str,
    predicted_class: str,
    confidence_score: float,
    class_probabilities: Dict[str, float] = None
) -> Dict[str, Any]:
    """
    Applies the Sell-First Decision Layer to the model prediction.
    """
    if produce.lower() != "tomato":
        return {
            "error": "UNSUPPORTED_PRODUCE",
            "message": f"The current MVP model supports tomato only. {produce} is not yet supported."
        }

    is_low_confidence = confidence_score < CONFIDENCE_THRESHOLD
    meta = DECISION_MATRIX.get(predicted_class, DECISION_MATRIX["Aging"])

    response = {
        "produce": "Tomato",
        "prediction": predicted_class,
        "confidence": round(float(confidence_score), 4),
        "confidence_percentage": int(round(confidence_score * 100)),
        "is_low_confidence": is_low_confidence,
        "priority": meta["priority"],
        "action": meta["action"],
        "recommendation": meta["recommendation"],
        "action_instruction": meta["action_instruction"],
        "reason": meta["reason"],
        "probabilities": class_probabilities or {
            predicted_class: confidence_score
        },
        "model_architecture": "MobileNetV2 Transfer Learning (TensorFlow/Keras)",
        "disclaimer": "Model confidence indicates prediction confidence, not an exact measurement of shelf life or food safety."
    }

    if is_low_confidence:
        response["warning"] = "Low confidence result. The AI is not confident enough in this image. Please capture a clearer image with better lighting or inspect the produce manually."

    return response
