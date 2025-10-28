import { collections, firestoreHelpers } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

// Firestore collection reference
const techniciansCollection = collections.technicians;

// Validation constants
const VALID_ROLES = ['production', 'quality', 'testing', 'supervisor', 'planner'];
const VALID_SHIFTS = ['morning', 'afternoon', 'night'];

// Technician Model (Firestore)
const Technician = {
  // Create a new technician
  async create(data) {
    // Validate required fields
    if (!data.employeeId || !data.name || !data.email) {
      throw new Error('Missing required fields: employeeId, name, email');
    }

    // Validate role
    if (data.role && !VALID_ROLES.includes(data.role)) {
      throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
    }

    // Validate shift timing
    if (data.shiftTiming && !VALID_SHIFTS.includes(data.shiftTiming)) {
      throw new Error(`Invalid shift timing. Must be one of: ${VALID_SHIFTS.join(', ')}`);
    }

    // Check for duplicates
    const existingByEmployeeId = await this.findByEmployeeId(data.employeeId);
    if (existingByEmployeeId) {
      throw new Error(`Technician with employeeId ${data.employeeId} already exists`);
    }

    const existingByEmail = await this.findByEmail(data.email);
    if (existingByEmail) {
      throw new Error(`Technician with email ${data.email} already exists`);
    }

    // Set defaults
    const technicianData = {
      employeeId: data.employeeId.trim(),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      role: data.role || 'production',
      phoneNumber: data.phoneNumber?.trim() || '',
      specialization: data.specialization?.trim() || '',
      shiftTiming: data.shiftTiming || 'morning',
      isActive: data.isActive !== undefined ? data.isActive : true,
      firebaseUid: data.firebaseUid || null,
      performanceMetrics: {
        totalTasksCompleted: 0,
        averageProductivity: 0,
        averageEfficiency: 0,
        utilizationRate: 0,
        ...(data.performanceMetrics || {})
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await techniciansCollection.add(technicianData);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  },

  // Find technician by ID
  async findById(id) {
    const doc = await techniciansCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // Find technician by employeeId
  async findByEmployeeId(employeeId) {
    const snapshot = await techniciansCollection.where('employeeId', '==', employeeId).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  // Find technician by email
  async findByEmail(email) {
    const snapshot = await techniciansCollection.where('email', '==', email.toLowerCase()).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  // Find technician by Firebase UID
  async findByFirebaseUid(firebaseUid) {
    const snapshot = await techniciansCollection.where('firebaseUid', '==', firebaseUid).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  // Find all technicians
  async findAll(filters = {}) {
    let query = techniciansCollection;

    // Apply filters
    if (filters.role) {
      query = query.where('role', '==', filters.role);
    }
    if (filters.isActive !== undefined) {
      query = query.where('isActive', '==', filters.isActive);
    }
    if (filters.shiftTiming) {
      query = query.where('shiftTiming', '==', filters.shiftTiming);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update technician
  async update(id, data) {
    const doc = await techniciansCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Technician not found');
    }

    // Validate role if provided
    if (data.role && !VALID_ROLES.includes(data.role)) {
      throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
    }

    // Validate shift timing if provided
    if (data.shiftTiming && !VALID_SHIFTS.includes(data.shiftTiming)) {
      throw new Error(`Invalid shift timing. Must be one of: ${VALID_SHIFTS.join(', ')}`);
    }

    const updateData = {
      ...(data.name && { name: data.name.trim() }),
      ...(data.email && { email: data.email.toLowerCase().trim() }),
      ...(data.role && { role: data.role }),
      ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber.trim() }),
      ...(data.specialization !== undefined && { specialization: data.specialization.trim() }),
      ...(data.shiftTiming && { shiftTiming: data.shiftTiming }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.firebaseUid && { firebaseUid: data.firebaseUid }),
      ...(data.performanceMetrics && { performanceMetrics: data.performanceMetrics }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await techniciansCollection.doc(id).update(updateData);
    const updated = await techniciansCollection.doc(id).get();
    return { id: updated.id, ...updated.data() };
  },

  // Delete technician (soft delete by default)
  async delete(id, hard = false) {
    if (hard) {
      await techniciansCollection.doc(id).delete();
      return { id, deleted: true };
    } else {
      // Soft delete
      await techniciansCollection.doc(id).update({
        isActive: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      const updated = await techniciansCollection.doc(id).get();
      return { id: updated.id, ...updated.data() };
    }
  },

  // Update performance metrics
  async updatePerformanceMetrics(id, metrics) {
    const doc = await techniciansCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Technician not found');
    }

    const currentData = doc.data();
    const updatedMetrics = {
      ...currentData.performanceMetrics,
      ...metrics
    };

    await techniciansCollection.doc(id).update({
      performanceMetrics: updatedMetrics,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const updated = await techniciansCollection.doc(id).get();
    return { id: updated.id, ...updated.data() };
  },

  // Count technicians
  async count(filters = {}) {
    const technicians = await this.findAll(filters);
    return technicians.length;
  }
};

export default Technician;
