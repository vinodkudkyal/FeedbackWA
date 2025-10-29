import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, ChevronDown, Filter, Download, ChevronUp, PieChart as PieChartIcon, BarChartIcon } from 'lucide-react';



const years = ["First Year", "Third Year"];
const branches = ["Computer Science", "Information Technology"];
const semesters = ["Semester 1", "Semester 2"];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartTypeToggle = ({ chartType, onChartTypeChange }) => (
  <div className="flex items-center gap-2 mb-4">
    <button
      onClick={() => onChartTypeChange('bar')}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
      }`}
    >
      <BarChartIcon className="w-4 h-4" />
      Bar Chart
    </button>
    <button
      onClick={() => onChartTypeChange('pie')}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
      }`}
    >
      <PieChartIcon className="w-4 h-4" />
      Pie Chart
    </button>
  </div>
);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const CustomPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={100}
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

const mockHistoricalData = {
  "Fall 2022": {
    courseOutcomes: { Yes: 82, No: 12, NA: 6 },
    satisfaction: { Satisfy: 80, "Not Satisfy": 15, NA: 5 },
    totalResponses: 140
  },
  "Spring 2023": {
    courseOutcomes: { Yes: 84, No: 11, NA: 5 },
    satisfaction: { Satisfy: 83, "Not Satisfy": 14, NA: 3 },
    totalResponses: 145
  },
  "Fall 2023": {
    courseOutcomes: { Yes: 85, No: 10, NA: 5 },
    satisfaction: { Satisfy: 85, "Not Satisfy": 12, NA: 3 },
    totalResponses: 150
  },
  "Spring 2024": {
    courseOutcomes: { Yes: 88, No: 8, NA: 4 },
    satisfaction: { Satisfy: 88, "Not Satisfy": 10, NA: 2 },
    totalResponses: 160
  }
};

// Mock data structure for current feedback
const mockFeedbackHistory = {
  "First Year": {
    "Computer Science": {
      "Semester 1": [
        {
          semester: "Fall 2023",
          feedbackData: {
            courseOutcomes: { Yes: 85, No: 10, NA: 5 },
            subjectKnowledge: { High: 75, Medium: 20, Low: 5 },
            conceptClarity: { "Clear All Concept": 80, "Not clear Concept": 15, NA: 5 },
            systematic: { Yes: 90, No: 8, NA: 2 },
            encouragement: { Yes: 88, No: 10, NA: 2 },
            satisfaction: { Satisfy: 85, "Not Satisfy": 12, NA: 3 },
            presentation: { "Good Writing and Presentation": 82, "Not Good Writing and Presentation": 15, NA: 3 },
            pptUsage: { Yes: 90, No: 8, NA: 2 },
            totalResponses: 150,
            suggestions: [
              "Great for first-year students",
              "Explains fundamentals well",
              "Patient with newcomers"
            ],
            complaints: [
              "Could use more basic examples",
              "Need more practice sessions"
            ]
          }
        }
      ]
    }
  },
  "Third Year": {
    "Information Technology": {
      "Semester 1": [
        {
          semester: "Fall 2023",
          feedbackData: {
            courseOutcomes: { Yes: 88, No: 8, NA: 4 },
            subjectKnowledge: { High: 80, Medium: 15, Low: 5 },
            conceptClarity: { "Clear All Concept": 85, "Not clear Concept": 12, NA: 3 },
            systematic: { Yes: 92, No: 6, NA: 2 },
            encouragement: { Yes: 90, No: 8, NA: 2 },
            satisfaction: { Satisfy: 88, "Not Satisfy": 10, NA: 2 },
            presentation: { "Good Writing and Presentation": 85, "Not Good Writing and Presentation": 12, NA: 3 },
            pptUsage: { Yes: 92, No: 6, NA: 2 },
            totalResponses: 160,
            suggestions: [
              "Advanced topics well covered",
              "Industry-relevant examples",
              "Good project guidance"
            ],
            complaints: [
              "Could include more practical workshops",
              "Need more industry case studies"
            ]
          }
        }
      ]
    }
  }
};

const prepareQuestionData = (feedbackData) => {
  const sections = [
    {
      title: "Course Delivery",
      questions: [
        { id: "courseOutcomes", label: "Explains Course Outcomes", data: feedbackData.courseOutcomes },
        { id: "subjectKnowledge", label: "Subject Knowledge", data: feedbackData.subjectKnowledge },
        { id: "conceptClarity", label: "Concept Clarity", data: feedbackData.conceptClarity },
        { id: "systematic", label: "Systematic Delivery", data: feedbackData.systematic }
      ]
    },
    {
      title: "Student Interaction",
      questions: [
        { id: "encouragement", label: "Student Encouragement", data: feedbackData.encouragement },
        { id: "satisfaction", label: "Doubt Resolution", data: feedbackData.satisfaction }
      ]
    },
    {
      title: "Teaching Methods",
      questions: [
        { id: "presentation", label: "Presentation Quality", data: feedbackData.presentation },
        { id: "pptUsage", label: "PPT Usage", data: feedbackData.pptUsage }
      ]
    }
  ];
  return sections;
};

// Helper function to prepare chart data
const prepareChartData = (questionData) => {
  return Object.entries(questionData).map(([key, value]) => ({
    name: key,
    value: value
  }));
};

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const FacultyFeedbackDashboard = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [historicalChartType, setHistoricalChartType] = useState('bar');

  
  const getFeedbackData = () => {
    try {
      return mockFeedbackHistory[selectedYear][selectedBranch][selectedSemester][0] || null;
    } catch (error) {
      return null;
    }
  };

  const currentFeedback = getFeedbackData();

  const getHistoricalTrendData = () => {
    return Object.entries(mockHistoricalData).map(([semester, data]) => ({
      name: semester,
      satisfaction: data.satisfaction.Satisfy,
      courseOutcomes: data.courseOutcomes.Yes,
      responses: data.totalResponses
    }));
  };

  const CurrentStatsView = () => (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-500 text-sm">Total Responses</h3>
          <p className="text-2xl font-bold">{currentFeedback.feedbackData.totalResponses}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-500 text-sm">Overall Satisfaction</h3>
          <p className="text-2xl font-bold">{currentFeedback.feedbackData.satisfaction.Satisfy}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-500 text-sm">Subject Knowledge</h3>
          <p className="text-2xl font-bold">{currentFeedback.feedbackData.subjectKnowledge.High}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-500 text-sm">Concept Clarity</h3>
          <p className="text-2xl font-bold">{currentFeedback.feedbackData.conceptClarity["Clear All Concept"]}%</p>
        </div>
      </div>

      {/* Question-wise Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Question-wise Analysis</h2>
        {prepareQuestionData(currentFeedback.feedbackData).map((section, sectionIndex) => (
          <div key={section.title} className="mb-6">
            <button
              onClick={() => setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)}
              className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-medium">{section.title}</h3>
              {expandedSection === sectionIndex ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSection === sectionIndex && (
              <div className="mt-4 space-y-6">
                {section.questions.map((question) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <h4 className="text-md font-medium mb-4">{question.label}</h4>
                    <ChartTypeToggle 
                      chartType={chartType} 
                      onChartTypeChange={setChartType}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {Object.entries(question.data).map(([option, count]) => (
                          <div key={option} className="flex justify-between items-center">
                            <span className="text-gray-600">{option}</span>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 rounded-full h-2"
                                  style={{
                                    width: `${(count / currentFeedback.feedbackData.totalResponses) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {count} ({((count / currentFeedback.feedbackData.totalResponses) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="min-h-[300px] w-full">
                        {chartType === 'bar' ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={prepareChartData(question.data)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#4F46E5" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <CustomPieChart data={prepareChartData(question.data)} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  

  const HistoricalView = () => (
    <div className="space-y-8">
      {/* Historical Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Historical Trends</h2>
        <ChartTypeToggle 
          chartType={historicalChartType} 
          onChartTypeChange={setHistoricalChartType}
        />
        <div className="min-h-[400px] w-full">
          {historicalChartType === 'bar' ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getHistoricalTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="satisfaction" fill="#8884d8" name="Satisfaction %" />
                <Bar dataKey="courseOutcomes" fill="#82ca9d" name="Course Outcomes %" />
                <Bar dataKey="responses" fill="#ffc658" name="Total Responses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <CustomPieChart 
              data={getHistoricalTrendData().map(item => ({
                name: item.name,
                value: item.satisfaction
              }))} 
            />
          )}
        </div>
      </div>

      {/* Semester Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Semester-wise Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Responses
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Outcomes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(mockHistoricalData).map(([semester, data]) => (
                <tr key={semester}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.totalResponses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.satisfaction.Satisfy}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.courseOutcomes.Yes}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section with Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Faculty Feedback Dashboard</h1>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b pb-4">
              <TabButton
                active={activeTab === 'current'}
                onClick={() => setActiveTab('current')}
              >
                Current Stats
              </TabButton>
              <TabButton
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
              >
                Historical Data
              </TabButton>
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-wrap gap-4 items-center pt-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Year:</span>
                <select 
                  className="border rounded-lg px-4 py-2"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">Branch:</span>
                <select 
                  className="border rounded-lg px-4 py-2"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">Semester:</span>
                <select 
                  className="border rounded-lg px-4 py-2"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'current' ? <CurrentStatsView /> : <HistoricalView />}
      </div>
    </div>
  );
};

export default FacultyFeedbackDashboard;