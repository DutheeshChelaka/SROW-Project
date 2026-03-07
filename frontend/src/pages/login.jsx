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
  const [mounted, setMounted] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validate = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return "Please enter a valid email.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Must be at least 6 characters.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    if (error) setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validate("email", formData.email);
    const passErr = validate("password", formData.password);
    if (emailErr || passErr) {
      setErrors({ ...(emailErr && { email: emailErr }), ...(passErr && { password: passErr }) });
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      if (rememberMe) localStorage.setItem("rememberedEmail", formData.email);
      else localStorage.removeItem("rememberedEmail");

      toast.success(response?.message || "Welcome back!");
      setFormData({ email: "", password: "" });
      setTimeout(() => navigate(user?.role === "admin" ? "/admin" : "/profile"), 2000);
    } catch (err) {
      const msg = err.message || "Something went wrong.";
      if (msg.includes("Invalid email or password")) {
        setErrors({ email: " ", password: "Invalid email or password" });
      } else if (msg.includes("verify your email")) {
        setErrors({ email: "Please verify your email first" });
      } else {
        setErrors({ email: msg });
      }
      toast.error(msg);
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name || "User"}!`);
      setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/profile"), 2000);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop theme="colored" />

      {/* ══════ LEFT: Visual Panel ══════ */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-neutral-900 to-brand-black" />

        {/* Decorative circles */}
        <div className="absolute top-20 -left-20 w-72 h-72 border border-white/5 rounded-full" />
        <div className="absolute top-32 -left-8 w-72 h-72 border border-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-white/5 rounded-full" />
        <div className="absolute -bottom-8 -right-8 w-96 h-96 border border-white/5 rounded-full" />

        {/* Accent line */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-brand-accent to-transparent opacity-40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top: Logo */}
          <div>
            <Link to="/home" className="flex items-center gap-3">
              <img src="/logo/Logo.png" alt="SROW" className="w-10 h-10 object-contain" />
              <h2 className="font-heading text-3xl font-bold text-white tracking-[0.1em]">SROW</h2>
            </Link>
            <div className="w-8 h-0.5 bg-brand-accent mt-3" />
          </div>

          {/* Center: Tagline */}
          <div className="max-w-sm">
            <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-accent mb-4">
              Welcome Back
            </p>
            <h1 className="font-heading text-4xl xl:text-5xl font-medium text-white leading-tight mb-6">
              Style is a way to say who you are
              <span className="text-brand-accent">.</span>
            </h1>
            <p className="font-body text-sm text-neutral-400 leading-relaxed">
              Sign in to access your account, track orders, and discover our latest curated collections.
            </p>
          </div>

          {/* Bottom: Social Proof */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-3">
                {["DC", "AK", "SP", "NR"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-brand-black flex items-center justify-center text-[10px] font-body font-bold text-white"
                    style={{ backgroundColor: ["#8B7355", "#5B6B7A", "#7A6B5B", "#6B7A5B"][i], zIndex: 4 - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-body text-sm text-white font-medium">2,500+ Happy Customers</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-neutral-500 ml-1 font-body">4.9/5</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              {["Free Shipping", "Easy Returns", "Secure Payments"].map((text, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-body text-[11px] text-neutral-400">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════ RIGHT: Login Form ══════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12 bg-white relative">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/home" className="flex items-center gap-2">
            <img src="/logo/Logo.png" alt="SROW" className="w-8 h-8 object-contain" />
            <h2 className="font-heading text-2xl font-bold text-brand-black tracking-[0.08em]">SROW</h2>
          </Link>
        </div>

        <div className={`w-full max-w-sm transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-semibold text-brand-black mb-2">
              Sign In
            </h2>
            <p className="font-body text-sm text-neutral-500">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-2">
                Email
              </label>
              <div className="relative group">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-10 flex items-center justify-center text-neutral-400 group-focus-within:text-brand-black transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border-b-2 ${
                    errors.email ? "border-red-400" : "border-neutral-200 focus:border-brand-black"
                  } bg-transparent pl-10 pr-4 py-3 font-body text-sm text-brand-black placeholder-neutral-400
                  focus:outline-none transition-colors duration-300`}
                />
              </div>
              {errors.email && errors.email !== " " && (
                <p className="mt-1.5 font-body text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-body text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-2">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-10 flex items-center justify-center text-neutral-400 group-focus-within:text-brand-black transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border-b-2 ${
                    errors.password ? "border-red-400" : "border-neutral-200 focus:border-brand-black"
                  } bg-transparent pl-10 pr-12 py-3 font-body text-sm text-brand-black placeholder-neutral-400
                  focus:outline-none transition-colors duration-300`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-brand-black transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && errors.password !== " " && (
                <p className="mt-1.5 font-body text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${
                  rememberMe ? "bg-brand-black border-brand-black" : "border-neutral-300 group-hover:border-neutral-400"
                }`}>
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only" />
                <span className="font-body text-xs text-neutral-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="font-body text-xs text-neutral-500 hover:text-brand-black transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-2 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                loading
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-brand-black text-white hover:bg-neutral-800 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[11px] font-body text-neutral-400 tracking-wider uppercase">New here?</span>
            </div>
          </div>

          {/* Sign Up */}
          <Link
            to="/signup"
            className="block w-full py-3.5 text-center text-sm font-body font-medium text-brand-black border-2 border-neutral-200 hover:border-brand-black transition-all duration-300"
          >
            Create an Account
          </Link>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", label: "256-bit SSL" },
              { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", label: "Secure" },
              { icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z", label: "Encrypted" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
                </svg>
                <span className="font-body text-[10px] text-neutral-400 tracking-wider uppercase">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;