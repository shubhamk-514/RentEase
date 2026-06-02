const User = require("../models/User");
const Room = require("../models/Room");
// @desc    Toggle Room in Favorites (Add/Remove)
// @route   POST /api/users/favorites/:roomId
// @access  Private (Tenant only or Any, but usually Tenant saves)
const toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const roomId = req.params.roomId;
    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error("Room listing not found");
    }
    const index = user.favorites.indexOf(roomId);
    if (index > -1) {
      // Room already in favorites, remove it
      user.favorites.splice(index, 1);
      await user.save();
      res.status(200).json({
        success: true,
        message: "Removed from favorites",
        favorites: user.favorites,
      });
    } else {
      // Room not in favorites, add it
      user.favorites.push(roomId);
      await user.save();
      res.status(200).json({
        success: true,
        message: "Added to favorites",
        favorites: user.favorites,
      });
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Get all favorite rooms
// @route   GET /api/users/favorites
// @access  Private (Tenant only)
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favorites",
      populate: {
        path: "host",
        select: "name email",
      },
    });
    res.status(200).json({
      success: true,
      count: user.favorites.length,
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Contact Host (registers contact event)
// @route   POST /api/users/contact/:roomId
// @access  Private (Tenant only)
const contactHost = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const roomId = req.params.roomId;
    const room = await Room.findById(roomId).populate("host", "name email");
    if (!room) {
      res.status(404);
      throw new Error("Room listing not found");
    }
    // Verify tenant isn't contacting themselves if they are host, though roles should handle it.
    if (room.host._id.toString() === req.user.id) {
      res.status(400);
      throw new Error("You cannot contact yourself for your own listing");
    }
    // Add to contacted if not already there
    if (!user.contacted.includes(roomId)) {
      user.contacted.push(roomId);
      await user.save();
    }
    // Mock Contact Notification service
    console.log("====================================");
    console.log(`RentEase SMS/Contact Service (MOCKED)`);
    console.log(
      `Notification sent to Host: ${room.host.name} (${room.host.email})`,
    );
    console.log(
      `Tenant ${user.name} (${user.email}) wants to rent your room: "${room.title}"`,
    );
    console.log(`Host Contact: ${room.contactNumber}`);
    console.log("====================================");
    res.status(200).json({
      success: true,
      message: `Owner contacted! You can call them directly at ${room.contactNumber}`,
      contactNumber: room.contactNumber,
      contacted: user.contacted,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get contacted listings
// @route   GET /api/users/contacted
// @access  Private (Tenant only)
const getContactedRooms = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "contacted",
      populate: {
        path: "host",
        select: "name email",
      },
    });
    res.status(200).json({
      success: true,
      count: user.contacted.length,
      contacted: user.contacted,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    // Handle email duplication check
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error("Email is already taken by another account");
      }
      user.email = email;
    }
    if (name) {
      user.name = name;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  toggleFavorite,
  getFavorites,
  contactHost,
  getContactedRooms,
  updateProfile,
};
