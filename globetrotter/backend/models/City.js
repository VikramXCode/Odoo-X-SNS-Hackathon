import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    countryCode: {
        type: String,
        uppercase: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        maxlength: 500
    },
    costIndex: {
        type: Number,
        min: 1,
        max: 5,
        default: 3 // 1 = Budget, 5 = Luxury
    },
    averageDailyCost: {
        type: Number,
        default: 100
    },
    currency: {
        type: String,
        default: 'USD'
    },
    bestTimeToVisit: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    coordinates: {
        lat: Number,
        lng: Number
    },
    timezone: String,
    language: String,
    popular: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Text index for search
citySchema.index({ name: 'text', country: 'text', tags: 'text' });
citySchema.index({ country: 1 });
citySchema.index({ costIndex: 1 });
citySchema.index({ popular: 1 });

const City = mongoose.model('City', citySchema);

export default City;
