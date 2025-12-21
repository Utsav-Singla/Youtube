import mongoose from "mongoose";
import Video from "../models/video.models.js";
import WatchHistory from "../models/watchHistory.models.js";
import Subscription from "../models/subscription.models.js";

/**
 * @desc    Get personalized video recommendations
 * @route   GET /api/recommendations
 * @access  Private
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    /* --------------------------------
       1. FETCH WATCH HISTORY
    -------------------------------- */
    const watchedDocs = await WatchHistory.find({ user: userId })
      .select("video")
      .lean();

    // 🔑 Normalize ObjectIds (CRITICAL)
    const watchedVideoIds = watchedDocs.map(
      (w) => new mongoose.Types.ObjectId(w.video)
    );

    /* --------------------------------
       2. FETCH SUBSCRIPTIONS
    -------------------------------- */
    const subDocs = await Subscription.find({ subscriber: userId })
      .select("channel")
      .lean();

    const subscribedChannelIds = subDocs.map(
      (s) => new mongoose.Types.ObjectId(s.channel)
    );

    /* --------------------------------
       3. MAIN RECOMMENDATION QUERY
    -------------------------------- */
    let videos = await Video.find({
      isPublished: true,
      _id: { $nin: watchedVideoIds }, // ✅ exclude watched
      $or: [
        { owner: { $in: subscribedChannelIds } }, // subscriptions
        { views: { $gte: 5 } },                   // popularity
      ],
    })
      .sort({
        views: -1,        // popularity
        createdAt: -1,    // freshness
      })
      .limit(30)
      .populate("owner", "name")
      .lean();

    /* --------------------------------
       4. FALLBACK FOR NEW USERS
    -------------------------------- */
    if (videos.length === 0) {
      videos = await Video.find({
        isPublished: true,
        _id: { $nin: watchedVideoIds },
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("owner", "name")
        .lean();
    }

    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
};

export { getRecommendations };
