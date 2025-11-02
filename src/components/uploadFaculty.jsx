import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // Import the sidebar

const Alert = ({ variant, children, className }) => (
  <div className={`relative p-4 rounded-lg flex items-start space-x-2 ${variant === 'destructive' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'} ${className}`}>
    {children}
  </div>
);

const AlertTitle = ({ children }) => <h4 className="font-semibold">{children}</h4>;

const AlertDescription = ({ children }) => <p className="text-sm text-gray-600">{children}</p>;

const FileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  };

  const validateFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMessage('File size must be less than 5MB');
      return false;
    }
    return true;
  };

  const handleFileUpload = (file) => {
    if (!validateFile(file)) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setErrorMessage('');
    setUploadProgress(0);

    fetch('https://feedbackend-mhol.onrender.com/api/facultyFileUpload', {
      method: 'POST',
      body: formData,
  })
  .then(async (response) => {
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Unknown error occurred');
      }
      return response.json();
  })
  .then((data) => {
      setUploadStatus('success');
      setUploadProgress(100);
  })
  .catch((error) => {
      setUploadStatus('error');
      setErrorMessage(error.message);
  });
  
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const dismissAlert = () => {
    setErrorMessage('');
    setUploadStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <AdminSidebar />
    {/* Main Content Area */}
    <div className="flex-1 ml-64 p-6"> {/* Add ml-64 to account for the sidebar width */}
    <div className="w-full max-w-xl mx-auto p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'bg-gray-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".csv"
          className="hidden"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <h3 className="text-lg font-semibold mb-2">Upload Faculty CSV File</h3>
        
        <p className="text-gray-500 mb-4">
          Drag and drop your file here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            browse
          </button>
        </p>
        
        <p className="text-sm text-gray-400">Maximum file size: 5MB</p>

        {isUploading && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          <button 
            onClick={dismissAlert}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </button>
        </Alert>
      )}

      {uploadStatus === 'success' && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>File uploaded successfully!</AlertDescription>
          <button 
            onClick={dismissAlert}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </button>
        </Alert>
      )}
        </div>
      </div>
     </div>
  );
};

export default FileUploader;








