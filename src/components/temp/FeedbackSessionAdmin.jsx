import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Play,
  Square,
  Settings,
  AlertCircle,
  X,
  Plus,
  ChevronRight,
  Trash2,
} from "lucide-react";
import FeedbackFormAdmin from "./FeedbackFormAdmin";
import AdminSidebar from "./AdminSidebar";

const FeedbackSessionAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [feedbackForms, setFeedbackForms] = useState([
    { id: "form1", title: "Lecture Feedback Form" },
    { id: "form2", title: "Workshop Evaluation Form" },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [newSession, setNewSession] = useState({
    title: "",
    date: "",
    startTime: null,
    duration: 15,
    description: "",
    formId: "",
    formTitle: "",
  });

  const years = ["FY", "SY", "TY", "BTech"];
  const branches = ["MECH", "AIDS", "CS", "ELEC", "ENTC", "CIVIL"];

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sessions");
        if (!response.ok) throw new Error("Failed to fetch sessions");

        const data = await response.json();
        setSessions(data.map(session => ({
          ...session,
          id: session._id || session.id,
        })));
      } catch (error) {
        console.error("Error fetching sessions:", error);
        alert("Failed to load sessions");
      }
    };

    fetchSessions();
  }, []);

  // Handle session status toggle
  const toggleSessionStatus = async (sessionId) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        console.error("Session not found:", sessionId);
        alert("Session not found. Please refresh the page.");
        return;
      }
  
      const newStatus = session.status === "active" ? "completed" : "active";
  
      // 🛑 Force update session status in backend
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, startTime: session.startTime }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update session status");
      }
  
      const updatedSession = await response.json();
      
      setSessions(prev =>
        prev.map(s => (s.id === sessionId ? { ...updatedSession, id: updatedSession._id } : s))
      );
  
      showToastMessage(
        newStatus === "active" ? "Session started successfully!" : "Session completed successfully!"
      );
  
      // 🔄 Ensure the session is updated in MongoDB
      await fetch("http://localhost:5000/api/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch: session.branch,
          year: session.year,
          status: newStatus,
        }),
      });
  
    } catch (error) {
      console.error("Error updating session status:", error);
      alert("Error updating session. Please try again.");
    }
  };
  

  // Handle session deletion
  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete session");

      setSessions(prev => prev.filter(session => session.id !== sessionId));
      showToastMessage("Session deleted successfully!");
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session. Please try again.");
    }
  };

  // Handle session creation
  const handleCreateSession = async () => {
    if (!newSession.title || !newSession.date || !newSession.duration) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSession,
          status: "scheduled",
          remainingTime: null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create session");

      const createdSession = await response.json();
      setSessions(prev => [
        ...prev,
        { ...createdSession, id: createdSession._id || Date.now().toString() },
      ]);

      setNewSession({
        title: "",
        date: "",
        startTime: null,
        duration: 15,
        description: "",
        formId: "",
        formTitle: "",
      });

      setShowCreateModal(false);
      showToastMessage("Session created successfully!");
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  // Show toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle form selection
  const handleFormSelect = (form) => {
    setNewSession(prev => ({
      ...prev,
      formId: form.id,
      formTitle: form.title,
    }));
    setShowFormModal(false);
  };

  // Handle form creation
  const handleFormCreated = (newForm) => {
    setFeedbackForms(prev => [...prev, newForm]);
    setShowCreateFormModal(false);
    showToastMessage("Form created and selected for session!");
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "Not started";
    try {
      const date = new Date(time);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  // Calculate end time
  const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime) return "Not started";
    try {
      const date = new Date(startTime);
      date.setMinutes(date.getMinutes() + durationMinutes);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  // Format remaining time
  const formatRemainingTime = (totalSeconds) => {
    if (totalSeconds === null) return "";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Real-time countdown for active sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions(prevSessions =>
        prevSessions.map(session => {
          if (session.status === "active" && session.terminationTime) {
            const remaining = Math.floor(
              (new Date(session.terminationTime) - Date.now()) / 1000
            );

            if (remaining <= 0) {
              return { ...session, status: "completed", remainingTime: null };
            }

            return { ...session, remainingTime: remaining };
          }
          return session;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [sessions]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <AdminSidebar />
      <div className="flex-1 pt-20 pl-64">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Feedback Sessions</h1>
                <p className="text-gray-600 mt-1">Schedule and manage feedback collection periods</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Create Session</span>
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div
                  key={session.id || `session-${index}`}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">{session.title}</h3>
                      <p className="text-gray-600">{session.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{session.date}</span>
                        </div>
                        {session.startTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(session.startTime)} -{" "}
                              {calculateEndTime(session.startTime, session.duration)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Duration:</span>
                          <span>{session.duration} minutes</span>
                        </div>
                        {session.status === "active" && session.remainingTime !== null && (
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">Time Remaining:</span>
                            <span className="text-blue-600">
                              {formatRemainingTime(session.remainingTime)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            session.status || "unknown"
                          )}`}
                        >
                          {session.status?.charAt(0).toUpperCase() + session.status?.slice(1) || "Unknown"}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {session.status !== "completed" && (
                        <button
                          onClick={() => toggleSessionStatus(session.id)}
                          className={`p-2 rounded-lg flex items-center space-x-2 ${
                            session.status === "active"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {session.status === "active" ? (
                            <Square className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span>
                            {session.status === "active" ? "Stop Session" : "Start Session"}
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Session Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Create New Session</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                    <input
                      type="text"
                      value={newSession.title}
                      onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter session title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <select
                        value={newSession.year}
                        onChange={(e) => setNewSession(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                      <select
                        value={newSession.branch}
                        onChange={(e) => setNewSession(prev => ({ ...prev, branch: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch} value={branch}>{branch}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newSession.date}
                        onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <select
                        value={newSession.duration}
                        onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={20}>20 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    {newSession.formId ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{newSession.formTitle}</span>
                        <button
                          onClick={() => setShowFormModal(true)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Change Form
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newSession.description}
                      onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      rows="3"
                      placeholder="Enter session description"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateSession}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Create Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Selection Modal */}
          {showFormModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Select Feedback Form</h2>
                  <button
                    onClick={() => setShowFormModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {feedbackForms.map((form, index) => (
                    <button
                      key={form.id || `form-${index}`}
                      onClick={() => handleFormSelect(form)}
                      className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{form.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setShowFormModal(false);
                      setShowCreateFormModal(true);
                    }}
                    className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-500 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Form</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Form Modal */}
          {showCreateFormModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh]">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create New Feedback Form</h2>
                    <button
                      onClick={() => setShowCreateFormModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FeedbackFormAdmin onFormCreated={handleFormCreated} />
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSessionAdmin;