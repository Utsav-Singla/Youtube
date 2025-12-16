import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  uploadVideoController,
  getAllVideos,
  getVideoById
} from '../controllers/video.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Upload video (already working)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  uploadVideoController
);

// 🔥 Home Feed
router.get('/' , getAllVideos);

// Get video by ID
router.get('/:id', getVideoById);

export default router;
