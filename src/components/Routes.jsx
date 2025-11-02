import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Faculty2AdminPanel from "./Faculty2AdminPanel";
import TeacherSubjectAssignment from "./TeacherSubjectAssignment";
import FeedbackSessionAdmin from "./FeedbackSessionAdmin";
import AdminFormCreationPage from "./AdminFormCreationPage";
import FileUploader from "./UploadCsv";
import FacultyUpload from "./uploadFaculty";
import AdminStudents from "./AdminStudents";
import FacultyFeedback from "./admin-feedback";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-faculty" element={<Faculty2AdminPanel />} />
      <Route path="/admin/assign-subjects" element={<TeacherSubjectAssignment />} />
      <Route path="/admin/feedback-session" element={<FeedbackSessionAdmin />} />
      <Route path="/admin/create-feedback-form" element={<AdminFormCreationPage />} />
      <Route path="/admin/upload-students" element={<FileUploader />} />
      <Route path="/admin/upload-faculty" element={<FacultyUpload />} />
      <Route path="/admin/students" element={<AdminStudents />} />
      <Route path="/admin/feedback" element={<FacultyFeedback />} />
    </Routes>
  );
};

export default AdminRoutes;
