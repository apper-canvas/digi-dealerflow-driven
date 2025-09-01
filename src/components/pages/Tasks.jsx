import React, { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";
import { dealService } from "@/services/api/dealService";
import { leadService } from "@/services/api/leadService";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    Name: "",
    Tags: "",
    description_c: "",
    status_c: "New",
    due_date_c: "",
    assigned_to_c: "",
    deal_c: "",
    lead_c: ""
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [tasksData, dealsData, leadsData] = await Promise.all([
        taskService.getAll(),
        dealService.getAll(),
        leadService.getAll()
      ]);
      setTasks(tasksData);
      setDeals(dealsData);
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

  const statusOptions = [
    "New", "In Progress", "Completed", "On Hold", "Cancelled"
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "blue";
      case "In Progress": return "yellow";
      case "Completed": return "green";
      case "On Hold": return "orange";
      case "Cancelled": return "red";
      default: return "slate";
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "all" || task.status_c === filter;
    const matchesSearch = !searchTerm || 
      task.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description_c?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim()) {
      return;
    }

    // Convert date to ISO format if provided
    const submitData = {
      ...formData,
      due_date_c: formData.due_date_c ? new Date(formData.due_date_c).toISOString() : null
    };

    if (editingTask) {
      const result = await taskService.update(editingTask.Id, submitData);
      if (result) {
        setTasks(prev => prev.map(t => t.Id === editingTask.Id ? result : t));
        setEditingTask(null);
        resetForm();
      }
    } else {
      const result = await taskService.create(submitData);
      if (result) {
        setTasks(prev => [result, ...prev]);
        setIsCreating(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.Name}"?`)) {
      const success = await taskService.delete(task.Id);
      if (success) {
        setTasks(prev => prev.filter(t => t.Id !== task.Id));
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      Name: task.Name || "",
      Tags: task.Tags || "",
      description_c: task.description_c || "",
      status_c: task.status_c || "New",
      due_date_c: task.due_date_c ? new Date(task.due_date_c).toISOString().split('T')[0] : "",
      assigned_to_c: task.assigned_to_c?.Id || "",
      deal_c: task.deal_c?.Id || "",
      lead_c: task.lead_c?.Id || ""
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      Name: "",
      Tags: "",
      description_c: "",
      status_c: "New",
      due_date_c: "",
      assigned_to_c: "",
      deal_c: "",
      lead_c: ""
    });
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingTask(null);
    resetForm();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600">Manage and track your tasks</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Task Form */}
      {isCreating && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <Button variant="outline" onClick={cancelForm}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Task Name *
                </label>
                <Input
                  value={formData.Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                  placeholder="Enter task name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, status_c: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.due_date_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date_c: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <Input
                  value={formData.Tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, Tags: e.target.value }))}
                  placeholder="Enter tags (comma-separated)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Related Deal
                </label>
                <select
                  value={formData.deal_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, deal_c: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a deal</option>
                  {deals.map(deal => (
                    <option key={deal.Id} value={deal.Id}>{deal.Name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Related Lead
                </label>
                <select
                  value={formData.lead_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, lead_c: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a lead</option>
                  {leads.map(lead => (
                    <option key={lead.Id} value={lead.Id}>{lead.Name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description_c}
                onChange={(e) => setFormData(prev => ({ ...prev, description_c: e.target.value }))}
                placeholder="Enter task description"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={cancelForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty 
          message={searchTerm || filter !== "all" ? "No tasks match your criteria" : "No tasks found"}
          description={searchTerm || filter !== "all" ? "Try adjusting your search or filters" : "Create your first task to get started"}
        />
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.Id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 truncate pr-4">
                      {task.Name}
                    </h3>
                    <Badge color={getStatusColor(task.status_c)}>
                      {task.status_c}
                    </Badge>
                  </div>
                  
                  {task.description_c && (
                    <p className="text-slate-600 mb-3 line-clamp-2">{task.description_c}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                    {task.due_date_c && (
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="h-4 w-4" />
                        <span>Due: {new Date(task.due_date_c).toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.deal_c?.Name && (
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Handshake" className="h-4 w-4" />
                        <span>Deal: {task.deal_c.Name}</span>
                      </div>
                    )}
                    {task.lead_c?.Name && (
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="User" className="h-4 w-4" />
                        <span>Lead: {task.lead_c.Name}</span>
                      </div>
                    )}
                  </div>

                  {task.Tags && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.Tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-slate-400">
                    Created: {new Date(task.CreatedOn).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(task)}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(task)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;