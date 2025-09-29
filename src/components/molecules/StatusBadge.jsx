import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

export default function StatusBadge({ status, showIcon = true }) {
  const statusConfig = {
    "To Do": {
      variant: "default",
      icon: "Circle",
      className: "status-todo"
    },
    "In Progress": {
      variant: "info",
      icon: "Clock",
      className: "status-in-progress"
    },
    "Completed": {
      variant: "success",
      icon: "CheckCircle2",
      className: "status-completed"
    },
    "Blocked": {
      variant: "danger",
      icon: "XCircle",
      className: "status-blocked"
    }
  };

  const config = statusConfig[status] || statusConfig["To Do"];

  return (
    <Badge variant={config.variant} className={`${config.className} inline-flex items-center gap-1`}>
      {showIcon && <ApperIcon name={config.icon} className="h-3 w-3" />}
      <span>{status}</span>
    </Badge>
  );
}