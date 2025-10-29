import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Save,
  X,
  Search,
  User,
  Mail,
  Building,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

// Optional: used for potential filter UI
const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
      ${
        active
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }
    `}
  >
    {label}
  </button>
);

// Define global options for departments and years.
const departmentOptions = ["CSE", "AIDS", "ELEC", "MECH", "ENTC"];
const yearOptions = ["FE", "SY", "TY", "BE"];

const FacultyCard = ({ faculty }) => (
  <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-medium text-gray-900">
          {faculty.name || "Unknown"}
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {faculty.email || "No email"}
        </p>
      </div>
      <div className="flex gap-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
          {faculty.department || "No department"}
        </span>
      </div>
    </div>
    {faculty.subjects && faculty.subjects.length > 0 && (
      <div className="mt-2 text-sm text-gray-500">
        <strong>Subjects:</strong>{" "}
        {faculty.subjects.map((subj, index) => (
          <span key={index}>
            {subj.name} ({subj.code})
            {index < faculty.subjects.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    )}
  </div>
);

const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-xl">
    {children}
  </div>
);

const CardContent = ({ children }) => <div className="p-6">{children}</div>;

const CardHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <div className="flex items-center gap-3">
    <div className="h-8 w-1 bg-blue-500 rounded-full" />
    <h2 className={`${className} text-gray-800`}>{children}</h2>
  </div>
);

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  icon: Icon,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`
      px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
      ${
        variant === "outline"
          ? "border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
          : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow"
      }
      ${className || ""}
    `}
  >
    {Icon && <Icon size={18} />}
    {children}
  </button>
);

const Input = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  required,
  icon: Icon,
}) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Icon size={18} />
      </div>
    )}
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        border border-gray-200 rounded-lg px-4 py-2 w-full transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        ${Icon ? "pl-10" : ""}
      `}
      placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
    />
  </div>
);

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-gray-700 font-medium mb-1.5">
    {children}
  </label>
);

const MultiSelect = ({ id, name, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-200 rounded-lg px-4 py-2 w-full flex items-center justify-between cursor-pointer"
      >
        <span className="text-gray-700">
          {selectedValues.length === 0
            ? "Select Years"
            : selectedValues.join(", ")}
        </span>
        <ChevronDown size={18} className="text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={`
                px-4 py-2 cursor-pointer hover:bg-gray-50
                ${
                  selectedValues.includes(option)
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                readOnly
                className="mr-2"
              />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Faculty2AdminPanel = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyData, setFacultyData] = useState({
    name: "",
    email: "",
    department: "",
    years: [],
    academicYear: "", // ✅ Added academic year
    semester: "", // ✅ Added semester
  });

  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  // Additional filters can be added here if needed
  const [filters, setFilters] = useState({
    department: "",
    year: "",
    search: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await fetch(
        "https://feedbackend-mhol.onrender.com/api/faculty/facultydatasavefile"
      );
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all fields
    if (
      !facultyData.name ||
      !facultyData.email ||
      !facultyData.department ||
      facultyData.years.length === 0 ||
      !facultyData.academicYear ||
      !facultyData.semester
    ) {
      alert("Please fill in all fields, including Academic Year and Semester.");
      return;
    }
  
    try {
      // Debugging: Log the data being sent to the server
      console.log("Sending Data:", facultyData);
  
      const response = await fetch("https://feedbackend-mhol.onrender.com/api/faculty/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facultyData),
      });
  
      const result = await response.json();
      console.log("Server Response:", result); // Debugging
  
      if (!response.ok) {
        alert(result.error || "Failed to add faculty");
        return;
      }
  
      // Update state with new faculty data
      setFaculties((prev) => [
        ...prev,
        ...result.faculties.map((f) => ({
          ...f,
          subjects: f.subjects || [],
          academicYear: f.academicYear, // ✅ Ensure academic year is stored
          semester: f.semester, // ✅ Ensure semester is stored
        })),
      ]);
  
      setShowSuccessDialog(true);
      
      // Reset the form
      setFacultyData({
        name: "",
        email: "",
        department: "",
        years: [],
        academicYear: "",
        semester: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to connect to the server");
    }
  };
  

  // Combine duplicate faculty records by email and merge their subjects.
  const filteredFaculties = faculties
    .reduce((acc, faculty) => {
      const existingFaculty = acc.find((f) => f.email === faculty.email);
      if (existingFaculty) {
        existingFaculty.subjects = [
          ...new Set([
            ...(existingFaculty.subjects || []),
            ...(faculty.subjects || []),
          ]),
        ];
      } else {
        acc.push({ ...faculty, subjects: faculty.subjects || [] });
      }
      return acc;
    }, [])
    .filter(
      (faculty) =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handlers for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearsChange = (selectedYears) => {
    setFacultyData((prev) => ({ ...prev, years: selectedYears }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            {/* ✅ Success Icon */}
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mt-2">
              Faculty Added
            </h2>
            <p className="text-gray-600 mt-2">
              The faculty has been successfully added.
            </p>

            {/* ✅ Centered Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 pt-20 pl-64">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  Faculty Management Panel
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    {/* <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    /> */}
                    <input
                      type="text"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  {!showForm && (
                    <Button onClick={() => setShowForm(true)} icon={PlusCircle}>
                      Add Faculty
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={facultyData.name}
                        onChange={handleInputChange}
                        required
                        icon={User}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={facultyData.email}
                        onChange={handleInputChange}
                        required
                        icon={Mail}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={facultyData.department}
                        onChange={handleInputChange}
                        required
                        icon={Building}
                      />
                    </div>
                    <div>
                      <Label htmlFor="years">Years</Label>
                      <MultiSelect
                        id="years"
                        name="years"
                        options={yearOptions}
                        selectedValues={facultyData.years}
                        onChange={handleYearsChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Input
                        id="academicYear"
                        name="academicYear"
                        type="text"
                        value={facultyData.academicYear}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <select
                        id="semester"
                        name="semester"
                        value={facultyData.semester}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-200 rounded-lg px-4 py-2 w-full"
                      >
                        <option value="">Select Semester</option>
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      icon={X}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" icon={Save}>
                      Save Faculty
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <CardTitle className="text-xl font-bold">
                  Available Faculty
                </CardTitle>
                <div className="flex flex-wrap gap-4">
                  {/* Optional: add filter chips or additional filter UI here */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
                  <p className="mt-4 text-gray-600">Loading faculty data...</p>
                </div>
              ) : filteredFaculties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    No faculty members found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFaculties.map((faculty) => (
                    <FacultyCard key={faculty.email} faculty={faculty} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Faculty2AdminPanel;
