import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConfidenceMeterProps {
  confidencePercentage: number;
  isLowConfidence?: boolean;
}

export default function ConfidenceMeter({
  confidencePercentage,
  isLowConfidence = false
}: ConfidenceMeterProps) {
  // Determine color based on confidence level
  const barColor = isLowConfidence
    ? 'bg-amber-500'
    : confidencePercentage >= 85
    ? 'bg-emerald-600'
    : 'bg-emerald-500';

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Model Confidence</span>
        <span className="font-mono tabular-nums font-semibold text-slate-900 text-base">
          {confidencePercentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div 
        className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80"
        role="progressbar"
        aria-valuenow={confidencePercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="AI Model Confidence Percentage"
      >
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, confidencePercentage))}%` }}
        />
      </div>

      <div className="flex items-start gap-1.5 text-xs text-slate-500 pt-1">
        {isLowConfidence ? (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-amber-800">
              Low model confidence. Image characteristics were ambiguous. Inspect manually.
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Confidence indicates visual classification certainty, not chemical or shelf-life measurement.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
