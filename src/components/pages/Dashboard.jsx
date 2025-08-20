import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { vehicleService } from "@/services/api/vehicleService";
import { leadService } from "@/services/api/leadService";
import { dealService } from "@/services/api/dealService";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [vehiclesData, leadsData, dealsData] = await Promise.all([
        vehicleService.getAll(),
        leadService.getAll(),
        dealService.getAll()
      ]);
      setVehicles(vehiclesData);
      setLeads(leadsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate statistics
  const totalInventory = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const soldVehicles = vehicles.filter(v => v.status === "Sold").length;
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + (v.askingPrice || 0), 0);
  
  const hotLeads = leads.filter(l => l.status === "Hot").length;
  const totalLeads = leads.length;
  
  const avgDaysInInventory = vehicles.length > 0 
    ? Math.round(vehicles.reduce((sum, v) => sum + v.daysInInventory, 0) / vehicles.length)
    : 0;

  const recentActivities = [
    { icon: "Car", text: "New 2023 Honda Accord added to inventory", time: "2 hours ago", type: "inventory" },
    { icon: "Users", text: "Hot lead assigned to Mike Rodriguez", time: "4 hours ago", type: "lead" },
    { icon: "FileText", text: "Deal completed for Toyota Camry", time: "6 hours ago", type: "deal" },
    { icon: "DollarSign", text: "Monthly sales target 80% achieved", time: "1 day ago", type: "sales" },
    { icon: "AlertTriangle", text: "3 vehicles over 90 days in inventory", time: "2 days ago", type: "alert" }
  ];

  const agingInventory = vehicles
    .filter(v => v.status === "Available")
    .sort((a, b) => b.daysInInventory - a.daysInInventory)
    .slice(0, 5);

  const topLeads = leads
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inventory"
          value={totalInventory}
          icon="Car"
          trend="up"
          trendValue="+12%"
          color="primary"
        />
        <StatCard
          title="Available Vehicles"
          value={availableVehicles}
          icon="Package"
          trend="up"
          trendValue="+8%"
          color="success"
        />
        <StatCard
          title="Hot Leads"
          value={hotLeads}
          icon="Target"
          trend="up"
          trendValue="+24%"
          color="warning"
        />
        <StatCard
          title="Avg. Days in Stock"
          value={avgDaysInInventory}
          icon="Calendar"
          trend="down"
          trendValue="-5%"
          color="slate"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card gradient>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Inventory Value</h3>
            <ApperIcon name="DollarSign" className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              ${totalInventoryValue.toLocaleString()}
            </div>
            <p className="text-sm text-slate-600">Total asking price of all inventory</p>
            <div className="flex items-center space-x-2 text-sm">
              <ApperIcon name="TrendingUp" className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+15.3%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Sales Performance</h3>
            <ApperIcon name="BarChart3" className="h-5 w-5 text-primary-600" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Goal</span>
                <span className="font-medium">32/40 vehicles</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>
            <p className="text-sm text-slate-600">80% of monthly target achieved</p>
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Lead Conversion</h3>
            <ApperIcon name="Users" className="h-5 w-5 text-amber-600" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              24.5%
            </div>
            <p className="text-sm text-slate-600">Average conversion rate this month</p>
            <div className="flex items-center space-x-2 text-sm">
              <ApperIcon name="TrendingUp" className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+3.2%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities and Inventory Aging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <ApperIcon name="Activity" className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                  <ApperIcon name={activity.icon} className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">{activity.text}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Aging Inventory Alert</h3>
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-3">
            {agingInventory.map((vehicle) => (
              <div key={vehicle.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-xs text-slate-500">{vehicle.location}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    vehicle.daysInInventory > 90 ? "text-red-600" : 
                    vehicle.daysInInventory > 60 ? "text-amber-600" : "text-green-600"
                  }`}>
                    {vehicle.daysInInventory} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;