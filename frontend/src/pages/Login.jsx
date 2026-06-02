import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearMessages } from "../store/slices/authSlice";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
const Login = ({ showToast }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isAuthenticated, user, verificationEmail } = useSelector(
    (state) => state.auth,
  );
  // Form local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(
    searchParams.get("role") === "host" ? "host" : "tenant",
  );
  useEffect(() => {
    // If already authenticated, redirect based on role
    if (isAuthenticated && user) {
      if (user.role === "host") {
        navigate("/host-dashboard");
      } else {
        navigate("/explore");
      }
    }
  }, [isAuthenticated, user, navigate]);
  // If user is unverified, redirect them to verification page automatically
  useEffect(() => {
    if (verificationEmail) {
      navigate("/otp-verify");
    }
  }, [verificationEmail, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      showToast("Please fill in all fields", "error");
      return;
    }
    dispatch(loginUser({ email, password, role }));
  };
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[35rem] h-[35rem] rounded-full bg-violet-600/5 blur-[100px] z-0"></div>
      <div className="max-w-md w-full space-y-8 glass p-8 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black font-sans bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">
            Sign in to direct room rent search & management
          </p>
        </div>
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800/60 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("tenant")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === "tenant"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Tenant / Renter
          </button>
          <button
            type="button"
            onClick={() => setRole("host")}
            className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === "host"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Property Host
          </button>
        </div>
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
          {/* Links */}
          <div className="flex items-center justify-between text-xs">
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01] focus:outline-none disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="flex items-center gap-1.5">
                Sign In <LogIn className="w-4 h-4" />
              </span>
            )}
          </button>
          {/* Direct Signup */}
          <div className="text-center text-xs text-slate-400 mt-4">
            Don't have an account?{" "}
            <Link
              to={`/signup?role=${role}`}
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Sign Up As {role === "host" ? "Host" : "Tenant"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
