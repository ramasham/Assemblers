// Simplified authentication routes without Firebase
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Technician = require('../models/Technician');
const { authenticate } = require('../middleware/auth.simple');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, employeeId, role, department, skills } = req.body;

    // Check if user already exists
    const existingUser = await Technician.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new technician
    const technician = new Technician({
      email,
      password: hashedPassword,
      name,
      employeeId,
      role: role || 'technician',
      department,
      skills: skills || []
    });

    await technician.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: technician._id,
        email: technician.email,
        role: technician.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: technician._id,
        email: technician.email,
        name: technician.name,
        role: technician.role,
        employeeId: technician.employeeId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const technician = await Technician.findOne({ email });
    if (!technician) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, technician.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: technician._id,
        email: technician.email,
        role: technician.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: technician._id,
        email: technician.email,
        name: technician.name,
        role: technician.role,
        employeeId: technician.employeeId,
        department: technician.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const technician = await Technician.findById(req.user.userId).select('-password');
    if (!technician) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(technician);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

module.exports = router;
