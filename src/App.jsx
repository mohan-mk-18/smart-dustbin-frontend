import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./pages/LandingPage";
import PublicUserDetailsPage from "./pages/PublicUserDetailsPage";
import PublicComplaintPage from "./pages/PublicComplaintPage";
import ComplaintSuccessPage from "./pages/ComplaintSuccessPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import WorkerInfoPage from "./pages/WorkerInfoPage";
import ComplaintsPage from "./pages/ComplaintsPage";

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/public/details" element={<PublicUserDetailsPage />} />
        <Route
          path="/public/complaint"
          element={<PublicComplaintPage />}
        />
        <Route
          path="/public/success"
          element={<ComplaintSuccessPage />}
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/login"
          element={
            <AdminLoginPage
              onLogin={() => setIsAdminAuthenticated(true)}
            />
          }
        />

        <Route
          path="/admin/home"
          element={
            isAdminAuthenticated ? (
              <AdminHomePage />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />

        <Route
          path="/admin/workers"
          element={
            isAdminAuthenticated ? (
              <WorkerInfoPage />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />

        <Route
          path="/admin/complaints"
          element={
            isAdminAuthenticated ? (
              <ComplaintsPage />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;