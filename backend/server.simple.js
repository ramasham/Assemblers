// Simplified server without Firebase
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.simple'));
app.use('/api/technicians', require('./routes/technicians'));
app.use('/api/job-orders', require('./routes/jobOrders'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/analytics', require('./routes/analytics'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Technician Task Management API - Simple Mode (No Firebase)',
    version: '1.0.0',
    mode: 'simple',
    endpoints: {
      auth: '/api/auth',
      technicians: '/api/technicians',
      jobOrders: '/api/job-orders',
      tasks: '/api/tasks',
      alerts: '/api/alerts',
      analytics: '/api/analytics'
    }
  });
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    mode: 'simple',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in SIMPLE mode on port ${PORT}`);
  console.log(`Mode: No Firebase - Using JWT authentication`);
});
