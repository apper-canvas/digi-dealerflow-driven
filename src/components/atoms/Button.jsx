import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  className = "",
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus-visible:ring-primary-500 shadow-md hover:shadow-lg transform hover:scale-105",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400 shadow-sm hover:shadow-md",
    ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus-visible:ring-red-500 shadow-md hover:shadow-lg"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  return (
    <button
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className={cn("animate-spin", iconPosition === "right" ? "ml-2" : "mr-2")} size={iconSize[size]} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} className="mr-2" size={iconSize[size]} />
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} className="ml-2" size={iconSize[size]} />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;