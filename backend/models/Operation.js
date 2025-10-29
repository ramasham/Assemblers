import { db } from '../services/firestore.js';

class Operation {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category; // 'Quality', 'Production', 'Test', 'Troubleshooting', 'Sub-Assemblies'
    this.standardTime = data.standardTime; // in minutes
    this.description = data.description || '';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create a new operation
  static async create(operationData) {
    try {
      const operation = new Operation(operationData);
      const docRef = await db.collection('operations').add({
        name: operation.name,
        category: operation.category,
        standardTime: operation.standardTime,
        description: operation.description,
        isActive: operation.isActive,
        createdAt: operation.createdAt,
        updatedAt: operation.updatedAt
      });
      
      operation.id = docRef.id;
      return operation;
    } catch (error) {
      throw new Error(`Failed to create operation: ${error.message}`);
    }
  }

  // Get all operations
  static async findAll(filters = {}) {
    try {
      let query = db.collection('operations');
      
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      if (filters.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }
      
      const snapshot = await query.get();
      const operations = [];
      
      snapshot.forEach(doc => {
        operations.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return operations;
    } catch (error) {
      throw new Error(`Failed to fetch operations: ${error.message}`);
    }
  }

  // Get operation by ID
  static async findById(id) {
    try {
      const doc = await db.collection('operations').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Failed to fetch operation: ${error.message}`);
    }
  }

  // Update operation
  static async update(id, updateData) {
    try {
      const updates = {
        ...updateData,
        updatedAt: new Date()
      };
      
      await db.collection('operations').doc(id).update(updates);
      
      return await Operation.findById(id);
    } catch (error) {
      throw new Error(`Failed to update operation: ${error.message}`);
    }
  }

  // Delete operation (soft delete)
  static async delete(id) {
    try {
      await db.collection('operations').doc(id).update({
        isActive: false,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to delete operation: ${error.message}`);
    }
  }

  // Get operations by category
  static async findByCategory(category) {
    try {
      const snapshot = await db.collection('operations')
        .where('category', '==', category)
        .where('isActive', '==', true)
        .get();
      
      const operations = [];
      snapshot.forEach(doc => {
        operations.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return operations;
    } catch (error) {
      throw new Error(`Failed to fetch operations by category: ${error.message}`);
    }
  }

  // Calculate total standard time for multiple operations
  static async calculateTotalStandardTime(operationIds) {
    try {
      const operations = await Promise.all(
        operationIds.map(id => Operation.findById(id))
      );
      
      const totalTime = operations.reduce((sum, op) => {
        return sum + (op?.standardTime || 0);
      }, 0);
      
      return totalTime;
    } catch (error) {
      throw new Error(`Failed to calculate total standard time: ${error.message}`);
    }
  }
}

export default Operation;
