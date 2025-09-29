import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

export default function FormField({ 
  label,
  type = "text",
  error,
  required = false,
  className,
  children,
  ...props 
}) {
  const id = props.id || `field-${Math.random().toString(36).substr(2, 9)}`;

  const renderInput = () => {
    if (children) return children;
    
    switch (type) {
      case "textarea":
        return <Textarea id={id} {...props} />;
      case "select":
        return <Select id={id} {...props} />;
      default:
        return <Input type={type} id={id} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}