import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FilterDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select filter",
  label = "Filter"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-between min-w-[150px]"
      >
        <span>{value?.label || placeholder}</span>
        <ApperIcon name="ChevronDown" className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="p-2 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-700">{label}</p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FilterDropdown;