import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import restaurantRoutes from './routes/restaurants';
import categoryRoutes from './routes/categories';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:19006', 'http://localhost:19000', 'http://localhost:19001'];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Yemek Ruleti API is running' });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

