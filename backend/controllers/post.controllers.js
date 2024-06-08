const Post = require("../models/post.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");

const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcryptjs");

const createPost = async (req, res) => {
  try {
    const { text, picture } = req.body;
    if (!text && !picture) throw new Error("cannot create empty post");

    let pictureURL = "";
    if (picture) {
      await cloudinary.uploader
        .upload(picture)
        .then((result) => (pictureURL = result.secure_url))
        .catch((error) => {
          throw error;
        });
    }

    let me = await User.findOne({ _id: req.userID });

    const post = await Post.create({
      owner: me._id,
      text,
      picture: pictureURL,
    });
    me.createdPosts.push(post._id);
    await me.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeUnlikePost = async (req, res) => {
  const me = await User.findOne({ _id: req.userID });
  let post = await Post.findOne({ _id: req.params.postID }).catch((error) => {
    console.log(error.message);
  });

  try {
    if (!post) throw (error = { message: "this post doesn't exits!!" });

    let isLiked = post.likedBy?.includes(me._id);

    if (isLiked) {
      me.likedPosts.pop(post._id);
      await me.save();
      post.likedBy.pop(me._id);
      await post.save();

      const updatedLikes = post.likedBy.filter((id) => {
        id.toString() !== me._id.toString();
      });
      res.status(200).json({ updatedLikes });
    } else {
      me.likedPosts.push(post._id);
      await me.save();
      post.likedBy.push(me._id);
      await post.save();

      // no notification when liking own post
      if (!me._id.toString() === post.owner.toString()) {
        const noti = await Notification.create({
          from: me._id,
          to: post.owner,
          type: "like",
        });
      }

      const updatedLikes = post.likedBy;
      res.status(200).json({ updatedLikes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const me = await User.findOne({ _id: req.userID });
    let post = await Post.findOne({ _id: req.params.postID });
    post.comments.push({ text, user: me._id });
    await post.save();

    const noti = await Notification.create({
      from: me._id,
      to: post.owner,
      type: "comment",
    });

    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error at addComment" });
  }
};

const deletePost = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID });
    if (!me) throw { error: "invlaid user" };

    const post = await Post.findOne({ _id: req.params.postID });
    if (!post) throw new Error("this post does not exist");

    if (!post.owner.toString() === me._id.toString())
      throw { error: "this post is not yours" };

    me.createdPosts.pop(post._id); //remove post from owner
    await me.save();

    if (post.picture) {
      await cloudinary.uploader.destroy(
        post.picture.split("/").pop().split(".")[0]
      );
    }
    await Post.deleteOne({ _id: post._id }); //remove post from postModel

    res.status(200).json({ message: "post deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID });
    if (!me) throw { error: "invlaid user" };

    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "owner", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (!allPosts) throw { error: "no allPosts" };

    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID });
    if (!me) throw { error: "invlaid user" };

    const likedPosts = await User.findOne({ _id: me._id })
      .populate("likedPosts")
      .select("likedPosts");
    if (!likedPosts) throw { error: "no likedPosts" };

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID });
    if (!me) throw { error: "invlaid user" };

    const followingPosts = await Post.find({
      owner: { $in: me.following },
    })
      .sort({ createdAt: -1 })
      .populate({ path: "owner", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (!followingPosts) throw { error: "no followingPosts" };

    res.status(200).json(followingPosts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID });
    if (!me) throw { error: "invlaid user" };

    const userPosts = await User.findOne({ _id: req.params.user })
      .select("createdPosts")
      .populate({ path: "createdPosts" })
      .sort("createdAt");

    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createPost,
  likeUnlikePost,
  addComment,
  deletePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
};
