import Video from '../models/video.models.js';

/**
 * @desc    Search videos
 * @route   GET /api/search
 * @access  Public
 */

const searchVideos = async (req, res) => {
  try {
    const query = req.query.q;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const videos = await Video.find(
      {
        $text: { $search: query },
        isPublished: true,
      },
      {
        score: { $meta: 'textScore' },
      }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .select('title thumbnailUrl views createdAt');

    const totalResults = await Video.countDocuments({
      $text: { $search: query },
      isPublished: true,
    });

    return res.status(200).json({
      success: true,
      query,
      page,
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
      videos,
    });
  } catch (error) {
    console.error('SEARCH ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Search failed',
    });
  }
};

export { searchVideos };
