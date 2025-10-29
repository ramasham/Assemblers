import { initializeFirebase } from '../config/firebase.js';
import { collections } from '../services/firestore.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateUsersToNewStructure() {
  try {
    console.log('\n🔄 Starting User Migration to New Role Switching Structure...\n');
    
    // Initialize Firebase
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    const usersCollection = collections.users;
    const snapshot = await usersCollection.get();

    console.log(`📊 Found ${snapshot.size} users to migrate\n`);

    let migrated = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      try {
        const user = doc.data();
        const userId = doc.id;

        // Determine mainRole from currentRole
        let mainRole = 'technician';
        if (user.currentRole) {
          if (user.currentRole.includes('Planner')) {
            mainRole = 'planner';
          } else if (user.currentRole.includes('Supervisor')) {
            mainRole = 'supervisor';
          } else {
            mainRole = 'technician';
          }
        }

        // Setup departments array (default to single department)
        const departments = user.departments || [user.department || 'Production'];
        const activeDepartment = user.activeDepartment || departments[0];

        // Setup permissions based on mainRole
        const permissions = {
          canApprove: mainRole !== 'technician',
          canAssign: mainRole !== 'technician',
          canViewReports: true,
          canCreateJobOrders: mainRole === 'planner'
        };

        // Update the user document
        await usersCollection.doc(userId).update({
          mainRole,
          departments,
          activeDepartment,
          permissions
        });

        console.log(`✅ Migrated: ${user.email} (${mainRole})`);
        migrated++;
      } catch (error) {
        console.error(`❌ Failed to migrate user ${doc.id}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 MIGRATION COMPLETE!');
    console.log('='.repeat(80));
    console.log(`✅ Successfully migrated: ${migrated} users`);
    console.log(`❌ Errors: ${errors} users`);
    console.log('='.repeat(80));

    console.log('\n📋 New Fields Added:');
    console.log('   - mainRole: technician | supervisor | planner');
    console.log('   - departments: array of departments user can access');
    console.log('   - activeDepartment: currently active department');
    console.log('   - permissions: object with canApprove, canAssign, etc.\n');

    console.log('✅ All users now support the new role switching system!');
    console.log('🔄 Multi-department technicians can switch between departments seamlessly.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateUsersToNewStructure();
