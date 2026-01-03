import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // In demo mode, check for demo token
        if (process.env.DEMO_MODE === 'true' && token.startsWith('demo_')) {
            const demoUserId = token.split('_')[1];
            req.user = {
                id: demoUserId,
                _id: demoUserId,
                name: demoUserId === 'admin' ? 'Admin User' : 'Demo User',
                email: demoUserId === 'admin' ? 'admin@globetrotter.com' : 'demo@globetrotter.com',
                role: demoUserId === 'admin' ? 'admin' : 'user',
                isDemo: true
            };
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next();
    }

    try {
        // Demo mode handling
        if (process.env.DEMO_MODE === 'true' && token.startsWith('demo_')) {
            const demoUserId = token.split('_')[1];
            req.user = {
                id: demoUserId,
                _id: demoUserId,
                name: demoUserId === 'admin' ? 'Admin User' : 'Demo User',
                email: demoUserId === 'admin' ? 'admin@globetrotter.com' : 'demo@globetrotter.com',
                role: demoUserId === 'admin' ? 'admin' : 'user',
                isDemo: true
            };
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
    } catch (error) {
        // Silently continue without user
    }

    next();
};
