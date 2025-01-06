import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/signup";
import Login from "./pages/login";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import Layout from "./components/Layout";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
