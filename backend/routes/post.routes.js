const express = require("express");
const {
  createPost,
  likeUnlikePost,
  addComment,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
} = require("../controllers/post.controllers");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.post("/like/:postID", protectRoute, likeUnlikePost);
router.post("/comment/:postID", protectRoute, addComment);
router.post("/delete/:postID", protectRoute, deletePost);

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/liked", protectRoute, getLikedPosts);
router.get("/user/:user", protectRoute, getUserPosts);

//

module.exports = router;
