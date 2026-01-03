import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Skip connection in demo mode if no MongoDB URI
        if (process.env.DEMO_MODE === 'true' && !process.env.MONGODB_URI) {
            console.log('🎭 Running in DEMO MODE without database');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Modern Mongoose doesn't need these options, but keeping for compatibility
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        // In demo mode, don't exit on connection failure
        if (process.env.DEMO_MODE === 'true') {
            console.log('🎭 Continuing in DEMO MODE without database');
            return;
        }

        process.exit(1);
    }
};

export default connectDB;
