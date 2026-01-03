import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    },
    name: {
        type: String,
        required: true
    },
    category: String,
    duration: Number, // in hours
    cost: {
        type: Number,
        default: 0
    },
    scheduledTime: String, // e.g., "09:00"
    notes: String
});

const stopSchema = new mongoose.Schema({
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    cityName: {
        type: String,
        required: true
    },
    country: String,
    arrivalDate: {
        type: Date,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    accommodation: {
        name: String,
        cost: {
            type: Number,
            default: 0
        }
    },
    transport: {
        type: {
            type: String,
            enum: ['flight', 'train', 'bus', 'car', 'ferry', 'none'],
            default: 'none'
        },
        cost: {
            type: Number,
            default: 0
        }
    },
    activities: [activitySchema],
    order: {
        type: Number,
        required: true
    }
});

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a trip name'],
        trim: true,
        maxlength: [100, 'Trip name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    coverImage: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        required: [true, 'Please provide a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date']
    },
    status: {
        type: String,
        enum: ['draft', 'planned', 'ongoing', 'completed', 'cancelled'],
        default: 'draft'
    },
    budget: {
        food: {
            type: Number,
            default: 0
        },
        miscellaneous: {
            type: Number,
            default: 0
        }
    },
    stops: [stopSchema],
    isPublic: {
        type: Boolean,
        default: false
    },
    shareId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for trip duration
tripSchema.virtual('duration').get(function () {
    if (!this.startDate || !this.endDate) return 0;
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

// Virtual for total destinations
tripSchema.virtual('destinationCount').get(function () {
    return this.stops ? this.stops.length : 0;
});

// Virtual for total budget
tripSchema.virtual('totalBudget').get(function () {
    let total = (this.budget?.food || 0) + (this.budget?.miscellaneous || 0);

    if (this.stops) {
        this.stops.forEach(stop => {
            total += stop.accommodation?.cost || 0;
            total += stop.transport?.cost || 0;
            if (stop.activities) {
                stop.activities.forEach(activity => {
                    total += activity.cost || 0;
                });
            }
        });
    }

    return total;
});

// Virtual for accommodation total
tripSchema.virtual('accommodationTotal').get(function () {
    if (!this.stops) return 0;
    return this.stops.reduce((total, stop) => total + (stop.accommodation?.cost || 0), 0);
});

// Virtual for transport total
tripSchema.virtual('transportTotal').get(function () {
    if (!this.stops) return 0;
    return this.stops.reduce((total, stop) => total + (stop.transport?.cost || 0), 0);
});

// Virtual for activities total
tripSchema.virtual('activitiesTotal').get(function () {
    if (!this.stops) return 0;
    return this.stops.reduce((total, stop) => {
        if (!stop.activities) return total;
        return total + stop.activities.reduce((actTotal, act) => actTotal + (act.cost || 0), 0);
    }, 0);
});

// Index for efficient queries
tripSchema.index({ user: 1, status: 1 });
tripSchema.index({ shareId: 1 });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
