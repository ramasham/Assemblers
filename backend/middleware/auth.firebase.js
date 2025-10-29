import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication middleware for Firebase/Firestore users
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify JWT token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );
    
    // Find user by email (Firestore uses email for lookups)
    const user = await User.findByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is inactive' 
      });
    }

    // Attach user info to request for use in routes
    req.user = {
      id: user.id || user.uid,
      uid: user.uid || user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      currentRole: user.currentRole,
      allowedRoles: user.allowedRoles,
      department: user.department
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

/**
 * Authorization middleware - checks if user has required role
 * @param {...string} roles - Allowed roles (e.g., 'Engineer Planner', 'Production Supervisor')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    // Check if user's current role is in the allowed roles
    if (!roles.includes(req.user.currentRole)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.currentRole}` 
      });
    }

    next();
  };
};

/**
 * Check if user is a planner
 */
export const isPlanner = authorize('Engineer Planner');

/**
 * Check if user is a supervisor
 */
export const isSupervisor = authorize('Production Supervisor', 'Testing Supervisor', 'Quality Supervisor');

/**
 * Check if user is a technician
 */
export const isTechnician = authorize('Production Technician', 'Testing Technician', 'Quality Technician');

/**
 * Check if user is planner or supervisor
 */
export const isPlannerOrSupervisor = authorize(
  'Engineer Planner',
  'Production Supervisor',
  'Testing Supervisor',
  'Quality Supervisor'
);
