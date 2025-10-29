import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  BookOpen,
  FileText,
  Upload,
  LayoutDashboard,
  FilePlus, // New icon for Feedback Form Creation
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white w-64 shadow-lg p-4"
      >
        <div className="text-xl font-bold text-gray-900 mb-6">Admin Panel</div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                onClick={() => navigate("/admin/dashboard")} // Navigate to Dashboard
                className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <LayoutDashboard className="mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => navigate("/admin/add-faculty")} // Navigate to Add Faculty
                className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <UserPlus className="mr-2" />
                Add Faculty
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => navigate("/admin/assign-subjects")} // Navigate to Assign Subjects
                className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <BookOpen className="mr-2" />
                Assign Subjects
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => navigate("/admin/feedback-session")} // Navigate to Feedback Session
                className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FileText className="mr-2" />
                Feedback Session
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => navigate("/admin/upload-students")} // Navigate to Upload Students
                className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Upload className="mr-2" />
                Upload Students
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => navigate("/admin/create-feedback-form")} // Navigate to Feedback Form Creation
                className="flex items-center p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FilePlus className="mr-2" />
                Create Feedback Form
              </a>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {/* Statistics Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-800">
                Total Responses
              </h2>
              <p className="text-3xl font-bold text-blue-900 mt-2">1,234</p>
              <p className="text-sm text-blue-700 mt-1">
                Students who filled the feedback form
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h2 className="text-lg font-semibold text-purple-800">
                Faculty Count
              </h2>
              <p className="text-3xl font-bold text-purple-900 mt-2">45</p>
              <p className="text-sm text-purple-700 mt-1">
                Total faculty members
              </p>
            </div>

            <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
              <h2 className="text-lg font-semibold text-pink-800">
                Active Sessions
              </h2>
              <p className="text-3xl font-bold text-pink-900 mt-2">3</p>
              <p className="text-sm text-pink-700 mt-1">
                Ongoing feedback sessions
              </p>
            </div>
          </div>

          {/* Placeholder for Other Content */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700">
                No recent activity to display.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;