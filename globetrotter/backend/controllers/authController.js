import User from '../models/User.js';

// Demo user data
const demoUsers = {
    'demo@globetrotter.com': {
        id: 'demo_user',
        _id: 'demo_user',
        name: 'Demo User',
        email: 'demo@globetrotter.com',
        password: 'demo123',
        role: 'user',
        isDemo: true,
        preferences: {
            language: 'en',
            currency: 'USD',
            theme: 'system'
        },
        savedDestinations: []
    },
    'admin@globetrotter.com': {
        id: 'demo_admin',
        _id: 'demo_admin',
        name: 'Admin User',
        email: 'admin@globetrotter.com',
        password: 'admin123',
        role: 'admin',
        isDemo: true,
        preferences: {
            language: 'en',
            currency: 'USD',
            theme: 'dark'
        },
        savedDestinations: []
    }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check demo mode
        if (process.env.DEMO_MODE === 'true') {
            return res.status(400).json({
                success: false,
                message: 'Registration is disabled in demo mode. Please use demo credentials.'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check demo mode first
        if (process.env.DEMO_MODE === 'true') {
            const demoUser = demoUsers[email.toLowerCase()];

            if (demoUser && password === demoUser.password) {
                const token = `demo_${demoUser.role === 'admin' ? 'admin' : 'user'}`;

                return res.json({
                    success: true,
                    token,
                    user: {
                        id: demoUser.id,
                        name: demoUser.name,
                        email: demoUser.email,
                        role: demoUser.role,
                        isDemo: true,
                        preferences: demoUser.preferences
                    }
                });
            }

            if (demoUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        }

        // Check for user in database
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = user.getSignedJwtToken();

        res.json({
            success: true,
            token,
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
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        // Demo user
        if (req.user.isDemo) {
            const demoUser = req.user.role === 'admin'
                ? demoUsers['admin@globetrotter.com']
                : demoUsers['demo@globetrotter.com'];

            return res.json({
                success: true,
                user: {
                    id: demoUser.id,
                    name: demoUser.name,
                    email: demoUser.email,
                    role: demoUser.role,
                    isDemo: true,
                    preferences: demoUser.preferences,
                    savedDestinations: []
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
        console.error('GetMe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile'
        });
    }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
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
                message: 'Profile updated (demo mode - changes not persisted)'
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        // For demo, just return success message
        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request'
        });
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};
