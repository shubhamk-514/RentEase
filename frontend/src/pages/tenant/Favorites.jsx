import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../store/slices/favoriteSlice";
import RoomCard from "../../components/RoomCard";
import { Heart, Compass } from "lucide-react";
import { Link } from "react-router-dom";
const Favorites = ({ showToast }) => {
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.favorites);
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black font-sans flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500/10" /> Saved
          Favorites
        </h1>
        <p className="text-slate-400 text-sm">
          Bookmark spaces you are interested in during your room hunt.
        </p>
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
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-slate-800/80 space-y-4">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-8 h-8 text-rose-400/80" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">
              Your favorites is empty
            </h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Save properties you like by tapping the heart icon on search
              results cards.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-block py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-semibold text-xs rounded-xl shadow-lg transition-colors"
          >
            Start Exploring Rooms
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((room) => {
            // Check if favorites is fully populated. In toggle it pushes a shallow object,
            // but upon loading this page, the backend populate call sends full structures.
            // Protect against rendering incomplete listings.
            if (!room || !room.title) return null;
            return (
              <RoomCard key={room._id} room={room} onShowToast={showToast} />
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Favorites;
