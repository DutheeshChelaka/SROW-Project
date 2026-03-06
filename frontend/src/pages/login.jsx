import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load saved email if "remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "Email is required.";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Please enter a valid email address.";
        break;
      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 6) error = "Password must be at least 6 characters.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    if (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const emailError = validate("email", formData.email);
    const passwordError = validate("password", formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        ...(emailError && { email: emailError }),
        ...(passwordError && { password: passwordError })
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      
      // Handle "remember me"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success(response?.message || "Login successful! Redirecting...", {
        icon: '🎉',
        style: { background: '#10b981', color: 'white' }
      });

      setFormData({ email: "", password: "" });
      
      setTimeout(() => {
        navigate(user?.role === "admin" ? "/admin" : "/profile");
      }, 2000);
    } catch (err) {
      console.error("Login Error:", err);
      
      let errorMessage = "Something went wrong. Please try again.";
      if (err.message) errorMessage = err.message;

      // Set specific error messages
      if (err.message.includes("Invalid email or password")) {
        setErrors({ 
          email: "Invalid credentials", 
          password: "Invalid credentials" 
        });
        toast.error("Email or password is incorrect", {
          icon: '🔐',
          style: { background: '#ef4444', color: 'white' }
        });
      } else if (err.message.includes("verify your email")) {
        setErrors({ email: "Please verify your email first" });
        toast.info("Please check your inbox to verify your email", {
          icon: '📧',
          style: { background: '#3b82f6', color: 'white' }
        });
      } else {
        setErrors({ email: errorMessage });
        toast.error(errorMessage, {
          icon: '❌',
          style: { background: '#ef4444', color: 'white' }
        });
      }

      setFormData(prev => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name || 'User'}!`, {
        icon: '👋',
        style: { background: '#10b981', color: 'white' }
      });
      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin" : "/profile");
      }, 2000);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-black/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo with Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/home" className="inline-block group">
            <h1 className="font-heading text-5xl font-bold tracking-[-0.02em] text-brand-black group-hover:text-brand-accent transition-colors duration-300">
              SROW
            </h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-brand-accent to-transparent transition-all duration-500"></div>
          </Link>
          <p className="font-body text-sm text-gray-500 mt-3">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 animate-slide-up border border-gray-100">
          <h2 className="font-heading text-2xl font-semibold text-brand-black text-center mb-8">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } pl-12 pr-4 py-3.5 rounded-xl font-body text-sm text-brand-black
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent
                  transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 font-body text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } pl-12 pr-12 py-3.5 rounded-xl font-body text-sm text-brand-black
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent
                  transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-accent transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 font-body text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent focus:ring-offset-0"
                />
                <span className="font-body text-xs text-gray-500 group-hover:text-brand-black transition-colors">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="font-body text-xs text-brand-accent hover:text-brand-accent/80 transition-colors flex items-center gap-1"
              >
                Forgot password?
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-sm font-body font-semibold tracking-[0.15em] uppercase rounded-xl transition-all duration-300 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-black to-gray-800 text-white hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 font-body">New to SROW?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl font-body text-sm font-medium text-gray-700 hover:border-brand-accent hover:text-brand-accent hover:bg-gray-50 transition-all duration-300 group"
            >
              Create an account
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-center font-body text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-body">
              <div className="text-gray-600">Email: user@demo.com</div>
              <div className="text-gray-600">Password: demo123</div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link to="/home" className="font-body text-xs text-gray-400 hover:text-brand-accent transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;