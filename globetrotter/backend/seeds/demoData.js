// Demo data for GlobeTrotter

// Demo trips
export const demoTrips = [
    {
        _id: 'demo_trip_1',
        id: 'demo_trip_1',
        user: 'demo_user',
        name: 'European Adventure',
        description: 'A wonderful journey through the heart of Europe, visiting iconic cities and experiencing diverse cultures.',
        coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        status: 'planned',
        budget: {
            food: 800,
            miscellaneous: 300
        },
        stops: [
            {
                _id: 'stop_1',
                cityName: 'Paris',
                country: 'France',
                arrivalDate: '2026-03-15',
                departureDate: '2026-03-19',
                accommodation: { name: 'Hotel Le Marais', cost: 600 },
                transport: { type: 'flight', cost: 450 },
                activities: [
                    { _id: 'act_1', name: 'Eiffel Tower Visit', category: 'sightseeing', duration: 3, cost: 30 },
                    { _id: 'act_2', name: 'Louvre Museum', category: 'culture', duration: 4, cost: 20 },
                    { _id: 'act_3', name: 'Seine River Cruise', category: 'sightseeing', duration: 2, cost: 25 }
                ],
                order: 0
            },
            {
                _id: 'stop_2',
                cityName: 'Amsterdam',
                country: 'Netherlands',
                arrivalDate: '2026-03-19',
                departureDate: '2026-03-23',
                accommodation: { name: 'Canal House Hotel', cost: 500 },
                transport: { type: 'train', cost: 120 },
                activities: [
                    { _id: 'act_4', name: 'Van Gogh Museum', category: 'culture', duration: 3, cost: 22 },
                    { _id: 'act_5', name: 'Canal Bike Tour', category: 'adventure', duration: 2, cost: 35 }
                ],
                order: 1
            },
            {
                _id: 'stop_3',
                cityName: 'Berlin',
                country: 'Germany',
                arrivalDate: '2026-03-23',
                departureDate: '2026-03-28',
                accommodation: { name: 'Hotel Adlon', cost: 700 },
                transport: { type: 'train', cost: 80 },
                activities: [
                    { _id: 'act_6', name: 'Brandenburg Gate', category: 'sightseeing', duration: 2, cost: 0 },
                    { _id: 'act_7', name: 'Berlin Wall Memorial', category: 'culture', duration: 3, cost: 0 },
                    { _id: 'act_8', name: 'Museum Island', category: 'culture', duration: 4, cost: 25 }
                ],
                order: 2
            }
        ],
        isPublic: false,
        createdAt: '2026-01-01'
    },
    {
        _id: 'demo_trip_2',
        id: 'demo_trip_2',
        user: 'demo_user',
        name: 'Tokyo Exploration',
        description: 'Discover the blend of ancient traditions and cutting-edge technology in Japan\'s vibrant capital.',
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        startDate: '2026-05-10',
        endDate: '2026-05-20',
        status: 'draft',
        budget: {
            food: 600,
            miscellaneous: 400
        },
        stops: [
            {
                _id: 'stop_4',
                cityName: 'Tokyo',
                country: 'Japan',
                arrivalDate: '2026-05-10',
                departureDate: '2026-05-20',
                accommodation: { name: 'Park Hyatt Tokyo', cost: 2000 },
                transport: { type: 'flight', cost: 800 },
                activities: [
                    { _id: 'act_9', name: 'Senso-ji Temple', category: 'sightseeing', duration: 2, cost: 0 },
                    { _id: 'act_10', name: 'Shibuya Crossing', category: 'sightseeing', duration: 1, cost: 0 },
                    { _id: 'act_11', name: 'Tsukiji Outer Market', category: 'food', duration: 3, cost: 50 }
                ],
                order: 0
            }
        ],
        isPublic: false,
        createdAt: '2026-01-02'
    },
    {
        _id: 'demo_trip_3',
        id: 'demo_trip_3',
        user: 'demo_user',
        name: 'New York City Weekend',
        description: 'A quick getaway to the city that never sleeps.',
        coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        startDate: '2025-12-20',
        endDate: '2025-12-23',
        status: 'completed',
        budget: {
            food: 400,
            miscellaneous: 200
        },
        stops: [
            {
                _id: 'stop_5',
                cityName: 'New York',
                country: 'USA',
                arrivalDate: '2025-12-20',
                departureDate: '2025-12-23',
                accommodation: { name: 'The Plaza Hotel', cost: 1200 },
                transport: { type: 'flight', cost: 350 },
                activities: [
                    { _id: 'act_12', name: 'Central Park Walk', category: 'nature', duration: 2, cost: 0 },
                    { _id: 'act_13', name: 'Broadway Show', category: 'entertainment', duration: 3, cost: 150 },
                    { _id: 'act_14', name: 'Statue of Liberty', category: 'sightseeing', duration: 4, cost: 25 }
                ],
                order: 0
            }
        ],
        isPublic: true,
        shareId: 'demo_share_1',
        createdAt: '2025-11-15'
    }
];

// Demo cities
export const demoCities = [
    {
        _id: 'city_1',
        name: 'Paris',
        country: 'France',
        countryCode: 'FR',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        description: 'The City of Light, famous for its art, fashion, gastronomy, and romantic atmosphere.',
        costIndex: 4,
        averageDailyCost: 200,
        currency: 'EUR',
        bestTimeToVisit: 'April to June, September to October',
        tags: ['romantic', 'culture', 'food', 'art', 'history'],
        popular: true
    },
    {
        _id: 'city_2',
        name: 'Tokyo',
        country: 'Japan',
        countryCode: 'JP',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        description: 'A dazzling blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.',
        costIndex: 4,
        averageDailyCost: 180,
        currency: 'JPY',
        bestTimeToVisit: 'March to May, September to November',
        tags: ['technology', 'culture', 'food', 'anime', 'temples'],
        popular: true
    },
    {
        _id: 'city_3',
        name: 'New York',
        country: 'USA',
        countryCode: 'US',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        description: 'The Big Apple - a global hub of culture, art, entertainment, and endless opportunities.',
        costIndex: 5,
        averageDailyCost: 250,
        currency: 'USD',
        bestTimeToVisit: 'April to June, September to November',
        tags: ['shopping', 'culture', 'entertainment', 'food', 'nightlife'],
        popular: true
    },
    {
        _id: 'city_4',
        name: 'Barcelona',
        country: 'Spain',
        countryCode: 'ES',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
        description: 'A vibrant city known for stunning architecture, beautiful beaches, and lively nightlife.',
        costIndex: 3,
        averageDailyCost: 130,
        currency: 'EUR',
        bestTimeToVisit: 'May to June, September to October',
        tags: ['beach', 'architecture', 'nightlife', 'food', 'art'],
        popular: true
    },
    {
        _id: 'city_5',
        name: 'Amsterdam',
        country: 'Netherlands',
        countryCode: 'NL',
        image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
        description: 'Famous for its artistic heritage, elaborate canal system, and cycling culture.',
        costIndex: 4,
        averageDailyCost: 170,
        currency: 'EUR',
        bestTimeToVisit: 'April to May, September to November',
        tags: ['culture', 'art', 'cycling', 'canals', 'museums'],
        popular: true
    },
    {
        _id: 'city_6',
        name: 'Berlin',
        country: 'Germany',
        countryCode: 'DE',
        image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
        description: 'A city with a turbulent history and vibrant contemporary culture and nightlife.',
        costIndex: 3,
        averageDailyCost: 120,
        currency: 'EUR',
        bestTimeToVisit: 'May to September',
        tags: ['history', 'nightlife', 'art', 'culture', 'budget'],
        popular: true
    },
    {
        _id: 'city_7',
        name: 'Rome',
        country: 'Italy',
        countryCode: 'IT',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        description: 'The Eternal City, home to ancient ruins, art treasures, and incredible Italian cuisine.',
        costIndex: 3,
        averageDailyCost: 140,
        currency: 'EUR',
        bestTimeToVisit: 'April to June, September to October',
        tags: ['history', 'art', 'food', 'architecture', 'culture'],
        popular: true
    },
    {
        _id: 'city_8',
        name: 'London',
        country: 'United Kingdom',
        countryCode: 'GB',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
        description: 'A cosmopolitan city with a rich history, world-class museums, and diverse culture.',
        costIndex: 5,
        averageDailyCost: 220,
        currency: 'GBP',
        bestTimeToVisit: 'May to September',
        tags: ['culture', 'history', 'shopping', 'theatre', 'museums'],
        popular: true
    },
    {
        _id: 'city_9',
        name: 'Bangkok',
        country: 'Thailand',
        countryCode: 'TH',
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
        description: 'A city of ornate temples, vibrant street life, and world-renowned street food.',
        costIndex: 1,
        averageDailyCost: 50,
        currency: 'THB',
        bestTimeToVisit: 'November to February',
        tags: ['budget', 'food', 'temples', 'nightlife', 'shopping'],
        popular: true
    },
    {
        _id: 'city_10',
        name: 'Sydney',
        country: 'Australia',
        countryCode: 'AU',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
        description: 'A stunning harbor city with iconic architecture, beautiful beaches, and outdoor lifestyle.',
        costIndex: 4,
        averageDailyCost: 190,
        currency: 'AUD',
        bestTimeToVisit: 'September to November, March to May',
        tags: ['beach', 'nature', 'adventure', 'food', 'architecture'],
        popular: true
    },
    {
        _id: 'city_11',
        name: 'Dubai',
        country: 'UAE',
        countryCode: 'AE',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        description: 'A futuristic city known for luxury shopping, ultramodern architecture, and vibrant nightlife.',
        costIndex: 5,
        averageDailyCost: 280,
        currency: 'AED',
        bestTimeToVisit: 'November to March',
        tags: ['luxury', 'shopping', 'architecture', 'beach', 'nightlife'],
        popular: false
    },
    {
        _id: 'city_12',
        name: 'Bali',
        country: 'Indonesia',
        countryCode: 'ID',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        description: 'A tropical paradise with beautiful beaches, lush rice terraces, and spiritual temples.',
        costIndex: 2,
        averageDailyCost: 70,
        currency: 'IDR',
        bestTimeToVisit: 'April to October',
        tags: ['beach', 'relaxation', 'culture', 'nature', 'budget'],
        popular: true
    },
    {
        _id: 'city_13',
        name: 'Prague',
        country: 'Czech Republic',
        countryCode: 'CZ',
        image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800',
        description: 'A fairy-tale city with stunning medieval architecture and vibrant culture.',
        costIndex: 2,
        averageDailyCost: 80,
        currency: 'CZK',
        bestTimeToVisit: 'May to September',
        tags: ['history', 'architecture', 'budget', 'culture', 'nightlife'],
        popular: false
    },
    {
        _id: 'city_14',
        name: 'Istanbul',
        country: 'Turkey',
        countryCode: 'TR',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
        description: 'Where East meets West, a city straddling two continents with rich history and culture.',
        costIndex: 2,
        averageDailyCost: 75,
        currency: 'TRY',
        bestTimeToVisit: 'April to May, September to November',
        tags: ['history', 'culture', 'food', 'shopping', 'architecture'],
        popular: false
    },
    {
        _id: 'city_15',
        name: 'Cape Town',
        country: 'South Africa',
        countryCode: 'ZA',
        image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
        description: 'A stunning coastal city with dramatic landscapes, wine regions, and diverse wildlife.',
        costIndex: 2,
        averageDailyCost: 90,
        currency: 'ZAR',
        bestTimeToVisit: 'November to March',
        tags: ['nature', 'adventure', 'wine', 'beach', 'wildlife'],
        popular: false
    }
];

// Demo activities
export const demoActivities = [
    // Paris
    { _id: 'da_1', name: 'Eiffel Tower Visit', cityName: 'Paris', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400', duration: 3, estimatedCost: 30, rating: 4.8 },
    { _id: 'da_2', name: 'Louvre Museum', cityName: 'Paris', category: 'culture', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', duration: 4, estimatedCost: 20, rating: 4.9 },
    { _id: 'da_3', name: 'Seine River Cruise', cityName: 'Paris', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', duration: 2, estimatedCost: 25, rating: 4.6 },
    { _id: 'da_4', name: 'Montmartre Walking Tour', cityName: 'Paris', category: 'culture', image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400', duration: 3, estimatedCost: 15, rating: 4.5 },
    { _id: 'da_5', name: 'French Cooking Class', cityName: 'Paris', category: 'food', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', duration: 4, estimatedCost: 100, rating: 4.7 },

    // Tokyo
    { _id: 'da_6', name: 'Senso-ji Temple', cityName: 'Tokyo', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', duration: 2, estimatedCost: 0, rating: 4.7 },
    { _id: 'da_7', name: 'Shibuya Crossing', cityName: 'Tokyo', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400', duration: 1, estimatedCost: 0, rating: 4.5 },
    { _id: 'da_8', name: 'Tsukiji Outer Market', cityName: 'Tokyo', category: 'food', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', duration: 3, estimatedCost: 50, rating: 4.8 },
    { _id: 'da_9', name: 'Tokyo Skytree', cityName: 'Tokyo', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400', duration: 2, estimatedCost: 25, rating: 4.6 },
    { _id: 'da_10', name: 'Ramen Tasting Tour', cityName: 'Tokyo', category: 'food', image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', duration: 3, estimatedCost: 40, rating: 4.9 },

    // New York
    { _id: 'da_11', name: 'Central Park Walk', cityName: 'New York', category: 'nature', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', duration: 2, estimatedCost: 0, rating: 4.7 },
    { _id: 'da_12', name: 'Broadway Show', cityName: 'New York', category: 'entertainment', image: 'https://images.unsplash.com/photo-1520299607509-9b2960a4724c?w=400', duration: 3, estimatedCost: 150, rating: 4.9 },
    { _id: 'da_13', name: 'Statue of Liberty', cityName: 'New York', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=400', duration: 4, estimatedCost: 25, rating: 4.8 },
    { _id: 'da_14', name: 'Top of the Rock', cityName: 'New York', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400', duration: 2, estimatedCost: 40, rating: 4.7 },
    { _id: 'da_15', name: 'Brooklyn Food Tour', cityName: 'New York', category: 'food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', duration: 3, estimatedCost: 75, rating: 4.6 },

    // Barcelona
    { _id: 'da_16', name: 'Sagrada Familia', cityName: 'Barcelona', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', duration: 3, estimatedCost: 30, rating: 4.9 },
    { _id: 'da_17', name: 'Park Güell', cityName: 'Barcelona', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=400', duration: 2, estimatedCost: 15, rating: 4.7 },
    { _id: 'da_18', name: 'La Boqueria Market', cityName: 'Barcelona', category: 'food', image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=400', duration: 2, estimatedCost: 30, rating: 4.6 },
    { _id: 'da_19', name: 'Barceloneta Beach', cityName: 'Barcelona', category: 'relaxation', image: 'https://images.unsplash.com/photo-1507619579562-f2e10da1ec86?w=400', duration: 4, estimatedCost: 0, rating: 4.4 },

    // Amsterdam
    { _id: 'da_20', name: 'Van Gogh Museum', cityName: 'Amsterdam', category: 'culture', image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=400', duration: 3, estimatedCost: 22, rating: 4.9 },
    { _id: 'da_21', name: 'Canal Bike Tour', cityName: 'Amsterdam', category: 'adventure', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400', duration: 2, estimatedCost: 35, rating: 4.7 },
    { _id: 'da_22', name: 'Anne Frank House', cityName: 'Amsterdam', category: 'culture', image: 'https://images.unsplash.com/photo-1605101100278-5d1deb2b6498?w=400', duration: 2, estimatedCost: 16, rating: 4.8 },
    { _id: 'da_23', name: 'Rijksmuseum', cityName: 'Amsterdam', category: 'culture', image: 'https://images.unsplash.com/photo-1566132127697-4524fea60002?w=400', duration: 3, estimatedCost: 23, rating: 4.8 },

    // Berlin
    { _id: 'da_24', name: 'Brandenburg Gate', cityName: 'Berlin', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400', duration: 1, estimatedCost: 0, rating: 4.6 },
    { _id: 'da_25', name: 'Berlin Wall Memorial', cityName: 'Berlin', category: 'culture', image: 'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?w=400', duration: 2, estimatedCost: 0, rating: 4.7 },
    { _id: 'da_26', name: 'Museum Island', cityName: 'Berlin', category: 'culture', image: 'https://images.unsplash.com/photo-1599057850645-8a5e7f5e6c8b?w=400', duration: 4, estimatedCost: 25, rating: 4.8 },
    { _id: 'da_27', name: 'Street Art Tour', cityName: 'Berlin', category: 'culture', image: 'https://images.unsplash.com/photo-1549282520-7c5de5e8c0d3?w=400', duration: 3, estimatedCost: 20, rating: 4.5 },

    // Rome
    { _id: 'da_28', name: 'Colosseum Tour', cityName: 'Rome', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400', duration: 3, estimatedCost: 25, rating: 4.9 },
    { _id: 'da_29', name: 'Vatican Museums', cityName: 'Rome', category: 'culture', image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400', duration: 4, estimatedCost: 30, rating: 4.8 },
    { _id: 'da_30', name: 'Trevi Fountain', cityName: 'Rome', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400', duration: 1, estimatedCost: 0, rating: 4.6 },
    { _id: 'da_31', name: 'Pasta Making Class', cityName: 'Rome', category: 'food', image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400', duration: 3, estimatedCost: 80, rating: 4.9 },

    // London
    { _id: 'da_32', name: 'Tower of London', cityName: 'London', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', duration: 3, estimatedCost: 35, rating: 4.7 },
    { _id: 'da_33', name: 'British Museum', cityName: 'London', category: 'culture', image: 'https://images.unsplash.com/photo-1590418606746-018840f9cd0f?w=400', duration: 4, estimatedCost: 0, rating: 4.8 },
    { _id: 'da_34', name: 'West End Show', cityName: 'London', category: 'entertainment', image: 'https://images.unsplash.com/photo-1526401363794-c96708fb8089?w=400', duration: 3, estimatedCost: 80, rating: 4.9 },
    { _id: 'da_35', name: 'Borough Market', cityName: 'London', category: 'food', image: 'https://images.unsplash.com/photo-1560759226-14da22a643ef?w=400', duration: 2, estimatedCost: 40, rating: 4.6 },

    // Bangkok
    { _id: 'da_36', name: 'Grand Palace', cityName: 'Bangkok', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', duration: 3, estimatedCost: 15, rating: 4.7 },
    { _id: 'da_37', name: 'Street Food Tour', cityName: 'Bangkok', category: 'food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', duration: 3, estimatedCost: 25, rating: 4.9 },
    { _id: 'da_38', name: 'Floating Market', cityName: 'Bangkok', category: 'culture', image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400', duration: 4, estimatedCost: 30, rating: 4.5 },
    { _id: 'da_39', name: 'Wat Arun Temple', cityName: 'Bangkok', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400', duration: 2, estimatedCost: 5, rating: 4.6 },

    // Bali
    { _id: 'da_40', name: 'Tegallalang Rice Terraces', cityName: 'Bali', category: 'nature', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', duration: 3, estimatedCost: 5, rating: 4.7 },
    { _id: 'da_41', name: 'Uluwatu Temple Sunset', cityName: 'Bali', category: 'sightseeing', image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400', duration: 3, estimatedCost: 10, rating: 4.8 },
    { _id: 'da_42', name: 'Balinese Cooking Class', cityName: 'Bali', category: 'food', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', duration: 4, estimatedCost: 35, rating: 4.9 },
    { _id: 'da_43', name: 'Ubud Spa Day', cityName: 'Bali', category: 'relaxation', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', duration: 3, estimatedCost: 50, rating: 4.8 }
];

// Get unique countries from cities
export const getCountries = () => {
    const countries = [...new Set(demoCities.map(city => city.country))];
    return countries.sort();
};

// Get activity categories
export const getActivityCategories = () => [
    'sightseeing',
    'food',
    'adventure',
    'culture',
    'nightlife',
    'shopping',
    'nature',
    'relaxation',
    'entertainment'
];
