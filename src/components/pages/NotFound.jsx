import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="h-10 w-10 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-slate-900">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700">Page Not Found</h2>
          </div>

          {/* Message */}
          <p className="text-slate-600">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Button */}
          <div className="pt-4">
            <Link to="/">
              <Button 
                variant="primary" 
                className="w-full"
              >
                <ApperIcon name="Home" className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Additional Links */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-3">Quick Links:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link 
                to="/tasks" 
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Tasks
              </Link>
              <span className="text-slate-300">•</span>
              <Link 
                to="/projects" 
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Projects
              </Link>
              <span className="text-slate-300">•</span>
              <Link 
                to="/calendar" 
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}