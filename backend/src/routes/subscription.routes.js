import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import { toggleSubscription,getChannelStats } from '../controllers/subscription.controller.js';

const router = express.Router();

router.post('/:channelId', protect, toggleSubscription);
router.post('/:userId/stats', protect, getChannelStats);

export default router;

