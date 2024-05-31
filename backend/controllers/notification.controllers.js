const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const getNotifications = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID });
    if (!me) throw { error: "invalid user" };

    const notifications = await Notification.find({ to: me._id })
      .sort({ createdAt: -1 })
      .populate({ path: "from", select: "username fullname profileImg" });
    await Notification.updateMany({ to: me._id }, { read: true });
    if (!notifications) throw { error: "no notifications" };

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const me = await User.findOne({ _id: req.userID });
    if (!me) throw { error: "invalid user" };

    const notifications = await Notification.deleteMany({
      to: me._id,
      read: true,
    });
    res
      .status(200)
      .json({ message: "notifications deleted successfully", notifications });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { getNotifications, deleteNotifications };
