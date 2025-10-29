import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Bell, 
  User, 
  LogOut, 
  Calendar,
  Settings
} from 'lucide-react';

const LoginNavbar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState(3); // Example notification count

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'feedback', label: 'Submit Feedback', icon: <FileText size={20} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-white font-bold text-2xl">
                StudentScope
              </h1>
              <span className="text-white/80 text-sm font-medium hidden sm:block">
                | Student Dashboard
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Main Navigation */}
              <div className="flex space-x-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${activeTab === item.id 
                        ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                        : 'text-white hover:bg-white/20'
                      }
                    `}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-white hover:bg-white/20 rounded-lg">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Settings */}
              <button className="p-2 text-white hover:bg-white/20 rounded-lg">
                <Settings size={20} />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2 pl-4 border-l border-white/20">
                <button className="p-2 text-white hover:bg-white/20 rounded-lg">
                  <User size={20} />
                </button>
                <button className="p-2 text-white hover:bg-white/20 rounded-lg">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LoginNavbar;