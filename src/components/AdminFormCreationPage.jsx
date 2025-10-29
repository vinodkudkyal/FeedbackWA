import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Trash } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useLocation } from "react-router-dom";

const AdminFormCreationPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "multiple-choice",
    options: [],
  });
  const [currentOption, setCurrentOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    branch: "",
    academicYear: "",
    year: "",
    semester: "",
    classType: ""
  });

  // Get admin's department from location state
  const location = useLocation();
  const adminDepartment = location.state?.department || localStorage.getItem("adminDepartment") || "";

  const branches = [adminDepartment]; // Only show the admin's department
  const academicYears = ["2023-24", "2022-23", "2021-22"];
  const years = ["FY", "SY", "TY", "BE"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const questionTypes = ["multiple-choice", "text"];
  const classTypes = ["Lab", "Theory"];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new question to the form
  const handleAddQuestion = () => {
    if (!currentQuestion.text || (currentQuestion.type === "multiple-choice" && currentQuestion.options.length === 0)) {
      alert("Please add a question and at least one option (if multiple-choice).");
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ text: "", type: "multiple-choice", options: [] });
  };

  // Add a new option to the current question
  const handleAddOption = () => {
    if (!currentOption.trim()) {
      alert("Please enter a valid option.");
      return;
    }
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, currentOption],
    }));
    setCurrentOption("");
  };

  // Remove a question from the form
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Submit the entire form to the backend
  const handleSubmitForm = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    const formData = {
      questions: questions,
      filters: filters
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("https://feedbackend-mhol.onrender.com/api/create-feedback-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create feedback form");
      }

      const data = await response.json();
      alert("Feedback form created successfully!");
      console.log("Form created:", data);
      setQuestions([]);
      setFilters({
        branch: "",
        academicYear: "",
        year: "",
        semester: "",
        classType: ""
      });
    } catch (error) {
      console.error("Error creating feedback form:", error);
      alert("Failed to create feedback form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Filters Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Branch Filter - Read-only for admin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={adminDepartment}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Academic Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <select
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  name="semester"
                  value={filters.semester}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Question Creation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Questions</h2>

            {/* Question Text */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-900">Question:</label>
              <input
                type="text"
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter question..."
              />
            </div>

            {/* Question Type and Class Type Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Question Type */}
              <div>
                <label className="block text-lg font-medium text-gray-900">Question Type:</label>
                <select
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Class Type */}
              <div>
                <label className="block text-lg font-medium text-gray-900">Class Type:</label>
                <select
                  name="classType"
                  value={filters.classType}
                  onChange={(e) => setFilters({...filters, classType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {classTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options for Multiple-Choice Questions */}
            {currentQuestion.type === "multiple-choice" && (
              <div className="space-y-4 mt-4">
                <label className="block text-lg font-medium text-gray-900">Options:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentOption}
                    onChange={(e) => setCurrentOption(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter an option..."
                  />
                  <button
                    onClick={handleAddOption}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Option
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Question Button */}
            <button
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mt-4"
            >
              Add Question
            </button>
          </motion.div>

          {/* Display Added Questions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Added Questions</h2>
            {questions.length > 0 ? (
              <ul className="space-y-4">
                {questions.map((question, index) => (
                  <li
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{question.text}</h3>
                      {question.type === "multiple-choice" && (
                        <ul className="list-disc list-inside mt-2">
                          {question.options.map((option, idx) => (
                            <li key={idx} className="text-gray-700">{option}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No questions added yet.</p>
            )}
          </div>

          {/* Submit Form Button */}
          <div className="flex justify-end">
            <motion.button
              onClick={handleSubmitForm}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  <span>Submit Form</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFormCreationPage;