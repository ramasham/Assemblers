import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

const alertsCollection = collections.alerts;

const VALID_TYPES = ['delay', 'deadline', 'low-performance', 'quality-issue', 'system'];
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];
const VALID_ROLES = ['production', 'quality', 'testing', 'supervisor', 'planner'];

const Alert = {
  async create(data) {
    if (!data.type || !data.title || !data.message) {
      throw new Error('Missing required fields: type, title, message');
    }

    if (!VALID_TYPES.includes(data.type)) {
      throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
    }

    if (data.severity && !VALID_SEVERITIES.includes(data.severity)) {
      throw new Error(`Invalid severity. Must be one of: ${VALID_SEVERITIES.join(', ')}`);
    }

    const alertData = {
      type: data.type,
      severity: data.severity || 'medium',
      title: data.title.trim(),
      message: data.message.trim(),
      relatedJobOrder: data.relatedJobOrder || null,
      relatedTechnician: data.relatedTechnician || null,
      relatedTask: data.relatedTask || null,
      isRead: data.isRead || false,
      isResolved: data.isResolved || false,
      resolvedAt: data.resolvedAt ? (data.resolvedAt instanceof Date ? data.resolvedAt : new Date(data.resolvedAt)) : null,
      resolvedBy: data.resolvedBy || null,
      targetRoles: data.targetRoles || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await alertsCollection.add(alertData);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  },

  async findById(id) {
    const doc = await alertsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async findAll(filters = {}) {
    let query = alertsCollection;

    if (filters.type) {
      query = query.where('type', '==', filters.type);
    }
    if (filters.severity) {
      query = query.where('severity', '==', filters.severity);
    }
    if (filters.isRead !== undefined) {
      query = query.where('isRead', '==', filters.isRead);
    }
    if (filters.isResolved !== undefined) {
      query = query.where('isResolved', '==', filters.isResolved);
    }
    if (filters.targetRole) {
      query = query.where('targetRoles', 'array-contains', filters.targetRole);
    }
    if (filters.relatedJobOrder) {
      query = query.where('relatedJobOrder', '==', filters.relatedJobOrder);
    }
    if (filters.relatedTechnician) {
      query = query.where('relatedTechnician', '==', filters.relatedTechnician);
    }

    // Order by createdAt descending
    query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id, data) {
    const doc = await alertsCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Alert not found');
    }

    if (data.type && !VALID_TYPES.includes(data.type)) {
      throw new Error(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
    }

    if (data.severity && !VALID_SEVERITIES.includes(data.severity)) {
      throw new Error(`Invalid severity. Must be one of: ${VALID_SEVERITIES.join(', ')}`);
    }

    const updateData = {
      ...(data.type && { type: data.type }),
      ...(data.severity && { severity: data.severity }),
      ...(data.title && { title: data.title.trim() }),
      ...(data.message && { message: data.message.trim() }),
      ...(data.relatedJobOrder !== undefined && { relatedJobOrder: data.relatedJobOrder }),
      ...(data.relatedTechnician !== undefined && { relatedTechnician: data.relatedTechnician }),
      ...(data.relatedTask !== undefined && { relatedTask: data.relatedTask }),
      ...(data.isRead !== undefined && { isRead: data.isRead }),
      ...(data.isResolved !== undefined && { isResolved: data.isResolved }),
      ...(data.resolvedAt !== undefined && { resolvedAt: data.resolvedAt ? (data.resolvedAt instanceof Date ? data.resolvedAt : new Date(data.resolvedAt)) : null }),
      ...(data.resolvedBy !== undefined && { resolvedBy: data.resolvedBy }),
      ...(data.targetRoles && { targetRoles: data.targetRoles }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await alertsCollection.doc(id).update(updateData);
    const updated = await alertsCollection.doc(id).get();
    return { id: updated.id, ...updated.data() };
  },

  async delete(id) {
    await alertsCollection.doc(id).delete();
    return { id, deleted: true };
  },

  async markAsRead(id) {
    return await this.update(id, { isRead: true });
  },

  async markAsResolved(id, resolvedBy) {
    return await this.update(id, {
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy
    });
  },

  async count(filters = {}) {
    const alerts = await this.findAll(filters);
    return alerts.length;
  }
};

export default Alert;
