import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import {
  fetchHostListings,
  deleteRoomListing,
} from "../../store/slices/roomSlice";
import { Link } from "react-router-dom";
import {
  Plus,
  List,
  Home,
  FileText,
  CheckCircle,
  ShieldAlert,
  Award,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
const HostDashboard = ({ showToast }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hostRooms, loading, actionLoading } = useSelector(
    (state) => state.rooms,
  );
  useEffect(() => {
    dispatch(fetchHostListings());
  }, [dispatch]);
  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone.",
      )
    ) {
      dispatch(deleteRoomListing(id))
        .unwrap()
        .then((res) => {
          showToast(res.message || "Listing deleted successfully", "success");
        });
    }
  };
  // Compute Stats
  const totalListings = hostRooms.length;
  const availableCount = hostRooms.filter(
    (r) => r.availabilityStatus === "available",
  ).length;
  const rentedCount = hostRooms.filter(
    (r) => r.availabilityStatus === "rented",
  ).length;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Board */}
      <div className="glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px]"></div>
        <div className="space-y-1">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
            Host Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-100">
            Welcome, {user?.name || "Host"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Manage your room rentals and receive inquiries directly.
          </p>
        </div>
        <Link
          to="/add-property"
          className="py-3 px-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold text-xs text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="glass border border-slate-800/60 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
            <List className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold">
              Total Listings
            </span>
            <p className="text-2xl font-black text-slate-100">
              {totalListings}
            </p>
          </div>
        </div>
        {/* Stat 2 */}
        <div className="glass border border-slate-800/60 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold">
              Active / Available
            </span>
            <p className="text-2xl font-black text-emerald-400 text-glow-emerald">
              {availableCount}
            </p>
          </div>
        </div>
        {/* Stat 3 */}
        <div className="glass border border-slate-800/60 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold">
              Rented Out
            </span>
            <p className="text-2xl font-black text-rose-400">{rentedCount}</p>
          </div>
        </div>
      </div>
      {/* Summary grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold font-sans flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-400" /> Active Listings Summary
          </h2>
          <Link
            to="/manage-listings"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Manage Listings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-32 bg-dark-900 border border-slate-800 rounded-2xl"
              ></div>
            ))}
          </div>
        ) : hostRooms.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl border border-slate-800/80 space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-200">
                No rooms uploaded yet
              </h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Begin receiving tenant phone messages by listing your spare
                rooms, PGs or apartments.
              </p>
            </div>
            <Link
              to="/add-property"
              className="inline-block py-2.5 px-5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-indigo-500"
            >
              Post First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostRooms.slice(0, 4).map((room) => {
              const displayImage =
                room.images && room.images.length > 0
                  ? room.images[0]
                  : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=85";
              return (
                <div
                  key={room._id}
                  className="glass border border-slate-800 hover:border-slate-700/80 p-4 rounded-2xl flex gap-4 transition-all group"
                >
                  <div className="w-24 aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                    <img
                      src={displayImage}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="font-bold text-emerald-400">
                          ₹{room.price}/mo
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            room.availabilityStatus === "available"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {room.availabilityStatus}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {room.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {room.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Link
                        to={`/edit-property/${room._id}`}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:bg-slate-700 transition-all flex items-center justify-center"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(room._id)}
                        disabled={actionLoading}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/rooms/${room._id}`}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 ml-auto transition-colors"
                      >
                        View Page
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default HostDashboard;
