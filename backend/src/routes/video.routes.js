import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import protect from '../middlewares/auth.middleware.js';
import { uploadVideoController } from '../controllers/video.controller.js';

const router = express.Router();

router.post(
  '/',
  protect,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  uploadVideoController
);

export default router;
