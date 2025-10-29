import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  MessageCircle
} from 'lucide-react';

const TeacherNavbar = () => {
  const [teacherName] = useState('Prof. Emily Rodriguez');

  // Navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: Home 
    },
    { 
      name: 'Course Exit Survey', 
      icon: BookOpen 
    },
    { 
      name: 'Individual Feedback', 
      icon: MessageCircle 
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Faculty Dashboard Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BarChart2 className="h-8 w-8 text-purple-600 mr-3" />
              <span className="text-xl font-bold text-gray-800">
                Faculty Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links - Centered */}
          <div className="flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="
                  px-3 py-2 rounded-md text-sm font-medium 
                  flex items-center 
                  transition-all duration-300
                  text-gray-600 hover:bg-gray-100 hover:text-gray-900
                  cursor-pointer
                "
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </div>
            ))}
          </div>

          {/* Login/Profile Section - Rightmost */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-3 text-sm font-medium text-gray-700">
                Login
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-700 font-bold">
                  {teacherName.charAt(5)}
                  {teacherName.charAt(6)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;