const AVATAR_GRADIENTS = [
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-rose-500 to-rose-600",
  "from-amber-400 to-amber-500",
  "from-teal-500 to-teal-600",
  "from-blue-500 to-blue-600",
  "from-pink-500 to-pink-600",
  "from-orange-400 to-orange-500",
];

function getGradient(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash += key.charCodeAt(i);
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

function getInitials(fullName: string | null, email: string): string {
  if (fullName) {
    return fullName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
  return email[0].toUpperCase();
}

interface UserAvatarProps {
  fullName: string | null;
  email: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-11 h-11 text-sm",
} as const;

export default function UserAvatar({
  fullName,
  email,
  size = "md",
}: UserAvatarProps) {
  const key = fullName || email;
  const gradient = getGradient(key);
  const initials = getInitials(fullName, email);

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}
    >
      <span className="text-white font-bold leading-none">{initials}</span>
    </div>
  );
}
