import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function Sidebar({ className }) {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard"
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: "CheckSquare"
    },
    {
      name: "Projects",
      href: "/projects", 
      icon: "FolderOpen"
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: "Calendar"
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: "BarChart3"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "Settings"
    }
  ];

  return (
    <aside className={cn("bg-white border-r border-slate-200 shadow-sm", className)}>
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              TaskMaster Pro
            </h1>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm border border-primary-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary-600" : "text-slate-500"
                )}
              />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}