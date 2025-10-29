import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

const auditLogsCollection = collections.auditLogs;

const VALID_ACTION_TYPES = ['create', 'read', 'update', 'delete', 'auth'];
const VALID_RESOURCE_TYPES = ['task', 'device', 'job-order', 'user', 'role', 'alert', 'metrics'];

const AuditLog = {
  /**
   * Create a new audit log entry
   */
  async create(data) {
    if (!data.userId || !data.action || !data.actionType) {
      throw new Error('Missing required fields: userId, action, actionType');
    }

    if (!VALID_ACTION_TYPES.includes(data.actionType)) {
      throw new Error(`Invalid actionType. Must be one of: ${VALID_ACTION_TYPES.join(', ')}`);
    }

    if (data.resourceType && !VALID_RESOURCE_TYPES.includes(data.resourceType)) {
      throw new Error(`Invalid resourceType. Must be one of: ${VALID_RESOURCE_TYPES.join(', ')}`);
    }

    const logData = {
      userId: data.userId,
      userName: data.userName || '',
      action: data.action,
      actionType: data.actionType,
      resourceType: data.resourceType || '',
      resourceId: data.resourceId || '',
      previousValue: data.previousValue || null,
      newValue: data.newValue || null,
      ipAddress: data.ipAddress || '',
      userAgent: data.userAgent || '',
      department: data.department || '',
      roleAtAction: data.roleAtAction || '',
      success: data.success !== undefined ? data.success : true,
      errorMessage: data.errorMessage || '',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      sessionId: data.sessionId || ''
    };

    const docRef = await auditLogsCollection.add(logData);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find log by ID
   */
  async findById(id) {
    const doc = await auditLogsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find all logs with filters
   */
  async findAll(filters = {}) {
    let query = auditLogsCollection;

    if (filters.userId) {
      query = query.where('userId', '==', filters.userId);
    }
    if (filters.action) {
      query = query.where('action', '==', filters.action);
    }
    if (filters.actionType) {
      query = query.where('actionType', '==', filters.actionType);
    }
    if (filters.resourceType) {
      query = query.where('resourceType', '==', filters.resourceType);
    }
    if (filters.success !== undefined) {
      query = query.where('success', '==', filters.success);
    }
    if (filters.department) {
      query = query.where('department', '==', filters.department);
    }
    if (filters.startDate && filters.endDate) {
      const start = filters.startDate instanceof Date ? filters.startDate : new Date(filters.startDate);
      const end = filters.endDate instanceof Date ? filters.endDate : new Date(filters.endDate);
      query = query.where('timestamp', '>=', start).where('timestamp', '<=', end);
    }

    // Order by timestamp descending
    query = query.orderBy('timestamp', 'desc');

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Log user login
   */
  async logLogin(userId, userName, ipAddress, userAgent, success = true, errorMessage = '') {
    return await this.create({
      userId,
      userName,
      action: 'user-login',
      actionType: 'auth',
      resourceType: 'user',
      resourceId: userId,
      ipAddress,
      userAgent,
      success,
      errorMessage
    });
  },

  /**
   * Log user logout
   */
  async logLogout(userId, userName, sessionId) {
    return await this.create({
      userId,
      userName,
      action: 'user-logout',
      actionType: 'auth',
      resourceType: 'user',
      resourceId: userId,
      sessionId
    });
  },

  /**
   * Log role switch
   */
  async logRoleSwitch(userId, userName, previousRole, newRole, department) {
    return await this.create({
      userId,
      userName,
      action: 'role-switched',
      actionType: 'update',
      resourceType: 'user',
      resourceId: userId,
      previousValue: { role: previousRole },
      newValue: { role: newRole },
      department,
      roleAtAction: newRole
    });
  },

  /**
   * Log task submission
   */
  async logTaskSubmission(userId, userName, taskId, taskData, roleAtAction, department) {
    return await this.create({
      userId,
      userName,
      action: 'submitted-task',
      actionType: 'create',
      resourceType: 'task',
      resourceId: taskId,
      newValue: taskData,
      roleAtAction,
      department
    });
  },

  /**
   * Log task approval
   */
  async logTaskApproval(userId, userName, taskId, approved, roleAtAction, department, reason = '') {
    return await this.create({
      userId,
      userName,
      action: approved ? 'approved-task' : 'rejected-task',
      actionType: 'update',
      resourceType: 'task',
      resourceId: taskId,
      newValue: { approved, reason },
      roleAtAction,
      department
    });
  },

  /**
   * Log job order creation
   */
  async logJobOrderCreation(userId, userName, jobOrderId, jobOrderData, roleAtAction) {
    return await this.create({
      userId,
      userName,
      action: 'created-job-order',
      actionType: 'create',
      resourceType: 'job-order',
      resourceId: jobOrderId,
      newValue: jobOrderData,
      roleAtAction
    });
  },

  /**
   * Log suspicious activity
   */
  async logSuspiciousActivity(userId, userName, action, details, ipAddress, userAgent) {
    return await this.create({
      userId,
      userName,
      action: `suspicious-${action}`,
      actionType: 'auth',
      resourceType: 'user',
      resourceId: userId,
      newValue: details,
      ipAddress,
      userAgent,
      success: false,
      errorMessage: 'Suspicious activity detected'
    });
  },

  /**
   * Get user activity summary
   */
  async getUserActivitySummary(userId, startDate, endDate) {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    const snapshot = await auditLogsCollection
      .where('userId', '==', userId)
      .where('timestamp', '>=', start)
      .where('timestamp', '<=', end)
      .get();

    const logs = snapshot.docs.map(doc => doc.data());

    const summary = {
      userId,
      totalActions: logs.length,
      successfulActions: logs.filter(log => log.success).length,
      failedActions: logs.filter(log => !log.success).length,
      actionsByType: {},
      lastActivity: logs.length > 0 ? logs[0].timestamp : null
    };

    // Count actions by type
    logs.forEach(log => {
      if (!summary.actionsByType[log.actionType]) {
        summary.actionsByType[log.actionType] = 0;
      }
      summary.actionsByType[log.actionType]++;
    });

    return summary;
  },

  /**
   * Get department activity
   */
  async getDepartmentActivity(department, limit = 100) {
    const snapshot = await auditLogsCollection
      .where('department', '==', department)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Delete old logs (cleanup)
   */
  async deleteOlderThan(date) {
    const cutoffDate = date instanceof Date ? date : new Date(date);
    
    const snapshot = await auditLogsCollection
      .where('timestamp', '<', cutoffDate)
      .get();

    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return { success: true, deletedCount: snapshot.size };
  }
};

export default AuditLog;
