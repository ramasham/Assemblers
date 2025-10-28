import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

const jobOrdersCollection = collections.jobOrders;

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_STATUSES = ['pending', 'in-progress', 'completed', 'delayed', 'cancelled'];
const VALID_SERIAL_STATUSES = ['pending', 'in-progress', 'completed', 'failed'];

const JobOrder = {
  async create(data) {
    if (!data.jobOrderNumber || !data.productName || !data.totalQuantity || !data.dueDate) {
      throw new Error('Missing required fields: jobOrderNumber, productName, totalQuantity, dueDate');
    }

    if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
      throw new Error(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }

    const existing = await this.findByJobOrderNumber(data.jobOrderNumber);
    if (existing) {
      throw new Error(`Job order with number ${data.jobOrderNumber} already exists`);
    }

    const jobOrderData = {
      jobOrderNumber: data.jobOrderNumber.trim(),
      productName: data.productName.trim(),
      productCode: data.productCode?.trim() || '',
      totalQuantity: data.totalQuantity,
      completedQuantity: data.completedQuantity || 0,
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      dueDate: data.dueDate instanceof Date ? data.dueDate : new Date(data.dueDate),
      startDate: data.startDate ? (data.startDate instanceof Date ? data.startDate : new Date(data.startDate)) : null,
      completionDate: data.completionDate ? (data.completionDate instanceof Date ? data.completionDate : new Date(data.completionDate)) : null,
      assignedTechnicians: data.assignedTechnicians || [],
      serialNumbers: data.serialNumbers || [],
      notes: data.notes?.trim() || '',
      estimatedHours: data.estimatedHours || 0,
      actualHours: data.actualHours || 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await jobOrdersCollection.add(jobOrderData);
    const doc = await docRef.get();
    return this._enrichJobOrder({ id: doc.id, ...doc.data() });
  },

  async findById(id) {
    const doc = await jobOrdersCollection.doc(id).get();
    if (!doc.exists) return null;
    return this._enrichJobOrder({ id: doc.id, ...doc.data() });
  },

  async findByJobOrderNumber(jobOrderNumber) {
    const snapshot = await jobOrdersCollection.where('jobOrderNumber', '==', jobOrderNumber).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return this._enrichJobOrder({ id: doc.id, ...doc.data() });
  },

  async findAll(filters = {}) {
    let query = jobOrdersCollection;

    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters.priority) {
      query = query.where('priority', '==', filters.priority);
    }
    if (filters.assignedTechnicianId) {
      query = query.where('assignedTechnicians', 'array-contains', filters.assignedTechnicianId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => this._enrichJobOrder({ id: doc.id, ...doc.data() }));
  },

  async update(id, data) {
    const doc = await jobOrdersCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Job order not found');
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const updateData = {
      ...(data.productName && { productName: data.productName.trim() }),
      ...(data.productCode !== undefined && { productCode: data.productCode.trim() }),
      ...(data.totalQuantity !== undefined && { totalQuantity: data.totalQuantity }),
      ...(data.completedQuantity !== undefined && { completedQuantity: data.completedQuantity }),
      ...(data.priority && { priority: data.priority }),
      ...(data.status && { status: data.status }),
      ...(data.dueDate && { dueDate: data.dueDate instanceof Date ? data.dueDate : new Date(data.dueDate) }),
      ...(data.startDate && { startDate: data.startDate instanceof Date ? data.startDate : new Date(data.startDate) }),
      ...(data.completionDate && { completionDate: data.completionDate instanceof Date ? data.completionDate : new Date(data.completionDate) }),
      ...(data.assignedTechnicians && { assignedTechnicians: data.assignedTechnicians }),
      ...(data.serialNumbers && { serialNumbers: data.serialNumbers }),
      ...(data.notes !== undefined && { notes: data.notes.trim() }),
      ...(data.estimatedHours !== undefined && { estimatedHours: data.estimatedHours }),
      ...(data.actualHours !== undefined && { actualHours: data.actualHours }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await jobOrdersCollection.doc(id).update(updateData);
    const updated = await jobOrdersCollection.doc(id).get();
    return this._enrichJobOrder({ id: updated.id, ...updated.data() });
  },

  async delete(id) {
    await jobOrdersCollection.doc(id).delete();
    return { id, deleted: true };
  },

  // Helper method to add virtual fields
  _enrichJobOrder(jobOrder) {
    const progressPercentage = jobOrder.totalQuantity > 0 
      ? ((jobOrder.completedQuantity / jobOrder.totalQuantity) * 100).toFixed(2) 
      : 0;
    
    const isDelayed = jobOrder.status !== 'completed' && 
      new Date() > (jobOrder.dueDate instanceof Date ? jobOrder.dueDate : jobOrder.dueDate.toDate());

    return {
      ...jobOrder,
      progressPercentage: parseFloat(progressPercentage),
      isDelayed
    };
  },

  async count(filters = {}) {
    const jobOrders = await this.findAll(filters);
    return jobOrders.length;
  }
};

export default JobOrder;
