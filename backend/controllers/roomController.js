const Room = require("../models/Room");
const geocoder = require("../config/geocoder");
// @desc    Get all rooms (filtered & searched)
// @route   GET /api/rooms
// @access  Public
const getAllRooms = async (req, res, next) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      availabilityStatus,
    } = req.query;
    let query = {};
    // Availability filter - default to available, but allow viewing all
    if (availabilityStatus) {
      query.availabilityStatus = availabilityStatus;
    } else {
      // By default, let's show available properties to general browse
      query.availabilityStatus = "available";
    }
    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }
    // Location search
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    // Price filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }
    // Text search (title, description, location)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    const rooms = await Room.find(query)
      .populate("host", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get single room details
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "host",
      "name email",
    );
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }
    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Create a new room listing
// @route   POST /api/rooms
// @access  Private (Host only)
const createRoom = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      images,
      location,
      address,
      contactNumber,
      rules,
      amenities,
      category,
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !images ||
      images.length === 0 ||
      !location ||
      !address ||
      !contactNumber ||
      !category
    ) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }
    // Convert address -> latitude & longitude
    const loc = await geocoder.geocode(`${address}, ${location}`);

    const latitude = loc[0]?.latitude || null;
    const longitude = loc[0]?.longitude || null;
    const room = await Room.create({
      title,
      description,
      price,
      images,
      location,
      latitude,
      longitude,
      address,
      contactNumber,
      rules: rules || [],
      amenities: amenities || [],
      category,
      host: req.user.id,
      availabilityStatus: "available",
    });
    res.status(201).json({
      success: true,
      message: "Room listing created successfully",
      room,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Update a room listing
// @route   PUT /api/rooms/:id
// @access  Private (Host only)
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }
    // Make sure user is the room host
    if (room.host.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized to update this listing");
    }
    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Room listing updated successfully",
      room,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Delete a room listing
// @route   DELETE /api/rooms/:id
// @access  Private (Host only)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }
    // Make sure user is the room host
    if (room.host.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized to delete this listing");
    }
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Room listing removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get listings created by logged in Host
// @route   GET /api/rooms/host/listings
// @access  Private (Host only)
const getHostListings = async (req, res, next) => {
  try {
    const rooms = await Room.find({ host: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getHostListings,
};
