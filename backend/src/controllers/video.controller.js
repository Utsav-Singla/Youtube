import Video from '../models/video.models.js'
import Like from '../models/like.models.js';
import mongoose from 'mongoose';
/**
 * @desc    Upload video
 * @route   POST /api/videos
 * @access  Private
 */
const uploadVideoController = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (!req.files?.video?.length || !req.files?.thumbnail?.length) {
      return res.status(400).json({
        success: false,
        message: 'Video and thumbnail are required',
      });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    const video = await Video.create({
      title,
      description,
      videoUrl: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      owner: req.user._id,
      isPublished: true, // 🔥 important
    });

    return res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('VIDEO UPLOAD ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Video upload failed',
    });
  }
};

/**
 * @desc    Get all published videos (Home Feed)
 * @route   GET /api/videos
 * @access  Public
 */
const getAllVideos = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ isPublished: true })
      .populate('owner', 'name email') // only needed fields
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const totalVideos = await Video.countDocuments({
      isPublished: true,
    });

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalVideos / limit),
      totalVideos,
      videos,
    });
  } catch (error) {
    console.error('GET VIDEOS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch videos',
    });
  }
};


/**
 * @desc    Get single video (Watch Page)
 * @route   GET /api/videos/:id
 * @access  Public
 */
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔴 1. Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID',
      });
    }

    // 🔴 2. Find video and increment views atomically
    const video = await Video.findOneAndUpdate(
      { _id: id, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name email');

    // 🔴 3. Video not found or unpublished
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // 🔴 4. Success response
    return res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('GET VIDEO ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch video',
    });
  }
};



const getVideoReactions = async (req, res) => {
  try {
    const { id } = req.params;

    const likes = await Like.countDocuments({
      video: id,
      type: 'like',
    });

    const dislikes = await Like.countDocuments({
      video: id,
      type: 'dislike',
    });

    return res.status(200).json({
      success: true,
      likes,
      dislikes,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reactions',
    });
  }
};

export { uploadVideoController, getAllVideos, getVideoById, getVideoReactions };
