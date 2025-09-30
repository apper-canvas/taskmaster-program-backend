import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";
import { toast } from "react-toastify";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [taskData, projectData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      setTasks(taskData);
      setProjects(projectData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTaskStatusUpdate = async (taskId, status) => {
    try {
      const updatedTask = await taskService.updateStatus(taskId, status);
      setTasks(tasks.map(task => task.Id === taskId ? updatedTask : task));
      toast.success(`Task marked as ${status.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  // Calculate metrics
const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed"
  ).length;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Recent tasks (last 7 days of activity)
  const recentTasks = tasks
    .filter(task => task.createdAt || task.completedAt)
    .sort((a, b) => new Date(b.createdAt || b.completedAt) - new Date(a.createdAt || a.completedAt))
    .slice(0, 5);

  // Today's tasks
  const todayString = format(new Date(), "yyyy-MM-dd");
  const todayTasks = tasks.filter(task => task.dueDate === todayString);

  // Active projects with progress
  const activeProjects = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.Id);
    const completedProjectTasks = projectTasks.filter(task => task.status === "Completed").length;
    const progress = projectTasks.length > 0 ? (completedProjectTasks / projectTasks.length) * 100 : 0;
    
    return {
      ...project,
      taskCount: projectTasks.length,
      completedCount: completedProjectTasks,
      progress
    };
  }).slice(0, 4);

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-slate-600">
            Here's what's happening with your tasks and projects today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon="Plus"
            onClick={() => navigate("/tasks")}
          >
            New Task
          </Button>
          <Button
            variant="primary"
            icon="BarChart3"
            onClick={() => navigate("/analytics")}
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">Total Tasks</p>
                <p className="text-3xl font-bold text-primary-900">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Completed</p>
                <p className="text-3xl font-bold text-emerald-900">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle2" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">In Progress</p>
                <p className="text-3xl font-bold text-amber-900">{inProgressTasks}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Overdue</p>
                <p className="text-3xl font-bold text-red-900">{overdueTasks}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
                Today's Tasks
              </CardTitle>
              <Badge variant="primary">{todayTasks.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
{todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle2" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tasks due today</p>
                <p className="text-sm text-slate-400">You're all caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.slice(0, 4).map(task => (
<div key={task.Id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{task.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <StatusBadge status={task.status} />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    {task.status !== "Completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="CheckCircle2"
                        onClick={() => handleTaskStatusUpdate(task.Id, "Completed")}
                        className="text-emerald-600 hover:text-emerald-700"
                      />
                    )}
                  </div>
                ))}
                {todayTasks.length > 4 && (
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/tasks")}>
                    View {todayTasks.length - 4} more tasks
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Activity" className="h-5 w-5 text-primary-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Inbox" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
{recentTasks.map(task => (
                  <div key={task.Id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <ApperIcon 
                        name={task.status === "Completed" ? "CheckCircle2" : "Circle"} 
                        className="h-4 w-4 text-slate-600" 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{task.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <StatusBadge status={task.status} />
                        <span>•</span>
                        <span>{formatRelativeDate(task.completedAt || task.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="FolderOpen" className="h-5 w-5 text-primary-600" />
              Project Progress
            </CardTitle>
            <Button variant="ghost" onClick={() => navigate("/projects")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeProjects.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="FolderPlus" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No projects yet</p>
              <Button variant="primary" className="mt-3" onClick={() => navigate("/projects")}>
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeProjects.map(project => (
                <div key={project.Id} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{project.name}</h4>
                      <p className="text-sm text-slate-600">{project.taskCount} tasks</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">
                        {Math.round(project.progress)}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar 
                    value={project.progress} 
                    variant={project.progress === 100 ? "success" : project.progress > 75 ? "primary" : "warning"}
                  />
                  <div className="text-sm text-slate-600">
                    {project.completedCount} of {project.taskCount} tasks completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Productivity Summary */}
      <Card className="bg-gradient-to-br from-slate-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary-600" />
            Productivity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {Math.round(completionRate)}%
              </div>
              <p className="text-sm text-slate-600">Overall Completion Rate</p>
              <ProgressBar value={completionRate} className="mt-3" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {projects.length}
              </div>
              <p className="text-sm text-slate-600">Active Projects</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0).toFixed(1)}h
              </div>
              <p className="text-sm text-slate-600">Total Time Tracked</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}