import express from 'express';
import { getUserProfile, findMatch, updateProfile } from '../controllers/user.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);  // Ensure this route exists
router.post('/find-match', authenticateToken, findMatch);
router.put('/profile', authenticateToken, updateProfile);

export default router;
