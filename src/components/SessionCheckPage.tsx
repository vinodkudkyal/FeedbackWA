import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionValidator from "./SessionValidator.jsx";
import { Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


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
// Card components in a single block
export const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white shadow rounded-lg overflow-hidden ${className}`}
    {...props}
  >
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

const InactiveSessionAlert = ({ branch, year }) => (
  <Alert variant="warning" className="mt-4 bg-orange-50 border-orange-200">
    <AlertTitle className="text-orange-800 flex items-center gap-2">
      <Clock className="h-4 w-4" />
      No Active Session Available
    </AlertTitle>
    <AlertDescription className="text-orange-700 mt-2">
      There is currently no active feedback session for {branch} - {year}.
      Please check back later or contact your administrator.
    </AlertDescription>
  </Alert>
);

const SessionCheckPage = ({ userData, onSessionExpired }) => {
  const [sessionStatus, setSessionStatus] = useState('checking');
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If no userData is provided, redirect to login
    if (!userData) {
      navigate('/');
      return;
    }
  
    const checkSession = async () => {
      if (!userData?.branch || !userData?.year) {
        setError("Missing branch or year information");
        setSessionStatus('error');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/api/sessions/branch-year', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            branch: userData.branch,
            year: userData.year,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }
  
        const data = await response.json();
  
        // Check if there's an active session and verify if it's still valid time-wise
        if (data.activeSession) {
          const sessionData = data.session;
          const sessionEndTime = new Date(sessionData.terminationTime || sessionData.endTime);
          const currentTime = new Date();
          
          if (currentTime > sessionEndTime) {
            // Session has expired based on time
            setSessionStatus('expired');
            setError(`Session has expired for ${userData.branch} - ${userData.year}`);
          } else {
            // Session is active and still within time limits
            setSessionData(sessionData);
            setSessionStatus('active');
            setTimeout(() => {
              navigate('/feedback-kartikesh', {
                state: { 
                  sessionData: sessionData, 
                  userData,
                  sessionEnd: sessionEndTime.toISOString()
                }
              });
            }, 1000);
          }
        } else if (data.session && data.session.status === 'completed') {
          // If session status is completed according to backend
          setError(`Session has expired for ${userData.branch} - ${userData.year}`);
          setSessionStatus('expired');
        } else if (data.session && data.session.status === 'pending') {
          // If session is pending
          setSessionStatus('inactive');
          setError(`Session will start soon for ${userData.branch} - ${userData.year}`);
        } else {
          // No active session found
          setSessionStatus('inactive');
        }
  
      } catch (error) {
        setError(error.message);
        setSessionStatus('error');
      }
    };
  
    checkSession();
  }, [userData, navigate, onSessionExpired]);
  const ErrorDashboard = () => (
    <div className="w-full space-y-4 animate-in slide-in-from-top duration-500">
      <Alert variant="destructive" className="border-red-500 bg-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-red-800">Session Check Failed</AlertTitle>
        <AlertDescription className="text-red-700 mt-2">
          {error}
        </AlertDescription>
      </Alert>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
        <h3 className="font-medium text-gray-700 mb-2">Details:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><span className="font-medium">Branch:</span> {userData?.branch || 'Not available'}</li>
          <li><span className="font-medium">Year:</span> {userData?.year || 'Not available'}</li>
          <li><span className="font-medium">Status:</span> {sessionStatus.toUpperCase()}</li>
          <li><span className="font-medium">Time:</span> {new Date().toLocaleString()}</li>
        </ul>
      </div>
      <button
        onClick={() => navigate('/')}
        className="w-full mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
                   transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Return to Login
      </button>
    </div>
  );


  const handleSessionValidated = (sessionData) => {
    // Handle active session, e.g., redirect to feedback page
    navigate('/feedback-kartikesh', { state: { sessionData, userData } });
  };
  const handleSessionExpired = () => {
    // Handle expired/inactive session
    // e.g., show message, redirect, etc.
  };

  const getStatusContent = () => {
    switch (sessionStatus) {
      case 'checking':
        return {
          icon: <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />,
          title: 'Checking Session Status',
          message: 'Please wait while we verify your session...',
          className: 'bg-blue-50'
        };
      case 'active':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
          title: 'Session Active',
          message: 'Redirecting to feedback page...',
          className: 'bg-green-50'
        };
      case 'inactive':
        return {
          icon: <Clock className="w-12 h-12 text-orange-500" />,
          title: 'No Active Session',
          message: `There is currently no active feedback session for ${userData?.branch} - ${userData?.year}. Please check back later or contact your administrator.`,
          className: 'bg-orange-50',
          showReturnButton: true
        };
      case 'expired':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title: 'Session Expired',
          message: 'Your session has expired. Please try logging in again.',
          className: 'bg-red-50',
          showReturnButton: true
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title: 'Error Checking Session',
          message: error || 'Unable to verify session status. Please try logging in again.',
          className: 'bg-red-50',
          showReturnButton: true
        };
      default:
        return null;
    }
  };
  const content = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Session Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Remove SessionValidator completely to avoid conflicts */}
        {/* <SessionValidator userData={userData} onSessionValidated={handleSessionValidated} onSessionExpired={() => setSessionStatus('expired')} /> */}
        
        <div className="flex flex-col items-center space-y-4 p-4">
          {/* Checking status */}
          {sessionStatus === 'checking' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-800">Checking Session Status</h2>
              <p className="text-center text-gray-600">Please wait while we verify your session...</p>
            </>
          )}
          
          {/* Active status */}
          {sessionStatus === 'active' && sessionData && (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <h2 className="text-xl font-semibold text-green-800">Session Active</h2>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg w-full">
                <div className="text-sm text-green-700">
                  <p><span className="font-medium">Title:</span> {sessionData.title}</p>
                  <p><span className="font-medium">Branch:</span> {userData?.branch}</p>
                  <p><span className="font-medium">Year:</span> {userData?.year}</p>
                  <p className="mt-2 italic">Redirecting to feedback page...</p>
                </div>
              </div>
            </>
          )}
          
          {/* Inactive status */}
          {sessionStatus === 'inactive' && (
            <>
              <Clock className="w-12 h-12 text-orange-500" />
              <h2 className="text-xl font-semibold text-orange-800">No Active Session</h2>
              <Alert variant="warning" className="mt-4 bg-orange-50 border-orange-200 w-full">
                <AlertTitle className="text-orange-800 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Session Not Available
                </AlertTitle>
                <AlertDescription className="text-orange-700 mt-2">
                  {error || `There is currently no active feedback session for ${userData?.branch} - ${userData?.year}. Please check back later or contact your administrator.`}
                </AlertDescription>
              </Alert>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Login
              </button>
            </>
          )}
          
          {/* Expired status */}
          {sessionStatus === 'expired' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-semibold text-red-800">Session Expired</h2>
              <Alert variant="destructive" className="mt-4 bg-red-50 border-red-200 w-full">
                <AlertTitle className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Session Expired
                </AlertTitle>
                <AlertDescription className="text-red-700 mt-2">
                  {error || 'Your session has expired. Please try logging in again.'}
                </AlertDescription>
              </Alert>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Login
              </button>
            </>
          )}
          
          {/* Error status */}
          {sessionStatus === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-semibold text-red-800">Error Checking Session</h2>
              <Alert variant="destructive" className="mt-4 bg-red-50 border-red-200 w-full">
                <AlertTitle className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Session Check Failed
                </AlertTitle>
                <AlertDescription className="text-red-700 mt-2">
                  {error || 'Unable to verify session status. Please try logging in again.'}
                </AlertDescription>
              </Alert>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);
};

export default SessionCheckPage;