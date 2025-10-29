import React, { useState } from 'react';
import { 
  Clock,
  Send,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackPage = () => {
  const [currentSection, setCurrentSection] = useState('objective');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  
  // Faculty data
  const facultyList = [
    {
      id: 1,
      name: "Dr. Smith",
      subject: "Data Structures",
      deadline: "October 31, 2024"
    },
    {
      id: 2,
      name: "Dr. Williams",
      subject: "Database Systems",
      deadline: "October 31, 2024"
    },
    {
      id: 3,
      name: "Vijay Sangolki",
      subject: "Software Testing",
      deadline: "October 31, 2024"
    }
  ];

  const questions = [
    {
      section: 'objective',
      questions: [
        {
          id: 'courseOutcomes',
          question: 'Explains the course Outcomes (CO) at the starting of the subject',
          options: ['Yes', 'No', 'NA']
        },
        {
          id: 'subjectKnowledge',
          question: 'Has sound subject knowledge',
          options: ['Low', 'Medium', 'High', 'NA']
        },
        {
          id: 'conceptClarity',
          question: 'Clears concept',
          options: ['Clear All Concept', 'Not clear Concept', 'NA']
        },
        {
          id: 'systematic',
          question: 'Conducts in Systematic & Planned Manner',
          options: ['Yes', 'No', 'NA']
        },
        {
          id: 'encouragement',
          question: 'Encourages students to ask doubts',
          options: ['Yes', 'No', 'NA']
        },
        {
          id: 'satisfaction',
          question: 'Clears students doubts till satisfaction',
          options: ['Satisfy', 'Not Satisfy', 'NA']
        },
        {
          id: 'presentation',
          question: 'Has good board Writing and presentation',
          options: ['Good Writing and Presentation', 'Not Good Writing and Presentation', 'NA']
        },
        {
          id: 'pptUsage',
          question: 'Uses appropriate PPT of the subject',
          options: ['Yes', 'No', 'NA']
        },
        
      ]
    },
    {
      section: 'teaching',
      questions: [
        {
          id: 'teachingMethod',
          question: 'Teaching method preference',
          options: ['Use only PPT', 'Use only Blackboard', 'Use both PPT and Blackboard']
        },
        {
          id: 'notes',
          question: 'Provides notes',
          options: ['Yes', 'No', 'NA']
        },
        {
          id: 'englishProficiency',
          question: 'English proficiency level',
          options: ['Good English Proficiensy', 'Not good English Proficiency', 'NA']
        },
        {
          id: 'motivation',
          question: 'Is friendly, helpful and motivates students',
          options: ['Motivates the students for overall development', 'Not motivates the students for overall development', 'NA']
        },
        {
          id: 'effectiveness',
          question: 'Teaching is effective and understandable',
          options: ['Effective and understandable teaching', 'Not effective and Understandable Teaching']
        },
        {
          id: 'punctuality',
          question: 'Is Punctual (Reports to class in time)',
          options: ['Punctual', 'Not Punctual', 'NA']
        },
        {
          id: 'careerOrientation',
          question: 'Orients subject towards placement/GATE/competitive exams',
          options: ['Yes', 'No']
        },
        {
          id: 'overallRating',
          question: 'Overall Rating',
          options: ['Excellent', 'Good', 'Average', 'Poor']
        },
        {
          id: 'suggestions',
          question: 'Suggestions for Improvement',
          type: 'textarea'
        }
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log({ answers });
    setIsSubmitting(false);
  };

  const ProgressIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {['objective', 'teaching'].map((section, index) => (
          <React.Fragment key={section}>
            <motion.div
              className={`h-3 w-3 rounded-full ${
                currentSection === section 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
              animate={{
                scale: currentSection === section ? [1, 1.2, 1] : 1
              }}
              transition={{
                duration: 0.5,
                repeat: currentSection === section ? Infinity : 0,
                repeatDelay: 1
              }}
            />
            {index < 1 && (
              <div className="w-24 h-0.5 bg-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Feedback</h1>
              <p className="text-gray-600 mt-1">Session 2 - Fall 2024</p>
            </div>
            <motion.div 
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Feedback Deadline</h3>
                <p className="text-amber-700 text-sm">
                  Please submit your feedback before October 31, 2024
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Faculty List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Faculty List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facultyList.map((faculty) => (
              <div 
                key={faculty.id}
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
              >
                <h4 className="font-medium text-gray-900">{faculty.name}</h4>
                <p className="text-sm text-gray-500">{faculty.subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Feedback Form
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Please provide feedback for all faculty members
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <ProgressIndicator />
            
            <AnimatePresence mode="wait">
              {questions.map((section) => (
                section.section === currentSection && (
                  <motion.div
                    key={section.section}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    {section.questions.map((q, index) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.1 }
                        }}
                        className="p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <label className="block text-lg font-medium text-gray-900 mb-4">
                          {q.question}
                        </label>
                        
                        <div className="space-y-4">
                          {facultyList.map((faculty) => (
                            <div key={faculty.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="w-48 flex-shrink-0">
                                <h4 className="font-medium text-gray-900">{faculty.name}</h4>
                                <p className="text-sm text-gray-500">{faculty.subject}</p>
                              </div>
                              <div className="flex flex-wrap gap-3 w-full">
                                {q.type === 'textarea' ? (
                                  <textarea
                                    rows="3"
                                    placeholder="Enter your suggestions here..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={answers[q.id]?.[faculty.id] || ''}
                                    onChange={(e) => setAnswers(prev => ({
                                      ...prev,
                                      [q.id]: {
                                        ...prev[q.id],
                                        [faculty.id]: e.target.value
                                      }
                                    }))}
                                  />
                                ) : (
                                  q.options.map((option) => (
                                    <motion.button
                                      key={option}
                                      type="button"
                                      onClick={() => setAnswers(prev => ({
                                        ...prev,
                                        [q.id]: {
                                          ...prev[q.id],
                                          [faculty.id]: option
                                        }
                                      }))}
                                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                        answers[q.id]?.[faculty.id] === option
                                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                                          : 'border-gray-200 hover:border-blue-200 text-gray-700'
                                      }`}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      {option}
                                    </motion.button>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )
              ))}
            </AnimatePresence>

            {/* Navigation/Submit Buttons */}
            <div className="flex justify-between pt-4 border-t">
              {currentSection === 'teaching' && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setCurrentSection('objective')}
                  className="px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Previous
                </motion.button>
              )}
              
              <motion.button
                type={currentSection === 'teaching' ? 'submit' : 'button'}
                onClick={() => {
                  if (currentSection === 'objective') {
                    setCurrentSection('teaching');
                  }
                }}
                disabled={isSubmitting}
                className={`ml-auto px-6 py-3 ${
                  currentSection === 'teaching'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-lg transition-colors flex items-center space-x-2`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {currentSection === 'objective' ? 'Next Section' : 'Submit Feedback'}
                    </span>
                    {currentSection === 'teaching' ? (
                      <Send className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default FeedbackPage;