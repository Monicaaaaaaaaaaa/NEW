import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

const contentStyle = {
  base: "flex items-center gap-2 text-white text-sm font-medium",
  variant: {
    primary: "bg-primary",
    danger: "bg-danger",
    "outline-primary": "border border-primary bg-white text-primary",
  },
  size: {
    lg: "px-5 py-2",
    sm: "px-3 py-2",
  },
  rounded: {
    full: "rounded-full",
    lg: "rounded-lg",
    sm: "rounded-10",
  },
};

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  title: string;
  variant?: keyof typeof contentStyle.variant;
  rounded?: keyof typeof contentStyle.rounded;
  size?: keyof typeof contentStyle.size;
  className?: string;
}

export default function Button({
  icon,
  title,
  variant = "primary",
  className = "",
  rounded = "sm",
  size = "lg",
  ...props
}: IButton) {
  const Icon = icon;
  return (
    <button
      className={cn(
        contentStyle.base,
        contentStyle.variant[variant],
        contentStyle.rounded[rounded],
        contentStyle.size[size],
        className,
      )}
      {...props}
    >
      <span>
        <Icon size={16} />
      </span>
      <span>{title}</span>
    </button>
  );
}
