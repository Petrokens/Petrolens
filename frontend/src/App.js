// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/auth/login";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";
// import UserDashboard from "./pages/dashboard/UserDashboard";
// import UploadDocument from "./pages/upload/UploadDocument";
// import ReportDetails from "./pages/qc-report/ReportDetails";
// import DocumentHistory from "./pages/history/DocumentHistory";

// Future: Auth context
// import { useAuth } from "./features/auth/useAuth"; 

const App = () => {
  // TEMP — Replace with real auth context
  const role = localStorage.getItem("role"); // 'admin' or 'user'

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {role === "admin" && (
        <>
          {/* <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/report/:id" element={<ReportDetails />} />
          <Route path="/history" element={<DocumentHistory />} /> */}
        </>
      )}

      {role === "user" && (
        <>
          {/* <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/report/:id" element={<ReportDetails />} />
          <Route path="/history" element={<DocumentHistory />} /> */}
        </>
      )}

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
