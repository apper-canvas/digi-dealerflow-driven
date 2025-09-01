import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "deal_c"}},
          {"field": {"Name": "lead_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error('Failed to fetch tasks:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error?.response?.data?.message || error.message);
      toast.error('Failed to load tasks. Please try again.');
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "deal_c"}},
          {"field": {"Name": "lead_c"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', id, params);

      if (!response.success) {
        console.error(`Failed to fetch task ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to load task details. Please try again.');
      return null;
    }
  },

  async create(taskData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields in create operation
      const createData = {
        Name: taskData.Name || '',
        Tags: taskData.Tags || '',
        description_c: taskData.description_c || '',
        status_c: taskData.status_c || 'New',
        due_date_c: taskData.due_date_c || null,
        assigned_to_c: taskData.assigned_to_c ? parseInt(taskData.assigned_to_c) : null,
        deal_c: taskData.deal_c ? parseInt(taskData.deal_c) : null,
        lead_c: taskData.lead_c ? parseInt(taskData.lead_c) : null
      };

      // Remove null/undefined values
      Object.keys(createData).forEach(key => {
        if (createData[key] === null || createData[key] === undefined || createData[key] === '') {
          delete createData[key];
        }
      });

      const params = {
        records: [createData]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error('Failed to create task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const createdTask = successful[0]?.data;
        if (createdTask) {
          toast.success('Task created successfully!');
          return createdTask;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating task:', error?.response?.data?.message || error.message);
      toast.error('Failed to create task. Please try again.');
      return null;
    }
  },

  async update(id, taskData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields in update operation
      const updateData = {
        Id: parseInt(id),
        Name: taskData.Name,
        Tags: taskData.Tags || '',
        description_c: taskData.description_c || '',
        status_c: taskData.status_c,
        due_date_c: taskData.due_date_c || null,
        assigned_to_c: taskData.assigned_to_c ? parseInt(taskData.assigned_to_c) : null,
        deal_c: taskData.deal_c ? parseInt(taskData.deal_c) : null,
        lead_c: taskData.lead_c ? parseInt(taskData.lead_c) : null
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error('Failed to update task:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        const updatedTask = successful[0]?.data;
        if (updatedTask) {
          toast.success('Task updated successfully!');
          return updatedTask;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating task:', error?.response?.data?.message || error.message);
      toast.error('Failed to update task. Please try again.');
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error('Failed to delete task:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        if (successful.length > 0) {
          toast.success('Task deleted successfully!');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting task:', error?.response?.data?.message || error.message);
      toast.error('Failed to delete task. Please try again.');
      return false;
    }
  }
};