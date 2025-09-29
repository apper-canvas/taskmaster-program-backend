import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-vertical transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;