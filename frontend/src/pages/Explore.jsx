import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRooms,
  setFilters,
  clearFilters,
} from "../store/slices/roomSlice";
import RoomCard from "../components/RoomCard";
import {
  Filter,
  RotateCcw,
  Search,
  MapPin,
  DollarSign,
  Home,
  SlidersHorizontal,
} from "lucide-react";
const Explore = ({ showToast }) => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { rooms, loading, filters } = useSelector((state) => state.rooms);
  // Parse search params from URL on load
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "All";
    const location = searchParams.get("location") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    dispatch(setFilters({ search, category, location, minPrice, maxPrice }));
  }, [searchParams, dispatch]);
  // Fetch rooms whenever Redux filters change
  useEffect(() => {
    const fetchParams = {};
    if (filters.search) fetchParams.search = filters.search;
    if (filters.category && filters.category !== "All")
      fetchParams.category = filters.category;
    if (filters.location) fetchParams.location = filters.location;
    if (filters.minPrice) fetchParams.minPrice = filters.minPrice;
    if (filters.maxPrice) fetchParams.maxPrice = filters.maxPrice;

    // Always fetch available rooms for public browse
    fetchParams.availabilityStatus = "available";
    dispatch(fetchRooms(fetchParams));
  }, [filters, dispatch]);
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    dispatch(setFilters({ [name]: value }));
    // Sync state with URL params
    const params = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params[key] = newFilters[key];
      }
    });
    setSearchParams(params);
  };
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
    showToast("Filters cleared", "success");
  };
  const categories = [
    "All",
    "PG",
    "room",
    "flat",
    "student room",
    "shared room",
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-black font-sans flex items-center gap-2">
          Explore Rental Spaces
        </h1>
        <p className="text-slate-400 text-sm">
          Filter and browse verified accommodations with zero broker fees.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 1. Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass border border-slate-800/80 rounded-2xl p-5 space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <span className="text-sm font-bold flex items-center gap-1.5 text-slate-200">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />{" "}
                Filters
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Search Keyword
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Near campus, AC"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800/60 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="City or locality"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800/60 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Room Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Home className="h-4 w-4" />
                </div>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800/60 rounded-xl text-xs text-slate-200 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer [&>option]:bg-dark-900"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Spaces" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Price range */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Monthly Budget (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <DollarSign className="h-3 w-3" />
                  </div>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="block w-full pl-7 pr-2 py-2 bg-slate-950 border border-slate-800/60 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <DollarSign className="h-3 w-3" />
                  </div>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="block w-full pl-7 pr-2 py-2 bg-slate-950 border border-slate-800/60 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 2. Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-dark-900 border border-slate-800 rounded-2xl h-[380px] animate-pulse"
                ></div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border border-slate-800/80 space-y-4">
              <div className="w-16 h-16 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-200">
                  No rooms match your filters
                </h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Try adjusting your price brackets or location search keys to
                  browse wider rental lists.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white rounded-xl shadow-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} onShowToast={showToast} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Explore;
