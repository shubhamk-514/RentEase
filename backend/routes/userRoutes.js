const express = require("express");
const router = express.Router();
const {
  toggleFavorite,
  getFavorites,
  contactHost,
  getContactedRooms,
  updateProfile,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");
// Favorites (Tenant only)
router.post("/favorites/:roomId", protect, authorize("tenant"), toggleFavorite);
router.get("/favorites", protect, authorize("tenant"), getFavorites);
// Contact listings (Tenant only)
router.post("/contact/:roomId", protect, authorize("tenant"), contactHost);
router.get("/contacted", protect, authorize("tenant"), getContactedRooms);
// Profile actions (Both roles)
router.put("/profile", protect, updateProfile);
module.exports = router;
