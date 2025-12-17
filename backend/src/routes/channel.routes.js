import express from 'express';
import { getChannel } from '../controllers/channel.controller.js';

const router = express.Router();

router.get('/:userId', getChannel);

export default router;
