import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverEffect?: boolean;
  glassmorphic?: boolean;
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  glassmorphic = true,
  ...props
}) => {
  const baseClasses = "rounded-2xl border border-white/5 p-6 transition-all duration-300";
  const glassClasses = glassmorphic
    ? "bg-gradient-to-br from-[#1a1a2e]/85 to-[#16213e]/40 backdrop-blur-xl"
    : "bg-[#1a1a2e]";
  const hoverClasses = hoverEffect
    ? "hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
    : "";

  return (
    <div
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`flex flex-col gap-1.5 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <h3 className={`text-xl font-bold text-white tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <p className={`text-sm text-white/50 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => <div className={`text-white/80 ${className}`} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`flex items-center mt-6 pt-4 border-t border-white/5 ${className}`} {...props}>
    {children}
  </div>
);
