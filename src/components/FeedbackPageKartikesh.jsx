import React, { useState, useEffect } from "react";
import { Send, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


const FeedbackPageKartikesh = ({ userData }) => {
  const { name, email, branch, year } = userData || {};
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success pop-up
  const navigate = useNavigate();

  const questions = [
    {
      section: "objective",
      questions: [
        {
          id: "courseOutcomes",
          question: "Explains the course Outcomes (CO) at the starting of the subject",
          options: ["Yes", "No", "NA"],
        },
        {
          id: "subjectKnowledge",
          question: "Has sound subject knowledge",
          options: ["Low", "Medium", "High", "NA"],
        },
        {
          id: "conceptClarity",
          question: "Clears concept",
          options: ["Clear All Concept", "Not clear Concept", "NA"],
        },
        {
          id: "systematic",
          question: "Conducts in Systematic & Planned Manner",
          options: ["Yes", "No", "NA"],
        },
        {
          id: "encouragement",
          question: "Encourages students to ask doubts",
          options: ["Yes", "No", "NA"],
        },
        {
          id: "satisfaction",
          question: "Clears students doubts till satisfaction",
          options: ["Satisfy", "Not Satisfy", "NA"],
        },
        {
          id: "presentation",
          question: "Has good board Writing and presentation",
          options: ["Good Writing and Presentation", "Not Good Writing and Presentation", "NA"],
        },
        {
          id: "pptUsage",
          question: "Uses appropriate PPT of the subject",
          options: ["Yes", "No", "NA"],
        },
        {
          id: "teachingMethod",
          question: "Teaching method preference",
          options: ["Use only PPT", "Use only Blackboard", "Use both PPT and Blackboard"],
        },
        {
          id: "notes",
          question: "Provides notes",
          options: ["Yes", "No", "NA"],
        },
        {
          id: "englishProficiency",
          question: "English proficiency level",
          options: ["Good English Proficiensy", "Not good English Proficiency", "NA"],
        },
        {
          id: "motivation",
          question: "Is friendly, helpful and motivates students",
          options: ["Motivates the students for overall development", "Not motivates the students for overall development", "NA"],
        },
        {
          id: "effectiveness",
          question: "Teaching is effective and understandable",
          options: ["Effective and understandable teaching", "Not effective and Understandable Teaching"],
        },
        {
          id: "punctuality",
          question: "Is Punctual (Reports to class in time)",
          options: ["Punctual", "Not Punctual", "NA"],
        },
        {
          id: "careerOrientation",
          question: "Orients subject towards placement/GATE/competitive exams",
          options: ["Yes", "No"],
        },
        {
          id: "overallRating",
          question: "Overall Rating",
          options: ["Excellent", "Good", "Average", "Poor"],
        },
        {
          id: "suggestions",
          question: "Suggestions for Improvement",
          type: "textarea",
        },
        {
          id: "Complaintes",
          question: "Tell Complaintes for Improvement",
          type: "textarea",
        },
      ],
    },
  ];

  const validateSection = (section) => {
    const currentQuestions = questions.find((q) => q.section === section).questions;
    const errors = {};

    facultyList.forEach((faculty) => {
      currentQuestions.forEach((question) => {
        if (question.type !== "textarea") {
          const answer = answers[question.id]?.[faculty.id];
          if (!answer) {
            if (!errors[faculty.id]) {
              errors[faculty.id] = [];
            }
            errors[faculty.id].push(question.id);
          }
        }
      });
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateSection("objective");

    if (Object.keys(validation).length > 0) {
      setValidationErrors(validation);
      setShowSubmitError(true);
      alert("Please answer all questions before submitting the feedback form.");
      return;
    }

    setIsSubmitting(true);

    try {
      for (const faculty of facultyList) {
        const feedbackQuestions = questions
          .flatMap((section) => section.questions)
          .filter((q) => q.type !== "textarea")
          .map((q) => {
            const selectedOption = answers[q.id]?.[faculty.id];
            return {
              Id: q.id,
              Question: q.question,
              Responses: q.options.map((option) => ({
                Option: option,
                Count: option === selectedOption ? 1 : 0,
              })),
            };
          });

        const feedbackData = {
          FacultyName: faculty.name,
          Department: branch,
          Date: new Date().toISOString().split("T")[0],
          AcademicLevels: year,
          Subject: faculty.subject,
          FeedbackQuestions: feedbackQuestions,
          Suggestions: answers["suggestions"]?.[faculty.id] || "",
          Complaints: answers["Complaintes"]?.[faculty.id] || "",
        };

        const response = await fetch("https://feedbackend-mhol.onrender.com/api/submit-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
          throw new Error(`Failed to submit feedback for ${faculty.name}`);
        }

        const responseData = await response.json();
        console.log('Feedback submitted successfully. Total responses:', responseData.faculty.totalResponses);
      }

      // Show success pop-up
      setShowSuccessPopup(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/"); // Redirect to login page
      }, 2000);

    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(
          `https://feedbackend-mhol.onrender.com/api/faculty?year=${year}&branch=${branch}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch faculty");
        }

        const data = await response.json();
        const formattedFacultyList = data.faculty.map((faculty, index) => ({
          id: faculty.id || index + 1,
          name: faculty.name,
          subject: faculty.subjects[0]?.name || "",
          deadline: faculty.deadline || "October 31, 2024",
        }));

        setFacultyList(formattedFacultyList);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setError(err.message);
        setIsLoading(true);
      }
    };

    if (year && branch) {
      fetchFaculty();
    }
  }, [year, branch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading faculty...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Personal Greeting Section */}
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Hello, {name}!</h1>
          <p className="text-lg text-gray-700">Branch: {branch}</p>
          <p className="text-lg text-gray-700">Year: {year}</p>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Faculty Feedback
              </h1>
              {/* <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Session 2 - Fall 2024
              </p> */}
            </div>
            {/* <motion.div
              className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 flex items-start space-x-3 w-full"
              whileHover={{ scale: 1.02 }}
            >
              <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 text-sm sm:text-base">
                  Feedback Deadline
                </h3>
                <p className="text-amber-700 text-xs sm:text-sm">
                  Please submit your feedback before October 31, 2024
                </p>
              </div>
            </motion.div> */}
          </div>
        </motion.div>

        {/* Faculty List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Faculty List
          </h2>
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
          <div className="p-6 space-y-6">
            <AnimatePresence mode="wait">
              {questions.map(
                (section) =>
                  section.section === "objective" && (
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
                            transition: { delay: index * 0.1 },
                          }}
                          className="p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <label className="block text-lg font-medium text-gray-900 mb-4">
                            {q.question}
                          </label>

                          <div className="space-y-4">
                            {facultyList.map((faculty) => (
                              <div
                                key={faculty.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-4"
                              >
                                <div className="w-48 flex-shrink-0">
                                  <h4 className="font-medium text-gray-900">
                                    {faculty.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {faculty.subject}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-3 w-full">
                                  {q.type === "textarea" ? (
                                    <textarea
                                      rows="3"
                                      placeholder="Enter your feedback here..."
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      value={answers[q.id]?.[faculty.id] || ""}
                                      onChange={(e) =>
                                        setAnswers((prev) => ({
                                          ...prev,
                                          [q.id]: {
                                            ...prev[q.id],
                                            [faculty.id]: e.target.value,
                                          },
                                        }))
                                      }
                                    />
                                  ) : (
                                    q.options.map((option) => (
                                      <motion.button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                          setAnswers((prev) => ({
                                            ...prev,
                                            [q.id]: {
                                              ...prev[q.id],
                                              [faculty.id]: option,
                                            },
                                          }))
                                        }
                                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                          answers[q.id]?.[faculty.id] === option
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 hover:border-blue-200 text-gray-700"
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
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
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
                    <span>Submit Feedback</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* Success Pop-up */}
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <h2 className="text-xl font-bold text-green-600 mb-4">
                  Feedback Submitted Successfully!
                </h2>
                <p className="text-gray-700">
                  You will be redirected to the login page shortly.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedbackPageKartikesh;