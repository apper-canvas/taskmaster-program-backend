import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

export default function Empty({ 
  title = "No items found",
  description = "Get started by creating your first item",
  action,
  actionLabel = "Create New",
  icon = "Inbox",
  className
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl mb-6 shadow-sm border border-slate-200">
        <ApperIcon name={icon} className="h-16 w-16 text-slate-400 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-8 max-w-md">{description}</p>
      {action && (
        <Button 
          onClick={action}
          variant="primary"
          icon="Plus"
          className="shadow-lg hover:shadow-xl"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}