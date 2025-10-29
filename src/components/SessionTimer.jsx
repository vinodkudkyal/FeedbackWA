import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import useSessionValidator from './SessionValidator'; // Adjust the import path based on your file structure
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export const Alert = ({ children, ...props }) => {
  return <div {...props} className="alert">{children}</div>;
};

export const AlertTitle = ({ children }) => {
  return <h3 className="alert-title">{children}</h3>;
};

export const AlertDescription = ({ children }) => {
  return <p className="alert-description">{children}</p>;
};

const SessionTimer = ({ branch, year, onExpire }) => {
  const { 
    isActive, 
    formattedTime, 
    message,
    error
  } = useSessionValidator(branch, year, onExpire || (() => {
    // Default expiration handler
    alert('Session has expired!');
  }));

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isActive) {
    return (
      <Alert variant="warning">
        <Clock className="h-4 w-4" />
        <AlertTitle>No Active Session</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm text-gray-600">Time Remaining</div>
      <div className="text-2xl font-bold text-gray-800">{formattedTime}</div>
    </div>
  );
};

export default SessionTimer;
