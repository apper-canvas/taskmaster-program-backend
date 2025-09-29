import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7days");

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
  const totalTimeTracked = tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);
  const avgTimePerTask = completedTasks > 0 ? totalTimeTracked / completedTasks : 0;

  // Task Status Distribution
  const statusDistribution = [
    { status: "To Do", count: tasks.filter(task => task.status === "To Do").length, color: "#64748b" },
    { status: "In Progress", count: inProgressTasks, color: "#3b82f6" },
    { status: "Completed", count: completedTasks, color: "#10b981" },
    { status: "Blocked", count: tasks.filter(task => task.status === "Blocked").length, color: "#ef4444" }
  ].filter(item => item.count > 0);

  // Priority Distribution
  const priorityDistribution = [
    { priority: "Low", count: tasks.filter(task => task.priority === "Low").length, color: "#64748b" },
    { priority: "Medium", count: tasks.filter(task => task.priority === "Medium").length, color: "#f59e0b" },
    { priority: "High", count: tasks.filter(task => task.priority === "High").length, color: "#ef4444" },
    { priority: "Urgent", count: tasks.filter(task => task.priority === "Urgent").length, color: "#dc2626" }
  ].filter(item => item.count > 0);

  // Productivity Trends (last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const productivityData = last7Days.map(date => {
    const dateString = format(date, "yyyy-MM-dd");
    const completedOnDate = tasks.filter(task => task.completedAt === dateString).length;
    const createdOnDate = tasks.filter(task => task.createdAt === dateString).length;
    
    return {
      date: format(date, "MMM d"),
      completed: completedOnDate,
      created: createdOnDate
    };
  });

  // Project Progress
  const projectProgress = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.Id);
    const completedProjectTasks = projectTasks.filter(task => task.status === "Completed").length;
    const progress = projectTasks.length > 0 ? (completedProjectTasks / projectTasks.length) * 100 : 0;
    
    return {
      ...project,
      taskCount: projectTasks.length,
      completedCount: completedProjectTasks,
      progress
    };
  }).sort((a, b) => b.progress - a.progress);

  // Chart options
  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false }
    },
    colors: statusDistribution.map(item => item.color),
    labels: statusDistribution.map(item => item.status),
    legend: {
      position: "bottom",
      fontSize: "14px"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%"
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%";
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: "bottom" }
      }
    }]
  };

  const trendChartOptions = {
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ["#10b981", "#3b82f6"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    xaxis: {
      categories: productivityData.map(item => item.date),
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "#f1f5f9"
    },
    legend: {
      position: "top",
      fontSize: "14px"
    }
  };

  const trendChartSeries = [
    {
      name: "Completed",
      data: productivityData.map(item => item.completed)
    },
    {
      name: "Created", 
      data: productivityData.map(item => item.created)
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
          <p className="text-slate-600">
            Insights into your productivity and task completion patterns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </Select>
          <Button variant="secondary" icon="Download">
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">Completion Rate</p>
                <p className="text-3xl font-bold text-primary-900">{Math.round(completionRate)}%</p>
                <p className="text-xs text-primary-600 mt-1">{completedTasks} of {totalTasks} tasks</p>
              </div>
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Time Tracked</p>
                <p className="text-3xl font-bold text-emerald-900">{totalTimeTracked.toFixed(1)}h</p>
                <p className="text-xs text-emerald-600 mt-1">Total across all tasks</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Avg Time/Task</p>
                <p className="text-3xl font-bold text-amber-900">{avgTimePerTask.toFixed(1)}h</p>
                <p className="text-xs text-amber-600 mt-1">Per completed task</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Overdue Tasks</p>
                <p className="text-3xl font-bold text-red-900">{overdueTasks}</p>
                <p className="text-xs text-red-600 mt-1">Need attention</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="PieChart" className="h-5 w-5 text-primary-600" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusDistribution.length > 0 ? (
              <Chart
                options={chartOptions}
                series={statusDistribution.map(item => item.count)}
                type="donut"
                height={300}
              />
            ) : (
              <div className="text-center py-8 text-slate-500">
                No task data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productivity Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary-600" />
              Productivity Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={trendChartOptions}
              series={trendChartSeries}
              type="area"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-primary-600" />
              Priority Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-900">{item.priority}</span>
                  </div>
                  <Badge variant="default">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="FolderOpen" className="h-5 w-5 text-primary-600" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectProgress.slice(0, 5).map(project => (
                <div key={project.Id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="font-medium text-slate-900">{project.name}</span>
                    </div>
                    <span className="text-sm text-slate-600">
                      {Math.round(project.progress)}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={project.progress} 
                    variant={project.progress === 100 ? "success" : project.progress > 75 ? "primary" : "warning"}
                  />
                  <div className="text-xs text-slate-500">
                    {project.completedCount} of {project.taskCount} tasks completed
                  </div>
                </div>
              ))}
              
              {projectProgress.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No projects to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Tracking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Clock" className="h-5 w-5 text-primary-600" />
            Time Tracking Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {totalTimeTracked.toFixed(1)}h
              </div>
              <p className="text-sm text-slate-600">Total Time Tracked</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {avgTimePerTask.toFixed(1)}h
              </div>
              <p className="text-sm text-slate-600">Average per Task</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {tasks.filter(task => task.actualTime > 0).length}
              </div>
              <p className="text-sm text-slate-600">Tasks with Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}