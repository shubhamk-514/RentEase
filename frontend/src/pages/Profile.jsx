import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/authSlice";
import { User, Mail, ShieldAlert, Award, Save } from "lucide-react";
const Profile = ({ showToast }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast("Name and email are required", "error");
      return;
    }
    dispatch(updateProfile({ name, email }))
      .unwrap()
      .then((res) => {
        showToast(res.message || "Profile updated successfully", "success");
      })
      .catch((err) => {
        showToast(err || "Failed to update profile", "error");
      });
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-black font-sans">Manage Profile</h1>
        <p className="text-slate-400 text-sm">
          Keep your contact information updated to ensure clean landlord-tenant
          messages.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Summary Card (4 cols) */}
        <div className="md:col-span-4">
          <div className="glass border border-slate-800/80 rounded-3xl p-6 text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">{user?.name}</h3>
              <span className="text-[10px] uppercase font-bold text-slate-500">
                {user?.email}
              </span>
            </div>
            <div className="h-[1px] bg-slate-800/60 w-full"></div>
            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              {user?.role === "host" ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" /> Host
                  Account
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-emerald-400" /> Tenant
                  Account
                </>
              )}
            </div>
          </div>
        </div>
        {/* Right Side: Edit Form (8 cols) */}
        <div className="md:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <h3 className="text-lg font-bold text-slate-200 font-sans border-b border-slate-800 pb-3">
              Account Credentials
            </h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              {/* Email Address */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Save Changes <Save className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
