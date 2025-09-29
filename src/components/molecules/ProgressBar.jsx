import React from "react";
import { cn } from "@/utils/cn";

export default function ProgressBar({ 
  value, 
  max = 100, 
  className,
  size = "md",
  variant = "primary",
  showLabel = false 
}) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3"
  };

  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    warning: "bg-gradient-to-r from-amber-500 to-amber-600",
    danger: "bg-gradient-to-r from-red-500 to-red-600"
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-slate-700">Progress</span>
          <span className="text-slate-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-slate-200 rounded-full overflow-hidden", sizes[size], className)}>
        <div
          className={cn("transition-all duration-500 ease-out rounded-full", variants[variant], sizes[size])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}