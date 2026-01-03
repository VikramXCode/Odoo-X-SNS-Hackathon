import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { demoTrips, demoCities, demoActivities } from '../seeds/demoData.js';

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            return res.json({
                success: true,
                analytics: {
                    users: {
                        total: 156,
                        newThisMonth: 23
                    },
                    trips: {
                        total: demoTrips.length + 89,
                        thisMonth: 12,
                        averageDuration: 8,
                        averageBudget: 2500
                    },
                    tripsByStatus: {
                        draft: 25,
                        planned: 45,
                        ongoing: 12,
                        completed: 55,
                        cancelled: 5
                    },
                    popularDestinations: demoCities.slice(0, 10).map((city, i) => ({
                        city: city.name,
                        country: city.country,
                        count: 50 - i * 4
                    })),
                    tripsTrend: [
                        { month: 'Aug', count: 15 },
                        { month: 'Sep', count: 22 },
                        { month: 'Oct', count: 28 },
                        { month: 'Nov', count: 19 },
                        { month: 'Dec', count: 25 },
                        { month: 'Jan', count: 31 }
                    ],
                    content: {
                        cities: demoCities.length,
                        activities: demoActivities.length
                    }
                }
            });
        }

        // Real analytics from database
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalUsers = await User.countDocuments();
        const newUsers = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

        const totalTrips = await Trip.countDocuments();
        const tripsThisMonth = await Trip.countDocuments({ createdAt: { $gte: startOfMonth } });

        const tripStats = await Trip.aggregate([
            {
                $group: {
                    _id: null,
                    avgDuration: { $avg: { $subtract: ['$endDate', '$startDate'] } },
                    avgBudget: { $avg: '$totalBudget' }
                }
            }
        ]);

        const tripsByStatus = await Trip.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            analytics: {
                users: { total: totalUsers, newThisMonth: newUsers },
                trips: {
                    total: totalTrips,
                    thisMonth: tripsThisMonth,
                    averageDuration: tripStats[0]?.avgDuration ? Math.ceil(tripStats[0].avgDuration / (1000 * 60 * 60 * 24)) : 0,
                    averageBudget: Math.round(tripStats[0]?.avgBudget || 0)
                },
                tripsByStatus: tripsByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get analytics'
        });
    }
};

// Demo users for admin panel
const demoUsersList = [
    { id: 'user_1', name: 'John Traveler', email: 'john@example.com', role: 'user', tripCount: 5, createdAt: '2025-06-15' },
    { id: 'user_2', name: 'Sarah Explorer', email: 'sarah@example.com', role: 'user', tripCount: 8, createdAt: '2025-08-20' },
    { id: 'user_3', name: 'Mike Adventurer', email: 'mike@example.com', role: 'user', tripCount: 3, createdAt: '2025-10-05' },
    { id: 'user_4', name: 'Emily Wanderer', email: 'emily@example.com', role: 'user', tripCount: 12, createdAt: '2025-04-10' },
    { id: 'user_5', name: 'Demo User', email: 'demo@globetrotter.com', role: 'user', tripCount: 3, createdAt: '2025-01-01' },
    { id: 'admin_1', name: 'Admin User', email: 'admin@globetrotter.com', role: 'admin', tripCount: 0, createdAt: '2025-01-01' }
];

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;

        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            let users = [...demoUsersList];

            if (search) {
                const query = search.toLowerCase();
                users = users.filter(u =>
                    u.name.toLowerCase().includes(query) ||
                    u.email.toLowerCase().includes(query)
                );
            }

            if (role && role !== 'all') {
                users = users.filter(u => u.role === role);
            }

            return res.json({
                success: true,
                count: users.length,
                users
            });
        }

        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role && role !== 'all') {
            query.role = role;
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users'
        });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const { role } = req.body;

        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            const user = demoUsersList.find(u => u.id === req.params.id);
            if (user) {
                user.role = role;
            }
            return res.json({
                success: true,
                user,
                message: 'User updated (demo mode)'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            return res.json({
                success: true,
                message: 'User deleted (demo mode - not actually deleted)'
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Also delete user's trips
        await Trip.deleteMany({ user: req.params.id });

        res.json({
            success: true,
            message: 'User and associated trips deleted'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};
