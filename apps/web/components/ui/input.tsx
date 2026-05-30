import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  containerClassName?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, containerClassName = "", className = "", id, type = "text", ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/60 select-none cursor-pointer"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={`w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white font-sans placeholder-white/20 hover:border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150 outline-none ${
            error ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
