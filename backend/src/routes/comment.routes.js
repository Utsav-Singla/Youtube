import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  addComment,
  getVideoComments,
  deleteComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/:videoId', protect, addComment);      // add
router.get('/:videoId', getVideoComments);          // read
router.delete('/:id', protect, deleteComment);      // delete

export default router;
