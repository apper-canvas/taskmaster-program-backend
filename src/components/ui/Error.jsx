import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

export default function Error({ 
  message = "Something went wrong", 
  onRetry,
  className,
  type = "page"
}) {
  if (type === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200", className)}>
        <ApperIcon name="AlertCircle" className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="ml-auto text-red-700 hover:text-red-800 hover:bg-red-100"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl mb-6 shadow-lg">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-500 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-slate-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
          className="shadow-lg hover:shadow-xl"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}