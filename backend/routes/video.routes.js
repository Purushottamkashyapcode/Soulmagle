// routes/video.routes.js
import express from 'express';
import { startVideoCall, endVideoCall } from '../controllers/video.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/start', authenticateToken, startVideoCall);
router.post('/end', authenticateToken, endVideoCall);

export default router;
