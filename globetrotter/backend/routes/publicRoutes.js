import express from 'express';
import { getSharedTrip, copySharedTrip } from '../controllers/publicController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/trips/:shareId', getSharedTrip);
router.post('/trips/:shareId/copy', protect, copySharedTrip);

export default router;
