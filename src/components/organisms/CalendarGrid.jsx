import React, { useState, useEffect } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addDays,
  subDays
} from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import { cn } from "@/utils/cn";

export default function CalendarGrid({ 
  selectedDate = new Date(),
  onDateSelect,
  onTaskClick
}) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const taskData = await taskService.getAll();
      setTasks(taskData);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getTasksForDate = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return tasks.filter(task => task.dueDate === dateString);
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentMonth(subDays(monthStart, 1));
    } else {
      setCurrentMonth(addDays(monthEnd, 1));
    }
  };

  const handleDateClick = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-semibold text-slate-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronLeft"
            onClick={() => navigateMonth("prev")}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronRight"
            onClick={() => navigateMonth("next")}
          />
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-slate-600 border-r border-slate-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map(date => {
          const dayTasks = getTasksForDate(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected = isSameDay(date, selectedDate);
          const isPastDate = date < new Date() && !isToday(date);
          
          return (
            <div
              key={date.toISOString()}
              className={cn(
                "min-h-24 p-2 border-r border-b border-slate-200 last:border-r-0 cursor-pointer transition-all duration-200 hover:bg-slate-50",
                !isCurrentMonth && "bg-slate-50/50 text-slate-400",
                isSelected && "bg-primary-50 ring-1 ring-primary-200",
                isToday(date) && "bg-gradient-to-br from-primary-100 to-primary-50 font-semibold"
              )}
              onClick={() => handleDateClick(date)}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  isToday(date) && "text-primary-700",
                  !isCurrentMonth && "text-slate-400",
                  isPastDate && isCurrentMonth && "text-slate-500"
                )}>
                  {format(date, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <Badge variant="primary" className="text-xs h-5 px-1.5">
                    {dayTasks.length}
                  </Badge>
                )}
              </div>
              
              {/* Tasks for this date */}
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map(task => {
                  const priorityColors = {
                    "Low": "bg-slate-200 text-slate-700",
                    "Medium": "bg-amber-200 text-amber-800",
                    "High": "bg-red-200 text-red-800",
                    "Urgent": "bg-red-300 text-red-900"
                  };
                  
                  return (
                    <div
                      key={task.Id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick && onTaskClick(task);
                      }}
                      className={cn(
                        "text-xs px-2 py-1 rounded text-left truncate cursor-pointer hover:scale-[1.02] transition-transform",
                        priorityColors[task.priority] || "bg-slate-200 text-slate-700"
                      )}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  );
                })}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-slate-500 text-center">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <ApperIcon name="Loader2" className="h-6 w-6 animate-spin text-primary-600" />
        </div>
      )}
    </div>
  );
}