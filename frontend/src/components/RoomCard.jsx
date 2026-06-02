import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Heart, MapPin, Phone, ShieldCheck } from "lucide-react";
import { toggleFavorite, contactHost } from "../store/slices/favoriteSlice";
const RoomCard = ({ room, onShowToast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites, contacted } = useSelector((state) => state.favorites);
  const isFavorited = favorites.some((f) => f._id === room._id);
  const isContacted = contacted.some((c) => c._id === room._id);
  // Check if current user is the host of this room
  const isOwnListing = user?._id === room.host?._id || user?._id === room.host;
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      onShowToast("Please login to add rooms to favorites", "error");
      navigate("/login");
      return;
    }
    if (user?.role !== "tenant") {
      onShowToast("Only tenants can save favorites", "error");
      return;
    }
    dispatch(toggleFavorite(room._id))
      .unwrap()
      .then((res) => {
        onShowToast(res.message, "success");
      })
      .catch((err) => {
        onShowToast(err || "Failed to update favorites", "error");
      });
  };
  const handleContactClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      onShowToast("Please login to contact the property owner", "error");
      navigate("/login");
      return;
    }
    if (user?.role !== "tenant") {
      onShowToast("Only tenants can contact owners", "error");
      return;
    }
    if (isOwnListing) {
      onShowToast("You cannot contact yourself for your own listing", "error");
      return;
    }
    dispatch(contactHost(room._id))
      .unwrap()
      .then((res) => {
        onShowToast(
          `Owner Contact: ${res.contactNumber}. Info saved to dashboard.`,
          "success",
        );
      })
      .catch((err) => {
        onShowToast(err || "Failed to contact owner", "error");
      });
  };
  // Fallback image if none supplied
  const displayImage =
    room.images && room.images.length > 0
      ? room.images[0]
      : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=85";
  return (
    <div className="group bg-dark-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-lg shadow-black/30 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <img
          src={displayImage}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg glass border border-white/5 text-indigo-300">
          {room.category}
        </span>
        {/* Favorite Button (Only visible/actionable for non-hosts) */}
        {(!isAuthenticated || user?.role === "tenant") && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-xl transition-all duration-200 ${
              isFavorited
                ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                : "bg-black/40 text-slate-300 hover:text-white border border-white/10 hover:bg-black/60"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`}
            />
          </button>
        )}
      </div>
      {/* Content */}
      <div className="p-5">
        {/* Price & Location Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-xl font-bold text-emerald-400 text-glow-emerald">
            ₹{room.price.toLocaleString("en-IN")}
            <span className="text-xs text-slate-400 font-normal">/mo</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 max-w-[60%] truncate">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>
        </div>
        {/* Title */}
        <h4 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors duration-200 mb-1 line-clamp-1">
          {room.title}
        </h4>
        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 h-8 leading-relaxed">
          {room.description}
        </p>
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/rooms/${room._id}`}
            className="flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 hover:border-slate-600/50 text-center transition-all"
          >
            View Details
          </Link>

          {user?.role === "host" ? (
            <div className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-center cursor-default">
              <ShieldCheck className="w-3.5 h-3.5" /> Host View
            </div>
          ) : (
            <button
              onClick={handleContactClick}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                isContacted
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              {isContacted ? "Contacted" : "Contact Host"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default RoomCard;
