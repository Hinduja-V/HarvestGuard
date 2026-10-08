import { PredictionResult } from '../types';

export interface PredictPayload {
  produce: string;
  image_base64?: string;
  demo_preset?: 'fresh' | 'aging' | 'spoiled' | 'low_confidence';
  is_demo_mode?: boolean;
}

export async function analyzeProduce(payload: PredictPayload): Promise<PredictionResult> {
  // Validate produce client-side first
  if (payload.produce.trim().toLowerCase() !== 'tomato') {
    throw new Error('The current MVP model supports tomato only.');
  }

  if (!payload.image_base64 && !payload.demo_preset) {
    throw new Error('Please upload a produce image first.');
  }

  try {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      if (errorData && errorData.message) {
        throw new Error(errorData.message);
      }
      throw new Error(`AI prediction request failed (HTTP ${res.status}).`);
    }

    const data: PredictionResult = await res.json();
    return data;
  } catch (err: any) {
    // Check if network error / server unreachable
    if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
      throw new Error('AI service is currently unavailable. Please start the FastAPI backend and try again.');
    }
    throw err;
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return { status: 'offline' };
  }
}
