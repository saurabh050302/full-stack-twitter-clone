const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

const User = require("../models/user.model");
const Notification = require("../models/notification.model");

const getUserProfile = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "getUserProfile failed" });
  }
};

const followUnfollowUser = async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findOne({ _id: id }).select("-password");
    const me = await User.findOne({ _id: req.userID }).select("-password");

    if (String(me._id) === String(user._id)) {
      console.log("you cannot folloow yourself");
      throw error;
    }

    if (user) {
      if (me.following.indexOf(user._id) === -1) {
        user.followers.push(me._id);
        await user.save();
        me.following.push(user._id);
        await me.save();
        const newNotification = await Notification.create({
          from: me._id,
          to: user._id,
          type: "follow",
        });
        // TODO : response
        res.status(200).json(user);
      } else {
        user.followers.pop(me._id);
        await user.save();
        me.following.pop(user._id);
        await me.save();
        res.status(200).json(user);
      }
    } else {
      res.status(400).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "followUnfollowUser failed" });
  }
};

const getSuggestedProfiles = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID }).select("-password");
    const usersFollowedByMe = me.following;
    const excludedUsers = [...usersFollowedByMe, me._id];

    const allUsers = await User.find();
    const suggestedUsers = await User.find({ _id: { $nin: excludedUsers } })
      .limit(4)
      .select("-password");
    // console.log(suggestedUsers);
    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  let newData = req.body.formData;
  let { profileImg, coverImg } = req.body;
  let me = await User.findOne({ _id: req.userID });

  try {
    if (profileImg) {
      if (me.profileImg) {
        await cloudinary.uploader.destroy(
          me.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      me.profileImg = uploadedResponse.secure_url;
      await me.save();
    }

    if (coverImg) {
      if (me.coverImg) {
        await cloudinary.uploader.destroy(
          me.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      me.coverImg = uploadedResponse.secure_url;
      await me.save();
    }

    if (!newData) return res.status(200).json(me);

    const result = await bcrypt.compare(newData.currentPassword, me.password);
    if (result) {
      newData.currentPassword = me.password;
      newData.followers = me.followers;
      newData.following = me.following;

      await User.findOneAndUpdate({ _id: req.userID }, newData);
      const user = await User.findOne({ _id: req.userID }).select("-password");
      res.status(200).json(user);
    } else {
      throw { error: "wrong password :?" };
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!newPassword === confirmNewPassword)
    return res.status(400).json({ error: "new password do not match" });
  try {
    let me = await User.findOne({ _id: req.userID });
    const result = await bcrypt.compare(currentPassword, me.password);
    if (result) {
      bcrypt.hash(newPassword, 10, async (err, hash) => {
        if (err) res.status(400).json({ error: err.message });
        await User.findOneAndUpdate({ _id: req.userID }, { password: hash });
        res.status(200).json({ message: "password updated" });
      });
    } else {
      res.status(400).json({ error: "wrong password" });
    }
  } catch {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  followUnfollowUser,
  getSuggestedProfiles,
  updateUserProfile,
  changePassword,
};
