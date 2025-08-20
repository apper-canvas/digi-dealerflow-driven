import React from "react";
import LeadCard from "@/components/molecules/LeadCard";
import Empty from "@/components/ui/Empty";

const LeadGrid = ({ leads, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg h-64"></div>
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

  if (!leads || leads.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No leads found"
        description="Start capturing leads to grow your sales pipeline."
        actionText="Import Leads"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.map((lead) => (
        <LeadCard key={lead.Id} lead={lead} />
      ))}
    </div>
  );
};

export default LeadGrid;