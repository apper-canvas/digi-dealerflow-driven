import React from "react";
import VehicleCard from "@/components/molecules/VehicleCard";
import Empty from "@/components/ui/Empty";

const VehicleGrid = ({ vehicles, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg h-80"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Empty
        icon="Car"
        title="No vehicles found"
        description="Start building your inventory by adding your first vehicle."
        actionText="Add Vehicle"
        onAction={() => window.location.href = "/inventory/add"}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.Id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default VehicleGrid;