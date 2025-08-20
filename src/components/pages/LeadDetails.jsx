import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";
import { vehicleService } from "@/services/api/vehicleService";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "react-toastify";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leadData, vehiclesData] = await Promise.all([
        leadService.getById(id),
        vehicleService.getAll()
      ]);
      
      if (leadData) {
        setLead(leadData);
      } else {
        setError("Lead not found");
      }
      setVehicles(vehiclesData);
    } catch (err) {
      setError("Failed to load lead details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await leadService.update(id, { status: newStatus });
      setLead({ ...lead, status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update lead status");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const updatedLead = await leadService.addContactHistory(id, {
        type: "Note",
        notes: newNote,
        agent: "Current User"
      });
      
      if (updatedLead) {
        setLead(updatedLead);
        setNewNote("");
        setShowAddNote(false);
        toast.success("Note added successfully");
      }
    } catch (err) {
      toast.error("Failed to add note");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!lead) return <Error message="Lead not found" />;

  const getStatusVariant = (status) => {
    switch (status) {
      case "Hot": return "hot";
      case "Warm": return "warm";
      case "Cold": return "cold";
      case "Follow-up": return "warning";
      default: return "default";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const interestedVehicles = vehicles.filter(v => 
    lead.interestedVehicles?.includes(v.Id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/leads")}>
            <ApperIcon name="ArrowLeft" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lead.customerName}</h1>
            <p className="text-slate-600">Lead Details</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusVariant(lead.status)}>
            {lead.status}
          </Badge>
          <Button variant="secondary">
            <ApperIcon name="Edit" />
            Edit Lead
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="User" className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-medium text-slate-900">{lead.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Phone" className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-900">{lead.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Mail" className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Email Address</p>
                  <p className="font-medium text-slate-900">{lead.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="MapPin" className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Lead Source</p>
                  <p className="font-medium text-slate-900">{lead.source}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Interested Vehicles */}
          {interestedVehicles.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Interested Vehicles</h3>
              <div className="space-y-3">
                {interestedVehicles.map((vehicle) => (
                  <div key={vehicle.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={vehicle.photos?.[0] || "https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?w=100&h=75&fit=crop"}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-slate-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-slate-500">{vehicle.trim}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">
                        ${vehicle.askingPrice?.toLocaleString()}
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/inventory/${vehicle.Id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Contact History */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Contact History</h3>
              <Button onClick={() => setShowAddNote(!showAddNote)} size="sm">
                <ApperIcon name="Plus" />
                Add Note
              </Button>
            </div>

            {showAddNote && (
              <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="space-y-3">
                  <Input
                    label="Add Note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter note about this lead..."
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleAddNote} size="sm">
                      Save Note
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddNote(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {lead.contactHistory?.map((contact, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border border-slate-100 rounded-lg">
                  <div className="p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                    <ApperIcon 
                      name={contact.type === "Phone Call" ? "Phone" : 
                            contact.type === "Email" ? "Mail" : 
                            contact.type === "Walk-in" ? "Users" : "FileText"} 
                      className="h-4 w-4 text-slate-600" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{contact.type}</span>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(contact.date))} ago
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{contact.notes}</p>
                    <p className="text-xs text-slate-500 mt-1">by {contact.agent}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Score & Status */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Lead Overview</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Lead Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(lead.leadScore)}`}>
                  {lead.leadScore}
                </p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      lead.leadScore >= 80 ? "bg-green-500" : 
                      lead.leadScore >= 60 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${lead.leadScore}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Status</span>
                <Badge variant={getStatusVariant(lead.status)}>
                  {lead.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Assigned To</span>
                <span className="font-medium text-slate-700">{lead.assignedTo}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Last Contact</span>
                <span className="text-sm text-slate-700">
                  {formatDistanceToNow(new Date(lead.lastContact))} ago
                </span>
              </div>
            </div>
          </Card>

          {/* Purchase Information */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Purchase Details</h3>
            <div className="space-y-3">
              {lead.budget && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Budget</span>
                  <span className="font-bold text-green-600">
                    ${lead.budget.toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Trade-In</span>
                <Badge variant={lead.tradeIn ? "success" : "default"}>
                  {lead.tradeIn ? "Yes" : "No"}
                </Badge>
              </div>
              
              {lead.tradeIn && lead.tradeInVehicle && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Trade Vehicle</span>
                  <span className="text-sm text-slate-700">{lead.tradeInVehicle}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleStatusChange("Hot")}
                  disabled={lead.status === "Hot"}
                >
                  Mark Hot
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleStatusChange("Warm")}
                  disabled={lead.status === "Warm"}
                >
                  Mark Warm
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleStatusChange("Cold")}
                  disabled={lead.status === "Cold"}
                >
                  Mark Cold
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleStatusChange("Follow-up")}
                  disabled={lead.status === "Follow-up"}
                >
                  Follow-up
                </Button>
              </div>
              
              <Button className="w-full">
                <ApperIcon name="Calendar" />
                Schedule Appointment
              </Button>
              
              <Button variant="secondary" className="w-full">
                <ApperIcon name="FileText" />
                Create Deal
              </Button>
              
              <Button variant="secondary" className="w-full">
                <ApperIcon name="Phone" />
                Call Customer
              </Button>
              
              <Button variant="secondary" className="w-full">
                <ApperIcon name="Mail" />
                Send Email
              </Button>
            </div>
          </Card>

          {/* Notes */}
          {lead.notes && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Notes</h3>
              <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                {lead.notes}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;