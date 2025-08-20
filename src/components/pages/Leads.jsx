import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeadGrid from "@/components/organisms/LeadGrid";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [sourceFilter, setSourceFilter] = useState(null);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Hot", label: "Hot Leads" },
    { value: "Warm", label: "Warm Leads" },
    { value: "Cold", label: "Cold Leads" },
    { value: "Follow-up", label: "Follow-up" }
  ];

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await leadService.getAll();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      setError("Failed to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // Create source options from leads
  const sourceOptions = [
    { value: "", label: "All Sources" },
    ...Array.from(new Set(leads.map(l => l.source)))
      .map(source => ({ value: source, label: source }))
  ];

  // Filter leads based on search and filters
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }

    if (statusFilter?.value) {
      filtered = filtered.filter(lead => lead.status === statusFilter.value);
    }

    if (sourceFilter?.value) {
      filtered = filtered.filter(lead => lead.source === sourceFilter.value);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Calculate stats
  const hotLeads = leads.filter(l => l.status === "Hot").length;
  const avgLeadScore = leads.length > 0 
    ? Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length)
    : 0;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-6 mb-2">
            <div>
              <p className="text-sm text-slate-500">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Hot Leads</p>
              <p className="text-2xl font-bold text-red-600">{hotLeads}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Score</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {avgLeadScore}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="secondary">
            <ApperIcon name="FileDown" />
            Export Leads
          </Button>
          <Button>
            <ApperIcon name="Plus" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search by name, email, or phone..."
            onSearch={handleSearch}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <FilterDropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
            label="Status"
          />
          
          <FilterDropdown
            options={sourceOptions}
            value={sourceFilter}
            onChange={setSourceFilter}
            placeholder="All Sources"
            label="Source"
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>
          Showing {filteredLeads.length} of {leads.length} leads
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        
        {filteredLeads.length > 0 && (
          <div className="flex items-center space-x-4">
            <span>Hot: {filteredLeads.filter(l => l.status === "Hot").length}</span>
            <span>Warm: {filteredLeads.filter(l => l.status === "Warm").length}</span>
            <span>Cold: {filteredLeads.filter(l => l.status === "Cold").length}</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Flame" className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Hot Leads Need Attention</p>
              <p className="text-sm text-red-700">{hotLeads} leads require immediate follow-up</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Calendar" className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Appointments Today</p>
              <p className="text-sm text-amber-700">
                {leads.filter(l => l.appointments?.length > 0).length} scheduled appointments
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Conversion Opportunity</p>
              <p className="text-sm text-green-700">
                {leads.filter(l => l.leadScore > 70).length} high-score leads ready to convert
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Grid */}
      <LeadGrid 
        leads={filteredLeads}
        loading={false}
        error=""
      />
    </div>
  );
};

export default Leads;