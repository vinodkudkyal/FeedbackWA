import React, { useState, useMemo } from 'react';
import { 
  Users, 
  BookOpen, 
  UserPlus, 
  CheckCircle, 
  ArrowRightCircle,
  Filter,
  BookmarkPlus
} from 'lucide-react';

// Reusable Card Component
const Card = ({ className = '', children, ...props }) => (
  <div 
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

const TeacherAssignmentDashboard = () => {
  // State Management
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('Third Year');
  const [searchTeacher, setSearchTeacher] = useState('');

  // Comprehensive Data Structure
  const departmentData = useMemo(() => ({
    departments: [
      'Computer Science', 
      'Artificial Intelligence', 
      'Data Science', 
      'Information Technology'
    ],
    years: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'],
    subjects: {
      'Computer Science': {
        'Third Year': [
          { code: 'CS301', name: 'Data Structures', assignedTeacher: null },
          { code: 'CS302', name: 'Algorithms', assignedTeacher: null },
          { code: 'CS303', name: 'Operating Systems', assignedTeacher: null },
          { code: 'CS304', name: 'Computer Networks', assignedTeacher: null }
        ]
      }
    },
    teachers: [
      { 
        id: 1, 
        name: 'Emily Rodriguez', 
        expertise: 'Data Structures', 
        department: 'Computer Science' 
      },
      { 
        id: 2, 
        name: 'David Chen', 
        expertise: 'Algorithms', 
        department: 'Computer Science' 
      },
      { 
        id: 3, 
        name: 'Sarah Kim', 
        expertise: 'Operating Systems', 
        department: 'Computer Science' 
      }
    ]
  }), []);

  // Filtered Teachers
  const filteredTeachers = useMemo(() => {
    return departmentData.teachers.filter(teacher => 
      teacher.department === selectedDepartment &&
      teacher.name.toLowerCase().includes(searchTeacher.toLowerCase())
    );
  }, [selectedDepartment, searchTeacher]);

  // Available Subjects
  const availableSubjects = useMemo(() => {
    return departmentData.subjects[selectedDepartment]?.[selectedYear] || [];
  }, [selectedDepartment, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Teacher Subject Assignment
          </h1>
          <div className="flex justify-center items-center text-gray-600 space-x-4">
            <BookmarkPlus className="text-purple-500 mr-2" />
            <span>Assign Teachers to Subjects</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Department Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Department
            </label>
            <select 
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departmentData.departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Year
            </label>
            <select 
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {departmentData.years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Teacher Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Teacher
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
              />
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Main Assignment Area */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Subjects Card */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="text-purple-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                Subjects ({selectedYear})
              </h2>
            </div>
            <div className="space-y-4">
              {availableSubjects.map((subject) => (
                <div 
                  key={subject.code} 
                  className="bg-gray-50 p-4 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{subject.name}</div>
                    <div className="text-sm text-gray-600">{subject.code}</div>
                  </div>
                  {subject.assignedTeacher ? (
                    <div className="text-green-600 font-medium">
                      Assigned
                    </div>
                  ) : (
                    <div className="text-red-600 font-medium">
                      Unassigned
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Teachers Card */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Users className="text-purple-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">
                Available Teachers
              </h2>
            </div>
            <div className="space-y-4">
              {filteredTeachers.map((teacher) => (
                <div 
                  key={teacher.id} 
                  className="bg-gray-50 p-4 rounded-xl flex items-center"
                >
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-800">{teacher.name}</div>
                    <div className="text-sm text-gray-600">{teacher.expertise}</div>
                  </div>
                  <button 
                    className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
                  >
                    Assign 
                    <ArrowRightCircle className="ml-2" size={20} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentDashboard;