import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}