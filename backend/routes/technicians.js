import express from 'express';
import { authenticate, authorize } from '../middleware/auth.firebase.js';
import Technician from '../models/Technician.js';

const router = express.Router();

// Get all technicians (Supervisor/Planner only)
router.get('/', authenticate, authorize('supervisor', 'planner'), async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    
    let query = {};
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const technicians = await Technician.find(query)
      .select('-firebaseUid')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: technicians.length,
      data: technicians
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single technician
router.get('/:id', authenticate, async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .select('-firebaseUid');

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    // Employees can only view their own profile unless supervisor/planner
    if (['production', 'quality', 'testing'].includes(req.user.role) && req.user.id !== technician._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: technician
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new technician (Supervisor only - they manage the team)
router.post('/', authenticate, authorize('supervisor'), async (req, res) => {
  try {
    const technician = await Technician.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Technician created successfully',
      data: technician
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update technician
router.put('/:id', authenticate, authorize('supervisor'), async (req, res) => {
  try {
    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    res.json({
      success: true,
      message: 'Technician updated successfully',
      data: technician
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete technician (Supervisor only - they manage the team)
router.delete('/:id', authenticate, authorize('supervisor'), async (req, res) => {
  try {
    const technician = await Technician.findByIdAndDelete(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    res.json({
      success: true,
      message: 'Technician deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get technician performance metrics
router.get('/:id/performance', authenticate, async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    res.json({
      success: true,
      data: {
        employeeId: technician.employeeId,
        name: technician.name,
        metrics: technician.performanceMetrics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
