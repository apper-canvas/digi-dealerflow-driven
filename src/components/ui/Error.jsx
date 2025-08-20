import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-full blur-xl opacity-60"></div>
        <div className="relative bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-full border border-red-200">
          <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-600" />
        </div>
      </div>
      
      <div className="mt-6 text-center space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">
          Oops! Something went wrong
        </h3>
        <p className="text-slate-600 max-w-md">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center space-x-2 mt-4"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          If the problem persists, please contact support
        </p>
      </div>
    </div>
  );
};

export default Error;