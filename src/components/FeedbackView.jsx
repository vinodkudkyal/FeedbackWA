import React, { useState, useMemo } from 'react';
import { 
  Eye,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Info
} from 'lucide-react';

// Reusing components from the previous dashboard
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

const FeedbackView = () => {
  const [teacherName] = useState('Prof. Emily Rodriguez');
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  // Mock feedback data (replace with actual API data)
  const feedbackData = useMemo(() => [
    {
      id: 1,
      semester: 'Fall 2024',
      overallRating: 4.5,
      previewText: 'Comprehensive and engaging course delivery...',
      detailedFeedback: {
        questions: [
          { 
            question: 'How clear were the course objectives?', 
            rating: 4.7,
            comment: 'Objectives were well-defined and clearly communicated.'
          },
          { 
            question: 'How effective was the teaching methodology?', 
            rating: 4.6,
            comment: 'Interactive sessions and real-world examples made learning enjoyable.'
          },
          // Add more questions as needed (10-13 total)
          { 
            question: 'How helpful were the course materials?', 
            rating: 4.5,
            comment: 'Comprehensive and up-to-date resources provided.'
          },
          // ... additional questions
        ]
      }
    },
    {
      id: 2,
      semester: 'Fall 2024',
      overallRating: 4.3,
      previewText: 'Challenging course with valuable insights...',
      detailedFeedback: {
        questions: [
          { 
            question: 'Rate the course difficulty', 
            rating: 4.2,
            comment: 'Challenging but intellectually stimulating.'
          },
          { 
            question: 'Instructor\'s subject knowledge', 
            rating: 4.8,
            comment: 'Demonstrated deep understanding of the subject matter.'
          },
          // More questions...
        ]
      }
    }
  ], []);

  const toggleFeedbackExpand = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Feedback Overview
          </h1>
          <div className="flex justify-center items-center text-gray-600 space-x-4">
            <MessageCircle className="text-purple-600 mr-2" />
            <span>Student Feedback for {teacherName}</span>
          </div>
        </div>

        {/* Semester Filter */}
        <div className="mb-8 flex justify-center">
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Semester
            </label>
            <select 
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="Fall 2024">Fall 2024</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Fall 2023">Fall 2023</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {feedbackData.map((feedback) => (
            <Card key={feedback.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle icon={<Info />}>
                  Feedback {feedback.id}
                </CardTitle>
                <div className="flex items-center">
                  <span className="text-purple-700 font-semibold mr-4">
                    Rating: {feedback.overallRating}/5
                  </span>
                  <button 
                    onClick={() => toggleFeedbackExpand(feedback.id)}
                    className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    {expandedFeedback === feedback.id ? (
                      <>
                        <ChevronUp className="mr-2" /> Collapse
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2" /> View Details
                      </>
                    )}
                  </button>
                </div>
              </CardHeader>

              {/* Preview Section */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{feedback.previewText}</p>
                
                {/* Expanded Feedback Details */}
                {expandedFeedback === feedback.id && (
                  <div className="mt-6 space-y-4">
                    {feedback.detailedFeedback.questions.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 p-4 rounded-xl"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {item.question}
                          </h3>
                          <div className="text-xl font-bold text-purple-700">
                            {item.rating}/5
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {item.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackView;