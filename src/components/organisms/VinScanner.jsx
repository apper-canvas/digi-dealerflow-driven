import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { vehicleService } from "@/services/api/vehicleService";
import { toast } from "react-toastify";

const VinScanner = ({ onVehicleFound, onClose }) => {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState("manual"); // manual or camera

  const handleVinLookup = async () => {
    if (!vin.trim()) {
      toast.error("Please enter a VIN number");
      return;
    }

    if (vin.length !== 17) {
      toast.error("VIN must be 17 characters long");
      return;
    }

    setLoading(true);
    try {
      const vehicleData = await vehicleService.searchByVin(vin.trim());
      if (vehicleData) {
        toast.success("Vehicle data found!");
        onVehicleFound(vehicleData);
      } else {
        toast.error("No vehicle data found for this VIN");
      }
    } catch (error) {
      toast.error("Error looking up VIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanCamera = () => {
    // Mock camera scan - in a real app, this would use camera API
    toast.info("Camera feature would be implemented here");
    // Simulate finding a VIN
    setTimeout(() => {
      const mockVin = "1HGCM82633A654321";
      setVin(mockVin);
      toast.success("VIN scanned successfully!");
    }, 2000);
  };

  return (
    <Card className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full w-fit">
          <ApperIcon name="ScanLine" className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">VIN Scanner</h3>
        <p className="text-slate-600">Scan or enter VIN to auto-populate vehicle data</p>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button
            variant={scanMode === "manual" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setScanMode("manual")}
            className="flex-1"
          >
            <ApperIcon name="Keyboard" className="h-4 w-4" />
            Manual Entry
          </Button>
          <Button
            variant={scanMode === "camera" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setScanMode("camera")}
            className="flex-1"
          >
            <ApperIcon name="Camera" className="h-4 w-4" />
            Camera Scan
          </Button>
        </div>

        {scanMode === "manual" ? (
          <div className="space-y-4">
            <Input
              label="VIN Number"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="font-mono text-center text-lg tracking-wider"
            />
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">
                {vin.length}/17 characters
              </p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(vin.length / 17) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
              <ApperIcon name="Camera" className="h-12 w-12 text-slate-500 mx-auto" />
            </div>
            <p className="text-slate-600 mb-4">Position VIN in camera viewfinder</p>
            <Button onClick={handleScanCamera} disabled={loading}>
              <ApperIcon name="ScanLine" className="h-4 w-4" />
              Start Camera Scan
            </Button>
          </div>
        )}
      </div>

      <div className="flex space-x-3 mt-6">
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleVinLookup}
          disabled={!vin.trim() || vin.length !== 17 || loading}
          loading={loading}
          className="flex-1"
        >
          Lookup VIN
        </Button>
      </div>
    </Card>
  );
};

export default VinScanner;