import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomDetail } from "../store/slices/roomSlice";
import { toggleFavorite, contactHost } from "../store/slices/favoriteSlice";
import {
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Heart,
  ArrowLeft,
  Wifi,
  Tv,
  Snowflake,
  ParkingSquare,
  Utensils,
  AlertCircle,
} from "lucide-react";
const RoomDetails = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRoom, detailLoading } = useSelector((state) => state.rooms);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { favorites, contacted, contactLoading } = useSelector(
    (state) => state.favorites,
  );
  const [activeImage, setActiveImage] = useState("");
  useEffect(() => {
    dispatch(fetchRoomDetail(id));
  }, [id, dispatch]);
  useEffect(() => {
    if (currentRoom && currentRoom.images && currentRoom.images.length > 0) {
      setActiveImage(currentRoom.images[0]);
    }
  }, [currentRoom]);
  if (detailLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!currentRoom) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500" />
        <h3 className="text-xl font-bold">Room Listing Not Found</h3>
        <p className="text-slate-400 text-sm">
          The listing may have been deleted by the host or is unavailable.
        </p>
        <Link
          to="/explore"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Explore
        </Link>
      </div>
    );
  }
  const isFavorited = favorites.some((f) => f._id === currentRoom._id);
  const isContacted = contacted.some((c) => c._id === currentRoom._id);
  const isOwnListing =
    user?._id === currentRoom.host?._id || user?._id === currentRoom.host;
  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      showToast("Please login to add to favorites", "error");
      navigate("/login");
      return;
    }
    if (user?.role !== "tenant") {
      showToast("Only tenants can bookmark rooms", "error");
      return;
    }
    dispatch(toggleFavorite(currentRoom._id))
      .unwrap()
      .then((res) => {
        showToast(res.message, "success");
      });
  };
  const handleContactHost = () => {
    if (!isAuthenticated) {
      showToast("Please login to contact the owner", "error");
      navigate("/login");
      return;
    }
    if (user?.role !== "tenant") {
      showToast("Only tenants can contact landlords", "error");
      return;
    }
    if (isOwnListing) {
      showToast("You cannot contact yourself", "error");
      return;
    }
    dispatch(contactHost(currentRoom._id))
      .unwrap()
      .then((res) => {
        showToast(`Owner contacted! Number: ${res.contactNumber}`, "success");
      })
      .catch((err) => {
        showToast(err || "Failed to contact owner", "error");
      });
  };
  // Get matching icon for amenities
  const getAmenityIcon = (amenity) => {
    const am = amenity.toLowerCase();
    if (am.includes("wifi") || am.includes("internet"))
      return <Wifi className="w-4 h-4 text-indigo-400" />;
    if (am.includes("ac") || am.includes("air") || am.includes("cool"))
      return <Snowflake className="w-4 h-4 text-indigo-400" />;
    if (am.includes("tv") || am.includes("television"))
      return <Tv className="w-4 h-4 text-indigo-400" />;
    if (am.includes("parking") || am.includes("car"))
      return <ParkingSquare className="w-4 h-4 text-indigo-400" />;
    if (am.includes("food") || am.includes("kitchen") || am.includes("meals"))
      return <Utensils className="w-4 h-4 text-indigo-400" />;
    return <ShieldCheck className="w-4 h-4 text-indigo-400" />; // default icon
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back navigation link */}
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>
      </div>
      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Images Gallery & Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery Widget */}
          <div className="space-y-4">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <img
                src={
                  activeImage ||
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85"
                }
                alt={currentRoom.title}
                className="w-full h-full object-cover"
              />

              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-lg">
                {currentRoom.category}
              </span>

              {currentRoom.availabilityStatus === "rented" && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-6 py-3 bg-rose-600 text-white rounded-xl text-lg font-black uppercase tracking-wider shadow-2xl">
                    Already Rented
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnail selector */}
            {currentRoom.images && currentRoom.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {currentRoom.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === img
                        ? "border-indigo-500 scale-[0.98]"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Description & Specifications details */}
          <div className="glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans leading-tight">
                {currentRoom.title}
              </h1>
              {/* 
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{currentRoom.address}</span>
              </div> */}

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{currentRoom.address}</span>
                </div>

                <button
                  onClick={() => {
                    const destination = encodeURIComponent(
                      `${currentRoom.address}, ${currentRoom.location}`,
                    );

                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
                      "_blank",
                    );
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Open in Maps
                </button>
              </div>

              {/*  */}
            </div>
            <hr className="border-slate-800/60" />
            {/* Room description */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-200 font-sans">
                Description
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {currentRoom.description}
              </p>
            </div>
            {/* Amenities Grid */}
            {currentRoom.amenities && currentRoom.amenities.length > 0 && (
              <>
                <hr className="border-slate-800/60" />
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-200 font-sans">
                    Facilities & Amenities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentRoom.amenities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300"
                      >
                        {getAmenityIcon(item)}
                        <span className="capitalize font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {/* Rules list */}
            {currentRoom.rules && currentRoom.rules.length > 0 && (
              <>
                <hr className="border-slate-800/60" />
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-200 font-sans font-bold">
                    House Rules
                  </h3>
                  <ul className="space-y-2.5">
                    {currentRoom.rules.map((rule, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-400"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5"></span>
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Right Side: Host Contact Card & Sticky Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Price & Primary Callout Card */}
          <div className="glass border border-slate-800/80 rounded-3xl p-6 space-y-6 sticky top-24 shadow-xl shadow-black/30">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                Monthly Rent
              </span>
              <div className="text-3xl font-black text-emerald-400 text-glow-emerald">
                ₹{currentRoom.price.toLocaleString("en-IN")}
                <span className="text-xs text-slate-400 font-normal">/mo</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-900 border border-slate-800/60">
              <span className="text-slate-400">Status</span>
              <span
                className={`font-bold capitalize ${currentRoom.availabilityStatus === "available" ? "text-emerald-400" : "text-rose-400"}`}
              >
                {currentRoom.availabilityStatus}
              </span>
            </div>
            {/* Direct Contact Button */}
            {user?.role === "host" ? (
              <div className="w-full text-center py-3.5 px-4 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 text-xs font-semibold">
                This is your property listing.
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleContactHost}
                  disabled={
                    contactLoading ||
                    currentRoom.availabilityStatus === "rented"
                  }
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-black rounded-xl shadow-lg transition-all hover:scale-[1.01] ${
                    isContacted
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 shadow-emerald-500/5"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                  } disabled:opacity-50 disabled:hover:scale-100`}
                >
                  <Phone className="w-4 h-4" />
                  {isContacted
                    ? "Contacted (Reveal Number)"
                    : "Contact Owner Directly"}
                </button>
                {/* Show number if contacted */}
                {isContacted && (
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center animate-slide-up space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Landlord's Mobile
                    </span>
                    <p className="text-lg font-black text-slate-100 flex items-center justify-center gap-1">
                      <Phone className="w-4.5 h-4.5 text-emerald-400 text-glow-emerald" />{" "}
                      {currentRoom.contactNumber}
                    </p>
                  </div>
                )}
                {/* Favorite Save Button */}
                <button
                  onClick={handleFavoriteToggle}
                  className={`w-full flex items-center justify-center gap-1.5 py-3 border rounded-xl text-xs font-bold transition-all ${
                    isFavorited
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-500"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                  {isFavorited ? "Saved to Favorites" : "Save Property"}
                </button>
              </div>
            )}
            {/* Landlord profile info */}
            <div className="border-t border-slate-800/80 pt-5 space-y-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Property Owner
              </span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-xl text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-200">
                    {currentRoom.host?.name || "Verified Owner"}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    {currentRoom.host?.email || "email-hidden@rentease.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoomDetails;
