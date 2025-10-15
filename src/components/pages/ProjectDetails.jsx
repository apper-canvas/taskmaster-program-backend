import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ProgressBar from "@/components/molecules/ProgressBar";
import FormField from "@/components/molecules/FormField";
import TaskItem from "@/components/organisms/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import { format, isBefore } from "date-fns";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    dueDate: "",
    assignee: "",
  });

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [projectData, allTasks] = await Promise.all([
        projectService.getById(parseInt(id)),
        taskService.getAll()
      ]);
      
      if (!projectData) {
        setError("Project not found");
        return;
      }
      
      setProject(projectData);
      setTasks(allTasks.filter(task => task.projectId === parseInt(id)));
    } catch (err) {
      setError(err.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleEditProject = () => {
    setFormData({
      name: project.name,
      description: project.description,
      color: project.color,
      dueDate: project.dueDate || "",
      assignee: project.assignee?.Id?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setModalLoading(true);
    try {
      const updatedProject = await projectService.update(parseInt(id), formData);
      setProject(updatedProject);
      setIsEditModalOpen(false);
      toast.success("Project updated successfully");
    } catch (err) {
      toast.error("Failed to update project");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`Are you sure you want to delete "${project.name}"? This will not delete the tasks in this project.`)) {
      return;
    }

    try {
      await projectService.delete(parseInt(id));
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      const updatedTask = await taskService.update(taskId, updateData);
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const colorOptions = [
    { value: "#3b82f6", name: "Blue", class: "bg-blue-500" },
    { value: "#10b981", name: "Green", class: "bg-emerald-500" },
    { value: "#f59e0b", name: "Amber", class: "bg-amber-500" },
    { value: "#ef4444", name: "Red", class: "bg-red-500" },
    { value: "#8b5cf6", name: "Purple", class: "bg-violet-500" },
    { value: "#06b6d4", name: "Cyan", class: "bg-cyan-500" },
    { value: "#f97316", name: "Orange", class: "bg-orange-500" },
    { value: "#84cc16", name: "Lime", class: "bg-lime-500" }
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (!project) {
    return (
      <Empty
        title="Project not found"
        description="The project you're looking for doesn't exist or has been deleted"
        action={() => navigate("/projects")}
        actionLabel="Back to Projects"
        icon="FolderX"
      />
    );
  }

  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isOverdue = project.dueDate && isBefore(new Date(project.dueDate), new Date());
  const isDueSoon = project.dueDate && !isOverdue && isBefore(new Date(project.dueDate), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const statusCounts = {
    "To Do": tasks.filter(task => task.status === "To Do").length,
    "In Progress": tasks.filter(task => task.status === "In Progress").length,
    "Completed": completedTasks,
    "Blocked": tasks.filter(task => task.status === "Blocked").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate("/projects")}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h1>
            <p className="text-slate-600">{project.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon="Edit2"
            onClick={handleEditProject}
          >
            Edit Project
          </Button>
          <Button
            variant="ghost"
            icon="Trash2"
            onClick={handleDeleteProject}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Project Color Stripe */}
      <div 
        className="h-2 w-full rounded-lg" 
        style={{ backgroundColor: project.color }}
      />

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900">{Math.round(progress)}%</div>
              <ProgressBar 
                value={progress} 
                variant={progress === 100 ? "success" : progress > 75 ? "primary" : "warning"}
              />
              <p className="text-sm text-slate-600">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600">Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            {project.dueDate ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" className="h-5 w-5 text-slate-500" />
                  <span className={`text-lg font-semibold ${
                    isOverdue ? "text-red-600" : 
                    isDueSoon ? "text-amber-600" : 
                    "text-slate-900"
                  }`}>
                    {format(new Date(project.dueDate), "MMM d, yyyy")}
                  </span>
                </div>
                {isOverdue && (
                  <Badge variant="danger">Overdue</Badge>
                )}
                {isDueSoon && !isOverdue && (
                  <Badge variant="warning">Due Soon</Badge>
                )}
              </div>
            ) : (
              <p className="text-slate-500">No due date set</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600">Task Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{status}</span>
                  <Badge 
                    variant={
                      status === "Completed" ? "success" :
                      status === "In Progress" ? "info" :
                      status === "Blocked" ? "danger" :
                      "default"
                    }
                  >
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => navigate("/tasks")}
          >
            Add Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <Empty
            title="No tasks yet"
            description="Create your first task for this project"
            action={() => navigate("/tasks")}
            actionLabel="Create Task"
            icon="ListTodo"
          />
        ) : (
          <div className="space-y-4">
            {["To Do", "In Progress", "Blocked", "Completed"].map(status => {
              const statusTasks = tasks.filter(task => task.status === status);
              if (statusTasks.length === 0) return null;

              return (
                <div key={status}>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    {status}
                    <Badge 
                      variant={
                        status === "Completed" ? "success" :
                        status === "In Progress" ? "info" :
                        status === "Blocked" ? "danger" :
                        "default"
                      }
                    >
                      {statusTasks.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {statusTasks.map(task => (
                      <TaskItem
                        key={task.Id}
                        task={task}
                        onEdit={(updatedTask) => handleTaskUpdate(task.Id, updatedTask)}
                        onDelete={() => handleTaskDelete(task.Id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Edit Project</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                icon="X" 
                onClick={() => setIsEditModalOpen(false)} 
              />
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-6">
              <FormField
                label="Project Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name..."
              />

              <FormField
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project..."
                className="min-h-20"
              />

              <FormField
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />

              <FormField
                label="Assignee"
                type="select"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              >
                <option value="">No Assignee</option>
              </FormField>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Project Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-8 h-8 rounded-lg ${color.class} transition-all duration-200 ${
                        formData.color === color.value 
                          ? "ring-2 ring-offset-2 ring-slate-400 scale-110" 
                          : "hover:scale-105"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveProject}
                loading={modalLoading}
                icon="Save"
              >
                Update Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}