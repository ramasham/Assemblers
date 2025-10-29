import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';
import bcrypt from 'bcrypt';

const usersCollection = collections.users;

// Validation constants
const VALID_ROLE_TYPES = ['technician', 'supervisor', 'planner'];
const VALID_DEPARTMENTS = ['production', 'testing', 'quality', 'all'];

const User = {
  /**
   * Create a new user
   */
  async create(data) {
    // Validate required fields
    if (!data.employeeId || !data.name || !data.email || !data.password) {
      throw new Error('Missing required fields: employeeId, name, email, password');
    }

    // Check for duplicates
    const existingByEmployeeId = await this.findByEmployeeId(data.employeeId);
    if (existingByEmployeeId) {
      throw new Error(`User with employeeId ${data.employeeId} already exists`);
    }

    const existingByEmail = await this.findByEmail(data.email);
    if (existingByEmail) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create Firebase Auth user if firebaseUid not provided
    let firebaseUid = data.firebaseUid;
    if (!firebaseUid) {
      try {
        const firebaseUser = await admin.auth().createUser({
          email: data.email.toLowerCase().trim(),
          password: data.password,
          displayName: data.name.trim(),
        });
        firebaseUid = firebaseUser.uid;
      } catch (error) {
        // If user already exists in Firebase Auth, try to get existing user
        if (error.code === 'auth/email-already-exists') {
          try {
            const existingFirebaseUser = await admin.auth().getUserByEmail(data.email.toLowerCase().trim());
            firebaseUid = existingFirebaseUser.uid;
            console.log(`  ℹ️  Using existing Firebase Auth user for ${data.email}`);
          } catch (getError) {
            throw new Error(`Failed to get existing Firebase user: ${getError.message}`);
          }
        } else {
          throw new Error(`Failed to create Firebase user: ${error.message}`);
        }
      }
    }

    const userData = {
      employeeId: data.employeeId.trim(),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      firebaseUid,
      phoneNumber: data.phoneNumber?.trim() || '',
      currentRole: data.currentRole || null,
      department: data.department || 'production',
      allowedRoles: data.allowedRoles || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      profileImage: data.profileImage || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null
    };

    const docRef = await usersCollection.add(userData);
    const doc = await docRef.get();
    
    // Don't return password hash
    const user = { id: doc.id, ...doc.data() };
    delete user.passwordHash;
    return user;
  },

  /**
   * Find user by ID
   */
  async findById(id) {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return null;
    const user = { id: doc.id, ...doc.data() };
    delete user.passwordHash;
    return user;
  },

  /**
   * Find user by employee ID
   */
  async findByEmployeeId(employeeId) {
    const snapshot = await usersCollection.where('employeeId', '==', employeeId).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const user = { id: doc.id, ...doc.data() };
    delete user.passwordHash;
    return user;
  },

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const snapshot = await usersCollection.where('email', '==', email.toLowerCase()).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find user by Firebase UID
   */
  async findByFirebaseUid(firebaseUid) {
    const snapshot = await usersCollection.where('firebaseUid', '==', firebaseUid).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const user = { id: doc.id, ...doc.data() };
    delete user.passwordHash;
    return user;
  },

  /**
   * Find all users with filters
   */
  async findAll(filters = {}) {
    let query = usersCollection;

    if (filters.currentRole) {
      query = query.where('currentRole', '==', filters.currentRole);
    }
    if (filters.department) {
      query = query.where('department', '==', filters.department);
    }
    if (filters.isActive !== undefined) {
      query = query.where('isActive', '==', filters.isActive);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
      const user = { id: doc.id, ...doc.data() };
      delete user.passwordHash;
      return user;
    });
  },

  /**
   * Update user
   */
  async update(id, data) {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }

    const updateData = {};

    if (data.name) updateData.name = data.name.trim();
    if (data.email) {
      // Check if email is already taken by another user
      const existing = await this.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new Error('Email already in use');
      }
      updateData.email = data.email.toLowerCase().trim();
    }
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber.trim();
    if (data.currentRole !== undefined) updateData.currentRole = data.currentRole;
    if (data.department) updateData.department = data.department;
    if (data.allowedRoles) updateData.allowedRoles = data.allowedRoles;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;
    
    // Update password if provided
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await usersCollection.doc(id).update(updateData);
    const updated = await usersCollection.doc(id).get();
    const user = { id: updated.id, ...updated.data() };
    delete user.passwordHash;
    return user;
  },

  /**
   * Update last login time
   */
  async updateLastLogin(id) {
    await usersCollection.doc(id).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });
  },

  /**
   * Verify password
   */
  async verifyPassword(email, password) {
    const snapshot = await usersCollection.where('email', '==', email.toLowerCase()).limit(1).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const user = { id: doc.id, ...doc.data() };
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;
    
    delete user.passwordHash;
    return user;
  },

  /**
   * Switch user role
   */
  async switchRole(userId, newRoleId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is allowed to switch to this role
    if (!user.allowedRoles.includes(newRoleId)) {
      throw new Error('User is not allowed to switch to this role');
    }

    await usersCollection.doc(userId).update({
      currentRole: newRoleId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return await this.findById(userId);
  },

  /**
   * Delete user (soft delete by setting isActive to false)
   */
  async delete(id) {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }

    await usersCollection.doc(id).update({
      isActive: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'User deactivated successfully' };
  },

  /**
   * Hard delete user (permanent)
   */
  async hardDelete(id) {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }

    const userData = doc.data();
    
    // Delete Firebase Auth user
    if (userData.firebaseUid) {
      try {
        await admin.auth().deleteUser(userData.firebaseUid);
      } catch (error) {
        console.error('Failed to delete Firebase user:', error);
      }
    }

    await usersCollection.doc(id).delete();
    return { success: true, message: 'User permanently deleted' };
  }
};

export default User;
