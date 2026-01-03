# GlobeTrotter - Smart Travel Planning

A full-stack travel planning application built with React 18 + Vite (frontend) and Node.js + Express + MongoDB (backend).

## Features

- 🔐 **Authentication** - JWT-based auth with demo mode
- ✈️ **Trip Management** - Create, edit, delete trips with cover images
- 🗺️ **Itinerary Builder** - Add stops, activities, transport, and accommodation
- 💰 **Budget Tracking** - Automatic calculations with category breakdown
- 📅 **Calendar View** - Day-by-day visualization of your trip
- 🌍 **City Discovery** - Search and save favorite destinations
- 🎯 **Activity Search** - Find things to do with filters
- 👤 **User Profile** - Preferences and saved destinations
- 👑 **Admin Dashboard** - Analytics and user management
- 🔗 **Trip Sharing** - Generate public links to share trips

## Demo Credentials

```
Regular User:  demo@globetrotter.com / demo123
Admin User:    admin@globetrotter.com / admin123
```

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd globetrotter/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy .env.example to .env in backend folder
cp backend/.env.example backend/.env
```

Default configuration runs in **demo mode** (no database required).

### 3. Start Development Servers

```bash
# Terminal 1 - Backend (port 5001)
cd globetrotter/backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd globetrotter/frontend
npm run dev
```

Visit `http://localhost:5173` and login with demo credentials!

## Project Structure

```
globetrotter/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── seeds/          # Demo data
│   └── server.js       # Express app
│
└── frontend/
    ├── public/         # Static assets
    └── src/
        ├── components/ # Reusable components
        ├── contexts/   # React contexts
        ├── pages/      # Page components
        ├── services/   # API services
        └── styles/     # CSS files
```

## API Endpoints

| Route | Description |
|-------|-------------|
| `POST /api/auth/login` | User login |
| `POST /api/auth/register` | User registration |
| `GET /api/trips` | Get user trips |
| `POST /api/trips` | Create trip |
| `POST /api/trips/:id/stops` | Add stop |
| `GET /api/cities/search` | Search cities |
| `GET /api/activities/search` | Search activities |
| `GET /api/admin/analytics` | Admin analytics |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5001 |
| `MONGODB_URI` | MongoDB connection | localhost |
| `JWT_SECRET` | JWT signing key | (required) |
| `DEMO_MODE` | Enable demo mode | true |
| `CLIENT_URL` | Frontend URL | http://localhost:5173 |

## Technology Stack

- **Frontend**: React 18, Vite, React Router, CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Uploads**: Cloudinary (optional)

## License

MIT
