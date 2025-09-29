import React from "react";
import { cn } from "@/utils/cn";

export default function Loading({ className, type = "page" }) {
  if (type === "card") {
    return (
      <div className={cn("card p-6 animate-pulse", className)}>
        <div className="space-y-4">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/4"></div>
          <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-slate-200 animate-pulse">
            <div className="h-4 w-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
            </div>
            <div className="h-6 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full"></div>
            <div className="h-6 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
          <div className="w-12 h-12 rounded-full border-4 border-primary-600 border-t-transparent absolute top-0 left-0 animate-spin"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded w-32 mx-auto"></div>
          <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded w-24 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}