import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  {
    id: "pattern-lines",
    type: "line",
    spacing: 8,
    stroke: "#00C49F",
    strokeWidth: 2,
    rotation: 45,
  },
  {
    id: "pattern-diamonds",
    type: "path",
    d: "M 0 4 L 4 0 L 8 4 L 4 8 Z",
    fill: "#FFBB28",
    spacing: 8,
  }, // Changed from squares to diamonds
  {
    id: "pattern-stripes",
    type: "line",
    spacing: 6,
    stroke: "#FF8042",
    strokeWidth: 2,
    rotation: 0,
  },
  {
    id: "pattern-waves",
    type: "path",
    d: "M 0 4 Q 2 0 4 4 Q 6 8 8 4",
    stroke: "#8884d8",
    strokeWidth: 1.5,
    spacing: 8,
  },
  {
    id: "pattern-cross",
    type: "line",
    spacing: 6,
    stroke: "#82ca9d",
    strokeWidth: 2,
    rotation: 90,
  },
];

// Custom Pattern component
const CustomPattern = ({ id, type, ...props }) => {
  if (type === "circle") {
    return (
      <pattern
        id={id}
        patternUnits="userSpaceOnUse"
        width={props.size}
        height={props.size}
      >
        <circle
          cx={props.size / 2}
          cy={props.size / 2}
          r={props.size / 3}
          fill={props.fill}
        />
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
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={props.spacing}
          stroke={props.stroke}
          strokeWidth={props.strokeWidth}
        />
      </pattern>
    );
  } else if (type === "path") {
    return (
      <pattern
        id={id}
        patternUnits="userSpaceOnUse"
        width={props.spacing}
        height={props.spacing}
      >
        <path
          d={props.d}
          stroke={props.stroke}
          fill={props.fill}
          strokeWidth={props.strokeWidth}
        />
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
      <Tooltip formatter={(value, name) => [`${value}`, name]} />
      <Legend
        formatter={
          (value, entry, index) => `${value} (${data[index]?.value || 0})` // Keep counts in legend
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
        tickFormatter={
          (name, index) => `${name} (${data[index]?.value || 0})` // Add counts to x-axis labels
        }
      />
      <YAxis />
      <Tooltip formatter={(value, name) => [`${value}`, name]} />
      <Bar
        dataKey="value"
        label={{
          position: "top",
          formatter: (value) => value, // Show counts on top of bars
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
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        chartType === "pie"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <PieChartIcon className="w-4 h-4" />
      Pie Chart
    </button>
    <button
      onClick={() => onChartTypeChange("bar")}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        chartType === "bar"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600"
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
  const [currentFeedbackData, setCurrentFeedbackData] = useState(null);
  const [historicalFeedbackData, setHistoricalFeedbackData] = useState(null);

  // AI Summary states
  const [aiSummary, setAiSummary] = useState({
    overallSentiment: "",
    strengths: "",
    areasForImprovement: "",
    recommendations: "",
  });
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI("AIzaSyC1gRrRtZFIXFOzDwqhHODmn4DO1WjmU0c");

  const dashboardRef = useRef(null);

  // AI Summary generation function
  const generateAISummary = async (feedbackData) => {
    if (!feedbackData) return;
    setIsGeneratingSummary(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); // Using a standard model name

      // A clearer prompt for the AI
      const prompt = `
        You are an analytics assistant. Analyze the provided feedback data for a faculty member and provide a concise summary.
        Structure your response into exactly 4 sections using the following headings on new lines:
        
        Overall Sentiment:
        [Your analysis here]

        Strengths:
        [Your analysis here]
        
        Areas for Improvement:
        [Your analysis here]
        
        Key Recommendations:
        [Your analysis here]

        Each section should contain a concise analysis of 1-3 sentences.
        Do not use markdown formatting like ** or *.

        Feedback Data: ${JSON.stringify(feedbackData)}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // --- START: BUG FIX ---
      // This new robust parsing logic correctly extracts content for each section,
      // preventing the mix-up of data seen in the bug.

      /**
       * Parses a section from the AI's text response.
       * @param {string} text - The full text from the AI.
       * @param {string} currentHeading - The heading of the section to extract.
       * @param {string|null} nextHeading - The heading of the following section, or null if it's the last one.
       * @returns {string} The extracted and cleaned content for the section.
       */
      const parseSection = (text, currentHeading, nextHeading) => {
        const startRegex = new RegExp(currentHeading, "i");
        const startIndex = text.search(startRegex);

        if (startIndex === -1) {
          return ""; // Heading not found
        }
        
        // Find the start of the content (right after the heading)
        const headingMatch = text.substring(startIndex).match(startRegex)[0];
        const contentStartIndex = startIndex + headingMatch.length;

        let endIndex;
        if (nextHeading) {
          const endRegex = new RegExp(nextHeading, "i");
          // Search for the next heading *after* the current one's content starts
          const nextMatch = text.substring(contentStartIndex).match(endRegex);
          endIndex = nextMatch ? contentStartIndex + nextMatch.index : text.length;
        } else {
          endIndex = text.length; // If it's the last section, go to the end
        }

        // Extract the content, remove the colon, and trim whitespace
        return text.substring(contentStartIndex, endIndex).replace(":", "").replace(/\*\*/g, "").trim();
      };
      
      const overallSentiment = parseSection(text, "Overall Sentiment", "Strengths");
      const strengths = parseSection(text, "Strengths", "Areas for Improvement");
      const areasForImprovement = parseSection(text, "Areas for Improvement", "Key Recommendations");
      const recommendations = parseSection(text, "Key Recommendations", null);

      setAiSummary({
        overallSentiment: overallSentiment || "Analysis unavailable.",
        strengths: strengths || "Analysis unavailable.",
        areasForImprovement: areasForImprovement || "Analysis unavailable.",
        recommendations: recommendations || "Analysis unavailable."
      });
      // --- END: BUG FIX ---
      
    } catch (error) {
      console.error("Error generating AI summary:", error);
      // Fallback summary if API fails
      setAiSummary({
        overallSentiment: "Sentiment analysis unavailable",
        strengths: "Unable to identify strengths",
        areasForImprovement: "Unable to identify improvement areas",
        recommendations: "No recommendations available"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Generate AI summary when current feedback data changes
  useEffect(() => {
    if (currentFeedbackData) {
      generateAISummary(currentFeedbackData);
    }
  }, [currentFeedbackData]);

  useEffect(() => {
    if (currentFeedbackData) {
      console.group("Current Feedback Data");
      console.log("Complete current feedback data:", currentFeedbackData);
      console.log("Total responses:", currentFeedbackData.totalResponses);
      console.groupEnd();
    }
  }, [currentFeedbackData]);

  useEffect(() => {
    if (historicalFeedbackData) {
      console.group("Historical Feedback Data");
      console.log("Complete historical feedback data:", historicalFeedbackData);
      console.groupEnd();
    }
  }, [historicalFeedbackData]);

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

        const feedbackData = facultyForSelectedYear.feedback.find(
          (fb) => fb.chartId === charts[i].id
        );
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
      facultyForSelectedYear.feedback[0].suggestions
        .split("\n")
        .forEach((suggestion) => {
          pdf.text(`- ${suggestion}`, margin + 5, yPos);
          yPos += 10;
        });

      pdf.text("Complaints:", margin, yPos);
      yPos += 10;
      facultyForSelectedYear.feedback[0].complaints
        .split("\n")
        .forEach((complaint) => {
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

        if (
          !data.faculties ||
          !Array.isArray(data.faculties) ||
          data.faculties.length === 0
        ) {
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
            setSelectedAcademicYear(
              firstFaculty.feedback[0].academicYear || ""
            );
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

      const feedbackQuestions =
        facultyForSelectedYear.feedback[0].feedbackQuestions;
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
      console.error("Error getting current feedback data:", error);
      return null;
    }
  };

  useEffect(() => {
    setCurrentFeedbackData(getCurrentFeedbackData());
  }, [facultyData, selectedYear, selectedBranch]);

  useEffect(() => {
    setHistoricalFeedbackData(getHistoricalFeedbackData());
  }, [facultyData, selectedYear, selectedBranch]);
  
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

  const prepareChartData = (questionData) => {
    if (!questionData) return [];

    const chartData = Object.entries(questionData)
      .map(([key, value]) => {
        if (key === "totalResponses") return null;

        return {
          name: key,
          value: value,
        };
      })
      .filter(Boolean);

    console.groupEnd();
    return chartData;
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

      const response = await fetch(
        "https://feedbackend-mhol.onrender.com/api/send-assurance-email",
        {
          method: "POST",
          body: formData,
        }
      );
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
                ?.subjects?.map((subject, index) => (
                  <option key={subject.name || index} value={subject.name}>
                    {subject.name}
                  </option>
                )) || <option value="">No subjects available</option>}
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
                <h3 className="text-gray-600 text-sm">Total Responses:</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {activeTab === "current"
                    ? currentFeedbackData?.totalResponses || 0
                    : historicalFeedbackData?.totalResponses || 0}
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
                  <div
                    key={key}
                    className="bg-white p-6 rounded-lg shadow-sm chart-container"
                  >
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
                <div
                  key={key}
                  className="bg-white p-6 rounded-lg shadow-sm chart-container"
                >
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

        {/* AI Summary Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  AI Feedback Analysis
                </h3>
                {isGeneratingSummary && (
                  <span className="text-sm text-gray-500">Generating...</span>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Overall Sentiment</h4>
                      <p className="text-gray-600 mt-1">
                        {aiSummary.overallSentiment || 
                          (isGeneratingSummary
                            ? "Analyzing feedback sentiment..." 
                            : "No feedback data available for sentiment analysis.")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Strengths</h4>
                      <p className="text-gray-600 mt-1">
                        {aiSummary.strengths || 
                          (isGeneratingSummary
                            ? "Identifying key strengths..." 
                            : "No feedback data available to identify strengths.")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Areas for Improvement
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {aiSummary.areasForImprovement || 
                          (isGeneratingSummary
                            ? "Identifying potential improvements..." 
                            : "No feedback data available to identify improvement areas.")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        AI Recommendations
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {aiSummary.recommendations || 
                          (isGeneratingSummary
                            ? "Generating recommendations..." 
                            : "No feedback data available for recommendations.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  AI-powered analysis generated on{" "}
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Comments Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowFeedbackComments(!showFeedbackComments)}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            {showFeedbackComments ? <ChevronUp /> : <ChevronDown />}
            {showFeedbackComments
              ? "Hide Feedback Comments"
              : "Show Feedback Comments"}
          </button>

          {showFeedbackComments &&
            facultyData &&
            facultyData[0]?.feedback?.[0] && (
              <div className="bg-white p-6 mt-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Feedback Comments
                </h3>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800">Suggestions:</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {facultyData[0].feedback[0].suggestions
                      .split("\n")
                      .map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Complaints:</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {facultyData[0].feedback[0].complaints
                      .split("\n")
                      .map((complaint, index) => (
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