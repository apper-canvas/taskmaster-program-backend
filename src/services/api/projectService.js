import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class ProjectService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'project_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "color_c"}},
{"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tasks_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
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
        return response.data.map(project => ({
          Id: project.Id,
          name: project.name_c || project.Name || 'Untitled Project',
          description: project.description_c || '',
          color: project.color_c || '#3b82f6',
          dueDate: project.due_date_c || null,
assignee: project.assignee_id_c || null,
          tasks: project.tasks_c ? project.tasks_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
          createdAt: project.CreatedOn ? project.CreatedOn.split('T')[0] : null
        }));
      }
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "color_c"}},
{"field": {"Name": "due_date_c"}},
          {"field": {"Name": "assignee_id_c"}},
          {"field": {"Name": "tasks_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Project with id ${id} not found`);
      } else {
        const project = response.data;
        return {
          Id: project.Id,
          name: project.name_c || project.Name || 'Untitled Project',
          description: project.description_c || '',
          color: project.color_c || '#3b82f6',
dueDate: project.due_date_c || null,
          assignee: project.assignee_id_c || null,
          tasks: project.tasks_c ? project.tasks_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
          createdAt: project.CreatedOn ? project.CreatedOn.split('T')[0] : null
        };
      }
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(projectData) {
    try {
      const params = {
        records: [
          {
            Name: projectData.name || 'Untitled Project',
            name_c: projectData.name || 'Untitled Project',
            description_c: projectData.description || '',
            color_c: projectData.color || '#3b82f6',
due_date_c: projectData.dueDate || null,
            assignee_id_c: projectData.assignee || null,
            tasks_c: projectData.tasks && projectData.tasks.length > 0 ? projectData.tasks.join(',') : ''
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
          console.error(`Failed to create ${failed.length} projects:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdProject = successful[0].data;
          return {
            Id: createdProject.Id,
            name: createdProject.name_c || createdProject.Name || 'Untitled Project',
            description: createdProject.description_c || '',
            color: createdProject.color_c || '#3b82f6',
            dueDate: createdProject.due_date_c || null,
assignee: createdProject.assignee_id_c || null,
            tasks: createdProject.tasks_c ? createdProject.tasks_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            createdAt: createdProject.CreatedOn ? createdProject.CreatedOn.split('T')[0] : null
          };
        }
      }
      throw new Error('Failed to create project');
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(updateData.name && { Name: updateData.name, name_c: updateData.name }),
            ...(updateData.description !== undefined && { description_c: updateData.description }),
            ...(updateData.color && { color_c: updateData.color }),
            ...(updateData.dueDate !== undefined && { due_date_c: updateData.dueDate }),
...(updateData.assignee !== undefined && { assignee_id_c: updateData.assignee }),
            ...(updateData.tasks !== undefined && { tasks_c: updateData.tasks.length > 0 ? updateData.tasks.join(',') : '' })
          }
        ]
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
          console.error(`Failed to update ${failed.length} projects:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedProject = successful[0].data;
          return {
            Id: updatedProject.Id,
            name: updatedProject.name_c || updatedProject.Name || 'Untitled Project',
            description: updatedProject.description_c || '',
            color: updatedProject.color_c || '#3b82f6',
            dueDate: updatedProject.due_date_c || null,
assignee: updatedProject.assignee_id_c || null,
            tasks: updatedProject.tasks_c ? updatedProject.tasks_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            createdAt: updatedProject.CreatedOn ? updatedProject.CreatedOn.split('T')[0] : null
          };
        }
      }
      throw new Error('Failed to update project');
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} projects:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async addTaskToProject(projectId, taskId) {
    try {
      // Get current project to update tasks list
      const currentProject = await this.getById(projectId);
      const currentTasks = currentProject.tasks || [];
      
      if (!currentTasks.includes(parseInt(taskId))) {
        const updatedTasks = [...currentTasks, parseInt(taskId)];
        return await this.update(projectId, { tasks: updatedTasks });
      }
      
      return currentProject;
    } catch (error) {
      console.error("Error adding task to project:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async removeTaskFromProject(projectId, taskId) {
    try {
      // Get current project to update tasks list
      const currentProject = await this.getById(projectId);
      const currentTasks = currentProject.tasks || [];
      
      const updatedTasks = currentTasks.filter(id => id !== parseInt(taskId));
      return await this.update(projectId, { tasks: updatedTasks });
    } catch (error) {
      console.error("Error removing task from project:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new ProjectService();