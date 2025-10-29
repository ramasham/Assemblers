import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

const rolesCollection = collections.roles;

const VALID_ROLE_TYPES = ['technician', 'supervisor', 'planner'];
const VALID_DEPARTMENTS = ['production', 'testing', 'quality', 'all'];

const Role = {
  /**
   * Create a new role
   */
  async create(data) {
    if (!data.roleId || !data.roleName || !data.roleType) {
      throw new Error('Missing required fields: roleId, roleName, roleType');
    }

    if (!VALID_ROLE_TYPES.includes(data.roleType)) {
      throw new Error(`Invalid roleType. Must be one of: ${VALID_ROLE_TYPES.join(', ')}`);
    }

    if (data.department && !VALID_DEPARTMENTS.includes(data.department)) {
      throw new Error(`Invalid department. Must be one of: ${VALID_DEPARTMENTS.join(', ')}`);
    }

    // Check if role already exists
    const existing = await this.findByRoleId(data.roleId);
    if (existing) {
      throw new Error(`Role with ID ${data.roleId} already exists`);
    }

    const roleData = {
      roleId: data.roleId.trim(),
      roleName: data.roleName.trim(),
      roleType: data.roleType,
      department: data.department || 'all',
      permissions: data.permissions || this.getDefaultPermissions(data.roleType),
      description: data.description?.trim() || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await rolesCollection.doc(data.roleId).set(roleData);
    return roleData;
  },

  /**
   * Get default permissions based on role type
   */
  getDefaultPermissions(roleType) {
    const basePermissions = {
      canLogTasks: false,
      canViewOwnTasks: false,
      canViewAllTasks: false,
      canApproveTasks: false,
      canRejectTasks: false,
      canCreateJobOrders: false,
      canEditJobOrders: false,
      canDeleteJobOrders: false,
      canViewReports: false,
      canGenerateReports: false,
      canManageUsers: false,
      canViewPerformanceMetrics: false,
      canEditDevices: false,
      departmentRestricted: false
    };

    switch (roleType) {
      case 'technician':
        return {
          ...basePermissions,
          canLogTasks: true,
          canViewOwnTasks: true,
          canEditDevices: true,
          departmentRestricted: true
        };
      
      case 'supervisor':
        return {
          ...basePermissions,
          canViewOwnTasks: true,
          canViewAllTasks: true,
          canApproveTasks: true,
          canRejectTasks: true,
          canViewReports: true,
          canViewPerformanceMetrics: true,
          departmentRestricted: true
        };
      
      case 'planner':
        return {
          ...basePermissions,
          canViewAllTasks: true,
          canCreateJobOrders: true,
          canEditJobOrders: true,
          canViewReports: true,
          canGenerateReports: true,
          canViewPerformanceMetrics: true,
          departmentRestricted: false
        };
      
      default:
        return basePermissions;
    }
  },

  /**
   * Find role by roleId
   */
  async findByRoleId(roleId) {
    const doc = await rolesCollection.doc(roleId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Find all roles
   */
  async findAll(filters = {}) {
    let query = rolesCollection;

    if (filters.roleType) {
      query = query.where('roleType', '==', filters.roleType);
    }
    if (filters.department) {
      query = query.where('department', '==', filters.department);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Update role
   */
  async update(roleId, data) {
    const doc = await rolesCollection.doc(roleId).get();
    if (!doc.exists) {
      throw new Error('Role not found');
    }

    const updateData = {};

    if (data.roleName) updateData.roleName = data.roleName.trim();
    if (data.permissions) updateData.permissions = data.permissions;
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.department) updateData.department = data.department;

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await rolesCollection.doc(roleId).update(updateData);
    const updated = await rolesCollection.doc(roleId).get();
    return { id: updated.id, ...updated.data() };
  },

  /**
   * Delete role
   */
  async delete(roleId) {
    const doc = await rolesCollection.doc(roleId).get();
    if (!doc.exists) {
      throw new Error('Role not found');
    }

    await rolesCollection.doc(roleId).delete();
    return { success: true, message: 'Role deleted successfully' };
  },

  /**
   * Check if user has specific permission
   */
  async hasPermission(roleId, permissionName) {
    const role = await this.findByRoleId(roleId);
    if (!role) return false;
    return role.permissions[permissionName] || false;
  },

  /**
   * Initialize default roles
   */
  async initializeDefaultRoles() {
    const defaultRoles = [
      {
        roleId: 'technician-production',
        roleName: 'Production Technician',
        roleType: 'technician',
        department: 'production',
        description: 'Technician working in the production department'
      },
      {
        roleId: 'technician-testing',
        roleName: 'Testing Technician',
        roleType: 'technician',
        department: 'testing',
        description: 'Technician working in the testing department'
      },
      {
        roleId: 'technician-quality',
        roleName: 'Quality Technician',
        roleType: 'technician',
        department: 'quality',
        description: 'Technician working in the quality department'
      },
      {
        roleId: 'supervisor-production',
        roleName: 'Production Supervisor',
        roleType: 'supervisor',
        department: 'production',
        description: 'Supervisor overseeing production department'
      },
      {
        roleId: 'supervisor-testing',
        roleName: 'Testing Supervisor',
        roleType: 'supervisor',
        department: 'testing',
        description: 'Supervisor overseeing testing department'
      },
      {
        roleId: 'supervisor-quality',
        roleName: 'Quality Supervisor',
        roleType: 'supervisor',
        department: 'quality',
        description: 'Supervisor overseeing quality department'
      },
      {
        roleId: 'engineer-planner',
        roleName: 'Engineer Planner',
        roleType: 'planner',
        department: 'all',
        description: 'Engineer responsible for planning and oversight'
      }
    ];

    const results = [];
    for (const roleData of defaultRoles) {
      try {
        const existing = await this.findByRoleId(roleData.roleId);
        if (!existing) {
          const created = await this.create(roleData);
          results.push({ status: 'created', role: created });
        } else {
          results.push({ status: 'exists', role: existing });
        }
      } catch (error) {
        results.push({ status: 'error', roleId: roleData.roleId, error: error.message });
      }
    }

    return results;
  }
};

export default Role;
