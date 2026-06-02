import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Shield, Star, Award } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-slate-800/80 pt-16 pb-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
              RentEase
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              RentEase is a student-focused room rental platform connecting
              hosts directly with tenants. Find rooms, flats, and shared PGs
              with zero agent fees.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Direct owner communication only.</span>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  to="/explore"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Search Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?category=PG"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Student PGs
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Our Concept
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          {/* Features / Badges */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Trust & Safety
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500/20 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-slate-300">
                    Verified Hosts
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    We verify phone numbers and profiles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-slate-300">
                    Student Friendly
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Specially curated budget rooms near colleges.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>shubhamchaurasiya0087@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>+91 9305611514</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Divider & Copyright */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RentEase Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
