import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  updateWatchHistory,
  getWatchHistory,
} from '../controllers/watchHistory.controller.js';

const router = express.Router();

router.post('/:videoId', protect, updateWatchHistory);
router.get('/', protect, getWatchHistory);

export default router;
