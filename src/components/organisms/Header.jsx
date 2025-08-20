import React from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMobileMenuClick }) => {
  const location = useLocation();
  
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/inventory":
        return "Vehicle Inventory";
      case "/inventory/add":
        return "Add New Vehicle";
      case "/leads":
        return "Lead Management";
      case "/deals":
        return "Deal Desk";
      case "/reports":
        return "Analytics & Reports";
      case "/settings":
        return "Settings";
      default:
        if (pathname.includes("/inventory/")) return "Vehicle Details";
        if (pathname.includes("/leads/")) return "Lead Details";
        return "DealerFlow Pro";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {getPageTitle(location.pathname)}
            </h1>
            <p className="text-sm text-slate-500 hidden sm:block">
              Manage your dealership operations efficiently
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">Main Branch</p>
              <p className="text-xs text-slate-500">Downtown Location</p>
            </div>
            <ApperIcon name="MapPin" className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;