import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import { toggleLike } from '../controllers/like.controller.js';

const router = express.Router();

router.post('/:videoId', protect, toggleLike);

export default router;
