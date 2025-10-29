import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalFaculties, setTotalFaculties] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const navigate = useNavigate();

  // Get admin's department from location state
  const location = useLocation();
  const adminDepartment = location.state?.department || localStorage.getItem("adminDepartment") || "";


  useEffect(() => {
    // Redirect if no department is provided (not a proper admin login)
    if (!adminDepartment) {
      navigate("/admin-dashboard");
      return;
    }

    // Set admin's department as the only option
    setDepartments([adminDepartment]);
    setSelectedDepartment(adminDepartment);
    setYears(["FY", "SY", "TY", "BE"]);
  }, [adminDepartment, navigate]);

  useEffect(() => {
    if (selectedDepartment && selectedYear) {
      let url = `https://feedbackend-mhol.onrender.com/api/get-total-responses?department=${selectedDepartment}&year=${selectedYear}`;

      if (academicYear) url += `&academicYear=${academicYear}`;
      if (semester) url += `&semester=${semester}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Total responses fetched:", data);
          setTotalResponses(data.totalResponses);
          if (data.facultyName) {
            setFacultyName(data.facultyName);
          }
        })
        .catch((error) => {
          console.error("Error fetching total responses:", error);
          setTotalResponses(0);
        });
    } else {
      setTotalResponses(0);
    }
  }, [selectedDepartment, selectedYear, academicYear, semester]);

  useEffect(() => {
    if (selectedDepartment) {
      let url = `https://feedbackend-mhol.onrender.com/api/get-faculties?department=${selectedDepartment}`;

      if (selectedYear) url += `&year=${selectedYear}`;
      if (academicYear) url += `&academicYear=${academicYear}`;
      if (semester) url += `&semester=${semester}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Total faculties fetched:", data.faculties.length);
          setTotalFaculties(data.faculties.length);
        })
        .catch((error) => {
          console.error("Error fetching total faculties:", error);
          setTotalFaculties(0);
        });
    } else {
      setTotalFaculties(0);
    }
  }, [selectedDepartment, selectedYear, academicYear, semester]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {adminDepartment
              ? `${adminDepartment} Admin Dashboard`
              : "Dashboard"}
          </h1>

          {/* Filters - Compact Layout */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={selectedDepartment}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Academic Year</option>
                {["2022-23", "2023-24", "2024-25"].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-800">
                Total Responses
              </h2>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {totalResponses}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Students who filled the feedback form
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h2 className="text-lg font-semibold text-purple-800">
                Faculty Count
              </h2>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {totalFaculties}
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Total faculty members
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
