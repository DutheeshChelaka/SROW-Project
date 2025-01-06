import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/signup";
import Login from "./pages/login";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import Layout from "./components/Layout";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoutes";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <DynamicBodyClass>
          <Routes>
            {/* Redirect root path (/) to home */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Routes without Header */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Route */}
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* Routes with Header */}
            <Route
              path="/home"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
          </Routes>
        </DynamicBodyClass>
      </Router>
    </AuthProvider>
  );
};

// A wrapper to dynamically set the body class based on the route
const DynamicBodyClass = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Apply a black background for signup and login pages
    if (location.pathname === "/signup" || location.pathname === "/login") {
      document.body.classList.add("auth-page-body");
    } else {
      document.body.classList.remove("auth-page-body");
    }
  }, [location]);

  return <>{children}</>;
};

export default App;
