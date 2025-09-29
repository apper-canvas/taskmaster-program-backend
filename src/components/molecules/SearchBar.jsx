import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function SearchBar({ 
  placeholder = "Search...",
  onSearch,
  className,
  value,
  onChange
}) {
  const [localValue, setLocalValue] = useState("");
  
  const searchValue = value !== undefined ? value : localValue;
  const handleChange = onChange || setLocalValue;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-10 bg-gradient-to-r from-white to-slate-50 border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-primary-500/20 shadow-sm"
        />
      </div>
    </form>
  );
}