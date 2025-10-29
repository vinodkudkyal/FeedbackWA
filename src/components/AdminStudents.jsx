import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // State for the "Add Student" modal
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudentUsername, setNewStudentUsername] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [newStudentAttendance, setNewStudentAttendance] = useState(0);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentRollNo, setNewStudentRollNo] = useState(0);
  const [newStudentBranch, setNewStudentBranch] = useState("AIDS");
  const [newStudentYear, setNewStudentYear] = useState("TY");

  // State for selected students
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `https://feedbackend-mhol.onrender.com/api/students?branch=${branchFilter}&year=${yearFilter}`
        );
        const data = await response.json();
        setStudents(data);
        setSelectedStudents([]); // Clear selected students when data changes
        setSelectAll(false); // Uncheck "Select All" when data changes
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [branchFilter, yearFilter]);

  // Handle individual student selection
  const handleStudentSelect = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]); // Unselect all
    } else {
      setSelectedStudents(students.map((student) => student._id)); // Select all
    }
    setSelectAll(!selectAll);
  };

  // Delete selected students (single or multiple)
  const handleDeleteSelected = async () => {
    try {
      const response = await fetch("https://feedbackend-mhol.onrender.com/api/students", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedStudents }),
      });

      if (response.ok) {
        // Remove deleted students from the list
        setStudents(
          students.filter((student) => !selectedStudents.includes(student._id))
        );
        setSelectedStudents([]); // Clear selected students
        setSelectAll(false); // Uncheck "Select All"
      } else {
        console.error("Failed to delete selected students");
      }
    } catch (error) {
      console.error("Error deleting selected students:", error);
    }
  };

  // Add a new student
  const handleAddStudent = async () => {
    const newStudent = {
      username: newStudentUsername,
      password: newStudentPassword,
      attendance: newStudentAttendance,
      Name: newStudentName,
      rollNo: newStudentRollNo,
      branch: newStudentBranch,
      year: newStudentYear,
    };

    try {
      const response = await fetch("https://feedbackend-mhol.onrender.com/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        const addedStudent = await response.json();
        setStudents([...students, addedStudent]);
        setIsAddStudentModalOpen(false);
        resetForm();
      } else {
        console.error("Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const resetForm = () => {
    setNewStudentUsername("");
    setNewStudentPassword("");
    setNewStudentAttendance(0);
    setNewStudentName("");
    setNewStudentRollNo(0);
    setNewStudentBranch("AIDS");
    setNewStudentYear("TY");
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Students</h1>

          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            {/* Branch Filter */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Branches</option>
              <option value="AIDS">AIDS</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
            </select>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Years</option>
              <option value="FY">First Year</option>
              <option value="SY">Second Year</option>
              <option value="TY">Third Year</option>
              <option value="LY">Fourth Year</option>
            </select>

            {/* Add Student Button */}
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Student
            </button>

            {/* Delete Selected Button */}
            {selectedStudents.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Selected
              </button>
            )}
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleStudentSelect(student._id)}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {student.Name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {student.branch}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {student.year}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      {student.rollNo}
                    </td>

                    {/* <td className="px-6 py-4 border-b border-gray-200">
  {student.attendance}%
</td> */}

                    <td className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <span
                          className={`mr-2 ${
                            student.attendance < 75
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {student.attendance}%
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              student.attendance < 75
                                ? "bg-red-600"
                                : "bg-blue-600"
                            }`}
                            style={{ width: `${student.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Add New Student
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddStudent();
              }}
            >
              {/* Username Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={newStudentUsername}
                  onChange={(e) => setNewStudentUsername(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Attendance Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Attendance
                </label>
                <input
                  type="number"
                  value={newStudentAttendance}
                  onChange={(e) => setNewStudentAttendance(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Roll No Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Roll No
                </label>
                <input
                  type="number"
                  value={newStudentRollNo}
                  onChange={(e) => setNewStudentRollNo(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Branch Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <select
                  value={newStudentBranch}
                  onChange={(e) => setNewStudentBranch(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                >
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                </select>
              </div>

              {/* Year Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <select
                  value={newStudentYear}
                  onChange={(e) => setNewStudentYear(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                >
                  <option value="FY">First Year</option>
                  <option value="SY">Second Year</option>
                  <option value="TY">Third Year</option>
                  <option value="LY">Fourth Year</option>
                </select>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
