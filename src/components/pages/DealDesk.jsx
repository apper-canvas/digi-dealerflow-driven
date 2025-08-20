import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { vehicleService } from "@/services/api/vehicleService";
import { leadService } from "@/services/api/leadService";
import { toast } from "react-toastify";

const DealDesk = () => {
  const [deals, setDeals] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    vehicleId: "",
    customerId: "",
    salePrice: "",
    tradeInValue: 0,
    downPayment: "",
    interestRate: 4.9,
    termMonths: 60
  });
  const [financing, setFinancing] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, vehiclesData, leadsData] = await Promise.all([
        dealService.getAll(),
        vehicleService.getAll(),
        leadService.getAll()
      ]);
      setDeals(dealsData);
      setVehicles(vehiclesData);
      setLeads(leadsData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate financing when deal details change
  useEffect(() => {
    if (newDeal.salePrice && newDeal.downPayment && newDeal.interestRate && newDeal.termMonths) {
      const calculateFinancing = async () => {
        try {
          const netPrice = parseFloat(newDeal.salePrice) - parseFloat(newDeal.tradeInValue || 0);
          const result = await dealService.calculateFinancing(
            netPrice,
            parseFloat(newDeal.downPayment),
            parseFloat(newDeal.interestRate),
            parseInt(newDeal.termMonths)
          );
          setFinancing(result);
        } catch (err) {
          console.error("Error calculating financing:", err);
        }
      };
      calculateFinancing();
    } else {
      setFinancing(null);
    }
  }, [newDeal.salePrice, newDeal.downPayment, newDeal.tradeInValue, newDeal.interestRate, newDeal.termMonths]);

  const handleDealChange = (field, value) => {
    setNewDeal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateDeal = async () => {
    try {
      const selectedVehicle = vehicles.find(v => v.Id === parseInt(newDeal.vehicleId));
      const selectedLead = leads.find(l => l.Id === parseInt(newDeal.customerId));
      
      if (!selectedVehicle || !selectedLead) {
        toast.error("Please select both vehicle and customer");
        return;
      }

      const netPrice = parseFloat(newDeal.salePrice) - parseFloat(newDeal.tradeInValue || 0);
      const margin = parseFloat(newDeal.salePrice) - selectedVehicle.purchasePrice;

      const dealData = {
        vehicleId: selectedVehicle.Id,
        customerId: selectedLead.Id,
        customerName: selectedLead.customerName,
        salePrice: parseFloat(newDeal.salePrice),
        tradeInValue: parseFloat(newDeal.tradeInValue || 0),
        netPrice,
        financing: {
          amount: netPrice,
          downPayment: parseFloat(newDeal.downPayment),
          loanAmount: financing?.loanAmount || 0,
          interestRate: parseFloat(newDeal.interestRate),
          termMonths: parseInt(newDeal.termMonths),
          monthlyPayment: financing?.monthlyPayment || 0
        },
        status: "Draft",
        margin,
        salesperson: "Current User",
        financeManager: "Jennifer Lopez"
      };

      await dealService.create(dealData);
      toast.success("Deal created successfully!");
      setShowNewDeal(false);
      setNewDeal({
        vehicleId: "",
        customerId: "",
        salePrice: "",
        tradeInValue: 0,
        downPayment: "",
        interestRate: 4.9,
        termMonths: 60
      });
      loadData();
    } catch (err) {
      toast.error("Failed to create deal");
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed": return "success";
      case "In Progress": return "warning";
      case "Negotiating": return "primary";
      case "Draft": return "default";
      default: return "default";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const availableVehicles = vehicles.filter(v => v.status === "Available");
  const totalDeals = deals.length;
  const completedDeals = deals.filter(d => d.status === "Completed").length;
  const totalRevenue = deals
    .filter(d => d.status === "Completed")
    .reduce((sum, d) => sum + d.salePrice, 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-6 mb-2">
            <div>
              <p className="text-sm text-slate-500">Active Deals</p>
              <p className="text-2xl font-bold text-slate-900">{totalDeals}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedDeals}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Revenue</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <Button onClick={() => setShowNewDeal(true)}>
          <ApperIcon name="Plus" />
          New Deal
        </Button>
      </div>

      {/* New Deal Form */}
      {showNewDeal && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Create New Deal</h3>
            <Button variant="ghost" onClick={() => setShowNewDeal(false)}>
              <ApperIcon name="X" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deal Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Deal Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Vehicle
                </label>
                <select
                  value={newDeal.vehicleId}
                  onChange={(e) => handleDealChange("vehicleId", e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a vehicle...</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.Id} value={vehicle.Id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - ${vehicle.askingPrice?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Customer
                </label>
                <select
                  value={newDeal.customerId}
                  onChange={(e) => handleDealChange("customerId", e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose a customer...</option>
                  {leads.map(lead => (
                    <option key={lead.Id} value={lead.Id}>
                      {lead.customerName} - {lead.phone}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Sale Price"
                type="number"
                step="0.01"
                value={newDeal.salePrice}
                onChange={(e) => handleDealChange("salePrice", e.target.value)}
                placeholder="28900.00"
              />

              <Input
                label="Trade-In Value (if any)"
                type="number"
                step="0.01"
                value={newDeal.tradeInValue}
                onChange={(e) => handleDealChange("tradeInValue", e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Financing */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Financing Details</h4>
              
              <Input
                label="Down Payment"
                type="number"
                step="0.01"
                value={newDeal.downPayment}
                onChange={(e) => handleDealChange("downPayment", e.target.value)}
                placeholder="3000.00"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Interest Rate (%)"
                  type="number"
                  step="0.1"
                  value={newDeal.interestRate}
                  onChange={(e) => handleDealChange("interestRate", e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Term (Months)
                  </label>
                  <select
                    value={newDeal.termMonths}
                    onChange={(e) => handleDealChange("termMonths", e.target.value)}
                    className="input-field"
                  >
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                    <option value="72">72 months</option>
                    <option value="84">84 months</option>
                  </select>
                </div>
              </div>

              {financing && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-900 mb-3">Payment Calculation</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Net Price:</span>
                      <span className="font-medium text-green-900">
                        ${(parseFloat(newDeal.salePrice || 0) - parseFloat(newDeal.tradeInValue || 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Loan Amount:</span>
                      <span className="font-medium text-green-900">
                        ${financing.loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-green-900">
                      <span>Monthly Payment:</span>
                      <span>${financing.monthlyPayment}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button variant="secondary" onClick={() => setShowNewDeal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDeal}
              disabled={!newDeal.vehicleId || !newDeal.customerId || !newDeal.salePrice}
            >
              Create Deal
            </Button>
          </div>
        </Card>
      )}

      {/* Deals List */}
      {deals.length === 0 ? (
        <Empty
          icon="FileText"
          title="No deals found"
          description="Start your first deal to track sales and financing."
          actionText="Create Deal"
          onAction={() => setShowNewDeal(true)}
        />
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => {
            const vehicle = vehicles.find(v => v.Id === deal.vehicleId);
            return (
              <Card key={deal.Id} hover className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
                      <ApperIcon name="FileText" className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">
                        Deal #{deal.Id.toString().padStart(3, "0")}
                      </h4>
                      <p className="text-slate-600">{deal.customerName}</p>
                      {vehicle && (
                        <p className="text-sm text-slate-500">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-slate-500">Sale Price</p>
                      <p className="text-xl font-bold text-slate-900">
                        ${deal.salePrice.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-slate-500">Monthly Payment</p>
                      <p className="text-lg font-semibold text-primary-600">
                        ${deal.financing.monthlyPayment}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-slate-500">Margin</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${deal.margin.toLocaleString()}
                      </p>
                    </div>
                    
                    <Badge variant={getStatusVariant(deal.status)}>
                      {deal.status}
                    </Badge>
                  </div>
                </div>
                
                {deal.status === "In Progress" || deal.status === "Negotiating" ? (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        <p>Salesperson: {deal.salesperson}</p>
                        {deal.financeManager && <p>F&I Manager: {deal.financeManager}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <ApperIcon name="Edit" />
                          Edit
                        </Button>
                        <Button size="sm">
                          <ApperIcon name="FileSignature" />
                          Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : deal.status === "Completed" ? (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-600">
                        <p className="flex items-center space-x-1">
                          <ApperIcon name="CheckCircle" className="h-4 w-4" />
                          <span>Deal completed successfully</span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <ApperIcon name="FileText" />
                          View Contract
                        </Button>
                        <Button size="sm" variant="secondary">
                          <ApperIcon name="Truck" />
                          Delivery
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        <p>Draft deal - Ready for customer presentation</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">
                          <ApperIcon name="Eye" />
                          Present
                        </Button>
                        <Button size="sm" variant="secondary">
                          <ApperIcon name="Edit" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DealDesk;