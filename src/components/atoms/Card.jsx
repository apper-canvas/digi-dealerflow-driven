import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className = "",
  hover = false,
  gradient = false,
  ...props 
}, ref) => {
  const baseClasses = cn(
    "bg-surface rounded-lg shadow-md border border-slate-100 p-6",
    "backdrop-blur-sm bg-white/95",
    hover && "transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
    gradient && "bg-gradient-to-br from-white to-slate-50",
    className
  );

  return (
    <div ref={ref} className={baseClasses} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;