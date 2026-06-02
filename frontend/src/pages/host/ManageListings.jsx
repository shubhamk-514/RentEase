import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHostListings,
  deleteRoomListing,
  updateRoomListing,
} from "../../store/slices/roomSlice";
import { Link } from "react-router-dom";
import {
  FileSpreadsheet,
  MapPin,
  Edit3,
  Trash2,
  Home,
  Power,
  Activity,
} from "lucide-react";
const ManageListings = ({ showToast }) => {
  const dispatch = useDispatch();
  const { hostRooms, loading, actionLoading } = useSelector(
    (state) => state.rooms,
  );
  useEffect(() => {
    dispatch(fetchHostListings());
  }, [dispatch]);
  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this room listing permanently?",
      )
    ) {
      dispatch(deleteRoomListing(id))
        .unwrap()
        .then((res) => {
          showToast(res.message || "Listing deleted successfully", "success");
        });
    }
  };
  const toggleAvailability = (room) => {
    const nextStatus =
      room.availabilityStatus === "available" ? "rented" : "available";
    dispatch(
      updateRoomListing({
        id: room._id,
        roomData: { ...room, availabilityStatus: nextStatus },
      }),
    )
      .unwrap()
      .then(() => {
        showToast(`Listing status updated to '${nextStatus}'`, "success");
      });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black font-sans flex items-center gap-2">
          <FileSpreadsheet className="w-8 h-8 text-indigo-400" /> My Room
          Listings
        </h1>
        <p className="text-slate-400 text-sm">
          Keep your listing availability updated to avoid tenants contacting you
          for occupied spaces.
        </p>
      </div>
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 bg-dark-900 border border-slate-800 rounded-2xl"
            ></div>
          ))}
        </div>
      ) : hostRooms.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-slate-800/80 space-y-4">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Home className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">
              You haven't listed any spaces
            </h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Ready to rent your flat or shared PG? Click below to create your
              first listing.
            </p>
          </div>
          <Link
            to="/add-property"
            className="inline-block py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-semibold text-xs rounded-xl shadow-lg transition-colors"
          >
            Create First Listing
          </Link>
        </div>
      ) : (
        <div className="glass border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Space details</th>
                  <th className="p-4 sm:p-5">Category</th>
                  <th className="p-4 sm:p-5">Monthly Rent</th>
                  <th className="p-4 sm:p-5">Location</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-200">
                {hostRooms.map((room) => {
                  const displayImage =
                    room.images && room.images.length > 0
                      ? room.images[0]
                      : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=85";
                  return (
                    <tr
                      key={room._id}
                      className="hover:bg-slate-900/35 transition-colors"
                    >
                      {/* Name / Title */}
                      <td className="p-4 sm:p-5 flex items-center gap-3">
                        <div className="w-14 aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-850 flex-shrink-0">
                          <img
                            src={displayImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold line-clamp-1 max-w-[200px] text-slate-100">
                          {room.title}
                        </span>
                      </td>
                      {/* Category */}
                      <td className="p-4 sm:p-5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                          {room.category}
                        </span>
                      </td>
                      {/* Rent */}
                      <td className="p-4 sm:p-5 font-bold text-emerald-400 text-glow-emerald">
                        ₹{room.price.toLocaleString("en-IN")}
                      </td>
                      {/* Location */}
                      <td className="p-4 sm:p-5 text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{room.location}</span>
                        </div>
                      </td>
                      {/* Availability status */}
                      <td className="p-4 sm:p-5">
                        <button
                          onClick={() => toggleAvailability(room)}
                          disabled={actionLoading}
                          className={`px-3 py-1 rounded-xl text-xs font-bold capitalize flex items-center gap-1.5 transition-all border ${
                            room.availabilityStatus === "available"
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15"
                              : "bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/15"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {room.availabilityStatus}
                        </button>
                      </td>
                      {/* Edit / Delete actions */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/edit-property/${room._id}`}
                            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors flex items-center justify-center"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(room._id)}
                            disabled={actionLoading}
                            className="p-2 rounded-xl bg-rose-500/15 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-rose-500/25 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageListings;
