import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import FacultyFeedbackDashboard from "./AdminFacultyDashboard";
import AdminSidebar from "./AdminSidebar";

interface AlertProps {
  children: React.ReactNode;
  type?: "success" | "error" | "warning" | "info";
}

const Alert: React.FC<AlertProps> = ({ children, type = "info" }) => {
  const alertStyles = {
    success: "bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded",
    error: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded",
    warning: "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded",
    info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded",
  };

  return <div className={alertStyles[type]}>{children}</div>;
};

const FacultyFilter = () => {
  const [filters, setFilters] = useState({
    search: "",
    department: "AIDS", // Default to "AIDS" department
    year: "",
  });

  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const years = ["FY", "SY", "TY", "Final Year"];

  const handleApiResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorMessage =
        contentType && contentType.includes("application/json")
          ? (await response.json()).message || `HTTP error! status: ${response.status}`
          : `Server error (${response.status}): ${await response.text() || "Please try again later"}`;
      throw new Error(errorMessage);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format: Expected JSON");
    }

    return response.json();
  };

  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (filters.department) queryParams.append("department", filters.department);
        if (filters.year) queryParams.append("year", filters.year);

        const response = await fetch(`https://feedbackend-mhol.onrender.com/api/faculty/filterser?${queryParams}`);
        const data = await handleApiResponse(response);

        let filteredData = data.faculties || [];

        // Ensure only AIDS department faculties are displayed
        filteredData = filteredData.filter((faculty) => faculty.department === "AIDS");

        // **Remove duplicate faculty records (same email)**
        const uniqueFaculty = [];
        const emailSet = new Set();

        filteredData.forEach((faculty) => {
          if (!emailSet.has(faculty.email)) {
            emailSet.add(faculty.email);
            uniqueFaculty.push(faculty);
          }
        });

        // Apply search filter if applicable
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredData = uniqueFaculty.filter(
            (faculty) =>
              faculty.name.toLowerCase().includes(searchTerm) || faculty.email.toLowerCase().includes(searchTerm)
          );
        } else {
          filteredData = uniqueFaculty;
        }

        setFacultyData(filteredData);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setError(error.message || "Failed to fetch faculty data. Please try again later.");
        setFacultyData([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchFacultyData, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-6">
        {!showDashboard ? (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">AIDS Faculty Directory</h1>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select
                className="p-2 border rounded-lg"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {error && <Alert type="error">{error}</Alert>}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {facultyData.length > 0 ? (
                  facultyData.map((faculty) => (
                    <div
                      key={faculty.email} // Ensuring uniqueness
                      className="p-6 bg-white rounded-lg shadow-md cursor-pointer"
                      onClick={() => {
                        setSelectedFaculty(faculty);
                        setShowDashboard(true);
                      }}
                    >
                      <h3 className="text-xl font-semibold">{faculty.name}</h3>
                      <p className="text-gray-600">Email: {faculty.email}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500">No faculty members found.</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDashboard(false)}
              className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <FacultyFeedbackDashboard faculty={selectedFaculty} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyFilter;
