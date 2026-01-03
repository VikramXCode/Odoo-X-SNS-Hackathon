import express from 'express';
import {
    searchActivities,
    getCategories,
    getActivity
} from '../controllers/activityController.js';

const router = express.Router();

router.get('/search', searchActivities);
router.get('/categories', getCategories);
router.get('/:id', getActivity);

export default router;
