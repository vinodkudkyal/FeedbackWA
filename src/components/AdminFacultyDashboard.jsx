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
  Mail,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Pattern definitions for charts
const PATTERNS = [
  { id: "pattern-dots", type: "circle", size: 6, fill: "#0088FE" },
  { id: "pattern-lines", type: "line", spacing: 8, stroke: "#00C49F", strokeWidth: 2, rotation: 45 },
  { id: "pattern-diamonds", type: "path", d: "M 0 4 L 4 0 L 8 4 L 4 8 Z", fill: "#FFBB28", spacing: 8 }, // Changed from squares to diamonds
  { id: "pattern-stripes", type: "line", spacing: 6, stroke: "#FF8042", strokeWidth: 2, rotation: 0 },
  { id: "pattern-waves", type: "path", d: "M 0 4 Q 2 0 4 4 Q 6 8 8 4", stroke: "#8884d8", strokeWidth: 1.5, spacing: 8 },
  { id: "pattern-cross", type: "line", spacing: 6, stroke: "#82ca9d", strokeWidth: 2, rotation: 90 },
];

// Custom Pattern component
const CustomPattern = ({ id, type, ...props }) => {
  if (type === "circle") {
    return (
      <pattern id={id} patternUnits="userSpaceOnUse" width={props.size} height={props.size}>
        <circle cx={props.size / 2} cy={props.size / 2} r={props.size / 3} fill={props.fill} />
      </pattern>
    );
  } else if (type === "line") {
    return (
      <pattern
        id={id}
        patternUnits="userSpaceOnUse"
        width={props.spacing}
        height={props.spacing}
        patternTransform={`rotate(${props.rotation || 0})`}
      >
        <line x1="0" y1="0" x2="0" y2={props.spacing} stroke={props.stroke} strokeWidth={props.strokeWidth} />
      </pattern>
    );
  } else if (type === "path") {
    return (
      <pattern id={id} patternUnits="userSpaceOnUse" width={props.spacing} height={props.spacing}>
        <path d={props.d} stroke={props.stroke} fill={props.fill} strokeWidth={props.strokeWidth} />
      </pattern>
    );
  }
  return null;
};

// Updated CustomPieChart component
// Updated Custom Pie Chart component without slice labels
const CustomPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <defs>
        {PATTERNS.map((pattern) => (
          <CustomPattern key={`pie-${pattern.id}`} {...pattern} />
        ))}
      </defs>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={false} // This removes all labels around the pie slices
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={`url(#${PATTERNS[index % PATTERNS.length].id})`}
            stroke="#fff"
            strokeWidth={1}
          />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name) => [`${value}`, name]}
      />
      <Legend
        formatter={(value, entry, index) =>
          `${value} (${data[index]?.value || 0})` // Keep counts in legend
        }
      />
    </PieChart>
  </ResponsiveContainer>
);

// Updated CustomBarChart component
const CustomBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <defs>
        {PATTERNS.map((pattern) => (
          <CustomPattern key={`bar-${pattern.id}`} {...pattern} />
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        tickFormatter={(name, index) =>
          `${name} (${data[index]?.value || 0})` // Add counts to x-axis labels
        }
      />
      <YAxis />
      <Tooltip
        formatter={(value, name) => [`${value}`, name]}
      />
      <Bar
        dataKey="value"
        label={{
          position: 'top',
          formatter: (value) => value // Show counts on top of bars
        }}
      >
        {data.map((entry, index) => (
          <Cell
            key={`bar-cell-${index}`}
            fill={`url(#${PATTERNS[index % PATTERNS.length].id})`}
            stroke="#fff"
            strokeWidth={1}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

// Chart type toggle component
const ChartTypeToggle = ({ chartType, onChartTypeChange }) => (
  <div className="flex items-center gap-2 mb-4">
    <button
      onClick={() => onChartTypeChange("pie")}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${chartType === "pie" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
    >
      <PieChartIcon className="w-4 h-4" />
      Pie Chart
    </button>
    <button
      onClick={() => onChartTypeChange("bar")}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${chartType === "bar" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
    >
      <BarChartIcon className="w-4 h-4" />
      Bar Graph
    </button>
  </div>
);

// Main Faculty Dashboard Component
const FacultyFeedbackDashboard = ({ faculty }) => {
  const [activeTab, setActiveTab] = useState("current");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chartType, setChartType] = useState("pie");
  const [showFeedbackComments, setShowFeedbackComments] = useState(false);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyData, setFacultyData] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const dashboardRef = useRef(null);

  // Helper function to create the dashboard PDF
  const createDashboardPDF = async () => {
    if (!facultyData) return null;
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const margin = 10;
      let yPos = margin;
      const imgWidth = 90;
      const imgHeight = 60;
      let chartCount = 0;

      pdf.setFontSize(18);
      pdf.text(`Faculty: ${facultyData[0].name}`, margin, yPos);
      yPos += 10;

      pdf.setFontSize(12);
      pdf.text(`Academic Year: ${selectedAcademicYear}`, margin, yPos);
      yPos += 10;
      pdf.text(`Semester: ${selectedSemester}`, margin, yPos);
      yPos += 15;

      pdf.setFontSize(14);
      pdf.text("Feedback Statistics", margin, yPos);
      yPos += 10;

      const facultyForSelectedYear = facultyData.find(
        (f) => f.year === selectedYear && f.department === selectedBranch
      );

      if (!facultyForSelectedYear || !facultyForSelectedYear.feedback.length) {
        pdf.text("No feedback available.", margin, yPos);
        yPos += 10;
      }

      const charts = document.querySelectorAll(".chart-container");
      for (let i = 0; i < charts.length; i++) {
        if (chartCount % 4 === 0 && chartCount !== 0) {
          pdf.addPage();
          yPos = margin;
        }

        const canvas = await html2canvas(charts[i], { scale: 1 });
        const imgData = canvas.toDataURL("image/jpeg", 0.3);
        const xPos = margin + (chartCount % 2) * (imgWidth + 10);
        const row = Math.floor((chartCount % 4) / 2);
        const imgYPos = yPos + row * (imgHeight + 25);

        pdf.addImage(imgData, "JPEG", xPos, imgYPos, imgWidth, imgHeight);

        const feedbackData = facultyForSelectedYear.feedback.find(fb => fb.chartId === charts[i].id);
        if (feedbackData && feedbackData.options) {
          let optionYPos = imgYPos + imgHeight + 5;
          pdf.setFontSize(10);
          pdf.text("Stats:", xPos, optionYPos);
          optionYPos += 5;
          feedbackData.options.forEach((option) => {
            pdf.text(`${option.label}: ${option.count}`, xPos, optionYPos);
            optionYPos += 5;
          });
        }

        chartCount++;
      }

      yPos += Math.ceil(chartCount / 2) * (imgHeight + 25) + 10;

      pdf.setFontSize(14);
      pdf.text("Feedback Comments", margin, yPos);
      yPos += 10;

      pdf.setFontSize(12);
      pdf.text("Suggestions:", margin, yPos);
      yPos += 10;
      facultyForSelectedYear.feedback[0].suggestions.split("\n").forEach((suggestion) => {
        pdf.text(`- ${suggestion}`, margin + 5, yPos);
        yPos += 10;
      });

      pdf.text("Complaints:", margin, yPos);
      yPos += 10;
      facultyForSelectedYear.feedback[0].complaints.split("\n").forEach((complaint) => {
        pdf.text(`- ${complaint}`, margin + 5, yPos);
        yPos += 10;
      });

      return pdf.output("blob");
    } catch (error) {
      console.error("Error creating dashboard PDF:", error);
      return null;
    }
  };

  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        if (!faculty?.email) {
          throw new Error("Faculty email is required");
        }

        const response = await fetch(
          `https://feedbackend-mhol.onrender.com/api/faculty-feedback/by-email/${faculty.email}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch faculty data");
        }

        const data = await response.json();

        if (!data.faculties || !Array.isArray(data.faculties) || data.faculties.length === 0) {
          throw new Error("Invalid faculty data received");
        }

        setFacultyData(data.faculties);
        setYears(data.years || []);

        const firstFaculty = data.faculties[0];
        if (firstFaculty) {
          setSelectedBranch(firstFaculty.department || "None");
          setSelectedYear(firstFaculty.year || "");
          setSelectedSubject(firstFaculty.subjects?.[0]?.name || "");
          if (firstFaculty.feedback?.[0]) {
            setSelectedAcademicYear(firstFaculty.feedback[0].academicYear || "");
            setSelectedSemester("Semester 1");
          }
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
  }, [faculty]);

  // Set subject when year changes
  useEffect(() => {
    if (selectedYear && facultyData) {
      const facultyForSelectedYear = facultyData.find(
        (f) => f.year === selectedYear && f.department === selectedBranch
      );

      if (facultyForSelectedYear?.subjects?.length > 0) {
        setSelectedSubject(facultyForSelectedYear.subjects[0].name);
      } else {
        setSelectedSubject("");
      }
    }
  }, [selectedYear, facultyData, selectedBranch]);

  // Get current feedback data
  const getCurrentFeedbackData = () => {
    if (!facultyData) return null;
    try {
      const facultyForSelectedYear = facultyData.find(
        (f) => f.year === selectedYear && f.department === selectedBranch
      );

      if (!facultyForSelectedYear || !facultyForSelectedYear.feedback?.[0]) {
        return null;
      }

      const feedbackQuestions = facultyForSelectedYear.feedback[0].feedbackQuestions;
      const totalResponses = facultyForSelectedYear.totalResponses;

      const feedbackData = feedbackQuestions.reduce((acc, question) => {
        acc[question.Id] = question.responses.reduce((obj, response) => {
          obj[response.Option] = response.Count;
          return obj;
        }, {});
        return acc;
      }, {});

      feedbackData.totalResponses = totalResponses;
      return feedbackData;
    } catch (error) {
      return null;
    }
  };

  // Get historical feedback data
  const getHistoricalFeedbackData = () => {
    if (!facultyData) return null;
    try {
      const facultyForSelectedYear = facultyData.find(
        (f) => f.year === selectedYear && f.department === selectedBranch
      );
      if (!facultyForSelectedYear || !facultyForSelectedYear.feedback?.[0]) {
        return null;
      }

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

  const currentFeedbackData = getCurrentFeedbackData();
  const historicalFeedbackData = getHistoricalFeedbackData();

  const prepareChartData = (questionData) => {
    return Object.entries(questionData).map(([key, value]) => ({
      name: key,
      value: value,
    }));
  };

  const exportDashboardAsPDF = async () => {
    const pdfBlob = await createDashboardPDF();
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "faculty_feedback_report.pdf";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const sendAssuranceEmail = async () => {
    if (!facultyData) {
      alert("No faculty data available");
      return;
    }
    try {
      const pdfBlob = await createDashboardPDF();
      if (!pdfBlob) {
        alert("Error generating PDF.");
        return;
      }
      const formData = new FormData();
      formData.append("facultyEmail", faculty.email);
      formData.append("pdf", pdfBlob, "faculty_feedback_report.pdf");

      const response = await fetch("https://feedbackend-mhol.onrender.com/api/send-assurance-email", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Assurance email sent successfully!");
      } else {
        alert("Failed to send email: " + result.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
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
                  {facultyData?.[0]?.feedback?.[0]?.academicYear ? (
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
              {facultyData
                .find(
                  (f) =>
                    f.year === selectedYear && f.department === selectedBranch
                )
                ?.subjects.map((subject, index) => (
                  <option key={subject.name || index} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Faculty Feedback Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Faculty: {faculty?.name ? faculty.name : "Loading..."}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-gray-600 text-sm">
                  Total Responses:
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
              <button
                onClick={sendAssuranceEmail}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Mail className="w-4 h-4" />
                Send Assurance Email
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${activeTab === "current"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Current Feedback
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-medium rounded-lg transition-colors ${activeTab === "history"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            Feedback History
          </button>
        </div>

        {/* Charts Section */}
        {activeTab === "current" ? (
          currentFeedbackData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {Object.entries(currentFeedbackData).map(([key, value]) => {
                if (
                  typeof value !== "object" ||
                  key === "totalResponses" ||
                  key === "suggestions" ||
                  key === "complaints"
                ) {
                  return null;
                }

                const chartData = prepareChartData(value);

                return (
                  <div key={key} className="bg-white p-6 rounded-lg shadow-sm chart-container">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {key}
                    </h3>
                    <ChartTypeToggle
                      chartType={chartType}
                      onChartTypeChange={setChartType}
                    />
                    {chartType === "bar" ? (
                      <CustomBarChart data={chartData} />
                    ) : (
                      <CustomPieChart data={chartData} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-600">
              No feedback data available for the current year.
            </div>
          )
        ) : historicalFeedbackData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {Object.entries(historicalFeedbackData).map(([key, value]) => {
              if (
                typeof value !== "object" ||
                key === "totalResponses" ||
                key === "suggestions" ||
                key === "complaints"
              ) {
                return null;
              }

              const chartData = prepareChartData(value);

              return (
                <div key={key} className="bg-white p-6 rounded-lg shadow-sm chart-container">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {key}
                  </h3>
                  <ChartTypeToggle
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                  />
                  {chartType === "bar" ? (
                    <CustomBarChart data={chartData} />
                  ) : (
                    <CustomPieChart data={chartData} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-600">
            No feedback data available for the selected year.
          </div>
        )}

        {/* Feedback Comments Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowFeedbackComments(!showFeedbackComments)}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            {showFeedbackComments ? <ChevronUp /> : <ChevronDown />}
            {showFeedbackComments ? "Hide Feedback Comments" : "Show Feedback Comments"}
          </button>

          {showFeedbackComments && facultyData[0].feedback?.[0] && (
            <div className="bg-white p-6 mt-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Comments</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800">Suggestions:</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {facultyData[0].feedback[0].suggestions.split("\n").map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Complaints:</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {facultyData[0].feedback[0].complaints.split("\n").map((complaint, index) => (
                    <li key={index}>{complaint}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyFeedbackDashboard;