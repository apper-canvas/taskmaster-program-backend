import React, { useState } from "react";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

export default function TaskItem({ 
  task, 
  projectName,
  selected = false,
  onSelect,
  onUpdate,
  onDelete,
  onClick
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus) => {
    onUpdate({ status: newStatus });
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (e) => {
    if (e.target.type === "checkbox" || e.target.closest("button")) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div 
      className={`card p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
        selected ? "ring-2 ring-primary-500 ring-offset-2" : ""
      } ${isOverdue ? "border-red-200 bg-red-50/30" : ""}`}
      onClick={handleItemClick}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`font-semibold text-slate-900 ${
                  task.status === "Completed" ? "line-through text-slate-500" : ""
                }`}>
                  {task.title}
                </h3>
                {isOverdue && (
                  <Badge variant="danger" className="text-xs">
                    <ApperIcon name="AlertTriangle" className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {task.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                
                {projectName && (
                  <span className="text-slate-500">
                    <ApperIcon name="FolderOpen" className="h-3 w-3 inline mr-1" />
                    {projectName}
                  </span>
                )}
                
                {task.dueDate && (
                  <span className={`${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                    <ApperIcon name="Calendar" className="h-3 w-3 inline mr-1" />
                    {format(new Date(task.dueDate), "MMM d")}
                  </span>
                )}

                {task.estimatedTime > 0 && (
                  <span className="text-slate-500">
                    <ApperIcon name="Clock" className="h-3 w-3 inline mr-1" />
                    {task.estimatedTime}h est.
                  </span>
                )}

                {totalSubtasks > 0 && (
                  <span className="text-slate-500">
                    <ApperIcon name="CheckSquare" className="h-3 w-3 inline mr-1" />
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {totalSubtasks > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={isExpanded ? "ChevronUp" : "ChevronDown"}
                  onClick={toggleExpand}
                />
              )}
              
              <div className="flex items-center gap-1">
                {task.status !== "Completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="CheckCircle2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange("Completed");
                    }}
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                />
              </div>
            </div>
          </div>

          {/* Expanded Subtasks */}
          {isExpanded && totalSubtasks > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-slate-200 space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {
                      const updatedSubtasks = task.subtasks.map(st =>
                        st.id === subtask.id ? { ...st, completed: !st.completed } : st
                      );
                      onUpdate({ subtasks: updatedSubtasks });
                    }}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className={subtask.completed ? "line-through text-slate-500" : "text-slate-700"}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}