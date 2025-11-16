import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import CommunityReports from "./components/CommunityReports";
// import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard"; 
import ReportIssue from "./components/ReportIssue";
import CommunityDrives from "./components/CommunityDrives";
import Rewards from "./components/Rewards";
import ReportViolations from "./components/ReportViolations";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CreateEvent from "./components/CreateEvent"; 
import AboutCivicHero from "./components/AboutCivicHero";

// ✅ Auth helpers
const isAuthenticated = () => !!localStorage.getItem("role");
const isAdmin = () => localStorage.getItem("role") === "admin";

// Wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Wrapper for admin-only routes
const AdminRoute = ({ children }) => {
  const location = useLocation();
  if (!isAdmin()) {
    return <Navigate to="/login" state={{ from: location }} replace />; // Admin access requires admin role
  }
  return children;
};

const Home = () => (
  <>
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <CommunityReports />
    {/* <CTASection /> */}
    <Footer  />
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User-only routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community-drives"
          element={
            <ProtectedRoute>
              <CommunityDrives />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Rewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-violations"
          element={
            <ProtectedRoute>
              <ReportViolations />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* About Page */}
        <Route path="/about" element={<AboutCivicHero />} />

        {/* Optional generic dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
