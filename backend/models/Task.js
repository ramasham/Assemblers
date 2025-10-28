import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

const tasksCollection = collections.tasks;

const VALID_STATUSES = ['in-progress', 'completed', 'paused', 'cancelled'];

const Task = {
  async create(data) {
    if (!data.technician || !data.jobOrder || !data.startTime) {
      throw new Error('Missing required fields: technician, jobOrder, startTime');
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const taskData = {
      technician: data.technician,
      jobOrder: data.jobOrder,
      taskDate: data.taskDate ? (data.taskDate instanceof Date ? data.taskDate : new Date(data.taskDate)) : new Date(),
      startTime: data.startTime instanceof Date ? data.startTime : new Date(data.startTime),
      endTime: data.endTime ? (data.endTime instanceof Date ? data.endTime : new Date(data.endTime)) : null,
      unitsCompleted: data.unitsCompleted || 0,
      serialNumbersCompleted: data.serialNumbersCompleted || [],
      status: data.status || 'in-progress',
      productivity: data.productivity || 0,
      efficiency: data.efficiency || 0,
      notes: data.notes?.trim() || '',
      issues: data.issues || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await tasksCollection.add(taskData);
    const doc = await docRef.get();
    return this._enrichTask({ id: doc.id, ...doc.data() });
  },

  async findById(id) {
    const doc = await tasksCollection.doc(id).get();
    if (!doc.exists) return null;
    return this._enrichTask({ id: doc.id, ...doc.data() });
  },

  async findAll(filters = {}) {
    let query = tasksCollection;

    if (filters.technician) {
      query = query.where('technician', '==', filters.technician);
    }
    if (filters.jobOrder) {
      query = query.where('jobOrder', '==', filters.jobOrder);
    }
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters.startDate && filters.endDate) {
      query = query.where('taskDate', '>=', filters.startDate).where('taskDate', '<=', filters.endDate);
    }

    // Order by taskDate descending
    query = query.orderBy('taskDate', 'desc');

    const snapshot = await query.get();
    return snapshot.docs.map(doc => this._enrichTask({ id: doc.id, ...doc.data() }));
  },

  async update(id, data) {
    const doc = await tasksCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Task not found');
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const updateData = {
      ...(data.technician && { technician: data.technician }),
      ...(data.jobOrder && { jobOrder: data.jobOrder }),
      ...(data.taskDate && { taskDate: data.taskDate instanceof Date ? data.taskDate : new Date(data.taskDate) }),
      ...(data.startTime && { startTime: data.startTime instanceof Date ? data.startTime : new Date(data.startTime) }),
      ...(data.endTime !== undefined && { endTime: data.endTime ? (data.endTime instanceof Date ? data.endTime : new Date(data.endTime)) : null }),
      ...(data.unitsCompleted !== undefined && { unitsCompleted: data.unitsCompleted }),
      ...(data.serialNumbersCompleted && { serialNumbersCompleted: data.serialNumbersCompleted }),
      ...(data.status && { status: data.status }),
      ...(data.productivity !== undefined && { productivity: data.productivity }),
      ...(data.efficiency !== undefined && { efficiency: data.efficiency }),
      ...(data.notes !== undefined && { notes: data.notes.trim() }),
      ...(data.issues && { issues: data.issues }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await tasksCollection.doc(id).update(updateData);
    const updated = await tasksCollection.doc(id).get();
    return this._enrichTask({ id: updated.id, ...updated.data() });
  },

  async delete(id) {
    await tasksCollection.doc(id).delete();
    return { id, deleted: true };
  },

  // Helper method to add virtual fields and calculate metrics
  _enrichTask(task) {
    let durationHours = 0;
    if (task.endTime && task.startTime) {
      const endTime = task.endTime instanceof Date ? task.endTime : task.endTime.toDate();
      const startTime = task.startTime instanceof Date ? task.startTime : task.startTime.toDate();
      const diff = endTime - startTime;
      durationHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
    }

    // Recalculate productivity if needed
    let productivity = task.productivity;
    if (durationHours > 0 && task.unitsCompleted > 0) {
      productivity = parseFloat((task.unitsCompleted / durationHours).toFixed(2));
    }

    return {
      ...task,
      durationHours,
      productivity
    };
  },

  async count(filters = {}) {
    const tasks = await this.findAll(filters);
    return tasks.length;
  }
};

export default Task;
