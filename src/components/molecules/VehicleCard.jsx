import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/inventory/${vehicle.Id}`);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Available": return "success";
      case "Pending": return "warning";
      case "Sold": return "default";
      default: return "default";
    }
  };

  const getDaysColor = (days) => {
    if (days < 30) return "text-green-600";
    if (days < 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card hover onClick={handleCardClick} className="p-0 overflow-hidden">
      <div className="relative">
        <img
          src={vehicle.photos?.[0] || "https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?w=400&h=300&fit=crop"}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="text-lg font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm opacity-90">{vehicle.trim}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            ${vehicle.askingPrice?.toLocaleString()}
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Market Value</p>
            <p className="text-lg font-semibold text-slate-700">
              ${vehicle.marketValue?.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Gauge" className="h-4 w-4 text-slate-500" />
            <span>{vehicle.mileage?.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="h-4 w-4 text-slate-500" />
            <span className={getDaysColor(vehicle.daysInInventory)}>
              {vehicle.daysInInventory} days
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="MapPin" className="h-4 w-4 text-slate-500" />
            <span>{vehicle.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Fuel" className="h-4 w-4 text-slate-500" />
            <span>{vehicle.fuelType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-sm">
            <span className="text-slate-500">Condition: </span>
            <span className="font-medium">{vehicle.condition}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500">Margin: </span>
            <span className="font-bold text-green-600">
              ${(vehicle.askingPrice - vehicle.purchasePrice).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;