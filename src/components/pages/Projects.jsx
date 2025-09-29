import React, { useState, useEffect } from "react";
import ProjectCard from "@/components/organisms/ProjectCard";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    dueDate: "",
    assignee: ""
  });

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [projectData, taskData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectData);
      setTasks(taskData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleCreateProject = () => {
    setSelectedProject(null);
    setFormData({
      name: "",
      description: "",
      color: "#3b82f6",
      dueDate: "",
      assignee: ""
    });
    setIsModalOpen(true);
  };

const handleEditProject = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      color: project.color,
      dueDate: project.dueDate || "",
      assignee: project.assignee || ""
    });
    setIsModalOpen(true);
  };

const handleViewProject = (project) => {
    navigate(`/tasks?project=${project.Id}`);
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.name}"? This will not delete the tasks in this project.`)) {
      return;
    }

    try {
      await projectService.delete(project.Id);
      setProjects(projects.filter(p => p.Id !== project.Id));
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setModalLoading(true);
    try {
      if (selectedProject) {
        const updatedProject = await projectService.update(selectedProject.Id, formData);
        setProjects(projects.map(p => p.Id === selectedProject.Id ? updatedProject : p));
        toast.success("Project updated successfully");
      } else {
        const newProject = await projectService.create(formData);
        setProjects([newProject, ...projects]);
        toast.success("Project created successfully");
      }
      
      setIsModalOpen(false);
    } catch (err) {
      toast.error(selectedProject ? "Failed to update project" : "Failed to create project");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Projects</h1>
          <p className="text-slate-600">
            Organize your tasks into projects for better management.
          </p>
        </div>
        <Button 
          onClick={handleCreateProject}
          variant="primary"
          icon="Plus"
          className="shadow-lg hover:shadow-xl"
        >
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search projects..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title={searchQuery ? "No projects found" : "No projects yet"}
          description={searchQuery ? "Try adjusting your search terms" : "Create your first project to get started organizing your tasks"}
          action={searchQuery ? undefined : handleCreateProject}
          actionLabel="Create Project"
          icon="FolderOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.Id}
              project={project}
              tasks={tasks}
              onView={handleViewProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedProject ? "Edit Project" : "Create New Project"}
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                icon="X" 
                onClick={() => setIsModalOpen(false)} 
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
                type="text"
                placeholder="Enter team member name"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              />
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
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveProject}
                loading={modalLoading}
                icon="Save"
              >
                {selectedProject ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}