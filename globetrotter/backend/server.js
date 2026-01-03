import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

// Set DEMO_MODE to true by default if not specified
if (process.env.DEMO_MODE === undefined) {
    process.env.DEMO_MODE = 'true';
}

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'GlobeTrotter API is running',
        demoMode: process.env.DEMO_MODE === 'true'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`
🌍 GlobeTrotter API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: ${PORT}
🔧 Mode: ${process.env.NODE_ENV || 'development'}
🎭 Demo: ${process.env.DEMO_MODE === 'true' ? 'Enabled' : 'Disabled'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;
