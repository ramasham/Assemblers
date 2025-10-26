import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Alert from '../models/Alert.js';

const router = express.Router();

// Get all alerts
router.get('/', authenticate, async (req, res) => {
  try {
    const { isRead, isResolved, severity, type } = req.query;
    
    let query = {
      targetRoles: req.user.role
    };
    
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';
    if (severity) query.severity = severity;
    if (type) query.type = type;

    const alerts = await Alert.find(query)
      .populate('relatedJobOrder', 'jobOrderNumber productName')
      .populate('relatedTechnician', 'employeeId name')
      .populate('relatedTask')
      .sort({ severity: -1, createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get unread alert count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      targetRoles: req.user.role,
      isRead: false
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create alert (Supervisor/Admin)
router.post('/', authenticate, authorize('supervisor', 'admin'), async (req, res) => {
  try {
    const alert = await Alert.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Mark alert as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert marked as read',
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Mark alert as resolved
router.put('/:id/resolve', authenticate, authorize('supervisor', 'admin'), async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { 
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy: req.user.id
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert resolved successfully',
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete alert
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
