import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function MobileSidebar({ isOpen, onClose }) {
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

  React.useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 w-72 h-full bg-white border-r border-slate-200 shadow-xl lg:hidden transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-slate-600" />
          </button>
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
    </>
  );
}