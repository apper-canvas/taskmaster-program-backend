import { toast } from 'react-toastify';

class TimeService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'time_entry_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "task_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data.map(entry => ({
          Id: entry.Id,
          taskId: entry.task_id_c?.Id || null,
          startTime: entry.start_time_c || new Date().toISOString(),
          endTime: entry.end_time_c || new Date().toISOString(),
          duration: parseFloat(entry.duration_c) || 0
        }));
      }
    } catch (error) {
      console.error("Error fetching time entries:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "task_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Time entry with id ${id} not found`);
      } else {
        const entry = response.data;
        return {
          Id: entry.Id,
          taskId: entry.task_id_c?.Id || null,
          startTime: entry.start_time_c || new Date().toISOString(),
          endTime: entry.end_time_c || new Date().toISOString(),
          duration: parseFloat(entry.duration_c) || 0
        };
      }
    } catch (error) {
      console.error(`Error fetching time entry ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByTaskId(taskId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "task_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "task_id_c", "Operator": "EqualTo", "Values": [parseInt(taskId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data.map(entry => ({
          Id: entry.Id,
          taskId: entry.task_id_c?.Id || null,
          startTime: entry.start_time_c || new Date().toISOString(),
          endTime: entry.end_time_c || new Date().toISOString(),
          duration: parseFloat(entry.duration_c) || 0
        }));
      }
    } catch (error) {
      console.error("Error fetching time entries by task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(entryData) {
    try {
      const params = {
        records: [
          {
            Name: `Time Entry - ${new Date().toLocaleString()}`,
            task_id_c: entryData.taskId ? parseInt(entryData.taskId) : null,
            start_time_c: entryData.startTime || new Date().toISOString(),
            end_time_c: entryData.endTime || new Date().toISOString(),
            duration_c: parseFloat(entryData.duration) || 0
          }
        ]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} time entries:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdEntry = successful[0].data;
          return {
            Id: createdEntry.Id,
            taskId: createdEntry.task_id_c?.Id || null,
            startTime: createdEntry.start_time_c || new Date().toISOString(),
            endTime: createdEntry.end_time_c || new Date().toISOString(),
            duration: parseFloat(createdEntry.duration_c) || 0
          };
        }
      }
      throw new Error('Failed to create time entry');
    } catch (error) {
      console.error("Error creating time entry:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updateFields = { Id: parseInt(id) };
      
      if (updateData.taskId !== undefined) updateFields.task_id_c = updateData.taskId ? parseInt(updateData.taskId) : null;
      if (updateData.startTime !== undefined) updateFields.start_time_c = updateData.startTime;
      if (updateData.endTime !== undefined) updateFields.end_time_c = updateData.endTime;
      if (updateData.duration !== undefined) updateFields.duration_c = parseFloat(updateData.duration) || 0;
      
      const params = {
        records: [updateFields]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} time entries:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedEntry = successful[0].data;
          return {
            Id: updatedEntry.Id,
            taskId: updatedEntry.task_id_c?.Id || null,
            startTime: updatedEntry.start_time_c || new Date().toISOString(),
            endTime: updatedEntry.end_time_c || new Date().toISOString(),
            duration: parseFloat(updatedEntry.duration_c) || 0
          };
        }
      }
      throw new Error('Failed to update time entry');
    } catch (error) {
      console.error("Error updating time entry:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} time entries:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting time entry:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getTotalTimeForTask(taskId) {
    try {
      const entries = await this.getByTaskId(taskId);
      return entries.reduce((total, entry) => total + entry.duration, 0);
    } catch (error) {
      console.error("Error calculating total time:", error?.response?.data?.message || error);
      return 0;
    }
  }

  async getTimeEntriesForDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "task_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {"FieldName": "start_time_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "start_time_c", "Operator": "LessThanOrEqualTo", "Values": [endDate + "T23:59:59"]}
        ],
        orderBy: [{"fieldName": "start_time_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data.map(entry => ({
          Id: entry.Id,
          taskId: entry.task_id_c?.Id || null,
          startTime: entry.start_time_c || new Date().toISOString(),
          endTime: entry.end_time_c || new Date().toISOString(),
          duration: parseFloat(entry.duration_c) || 0
        }));
      }
    } catch (error) {
      console.error("Error fetching time entries for date range:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new TimeService();
