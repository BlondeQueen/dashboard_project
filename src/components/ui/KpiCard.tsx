interface KpiCardProps {
  title: string;
  value: number;
  description: string;
  color: "indigo" | "yellow" | "green" | "red";
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-200",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

export default function KpiCard({
  title,
  value,
  description,
  color,
}: KpiCardProps) {
  const colors = colorMap[color];
  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-6`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-4xl font-bold mt-2 ${colors.text}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}
