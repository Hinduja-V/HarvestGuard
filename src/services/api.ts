
import type { ActiveProduce, PredictionResult } from '../types';

export interface PredictPayload {
  produce: ActiveProduce;
  image: string;
  fileName?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isOneOf<const Values extends readonly string[]>(
  value: unknown,
  values: Values,
): value is Values[number] {
  return typeof value === 'string' && values.some((item) => item === value);
}

function hasProbabilities(
  value: unknown,
  classes: readonly string[],
): boolean {
  return (
    isRecord(value) &&
    classes.every(
      (className) =>
        typeof value[className] === 'number' &&
        Number.isFinite(value[className]),
    )
  );
}

function isPredictionResult(value: unknown): value is PredictionResult {
  if (
    !isRecord(value) ||
    typeof value.confidence !== 'number' ||
    typeof value.confidence_percentage !== 'number' ||
    typeof value.is_low_confidence !== 'boolean' ||
    typeof value.recommendation !== 'string' ||
    typeof value.action_instruction !== 'string' ||
    typeof value.reason !== 'string' ||
    !isOneOf(value.priority, ['NORMAL', 'HIGH', 'REMOVE'] as const) ||
    !isOneOf(
      value.action,
      ['REGULAR_STOCK', 'SELL_FIRST', 'SEPARATE_STOCK', 'MANUAL_INSPECT'] as const,
    )
  ) {
    return false;
  }

  if (value.produce === 'Tomato') {
    return (
      isOneOf(value.prediction, ['Fresh', 'Aging', 'Spoiled'] as const) &&
      (value.probabilities === undefined ||
        hasProbabilities(value.probabilities, ['Fresh', 'Aging', 'Spoiled']))
    );
  }

  return (
    value.produce === 'Potato' &&
    isOneOf(value.prediction, ['Fresh', 'Rotten'] as const) &&
    hasProbabilities(value.probabilities, ['Fresh', 'Rotten'])
  );
}

export async function analyzeProduce(
  payload: PredictPayload
): Promise<PredictionResult> {
  if (!payload.image) {
    throw new Error('No image data was provided. Please upload the image again.');
  }

  const imageResponse = await fetch(payload.image);
  if (!imageResponse.ok) {
    throw new Error(`Could not read the selected ${payload.produce.toLowerCase()} image.`);
  }

  const imageBlob = await imageResponse.blob();
  if (imageBlob.size === 0) {
    throw new Error('The selected image is empty. Please upload it again.');
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(imageBlob.type)) {
    throw new Error('Please upload a valid JPEG, PNG, or WebP image.');
  }

  const formData = new FormData();
  const extension = imageBlob.type === 'image/png'
    ? 'png'
    : imageBlob.type === 'image/webp'
    ? 'webp'
    : 'jpg';
  formData.append(
    'file',
    imageBlob,
    payload.fileName || `${payload.produce.toLowerCase()}.${extension}`,
  );
  formData.append('produce', payload.produce);

  const response = await fetch('/api/predict', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText;
    try {
      const body: unknown = JSON.parse(responseText);
      if (isRecord(body)) {
        if (typeof body.detail === 'string') message = body.detail;
        else if (typeof body.message === 'string') message = body.message;
      }
    } catch {
      // Keep the plain-text response as the user-facing error.
    }
    throw new Error(`Prediction failed (${response.status}): ${message}`);
  }

  const result: unknown = await response.json();
  if (!isPredictionResult(result) || result.produce !== payload.produce) {
    throw new Error('The prediction service returned an invalid response.');
  }
  return result;
}

export async function checkBackendHealth() {
  try {
    const response = await fetch('/api/health');
    return await response.json();
  } catch {
    return { status: 'offline' };
  }
}
