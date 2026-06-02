import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoomListing,
  resetRoomStatus,
} from "../../store/slices/roomSlice";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Image,
  ListPlus,
  MapPin,
  DollarSign,
  Home,
  Phone,
  AlertCircle,
  X,
} from "lucide-react";
const AddProperty = ({ showToast }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionLoading, success, error } = useSelector((state) => state.rooms);
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("room");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Amenities checklists
  const availableAmenities = [
    "WiFi",
    "Air Conditioning",
    "Television",
    "Parking",
    "Food / Meals",
    "Washing Machine",
    "Power Backup",
    "Geyser",
  ];
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Rules setup
  const [rules, setRules] = useState([]);
  const [ruleInput, setRuleInput] = useState("");
  // Image Upload (Base64)
  const [images, setImages] = useState([]);
  useEffect(() => {
    if (success) {
      showToast("Property listed successfully!", "success");
      dispatch(resetRoomStatus());
      navigate("/host-dashboard");
    }
  }, [success, navigate, dispatch]);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size should be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };
  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities((prev) => [...prev, amenity]);
    }
  };
  const addRule = () => {
    if (ruleInput.trim()) {
      setRules((prev) => [...prev, ruleInput.trim()]);
      setRuleInput("");
    }
  };
  const removeRule = (idxToRemove) => {
    setRules((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !address ||
      !contactNumber ||
      !category
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    if (images.length === 0) {
      showToast("Please upload at least one room image", "error");
      return;
    }
    dispatch(
      createRoomListing({
        title,
        description,
        price: Number(price),
        images,
        location,
        address,
        contactNumber,
        rules,
        amenities: selectedAmenities,
        category,
      }),
    )
      .unwrap()
      .catch((err) => {
        showToast(err || "Failed to list property", "error");
      });
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-black font-sans flex items-center gap-2">
          <PlusCircle className="w-8 h-8 text-indigo-400" /> List New Rental
        </h1>
        <p className="text-slate-400 text-sm">
          List your flat, room, or shared PG to receive immediate tenant inquiry
          logs.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl"
      >
        {/* Core fields info */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200 font-sans border-b border-slate-800 pb-2">
            Property Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Room Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cozy Single Room near Metro Station"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors"
              />
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Detail room metrics, rent deposit rules, water supply timing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none resize-none transition-colors"
              ></textarea>
            </div>
            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Monthly Rent (₹) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  required
                  placeholder="Rent Price per month"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors"
                />
              </div>
            </div>
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Home className="w-4.5 h-4.5" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-200 appearance-none focus:outline-none cursor-pointer [&>option]:bg-dark-900"
                >
                  <option value="room">Single Room</option>
                  <option value="PG">Student PG</option>
                  <option value="flat">Entire Flat</option>
                  <option value="student room">Student Room</option>
                  <option value="shared room">Shared Room</option>
                  <option value="other">Other Space</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Address and Contact details */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200 font-sans border-b border-slate-800 pb-2">
            Address & Contact Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                City / Locality *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Kothrud"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors"
                />
              </div>
            </div>
            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Contact Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Landlord Phone"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors"
                />
              </div>
            </div>
            {/* Full Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Physical Address *
              </label>
              <input
                type="text"
                required
                placeholder="Plot no, building name, lane details..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl text-sm text-slate-100 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
        {/* Media images upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200 font-sans border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Image className="w-5 h-5 text-indigo-400" /> Room Images *
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer bg-slate-950 hover:bg-dark-900/50 hover:border-indigo-500/55 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="mb-1 text-xs text-slate-400 font-semibold">
                    Click to upload property images
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Supports PNG, JPG (Max 2MB per file)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {/* Previews grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-850 bg-slate-950"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 hover:bg-black text-rose-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Amenities section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200 font-sans border-b border-slate-800 pb-2">
            Amenities & Facilities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableAmenities.map((item) => (
              <label
                key={item}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                  selectedAmenities.includes(item)
                    ? "bg-indigo-500/10 border-indigo-500/35 text-indigo-300 font-semibold"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700/80 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(item)}
                  onChange={() => handleAmenityToggle(item)}
                  className="hidden"
                />
                <span className="capitalize">{item}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Rules section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200 font-sans border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <ListPlus className="w-5 h-5 text-indigo-400" /> House Rules
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Boys only, No smoking, gate closes at 10 PM"
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRule();
                  }
                }}
                className="flex-grow px-4 py-2.5 bg-slate-950 border border-slate-800/80 focus:border-indigo-500 rounded-xl text-xs text-slate-100 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={addRule}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700/80"
              >
                Add
              </button>
            </div>
            {/* Active Rules List */}
            {rules.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {rules.map((rule, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 rounded-full"
                  >
                    {rule}
                    <button
                      type="button"
                      onClick={() => removeRule(idx)}
                      className="text-rose-400 hover:text-rose-500 font-bold ml-1 text-glow-rose"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Actions Submit */}
        <div className="border-t border-slate-800 pt-6">
          <button
            type="submit"
            disabled={actionLoading}
            className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {actionLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Publish Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddProperty;
