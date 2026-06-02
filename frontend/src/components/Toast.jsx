import React, { useEffect } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);
  const isSuccess = type === "success";
  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-up max-w-sm w-full">
      <div
        className={`glass flex items-center p-4 rounded-xl border ${
          isSuccess ? "border-emerald-500/20" : "border-rose-500/20"
        } shadow-2xl shadow-black/80`}
      >
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-emerald-400 text-glow-emerald" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-rose-400" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-slate-100">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
            className="inline-flex rounded-md text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Toast;
