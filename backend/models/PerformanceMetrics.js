import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

const performanceMetricsCollection = collections.performanceMetrics;

const VALID_PERIODS = ['daily', 'weekly', 'monthly'];

const PerformanceMetrics = {
  /**
   * Create or update performance metrics
   */
  async createOrUpdate(data) {
    if (!data.userId || !data.period || !data.date) {
      throw new Error('Missing required fields: userId, period, date');
    }

    if (!VALID_PERIODS.includes(data.period)) {
      throw new Error(`Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}`);
    }

    const dateObj = data.date instanceof Date ? data.date : new Date(data.date);
    const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if metrics already exist for this user, period, and date
    const existing = await this.findByUserPeriodDate(data.userId, data.period, dateStr);

    const metricsData = {
      userId: data.userId,
      jobOrderId: data.jobOrderId || null,
      period: data.period,
      date: dateObj,
      department: data.department || '',
      
      // Productivity Metrics
      totalTasksCompleted: data.totalTasksCompleted || 0,
      totalDevicesCompleted: data.totalDevicesCompleted || 0,
      totalUnitsProduced: data.totalUnitsProduced || 0,
      avgTaskCompletionTime: data.avgTaskCompletionTime || 0,
      
      // Efficiency Metrics
      productivity: data.productivity || 0,
      efficiency: data.efficiency || 0,
      utilizationRate: data.utilizationRate || 0,
      
      // Quality Metrics
      defectRate: data.defectRate || 0,
      reworkRate: data.reworkRate || 0,
      firstPassYield: data.firstPassYield || 0,
      
      // Time Metrics
      totalWorkingHours: data.totalWorkingHours || 0,
      totalIdleTime: data.totalIdleTime || 0,
      avgTaskDelay: data.avgTaskDelay || 0,
      
      calculatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: existing ? existing.createdAt : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (existing) {
      await performanceMetricsCollection.doc(existing.id).update(metricsData);
      const updated = await performanceMetricsCollection.doc(existing.id).get();
      return { id: updated.id, ...updated.data() };
    } else {
      const docRef = await performanceMetricsCollection.add(metricsData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() };
    }
  },

  /**
   * Find metrics by ID
   */
  async findById(id) {
    const doc = await performanceMetricsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find metrics by user, period, and date
   */
  async findByUserPeriodDate(userId, period, dateStr) {
    const date = new Date(dateStr);
    const snapshot = await performanceMetricsCollection
      .where('userId', '==', userId)
      .where('period', '==', period)
      .where('date', '==', date)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find all metrics with filters
   */
  async findAll(filters = {}) {
    let query = performanceMetricsCollection;

    if (filters.userId) {
      query = query.where('userId', '==', filters.userId);
    }
    if (filters.jobOrderId) {
      query = query.where('jobOrderId', '==', filters.jobOrderId);
    }
    if (filters.period) {
      query = query.where('period', '==', filters.period);
    }
    if (filters.department) {
      query = query.where('department', '==', filters.department);
    }
    if (filters.startDate && filters.endDate) {
      const start = filters.startDate instanceof Date ? filters.startDate : new Date(filters.startDate);
      const end = filters.endDate instanceof Date ? filters.endDate : new Date(filters.endDate);
      query = query.where('date', '>=', start).where('date', '<=', end);
    }

    // Order by date descending
    query = query.orderBy('date', 'desc');

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Calculate metrics for a user for a specific period
   */
  async calculateMetricsForUser(userId, period, date) {
    // This would calculate metrics based on tasks completed
    // Implementation depends on your specific business logic
    
    const dateObj = date instanceof Date ? date : new Date(date);
    let startDate, endDate;

    switch (period) {
      case 'daily':
        startDate = new Date(dateObj.setHours(0, 0, 0, 0));
        endDate = new Date(dateObj.setHours(23, 59, 59, 999));
        break;
      case 'weekly':
        // Start of week (Sunday)
        const dayOfWeek = dateObj.getDay();
        startDate = new Date(dateObj);
        startDate.setDate(dateObj.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        endDate = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
    }

    // Query tasks for this user in the date range
    const tasksSnapshot = await collections.tasks
      .where('technician', '==', userId)
      .where('taskDate', '>=', startDate)
      .where('taskDate', '<=', endDate)
      .where('status', '==', 'completed')
      .get();

    const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate metrics
    const totalTasksCompleted = tasks.length;
    let totalActualTime = 0;
    let totalStandardTime = 0;
    let totalWorkingHours = 0;

    tasks.forEach(task => {
      if (task.endTime && task.startTime) {
        const duration = (task.endTime.toDate() - task.startTime.toDate()) / (1000 * 60); // minutes
        totalActualTime += duration;
        totalWorkingHours += duration / 60; // convert to hours
      }
      // Assuming standard time is stored in task or can be calculated
      // totalStandardTime += task.standardTime || 0;
    });

    const avgTaskCompletionTime = totalTasksCompleted > 0 ? totalActualTime / totalTasksCompleted : 0;
    const efficiency = totalStandardTime > 0 ? (totalStandardTime / totalActualTime) * 100 : 0;
    const productivity = totalWorkingHours > 0 ? totalTasksCompleted / totalWorkingHours : 0;

    // Get user info for department
    const userDoc = await collections.users.doc(userId).get();
    const department = userDoc.exists ? userDoc.data().department : '';

    return await this.createOrUpdate({
      userId,
      period,
      date: startDate,
      department,
      totalTasksCompleted,
      avgTaskCompletionTime,
      efficiency,
      productivity,
      totalWorkingHours
    });
  },

  /**
   * Get metrics summary for a department
   */
  async getDepartmentSummary(department, startDate, endDate) {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    const snapshot = await performanceMetricsCollection
      .where('department', '==', department)
      .where('date', '>=', start)
      .where('date', '<=', end)
      .get();

    const metrics = snapshot.docs.map(doc => doc.data());

    if (metrics.length === 0) {
      return {
        department,
        totalTasks: 0,
        avgProductivity: 0,
        avgEfficiency: 0,
        avgUtilization: 0
      };
    }

    const summary = {
      department,
      totalTasks: metrics.reduce((sum, m) => sum + m.totalTasksCompleted, 0),
      avgProductivity: metrics.reduce((sum, m) => sum + m.productivity, 0) / metrics.length,
      avgEfficiency: metrics.reduce((sum, m) => sum + m.efficiency, 0) / metrics.length,
      avgUtilization: metrics.reduce((sum, m) => sum + m.utilizationRate, 0) / metrics.length,
      totalDevices: metrics.reduce((sum, m) => sum + m.totalDevicesCompleted, 0),
      totalWorkingHours: metrics.reduce((sum, m) => sum + m.totalWorkingHours, 0)
    };

    return summary;
  },

  /**
   * Delete metrics
   */
  async delete(id) {
    const doc = await performanceMetricsCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Performance metrics not found');
    }

    await performanceMetricsCollection.doc(id).delete();
    return { success: true, message: 'Performance metrics deleted successfully' };
  }
};

export default PerformanceMetrics;
