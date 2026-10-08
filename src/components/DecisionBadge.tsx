import { ProduceCondition, PriorityLevel } from '../types';

interface DecisionBadgeProps {
  condition: ProduceCondition;
  priority?: PriorityLevel;
  size?: 'sm' | 'md' | 'lg';
}

export default function DecisionBadge({
  condition,
  priority,
  size = 'md'
}: DecisionBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  if (condition === 'Fresh') {
    return (
      <span className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses[size]}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <span>Fresh</span>
        {priority && (
          <span className="text-emerald-700/80 font-normal">· Priority Normal</span>
        )}
      </span>
    );
  }

  if (condition === 'Aging') {
    return (
      <span className={`inline-flex items-center rounded-md bg-amber-50 text-amber-900 border border-amber-300 ${sizeClasses[size]}`}>
        <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
        <span className="font-semibold">Aging</span>
        {priority && (
          <span className="text-amber-800 font-bold">· SELL FIRST</span>
        )}
      </span>
    );
  }

  // Spoiled
  return (
    <span className={`inline-flex items-center rounded-md bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses[size]}`}>
      <span className="w-2 h-2 rounded-full bg-rose-600" />
      <span className="font-semibold">Spoiled</span>
      {priority && (
        <span className="text-rose-700 font-medium">· REMOVE</span>
      )}
    </span>
  );
}
