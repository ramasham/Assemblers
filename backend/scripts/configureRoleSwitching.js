import { initializeFirebase } from '../config/firebase.js';
import { collections } from '../services/firestore.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configure role switching for technicians and supervisors
 * - Mike Davis: Only technician with ALL 3 departments
 * - Other technicians: 1 department each, can switch roles
 * - Supervisors: Can switch roles
 */

async function configureRoleSwitching() {
  try {
    console.log('\n🔄 Configuring Role Switching...\n');
    
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    const usersCollection = collections.users;
    const allUsers = await usersCollection.get();
    
    let updated = 0;

    for (const doc of allUsers.docs) {
      const userData = doc.data();
      const userId = doc.id;
      
      // Skip planners (they don't switch roles)
      if (userData.currentRole === 'Planner') {
        continue;
      }

      let updateData = {};

      // ========================================
      // MIKE DAVIS - Special case: All 3 departments
      // ========================================
      if (userData.email === 'mike.davis@company.com') {
        updateData = {
          mainRole: 'technician',
          departments: ['Production', 'Testing', 'Quality'],
          activeDepartment: 'Production',
          department: 'Production',
          allowedRoles: ['technician', 'supervisor', 'planner'], // Can switch to ANY role
          permissions: {
            canApprove: false,
            canAssign: false,
            canViewReports: false,
            canCreateJobOrders: false
          }
        };
        console.log(`✅ Mike Davis - ALL 3 DEPARTMENTS (can switch to any role)`);
      }
      
      // ========================================
      // OTHER TECHNICIANS - 1 department each, can switch ANY role
      // ========================================
      else if (userData.currentRole && userData.currentRole.includes('Technician')) {
        const dept = userData.department || 'Production';
        updateData = {
          mainRole: 'technician',
          departments: [dept], // Only 1 department
          activeDepartment: dept,
          department: dept,
          allowedRoles: ['technician', 'supervisor', 'planner'], // Can switch to ANY role
          permissions: {
            canApprove: false,
            canAssign: false,
            canViewReports: false,
            canCreateJobOrders: false
          }
        };
        console.log(`✅ ${userData.name} - ${dept} only (can switch to any role)`);
      }
      
      // ========================================
      // SUPERVISORS - Can switch to ANY role
      // ========================================
      else if (userData.currentRole && userData.currentRole.includes('Supervisor')) {
        const dept = userData.department || 'Production';
        updateData = {
          mainRole: 'supervisor',
          departments: [dept],
          activeDepartment: dept,
          department: dept,
          allowedRoles: ['technician', 'supervisor', 'planner'], // Can switch to ANY role
          permissions: {
            canApprove: true,
            canAssign: true,
            canViewReports: true,
            canCreateJobOrders: false
          }
        };
        console.log(`✅ ${userData.name} - ${dept} Supervisor (can switch to any role)`);
      }

      // Update the user
      if (Object.keys(updateData).length > 0) {
        await usersCollection.doc(userId).update(updateData);
        updated++;
      }
    }

    console.log('\n='.repeat(80));
    console.log('📊 ROLE SWITCHING CONFIGURATION COMPLETE!');
    console.log('='.repeat(80));
    console.log(`✅ Successfully updated: ${updated} users\n`);

    console.log('📋 Configuration Summary:');
    console.log('   • Mike Davis: 3 departments (Production + Testing + Quality) - Can switch roles');
    console.log('   • Other Technicians: 1 department each - Can switch to ANY role');
    console.log('   • Supervisors: 1 department each - Can switch to ANY role');
    console.log('   • Planners: No role switching (admin level)\n');

    console.log('🔄 All technicians and supervisors can switch roles: technician ↔ supervisor ↔ planner');
    console.log('📱 Use: POST /api/auth/switch-role with {"role": "technician|supervisor|planner"}\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

configureRoleSwitching();
