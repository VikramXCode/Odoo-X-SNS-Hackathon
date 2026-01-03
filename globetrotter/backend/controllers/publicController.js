import Trip from '../models/Trip.js';
import { demoTrips } from '../seeds/demoData.js';

// @desc    Get shared trip
// @route   GET /api/public/trips/:shareId
// @access  Public
export const getSharedTrip = async (req, res) => {
    try {
        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            const trip = demoTrips.find(t => t.shareId === req.params.shareId);
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found or not shared'
                });
            }
            return res.json({
                success: true,
                trip
            });
        }

        const trip = await Trip.findOne({
            shareId: req.params.shareId,
            isPublic: true
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or not shared'
            });
        }

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        console.error('Get shared trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get trip'
        });
    }
};

// @desc    Copy shared trip
// @route   POST /api/trips/:shareId/copy
// @access  Private
export const copySharedTrip = async (req, res) => {
    try {
        let originalTrip;

        // Demo mode
        if (process.env.DEMO_MODE === 'true') {
            originalTrip = demoTrips.find(t => t.shareId === req.params.shareId);
            if (!originalTrip) {
                return res.status(404).json({
                    success: false,
                    message: 'Trip not found'
                });
            }

            const newTrip = {
                _id: `demo_trip_copy_${Date.now()}`,
                id: `demo_trip_copy_${Date.now()}`,
                user: req.user.id,
                name: `${originalTrip.name} (Copy)`,
                description: originalTrip.description,
                coverImage: originalTrip.coverImage,
                startDate: originalTrip.startDate,
                endDate: originalTrip.endDate,
                status: 'draft',
                budget: { ...originalTrip.budget },
                stops: originalTrip.stops.map(stop => ({
                    ...stop,
                    _id: `demo_stop_copy_${Date.now()}_${Math.random()}`,
                    activities: stop.activities.map(act => ({
                        ...act,
                        _id: `demo_act_copy_${Date.now()}_${Math.random()}`
                    }))
                })),
                isPublic: false,
                createdAt: new Date().toISOString()
            };

            demoTrips.unshift(newTrip);

            return res.status(201).json({
                success: true,
                trip: newTrip,
                message: 'Trip copied (demo mode)'
            });
        }

        originalTrip = await Trip.findOne({
            shareId: req.params.shareId,
            isPublic: true
        });

        if (!originalTrip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or not shared'
            });
        }

        const newTrip = new Trip({
            user: req.user.id,
            name: `${originalTrip.name} (Copy)`,
            description: originalTrip.description,
            coverImage: originalTrip.coverImage,
            startDate: originalTrip.startDate,
            endDate: originalTrip.endDate,
            status: 'draft',
            budget: originalTrip.budget,
            stops: originalTrip.stops.map(stop => ({
                cityName: stop.cityName,
                country: stop.country,
                arrivalDate: stop.arrivalDate,
                departureDate: stop.departureDate,
                accommodation: stop.accommodation,
                transport: stop.transport,
                activities: stop.activities,
                order: stop.order
            })),
            isPublic: false
        });

        await newTrip.save();

        res.status(201).json({
            success: true,
            trip: newTrip
        });
    } catch (error) {
        console.error('Copy trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to copy trip'
        });
    }
};
