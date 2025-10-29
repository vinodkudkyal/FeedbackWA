import React, { useState } from 'react';
import { Plus, Trash2, MoveUp, MoveDown, Save, Edit2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackFormAdmin = () => {
  const [sections, setSections] = useState([
    {
      id: 'objective',
      title: 'Objective Questions',
      questions: []
    },
    {
      id: 'teaching',
      title: 'Teaching Methods',
      questions: []
    }
  ]);

  const [currentSection, setCurrentSection] = useState('objective');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'options',
    options: ['']
  });

  const handleAddOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index, value) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (newQuestion.type === 'options' && newQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all options');
      return;
    }

    setSections(prev => prev.map(section => {
      if (section.id === currentSection) {
        return {
          ...section,
          questions: [...section.questions, {
            id: Date.now().toString(),
            ...newQuestion
          }]
        };
      }
      return section;
    }));

    setNewQuestion({
      question: '',
      type: 'options',
      options: ['']
    });
    setShowQuestionForm(false);
  };

  const handleSaveForm = () => {
    // Here you would typically make an API call to save the form
    console.log('Saving form:', sections);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const moveQuestion = (sectionId, currentIndex, direction) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newQuestions = [...section.questions];
        const newIndex = currentIndex + direction;
        [newQuestions[currentIndex], newQuestions[newIndex]] = 
        [newQuestions[newIndex], newQuestions[currentIndex]];
        return { ...section, questions: newQuestions };
      }
      return section;
    }));
  };

  const deleteQuestion = (sectionId, questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setSections(prev => prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.filter(q => q.id !== questionId)
          };
        }
        return section;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feedback Form Builder</h1>
              <p className="text-gray-600 mt-1">Create and manage feedback questions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveForm}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Form</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Section Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex space-x-4 mb-6">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentSection === section.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {sections.find(s => s.id === currentSection)?.questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{q.question}</h3>
                    {q.type === 'options' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {q.options.map((option, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {option}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {index > 0 && (
                      <button
                        onClick={() => moveQuestion(currentSection, index, -1)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                    )}
                    {index < sections.find(s => s.id === currentSection).questions.length - 1 && (
                      <button
                        onClick={() => moveQuestion(currentSection, index, 1)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteQuestion(currentSection, q.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add Question Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowQuestionForm(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-500 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Question</span>
            </motion.button>
          </div>
        </div>

        {/* Add/Edit Question Modal */}
        <AnimatePresence>
          {showQuestionForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Question</h2>
                  <button
                    onClick={() => setShowQuestionForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter your question"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="options">Multiple Choice</option>
                      <option value="textarea">Text Response</option>
                    </select>
                  </div>

                  {newQuestion.type === 'options' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options
                      </label>
                      <div className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              onClick={() => handleRemoveOption(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleAddOption}
                          className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-500"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setShowQuestionForm(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddQuestion}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {showSaveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Form saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedbackFormAdmin;