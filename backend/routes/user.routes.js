const express = require("express");
const {
  getUserProfile,
  getSuggestedProfiles,
  followUnfollowUser,
  updateUserProfile,
  changePassword,
} = require("../controllers/user.controllers");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow", protectRoute, followUnfollowUser);
router.get("/suggested", protectRoute, getSuggestedProfiles);
router.post("/update", protectRoute, updateUserProfile);
router.post("/changepassword", protectRoute, changePassword);

module.exports = router;
