import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// Alert Component
export const Alert = ({ children, type = "info", className = "", ...props }) => {
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

// AlertTitle Component
export const AlertTitle = ({ children, className = "", ...props }) => {
  return (
    <h4 className={`font-bold text-lg ${className}`} {...props}>
      {children}
    </h4>
  );
};

// AlertDescription Component
export const AlertDescription = ({ children, className = "", ...props }) => {
  return (
    <p className={`text-sm ${className}`} {...props}>
      {children}
    </p>
  );
};

// Card components
export const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-6 border border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold ${className}`} {...props}>
    {children}
  </h2>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

const SessionCheckPage = ({ userData, onSessionExpired }) => {
  const [sessionStatus, setSessionStatus] = useState('checking');
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate('/');
      return;
    }

    const checkSession = async () => {
      if (!userData?.branch || !userData?.year) {
        setError('Missing branch/year information');
        setSessionStatus('error');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/sessions/branch-year', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            branch: userData.branch,
            year: userData.year
          }),
        });

        if (!response.ok) throw new Error('Session check failed');

        const data = await response.json();
        
        if (data.activeSession) {
          setSessionData(data.session);
          setSessionStatus('active');
          setTimeout(() => {
            navigate('/feedback-kartikesh', { state: { sessionData: data.session, userData } });
          }, 2000);
        } else {
          setSessionStatus(data.session?.status === 'expired' ? 'expired' : 'inactive');
          setError(data.session?.status === 'expired' 
            ? `Session expired for ${userData.branch} - ${userData.year}`
            : 'No active session found');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setSessionStatus('error');
        setError('Failed to validate session');
      }
    };

    checkSession();
  }, [userData, navigate]);

  const handleFeedbackSubmission = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FacultyName: sessionData?.facultyName,
          Department: userData.branch,
          AcademicLevels: userData.year,
          Subject: sessionData?.subject,
          FeedbackQuestions: [],
          studentUsername: userData.username,
          Suggestions: '',
          Complaints: ''
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Feedback submitted successfully!');
      } else {
        alert(result.message || 'Feedback submission failed');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Error submitting feedback');
    }
  };

  const getStatusContent = () => {
    switch (sessionStatus) {
      case 'checking':
        return {
          icon: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
          title: 'Checking Session Status',
          message: 'Please wait while we verify your session...',
          className: 'bg-blue-50',
        };
      case 'active':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
          title: 'Session Active',
          message: 'Redirecting to feedback page...',
          className: 'bg-green-50',
        };
      case 'inactive':
      case 'expired':
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title:
            sessionStatus === 'inactive'
              ? 'No Active Session'
              : sessionStatus === 'expired'
              ? 'Session Expired'
              : 'Error Checking Session',
          message:
            sessionStatus === 'inactive'
              ? `There is currently no active feedback session for ${userData?.branch} - ${userData?.year}. Please check back later or contact your administrator.`
              : error || 'Unable to verify session status. Please try logging in again.',
          className: 'bg-red-50',
          showReturnButton: true,
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 fixed inset-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Session Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 p-4">
              {content.icon}
              {content.title && <h2 className="text-xl font-semibold text-gray-800">{content.title}</h2>}
              {content.message && <p className="text-sm text-gray-600">{content.message}</p>}

              {(sessionStatus === 'inactive' || sessionStatus === 'expired' || sessionStatus === 'error') && (
                <Alert variant="warning" className="mt-4 bg-orange-50 border-orange-200">
                  <AlertTitle className="text-orange-800 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {content.title}
                  </AlertTitle>
                  <AlertDescription className="text-orange-700 mt-2">
                    {content.message}
                  </AlertDescription>
                </Alert>
              )}

              {content.showReturnButton && (
                <button
                  onClick={() => navigate('/')}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Login
                </button>
              )}

              {sessionStatus === 'active' && sessionData && (
                <div className="mt-4 p-4 bg-white rounded-lg w-full">
                  <h3 className="font-medium text-gray-700">Session Details:</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {sessionData.title}<br />
                    Duration: {sessionData.duration} minutes<br />
                    Branch: {userData?.branch}<br />
                    Year: {userData?.year}
                  </p>
                  <button
                    onClick={handleFeedbackSubmission}
                    className="mt-4 w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SessionCheckPage;