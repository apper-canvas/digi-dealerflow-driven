import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Package",
  title = "No items found",
  description = "Get started by adding your first item.",
  actionText = "Add Item",
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full blur-2xl opacity-40"></div>
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-full border border-slate-200">
          <ApperIcon name={icon} className="h-16 w-16 text-slate-400" />
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-slate-600 max-w-md">
          {description}
        </p>
        
        {onAction && actionText && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center space-x-2 mt-6"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-4 opacity-20">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export default Empty;