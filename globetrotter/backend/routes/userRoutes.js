import express from 'express';
import {
    getProfile,
    updateUserProfile,
    updatePreferences,
    getSavedDestinations,
    saveDestination,
    removeDestination
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/preferences', protect, updatePreferences);
router.get('/saved-destinations', protect, getSavedDestinations);
router.post('/saved-destinations', protect, saveDestination);
router.delete('/saved-destinations/:cityId', protect, removeDestination);

export default router;
