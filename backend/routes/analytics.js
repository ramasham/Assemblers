import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Task from '../models/Task.js';
import JobOrder from '../models/JobOrder.js';
import Technician from '../models/Technician.js';
import Alert from '../models/Alert.js';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const router = express.Router();

// Get dashboard overview
router.get('/overview', authenticate, authorize('supervisor', 'planner'), async (req, res) => {
  try {
    // Job Order Statistics
    const totalJobs = await JobOrder.countDocuments();
    const pendingJobs = await JobOrder.countDocuments({ status: 'pending' });
    const inProgressJobs = await JobOrder.countDocuments({ status: 'in-progress' });
    const completedJobs = await JobOrder.countDocuments({ status: 'completed' });
    const delayedJobs = await JobOrder.countDocuments({
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });

    // Technician Statistics
    const totalTechnicians = await Technician.countDocuments({ isActive: true });
    const activeTechnicians = await Technician.countDocuments({
      isActive: true,
      role: { $in: ['production', 'quality', 'testing'] }
    });

    // Task Statistics (Today)
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const todayTasks = await Task.countDocuments({
      taskDate: { $gte: todayStart, $lte: todayEnd }
    });

    const todayCompletedTasks = await Task.countDocuments({
      taskDate: { $gte: todayStart, $lte: todayEnd },
      status: 'completed'
    });

    // Alert Statistics
    const criticalAlerts = await Alert.countDocuments({
      severity: 'critical',
      isResolved: false
    });

    const unreadAlerts = await Alert.countDocuments({
      isRead: false,
      targetRoles: req.user.role
    });

    res.json({
      success: true,
      data: {
        jobOrders: {
          total: totalJobs,
          pending: pendingJobs,
          inProgress: inProgressJobs,
          completed: completedJobs,
          delayed: delayedJobs
        },
        technicians: {
          total: totalTechnicians,
          active: activeTechnicians
        },
        tasks: {
          today: todayTasks,
          todayCompleted: todayCompletedTasks
        },
        alerts: {
          critical: criticalAlerts,
          unread: unreadAlerts
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get technician performance analytics
router.get('/technician-performance', authenticate, authorize('supervisor', 'planner'), async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'today':
        startDate = startOfDay(endDate);
        break;
      case '7days':
        startDate = subDays(endDate, 7);
        break;
      case '30days':
        startDate = subDays(endDate, 30);
        break;
      case 'week':
        startDate = startOfWeek(endDate);
        break;
      case 'month':
        startDate = startOfMonth(endDate);
        break;
      default:
        startDate = subDays(endDate, 7);
    }

    const performanceData = await Task.aggregate([
      {
        $match: {
          taskDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$technician',
          totalTasks: { $sum: 1 },
          totalUnits: { $sum: '$unitsCompleted' },
          avgProductivity: { $avg: '$productivity' },
          avgEfficiency: { $avg: '$efficiency' }
        }
      },
      {
        $lookup: {
          from: 'technicians',
          localField: '_id',
          foreignField: '_id',
          as: 'technicianInfo'
        }
      },
      {
        $unwind: '$technicianInfo'
      },
      {
        $project: {
          technicianId: '$technicianInfo.employeeId',
          name: '$technicianInfo.name',
          totalTasks: 1,
          totalUnits: 1,
          avgProductivity: { $round: ['$avgProductivity', 2] },
          avgEfficiency: { $round: ['$avgEfficiency', 2] }
        }
      },
      {
        $sort: { totalUnits: -1 }
      }
    ]);

    res.json({
      success: true,
      period,
      count: performanceData.length,
      data: performanceData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get job order progress analytics
router.get('/job-progress', authenticate, authorize('supervisor', 'planner'), async (req, res) => {
  try {
    const jobProgress = await JobOrder.aggregate([
      {
        $project: {
          jobOrderNumber: 1,
          productName: 1,
          totalQuantity: 1,
          completedQuantity: 1,
          status: 1,
          dueDate: 1,
          priority: 1,
          progressPercentage: {
            $multiply: [
              { $divide: ['$completedQuantity', '$totalQuantity'] },
              100
            ]
          },
          isDelayed: {
            $and: [
              { $ne: ['$status', 'completed'] },
              { $lt: ['$dueDate', new Date()] }
            ]
          }
        }
      },
      {
        $sort: { dueDate: 1 }
      }
    ]);

    res.json({
      success: true,
      count: jobProgress.length,
      data: jobProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get productivity trends
router.get('/productivity-trends', authenticate, authorize('supervisor', 'planner'), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = subDays(new Date(), parseInt(days));

    const trends = await Task.aggregate([
      {
        $match: {
          taskDate: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$taskDate' }
          },
          totalTasks: { $sum: 1 },
          totalUnits: { $sum: '$unitsCompleted' },
          avgProductivity: { $avg: '$productivity' },
          avgEfficiency: { $avg: '$efficiency' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          date: '$_id',
          totalTasks: 1,
          totalUnits: 1,
          avgProductivity: { $round: ['$avgProductivity', 2] },
          avgEfficiency: { $round: ['$avgEfficiency', 2] }
        }
      }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get my performance (for technicians)
router.get('/my-performance', authenticate, async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'today':
        startDate = startOfDay(endDate);
        break;
      case '7days':
        startDate = subDays(endDate, 7);
        break;
      case '30days':
        startDate = subDays(endDate, 30);
        break;
      default:
        startDate = subDays(endDate, 7);
    }

    const myPerformance = await Task.aggregate([
      {
        $match: {
          technician: req.user.id,
          taskDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          totalUnits: { $sum: '$unitsCompleted' },
          avgProductivity: { $avg: '$productivity' },
          avgEfficiency: { $avg: '$efficiency' },
          totalHours: { 
            $sum: {
              $divide: [
                { $subtract: ['$endTime', '$startTime'] },
                3600000
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalTasks: 1,
          totalUnits: 1,
          avgProductivity: { $round: ['$avgProductivity', 2] },
          avgEfficiency: { $round: ['$avgEfficiency', 2] },
          totalHours: { $round: ['$totalHours', 2] }
        }
      }
    ]);

    const dailyBreakdown = await Task.aggregate([
      {
        $match: {
          technician: req.user.id,
          taskDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$taskDate' }
          },
          tasks: { $sum: 1 },
          units: { $sum: '$unitsCompleted' },
          productivity: { $avg: '$productivity' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: myPerformance[0] || {
          totalTasks: 0,
          totalUnits: 0,
          avgProductivity: 0,
          avgEfficiency: 0,
          totalHours: 0
        },
        dailyBreakdown
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
