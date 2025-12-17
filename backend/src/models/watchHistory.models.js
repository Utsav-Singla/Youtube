import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },

    progress: {
      type: Number, // seconds watched
      default: 0,
    },

    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One history entry per user per video
watchHistorySchema.index(
  { user: 1, video: 1 },
  { unique: true }
);

const WatchHistory = mongoose.model(
  'WatchHistory',
  watchHistorySchema
);

export default WatchHistory;
