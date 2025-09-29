import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ProgressBar from "@/components/molecules/ProgressBar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, isAfter, isBefore } from "date-fns";

export default function ProjectCard({ 
  project, 
  tasks = [],
  onView,
  onEdit,
  onDelete
}) {
  const projectTasks = tasks.filter(task => task.projectId === project.Id);
  const completedTasks = projectTasks.filter(task => task.status === "Completed").length;
  const totalTasks = projectTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const isOverdue = project.dueDate && isBefore(new Date(project.dueDate), new Date());
  const isDueSoon = project.dueDate && !isOverdue && isBefore(new Date(project.dueDate), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const statusCounts = {
    "To Do": projectTasks.filter(task => task.status === "To Do").length,
    "In Progress": projectTasks.filter(task => task.status === "In Progress").length,
    "Completed": completedTasks,
    "Blocked": projectTasks.filter(task => task.status === "Blocked").length
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <div 
        className="h-2 w-full" 
        style={{ backgroundColor: project.color }}
      />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-900 mb-2">
              {project.name}
            </CardTitle>
            <p className="text-sm text-slate-600 line-clamp-2">
{project.description}
            </p>
            {project.assignee && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <ApperIcon name="User" className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">{project.assignee}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Eye"
              onClick={() => onView(project)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Edit2"
              onClick={() => onEdit(project)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete(project)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-700">Progress</span>
            <span className="text-slate-600">{Math.round(progress)}%</span>
          </div>
          <ProgressBar 
            value={progress} 
            variant={progress === 100 ? "success" : progress > 75 ? "primary" : "warning"}
          />
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalTasks}</div>
            <div className="text-sm text-slate-600">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{completedTasks}</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => {
            if (count === 0) return null;
            
            const variants = {
              "To Do": "default",
              "In Progress": "info", 
              "Completed": "success",
              "Blocked": "danger"
            };
            
            return (
              <Badge key={status} variant={variants[status]} className="text-xs">
                {status}: {count}
              </Badge>
            );
          })}
        </div>

        {/* Due Date */}
        {project.dueDate && (
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" className="h-4 w-4 text-slate-500" />
            <span className={`text-sm ${
              isOverdue ? "text-red-600 font-medium" : 
              isDueSoon ? "text-amber-600 font-medium" : 
              "text-slate-600"
            }`}>
              Due {format(new Date(project.dueDate), "MMM d, yyyy")}
            </span>
            {isOverdue && (
              <Badge variant="danger" className="text-xs">
                Overdue
              </Badge>
            )}
            {isDueSoon && !isOverdue && (
              <Badge variant="warning" className="text-xs">
                Due Soon
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-slate-200">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => onView(project)}
            icon="ArrowRight"
          >
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}