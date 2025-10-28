import { admin, initializeFirebase } from '../config/firebase.js';

// Initialize Firebase
initializeFirebase();

// Get Firestore instance
const db = admin.firestore();

// Collection references
export const collections = {
  technicians: db.collection('technicians'),
  jobOrders: db.collection('jobOrders'),
  tasks: db.collection('tasks'),
  alerts: db.collection('alerts')
};

// Helper functions for common operations
export const firestoreHelpers = {
  // Get document by ID
  async getById(collection, id) {
    const doc = await collections[collection].doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // Get all documents in a collection
  async getAll(collection) {
    const snapshot = await collections[collection].get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Find documents by field value
  async findByField(collection, field, value) {
    const snapshot = await collections[collection].where(field, '==', value).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Create a new document
  async create(collection, data) {
    const docRef = await collections[collection].add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  },

  // Update a document
  async update(collection, id, data) {
    await collections[collection].doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await collections[collection].doc(id).get();
    return { id: doc.id, ...doc.data() };
  },

  // Delete a document
  async delete(collection, id) {
    await collections[collection].doc(id).delete();
    return { id, deleted: true };
  },

  // Query with multiple conditions
  async query(collection, conditions = []) {
    let query = collections[collection];
    conditions.forEach(({ field, operator, value }) => {
      query = query.where(field, operator, value);
    });
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Batch write operations
  async batchWrite(operations) {
    const batch = db.batch();
    operations.forEach(({ type, collection, id, data }) => {
      const docRef = id ? collections[collection].doc(id) : collections[collection].doc();
      if (type === 'create' || type === 'set') {
        batch.set(docRef, {
          ...data,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else if (type === 'update') {
        batch.update(docRef, {
          ...data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else if (type === 'delete') {
        batch.delete(docRef);
      }
    });
    await batch.commit();
  }
};

// Export Firestore instance
export { db };
export default db;
