import Like from '../models/like.models.js';
import Video from '../models/video.models.js';

/**
 * @desc    Like or dislike a video (toggle)
 * @route   POST /api/likes/:videoId
 * @access  Private
 */
const toggleLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { type } = req.body; // like | dislike

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type',
      });
    }

    // Ensure video exists
    const videoExists = await Video.exists({ _id: videoId });
    if (!videoExists) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    const existingReaction = await Like.findOne({
      user: req.user._id,
      video: videoId,
    });

    // Case 1: Same reaction → remove (toggle off)
    if (existingReaction && existingReaction.type === type) {
      await existingReaction.deleteOne();
      return res.status(200).json({
        success: true,
        message: `${type} removed`,
      });
    }

    // Case 2: Different reaction → update
    if (existingReaction) {
      existingReaction.type = type;
      await existingReaction.save();
      return res.status(200).json({
        success: true,
        message: `${type} updated`,
      });
    }

    // Case 3: New reaction
    await Like.create({
      user: req.user._id,
      video: videoId,
      type,
    });

    return res.status(201).json({
      success: true,
      message: `${type} added`,
    });
  } catch (error) {
    console.error('LIKE ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to react',
    });
  }
};


export { toggleLike };
