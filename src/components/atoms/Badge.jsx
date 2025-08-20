import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className = ""
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full border";
  
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border-primary-300",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    hot: "bg-gradient-to-r from-orange-100 to-red-200 text-red-800 border-red-300 animate-pulse-blue",
    warm: "bg-gradient-to-r from-amber-100 to-orange-200 text-orange-800 border-orange-300",
    cold: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

export default Badge;