import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Task from '../models/Task.js';
import JobOrder from '../models/JobOrder.js';
import Technician from '../models/Technician.js';

const router = express.Router();

// Get all tasks
router.get('/', authenticate, async (req, res) => {
  try {
    const { technicianId, jobOrderId, status, startDate, endDate } = req.query;
    
    let query = {};
    
    if (technicianId) query.technician = technicianId;
    if (jobOrderId) query.jobOrder = jobOrderId;
    if (status) query.status = status;
    
    if (startDate && endDate) {
      query.taskDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Employees only see their own tasks
    if (['production', 'quality', 'testing'].includes(req.user.role)) {
      query.technician = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('technician', 'employeeId name email')
      .populate('jobOrder', 'jobOrderNumber productName')
      .sort({ taskDate: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single task
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('technician', 'employeeId name email')
      .populate('jobOrder', 'jobOrderNumber productName totalQuantity');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Employees can only view their own tasks
    if (['production', 'quality', 'testing'].includes(req.user.role) && task.technician._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new task (log work)
router.post('/', authenticate, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      technician: ['production', 'quality', 'testing'].includes(req.user.role) ? req.user.id : req.body.technician
    };

    const task = await Task.create(taskData);

    // Update job order progress
    if (task.unitsCompleted > 0) {
      const jobOrder = await JobOrder.findById(task.jobOrder);
      if (jobOrder) {
        jobOrder.completedQuantity += task.unitsCompleted;
        jobOrder.actualHours += parseFloat(task.durationHours) || 0;
        
        if (jobOrder.status === 'pending') {
          jobOrder.status = 'in-progress';
          jobOrder.startDate = new Date();
        }
        
        if (jobOrder.completedQuantity >= jobOrder.totalQuantity) {
          jobOrder.status = 'completed';
          jobOrder.completionDate = new Date();
        }
        
        await jobOrder.save();
      }
    }

    const populatedTask = await Task.findById(task._id)
      .populate('technician', 'employeeId name')
      .populate('jobOrder', 'jobOrderNumber productName');

    res.status(201).json({
      success: true,
      message: 'Task logged successfully',
      data: populatedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Technicians can only update their own tasks
    if (req.user.role === 'technician' && task.technician.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate productivity if task is completed
    if (req.body.status === 'completed' && req.body.endTime) {
      task.endTime = req.body.endTime;
      task.calculateProductivity();
    }

    Object.assign(task, req.body);
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('technician', 'employeeId name')
      .populate('jobOrder', 'jobOrderNumber productName');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add issue to task
router.post('/:id/issues', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.issues.push(req.body);
    await task.save();

    res.json({
      success: true,
      message: 'Issue reported successfully',
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only allow deletion by supervisor or task owner
    if (['production', 'quality', 'testing'].includes(req.user.role) && task.technician.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
