import Trip from '../models/Trip.js';
import { v4 as uuidv4 } from 'uuid';
import { demoTrips } from '../seeds/demoData.js';

// @desc    Get all trips for user
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req, res) => {
    try {
        const { status } = req.query;

        // Demo mode
        if (req.user.isDemo) {
            let trips = [...demoTrips];
            if (status && status !== 'all') {
                trips = trips.filter(t => t.status === status);
            }
            return res.json({
                success: true,
                count: trips.length,
                trips
            });
        }

        let query = { user: req.user.id };
        if (status && status !== 'all') {
            query.status = status;
        }

        const trips = await Trip.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: trips.length,
            trips
        });
    } catch (error) {
        console.error('Get trips error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get trips'
        });
    }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
export const getTrip = async (req, res) => {
    try {
        // Demo mode
        if (req.user.isDemo) {
            const trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }
            return res.json({
                success: true,
                trip
            });
        }

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        console.error('Get trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get trip'
        });
    }
};

// @desc    Create trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
    try {
        const { name, description, coverImage, startDate, endDate, budget } = req.body;

        // Demo mode
        if (req.user.isDemo) {
            const newTrip = {
                _id: `demo_trip_${Date.now()}`,
                id: `demo_trip_${Date.now()}`,
                user: req.user.id,
                name,
                description: description || '',
                coverImage: coverImage || '',
                startDate,
                endDate,
                status: 'draft',
                budget: budget || { food: 0, miscellaneous: 0 },
                stops: [],
                isPublic: false,
                createdAt: new Date().toISOString()
            };

            demoTrips.unshift(newTrip);

            return res.status(201).json({
                success: true,
                trip: newTrip,
                message: 'Trip created (demo mode)'
            });
        }

        const trip = await Trip.create({
            user: req.user.id,
            name,
            description,
            coverImage,
            startDate,
            endDate,
            budget
        });

        res.status(201).json({
            success: true,
            trip
        });
    } catch (error) {
        console.error('Create trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create trip',
            error: error.message
        });
    }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res) => {
    try {
        const { name, description, coverImage, startDate, endDate, status, budget } = req.body;

        // Demo mode
        if (req.user.isDemo) {
            const tripIndex = demoTrips.findIndex(t => t._id === req.params.id || t.id === req.params.id);
            if (tripIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            demoTrips[tripIndex] = {
                ...demoTrips[tripIndex],
                name: name || demoTrips[tripIndex].name,
                description: description !== undefined ? description : demoTrips[tripIndex].description,
                coverImage: coverImage !== undefined ? coverImage : demoTrips[tripIndex].coverImage,
                startDate: startDate || demoTrips[tripIndex].startDate,
                endDate: endDate || demoTrips[tripIndex].endDate,
                status: status || demoTrips[tripIndex].status,
                budget: budget || demoTrips[tripIndex].budget
            };

            return res.json({
                success: true,
                trip: demoTrips[tripIndex],
                message: 'Trip updated (demo mode)'
            });
        }

        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name, description, coverImage, startDate, endDate, status, budget },
            { new: true, runValidators: true }
        );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        console.error('Update trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update trip'
        });
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res) => {
    try {
        // Demo mode
        if (req.user.isDemo) {
            const tripIndex = demoTrips.findIndex(t => t._id === req.params.id || t.id === req.params.id);
            if (tripIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            demoTrips.splice(tripIndex, 1);

            return res.json({
                success: true,
                message: 'Trip deleted (demo mode)'
            });
        }

        const trip = await Trip.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip deleted'
        });
    } catch (error) {
        console.error('Delete trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete trip'
        });
    }
};

// @desc    Add stop to trip
// @route   POST /api/trips/:id/stops
// @access  Private
export const addStop = async (req, res) => {
    try {
        const { cityId, cityName, country, arrivalDate, departureDate, accommodation, transport } = req.body;

        // Demo mode
        if (req.user.isDemo) {
            const trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            const newStop = {
                _id: `demo_stop_${Date.now()}`,
                city: cityId,
                cityName,
                country,
                arrivalDate,
                departureDate,
                accommodation: accommodation || { name: '', cost: 0 },
                transport: transport || { type: 'none', cost: 0 },
                activities: [],
                order: trip.stops.length
            };

            trip.stops.push(newStop);

            return res.status(201).json({
                success: true,
                trip,
                stop: newStop,
                message: 'Stop added (demo mode)'
            });
        }

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        const newStop = {
            city: cityId,
            cityName,
            country,
            arrivalDate,
            departureDate,
            accommodation: accommodation || {},
            transport: transport || {},
            activities: [],
            order: trip.stops.length
        };

        trip.stops.push(newStop);
        await trip.save();

        res.status(201).json({
            success: true,
            trip,
            stop: trip.stops[trip.stops.length - 1]
        });
    } catch (error) {
        console.error('Add stop error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add stop'
        });
    }
};

// @desc    Delete stop from trip
// @route   DELETE /api/trips/:id/stops/:stopId
// @access  Private
export const deleteStop = async (req, res) => {
    try {
        // Demo mode
        if (req.user.isDemo) {
            const trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            const stopIndex = trip.stops.findIndex(s => s._id === req.params.stopId);
            if (stopIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Stop not found'
                });
            }

            trip.stops.splice(stopIndex, 1);

            // Reorder remaining stops
            trip.stops.forEach((stop, index) => {
                stop.order = index;
            });

            return res.json({
                success: true,
                trip,
                message: 'Stop deleted (demo mode)'
            });
        }

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        trip.stops = trip.stops.filter(s => s._id.toString() !== req.params.stopId);

        // Reorder remaining stops
        trip.stops.forEach((stop, index) => {
            stop.order = index;
        });

        await trip.save();

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        console.error('Delete stop error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete stop'
        });
    }
};

// @desc    Add activity to stop
// @route   POST /api/trips/:id/stops/:stopId/activities
// @access  Private
export const addActivity = async (req, res) => {
    try {
        const { activityId, name, category, duration, cost, scheduledTime, notes } = req.body;

        // Demo mode
        if (req.user.isDemo) {
            const trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            const stop = trip.stops.find(s => s._id === req.params.stopId);
            if (!stop) {
                return res.status(404).json({
                    success: false,
                    message: 'Stop not found'
                });
            }

            const newActivity = {
                _id: `demo_activity_${Date.now()}`,
                activityId,
                name,
                category,
                duration,
                cost: cost || 0,
                scheduledTime,
                notes
            };

            stop.activities.push(newActivity);

            return res.status(201).json({
                success: true,
                trip,
                activity: newActivity,
                message: 'Activity added (demo mode)'
            });
        }

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        const stop = trip.stops.id(req.params.stopId);
        if (!stop) {
            return res.status(404).json({
                success: false,
                message: 'Stop not found'
            });
        }

        stop.activities.push({
            activityId,
            name,
            category,
            duration,
            cost: cost || 0,
            scheduledTime,
            notes
        });

        await trip.save();

        res.status(201).json({
            success: true,
            trip,
            activity: stop.activities[stop.activities.length - 1]
        });
    } catch (error) {
        console.error('Add activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add activity'
        });
    }
};

// @desc    Delete activity from stop
// @route   DELETE /api/trips/:id/stops/:stopId/activities/:actId
// @access  Private
export const deleteActivity = async (req, res) => {
    try {
        // Demo mode
        if (req.user.isDemo) {
            const trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            const stop = trip.stops.find(s => s._id === req.params.stopId);
            if (!stop) {
                return res.status(404).json({
                    success: false,
                    message: 'Stop not found'
                });
            }

            const actIndex = stop.activities.findIndex(a => a._id === req.params.actId);
            if (actIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Activity not found'
                });
            }

            stop.activities.splice(actIndex, 1);

            return res.json({
                success: true,
                trip,
                message: 'Activity deleted (demo mode)'
            });
        }

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        const stop = trip.stops.id(req.params.stopId);
        if (!stop) {
            return res.status(404).json({
                success: false,
                message: 'Stop not found'
            });
        }

        stop.activities = stop.activities.filter(a => a._id.toString() !== req.params.actId);
        await trip.save();

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete activity'
        });
    }
};

// @desc    Get trip itinerary
// @route   GET /api/trips/:id/itinerary
// @access  Private
export const getItinerary = async (req, res) => {
    try {
        let trip;

        if (req.user.isDemo) {
            trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
        } else {
            trip = await Trip.findOne({
                _id: req.params.id,
                user: req.user.id
            });
        }

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        // Format itinerary by day
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        const days = [];

        let currentDate = new Date(startDate);
        let dayNumber = 1;

        while (currentDate <= endDate) {
            const dayStr = currentDate.toISOString().split('T')[0];

            const dayStops = trip.stops.filter(stop => {
                const arrival = new Date(stop.arrivalDate).toISOString().split('T')[0];
                const departure = new Date(stop.departureDate).toISOString().split('T')[0];
                return dayStr >= arrival && dayStr <= departure;
            });

            days.push({
                dayNumber,
                date: dayStr,
                stops: dayStops.map(stop => ({
                    ...stop,
                    isArrivalDay: new Date(stop.arrivalDate).toISOString().split('T')[0] === dayStr,
                    isDepartureDay: new Date(stop.departureDate).toISOString().split('T')[0] === dayStr
                }))
            });

            currentDate.setDate(currentDate.getDate() + 1);
            dayNumber++;
        }

        res.json({
            success: true,
            trip: {
                _id: trip._id,
                name: trip.name,
                startDate: trip.startDate,
                endDate: trip.endDate
            },
            itinerary: days
        });
    } catch (error) {
        console.error('Get itinerary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get itinerary'
        });
    }
};

// @desc    Get trip budget breakdown
// @route   GET /api/trips/:id/budget
// @access  Private
export const getBudget = async (req, res) => {
    try {
        let trip;

        if (req.user.isDemo) {
            trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
        } else {
            trip = await Trip.findOne({
                _id: req.params.id,
                user: req.user.id
            });
        }

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        // Calculate budget breakdown
        let transportTotal = 0;
        let accommodationTotal = 0;
        let activitiesTotal = 0;

        trip.stops.forEach(stop => {
            accommodationTotal += stop.accommodation?.cost || 0;
            transportTotal += stop.transport?.cost || 0;

            if (stop.activities) {
                stop.activities.forEach(act => {
                    activitiesTotal += act.cost || 0;
                });
            }
        });

        const foodBudget = trip.budget?.food || 0;
        const miscBudget = trip.budget?.miscellaneous || 0;
        const totalBudget = transportTotal + accommodationTotal + activitiesTotal + foodBudget + miscBudget;

        // Calculate duration
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const avgPerDay = duration > 0 ? totalBudget / duration : 0;

        res.json({
            success: true,
            budget: {
                total: totalBudget,
                transport: transportTotal,
                accommodation: accommodationTotal,
                activities: activitiesTotal,
                food: foodBudget,
                miscellaneous: miscBudget,
                averagePerDay: Math.round(avgPerDay * 100) / 100,
                duration
            }
        });
    } catch (error) {
        console.error('Get budget error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get budget'
        });
    }
};

// @desc    Get trip calendar events
// @route   GET /api/trips/:id/calendar
// @access  Private
export const getCalendar = async (req, res) => {
    try {
        let trip;

        if (req.user.isDemo) {
            trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
        } else {
            trip = await Trip.findOne({
                _id: req.params.id,
                user: req.user.id
            });
        }

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        const events = [];

        trip.stops.forEach(stop => {
            // Arrival event
            events.push({
                id: `arrival_${stop._id}`,
                title: `Arrive in ${stop.cityName}`,
                date: stop.arrivalDate,
                type: 'arrival',
                color: '#10b981'
            });

            // Departure event
            events.push({
                id: `departure_${stop._id}`,
                title: `Depart from ${stop.cityName}`,
                date: stop.departureDate,
                type: 'departure',
                color: '#ef4444'
            });

            // Activity events
            if (stop.activities) {
                stop.activities.forEach(activity => {
                    events.push({
                        id: `activity_${activity._id}`,
                        title: activity.name,
                        date: stop.arrivalDate, // Simplification - activities on arrival date
                        type: 'activity',
                        category: activity.category,
                        color: getCategoryColor(activity.category)
                    });
                });
            }
        });

        res.json({
            success: true,
            events
        });
    } catch (error) {
        console.error('Get calendar error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get calendar'
        });
    }
};

// @desc    Generate share link
// @route   POST /api/trips/:id/share
// @access  Private
export const shareTrip = async (req, res) => {
    try {
        // Demo mode
        if (req.user.isDemo) {
            const trip = demoTrips.find(t => t._id === req.params.id || t.id === req.params.id);
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            const shareId = `demo_share_${Date.now()}`;
            trip.isPublic = true;
            trip.shareId = shareId;

            return res.json({
                success: true,
                shareId,
                shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/shared/${shareId}`,
                message: 'Share link generated (demo mode)'
            });
        }

        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        // Generate share ID if not exists
        if (!trip.shareId) {
            trip.shareId = uuidv4();
        }

        trip.isPublic = true;
        await trip.save();

        res.json({
            success: true,
            shareId: trip.shareId,
            shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/shared/${trip.shareId}`
        });
    } catch (error) {
        console.error('Share trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate share link'
        });
    }
};

// Helper function for category colors
function getCategoryColor(category) {
    const colors = {
        sightseeing: '#3b82f6',
        food: '#f59e0b',
        adventure: '#ef4444',
        culture: '#8b5cf6',
        nightlife: '#ec4899',
        shopping: '#06b6d4',
        nature: '#22c55e',
        relaxation: '#14b8a6',
        entertainment: '#f97316'
    };
    return colors[category] || '#6b7280';
}
