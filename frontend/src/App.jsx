import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Common Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
// Public Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import RoomDetails from "./pages/RoomDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTPVerify from "./pages/OTPVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
// Tenant Pages
import TenantDashboard from "./pages/tenant/TenantDashboard";
import Favorites from "./pages/tenant/Favorites";
// Host Pages
import HostDashboard from "./pages/host/HostDashboard";
import AddProperty from "./pages/host/AddProperty";
import EditProperty from "./pages/host/EditProperty";
import ManageListings from "./pages/host/ManageListings";
// Common Authenticated Pages
import Profile from "./pages/Profile";
// Redux Actions to Clear Messages
import { clearMessages } from "./store/slices/authSlice";
import { resetRoomStatus } from "./store/slices/roomSlice";
import { clearFavoriteMessages } from "./store/slices/favoriteSlice";
import API from "./utils/api";
import { fetchFavorites, fetchContacted } from "./store/slices/favoriteSlice";
function App() {
  const dispatch = useDispatch();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  // Select slices
  const auth = useSelector((state) => state.auth);
  const rooms = useSelector((state) => state.rooms);
  const favorites = useSelector((state) => state.favorites);
  // Helper to trigger toast manual/custom notifications
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };
  // Fetch initial profile stats for tenant upon reload
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === "tenant") {
      dispatch(fetchFavorites());
      dispatch(fetchContacted());
    }
  }, [auth.isAuthenticated, auth.user, dispatch]);
  // Auth slice toast watcher
  useEffect(() => {
    if (auth.error) {
      showToast(auth.error, "error");
      dispatch(clearMessages());
    } else if (auth.successMsg) {
      showToast(auth.successMsg, "success");
      dispatch(clearMessages());
    }
  }, [auth.error, auth.successMsg, dispatch]);
  // Rooms slice toast watcher
  useEffect(() => {
    if (rooms.error) {
      showToast(rooms.error, "error");
      dispatch(resetRoomStatus());
    }
  }, [rooms.error, dispatch]);
  // Favorites slice toast watcher
  useEffect(() => {
    if (favorites.error) {
      showToast(favorites.error, "error");
      dispatch(clearFavoriteMessages());
    } else if (favorites.successMsg) {
      showToast(favorites.successMsg, "success");
      dispatch(clearFavoriteMessages());
    }
  }, [favorites.error, favorites.successMsg, dispatch]);
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-950 text-slate-100 selection:bg-indigo-500/35 selection:text-indigo-200">
        <Navbar />

        {/* Toast Container */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home showToast={showToast} />} />
            <Route
              path="/explore"
              element={<Explore showToast={showToast} />}
            />
            <Route
              path="/rooms/:id"
              element={<RoomDetails showToast={showToast} />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/contact"
              element={<Contact showToast={showToast} />}
            />
            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route path="/signup" element={<Signup showToast={showToast} />} />
            <Route
              path="/otp-verify"
              element={<OTPVerify showToast={showToast} />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword showToast={showToast} />}
            />
            <Route
              path="/reset-password"
              element={<ResetPassword showToast={showToast} />}
            />
            {/* Tenant/User Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <TenantDashboard showToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute allowedRoles={["tenant"]}>
                  <Favorites showToast={showToast} />
                </ProtectedRoute>
              }
            />
            {/* Host Protected Routes */}
            <Route
              path="/host-dashboard"
              element={
                <ProtectedRoute allowedRoles={["host"]}>
                  <HostDashboard showToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-property"
              element={
                <ProtectedRoute allowedRoles={["host"]}>
                  <AddProperty showToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-property/:id"
              element={
                <ProtectedRoute allowedRoles={["host"]}>
                  <EditProperty showToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-listings"
              element={
                <ProtectedRoute allowedRoles={["host"]}>
                  <ManageListings showToast={showToast} />
                </ProtectedRoute>
              }
            />
            {/* Common Authenticated Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["tenant", "host"]}>
                  <Profile showToast={showToast} />
                </ProtectedRoute>
              }
            />
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
