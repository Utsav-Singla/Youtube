import mongoose from 'mongoose';
import User from '../models/user.models.js';
import Video from '../models/video.models.js';

/**
 * @desc    Get channel details + uploaded videos
 * @route   GET /api/channels/:userId
 * @access  Public
 */
const getChannel = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔴 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    // 🔴 Fetch channel info
    const channel = await User.findById(userId).select(
      'name email createdAt'
    );

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    // 🔴 Fetch uploaded videos
    const videos = await Video.find({
      owner: userId,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .select('title thumbnailUrl views createdAt');

    return res.status(200).json({
      success: true,
      channel,
      videos,
    });
  } catch (error) {
    console.error('CHANNEL ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch channel',
    });
  }
};

export { getChannel };
