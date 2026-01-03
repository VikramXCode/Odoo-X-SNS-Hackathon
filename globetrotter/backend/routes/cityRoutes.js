import express from 'express';
import {
    getCities,
    searchCities,
    getPopularCities,
    getCountryList,
    getCity
} from '../controllers/cityController.js';
import { getActivitiesByCity } from '../controllers/activityController.js';

const router = express.Router();

router.get('/', getCities);
router.get('/search', searchCities);
router.get('/popular', getPopularCities);
router.get('/countries', getCountryList);
router.get('/:id', getCity);
router.get('/:id/activities', getActivitiesByCity);

export default router;
