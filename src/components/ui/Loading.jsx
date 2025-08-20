import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-primary-200 to-primary-300 rounded-md w-32"></div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
                <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-4 w-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded flex-1"></div>
                <div className="h-4 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card space-y-4">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-40"></div>
          <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;