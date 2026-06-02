const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a room title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a rent price per month"],
    },
    images: {
      type: [String],
      required: [true, "Please add at least one image"],
    },
    location: {
      type: String,
      required: [true, "Please add a city or general location"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please add a full address"],
    },
    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },
    contactNumber: {
      type: String,
      required: [true, "Please add a contact number"],
    },
    rules: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: ["PG", "room", "flat", "student room", "shared room", "other"],
      default: "room",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Room", roomSchema);
