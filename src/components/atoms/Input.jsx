import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text",
  label,
  error,
  helperText,
  className = "",
  containerClassName = "",
  ...props 
}, ref) => {
  const inputClasses = cn(
    "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder:text-slate-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
    "transition-colors duration-200",
    "bg-white text-slate-900",
    error && "border-red-300 focus:border-red-500 focus:ring-red-500",
    className
  );

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;