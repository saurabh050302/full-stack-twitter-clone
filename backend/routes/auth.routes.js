const {
  getMe,
  signup,
  login,
  logout,
} = require("../controllers/auth.controllers");
const protectRoute = require("../middlewares/protectRoute");

const express = require("express");
const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
