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

        if (data.activeSession) {
          setSessionData(data.session);
          setSessionStatus('active');
          setTimeout(() => {
            navigate('/feedback-kartikesh', {
              state: { sessionData: data.session, userData }
            });
          }, 2000);
        } else if (data.session && data.session.status === 'completed') {
          // If session is expired, prevent navigation and show a warning
          setError(`Session has expired for ${userData.branch} - ${userData.year}`);
          setSessionStatus('expired');
        } else {
          // setError(`No active session found for ${userData.branch} - ${userData.year}`);
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
        
      case 'expired':
        
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title: sessionStatus === 'inactive' ? 'No Active Session' : 
                 sessionStatus === 'expired' ? 'Session Expired' : 'Error Checking Session',
          message: sessionStatus === 'inactive' ? 
                  `There is currently no active feedback session for ${userData?.branch} - ${userData?.year}. Please check back later or contact your administrator.` :
                  error || 'Unable to verify session status. Please try logging in again.',
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
          <SessionValidator
            userData={userData}
            onSessionValidated={(sessionData) => navigate('/feedback-kartikesh', { state: { sessionData, userData } })}
            onSessionExpired={() => setSessionStatus('expired')}
          />

          <div className="flex flex-col items-center space-y-4 p-4">
            {content.icon}
            {content.title && <h2 className="text-xl font-semibold text-gray-800">{content.title}</h2>}
            
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionCheckPage;