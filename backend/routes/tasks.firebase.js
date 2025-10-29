import express from 'express';
import { authenticate, isPlannerOrSupervisor, isSupervisor, isTechnician } from '../middleware/auth.firebase.js';
import Task from '../models/Task.js';
import JobOrder from '../models/JobOrder.js';
import User from '../models/User.js';

const router = express.Router();

// Get all tasks (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, assignedTo, jobOrderId, department } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (jobOrderId) filters.jobOrderId = jobOrderId;
    if (department) filters.department = department;
    
    // Technicians only see their own tasks
    const technicianRoles = ['Production Technician', 'Testing Technician', 'Quality Technician'];
    if (technicianRoles.includes(req.user.currentRole)) {
      filters.assignedTo = req.user.id;
    } else if (assignedTo) {
      filters.assignedTo = assignedTo;
    }

    const tasks = await Task.findAll(filters);

    res.json({
      success: true,
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check access: technician can only see their own tasks
    const technicianRoles = ['Production Technician', 'Testing Technician', 'Quality Technician'];
    if (technicianRoles.includes(req.user.currentRole) && task.assignedTo !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      task: task
    });
  } catch (error) {
    console.error('Task fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get tasks by technician
router.get('/technician/:technicianId', authenticate, async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { status } = req.query;

    // Technicians can only view their own tasks
    const technicianRoles = ['Production Technician', 'Testing Technician', 'Quality Technician'];
    if (technicianRoles.includes(req.user.currentRole) && technicianId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const tasks = await Task.findByTechnician(technicianId, status);

    res.json({
      success: true,
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    console.error('Technician tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get pending tasks for review (Supervisors only)
router.get('/review/pending', authenticate, isSupervisor, async (req, res) => {
  try {
    const department = req.user.department;
    const tasks = await Task.findPendingReview(department);

    res.json({
      success: true,
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    console.error('Pending review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new task (Supervisors and Planners only)
router.post('/', authenticate, isPlannerOrSupervisor, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user.email,
      createdByName: req.user.name,
      department: req.body.department || req.user.department
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: task
    });
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Assign task to technician (Supervisors only)
router.put('/:id/assign', authenticate, isSupervisor, async (req, res) => {
  try {
    const { technicianId, technicianName, technicianEmail } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: 'Technician ID is required'
      });
    }

    // Verify technician exists
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    const task = await Task.assign(
      req.params.id,
      technicianId,
      technicianName || technician.name,
      technicianEmail || technician.email
    );

    res.json({
      success: true,
      message: 'Task assigned successfully',
      task: task
    });
  } catch (error) {
    console.error('Task assignment error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Submit task for review (Technicians only)
router.put('/:id/submit', authenticate, isTechnician, async (req, res) => {
  try {
    const { actualTime, completedUnits, serialNumbers, notes } = req.body;

    const task = await Task.submit(req.params.id, {
      actualTime,
      completedUnits,
      serialNumbers,
      notes
    });

    res.json({
      success: true,
      message: 'Task submitted for review',
      task: task
    });
  } catch (error) {
    console.error('Task submission error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Approve task (Supervisors only)
router.put('/:id/approve', authenticate, isSupervisor, async (req, res) => {
  try {
    const { feedback } = req.body;

    const task = await Task.approve(req.params.id, req.user.email, feedback);

    // Update job order progress
    if (task.jobOrderId && task.completedUnits > 0) {
      const jobOrder = await JobOrder.findById(task.jobOrderId);
      if (jobOrder) {
        const newCompletedQuantity = jobOrder.completedQuantity + task.completedUnits;
        await JobOrder.update(task.jobOrderId, {
          completedQuantity: newCompletedQuantity,
          status: newCompletedQuantity >= jobOrder.totalQuantity ? 'completed' : 'in-progress'
        });
      }
    }

    res.json({
      success: true,
      message: 'Task approved successfully',
      task: task
    });
  } catch (error) {
    console.error('Task approval error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Reject task (Supervisors only)
router.put('/:id/reject', authenticate, isSupervisor, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const task = await Task.reject(req.params.id, req.user.email, reason);

    res.json({
      success: true,
      message: 'Task rejected',
      task: task
    });
  } catch (error) {
    console.error('Task rejection error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Start work on task (Technicians only)
router.put('/:id/start', authenticate, isTechnician, async (req, res) => {
  try {
    const task = await Task.startWork(req.params.id);

    res.json({
      success: true,
      message: 'Task started',
      task: task
    });
  } catch (error) {
    console.error('Task start error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update task (General update - Supervisors and Planners)
router.put('/:id', authenticate, isPlannerOrSupervisor, async (req, res) => {
  try {
    const task = await Task.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Task updated successfully',
      task: task
    });
  } catch (error) {
    console.error('Task update error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete task (Supervisors and Planners only)
router.delete('/:id', authenticate, isPlannerOrSupervisor, async (req, res) => {
  try {
    await Task.delete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Task deletion error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get task statistics
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const { department } = req.query;
    const filters = {};
    
    if (department) {
      filters.department = department;
    }

    const stats = await Task.countByStatus(filters);

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Task stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
