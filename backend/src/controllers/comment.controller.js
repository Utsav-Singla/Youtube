import mongoose from 'mongoose';
import Comment from '../models/comment.models.js';
import Video from '../models/video.models.js';

/**
 * @desc    Add comment to a video
 * @route   POST /api/comments/:videoId
 * @access  Private
 */
const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

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

    const comment = await Comment.create({
      text: text.trim(),
      video: videoId,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error('ADD COMMENT ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add comment',
    });
  }
};


/**
 * @desc    Get comments for a video
 * @route   GET /api/comments/:videoId
 * @access  Public
 */
const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID',
      });
    }

    const comments = await Comment.find({ video: videoId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
    });
  }
};

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
    });
  }
};

export { addComment, getVideoComments, deleteComment }; 