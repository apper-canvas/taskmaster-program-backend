import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { endOfWeek, format, isToday, startOfWeek } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Tasks from "@/components/pages/Tasks";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import CalendarGrid from "@/components/organisms/CalendarGrid";
import TaskModal from "@/components/organisms/TaskModal";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import TimeTracker from "@/components/molecules/TimeTracker";
import StatusBadge from "@/components/molecules/StatusBadge";
import timeService from "@/services/api/timeService";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
const loadData = async () => {
    try {
      const [taskData, projectData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      setTasks(taskData);
      setProjects(projectData);
      updateSelectedDateTasks(taskData);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const updateSelectedDateTasks = (taskData) => {
    const dateString = format(selectedDate, "yyyy-MM-dd");
    const dateTasks = taskData.filter(task => task.dueDate === dateString);
    setSelectedDateTasks(dateTasks);
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  useEffect(() => {
    updateSelectedDateTasks(tasks);
  }, [selectedDate, tasks]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      // Set due date to selected date if creating new task
      if (!selectedTask) {
        taskData.dueDate = format(selectedDate, "yyyy-MM-dd");
      }

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

  const handleTaskStatusUpdate = async (taskId, status) => {
    try {
      await taskService.updateStatus(taskId, status);
      setRefreshKey(prev => prev + 1);
      toast.success(`Task marked as ${status.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleTimeUpdate = async (taskId, minutes) => {
    try {
      await timeService.create({
        taskId,
        startTime: new Date(Date.now() - minutes * 60 * 1000).toISOString(),
        endTime: new Date().toISOString(),
        duration: minutes / 60
      });
      
      await taskService.addTimeEntry(taskId, minutes / 60);
      setRefreshKey(prev => prev + 1);
      toast.success(`Added ${minutes} minutes to task`);
    } catch (err) {
      toast.error("Failed to track time");
    }
  };
const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project ? project.name : "No Project";
  };

  // Get tasks for current week
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Calendar</h1>
          <p className="text-slate-600">
            View and schedule your tasks across the calendar.
          </p>
        </div>
        <Button 
          onClick={handleCreateTask}
          variant="primary"
          icon="Plus"
          className="shadow-lg hover:shadow-xl"
        >
          Schedule Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <CalendarGrid
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onTaskClick={handleTaskClick}
          />
        </div>

        {/* Selected Date Tasks */}
        <div className="space-y-6">
          {/* Date Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
                {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE, MMM d")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? "s" : ""} scheduled
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Plus"
                  onClick={handleCreateTask}
                >
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks for Selected Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-3">No tasks scheduled</p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Plus"
                    onClick={handleCreateTask}
                  >
                    Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateTasks.map(task => (
<div key={task.Id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{task.title}</h4>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{task.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Edit2"
                            onClick={() => handleTaskClick(task)}
                          />
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
                      </div>
                      
                      {task.projectId && (
                        <div className="text-sm text-slate-600 mb-3 flex items-center gap-1">
                          <ApperIcon name="FolderOpen" className="h-4 w-4" />
                          {getProjectName(task.projectId)}
                        </div>
                      )}
                      

                      {/* Time Tracking */}
                      {task.status === "In Progress" && (
                        <div className="pt-3 border-t border-slate-200">
                          <TimeTracker
                            onTimeUpdate={(minutes) => handleTimeUpdate(task.Id, minutes)}
                            className="bg-slate-50"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Week Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-primary-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Tasks</span>
                  <Badge variant="primary">{weekTasks.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Completed</span>
                  <Badge variant="success">
                    {weekTasks.filter(task => task.status === "Completed").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">In Progress</span>
                  <Badge variant="warning">
                    {weekTasks.filter(task => task.status === "In Progress").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Overdue</span>
                  <Badge variant="danger">
                    {weekTasks.filter(task => 
                      new Date(task.dueDate) < new Date() && task.status !== "Completed"
                    ).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        projects={projects}
        onSave={handleSaveTask}
      />
    </div>
  );
}