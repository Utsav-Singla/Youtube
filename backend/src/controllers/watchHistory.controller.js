import mongoose from 'mongoose';
import WatchHistory from '../models/watchHistory.models.js';
import Video from '../models/video.models.js';

/**
 * @desc    Add / update watch history
 * @route   POST /api/history/:videoId
 * @access  Private
 */

const updateWatchHistory = async (req, res) => {
  try {
    const { videoId } = req.params;

    // ✅ SAFE DESTRUCTURING
    const progress = Number(req.body?.progress || 0);

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID',
      });
    }

    const videoExists = await Video.exists({
      _id: videoId,
      isPublished: true,
    });

    if (!videoExists) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    const history = await WatchHistory.findOneAndUpdate(
      {
        user: req.user._id,
        video: videoId,
      },
      {
        progress,
        lastWatchedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('WATCH HISTORY ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update watch history',
    });
  }
};


/**
 * @desc    Get user watch history
 * @route   GET /api/history
 * @access  Private
 */
const getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({
      user: req.user._id,
    })
      .populate('video', 'title thumbnailUrl duration')
      .sort({ lastWatchedAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch watch history',
    });
  }
};

export { updateWatchHistory, getWatchHistory };
