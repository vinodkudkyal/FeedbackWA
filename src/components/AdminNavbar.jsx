import React from 'react';
import { 
  LogOut, 
  UserPlus, 
  CheckCircle,
  Building 
} from 'lucide-react';

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Building className="text-purple-600 mr-3" size={28} />
          <span className="text-xl font-bold text-gray-800">
            Admin Dashboard
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          {/* Add Faculty Button */}
          <button 
            className="flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors duration-300"
          >
            <UserPlus className="mr-2" size={20} />
            Add Faculty
          </button>

          {/* Add Students Attendance Button */}
          <button 
            className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-300"
          >
            <CheckCircle className="mr-2" size={20} />
            Student Attendance
          </button>

          <button 
            className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-300"
          >
            <CheckCircle className="mr-2" size={20} />
            Faculty CSV
          </button>

          {/* Logout Button */}
          <button 
            className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-300"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;