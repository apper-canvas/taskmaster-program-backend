import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

export default function PriorityBadge({ priority, showIcon = true }) {
  const priorityConfig = {
    "Low": {
      variant: "default",
      icon: "ArrowDown",
      className: "priority-low bg-slate-100 text-slate-700"
    },
    "Medium": {
      variant: "warning",
      icon: "Minus",
      className: "priority-medium bg-amber-100 text-amber-700"
    },
    "High": {
      variant: "danger",
      icon: "ArrowUp",
      className: "priority-high bg-red-100 text-red-700"
    },
    "Urgent": {
      variant: "danger",
      icon: "AlertTriangle",
      className: "priority-urgent bg-red-200 text-red-800 font-semibold"
    }
  };

  const config = priorityConfig[priority] || priorityConfig["Medium"];

  return (
    <Badge variant={config.variant} className={`${config.className} inline-flex items-center gap-1`}>
      {showIcon && <ApperIcon name={config.icon} className="h-3 w-3" />}
      <span>{priority}</span>
    </Badge>
  );
}