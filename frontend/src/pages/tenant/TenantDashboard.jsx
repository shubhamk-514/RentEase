import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacted } from "../../store/slices/favoriteSlice";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Mail,
  User,
  Compass,
  Bookmark,
  Clock,
  ArrowRight,
} from "lucide-react";
const TenantDashboard = ({ showToast }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { contacted, loading } = useSelector((state) => state.favorites);
  useEffect(() => {
    dispatch(fetchContacted());
  }, [dispatch]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome banner */}
      <div className="glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px]"></div>
        <div className="space-y-1">
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
            Tenant Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-100">
            Hello, {user?.name || "Renter"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Manage your contacted properties and find active rooms.
          </p>
        </div>
        <Link
          to="/explore"
          className="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-slate-100 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
        >
          Explore Rooms <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      {/* Main Panel Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bookmark className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold font-sans">Contacted Properties</h2>
          <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
            {contacted.length}
          </span>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-44 bg-dark-900 border border-slate-800 rounded-2xl"
              ></div>
            ))}
          </div>
        ) : contacted.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl border border-slate-800/80 space-y-4">
            <div className="w-14 h-14 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl flex items-center justify-center mx-auto shadow-md">
              <Phone className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-200">
                No contacted properties yet
              </h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Properties you click "Contact Host" on will appear here so you
                can retrieve owner phone numbers easily.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-block py-2.5 px-5 bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200 rounded-xl border border-slate-700/80 transition-colors"
            >
              Browse Spaces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacted.map((room) => {
              if (!room) return null;
              const displayImage =
                room.images && room.images.length > 0
                  ? room.images[0]
                  : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={room._id}
                  className="glass border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-all shadow-md group"
                >
                  {/* Left image thumbnail */}
                  <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-slate-950 overflow-hidden relative">
                    <img
                      src={displayImage}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider bg-black/60 backdrop-blur-md text-indigo-300 border border-white/5">
                      {room.category}
                    </span>
                  </div>
                  {/* Right description */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold text-emerald-400">
                          ₹{room.price}/mo
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />{" "}
                          {room.availabilityStatus}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {room.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {room.location}
                      </p>
                    </div>
                    {/* Owner credentials card */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>
                          Owner: {room.host?.name || "Verified Landlord"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call: {room.contactNumber}</span>
                      </div>
                    </div>
                    <Link
                      to={`/rooms/${room._id}`}
                      className="text-center py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors"
                    >
                      View Property Page
                    </Link>
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
export default TenantDashboard;
