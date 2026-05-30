import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-semibold rounded-xl cursor-pointer transition-all duration-200 outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  // Variant classes
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(108,99,255,0.25)] hover:shadow-[0_0_30px_rgba(108,99,255,0.45)] hover:-translate-y-0.5",
    secondary:
      "bg-[#16213e]/80 text-white border border-white/10 hover:border-primary hover:text-primary hover:-translate-y-0.5 backdrop-blur-md",
    outline:
      "bg-transparent text-white border border-white/10 hover:bg-white/5 hover:border-white/20",
    ghost: "bg-transparent text-white/70 hover:bg-white/5 hover:text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2.5",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {!isLoading && icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
};
