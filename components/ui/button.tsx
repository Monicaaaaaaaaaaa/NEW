import { cn } from "@/lib/utils";
import { LucideIcon, Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

const contentStyle = {
  base: "inline-flex items-center justify-center gap-2 font-medium text-sm transition-all disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  variant: {
    primary: "bg-primary text-white hover:opacity-90",
    danger: "bg-danger text-white hover:opacity-90",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    "outline-primary": "border border-primary bg-white text-primary hover:bg-primary/5",
    "outline-danger": "border border-danger bg-white text-danger hover:bg-danger/5",
    "outline-secondary": "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  },
  size: {
    xs: "px-2.5 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
    xl: "px-6 py-3 text-base",
  },
  rounded: {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },
};

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: keyof typeof contentStyle.variant;
  rounded?: keyof typeof contentStyle.rounded;
  size?: keyof typeof contentStyle.size;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

export default function Button({
  title,
  icon,
  iconPosition = "left",
  variant = "primary",
  rounded = "lg",
  size = "md",
  fullWidth = false,
  isLoading = false,
  loadingText,
  className = "",
  children,
  disabled,
  ...props
}: IButton) {
  const Icon = icon;
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        contentStyle.base,
        contentStyle.variant[variant],
        contentStyle.rounded[rounded],
        contentStyle.size[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          <span>{loadingText ?? title ?? children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={15} />}
          {(title || children) && <span>{title ?? children}</span>}
          {Icon && iconPosition === "right" && <Icon size={15} />}
        </>
      )}
    </button>
  );
}