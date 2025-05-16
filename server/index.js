const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

// MongoDB Config
const dbConfig = require('./config/dbConfig');

// Routes
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoute = require('./routes/showRoutes');
const bookingRoute = require('./routes/bookingRoute');

// --- CORS Setup ---
const allowedOrigins = [
  'https://book-ur-show-git-main-kaushik-gowdas-projects.vercel.app', // ✅ Replace this with your actual deployed frontend URL
  'http://localhost:5173' // optional, useful for local development
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // enable if you're using cookies/auth headers
}));

// --- Body Parser ---
app.use(express.json());

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatre', theatreRoutes);
app.use('/api/shows', showRoute);
app.use('/api/bookings', bookingRoute);

// --- Start Server ---
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`✅ Server Running on port ${PORT}`);
});
