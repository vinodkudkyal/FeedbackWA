// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import StudentNavbar from "./components/LoginNavBar";
// import StudentDashboard from "./components/StudentDashboard";
// import FeedbackPage from "./components/SubmitFeedback";
// import TeacherDashboard from "./components/TeacherDashboard";
// import LoginPage from "./components/LoginPage";
// import LoginNavbar from "./components/LoginNavBar";
// import AdminDashboard from "./components/AdminDashboard";
// import AdminNavbar from "./components/AdminNavbar";
// import TeacherAssignmentDashboard from "./components/AdminTeacherAssign";
// import TeacherNavbar from "./components/TeacherNavbar";
// import FeedbackView from "./components/FeedbackView";
// import FeedbackPageKartikesh from "./components/FeedbackPageKartikesh";

// import LoginPage1 from "./components/LoginPage1";
// import React, { useState } from "react";
// import Faculty2AdminPanel from "./components/Faculty2AdminPanel";
// import FeedbackForm from "./components/FeedbackForm";
// import TeacherSubjectAssignment from "./components/TeacherSubjectAssignment";
// import FeedbackFormAdmin from "./components/FeedbackFormAdmin";
// import FeedbackSessionAdmin from "./components/FeedbackSessionAdmin";

// import FacultyFeedbackHistory from "./components/FacultyFeedbackHistory";
// import FeedbackChart from "./components/FeedbackCharts";
// import FacultyFeedbackDashboard from "./components/FacultyDashboard";

// import SessionCheckPage from "./components/SessionCheckPage";
// import SessionValidator from "./components/SessionValidator";
// import FileUploader from './components/UploadCsv';
// import FacultyUpload from './components/uploadFaculty';
// import AdminFormCreationPage from "./components/AdminFormCreationPage";
// import AdminStudents from "./components/AdminStudents";
// import FacultyFeedback from "./components/admin-feedback";

// import Portfolio from "./components/Portfolio";

// function App() {
//   const [userData, setUserData] = useState(null); // Store the logged-in user's data

//   const handleLogout = () => {
//     setUserData(null);
//   };

//   return (
//     <>
//       {/* <Portfolio/> */}
//       <Router>
//       <Routes>
// <Route path="/" element={<AdminDashboard />} />
//         <Route path="/admin/add-faculty" element={<Faculty2AdminPanel />} />
//         <Route path="/admin/assign-subjects" element={<TeacherSubjectAssignment />} />
//         <Route path="/admin/feedback-session" element={<FeedbackSessionAdmin />} />
//         <Route path="/admin/create-feedback-form" element={<AdminFormCreationPage />} />
//         <Route path="/admin/upload-students" element={<FileUploader />} />
//         <Route path="/admin/upload-faculty" element={<FacultyUpload />} />
//         <Route path="/admin/students" element={<AdminStudents />} />
//         <Route path="/admin/feedabck" element={<FacultyFeedback />} />

//       </Routes>
//     </Router>
//         </>
//       );
//     }

//     export default App;

// Below entire code is for login and all

//     import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import "./App.css";
// import FeedbackPageKartikesh from "./components/FeedbackPageKartikesh";
// import { Upload } from "lucide-react";
// import LoginPage from "./components/LoginPage";
// import SessionCheckPage from "./components/SessionCheckPage";
// import FacultyDashboard from "./components/FacultyDashboard";
// function App() {
//   const [userData, setUserData] = useState(null); // Store the logged-in user's data

//   const handleLogout = () => {
//     setUserData(null);
//   };

//   return (
//     <div className="container">
//       <Router>
//         <Routes>

//           <Route
//           path="/"
//           element={
//             <LoginPage
//               setUserData={setUserData}
//             />
//           }
//         />
//         <Route
//           path="/session-check"
//           element={
//             userData ? (
//               <SessionCheckPage
//                 userData={userData}
//                 onSessionExpired={handleLogout}
//               />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />
//         <Route
//           path="/feedback-kartikesh"
//           element={
//             userData ? (
//               <FeedbackPageKartikesh
//                 userData={userData}
//                 onLogout={handleLogout}
//               />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />
//          <Route
//             path="/faculty-dashboard"
//             element={
//               userData?.role === "teacher" ? (
//                 <FacultyDashboard userData={userData} onLogout={handleLogout} />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//             />
// <Route path="*" element={<Navigate to="/" />} />
// </Routes>
// </Router>
// </div>
// );
// }

// export default App;

// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import "./App.css";
// import FeedbackPageKartikesh from "./components/FeedbackPageKartikesh";
// import { Upload } from "lucide-react";
// import LoginPage from "./components/LoginPage";
// import SessionCheckPage from "./components/SessionCheckPage";
// import FacultyDashboard from "./components/FacultyDashboard";
// import DeanDashboard from "./components/faculty-filter-ui";

// function App() {
//   const [userData, setUserData] = useState(null); // Store the logged-in user's data

//   const handleLogout = () => {
//     setUserData(null);
//   };

//   return (
//     <div className="container">
//       <Router>

//         <Routes>
//           <Route path="/" element={<LoginPage setUserData={setUserData} />} />
//           <Route
//             path="/session-check"
//             element={
//               userData ? (
//                 <SessionCheckPage
//                   userData={userData}
//                   onSessionExpired={handleLogout}
//                 />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//           />
//           <Route
//             path="/feedback-kartikesh"
//             element={
//               userData ? (
//                 <FeedbackPageKartikesh
//                   userData={userData}
//                   onLogout={handleLogout}
//                 />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//           />
//           <Route
//             path="/faculty-dashboard"
//             element={
//               userData?.role === "teacher" ? (
//                 <FacultyDashboard userData={userData} onLogout={handleLogout} />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//           />
//           <Route
//             path="/dean-dashboard"
//             element={
//               userData?.role === "dean" ? (
//                 <DeanDashboard onLogout={handleLogout} />
//               ) : (
//                 <Navigate to="/" replace />
//               )
//             }
//           />

//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import FeedbackPageKartikesh from "./components/FeedbackPageKartikesh";
import LoginPage from "./components/LoginPage";
// import SessionCheckPage from "./components/SessionCheckPage";
// import SessionCheckPage from "./components/SessionCheckPageTSX";
import SessionCheckPage from "./components/SessionCheckPage (1)";

import FacultyDashboard from "./components/FacultyDashboard";
import DeanDashboard from "./components/faculty-filter-ui";
import AdminRoutes from "./components/Routes"; // Import Admin Routes

function App() {
  const [userData, setUserData] = useState(null); // Store the logged-in user's data

  const handleLogout = () => {
    setUserData(null);
  };

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage setUserData={setUserData} />} />
          <Route
            path="/session-check"
            element={
              userData ? (
                <SessionCheckPage
                  userData={userData}
                  onSessionExpired={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/feedback-kartikesh"
            element={
              userData ? (
                <FeedbackPageKartikesh
                  userData={userData}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/faculty-dashboard"
            element={
              userData?.role === "teacher" ? (
                <FacultyDashboard userData={userData} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/dean-dashboard"
            element={
              userData?.role === "dean" ? (
                <DeanDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* Admin Routes */}
          {userData?.role === "admin" && (
            <Route path="/*" element={<AdminRoutes />} />
          )}

          {/* Redirect all unknown paths to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
