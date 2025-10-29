import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Star,
  CheckCircle,
  BarChart2,
  Target,
  BookOpen,
  Users,
  TrendingUp
} from 'lucide-react';

// Reusable UI Components
const Card = ({ className = '', children, ...props }) => (
  <div 
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className = '', children, ...props }) => (
  <div 
    className={`p-4 border-b border-gray-100 flex justify-between items-center ${className}`} 
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ className = '', children, icon, ...props }) => (
  <h2 
    className={`text-xl font-bold text-gray-800 flex items-center ${className}`} 
    {...props}
  >
    {icon && React.cloneElement(icon, { className: 'mr-3 text-purple-600' })}
    {children}
  </h2>
);

const TeacherDashboard = () => {
  const [teacherName] = useState('Prof. Emily Rodriguez');
  const [selectedClass, setSelectedClass] = useState('CSE-Third Year');
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');

  const classData = {
    'CSE-Third Year': {
      subjects: ['Data Structures', 'Algorithms', 'Machine Learning'],
      semesters: ['Fall 2024', 'Spring 2024', 'Fall 2023']
    },
    'CSE-Second Year': {
      subjects: ['Algorithms', 'Data Structures', 'Object Oriented Programming'],
      semesters: ['Spring 2024', 'Winter 2024', 'Spring 2023']
    },
    'AI&DS-First Year': {
      subjects: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
      semesters: ['Winter 2024', 'Spring 2024', 'Fall 2024']
    }
  };

  // Focused, Education-Specific Performance Data
  const performanceData = useMemo(() => ({
    overallRating: 4.5,
    educationalMetrics: [
      { 
        title: 'Student Engagement', 
        score: 85,
        icon: <Users size={24} />,
        description: 'Percentage of students actively participating in class'
      },
      { 
        title: 'Learning Outcomes', 
        score: 78,
        icon: <BookOpen size={24} />,
        description: 'Achievement of predefined course learning objectives'
      },
      { 
        title: 'Subject Mastery', 
        score: 92,
        icon: <Target size={24} />,
        description: 'Depth and breadth of subject knowledge demonstrated'
      }
    ],
    detailedAnalysis: {
      studentFeedback: [
        { 
          category: 'Course Content', 
          rating: 4.3,
          description: 'Relevance and comprehensiveness of course material'
        },
        { 
          category: 'Teaching Methodology', 
          rating: 4.5,
          description: 'Effectiveness of teaching approaches and techniques'
        },
        { 
          category: 'Doubt Resolution', 
          rating: 4.2,
          description: 'Quality and comprehensiveness of addressing student queries'
        }
      ]
    }
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome, {teacherName}
          </h1>
          <div className="flex justify-center items-center text-gray-600 space-x-4">
            <div className="flex items-center">
              <Star className="text-yellow-500 mr-2" />
              Performance Dashboard
            </div>
          </div>
        </div>

        {/* Performance Filters */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select 
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {Object.keys(classData).map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select 
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {classData[selectedClass].subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Semester
            </label>
            <select 
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {classData[selectedClass].semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 text-center">
            <div className="text-5xl font-bold text-purple-700 mb-4">
              {performanceData.overallRating}
            </div>
            <div className="text-gray-500 mb-4">Overall Performance Rating</div>
            <div className="flex justify-center space-x-1">
              {[1,2,3,4,5].map((star) => (
                <Star 
                  key={star} 
                  className={`${star <= performanceData.overallRating ? 'text-yellow-500' : 'text-gray-300'}`} 
                  size={24} 
                  fill={star <= performanceData.overallRating ? '#FFC107' : 'none'}
                />
              ))}
            </div>
          </Card>

          {/* Educational Metrics */}
          <Card>
            <CardHeader>
              <CardTitle icon={<BarChart2 />}>
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <div className="p-6 space-y-4">
              {performanceData.educationalMetrics.map((metric) => (
                <div 
                  key={metric.title} 
                  className="bg-gray-50 p-4 rounded-xl flex items-center"
                >
                  <div className="mr-4">{metric.icon}</div>
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-800">{metric.title}</div>
                    <div className="text-sm text-gray-600">{metric.description}</div>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {metric.score}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Student Feedback */}
        <Card>
          <CardHeader>
            <CardTitle icon={<CheckCircle />}>
              Student Feedback Analysis
            </CardTitle>
          </CardHeader>
          <div className="p-6 grid md:grid-cols-3 gap-6">
            {performanceData.detailedAnalysis.studentFeedback.map((feedback) => (
              <div 
                key={feedback.category} 
                className="bg-gray-50 p-5 rounded-xl text-center"
              >
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  {feedback.rating}/5
                </div>
                <div className="text-sm font-semibold text-gray-800 mb-2">
                  {feedback.category}
                </div>
                <div className="text-xs text-gray-600">
                  {feedback.description}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;