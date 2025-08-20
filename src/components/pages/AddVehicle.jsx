import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VinScanner from "@/components/organisms/VinScanner";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { vehicleService } from "@/services/api/vehicleService";
import { toast } from "react-toastify";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [showVinScanner, setShowVinScanner] = useState(false);
  const [formData, setFormData] = useState({
    vin: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    condition: "Good",
    purchasePrice: "",
    askingPrice: "",
    bodyType: "",
    transmission: "",
    fuelType: "",
    color: "",
    location: "",
    features: "",
    description: "",
    photos: []
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVinFound = (vehicleData) => {
    setFormData(prev => ({
      ...prev,
      ...vehicleData,
      features: vehicleData.features?.join(", ") || ""
    }));
    setShowVinScanner(false);
    toast.success("Vehicle data populated from VIN!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert features string to array
      const features = formData.features
        .split(",")
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        purchasePrice: parseFloat(formData.purchasePrice),
        askingPrice: parseFloat(formData.askingPrice),
        marketValue: parseFloat(formData.askingPrice) * 0.95, // Mock market value calculation
        features,
        photos: formData.photos.length > 0 ? formData.photos : [
          "https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?w=800&h=600&fit=crop"
        ]
      };

      const newVehicle = await vehicleService.create(vehicleData);
      toast.success("Vehicle added successfully!");
      navigate(`/inventory/${newVehicle.Id}`);
    } catch (error) {
      toast.error("Failed to add vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.vin && formData.year && formData.make && 
                     formData.model && formData.purchasePrice && formData.askingPrice;

  if (showVinScanner) {
    return (
      <div className="max-w-2xl mx-auto pt-12">
        <VinScanner
          onVehicleFound={handleVinFound}
          onClose={() => setShowVinScanner(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/inventory")}>
            <ApperIcon name="ArrowLeft" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Vehicle</h1>
            <p className="text-slate-600">Add a vehicle to your inventory</p>
          </div>
        </div>
        
        <Button onClick={() => setShowVinScanner(true)} variant="secondary">
          <ApperIcon name="ScanLine" />
          Scan VIN
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="VIN Number*"
              value={formData.vin}
              onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
              maxLength={17}
              className="font-mono"
              placeholder="17-character VIN"
            />
            <Input
              label="Year*"
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              min="1900"
              max="2025"
              placeholder="2023"
            />
            <Input
              label="Make*"
              value={formData.make}
              onChange={(e) => handleInputChange("make", e.target.value)}
              placeholder="Honda"
            />
            <Input
              label="Model*"
              value={formData.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              placeholder="Accord"
            />
            <Input
              label="Trim"
              value={formData.trim}
              onChange={(e) => handleInputChange("trim", e.target.value)}
              placeholder="LX, EX, Sport"
            />
            <Input
              label="Mileage"
              type="number"
              value={formData.mileage}
              onChange={(e) => handleInputChange("mileage", e.target.value)}
              placeholder="25000"
            />
          </div>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Condition*
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className="input-field"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <Input
              label="Body Type"
              value={formData.bodyType}
              onChange={(e) => handleInputChange("bodyType", e.target.value)}
              placeholder="Sedan, SUV, Truck"
            />
            <Input
              label="Transmission"
              value={formData.transmission}
              onChange={(e) => handleInputChange("transmission", e.target.value)}
              placeholder="CVT Automatic"
            />
            <Input
              label="Fuel Type"
              value={formData.fuelType}
              onChange={(e) => handleInputChange("fuelType", e.target.value)}
              placeholder="Gasoline, Hybrid, Electric"
            />
            <Input
              label="Color"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              placeholder="Silver Metallic"
            />
            <Input
              label="Lot Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Lot A-15"
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pricing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Purchase Price*"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
              placeholder="25000.00"
            />
            <Input
              label="Asking Price*"
              type="number"
              step="0.01"
              value={formData.askingPrice}
              onChange={(e) => handleInputChange("askingPrice", e.target.value)}
              placeholder="28900.00"
            />
          </div>
          
          {formData.purchasePrice && formData.askingPrice && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Estimated Gross Margin:</span>
                <div className="text-right">
                  <span className="font-bold text-green-800">
                    ${(parseFloat(formData.askingPrice) - parseFloat(formData.purchasePrice)).toLocaleString()}
                  </span>
                  <span className="text-sm text-green-700 ml-2">
                    ({(((parseFloat(formData.askingPrice) - parseFloat(formData.purchasePrice)) / parseFloat(formData.purchasePrice)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Additional Information */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Features & Options
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => handleInputChange("features", e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Backup Camera, Bluetooth, Cruise Control, Power Windows (comma separated)"
              />
              <p className="text-xs text-slate-500 mt-1">Separate features with commas</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Clean CARFAX, single owner vehicle with excellent maintenance records..."
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/inventory")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            loading={loading}
            className="flex-1"
          >
            Add Vehicle
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;