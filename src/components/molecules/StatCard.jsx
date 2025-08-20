import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = "primary",
  gradient = true
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    success: "from-green-500 to-green-600",
    warning: "from-amber-500 to-amber-600",
    danger: "from-red-500 to-red-600",
    slate: "from-slate-500 to-slate-600"
  };

  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-600";
  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";

  return (
    <Card gradient={gradient} hover className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1 text-sm">
              <ApperIcon name={trendIcon} className={`h-4 w-4 ${trendColor}`} />
              <span className={trendColor}>{trendValue}</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
    </Card>
  );
};

export default StatCard;