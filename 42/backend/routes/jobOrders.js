import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import JobOrder from '../models/JobOrder.js';
import Alert from '../models/Alert.js';

const router = express.Router();

// Get all job orders
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, search, assignedTo } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTechnicians = assignedTo;
    
    if (search) {
      query.$or = [
        { jobOrderNumber: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } }
      ];
    }

    // Technicians only see their assigned jobs
    if (req.user.role === 'technician') {
      query.assignedTechnicians = req.user.id;
    }

    const jobOrders = await JobOrder.find(query)
      .populate('assignedTechnicians', 'employeeId name email')
      .sort({ dueDate: 1, priority: -1 });

    res.json({
      success: true,
      count: jobOrders.length,
      data: jobOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single job order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const jobOrder = await JobOrder.findById(req.params.id)
      .populate('assignedTechnicians', 'employeeId name email')
      .populate('serialNumbers.assignedTo', 'employeeId name');

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    // Check if technician is assigned to this job
    if (req.user.role === 'technician') {
      const isAssigned = jobOrder.assignedTechnicians.some(
        tech => tech._id.toString() === req.user.id
      );
      
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Not assigned to this job.'
        });
      }
    }

    res.json({
      success: true,
      data: jobOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new job order (Planner/Admin only)
router.post('/', authenticate, authorize('planner', 'admin'), async (req, res) => {
  try {
    const jobOrder = await JobOrder.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job order created successfully',
      data: jobOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update job order
router.put('/:id', authenticate, authorize('planner', 'supervisor', 'admin'), async (req, res) => {
  try {
    const jobOrder = await JobOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTechnicians', 'employeeId name email');

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    // Check if job is delayed and create alert
    if (jobOrder.isDelayed && jobOrder.status !== 'completed') {
      await Alert.create({
        type: 'delay',
        severity: 'high',
        title: `Job Order ${jobOrder.jobOrderNumber} is Delayed`,
        message: `Job order ${jobOrder.jobOrderNumber} has passed its due date and is still ${jobOrder.status}`,
        relatedJobOrder: jobOrder._id,
        targetRoles: ['supervisor', 'planner', 'admin']
      });
    }

    res.json({
      success: true,
      message: 'Job order updated successfully',
      data: jobOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update serial number status
router.put('/:id/serial/:serialNumber', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const jobOrder = await JobOrder.findById(req.params.id);

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    const serialItem = jobOrder.serialNumbers.find(
      item => item.serialNumber === req.params.serialNumber
    );

    if (!serialItem) {
      return res.status(404).json({
        success: false,
        message: 'Serial number not found'
      });
    }

    serialItem.status = status;
    serialItem.assignedTo = req.user.id;
    if (notes) serialItem.notes = notes;
    if (status === 'completed') {
      serialItem.completedAt = new Date();
      jobOrder.completedQuantity += 1;
    }

    await jobOrder.save();

    res.json({
      success: true,
      message: 'Serial number updated successfully',
      data: jobOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete job order (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const jobOrder = await JobOrder.findByIdAndDelete(req.params.id);

    if (!jobOrder) {
      return res.status(404).json({
        success: false,
        message: 'Job order not found'
      });
    }

    res.json({
      success: true,
      message: 'Job order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
