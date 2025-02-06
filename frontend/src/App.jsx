import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";

// Components & Pages
import AutoCurrencySetter from "./context/AutoCurrencySetter";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminProtectedRoute from "./components/AdminProtectedRoutes";

// Public Pages
import Signup from "./pages/signup";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import VerifyEmail from "./pages/verifyEmail";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import Products from "./pages/products";
import ProductDetails from "./pages/productDetails";
import SearchResults from "./components/searchResults";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import OrderHistory from "./pages/orderHistory";
import Profile from "./pages/profile";

// Admin Panel Pages
import AdminDashboard from "./pages/admin/adminDashboard";
import ManageCategories from "./pages/admin/manageCategories";
import ManageSubcategories from "./pages/admin/manageSubcategories";
import ManageProducts from "./pages/admin/manageProducts";
import AdminOrders from "./pages/admin/manageOrders";
import OrderDetails from "./pages/admin/orderDetails";

const App = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        {/* Automatically set the currency based on user/profile or geolocation */}
        <AutoCurrencySetter />
        <Router>
          <DynamicBodyClass>
            <Routes>
              {/* Redirect root path (/) to home */}
              <Route path="/" element={<Navigate to="/home" />} />

              {/* Routes without Header */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

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
                path="/products/:subcategoryId"
                element={
                  <Layout>
                    <Products />
                  </Layout>
                }
              />
              <Route
                path="/search"
                element={
                  <Layout>
                    <SearchResults />
                  </Layout>
                }
              />
              <Route
                path="/products/details/:productId"
                element={
                  <Layout>
                    <ProductDetails />
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
              <Route
                path="/cart"
                element={
                  <Layout>
                    <Cart />
                  </Layout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Layout>
                    <Checkout />
                  </Layout>
                }
              />
              <Route
                path="/orderHistory"
                element={
                  <Layout>
                    <OrderHistory />
                  </Layout>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminProtectedRoute>
                    <ManageCategories />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/subcategories"
                element={
                  <AdminProtectedRoute>
                    <ManageSubcategories />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminProtectedRoute>
                    <ManageProducts />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminProtectedRoute>
                    <AdminOrders />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders/:orderId"
                element={
                  <AdminProtectedRoute>
                    <OrderDetails />
                  </AdminProtectedRoute>
                }
              />
            </Routes>
          </DynamicBodyClass>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
};

// A wrapper to dynamically set the body class based on the current route.
// This is useful if you have different layouts (e.g., auth pages vs. default pages).
const DynamicBodyClass = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Apply a specific body class based on the current route.
    if (
      location.pathname === "/signup" ||
      location.pathname === "/login" ||
      location.pathname === "/forgot-password" ||
      location.pathname.startsWith("/reset-password")
    ) {
      document.body.classList.add("auth-page-body");
      document.body.classList.remove("default-page-body");
    } else {
      document.body.classList.add("default-page-body");
      document.body.classList.remove("auth-page-body");
    }
  }, [location]);

  return <>{children}</>;
};

export default App;
