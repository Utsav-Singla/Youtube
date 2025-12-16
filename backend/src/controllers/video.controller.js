import Video from '../models/video.models.js';

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
      title: title.trim(),
      description: description?.trim() || '',
      videoUrl: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      owner: req.user._id,
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

export { uploadVideoController };
