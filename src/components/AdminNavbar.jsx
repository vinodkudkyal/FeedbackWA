import React, { useState } from 'react';
import { 
  LogOut, 
  UserPlus, 
  CheckCircle,
  Building,
  Menu,
  X
} from 'lucide-react';

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <Building className="text-purple-600" size={28} />
          <span className="text-xl font-bold text-gray-800">Admin Dashboard</span>
        </div>

        {/* Desktop Navigation Buttons (hidden on small screens) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Add Faculty Button */}
          <button className="flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors duration-300">
            <UserPlus className="mr-2" size={20} />
            Add Faculty
          </button>

          {/* Student Attendance */}
          <button className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-300">
            <CheckCircle className="mr-2" size={20} />
            Student Attendance
          </button>

          {/* Faculty CSV */}
          <button className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-300">
            <CheckCircle className="mr-2" size={20} />
            Faculty CSV
          </button>

          {/* Logout Button */}
          <button className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-300">
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-md bg-gray-100"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} aria-hidden />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building className="text-purple-600" size={20} />
                <span className="font-semibold">Admin Menu</span>
              </div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-2 rounded-md">
                <X />
              </button>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md bg-purple-50 text-purple-700">
                <UserPlus size={18} />
                <span>Add Faculty</span>
              </button>
              <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700">
                <CheckCircle size={18} />
                <span>Student Attendance</span>
              </button>
              <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700">
                <CheckCircle size={18} />
                <span>Faculty CSV</span>
              </button>
              <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md bg-red-50 text-red-700">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
   );
 };

 export default AdminNavbar;