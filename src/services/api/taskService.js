import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
{"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "subtasks_c"}},
          {"field": {"Name": "project_id_c"}},
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
        return response.data.map(task => ({
          Id: task.Id,
          title: task.title_c || task.Name || 'Untitled Task',
          description: task.description_c || '',
          status: task.status_c || 'To Do',
          priority: task.priority_c || 'Medium',
          dueDate: task.due_date_c || null,
assignee: task.assignee_id_c || null,
          tags: task.tags_c ? task.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          estimatedTime: parseFloat(task.estimated_time_c) || 0,
          actualTime: parseFloat(task.actual_time_c) || 0,
          subtasks: task.subtasks_c ? this.parseSubtasks(task.subtasks_c) : [],
          projectId: task.project_id_c?.Id || null,
          createdAt: task.CreatedOn ? task.CreatedOn.split('T')[0] : null,
          completedAt: task.status_c === 'Completed' && task.ModifiedOn ? task.ModifiedOn.split('T')[0] : null
        }));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
{"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "subtasks_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Task with id ${id} not found`);
      } else {
        const task = response.data;
        return {
          Id: task.Id,
          title: task.title_c || task.Name || 'Untitled Task',
          description: task.description_c || '',
          status: task.status_c || 'To Do',
          priority: task.priority_c || 'Medium',
          dueDate: task.due_date_c || null,
assignee: task.assignee_id_c || null,
          tags: task.tags_c ? task.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          estimatedTime: parseFloat(task.estimated_time_c) || 0,
          actualTime: parseFloat(task.actual_time_c) || 0,
          subtasks: task.subtasks_c ? this.parseSubtasks(task.subtasks_c) : [],
          projectId: task.project_id_c?.Id || null,
          createdAt: task.CreatedOn ? task.CreatedOn.split('T')[0] : null,
          completedAt: task.status_c === 'Completed' && task.ModifiedOn ? task.ModifiedOn.split('T')[0] : null
        };
      }
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByProjectId(projectId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
{"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "subtasks_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "project_id_c", "Operator": "EqualTo", "Values": [parseInt(projectId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data.map(task => ({
          Id: task.Id,
          title: task.title_c || task.Name || 'Untitled Task',
          description: task.description_c || '',
          status: task.status_c || 'To Do',
          priority: task.priority_c || 'Medium',
          dueDate: task.due_date_c || null,
assignee: task.assignee_id_c || null,
          tags: task.tags_c ? task.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          estimatedTime: parseFloat(task.estimated_time_c) || 0,
          actualTime: parseFloat(task.actual_time_c) || 0,
          subtasks: task.subtasks_c ? this.parseSubtasks(task.subtasks_c) : [],
          projectId: task.project_id_c?.Id || null,
          createdAt: task.CreatedOn ? task.CreatedOn.split('T')[0] : null,
          completedAt: task.status_c === 'Completed' && task.ModifiedOn ? task.ModifiedOn.split('T')[0] : null
        }));
      }
    } catch (error) {
      console.error("Error fetching tasks by project:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            Name: taskData.title || 'Untitled Task',
            title_c: taskData.title || 'Untitled Task',
            description_c: taskData.description || '',
            status_c: taskData.status || 'To Do',
            priority_c: taskData.priority || 'Medium',
            due_date_c: taskData.dueDate || null,
assignee_id_c: taskData.assignee || null,
            tags_c: taskData.tags && taskData.tags.length > 0 ? taskData.tags.join(',') : '',
            estimated_time_c: parseFloat(taskData.estimatedTime) || 0,
            actual_time_c: 0,
            subtasks_c: taskData.subtasks && taskData.subtasks.length > 0 ? this.stringifySubtasks(taskData.subtasks) : '',
            project_id_c: taskData.projectId ? parseInt(taskData.projectId) : null
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
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdTask = successful[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || createdTask.Name || 'Untitled Task',
            description: createdTask.description_c || '',
            status: createdTask.status_c || 'To Do',
            priority: createdTask.priority_c || 'Medium',
            dueDate: createdTask.due_date_c || null,
assignee: createdTask.assignee_id_c || null,
            tags: createdTask.tags_c ? createdTask.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            estimatedTime: parseFloat(createdTask.estimated_time_c) || 0,
            actualTime: parseFloat(createdTask.actual_time_c) || 0,
            subtasks: createdTask.subtasks_c ? this.parseSubtasks(createdTask.subtasks_c) : [],
            projectId: createdTask.project_id_c?.Id || null,
            createdAt: createdTask.CreatedOn ? createdTask.CreatedOn.split('T')[0] : null,
            completedAt: null
          };
        }
      }
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updateFields = { Id: parseInt(id) };
      
      // Only include fields that are being updated
      if (updateData.title !== undefined) {
        updateFields.Name = updateData.title;
        updateFields.title_c = updateData.title;
      }
      if (updateData.description !== undefined) updateFields.description_c = updateData.description;
      if (updateData.status !== undefined) updateFields.status_c = updateData.status;
      if (updateData.priority !== undefined) updateFields.priority_c = updateData.priority;
if (updateData.dueDate !== undefined) updateFields.due_date_c = updateData.dueDate;
      if (updateData.assignee !== undefined) updateFields.assignee_id_c = updateData.assignee;
      if (updateData.tags !== undefined) updateFields.tags_c = updateData.tags.length > 0 ? updateData.tags.join(',') : '';
      if (updateData.estimatedTime !== undefined) updateFields.estimated_time_c = parseFloat(updateData.estimatedTime) || 0;
      if (updateData.actualTime !== undefined) updateFields.actual_time_c = parseFloat(updateData.actualTime) || 0;
      if (updateData.subtasks !== undefined) updateFields.subtasks_c = updateData.subtasks.length > 0 ? this.stringifySubtasks(updateData.subtasks) : '';
      if (updateData.projectId !== undefined) updateFields.project_id_c = updateData.projectId ? parseInt(updateData.projectId) : null;
      
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
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || updatedTask.Name || 'Untitled Task',
            description: updatedTask.description_c || '',
            status: updatedTask.status_c || 'To Do',
            priority: updatedTask.priority_c || 'Medium',
dueDate: updatedTask.due_date_c || null,
            assignee: updatedTask.assignee_id_c || null,
            tags: updatedTask.tags_c ? updatedTask.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            estimatedTime: parseFloat(updatedTask.estimated_time_c) || 0,
            actualTime: parseFloat(updatedTask.actual_time_c) || 0,
            subtasks: updatedTask.subtasks_c ? this.parseSubtasks(updatedTask.subtasks_c) : [],
            projectId: updatedTask.project_id_c?.Id || null,
            createdAt: updatedTask.CreatedOn ? updatedTask.CreatedOn.split('T')[0] : null,
            completedAt: updatedTask.status_c === 'Completed' && updatedTask.ModifiedOn ? updatedTask.ModifiedOn.split('T')[0] : null
          };
        }
      }
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateStatus(id, status) {
    return this.update(id, { status });
  }

  async addTimeEntry(taskId, duration) {
    try {
      // Get current task to update actual time
      const currentTask = await this.getById(taskId);
      const newActualTime = (currentTask.actualTime || 0) + duration;
      
      return await this.update(taskId, { actualTime: newActualTime });
    } catch (error) {
      console.error("Error adding time entry:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getTasksByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
{"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data.map(task => ({
          Id: task.Id,
          title: task.title_c || task.Name || 'Untitled Task',
          description: task.description_c || '',
          status: task.status_c || 'To Do',
          priority: task.priority_c || 'Medium',
dueDate: task.due_date_c || null,
          assignee: task.assignee_id_c || null,
          tags: task.tags_c ? task.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          estimatedTime: parseFloat(task.estimated_time_c) || 0,
          actualTime: parseFloat(task.actual_time_c) || 0,
          projectId: task.project_id_c?.Id || null,
          createdAt: task.CreatedOn ? task.CreatedOn.split('T')[0] : null
        }));
      }
    } catch (error) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getTasksByPriority(priority) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
{"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "EqualTo", "Values": [priority]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data.map(task => ({
          Id: task.Id,
          title: task.title_c || task.Name || 'Untitled Task',
          description: task.description_c || '',
          status: task.status_c || 'To Do',
          priority: task.priority_c || 'Medium',
          dueDate: task.due_date_c || null,
assignee: task.assignee_id_c || null,
          tags: task.tags_c ? task.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          estimatedTime: parseFloat(task.estimated_time_c) || 0,
          actualTime: parseFloat(task.actual_time_c) || 0,
          projectId: task.project_id_c?.Id || null,
          createdAt: task.CreatedOn ? task.CreatedOn.split('T')[0] : null
        }));
      }
    } catch (error) {
      console.error("Error fetching tasks by priority:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getOverdueTasks() {
    try {
      const today = new Date().toISOString().split("T")[0];
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
{"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "project_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {"FieldName": "due_date_c", "Operator": "LessThan", "Values": [today]},
          {"FieldName": "status_c", "Operator": "NotEqualTo", "Values": ["Completed"]}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data.map(task => ({
          Id: task.Id,
          title: task.title_c || task.Name || 'Untitled Task',
          description: task.description_c || '',
          status: task.status_c || 'To Do',
          priority: task.priority_c || 'Medium',
dueDate: task.due_date_c || null,
          assignee: task.assignee_id_c || null,
          tags: task.tags_c ? task.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
          estimatedTime: parseFloat(task.estimated_time_c) || 0,
          actualTime: parseFloat(task.actual_time_c) || 0,
          projectId: task.project_id_c?.Id || null,
          createdAt: task.CreatedOn ? task.CreatedOn.split('T')[0] : null
        }));
      }
    } catch (error) {
      console.error("Error fetching overdue tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Helper methods for subtasks handling
  parseSubtasks(subtasksString) {
    try {
      if (!subtasksString) return [];
      // Parse JSON string or handle simple format
      if (subtasksString.startsWith('[')) {
        return JSON.parse(subtasksString);
      } else {
        // Handle simple comma-separated format
        return subtasksString.split(',').map((item, index) => ({
          id: index + 1,
          title: item.trim(),
          completed: false
        }));
      }
    } catch (error) {
      return [];
    }
  }

  stringifySubtasks(subtasks) {
    try {
      if (!subtasks || subtasks.length === 0) return '';
      return JSON.stringify(subtasks);
    } catch (error) {
      return '';
    }
  }
}

export default new TaskService();