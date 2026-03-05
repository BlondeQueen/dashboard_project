interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));
  const color =
    safeValue >= 100
      ? "bg-green-500"
      : safeValue >= 50
      ? "bg-indigo-500"
      : safeValue >= 25
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-9 text-right">{safeValue}%</span>
    </div>
  );
}
