interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));
  const color =
    safeValue >= 100
      ? "bg-emerald-500"
      : safeValue >= 50
      ? "bg-emerald-500"
      : safeValue >= 25
      ? "bg-amber-400"
      : "bg-rose-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-500 w-9 text-right tabular-nums">{safeValue}%</span>
    </div>
  );
}
