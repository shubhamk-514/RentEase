import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
const Contact = ({ showToast }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await axios.post("http://localhost:5000/api/contact", {
        name,
        email,
        message,
      });

      showToast(res.data.message, "success");

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to send message",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-black font-sans bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-slate-400 text-sm">
          Have questions about verification, listing setup, or favorites? Drop
          us a line.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Support Coordinates (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-200 font-sans flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" /> Support Desk
            </h3>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Our direct chat operations are available Mon-Fri, 9 AM - 6 PM IST.
              You can also contact our hotlines directly below.
            </p>
            <hr className="border-slate-800/60" />
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-lg text-indigo-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Email Inquiry
                  </h5>
                  <span>shubhamchaurasiya0087@gmail.com</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-lg text-indigo-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Help Hotline
                  </h5>
                  <span>+91 9305611514</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-lg text-indigo-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Delhi Head Office
                  </h5>
                  <span>Connaught Place, New Delhi, 110001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side: Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg"
          >
            <h3 className="text-lg font-bold text-slate-200 font-sans">
              Submit a Question
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-slate-100 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-slate-100 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Your Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-slate-100 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  Send Message <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;
