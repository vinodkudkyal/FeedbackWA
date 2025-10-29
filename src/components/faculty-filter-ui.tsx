import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import FacultyFeedbackDashboard from './DeanFacultyDashboard';
// import AdminSidebar from "./AdminSidebar";
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

interface AlertDescriptionProps {
  children: React.ReactNode;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return <p className="text-sm">{children}</p>;
};

const FacultyFilter = () => {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    year: '',
    subject: ''
  });
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  const years = ['FY', 'SY', 'TY', 'Final Year'];
  const departments = ['CSE', 'IT', 'AIDS', 'AIML', 'ECE'];

  const handleApiResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } else {
        throw new Error(`Server error (${response.status}): ${await response.text() || 'Please try again later'}`);
      }
    }

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: Expected JSON');
    }

    return response.json();
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      if (filters.department && filters.year) {
        try {
          setSubjects([]);
          const response = await fetch(`https://feedbackend-mhol.onrender.com/api/subjects?department=${filters.department}&year=${filters.year}`);
          const data = await handleApiResponse(response);
          setSubjects(data.map(subject => subject.name));
          setError(null);
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setSubjects([]);
          setError('Unable to load subjects. Please try again later.');
        }
      } else {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [filters.department, filters.year]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (filters.department) queryParams.append('department', filters.department);
        if (filters.year) queryParams.append('year', filters.year);

        const response = await fetch(`https://feedbackend-mhol.onrender.com/api/faculty/filterser?${queryParams}`);
        const data = await handleApiResponse(response);

        if (data.faculties) {
          const facultyMap = new Map();

          let filteredData = data.faculties;

          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredData = filteredData.filter(faculty =>
              faculty.name.toLowerCase().includes(searchTerm) ||
              faculty.email.toLowerCase().includes(searchTerm)
            );
          }

          if (filters.subject) {
            filteredData = filteredData.filter(faculty =>
              faculty.subjects?.some(sub =>
                typeof sub === 'string'
                  ? sub === filters.subject
                  : sub.name === filters.subject
              )
            );
          }

          filteredData.forEach(faculty => {
            if (facultyMap.has(faculty.email)) {
              const existing = facultyMap.get(faculty.email);
              if (faculty.subjects && existing.subjects) {
                const uniqueSubjects = new Set([
                  ...existing.subjects.map(s => typeof s === 'string' ? s : s.name),
                  ...faculty.subjects.map(s => typeof s === 'string' ? s : s.name)
                ]);
                existing.subjects = Array.from(uniqueSubjects).map(name => ({ name }));
              }
              facultyMap.set(faculty.email, existing);
            } else {
              facultyMap.set(faculty.email, faculty);
            }
          });

          setFacultyData(Array.from(facultyMap.values()));
        } else {
          setFacultyData([]);
        }
      } catch (error) {
        console.error('Error fetching faculty data:', error);
        setError(error.message || 'Failed to fetch faculty data. Please try again later.');
        setFacultyData([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchFacultyData, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      if ((key === 'department' || key === 'year') && value !== prev[key]) {
        return { ...prev, [key]: value, subject: '' };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleFacultySelect = async (faculty) => {
    setSelectedFaculty(faculty);
    setDashboardError(null);

    try {
      // Always navigate to the dashboard, even if no feedback is found
      setShowDashboard(true);
    } catch (error) {
      console.error('Error fetching faculty feedback:', error);
      setDashboardError('Failed to load faculty feedback. Please try again later.');
    }
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
    setSelectedFaculty(null);
    setDashboardError(null);
  };

  return (
    
    <div className="min-h-screen bg-gray-50">
    {/* <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"> */}
      {/* <AdminSidebar /> */}
      {!showDashboard ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Faculty Directory</h1>
          </div>

          <div className="mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              {/* <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${showFilters ? 'bg-blue-600' : 'bg-blue-500'} text-white hover:bg-blue-600 transition-colors`}
              >
                <Filter className="w-5 h-5" />
                Filters {showFilters ? '(Active)' : ''}
              </button> */}
            </div>


            <div className="mb-6">
              {/* <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div> */}

              {/* Always show filters (no conditional rendering) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <select
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                {/* <select
                  className="p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={filters.subject}
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                  disabled={!filters.department || !filters.year}
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select> */}
              </div>
            </div>

          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {dashboardError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{dashboardError}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                Found {facultyData.length} faculty member{facultyData.length !== 1 ? 's' : ''}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facultyData.length > 0 ? (
                  facultyData.map((faculty) => (
                    <div
                      key={faculty._id}
                      className="p-6 rounded-lg shadow-md transition-all hover:shadow-lg hover:scale-102 bg-white cursor-pointer"
                      onClick={() => handleFacultySelect(faculty)}
                    >
                      <h3 className="text-xl font-semibold mb-2">{faculty.name}</h3>
                      <p className="text-gray-600 mb-1">Department: {faculty.department}</p>
                      <p className="text-gray-600 mb-1">Year: {faculty.year}</p>
                      <p className="text-gray-600 mb-1">Email: {faculty.email}</p>
                      {faculty.subjects?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-600">Subjects:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {faculty.subjects.map((subject, index) => (
                              <span key={index} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                {subject.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No faculty members found matching the selected criteria.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={handleCloseDashboard}
            className="absolute top-4 left-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <FacultyFeedbackDashboard faculty={selectedFaculty} />
        </div>
      )}
     </div>
    // </div>
  );
};

export default FacultyFilter;