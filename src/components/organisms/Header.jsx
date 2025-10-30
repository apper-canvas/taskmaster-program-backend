import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

export default function Header({ onMobileMenuToggle }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          icon="Menu"
          onClick={onMobileMenuToggle}
          className="lg:hidden"
        />
        <h1 className="hidden sm:block text-xl font-bold text-slate-900">
          TaskMaster Pro
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          icon="Bell"
          className="hidden sm:flex"
        />
        
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-slate-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-slate-500">
                {user.emailAddress}
              </div>
            </div>
            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          icon="LogOut"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Logout"
        />
      </div>
    </header>
  );
}