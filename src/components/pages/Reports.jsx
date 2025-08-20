import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import { vehicleService } from "@/services/api/vehicleService";
import { leadService } from "@/services/api/leadService";
import { dealService } from "@/services/api/dealService";

const Reports = () => {
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
      setError("Failed to load reports data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate key metrics
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + (v.askingPrice || 0), 0);
  const averageDaysInStock = vehicles.length > 0 
    ? Math.round(vehicles.reduce((sum, v) => sum + v.daysInInventory, 0) / vehicles.length)
    : 0;
  const totalSales = deals.filter(d => d.status === "Completed").reduce((sum, d) => sum + d.salePrice, 0);
  const totalMargin = deals.filter(d => d.status === "Completed").reduce((sum, d) => sum + d.margin, 0);
  const conversionRate = leads.length > 0 ? ((deals.length / leads.length) * 100).toFixed(1) : 0;
  
  // Inventory aging analysis
  const agingBuckets = {
    "0-30 days": vehicles.filter(v => v.daysInInventory <= 30).length,
    "31-60 days": vehicles.filter(v => v.daysInInventory > 30 && v.daysInInventory <= 60).length,
    "61-90 days": vehicles.filter(v => v.daysInInventory > 60 && v.daysInInventory <= 90).length,
    "90+ days": vehicles.filter(v => v.daysInInventory > 90).length
  };

  // Top performing vehicles by margin
  const topVehiclesByMargin = deals
    .filter(d => d.status === "Completed")
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  // Lead source analysis
  const leadsBySource = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  // Monthly performance (mock data for demo)
  const monthlyData = [
    { month: "Jan", sales: 12, margin: 48000 },
    { month: "Feb", sales: 15, margin: 62000 },
    { month: "Mar", sales: 18, margin: 71000 },
    { month: "Apr", sales: 22, margin: 89000 },
    { month: "May", sales: 19, margin: 76000 },
    { month: "Jun", sales: 25, margin: 98000 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inventory Value"
          value={`$${(totalInventoryValue / 1000).toFixed(0)}K`}
          icon="DollarSign"
          trend="up"
          trendValue="+12.5%"
          color="success"
        />
        <StatCard
          title="Avg. Days in Stock"
          value={averageDaysInStock}
          icon="Calendar"
          trend="down"
          trendValue="-8.2%"
          color="primary"
        />
        <StatCard
          title="Total Sales YTD"
          value={`$${(totalSales / 1000).toFixed(0)}K`}
          icon="TrendingUp"
          trend="up"
          trendValue="+24.1%"
          color="warning"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon="Target"
          trend="up"
          trendValue="+3.4%"
          color="slate"
        />
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Aging */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Inventory Aging Analysis</h3>
            <ApperIcon name="Clock" className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-4">
            {Object.entries(agingBuckets).map(([range, count]) => {
              const percentage = vehicles.length > 0 ? (count / vehicles.length) * 100 : 0;
              const color = range === "90+ days" ? "bg-red-500" : 
                           range === "61-90 days" ? "bg-amber-500" :
                           range === "31-60 days" ? "bg-blue-500" : "bg-green-500";
              
              return (
                <div key={range}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">{range}</span>
                    <span className="text-sm text-slate-600">{count} vehicles</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Lead Sources */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Lead Sources</h3>
            <ApperIcon name="Users" className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {Object.entries(leadsBySource)
              .sort(([,a], [,b]) => b - a)
              .map(([source, count]) => {
                const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                
                return (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded">
                        <ApperIcon 
                          name={source === "Website" ? "Globe" : 
                                source === "Phone Inquiry" ? "Phone" :
                                source === "Social Media" ? "Share2" :
                                source === "Referral" ? "UserCheck" : "Users"} 
                          className="h-4 w-4 text-primary-600" 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{source}</p>
                        <p className="text-xs text-slate-500">{percentage.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">{count}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Deals */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Top Performing Deals</h3>
            <ApperIcon name="Award" className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {topVehiclesByMargin.map((deal, index) => {
              const vehicle = vehicles.find(v => v.Id === deal.vehicleId);
              return (
                <div key={deal.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-yellow-500 text-white" :
                      index === 1 ? "bg-gray-400 text-white" :
                      index === 2 ? "bg-orange-500 text-white" :
                      "bg-slate-300 text-slate-700"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Unknown Vehicle"}
                      </p>
                      <p className="text-xs text-slate-500">{deal.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      ${deal.margin.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">margin</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Monthly Performance */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Monthly Performance</h3>
            <ApperIcon name="BarChart3" className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {monthlyData.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">{month.month} 2024</p>
                  <p className="text-xs text-slate-500">{month.sales} vehicles sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary-600">
                    ${(month.margin / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-slate-500">gross margin</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full w-fit">
              <ApperIcon name="TrendingUp" className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Sales Growth</h4>
            <p className="text-3xl font-bold text-green-600 mt-2">+24.5%</p>
            <p className="text-sm text-slate-500">vs. last quarter</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-fit">
              <ApperIcon name="Users" className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Customer Satisfaction</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">4.8/5</p>
            <p className="text-sm text-slate-500">average rating</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-fit">
              <ApperIcon name="Clock" className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Avg. Sale Cycle</h4>
            <p className="text-3xl font-bold text-purple-600 mt-2">12.5</p>
            <p className="text-sm text-slate-500">days to close</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;