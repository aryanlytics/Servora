import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled" | "info" | "default";
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase select-none";

  const variantClasses = {
    default: "bg-white/10 text-white/80",
    pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    accepted: "bg-primary/15 text-primary border border-primary/20",
    in_progress: "bg-secondary/15 text-secondary border border-secondary/20",
    completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
    info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
