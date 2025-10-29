import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  BookOpen,
  UserPlus,
  ArrowRightCircle,
  Filter,
  PlusCircle,
  Trash2,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";

// Reusable Card Component
const Card = ({ className = "", children, ...props }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const TeacherSubjectAssignment = () => {
  // State Management
  const [subjectDept, setSubjectDept] = useState("CSE");
  const [teacherDept, setTeacherDept] = useState("CSE");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  const [year, setYear] = useState("SY");
  // const [searchQuery, setSearchQuery] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState([]);
  // const [selectedTeacher, setSelectedTeacher] = useState(null);
  // const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [isBulkUnassigning, setIsBulkUnassigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherName, setSelectedTeacherName] = useState(""); // New state for search ba
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [assignmentFilter, setAssignmentFilter] = useState(""); // New state for filtering assigned subjects
  const [typeFilter, setTypeFilter] = useState(""); // Add this with other state declarations
  const types = ["Lab", "Theory"]; // Add this with other constants
  // Department and Year Data
  const departments = useMemo(
    () => ["CSE", "AIDS", "Data Science", "ENTC","Information Technology"],
    []
  );

  // // Filter assigned subjects based on assignmentFilter
  // const filteredAssignedSubjects = useMemo(() => {
  //   if (!assignmentFilter) return assignedSubjects; // Show all if no filter is applied
  //   return assignedSubjects.filter(
  //     (subject) =>
  //       subject.name.toLowerCase().includes(assignmentFilter.toLowerCase()) ||
  //       subject.code.toLowerCase().includes(assignmentFilter.toLowerCase()) ||
  //       subject.assignedTeacher.name
  //         .toLowerCase()
  //         .includes(assignmentFilter.toLowerCase())
  //   );
  // }, [assignedSubjects, assignmentFilter]);
  // Filter assigned subjects based on header filters (department and year)
  const filteredAssignedSubjects = useMemo(() => {
    return assignedSubjects.filter(
      (subject) =>
        (subjectDept === "" || subject.department === subjectDept) &&
        (year === "" || subject.year === year)
    );
  }, [assignedSubjects, subjectDept, year]);

  // Filter assigned subjects based on assignmentFilter (search query)
  const searchedAssignedSubjects = useMemo(() => {
    return assignedSubjects
      .filter(
        (subject) =>
          subject.department.toLowerCase() === subjectDept.toLowerCase() &&
          subject.year.toLowerCase() === year.toLowerCase() &&
          (academicYear === "" || subject.academicYear === academicYear) &&
          (semester === "" || subject.semester === semester) &&
          (typeFilter === "" || subject.type === typeFilter) // Add this line
      )
      .filter((subject) => {
        if (!assignmentFilter) return true;
        const filterText = assignmentFilter.toLowerCase();
        return (
          subject.name.toLowerCase().includes(filterText) ||
          subject.code.toLowerCase().includes(filterText) ||
          (subject.assignedTeacher?.name &&
            subject.assignedTeacher.name.toLowerCase().includes(filterText))
        );
      });
  }, [
    assignedSubjects,
    subjectDept,
    year,
    academicYear,
    semester,
    typeFilter, // Add this to dependencies
    assignmentFilter,
  ]);
  // Update the teacher selection handler
  const handleTeacherSelection = (teacher) => {
    setSelectedTeacher(teacher); // Set the selected teacher
    setSelectedTeacherName(teacher.name); // Update the search bar with the selected teacher's name
  };

  useEffect(() => {
    console.log("Fetching teachers for:", teacherDept, year);
    console.log("Current Teachers List:", teachers);
  }, [teachers, teacherDept, year]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, subjectsRes] = await Promise.all([
          fetch(
            `https://feedbackend-mhol.onrender.com/api/unassigned-teachers?department=${teacherDept}&year=${year}&academicYear=${academicYear}&semester=${semester}`
          ),
          fetch(
            `https://feedbackend-mhol.onrender.com/api/subjects?department=${subjectDept}&year=${year}&academicYear=${academicYear}&semester=${semester}`
          ),
        ]);
  
        const teachersData = await teachersRes.json();
        const subjectsData = await subjectsRes.json();
  
        setTeachers(teachersData);
        setAssignedSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading data");
      }
    };
    fetchData();
  }, [teacherDept, year, subjectDept, academicYear, semester]);
  

  // Handle Subject Assignment
  const assignSubject = async () => {
    if (!newSubject || !newSubjectCode || !selectedTeacher) {
      alert("Please fill all fields and select a teacher");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: newSubject,
        code: newSubjectCode.toUpperCase(),
        department: subjectDept,
        year,
        type: typeFilter, // Add this line
        teacherId: selectedTeacher._id,
      };

      const response = await fetch(
        "https://feedbackend-mhol.onrender.com/api/subjects/assign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const assignedSubject = await response.json(); // Ensure we get the full subject object
      // Update state with full object
      setAssignedSubjects((prevSubjects) => [...prevSubjects, assignedSubject]);
      if (!response.ok) throw new Error("Assignment failed");

      // Refresh data
      setNewSubject("");
      setNewSubjectCode("");
      setSelectedTeacher(null);
      setTypeFilter(""); // Add this line
      const [teachersRes, subjectsRes] = await Promise.all([
        fetch(
          `https://feedbackend-mhol.onrender.com/api/unassigned-teachers?department=${teacherDept}&year=${year}`
        ),
        fetch(
          `https://feedbackend-mhol.onrender.com/api/subjects?department=${subjectDept}&year=${year}`
        ),
      ]);

      setTeachers(await teachersRes.json());
      setAssignedSubjects(await subjectsRes.json());

      alert("Subject assigned successfully!");
    } catch (error) {
      console.error("Assignment error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Subject Unassignment
  const unassignSubject = async (subjectId, teacherId) => {
    if (!window.confirm("Are you sure you want to unassign this subject?"))
      return;

    try {
      const response = await fetch(
        "https://feedbackend-mhol.onrender.com/api/subjects/unassign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectId, teacherId }),
        }
      );

      if (!response.ok) throw new Error("Unassignment failed");

      // Refresh both teachers and subjects
      const [teachersRes, subjectsRes] = await Promise.all([
        fetch(
          `https://feedbackend-mhol.onrender.com/api/unassigned-teachers?department=${teacherDept}&year=${year}`
        ),
        fetch(
          `https://feedbackend-mhol.onrender.com/api/subjects?department=${subjectDept}&year=${year}`
        ),
      ]);

      // Update state with fresh data
      setTeachers(await teachersRes.json());
      setAssignedSubjects(await subjectsRes.json());

      alert("Subject unassigned successfully!");
    } catch (error) {
      console.error("Unassignment error:", error);
      alert(error.message);
    }
  };

  const handleBulkUnassign = async () => {
    if (
      !window.confirm(
        `Are you sure you want to unassign ALL faculties from ${subjectDept} ${year}? This action cannot be undone!`
      )
    )
      return;

    setIsBulkUnassigning(true);
    try {
      const response = await fetch(
        "https://feedbackend-mhol.onrender.com/api/subjects/bulk-unassign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department: subjectDept,
            year: year,
          }),
        }
      );

      if (!response.ok) throw new Error("Bulk unassign failed");

      // Refresh both lists
      const [teachersRes, subjectsRes] = await Promise.all([
        fetch(
          `https://feedbackend-mhol.onrender.com/api/unassigned-teachers?department=${teacherDept}&year=${year}`
        ),
        fetch(
          `https://feedbackend-mhol.onrender.com/api/subjects?department=${subjectDept}&year=${year}`
        ),
      ]);

      setTeachers(await teachersRes.json());
      setAssignedSubjects(await subjectsRes.json());

      alert("All faculties unassigned successfully!");
    } catch (error) {
      console.error("Bulk unassign error:", error);
      alert(error.message);
    } finally {
      setIsBulkUnassigning(false);
    }
  };

  // Filtered teachers based on searchQuery (unchanged)
  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) => teacher.department === teacherDept && teacher.year === year
    );
  }, [teachers, teacherDept, year]);

  // Auto-generate Subject Code
  useEffect(() => {
    if (newSubject) {
      const baseCode = newSubject
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
      const randomNum = Math.floor(100 + Math.random() * 900);
      setNewSubjectCode(`${baseCode}${randomNum}`);
    }
  }, [newSubject]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <AdminSidebar />

      <div className="flex-1 pt-20 pl-64">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Cross-Department Subject Management
            </h1>
            <div className="flex justify-center items-center text-gray-600 space-x-4">
              <UserPlus className="text-purple-500 mr-2" />
              <span>Assign teachers from any department to subjects</span>
            </div>
          </div>

          {/* Control Panel */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department of Subject
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                value={subjectDept}
                onChange={(e) => setSubjectDept(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="">All</option>
                {["2022-23", "2023-24", "2024-25"].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">All</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher's Department
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                value={teacherDept}
                onChange={(e) => setTeacherDept(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {["FY", "SY", "TY", "BE"].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

                {/* Add this filter to the control panel grid */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Type (Lab/Theory)
  </label>
  <select
    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
  >
    <option value="">All</option>
    {types.map((type) => (
      <option key={type} value={type}>{type}</option>
    ))}
  </select>
</div>

            {/* <div className="flex-1 pt-20 pl-64">
        <div className="max-w-6xl mx-auto p-8 space-y-8"> */}
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Teachers
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={selectedTeacherName || searchQuery} // Show selected teacher's name or search query
                  onChange={(e) => {
                    setSearchQuery(e.target.value); // Allow manual searching
                    setSelectedTeacherName(""); // Clear selected teacher's name when typing
                  }}
                />
                <Filter
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Subject Creation */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <PlusCircle className="text-green-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                Create New Assignment
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Code
                </label>
                <input
                  type="text"
                  placeholder="Auto-generated code"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  value={newSubjectCode}
                  onChange={(e) =>
                    setNewSubjectCode(e.target.value.toUpperCase())
                  }
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={assignSubject}
                  disabled={isSubmitting || !selectedTeacher}
                  className={`w-full px-4 py-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center ${
                    isSubmitting || !selectedTeacher
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Assigning...
                    </>
                  ) : (
                    <>Assign Subject</>
                  )}
                </button>
              </div>
            </div>
          </Card>
          {/* Assignment Interface */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Teacher Selection */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Users className="text-purple-600 mr-3" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Available Teachers
                  </h2>
                  <p className="text-sm text-gray-500">
                    {teacherDept} Department
                  </p>
                </div>
              </div>
              <div
                className="space-y-4 overflow-y-auto"
                style={{ maxHeight: "400px" }}
              >
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className={`bg-gray-50 p-4 rounded-xl flex items-center cursor-pointer ${
                      selectedTeacher?._id === teacher._id
                        ? "border-2 border-purple-500"
                        : ""
                    }`}
                    onClick={() => handleTeacherSelection(teacher)} // Use the new handler
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {teacher.department}
                      </p>
                    </div>
                    <ArrowRightCircle className="text-purple-500" />
                  </div>
                ))}
              </div>
            </Card>

            {/* // Update the rendering part of the "Current Assignments" section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="text-green-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Current Assignments
                    </h2>
                    <p className="text-sm text-gray-500">
                      {searchedAssignedSubjects.length} active assignments
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleBulkUnassign}
                  disabled={
                    isBulkUnassigning || searchedAssignedSubjects.length === 0
                  }
                  className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${
          isBulkUnassigning || searchedAssignedSubjects.length === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
                >
                  {isBulkUnassigning ? "Unassigning All..." : "Unassign All"}
                </button>
              </div>
              <div
                className="space-y-4 overflow-y-auto"
                style={{ maxHeight: "400px" }}
              >
                {searchedAssignedSubjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="bg-gray-50 p-4 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {subject.name} ({subject.code})
                      </h3>
                      <p className="text-sm text-gray-600">
                        Assigned to:{" "}
                        {subject.assignedTeacher?.name
                          ? subject.assignedTeacher.name
                          : "Unassigned"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        unassignSubject(
                          subject._id,
                          subject.assignedTeacher._id
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {searchedAssignedSubjects.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No active assignments found
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubjectAssignment;
