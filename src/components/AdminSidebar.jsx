import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  BookOpen,
  FileText,
  Upload,
  LayoutDashboard,
  FilePlus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white w-64 shadow-lg p-4 fixed h-screen" // Fixed height and position
    >
      <div className="text-xl font-bold text-gray-900 mb-6">Admin Panel</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/add-faculty")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <UserPlus className="mr-2" />
              Add Faculty
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/assign-subjects")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <BookOpen className="mr-2" />
              Assign Subjects
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/feedback-session")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FileText className="mr-2" />
              Feedback Session
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/upload-students")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Upload className="mr-2" />
              Upload Students
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/upload-faculty")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Users className="mr-2" />
              Upload Faculty
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/create-feedback-form")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FilePlus className="mr-2" />
              Create Feedback Form
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/students")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Users className="mr-2" />
              Students
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/feedback")} // Fixed typo
              className="flex items-center w-full p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Users className="mr-2" />
              Feedback
            </button>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default AdminSidebar;
