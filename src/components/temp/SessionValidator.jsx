// SessionValidator.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

// Reusing your Alert components
const Alert = ({ children, type = "info", className = "", ...props }) => {
  const alertStyles = {
    info: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    error: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div
      className={`p-4 border-l-4 rounded ${alertStyles[type]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ children, className = "", ...props }) => (
  <h4 className={`font-bold text-lg ${className}`} {...props}>
    {children}
  </h4>
);

const AlertDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm ${className}`} {...props}>
    {children}
  </p>
);

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white shadow rounded-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold ${className}`} {...props}>
    {children}
  </h2>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

const SessionValidator = ({ userData, onSessionValidated }) => {
  const [sessionStatus, setSessionStatus] = useState("checking");
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    const validateSession = async () => {
      if (!userData?.branch || !userData?.year) {
        setError("Missing branch or year information");
        setSessionStatus("error");
        return;
      }
    
      try {
        const response = await fetch("http://localhost:5000/api/validate-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            branch: userData.branch,
            year: userData.year,
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to validate session");
        }
    
        const data = await response.json();
    
        if (data.status === "error") {
          setError(data.message);
          setSessionStatus("error");
          return;
        }
    
        switch (data.status) {
          case "pending":
            setSessionStatus("pending");
            setError("Session has not started yet.");
            break;
    
          case "active":
            setSessionData(data.session);
            setSessionStatus("active");
    
            // Auto-update remaining time every second
            const sessionEndTime = new Date(data.session.endTime);
            const interval = setInterval(() => {
              const now = new Date();
              const remainingTime = Math.max(0, Math.floor((sessionEndTime - now) / 1000)); // Convert to seconds
    
              if (remainingTime <= 0) {
                clearInterval(interval);
                setSessionStatus("inactive");
                setError("Session has expired.");
              } else {
                setSessionData((prev) => ({
                  ...prev,
                  remainingTime: remainingTime,
                }));
              }
            }, 1000);
    
            if (onSessionValidated) {
              onSessionValidated(data.session);
            }
            break;
    
          case "expired":
            setSessionStatus("inactive");
            setError("Session has expired.");
            break;
    
          default:
            setSessionStatus("inactive");
            setError("No active session found.");
        }
    
      } catch (err) {
        setError(err.message);
        setSessionStatus("error");
      }
    };
    
    

    validateSession();
    const interval = setInterval(validateSession, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [userData, navigate, onSessionValidated]);

  const getStatusContent = () => {
    switch (sessionStatus) {
      case "checking":
        return {
          icon: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
          title: "Checking Session Status",
          message: "Please wait while we verify your session...",
          className: "bg-blue-50",
        };
      case "active":
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
          title: "Session Active",
          message: "Session is valid and active",
          className: "bg-green-50",
        };
      case "inactive":
        return {
          icon: <Clock className="w-12 h-12 text-orange-500" />,
          title: "No Active Session",
          message:
            error ||
            `No active session found for ${userData?.branch} - ${userData?.year}`,
          className: "bg-orange-50",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title: "Error Checking Session",
          message:
            error || "An error occurred while checking the session status",
          className: "bg-red-50",
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();

  return null;
};

export default SessionValidator;
