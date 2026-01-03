import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    cityName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'sightseeing',
            'food',
            'adventure',
            'culture',
            'nightlife',
            'shopping',
            'nature',
            'relaxation',
            'entertainment'
        ],
        default: 'sightseeing'
    },
    image: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // in hours
        default: 2
    },
    estimatedCost: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    address: String,
    openingHours: String,
    tips: String,
    tags: [String]
}, {
    timestamps: true
});

// Text index for search
activitySchema.index({ name: 'text', description: 'text', cityName: 'text' });
activitySchema.index({ city: 1 });
activitySchema.index({ category: 1 });
activitySchema.index({ cityName: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
