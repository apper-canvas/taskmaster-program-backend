import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm font-medium rounded-lg",
    md: "px-4 py-2 text-base font-medium rounded-lg",
    lg: "px-6 py-3 text-lg font-semibold rounded-xl"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;