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
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const skip = (page - 1) * limit;

    /* WATCHED VIDEOS */
    const watchedDocs = await WatchHistory.find({ user: userId })
      .select("video")
      .lean();

    const watchedVideoIds = watchedDocs.map(
      (w) => new mongoose.Types.ObjectId(w.video)
    );

    /* SUBSCRIPTIONS */
    const subs = await Subscription.find({ subscriber: userId })
      .select("channel")
      .lean();

    const subscribedChannelIds = subs.map(
      (s) => new mongoose.Types.ObjectId(s.channel)
    );

    /* MAIN QUERY */
    const videos = await Video.find({
      isPublished: true,
      _id: { $nin: watchedVideoIds },
      $or: [
        { owner: { $in: subscribedChannelIds } },
        { views: { $gte: 5 } },
      ],
    })
      .sort({ views: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "name")
      .lean();

    const hasMore = videos.length === limit;

    return res.status(200).json({
      success: true,
      page,
      hasMore,
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
