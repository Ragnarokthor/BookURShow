const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Import DB and Routes
const dbConfig = require('./config/dbConfig');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoute = require('./routes/showRoutes');
const bookingRoute = require('./routes/bookingRoute');

// Middlewares
app.use(cors({ origin: '*' })); // Allow all origins (dev)
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatre', theatreRoutes);
app.use('/api/shows', showRoute);
app.use('/api/bookings', bookingRoute);

// ✅ Serve React static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ For any other route, return React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
