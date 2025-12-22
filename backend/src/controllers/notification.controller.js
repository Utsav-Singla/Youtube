import Notification from "../models/notification.models.js";

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("video", "title thumbnailUrl")
      .populate("channel", "name");

    return res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("NOTIFICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications",
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("UNREAD COUNT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    });
  }
};


export { getNotifications, markAsRead, getUnreadCount };
