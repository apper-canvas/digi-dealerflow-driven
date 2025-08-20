import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { formatDistanceToNow } from "date-fns";

const LeadCard = ({ lead }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/leads/${lead.Id}`);
  };

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

  return (
    <Card hover onClick={handleCardClick}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{lead.customerName}</h3>
          <p className="text-sm text-slate-500">
            Last contact: {formatDistanceToNow(new Date(lead.lastContact))} ago
          </p>
        </div>
        <Badge variant={getStatusVariant(lead.status)}>
          {lead.status}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Target" className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Lead Score</span>
          </div>
          <span className={`text-lg font-bold ${getScoreColor(lead.leadScore)}`}>
            {lead.leadScore}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="Phone" className="h-4 w-4 text-slate-500" />
          <span className="text-sm">{lead.phone}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="Mail" className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-600">{lead.email}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="User" className="h-4 w-4 text-slate-500" />
          <span className="text-sm">Assigned to: {lead.assignedTo}</span>
        </div>
        
        {lead.budget && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="DollarSign" className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Budget: ${lead.budget.toLocaleString()}</span>
          </div>
        )}
        
        {lead.interestedVehicles?.length > 0 && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="Car" className="h-4 w-4 text-slate-500" />
            <span className="text-sm">{lead.interestedVehicles.length} interested vehicles</span>
          </div>
        )}
      </div>
      
      {lead.notes && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600 italic">{lead.notes}</p>
        </div>
      )}
      
      {lead.appointments?.length > 0 && (
        <div className="mt-4 flex items-center space-x-2 text-green-600">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          <span className="text-sm font-medium">Upcoming appointment scheduled</span>
        </div>
      )}
    </Card>
  );
};

export default LeadCard;