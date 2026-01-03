import User from '../models/User.js';
import { demoCities } from '../seeds/demoData.js';

// Demo saved destinations storage
let demoSavedDestinations = [];

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        if (req.user.isDemo) {
            return res.json({
                success: true,
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    isDemo: true,
                    preferences: {
                        language: 'en',
                        currency: 'USD',
                        theme: 'system'
                    }
                }
            });
        }

        const user = await User.findById(req.user.id).populate('savedDestinations');

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                preferences: user.preferences,
                savedDestinations: user.savedDestinations
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;

        if (req.user.isDemo) {
            return res.json({
                success: true,
                user: {
                    ...req.user,
                    name: name || req.user.name,
                    avatar: avatar || ''
                },
                message: 'Profile updated (demo mode)'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, avatar },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// @desc    Update preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
    try {
        const { language, currency, theme } = req.body;

        if (req.user.isDemo) {
            return res.json({
                success: true,
                preferences: { language, currency, theme },
                message: 'Preferences updated (demo mode)'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                'preferences.language': language,
                'preferences.currency': currency,
                'preferences.theme': theme
            },
            { new: true }
        );

        res.json({
            success: true,
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences'
        });
    }
};

// @desc    Get saved destinations
// @route   GET /api/users/saved-destinations
// @access  Private
export const getSavedDestinations = async (req, res) => {
    try {
        if (req.user.isDemo) {
            const cities = demoCities.filter(c => demoSavedDestinations.includes(c._id));
            return res.json({
                success: true,
                destinations: cities
            });
        }

        const user = await User.findById(req.user.id).populate('savedDestinations');

        res.json({
            success: true,
            destinations: user.savedDestinations
        });
    } catch (error) {
        console.error('Get saved destinations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get saved destinations'
        });
    }
};

// @desc    Save destination
// @route   POST /api/users/saved-destinations
// @access  Private
export const saveDestination = async (req, res) => {
    try {
        const { cityId } = req.body;

        if (req.user.isDemo) {
            if (!demoSavedDestinations.includes(cityId)) {
                demoSavedDestinations.push(cityId);
            }
            const cities = demoCities.filter(c => demoSavedDestinations.includes(c._id));
            return res.json({
                success: true,
                destinations: cities,
                message: 'Destination saved (demo mode)'
            });
        }

        const user = await User.findById(req.user.id);

        if (!user.savedDestinations.includes(cityId)) {
            user.savedDestinations.push(cityId);
            await user.save();
        }

        await user.populate('savedDestinations');

        res.json({
            success: true,
            destinations: user.savedDestinations
        });
    } catch (error) {
        console.error('Save destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save destination'
        });
    }
};

// @desc    Remove saved destination
// @route   DELETE /api/users/saved-destinations/:cityId
// @access  Private
export const removeDestination = async (req, res) => {
    try {
        const { cityId } = req.params;

        if (req.user.isDemo) {
            demoSavedDestinations = demoSavedDestinations.filter(id => id !== cityId);
            const cities = demoCities.filter(c => demoSavedDestinations.includes(c._id));
            return res.json({
                success: true,
                destinations: cities,
                message: 'Destination removed (demo mode)'
            });
        }

        const user = await User.findById(req.user.id);
        user.savedDestinations = user.savedDestinations.filter(id => id.toString() !== cityId);
        await user.save();

        await user.populate('savedDestinations');

        res.json({
            success: true,
            destinations: user.savedDestinations
        });
    } catch (error) {
        console.error('Remove destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove destination'
        });
    }
};
