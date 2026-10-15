export type TomatoCondition = 'Fresh' | 'Aging' | 'Spoiled';
export type PotatoCondition = 'Fresh' | 'Rotten';
export type ProduceCondition = TomatoCondition | PotatoCondition;
export type ActiveProduce = 'Tomato' | 'Potato';
export type PriorityLevel = 'NORMAL' | 'HIGH' | 'REMOVE';
export type ActionType = 'REGULAR_STOCK' | 'SELL_FIRST' | 'SEPARATE_STOCK' | 'MANUAL_INSPECT';

export interface TomatoPredictionProbabilities {
  Fresh: number;
  Aging: number;
  Spoiled: number;
}

export interface PotatoPredictionProbabilities {
  Fresh: number;
  Rotten: number;
}

interface PredictionResultBase {
  confidence: number;
  confidence_percentage: number;
  is_low_confidence: boolean;
  priority: PriorityLevel;
  action: ActionType;
  recommendation: string;
  action_instruction: string;
  reason: string;
  analysis_timestamp?: string;
  is_demo_mode?: boolean;
  image_preview?: string;
  warning?: string;
}

export interface TomatoPredictionResult extends PredictionResultBase {
  produce: 'Tomato';
  prediction: TomatoCondition;
  probabilities?: TomatoPredictionProbabilities;
}

export interface PotatoPredictionResult extends PredictionResultBase {
  produce: 'Potato';
  prediction: PotatoCondition;
  probabilities: PotatoPredictionProbabilities;
}

export type PredictionResult = TomatoPredictionResult | PotatoPredictionResult;

export interface InventoryItem {
  id: string;
  produce: string;
  variety?: string;
  quantity: number;
  unit: string;
  condition: ProduceCondition;
  priority: PriorityLevel;
  action: ActionType;
  confidence_percentage: number;
  scanned_at: string;
  notes?: string;
  image_url?: string;
}

export interface ScanHistoryRecord {
  id: string;
  date: string;
  produce: string;
  prediction: ProduceCondition;
  confidence_percentage: number;
  action: string;
  priority: PriorityLevel;
  recommendation: string;
  is_low_confidence: boolean;
  image_preview?: string;
}
