import express from 'express';
import {
    getTrips,
    getTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    addStop,
    deleteStop,
    addActivity,
    deleteActivity,
    getItinerary,
    getBudget,
    getCalendar,
    shareTrip
} from '../controllers/tripController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Trip CRUD
router.get('/', protect, getTrips);
router.post('/', protect, createTrip);
router.get('/:id', protect, getTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

// Trip features
router.get('/:id/itinerary', protect, getItinerary);
router.get('/:id/budget', protect, getBudget);
router.get('/:id/calendar', protect, getCalendar);
router.post('/:id/share', protect, shareTrip);

// Stops
router.post('/:id/stops', protect, addStop);
router.delete('/:id/stops/:stopId', protect, deleteStop);

// Activities
router.post('/:id/stops/:stopId/activities', protect, addActivity);
router.delete('/:id/stops/:stopId/activities/:actId', protect, deleteActivity);

export default router;
