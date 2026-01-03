import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simple upload handler - returns a placeholder in demo mode
// In production, this would integrate with Cloudinary
router.post('/image', protect, async (req, res) => {
    try {
        // Demo mode - return placeholder
        if (process.env.DEMO_MODE === 'true') {
            return res.json({
                success: true,
                url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
                message: 'Image upload simulated (demo mode)'
            });
        }

        // TODO: Implement actual Cloudinary upload
        // const result = await cloudinary.uploader.upload(req.file.path);

        res.json({
            success: true,
            url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
            message: 'Upload endpoint - configure Cloudinary for production'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image'
        });
    }
});

export default router;
