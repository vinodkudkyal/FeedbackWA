import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Users,
  BookOpen,
  Star
} from 'lucide-react';

// Internal Card Components
const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = '', children }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ className = '', children }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const StudentDashboard = () => {
  // Updated to show semester-wise feedback history
  const feedbackHistory = [
    { 
      semester: 'Fall 2023', 
      firstSession: 100,
      secondSession: 90,
      totalCourses: 6,
      completedFeedbacks: 12
    },
    { 
      semester: 'Spring 2024', 
      firstSession: 95,
      secondSession: 85,
      totalCourses: 5,
      completedFeedbacks: 10
    },
    { 
      semester: 'Fall 2024', 
      firstSession: 90,
      secondSession: null,
      totalCourses: 5,
      completedFeedbacks: 5
    }
  ];

  const currentSession = {
    semester: "Fall 2024",
    sessionNumber: 2,
    startDate: "October 24, 2024",
    endDate: "October 31, 2024",
    isActive: true,
    remainingTime: "6 days, 12 hours"
  };

  const courses = [
    { 
      id: 1, 
      name: "Data Structures", 
      professor: "Dr. Smith", 
      status: "Pending",
      sessionNumber: 2
    },
    { 
      id: 2, 
      name: "Algorithm Analysis", 
      professor: "Dr. Johnson", 
      status: "Completed",
      sessionNumber: 2
    },
    { 
      id: 3, 
      name: "Database Systems", 
      professor: "Dr. Williams", 
      status: "Pending",
      sessionNumber: 2
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Section with Current Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Welcome Back, Student!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`px-4 py-3 rounded-lg ${currentSession.isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  <div className="flex items-center space-x-2">
                    <Clock size={20} />
                    <span className="font-medium">Active Feedback Session</span>
                  </div>
                  <p className="text-sm mt-1">
                    {currentSession.semester} - Session {currentSession.sessionNumber}
                  </p>
                  <p className="text-sm mt-1">{currentSession.startDate} - {currentSession.endDate}</p>
                  <p className="text-sm mt-1 font-medium">Time Remaining: {currentSession.remainingTime}</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  Remember: This is the second feedback session for this semester. Please ensure you submit feedback for all your courses before the deadline.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Session Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="text-green-500" />
                    <span>Completed</span>
                  </div>
                  <span className="font-medium">2/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="text-yellow-500" />
                    <span>Pending</span>
                  </div>
                  <span className="font-medium">3/5</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Session 2 of Fall 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester-wise Feedback History */}
        <Card>
          <CardHeader>
            <CardTitle>Semester Feedback History</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedbackHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="firstSession" name="First Session" fill="#8884d8" />
                <Bar dataKey="secondSession" name="Second Session" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Feedback completion rate (%) for each session per semester
            </div>
          </CardContent>
        </Card>

        {/* Current Semester Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Current Semester Courses - Session 2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.professor}</p>
                      <p className="text-xs text-gray-400 mt-1">Session {course.sessionNumber}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      course.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  {course.status === 'Pending' && (
                    <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Submit Feedback
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;