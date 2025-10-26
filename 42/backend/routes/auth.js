import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Technician from '../models/Technician.js';

const router = express.Router();

// Register new user (Simple auth - no Firebase)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, employeeId, role, phoneNumber, specialization } = req.body;

    // Check if user exists
    const existingUser = await Technician.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create technician record
    const technician = await Technician.create({
      email,
      password: hashedPassword,
      name,
      employeeId,
      role: role || 'technician',
      phoneNumber,
      specialization
    });

    // Generate JWT
    const token = jwt.sign(
      { uid: technician._id, email: technician.email, role: technician.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: technician._id,
        email: technician.email,
        name: technician.name,
        employeeId: technician.employeeId,
        role: technician.role,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const technician = await Technician.findOne({ email }).select('+password');
    
    if (!technician) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, technician.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!technician.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { uid: technician._id, email: technician.email, role: technician.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = technician.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        uid: technician._id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const technician = await Technician.findById(decoded.uid).select('-password');

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: technician
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;
