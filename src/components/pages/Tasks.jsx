import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import TaskModal from "@/components/organisms/TaskModal";
import TaskList from "@/components/organisms/TaskList";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectData = await projectService.getAll();
        setProjects(projectData);
      } catch (err) {
        console.error("Failed to load projects:", err);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await taskService.update(selectedTask.Id, taskData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully");
      }
      
      setRefreshKey(prev => prev + 1);
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      toast.error(selectedTask ? "Failed to update task" : "Failed to create task");
      throw err;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tasks</h1>
          <p className="text-slate-600">
            Manage and organize all your tasks in one place.
          </p>
        </div>
        <Button 
          onClick={handleCreateTask}
          variant="primary"
          icon="Plus"
          className="shadow-lg hover:shadow-xl"
        >
          New Task
        </Button>
      </div>

      {/* Task List */}
      <TaskList
        key={refreshKey}
        onTaskSelect={handleEditTask}
        onTaskCreate={handleCreateTask}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
onClose={handleCloseModal}
        onSave={handleSaveTask}
        projects={projects}
/>
    </div>
  );
}