import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

// Color scheme for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

// Chart type toggle component
const ChartTypeToggle = ({ chartType, onChartTypeChange }) => (
  <div className="flex items-center gap-2 mb-4">
    <button
      onClick={() => onChartTypeChange("bar")}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        chartType === "bar"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <BarChartIcon className="w-4 h-4" />
      Bar Chart
    </button>
    <button
      onClick={() => onChartTypeChange("pie")}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        chartType === "pie"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <PieChartIcon className="w-4 h-4" />
      Pie Chart
    </button>
  </div>
);

// Custom Pie Chart with labels
const CustomPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => {
          const label = `${name} (${(percent * 100).toFixed(0)}%)`;
          return label.length > 15 ? `${name.slice(0, 12)}...` : label;
        }}
        outerRadius={80} // Reduce outer radius to give more space for labels
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

// Main Faculty Dashboard Component
const FacultyFeedbackDashboard = ({ faculty }) => {
  const [activeTab, setActiveTab] = useState("current");
  const [selectedBranch, setSelectedBranch] = useState("None"); // Default branch set to "None"
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [chartType, setChartType] = useState("pie");
  const [showFeedbackComments, setShowFeedbackComments] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const facultstate = location.state?.faculty;

  // Ref for the dashboard content to be exported as PDF
  const dashboardRef = useRef(null);

  // Fetch faculty data based on the selected branch
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        if (!facultstate) {
          console.error("Faculty email is missing!");
          return;
        }

        const facultyFromState = location.state?.faculty;
        const facultyEmail =
          typeof facultyFromState === "string"
            ? facultyFromState
            : facultyFromState?.email;

        if (!facultyEmail) {
          console.error("Faculty email is missing!");
          return;
        }

        const response = await fetch(
          `https://feedbackend-mhol.onrender.com/api/faculty-feedback/by-email/${facultyEmail}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch faculty data: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!data.faculties || data.faculties.length === 0) {
          throw new Error("No faculty data found!");
        }

        setFacultyData(data.faculties);
        setYears(data.years || []);
        setSubjects(data.subjects || []);

        // Set default values with proper feedback checks
        const firstFaculty = data.faculties[0];
        if (firstFaculty) {
          setSelectedBranch(firstFaculty.department || "None");
          setSelectedYear(firstFaculty.year || "");
          setSelectedSubject(firstFaculty.subjects?.[0]?.name || "");

          // Check if feedback exists and has at least one entry
          if (firstFaculty.feedback && firstFaculty.feedback.length > 0) {
            setSelectedAcademicYear(
              firstFaculty.feedback[0].academicYear || ""
            );
          } else {
            setSelectedAcademicYear(""); // Set default if no feedback
          }

          setSelectedSemester("Semester 1");
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [facultstate]);

  // Automatically set the subject when the year is selected
  useEffect(() => {
    if (selectedYear && facultyData) {
      const facultyForSelectedYear = facultyData.find(
        (f) => f.year === selectedYear && f.department === selectedBranch
      );
      if (
        facultyForSelectedYear &&
        facultyForSelectedYear.subjects &&
        facultyForSelectedYear.subjects.length > 0
      ) {
        setSelectedSubject(facultyForSelectedYear.subjects[0].name);
      } else {
        setSelectedSubject(""); // Clear the subject if none exist
      }
    }
  }, [selectedYear, facultyData, selectedBranch]);

  // Get current feedback data based on selected filters
  const getCurrentFeedbackData = () => {
    if (!facultyData) return null;
    try {
      const facultyForSelectedYear = facultyData.find(
        (f) => f.year === selectedYear && f.department === selectedBranch
      );
      if (!facultyForSelectedYear || !facultyForSelectedYear.feedback?.[0])
        return null;

      return facultyForSelectedYear.feedback[0].feedbackQuestions.reduce(
        (acc, question) => {
          acc[question.Id] = question.responses.reduce((obj, response) => {
            obj[response.Option] = response.Count;
            return obj;
          }, {});
          return acc;
        },
        {}
      );
    } catch (error) {
      return null;
    }
  };

  // Get historical feedback data (same as current for simplicity)
  const getHistoricalFeedbackData = () => getCurrentFeedbackData();

  const currentFeedbackData = getCurrentFeedbackData();
  const historicalFeedbackData = getHistoricalFeedbackData();

  // Prepare chart data for a specific question
  const prepareChartData = (questionData) => {
    return Object.entries(questionData).map(([key, value]) => ({
      name: key,
      value: value,
    }));
  };

  const exportDashboardAsPDF = async () => {
    if (!facultyData) return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const margin = 10;
      let yPos = margin;

      // Add Faculty Name
      pdf.setFontSize(18);
      pdf.text(`Faculty: ${facultyData[0].name}`, margin, yPos);
      yPos += 10;

      // Add Academic Year and Semester
      pdf.setFontSize(12);
      pdf.text(`Academic Year: ${selectedAcademicYear}`, margin, yPos);
      yPos += 10;
      pdf.text(`Semester: ${selectedSemester}`, margin, yPos);
      yPos += 15;

      // Add Feedback Statistics Header
      pdf.setFontSize(14);
      pdf.text("Feedback Statistics", margin, yPos);
      yPos += 10;

      // Convert charts to images and add to PDF
      const charts = document.querySelectorAll(".chart-container");
      for (let i = 0; i < charts.length; i += 2) {
        // Process two charts at a time
        const canvas1 = await html2canvas(charts[i], { scale: 2 });
        const imgData1 = canvas1.toDataURL("image/png");
        const imgWidth = 90; // Half of the page width
        const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;

        let imgHeight2 = 0;
        let imgData2 = null;

        // Check if there's a second chart
        if (i + 1 < charts.length) {
          const canvas2 = await html2canvas(charts[i + 1], { scale: 2 });
          imgData2 = canvas2.toDataURL("image/png");
          imgHeight2 = (canvas2.height * imgWidth) / canvas2.width;
        }

        // Check if space is enough for two charts
        if (yPos + Math.max(imgHeight1, imgHeight2) + 10 > 280) {
          pdf.addPage();
          yPos = margin;
        }

        // Add first chart
        pdf.addImage(imgData1, "PNG", margin, yPos, imgWidth, imgHeight1);

        // Add second chart if it exists
        if (imgData2) {
          pdf.addImage(
            imgData2,
            "PNG",
            margin + imgWidth + 10,
            yPos,
            imgWidth,
            imgHeight2
          );
        }

        yPos += Math.max(imgHeight1, imgHeight2) + 15;
      }

      // Add Feedback Comments
      pdf.setFontSize(14);
      pdf.text("Feedback Comments", margin, yPos);
      yPos += 10;

      // Add Suggestions
      pdf.setFontSize(12);
      pdf.text("Suggestions:", margin, yPos);
      yPos += 10;

      const facultyForSelectedYear = facultyData.find(
        (f) => f.year === selectedYear && f.department === selectedBranch
      );

      // Check if feedback exists before accessing
      if (facultyForSelectedYear?.feedback?.[0]?.suggestions) {
        facultyForSelectedYear.feedback[0].suggestions
          .split("\n")
          .forEach((suggestion) => {
            pdf.text(`- ${suggestion}`, margin + 5, yPos);
            yPos += 10;
          });
      }

      // Add Complaints
      pdf.text("Complaints:", margin, yPos);
      yPos += 10;

      if (facultyForSelectedYear?.feedback?.[0]?.complaints) {
        facultyForSelectedYear.feedback[0].complaints
          .split("\n")
          .forEach((complaint) => {
            pdf.text(`- ${complaint}`, margin + 5, yPos);
            yPos += 10;
          });
      }

      // Save the PDF
      pdf.save("faculty_feedback_report.pdf");
    } catch (error) {
      console.error("Error exporting dashboard as PDF:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!facultyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        No faculty data found.
      </div>
    );
  }

  const matchingFaculty = facultyData.find(
    (f) =>
      f.year === selectedYear &&
      f.department === selectedBranch &&
      (selectedSubject === "" ||
        (f.subjects && f.subjects.some((s) => s.name === selectedSubject)))
  );

  // Use the total responses from the matching faculty instance or default to 0
  const totalResponses = matchingFaculty ? matchingFaculty.totalResponses : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex" ref={dashboardRef}>
      {/* Sidebar for Filters */}
      <div className="w-64 bg-white shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Branch</label>
            <select
              className="w-full border rounded-lg px-4 py-2 mt-1"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="None">None</option>
              {[...new Set(facultyData.map((f) => f.department))].map(
                (branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Year</label>
            <select
              className="w-full border rounded-lg px-4 py-2 mt-1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {activeTab === "history" && (
            <>
              <div>
                <label className="text-sm text-gray-600">Academic Year</label>
                <select
                  className="w-full border rounded-lg px-4 py-2 mt-1"
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                >
                  {/* Check if feedback exists before accessing */}
                  {facultyData[0]?.feedback?.length > 0 ? (
                    <option value={facultyData[0].feedback[0].academicYear}>
                      {facultyData[0].feedback[0].academicYear}
                    </option>
                  ) : (
                    <option value="">No academic year available</option>
                  )}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Semester</label>
                <select
                  className="w-full border rounded-lg px-4 py-2 mt-1"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  <option value="Semester 1">Semester 1</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="text-sm text-gray-600">Subject</label>
            <select
              className="w-full border rounded-lg px-4 py-2 mt-1"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {(() => {
                // Find the faculty record matching the selected year and branch
                const facultyForSelectedYear = facultyData.find(
                  (f) =>
                    f.year === selectedYear && f.department === selectedBranch
                );
                // Check if a matching faculty exists
                if (!facultyForSelectedYear) {
                  return <option value="">No faculty available</option>;
                }
                // Check if subjects are assigned for that record
                if (
                  !facultyForSelectedYear.subjects ||
                  facultyForSelectedYear.subjects.length === 0
                ) {
                  return <option value="">No subjects available</option>;
                }
                // Map through subjects if available
                return facultyForSelectedYear.subjects.map((subject, index) => (
                  <option key={subject?.name || index} value={subject?.name}>
                    {subject?.name}
                  </option>
                ));
              })()}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {/* Header with Faculty Name, Total Responses, and Export Button */}
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Faculty Feedback Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Faculty: {facultyData[0].name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-gray-600 text-sm">
                  Total Responses: {totalResponses}
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {activeTab === "current"
                    ? currentFeedbackData?.totalResponses
                    : historicalFeedbackData?.totalResponses}
                </p>
              </div>
              <button
                onClick={exportDashboardAsPDF}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs for Current Feedback and Feedback History */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${
              activeTab === "current"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Current Feedback
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Feedback History
          </button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {Object.entries(
            activeTab === "current"
              ? currentFeedbackData || {}
              : historicalFeedbackData || {}
          ).map(([key, value]) => {
            // Skip non-numeric data (e.g., suggestions, complaints, totalResponses)
            if (
              typeof value !== "object" ||
              key === "totalResponses" ||
              key === "suggestions" ||
              key === "complaints"
            )
              return null;

            const chartData = prepareChartData(value);

            return (
              <div
                key={key}
                className="bg-white rounded-lg shadow-sm p-6 chart-container"
              >
                <h4 className="text-md font-medium mb-4">{key}</h4>
                <div className="chart-toggle-buttons">
                  <ChartTypeToggle
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                  />
                </div>
                <div className="min-h-[300px] w-full">
                  {chartType === "bar" ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4F46E5" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <CustomPieChart data={chartData} />
                  )}
                </div>
                {/* Display Stats Below the Chart */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700">Stats:</h5>
                  <ul className="flex flex-wrap gap-4 text-gray-600">
                    {chartData.map((entry, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="font-medium">{entry.name}:</span>
                        <span>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Comments Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowFeedbackComments(!showFeedbackComments)}
            className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-xl font-semibold">Feedback Comments</h2>
            {showFeedbackComments ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showFeedbackComments && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Suggestions</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {facultyData
                      .find(
                        (f) =>
                          f.year === selectedYear &&
                          f.department === selectedBranch
                      )
                      ?.feedback[0]?.suggestions?.split("\n")
                      .map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Complaints</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {facultyData
                      .find(
                        (f) =>
                          f.year === selectedYear &&
                          f.department === selectedBranch
                      )
                      ?.feedback[0]?.complaints?.split("\n")
                      .map((complaint, index) => (
                        <li key={index}>{complaint}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyFeedbackDashboard;
