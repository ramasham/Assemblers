import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users (no authentication required for now - can be added later)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();

    // Filter out password-related fields
    const sanitizedUsers = users.map(user => ({
      uid: user.uid || user.id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      currentRole: user.currentRole,
      allowedRoles: user.allowedRoles,
      department: user.department,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive !== false,
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// Get users by role
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.findAll();

    const filteredUsers = users.filter(user => 
      user.currentRole === role || 
      user.allowedRoles?.includes(role)
    );

    const sanitizedUsers = filteredUsers.map(user => ({
      uid: user.uid || user.id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      currentRole: user.currentRole,
      allowedRoles: user.allowedRoles,
      department: user.department,
      phoneNumber: user.phoneNumber,
    }));

    res.json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// Get users by department
router.get('/department/:department', async (req, res) => {
  try {
    const { department } = req.params;
    const users = await User.findAll();

    const filteredUsers = users.filter(user => 
      user.department?.toLowerCase() === department.toLowerCase()
    );

    const sanitizedUsers = filteredUsers.map(user => ({
      uid: user.uid || user.id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      currentRole: user.currentRole,
      allowedRoles: user.allowedRoles,
      department: user.department,
      phoneNumber: user.phoneNumber,
    }));

    res.json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error('Error fetching users by department:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

export default router;
