# 🍽️ Food Roulette

A mobile application that helps you decide what to eat by finding nearby restaurants and spinning a roulette wheel.

## 🚀 Features

- 📍 **Location-based restaurant search** - Find restaurants near you
- 🎯 **Distance filter** - Customizable radius (0-5km) with slider
- 🍕 **Category filtering** - Filter by multiple food categories (Pizza, Turkish, Italian, etc.)
- 🎰 **Interactive roulette wheel** - Beautiful animated wheel with fair random selection
- ⭐ **Restaurant details** - Ratings, photos, distance, and address
- 🎉 **Confetti effects** - Celebration when winner is selected
- 📳 **Haptic feedback** - Tactile feedback during spin and on win
- ❤️ **Favorites** - Save your favorite restaurants
- 📜 **History** - View past roulette results
- 🗺️ **Map integration** - View restaurant location and get directions
- 📤 **Share** - Share your winning restaurant with friends

## 📱 Platform Support

✅ **iOS** (iPhone & iPad) - Ready for App Store  
✅ **Android** (Phone & Tablet) - Ready for Google Play

Built with Expo, allowing you to build for both iOS and Android from a single codebase.

## 🎨 Screenshots

- **Home Screen**: Select distance and categories
- **Roulette Screen**: Spin the wheel to select a restaurant
- **History Screen**: View past selections
- **Favorites Screen**: Manage your favorite restaurants
- **Map Screen**: View restaurant location

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **Prisma ORM** with **PostgreSQL**
- **Google Places API** for restaurant data

### Frontend
- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **Expo Haptics** for haptic feedback
- **React Native Confetti Cannon** for celebrations
- **Expo Linear Gradient** for beautiful gradients

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **PostgreSQL** database

## 📋 Prerequisites

- **Docker** and **Docker Compose** (recommended)
- OR **Node.js 18+** and **PostgreSQL 14+** (manual setup)
- **Google Places API Key** ([Get it here](https://console.cloud.google.com/))

## 🐳 Quick Start with Docker (Recommended)

The easiest way to get started:

```bash
# 1. Set your Google Places API key
export GOOGLE_PLACES_API_KEY=your_api_key_here

# 2. Start all services (PostgreSQL + Backend + Frontend)
docker-compose up --build

# 3. Access the app
# - Backend API: http://localhost:3001
# - Frontend: Scan QR code with Expo Go app
# - Database: localhost:5432
```

## 📦 Manual Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp env.example .env
   ```

4. **Configure `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/food_roulette"
   PORT=3001
   GOOGLE_PLACES_API_KEY=your_api_key_here
   CORS_ORIGIN=http://localhost:19006
   ```

5. **Setup database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start backend:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

4. **Run on device:**
   - Scan QR code with **Expo Go** app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## 📱 Usage

1. **Open the app** and grant location permissions
2. **Select distance** using the slider (0-5km) or preset buttons
3. **Choose categories** (optional) - Select one or more food categories
4. **Find restaurants** - Tap "Restoranları Bul" to search
5. **Spin the wheel** - Tap the center button or "Ruleti Çevir!" to spin
6. **View result** - See the winning restaurant with details
7. **Take action** - Add to favorites, view on map, or share

## 🗄️ Database Schema

- **Restaurant**: Restaurant information (name, address, coordinates, rating, photos)
- **Category**: Food categories (Pizza, Turkish, Italian, etc.)
- **RestaurantCategory**: Many-to-many relationship between restaurants and categories

## 🔧 API Endpoints

### Restaurants
- `GET /api/restaurants/nearby?lat={lat}&lng={lng}&radius={radius}&categoryIds={ids}` - Search nearby restaurants
- `GET /api/restaurants` - Get filtered restaurants
- `GET /api/restaurants/:id` - Get restaurant details

### Categories
- `GET /api/categories` - Get all categories

## 🎯 Features in Detail

### Roulette Wheel
- Fair random selection algorithm
- Beautiful gradient segments
- Smooth animations
- Visual feedback with confetti and haptics

### History & Favorites
- Local storage using AsyncStorage
- No backend dependency
- Persistent across app restarts
- Easy management (add/remove favorites)

### Map Integration
- Opens native map apps (Google Maps / Apple Maps)
- Fallback to web maps
- Restaurant location with details

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/food_roulette
PORT=3001
GOOGLE_PLACES_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:19006
```

### Frontend
No environment variables needed. API URL is configured in `src/services/api.ts`.

## 📝 Development

### Project Structure
```
food-roulette/
├── backend/          # Node.js backend
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── index.ts  # Entry point
│   └── prisma/       # Database schema
├── frontend/         # React Native app
│   └── src/
│       ├── screens/  # App screens
│       └── services/  # API & storage services
└── docker-compose.yml
```

### Running in Development

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## 🐛 Troubleshooting

### Common Issues

**Google Places API errors:**
- Ensure API key is valid and Places API is enabled
- Check API quotas and billing

**Database connection issues:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env

**Expo connection issues:**
- Ensure backend is running on port 3001
- Check CORS_ORIGIN matches Expo URL

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for food lovers who can't decide what to eat!

---

**Note**: Make sure to get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/) and enable the Places API before running the application.
