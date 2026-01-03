import Activity from '../models/Activity.js';
import { demoActivities, getActivityCategories } from '../seeds/demoData.js';

// @desc    Search activities
// @route   GET /api/activities/search
// @access  Public
export const searchActivities = async (req, res) => {
    try {
        const { q, city, category, minCost, maxCost } = req.query;

        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            let results = [...demoActivities];

            // Filter by search query
            if (q) {
                const query = q.toLowerCase();
                results = results.filter(act =>
                    act.name.toLowerCase().includes(query) ||
                    act.cityName.toLowerCase().includes(query)
                );
            }

            // Filter by city
            if (city) {
                results = results.filter(act => act.cityName.toLowerCase() === city.toLowerCase());
            }

            // Filter by category
            if (category) {
                results = results.filter(act => act.category === category);
            }

            // Filter by cost
            if (minCost) {
                results = results.filter(act => act.estimatedCost >= parseInt(minCost));
            }
            if (maxCost) {
                results = results.filter(act => act.estimatedCost <= parseInt(maxCost));
            }

            return res.json({
                success: true,
                count: results.length,
                activities: results
            });
        }

        let query = {};

        if (q) {
            query.$text = { $search: q };
        }

        if (city) {
            query.cityName = { $regex: city, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (minCost || maxCost) {
            query.estimatedCost = {};
            if (minCost) query.estimatedCost.$gte = parseInt(minCost);
            if (maxCost) query.estimatedCost.$lte = parseInt(maxCost);
        }

        const activities = await Activity.find(query).sort({ rating: -1 });

        res.json({
            success: true,
            count: activities.length,
            activities
        });
    } catch (error) {
        console.error('Search activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search activities'
        });
    }
};

// @desc    Get activity categories
// @route   GET /api/activities/categories
// @access  Public
export const getCategories = async (req, res) => {
    res.json({
        success: true,
        categories: getActivityCategories()
    });
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
export const getActivity = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            const activity = demoActivities.find(a => a._id === req.params.id);
            if (!activity) {
                return res.status(404).json({
                    success: false,
                    message: 'Activity not found'
                });
            }
            return res.json({
                success: true,
                activity
            });
        }

        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        res.json({
            success: true,
            activity
        });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get activity'
        });
    }
};

// @desc    Get activities by city
// @route   GET /api/cities/:id/activities
// @access  Public
export const getActivitiesByCity = async (req, res) => {
    try {
        const { cityName } = req.query;

        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            const activities = demoActivities.filter(a =>
                a.cityName.toLowerCase() === cityName?.toLowerCase()
            );
            return res.json({
                success: true,
                activities
            });
        }

        const activities = await Activity.find({
            cityName: { $regex: cityName, $options: 'i' }
        }).sort({ rating: -1 });

        res.json({
            success: true,
            activities
        });
    } catch (error) {
        console.error('Get activities by city error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get activities'
        });
    }
};
