import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "../store/slices/roomSlice";
import RoomCard from "../components/RoomCard";
import {
  Search,
  MapPin,
  Home as HomeIcon,
  Shield,
  DollarSign,
  Users,
  Sparkles,
  BookOpen,
} from "lucide-react";
const Home = ({ showToast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.rooms);
  // Search form local state
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [budget, setBudget] = useState("");
  useEffect(() => {
    // Fetch latest 3 rooms for homepage
    dispatch(fetchRooms({ limit: 3 }));
  }, [dispatch]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
    if (category && category !== "All")
      queryParams.push(`category=${category}`);
    if (budget) queryParams.push(`maxPrice=${budget}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    navigate(`/explore${queryString}`);
  };
  const popularLocations = [
    {
      name: "Delhi NCR",
      count: "120+ Rooms",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Mumbai",
      count: "80+ Rooms",
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Bengaluru",
      count: "150+ PGs",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Pune",
      count: "95+ Rooms",
      image:
        "https://images.unsplash.com/photo-1601961405399-801fb1f34581?auto=format&fit=crop&w=400&q=80",
    },
  ];
  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] rounded-full bg-violet-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-indigo-600/10 blur-[120px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-transparent to-dark-950"></div>
        </div>
        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> No Middlemen. No Brokerage.
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] font-sans">
            Find Your Ideal Room or PG <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Directly From Owners
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            RentEase connects students and working professionals with local
            property hosts. Search student-friendly flats, single rooms, and
            shared PGs instantly.
          </p>
          {/* Search bar widget */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-4xl mx-auto p-4 rounded-2xl glass border border-slate-800/80 shadow-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
          >
            {/* Location input */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-800/80">
              <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter city or area (e.g. Pune, Kothrud)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-slate-100 text-sm focus:outline-none w-full placeholder-slate-500"
              />
            </div>
            {/* Category Select */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-800/80">
              <HomeIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-slate-200 text-sm focus:outline-none w-full appearance-none [&>option]:bg-dark-900 [&>option]:text-slate-100 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="PG">Student PG</option>
                <option value="room">Single Room</option>
                <option value="flat">Entire Flat</option>
                <option value="student room">Student Room</option>
                <option value="shared room">Shared Room</option>
              </select>
            </div>
            {/* Budget input */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <DollarSign className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <input
                type="number"
                placeholder="Max Budget (₹/mo)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-transparent text-slate-100 text-sm focus:outline-none w-full placeholder-slate-500"
              />
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </form>
        </div>
      </section>
      {/* 2. Featured Rooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold font-sans">Featured Spaces</h2>
            <p className="text-slate-400 text-sm mt-1">
              Premium, handpicked listings with direct owner contact.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            See All Listings <span>→</span>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-dark-900 border border-slate-800 rounded-2xl h-[380px] animate-pulse"
              ></div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 bg-dark-900 rounded-2xl border border-slate-800">
            <HomeIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold">No active listings yet</h4>
            <p className="text-slate-500 text-sm mt-1">
              Be the first to list a property on RentEase!
            </p>
            <Link
              to="/signup"
              className="mt-4 inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map((room) => (
              <RoomCard key={room._id} room={room} onShowToast={showToast} />
            ))}
          </div>
        )}
      </section>
      {/* 3. Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-bold font-sans">Popular Locations</h2>
          <p className="text-slate-400 text-sm">
            Quickly browse room listings in hot student and professional
            sectors.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularLocations.map((loc) => (
            <Link
              key={loc.name}
              to={`/explore?location=${encodeURIComponent(loc.name)}`}
              className="group relative h-48 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-md"
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 z-10 transition-colors"></div>
              <img
                src={loc.image}
                alt={loc.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 z-20 space-y-0.5">
                <h4 className="text-base font-bold text-white font-sans">
                  {loc.name}
                </h4>
                <p className="text-xs text-indigo-300 font-medium">
                  {loc.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* 4. Student Friendly Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass border border-slate-800/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="absolute top-[10%] right-[10%] w-60 h-60 bg-emerald-500/5 rounded-full blur-[80px]"></div>

          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> For College Students
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-sans">
              Looking for PGs near your campus?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We group room categories by student PGs and shared student
              hostels. Search specifically for accommodations near engineering
              colleges, universities, and commercial zones with flexible payment
              terms.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                to="/explore?category=PG"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10"
              >
                Browse Student PGs
              </Link>
            </div>
          </div>
          <div className="w-full md:w-96 aspect-video md:aspect-square rounded-2xl overflow-hidden border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=500&q=80"
              alt="Cozy room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      {/* 5. Why Choose RentEase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-bold font-sans">
            Designed for Direct Renting
          </h2>
          <p className="text-slate-400 text-sm">
            Say goodbye to security deposits going to agents.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1 */}
          <div className="bg-dark-900 border border-slate-800/80 p-8 rounded-2xl hover:border-slate-700/80 transition-all text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">100% Direct Owners</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              No dealers, middlemen, or agent commission loops. Browse and
              communicate directly with property landlords.
            </p>
          </div>
          {/* Item 2 */}
          <div className="bg-dark-900 border border-slate-800/80 p-8 rounded-2xl hover:border-slate-700/80 transition-all text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">No Brokerage Fee</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Keep your deposit money secure. We charge zero agency commissions
              or platform registration taxes from tenants.
            </p>
          </div>
          {/* Item 3 */}
          <div className="bg-dark-900 border border-slate-800/80 p-8 rounded-2xl hover:border-slate-700/80 transition-all text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Verified Host Profiles</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              We require hosts to register and complete mobile/email checks so
              you get trustworthy listing specifications.
            </p>
          </div>
        </div>
      </section>
      {/* 6. CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="relative rounded-3xl p-8 sm:p-16 bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-dark-900 border border-slate-800 overflow-hidden text-center space-y-6">
          <div className="absolute top-[20%] left-[20%] w-80 h-80 bg-violet-600/10 rounded-full blur-[100px]"></div>

          <h2 className="text-3xl sm:text-5xl font-black font-sans leading-tight">
            Have a room or PG to list?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Become a host today and start receiving inquiries directly from
            students and local renters. It takes less than 3 minutes to upload!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup?role=host"
              className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold text-sm text-white rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              Start Listing Now
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm rounded-xl border border-slate-700/80 transition-colors"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
