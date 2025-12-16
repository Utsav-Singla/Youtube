import express from 'express';
import {
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  registerUser } 
from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logoutUser);


export default router;
