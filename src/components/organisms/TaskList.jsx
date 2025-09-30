import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Projects from "@/components/pages/Projects";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import TaskItem from "@/components/organisms/TaskItem";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";

export default function TaskList({ 
  showFilters = true, 
  projectId = null,
  onTaskSelect,
  onTaskCreate
}) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Sample assignees - in a real app, this would come from a user service
  const loadTasks = async () => {
    try {
      setError("");
      setLoading(true);
      
      let taskData;
      if (projectId) {
        taskData = await taskService.getByProjectId(projectId);
      } else {
        taskData = await taskService.getAll();
      }
      
      setTasks(taskData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const projectData = await projectService.getAll();
      setProjects(projectData);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  useEffect(() => {
    loadTasks();
    if (!projectId) {
      loadProjects();
    }
  }, [projectId]);

  const handleTaskUpdate = async (taskId, updateData) => {
    try {
      const updatedTask = await taskService.update(taskId, updateData);
      setTasks(tasks.map(task => task.Id === taskId ? updatedTask : task));
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(task => task.Id !== taskId));
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedTasks.length === 0) return;
    
    try {
      const updates = selectedTasks.map(taskId => 
        taskService.updateStatus(taskId, status)
      );
      await Promise.all(updates);
      
      setTasks(tasks.map(task => 
        selectedTasks.includes(task.Id) 
          ? { ...task, status, completedAt: status === "Completed" ? new Date().toISOString().split("T")[0] : null }
          : task
      ));
      
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update tasks");
    }
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === filteredTasks.length 
        ? [] 
        : filteredTasks.map(task => task.Id)
    );
  };

// Filter tasks
const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject = projectFilter === "all" || task.projectId === parseInt(projectFilter);
const matchesAssignee = assigneeFilter === "all" || task.assignee?.Id === parseInt(assigneeFilter);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
  });

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project ? project.name : "Unknown Project";
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadTasks}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full"
              />
            </div>
            {onTaskCreate && (
              <Button onClick={onTaskCreate} icon="Plus">
                <span className="hidden sm:inline">New Task</span>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
<Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-32"
            >
              <option value="all">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </Select>

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="min-w-32"
            >
              <option value="all">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </Select>

<Select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="min-w-36"
            >
              <option value="all">All Assignees</option>
              {/* Assignee filter options will be populated by database lookup */}
            </Select>

            {!projectId && (
              <Select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="min-w-40"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.Id} value={project.Id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Badge variant="primary">
              {selectedTasks.length} selected
            </Badge>
            <span className="text-sm text-slate-600">
              Bulk actions:
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleBulkStatusUpdate("In Progress")}
            >
              Mark In Progress
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => handleBulkStatusUpdate("Completed")}
            >
              Mark Complete
            </Button>
          </div>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description={searchQuery || statusFilter !== "all" || priorityFilter !== "all" 
            ? "No tasks match your current filters"
            : "Start by creating your first task"
          }
          action={onTaskCreate}
          actionLabel="Create Task"
          icon="CheckSquare"
        />
      ) : (
        <div className="space-y-3">
          {/* Select All */}
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
              onChange={handleSelectAll}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Select all {filteredTasks.length} tasks</span>
          </div>

          {/* Tasks */}
          {filteredTasks.map(task => (
            <TaskItem
              key={task.Id}
              task={task}
              projectName={getProjectName(task.projectId)}
              selected={selectedTasks.includes(task.Id)}
              onSelect={() => handleSelectTask(task.Id)}
              onUpdate={(updateData) => handleTaskUpdate(task.Id, updateData)}
              onDelete={() => handleTaskDelete(task.Id)}
              onClick={onTaskSelect ? () => onTaskSelect(task) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}