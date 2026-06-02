import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-5 px-4 text-center">
      <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-rose-500 shadow-md">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-5xl font-black font-sans text-slate-100">404</h1>
        <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          The requested link does not exist, or has been moved to a different
          location.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-semibold text-xs shadow-lg transition-all"
      >
        <Home className="w-4 h-4" /> Go Back Home
      </Link>
    </div>
  );
};
export default NotFound;
