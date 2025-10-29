import express from 'express';
import { authenticate, authorize } from '../middleware/auth.firebase.js';
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

// Get real performance metrics based on completed work
router.get('/performance', authenticate, async (req, res) => {
  try {
    const { period = '7days', technicianId } = req.query;
    
    // Calculate date range
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
    
    // Query completed work
    const { db } = await import('../services/firestore.js');
    let query = db.collection('completedWork')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate);
    
    if (technicianId) {
      query = query.where('technicianId', '==', technicianId);
    }
    
    const snapshot = await query.get();
    const completedWork = [];
    snapshot.forEach(doc => {
      completedWork.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Group by technician and calculate metrics
    const technicianMetrics = {};
    
    for (const work of completedWork) {
      const techId = work.technicianId;
      
      if (!technicianMetrics[techId]) {
        technicianMetrics[techId] = {
          technicianId: techId,
          technicianName: work.technicianName,
          devicesCompleted: 0,
          totalWorkHours: 0,
          totalStandardTime: 0,
          totalActualTime: 0,
          efficiencySum: 0,
          productivitySum: 0,
          utilizationSum: 0,
          workDays: new Set(),
          entries: 0
        };
      }
      
      const metrics = technicianMetrics[techId];
      metrics.devicesCompleted += work.devicesCompleted || 0;
      metrics.totalWorkHours += work.workHours || 0;
      metrics.totalStandardTime += work.totalStandardTime || 0;
      metrics.totalActualTime += work.totalActualTime || 0;
      metrics.efficiencySum += work.efficiency || 0;
      metrics.productivitySum += work.productivity || 0;
      metrics.utilizationSum += work.utilization || 0;
      metrics.workDays.add(work.dateString);
      metrics.entries++;
    }
    
    // Calculate averages and format result
    const performanceMetrics = Object.values(technicianMetrics).map(metrics => {
      const avgEfficiency = metrics.efficiencySum / metrics.entries;
      const avgProductivity = metrics.productivitySum / metrics.entries;
      const avgUtilization = metrics.utilizationSum / metrics.entries;
      
      return {
        technicianId: metrics.technicianId,
        technicianName: metrics.technicianName,
        completedUnits: metrics.devicesCompleted,
        workHours: Math.round(metrics.totalWorkHours * 100) / 100,
        efficiency: Math.round(avgEfficiency * 100) / 100,
        productivity: Math.round(avgProductivity * 100) / 100,
        utilization: Math.round(avgUtilization * 100) / 100,
        workDays: metrics.workDays.size,
        totalEntries: metrics.entries,
        date: endDate.toISOString().split('T')[0]
      };
    });
    
    // Sort by efficiency (best performers first)
    performanceMetrics.sort((a, b) => b.efficiency - a.efficiency);
    
    res.json({
      success: true,
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      count: performanceMetrics.length,
      metrics: performanceMetrics
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
