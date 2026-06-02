const express = require("express");
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getHostListings,
} = require("../controllers/roomController");
const { protect, authorize } = require("../middleware/authMiddleware");
// Public routes
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
// Protected routes (Host only)
router.post("/", protect, authorize("host"), createRoom);
router.get("/host/listings", protect, authorize("host"), getHostListings);
router.put("/:id", protect, authorize("host"), updateRoom);
router.delete("/:id", protect, authorize("host"), deleteRoom);
module.exports = router;
