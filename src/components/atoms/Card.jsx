import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("card p-6", className)}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-slate-900", className)}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    />
  );
});

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };