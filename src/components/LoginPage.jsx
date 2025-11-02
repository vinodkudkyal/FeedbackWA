import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle,
  AlertCircle,
  Mail,
  Key,
} from "lucide-react";

const LoginPage = ({ setUserData }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear messages when user starts typing
    setErrorMessage("");
    setSuccessMessage("");
  }, [formData.username, formData.password]);

  // Add this function in LoginPage.jsx
  const checkAttendance = async (username) => {
    try {
      console.log("Checking attendance for:", username); // Debug log
      const response = await fetch("https://feedbackend-mhol.onrender.com/api/check-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
  
      const data = await response.json();
      console.log("Attendance API response:", data); // Debug log
      
      if (response.ok) {
        if (data.attendancePercentage < 75) {
          return {
            allowed: false,
            message: `Your attendance is ${data.attendancePercentage}%, which is below the required 75%. You cannot login.`
          };
        }
        return { allowed: true };
      } else {
        return {
          allowed: false,
          message: data.message || "Failed to check attendance records"
        };
      }
    } catch (error) {
      console.error("Attendance check error:", error);
      return {
        allowed: false,
        message: "Error checking attendance records. Please try again later."
      };
    }
  };

  // Modify the sendOtp function
  const sendOtp = async () => {
    if (!formData.username.trim()) {
      alert("Please enter your email address as username.");
      return;
    }

    // Simple email validation
    if (!formData.username.includes("@")) {
      alert("Please enter a valid email address as your username.");
      return;
    }

    // Check attendance first for students
    if (selectedRole === "student") {
      setLoading(true);
      const attendanceCheck = await checkAttendance(formData.username);
      setLoading(false);

      if (!attendanceCheck.allowed) {
        alert(attendanceCheck.message);
        return;
      }
    }

    try {
      
      // const response = await fetch("http://localhost:5000/api/send-otp", {
      const response = await fetch("https://feedbackend-mhol.onrender.com/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.username }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedOtp(data.otp);
        setOtpSent(true);
        alert("OTP sent successfully to your email.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      let loginUrl = "https://feedbackend-mhol.onrender.com/api/login";
      let loginBody = {
        username: formData.username,
        password: formData.password,
        role: selectedRole,
      };
  
      // For student login, check OTP first
      if (selectedRole === "student" && !otpVerified) {
        setErrorMessage("Please verify your OTP first.");
        setLoading(false);
        return;
      }
  
      // Check if dean is trying to login as student
      if (formData.username.toLowerCase().startsWith("dean") && selectedRole === "student") {
        setErrorMessage("Dean cannot log in as a student. Please select the Teacher role.");
        setLoading(false);
        return;
      }
  
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginBody),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (!data.user) {
          setErrorMessage("Login successful, but user data is missing.");
          setLoading(false);
          return;
        }
  
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setSuccessMessage("Login successful! Redirecting...");
  
        // Handle redirects based on role
        if (data.user.role === "admin") {
          localStorage.setItem("adminDepartment", data.user.department);
          setTimeout(() => {
            navigate("/admin-dashboard", {
              state: {
                department: data.user.department,
                email: data.user.email,
              },
            });
          }, 1000);
        } else if (data.user.role === "dean") {
          setTimeout(() => {
            navigate("/dean-dashboard", {
              state: {
                email: data.user.email,
              },
            });
          }, 1000);
        } else if (data.user.role === "teacher") {
          setTimeout(() => {
            navigate("/faculty-dashboard", { 
              state: { faculty: data.user.email } 
            });
          }, 1000);
        } else {
          // For students
          setTimeout(() => {
            navigate("/session-check");
          }, 1000);
        }
      } else {
        setErrorMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      setErrorMessage("Connection error. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 fixed inset-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-6 border border-gray-100">
          {/* Role Selection */}
          <div className="flex rounded-lg p-1 bg-gray-100">
            <button
              onClick={() => {
                setSelectedRole("student");
                setOtpSent(false);
                setOtpVerified(false);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                selectedRole === "student"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              onClick={() => {
                setSelectedRole("teacher");
                setOtpSent(false);
                setOtpVerified(false);
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                selectedRole === "teacher"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Teacher</span>
            </button>
          </div>

          {/* Admin Hint */}
          {selectedRole === "teacher" && (
            <div className="text-sm text-gray-500 mt-1 px-2">
              {formData.username.toLowerCase().startsWith("admin") &&
                "Admin accounts will be automatically recognized"}
            </div>
          )}

          {/* Feedback Messages */}
          {successMessage && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {selectedRole === "student" ? (
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                  )}
                </div>
                <input
                  type={selectedRole === "student" ? "email" : "text"}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={
                    selectedRole === "student" ? "Email (username)" : "Username"
                  }
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={loading}
                />
                {selectedRole === "student" && !otpSent && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    Send OTP
                  </button>
                )}
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                </div>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* OTP Section (only for students) */}
              {selectedRole === "student" && otpSent && !otpVerified && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Key className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {otpVerified && (
                <div className="p-2 bg-green-100 text-green-700 rounded text-sm text-center">
                  OTP verified successfully!
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a
                href="#forgot-password"
                className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (selectedRole === "student" && !otpVerified)}
              className={`w-full ${
                loading || (selectedRole === "student" && !otpVerified)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 group`}
            >
              <span>{loading ? "Signing In..." : "Sign In"}</span>
              {!loading && (
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <a
              href="#register"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              Contact Administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
