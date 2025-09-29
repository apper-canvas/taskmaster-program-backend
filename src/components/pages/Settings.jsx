import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

export default function Settings() {
  const [preferences, setPreferences] = useState({
    theme: "system",
    timeFormat: "24h",
    dateFormat: "MM/dd/yyyy",
    defaultView: "dashboard",
    notifications: {
      email: true,
      browser: true,
      dueDates: true,
      overdue: true,
      completed: false
    },
    workHours: {
      start: "09:00",
      end: "17:00",
      timezone: "America/New_York"
    }
  });

  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const handleSavePreferences = () => {
    // In a real app, this would save to backend/localStorage
    toast.success("Preferences saved successfully!");
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would generate and download actual data
      const exportData = {
        tasks: [],
        projects: [],
        timeEntries: [],
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      toast.success("Data exported successfully!");
    } catch (err) {
      toast.error("Failed to export data");
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would restore actual data
      toast.success("Data imported successfully!");
    } catch (err) {
      toast.error("Failed to import data. Please check the file format.");
    } finally {
      setImportLoading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const updatePreference = (path, value) => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      const keys = path.split('.');
      let current = newPrefs;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newPrefs;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">
          Customize your TaskMaster Pro experience and manage your data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Settings" className="h-5 w-5 text-primary-600" />
              General Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              label="Theme"
              type="select"
              value={preferences.theme}
              onChange={(e) => updatePreference('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </FormField>

            <FormField
              label="Time Format"
              type="select"
              value={preferences.timeFormat}
              onChange={(e) => updatePreference('timeFormat', e.target.value)}
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </FormField>

            <FormField
              label="Date Format"
              type="select"
              value={preferences.dateFormat}
              onChange={(e) => updatePreference('dateFormat', e.target.value)}
            >
              <option value="MM/dd/yyyy">MM/DD/YYYY</option>
              <option value="dd/MM/yyyy">DD/MM/YYYY</option>
              <option value="yyyy-MM-dd">YYYY-MM-DD</option>
            </FormField>

            <FormField
              label="Default View"
              type="select"
              value={preferences.defaultView}
              onChange={(e) => updatePreference('defaultView', e.target.value)}
            >
              <option value="dashboard">Dashboard</option>
              <option value="tasks">Tasks</option>
              <option value="calendar">Calendar</option>
              <option value="projects">Projects</option>
            </FormField>

            <Button onClick={handleSavePreferences} variant="primary" icon="Save">
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Bell" className="h-5 w-5 text-primary-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Email Notifications</label>
                  <p className="text-sm text-slate-600">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) => updatePreference('notifications.email', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Browser Notifications</label>
                  <p className="text-sm text-slate-600">Show browser push notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.browser}
                  onChange={(e) => updatePreference('notifications.browser', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Due Date Reminders</label>
                  <p className="text-sm text-slate-600">Get reminded before tasks are due</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.dueDates}
                  onChange={(e) => updatePreference('notifications.dueDates', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Overdue Alerts</label>
                  <p className="text-sm text-slate-600">Alert when tasks become overdue</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.overdue}
                  onChange={(e) => updatePreference('notifications.overdue', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-slate-900">Task Completions</label>
                  <p className="text-sm text-slate-600">Notify when tasks are completed</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications.completed}
                  onChange={(e) => updatePreference('notifications.completed', e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            </div>

            <Button onClick={handleSavePreferences} variant="secondary" icon="Save">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Work Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Clock" className="h-5 w-5 text-primary-600" />
              Work Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Time"
                type="time"
                value={preferences.workHours.start}
                onChange={(e) => updatePreference('workHours.start', e.target.value)}
              />
              
              <FormField
                label="End Time"
                type="time"
                value={preferences.workHours.end}
                onChange={(e) => updatePreference('workHours.end', e.target.value)}
              />
            </div>

            <FormField
              label="Timezone"
              type="select"
              value={preferences.workHours.timezone}
              onChange={(e) => updatePreference('workHours.timezone', e.target.value)}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </FormField>

            <Button onClick={handleSavePreferences} variant="secondary" icon="Save">
              Save Work Hours
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Database" className="h-5 w-5 text-primary-600" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Export Data</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Download all your tasks, projects, and time entries as a JSON file.
                </p>
                <Button 
                  onClick={handleExportData}
                  variant="secondary"
                  icon="Download"
                  loading={exportLoading}
                >
                  Export All Data
                </Button>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-medium text-slate-900 mb-2">Import Data</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Import tasks and projects from a JSON backup file.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                    id="import-file"
                  />
                  <Button 
                    variant="secondary"
                    icon="Upload"
                    loading={importLoading}
                    onClick={() => document.getElementById('import-file')?.click()}
                  >
                    Import Data
                  </Button>
                  <Badge variant="warning" className="text-xs">
                    <ApperIcon name="AlertTriangle" className="h-3 w-3 mr-1" />
                    Beta Feature
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Info */}
      <Card className="bg-gradient-to-br from-slate-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Info" className="h-5 w-5 text-primary-600" />
            Application Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 mb-1">TaskMaster Pro</div>
              <p className="text-sm text-slate-600">Version 1.0.0</p>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 mb-1">React + Vite</div>
              <p className="text-sm text-slate-600">Built with modern tools</p>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 mb-1">Open Source</div>
              <p className="text-sm text-slate-600">MIT License</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}