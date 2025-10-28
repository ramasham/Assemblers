import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase.js';
import { db } from './services/firestore.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import technicianRoutes from './routes/technicians.js';
import jobOrderRoutes from './routes/jobOrders.js';
import taskRoutes from './routes/tasks.js';
import alertRoutes from './routes/alerts.js';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize Firebase and Firestore
initializeFirebase();
console.log('✅ Firebase and Firestore initialized');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/job-orders', jobOrderRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root endpoint
// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Technician Task Management API',
    version: '1.0.0',
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
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Technician Task Management System - Backend API          ║
║                                                               ║
║   Server running on: http://localhost:${PORT}                 ║
║   Environment: ${process.env.NODE_ENV || 'development'}       ║                       ║
║   Database: Firebase Firestore                                ║
║   Auth: Firebase Authentication                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
