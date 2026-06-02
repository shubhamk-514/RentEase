import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../store/slices/authSlice";
import { HelpCircle, Mail, ArrowRight } from "lucide-react";
const ForgotPassword = ({ showToast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please provide your email address", "error");
      return;
    }
    dispatch(forgotPassword(email))
      .unwrap()
      .then((res) => {
        showToast(res.message, "success");
        navigate("/reset-password");
      })
      .catch((err) => {
        showToast(err || "Failed to request reset OTP", "error");
      });
  };
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[35rem] h-[35rem] rounded-full bg-violet-600/5 blur-[100px] z-0"></div>
      <div className="max-w-md w-full space-y-8 glass p-8 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative z-10">
        {/* Help icon header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-2xl mx-auto shadow-lg shadow-indigo-500/5">
            <HelpCircle className="w-8 h-8 text-glow-violet animate-bounce" />
          </div>
          <h2 className="text-3xl font-black font-sans bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Forgot Password
          </h2>
          <p className="text-slate-400 text-sm">
            Enter your email and we'll send you an OTP to reset your password.
          </p>
        </div>
        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                required
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
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
                Send Reset OTP <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
          {/* Return link */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;
