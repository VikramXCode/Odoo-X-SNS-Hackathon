import express from 'express';
import {
    getAnalytics,
    getUsers,
    updateUser,
    deleteUser
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
