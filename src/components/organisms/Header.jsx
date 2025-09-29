import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Header({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          icon="Menu"
          onClick={onMenuClick}
          className="lg:hidden"
        />
        
        <div className="lg:hidden flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            TaskMaster Pro
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon="Bell">
          <span className="hidden sm:inline">Notifications</span>
        </Button>
        
        <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          U
        </div>
      </div>
    </header>
  );
}