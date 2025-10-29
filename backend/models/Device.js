import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

const devicesCollection = collections.devices;

const VALID_STATUSES = ['pending', 'in-progress', 'completed', 'failed'];
const VALID_STAGES = ['production', 'testing', 'quality'];

const Device = {
  /**
   * Create a new device
   */
  async create(data) {
    if (!data.serialNumber || !data.jobOrderId) {
      throw new Error('Missing required fields: serialNumber, jobOrderId');
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (data.currentStage && !VALID_STAGES.includes(data.currentStage)) {
      throw new Error(`Invalid currentStage. Must be one of: ${VALID_STAGES.join(', ')}`);
    }

    // Check for duplicate serial number
    const existing = await this.findBySerialNumber(data.serialNumber);
    if (existing) {
      throw new Error(`Device with serial number ${data.serialNumber} already exists`);
    }

    const deviceData = {
      serialNumber: data.serialNumber.trim(),
      jobOrderId: data.jobOrderId,
      assignedTechnicianId: data.assignedTechnicianId || null,
      status: data.status || 'pending',
      completionTimestamp: data.completionTimestamp || null,
      startTimestamp: data.startTimestamp || null,
      currentStage: data.currentStage || 'production',
      notes: data.notes?.trim() || '',
      defects: data.defects || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await devicesCollection.add(deviceData);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find device by ID
   */
  async findById(id) {
    const doc = await devicesCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find device by serial number
   */
  async findBySerialNumber(serialNumber) {
    const snapshot = await devicesCollection.where('serialNumber', '==', serialNumber).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find all devices with filters
   */
  async findAll(filters = {}) {
    let query = devicesCollection;

    if (filters.jobOrderId) {
      query = query.where('jobOrderId', '==', filters.jobOrderId);
    }
    if (filters.assignedTechnicianId) {
      query = query.where('assignedTechnicianId', '==', filters.assignedTechnicianId);
    }
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters.currentStage) {
      query = query.where('currentStage', '==', filters.currentStage);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Update device
   */
  async update(id, data) {
    const doc = await devicesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Device not found');
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (data.currentStage && !VALID_STAGES.includes(data.currentStage)) {
      throw new Error(`Invalid currentStage. Must be one of: ${VALID_STAGES.join(', ')}`);
    }

    const updateData = {};

    if (data.assignedTechnicianId !== undefined) updateData.assignedTechnicianId = data.assignedTechnicianId;
    if (data.status) {
      updateData.status = data.status;
      if (data.status === 'completed' && !data.completionTimestamp) {
        updateData.completionTimestamp = admin.firestore.FieldValue.serverTimestamp();
      }
      if (data.status === 'in-progress' && !doc.data().startTimestamp) {
        updateData.startTimestamp = admin.firestore.FieldValue.serverTimestamp();
      }
    }
    if (data.completionTimestamp) updateData.completionTimestamp = data.completionTimestamp;
    if (data.startTimestamp) updateData.startTimestamp = data.startTimestamp;
    if (data.currentStage) updateData.currentStage = data.currentStage;
    if (data.notes !== undefined) updateData.notes = data.notes.trim();
    if (data.defects) updateData.defects = data.defects;

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await devicesCollection.doc(id).update(updateData);
    const updated = await devicesCollection.doc(id).get();
    return { id: updated.id, ...updated.data() };
  },

  /**
   * Add defect to device
   */
  async addDefect(id, defect) {
    const doc = await devicesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Device not found');
    }

    await devicesCollection.doc(id).update({
      defects: admin.firestore.FieldValue.arrayUnion(defect),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updated = await devicesCollection.doc(id).get();
    return { id: updated.id, ...updated.data() };
  },

  /**
   * Assign technician to device
   */
  async assignTechnician(id, technicianId) {
    const doc = await devicesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Device not found');
    }

    const updateData = {
      assignedTechnicianId: technicianId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Set start timestamp if device is pending
    if (doc.data().status === 'pending') {
      updateData.status = 'in-progress';
      updateData.startTimestamp = admin.firestore.FieldValue.serverTimestamp();
    }

    await devicesCollection.doc(id).update(updateData);
    const updated = await devicesCollection.doc(id).get();
    return { id: updated.id, ...updated.data() };
  },

  /**
   * Mark device as completed
   */
  async markCompleted(id) {
    const doc = await devicesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Device not found');
    }

    await devicesCollection.doc(id).update({
      status: 'completed',
      completionTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updated = await devicesCollection.doc(id).get();
    return { id: updated.id, ...updated.data() };
  },

  /**
   * Get device count by job order
   */
  async getCountByJobOrder(jobOrderId) {
    const snapshot = await devicesCollection.where('jobOrderId', '==', jobOrderId).get();
    return snapshot.size;
  },

  /**
   * Get completed device count by job order
   */
  async getCompletedCountByJobOrder(jobOrderId) {
    const snapshot = await devicesCollection
      .where('jobOrderId', '==', jobOrderId)
      .where('status', '==', 'completed')
      .get();
    return snapshot.size;
  },

  /**
   * Delete device
   */
  async delete(id) {
    const doc = await devicesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Device not found');
    }

    await devicesCollection.doc(id).delete();
    return { success: true, message: 'Device deleted successfully' };
  },

  /**
   * Bulk create devices for a job order
   */
  async bulkCreate(jobOrderId, serialNumbers) {
    if (!Array.isArray(serialNumbers) || serialNumbers.length === 0) {
      throw new Error('Serial numbers must be a non-empty array');
    }

    const batch = admin.firestore().batch();
    const createdDevices = [];

    for (const serialNumber of serialNumbers) {
      const deviceData = {
        serialNumber: serialNumber.trim(),
        jobOrderId,
        assignedTechnicianId: null,
        status: 'pending',
        completionTimestamp: null,
        startTimestamp: null,
        currentStage: 'production',
        notes: '',
        defects: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = devicesCollection.doc();
      batch.set(docRef, deviceData);
      createdDevices.push({ id: docRef.id, ...deviceData });
    }

    await batch.commit();
    return createdDevices;
  }
};

export default Device;
