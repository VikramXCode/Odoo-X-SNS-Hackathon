import City from '../models/City.js';
import { demoCities, getCountries } from '../seeds/demoData.js';

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
export const getCities = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            return res.json({
                success: true,
                count: demoCities.length,
                cities: demoCities
            });
        }

        const cities = await City.find().sort({ name: 1 });

        res.json({
            success: true,
            count: cities.length,
            cities
        });
    } catch (error) {
        console.error('Get cities error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cities'
        });
    }
};

// @desc    Search cities
// @route   GET /api/cities/search
// @access  Public
export const searchCities = async (req, res) => {
    try {
        const { q, country, budget } = req.query;

        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            let results = [...demoCities];

            // Filter by search query
            if (q) {
                const query = q.toLowerCase();
                results = results.filter(city =>
                    city.name.toLowerCase().includes(query) ||
                    city.country.toLowerCase().includes(query) ||
                    city.tags?.some(tag => tag.toLowerCase().includes(query))
                );
            }

            // Filter by country
            if (country) {
                results = results.filter(city => city.country === country);
            }

            // Filter by budget (cost index)
            if (budget) {
                const budgetMap = { 'budget': [1, 2], 'moderate': [2, 3], 'comfort': [3, 4], 'luxury': [4, 5] };
                const range = budgetMap[budget.toLowerCase()];
                if (range) {
                    results = results.filter(city => city.costIndex >= range[0] && city.costIndex <= range[1]);
                }
            }

            return res.json({
                success: true,
                count: results.length,
                cities: results
            });
        }

        let query = {};

        if (q) {
            query.$text = { $search: q };
        }

        if (country) {
            query.country = country;
        }

        if (budget) {
            const budgetMap = { 'budget': { $lte: 2 }, 'moderate': { $gte: 2, $lte: 3 }, 'comfort': { $gte: 3, $lte: 4 }, 'luxury': { $gte: 4 } };
            query.costIndex = budgetMap[budget.toLowerCase()];
        }

        const cities = await City.find(query).sort({ name: 1 });

        res.json({
            success: true,
            count: cities.length,
            cities
        });
    } catch (error) {
        console.error('Search cities error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search cities'
        });
    }
};

// @desc    Get popular cities
// @route   GET /api/cities/popular
// @access  Public
export const getPopularCities = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            const popular = demoCities.filter(city => city.popular).slice(0, 6);
            return res.json({
                success: true,
                cities: popular
            });
        }

        const cities = await City.find({ popular: true }).limit(6);

        res.json({
            success: true,
            cities
        });
    } catch (error) {
        console.error('Get popular cities error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get popular cities'
        });
    }
};

// @desc    Get country list
// @route   GET /api/cities/countries
// @access  Public
export const getCountryList = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            return res.json({
                success: true,
                countries: getCountries()
            });
        }

        const countries = await City.distinct('country');

        res.json({
            success: true,
            countries: countries.sort()
        });
    } catch (error) {
        console.error('Get countries error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get countries'
        });
    }
};

// @desc    Get single city
// @route   GET /api/cities/:id
// @access  Public
export const getCity = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            const city = demoCities.find(c => c._id === req.params.id);
            if (!city) {
                return res.status(404).json({
                    success: false,
                    message: 'City not found'
                });
            }
            return res.json({
                success: true,
                city
            });
        }

        const city = await City.findById(req.params.id);

        if (!city) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }

        res.json({
            success: true,
            city
        });
    } catch (error) {
        console.error('Get city error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get city'
        });
    }
};
