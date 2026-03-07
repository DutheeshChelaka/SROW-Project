import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const checkPasswordStrength = (password) => {
    let s = 0;
    if (password.length >= 6) s += 25;
    if (password.length >= 8) s += 25;
    if (/[A-Z]/.test(password)) s += 25;
    if (/\d/.test(password)) s += 25;
    return s;
  };

  useEffect(() => { setPasswordStrength(checkPasswordStrength(formData.password)); }, [formData.password]);

  const validate = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (value.length < 3) return "Name must be at least 3 characters.";
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return "Name can only contain letters, spaces, hyphens.";
        return "";
      case "email":
        if (!value) return "Email is required.";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return "Please enter a valid email.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 6) return "Must be at least 6 characters.";
        if (!/[A-Z]/.test(value)) return "Must contain an uppercase letter.";
        if (!/\d/.test(value)) return "Must contain a number.";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password.";
        if (value !== formData.password) return "Passwords do not match.";
        return "";
      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validate(name, value);
    if (error) setErrors((p) => ({ ...p, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const allTouched = {};
      Object.keys(formData).forEach((k) => (allTouched[k] = true));
      setTouched(allTouched);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    setLoading(true);
    try {
      const response = await signup(formData.name, formData.email, formData.password);
      toast.success(response.message || "Account created! Check your email for verification.");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      if (msg.includes("already exists")) setErrors({ email: "This email is already registered" });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  // Reusable input wrapper
  const InputField = ({ name, type = "text", placeholder, icon, showToggle, isVisible, onToggle }) => (
    <div>
      <label className="block font-body text-xs font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-2">
        {name === "confirmPassword" ? "Confirm Password" : name.charAt(0).toUpperCase() + name.slice(1)}
      </label>
      <div className="relative group">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-10 flex items-center justify-center text-neutral-400 group-focus-within:text-brand-black transition-colors">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </span>
        <input
          name={name}
          type={showToggle ? (isVisible ? "text" : "password") : type}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full border-b-2 ${
            touched[name] && errors[name] ? "border-red-400" : "border-neutral-200 focus:border-brand-black"
          } bg-transparent pl-10 ${showToggle ? "pr-12" : "pr-4"} py-3 font-body text-sm text-brand-black placeholder-neutral-400
          focus:outline-none transition-colors duration-300`}
        />
        {showToggle && (
          <button type="button" onClick={onToggle}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-brand-black transition-colors">
            {isVisible ? (
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
        )}
      </div>
      {touched[name] && errors[name] && (
        <p className="mt-1.5 font-body text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop theme="colored" />

      {/* ══════ LEFT: Visual Panel ══════ */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-neutral-900 to-brand-black" />

        {/* Decorative */}
        <div className="absolute top-20 -left-20 w-72 h-72 border border-white/5 rounded-full" />
        <div className="absolute top-32 -left-8 w-72 h-72 border border-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-white/5 rounded-full" />
        <div className="absolute -bottom-8 -right-8 w-96 h-96 border border-white/5 rounded-full" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-brand-accent to-transparent opacity-40" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top: Logo */}
          <div>
            <Link to="/home" className="flex items-center gap-3">
              <img src="/logo/Logo.png" alt="SROW" className="w-10 h-10 object-contain" />
              <h2 className="font-heading text-3xl font-bold text-white tracking-[0.1em]">SROW</h2>
            </Link>
            <div className="w-8 h-0.5 bg-brand-accent mt-3" />
          </div>

          {/* Center */}
          <div className="max-w-sm">
            <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-accent mb-4">
              Join The Community
            </p>
            <h1 className="font-heading text-4xl xl:text-5xl font-medium text-white leading-tight mb-6">
              Your style journey starts here
              <span className="text-brand-accent">.</span>
            </h1>
            <p className="font-body text-sm text-neutral-400 leading-relaxed">
              Create your account to unlock exclusive collections, member-only pricing, and a personalized shopping experience.
            </p>
          </div>

          {/* Bottom: Benefits */}
          <div>
            <p className="text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-4">
              Member Benefits
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Exclusive Offers", desc: "Members-only discounts" },
                { title: "Early Access", desc: "Shop new drops first" },
                { title: "Free Shipping", desc: "On orders over LKR 10,000" },
                { title: "Order Tracking", desc: "Real-time status updates" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-sm text-white font-medium">{item.title}</p>
                    <p className="font-body text-[11px] text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-5 mt-5 border-t border-white/10">
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

      {/* ══════ RIGHT: Signup Form ══════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 py-12 bg-white relative overflow-y-auto">
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
              Create Account
            </h2>
            <p className="font-body text-sm text-neutral-500">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField name="name" placeholder="Your full name"
              icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />

            <InputField name="email" type="email" placeholder="you@example.com"
              icon="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />

            <InputField name="password" placeholder="Create a strong password"
              icon="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              showToggle isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} />

            {/* Password Strength */}
            {formData.password && (
              <div className="-mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }} />
                  </div>
                  <span className="text-[11px] font-body text-neutral-500 w-10">{getStrengthText()}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    { check: formData.password.length >= 6, label: "6+ characters" },
                    { check: /[A-Z]/.test(formData.password), label: "Uppercase" },
                    { check: /\d/.test(formData.password), label: "Number" },
                    { check: /[!@#$%^&*]/.test(formData.password), label: "Special char" },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <svg className={`w-3.5 h-3.5 transition-colors ${req.check ? "text-green-500" : "text-neutral-300"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-[11px] font-body transition-colors ${req.check ? "text-neutral-700" : "text-neutral-400"}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <InputField name="confirmPassword" placeholder="Confirm your password"
              icon="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              showToggle isVisible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
              <div className="w-4 h-4 mt-0.5 border-2 border-neutral-300 rounded flex items-center justify-center group-hover:border-neutral-400 transition-colors flex-shrink-0">
              </div>
              <span className="font-body text-xs text-neutral-500 leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-brand-black font-medium hover:text-brand-accent transition-colors">Terms of Service</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-brand-black font-medium hover:text-brand-accent transition-colors">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className={`w-full py-4 mt-2 text-sm font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                loading ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-brand-black text-white hover:bg-neutral-800 active:scale-[0.98]"
              }`}>
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[11px] font-body text-neutral-400 tracking-wider uppercase">Already a member?</span>
            </div>
          </div>

          {/* Sign In */}
          <Link to="/login"
            className="block w-full py-3.5 text-center text-sm font-body font-medium text-brand-black border-2 border-neutral-200 hover:border-brand-black transition-all duration-300">
            Sign In Instead
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

export default Signup;