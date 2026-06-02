import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import { resetFavoriteState } from "../store/slices/favoriteSlice";
import {
  Menu,
  X,
  Home,
  Search,
  Heart,
  Bookmark,
  User,
  PlusCircle,
  List,
  LogOut,
  Compass,
} from "lucide-react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetFavoriteState());
    navigate("/");
    setIsOpen(false);
  };
  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "text-indigo-400 bg-indigo-500/10"
        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
    }`;
  return (
    <nav className="glass-nav sticky top-0 z-50 w-full backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent tracking-tight font-sans">
                RentEase
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Direct
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {!isAuthenticated ? (
              // Guest Navigation
              <>
                <Link to="/" className={linkClass("/")}>
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to="/explore" className={linkClass("/explore")}>
                  <Compass className="w-4 h-4" /> Explore Rooms
                </Link>
                <Link to="/about" className={linkClass("/about")}>
                  About
                </Link>
                <Link to="/contact" className={linkClass("/contact")}>
                  Contact
                </Link>
                <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
                >
                  Join RentEase
                </Link>
              </>
            ) : user?.role === "tenant" ? (
              // Tenant Navigation
              <>
                <Link to="/" className={linkClass("/")}>
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to="/explore" className={linkClass("/explore")}>
                  <Search className="w-4 h-4" /> Explore Rooms
                </Link>
                <Link to="/favorites" className={linkClass("/favorites")}>
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />{" "}
                  Favorites
                </Link>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  <Bookmark className="w-4 h-4" /> Saved Rooms
                </Link>
                <Link to="/profile" className={linkClass("/profile")}>
                  <User className="w-4 h-4" /> Profile
                </Link>
                <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              // Host Navigation
              <>
                <Link
                  to="/host-dashboard"
                  className={linkClass("/host-dashboard")}
                >
                  <Home className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/add-property" className={linkClass("/add-property")}>
                  <PlusCircle className="w-4 h-4" /> Add Property
                </Link>
                <Link
                  to="/manage-listings"
                  className={linkClass("/manage-listings")}
                >
                  <List className="w-4 h-4" /> My Listings
                </Link>
                <Link to="/profile" className={linkClass("/profile")}>
                  <User className="w-4 h-4" /> Profile
                </Link>
                <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-all"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass animate-fade-in border-b border-slate-800">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={linkClass("/")}
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link
                  to="/explore"
                  className={linkClass("/explore")}
                  onClick={() => setIsOpen(false)}
                >
                  <Compass className="w-4 h-4" /> Explore Rooms
                </Link>
                <Link
                  to="/about"
                  className={linkClass("/about")}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={linkClass("/contact")}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <div className="border-t border-slate-800 my-2 pt-2"></div>
                <Link
                  to="/login"
                  className="block text-center w-full px-4 py-2 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block text-center w-full mt-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : user?.role === "tenant" ? (
              <>
                <Link
                  to="/"
                  className={linkClass("/")}
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link
                  to="/explore"
                  className={linkClass("/explore")}
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="w-4 h-4" /> Explore Rooms
                </Link>
                <Link
                  to="/favorites"
                  className={linkClass("/favorites")}
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="w-4 h-4" /> Favorites
                </Link>
                <Link
                  to="/dashboard"
                  className={linkClass("/dashboard")}
                  onClick={() => setIsOpen(false)}
                >
                  <Bookmark className="w-4 h-4" /> Saved Rooms
                </Link>
                <Link
                  to="/profile"
                  className={linkClass("/profile")}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/host-dashboard"
                  className={linkClass("/host-dashboard")}
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-4 h-4" /> Dashboard
                </Link>
                <Link
                  to="/add-property"
                  className={linkClass("/add-property")}
                  onClick={() => setIsOpen(false)}
                >
                  <PlusCircle className="w-4 h-4" /> Add Property
                </Link>
                <Link
                  to="/manage-listings"
                  className={linkClass("/manage-listings")}
                  onClick={() => setIsOpen(false)}
                >
                  <List className="w-4 h-4" /> My Listings
                </Link>
                <Link
                  to="/profile"
                  className={linkClass("/profile")}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
