import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Verify user credentials using User model
    const user = await User.verifyPassword(email, password);

    if (!user) {
      console.error(`❌ Login failed for ${email} - Invalid credentials or missing passwordHash`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        uid: user.uid || user.id,
        email: user.email,
        currentRole: user.currentRole,
        department: user.department
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        uid: user.uid || user.id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        currentRole: user.currentRole,
        allowedRoles: user.allowedRoles,
        department: user.department,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Switch role endpoint
router.post('/switch-role', async (req, res) => {
  try {
    const { role } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    // Get user
    const user = await User.findByEmail(decoded.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Switch role using email instead of uid
    const updatedUser = await User.switchRole(user.id, role);

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role or user does not have permission for this role'
      });
    }

    // Generate new token with updated role
    const newToken = jwt.sign(
      {
        uid: updatedUser.uid || updatedUser.id,
        email: updatedUser.email,
        currentRole: updatedUser.currentRole,
        department: updatedUser.department
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Role switched successfully',
      token: newToken,
      user: {
        uid: updatedUser.uid || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        currentRole: updatedUser.currentRole,
        allowedRoles: updatedUser.allowedRoles,
        department: updatedUser.department
      }
    });
  } catch (error) {
    console.error('Switch role error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    
    // Get user
    const user = await User.findByEmail(decoded.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        currentRole: user.currentRole,
        allowedRoles: user.allowedRoles,
        department: user.department,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
