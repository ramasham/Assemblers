import { initializeFirebase } from '../config/firebase.js';
import { collections } from '../services/firestore.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * This script adds multi-department access to specific technicians
 * Example: Mike Davis can now work in both Production and Testing
 */

const multiDepartmentTechnicians = [
  {
    email: 'mike.davis@company.com',
    departments: ['Production', 'Testing', 'Quality'],
    allowedRoles: ['Production Technician', 'Testing Technician', 'Quality Technician']
  },
  {
    email: 'sarah.wilson@company.com',
    departments: ['Production', 'Quality'],
    allowedRoles: ['Production Technician', 'Quality Technician']
  },
  {
    email: 'james.brown@company.com',
    departments: ['Production', 'Testing'],
    allowedRoles: ['Production Technician', 'Testing Technician']
  },
  {
    email: 'emily.chen@company.com',
    departments: ['Testing', 'Quality'],
    allowedRoles: ['Testing Technician', 'Quality Technician']
  }
];

async function addMultiDepartmentAccess() {
  try {
    console.log('\n🔄 Adding Multi-Department Access to Technicians...\n');
    
    // Initialize Firebase
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    const usersCollection = collections.users;
    
    let updated = 0;
    let errors = 0;

    for (const techConfig of multiDepartmentTechnicians) {
      try {
        // Find user by email
        const snapshot = await usersCollection
          .where('email', '==', techConfig.email)
          .limit(1)
          .get();

        if (snapshot.empty) {
          console.log(`⚠️  User not found: ${techConfig.email}`);
          errors++;
          continue;
        }

        const doc = snapshot.docs[0];
        const userId = doc.id;
        const userData = doc.data();

        // Update user with multi-department access
        await usersCollection.doc(userId).update({
          departments: techConfig.departments,
          allowedRoles: techConfig.allowedRoles,
          activeDepartment: techConfig.departments[0], // Set first department as active
          department: techConfig.departments[0] // Update legacy field
        });

        console.log(`✅ ${userData.name} (${techConfig.email})`);
        console.log(`   Departments: ${techConfig.departments.join(', ')}`);
        console.log(`   Can switch between: ${techConfig.allowedRoles.join(' ↔ ')}\n`);
        
        updated++;
      } catch (error) {
        console.error(`❌ Failed to update ${techConfig.email}:`, error.message);
        errors++;
      }
    }

    console.log('='.repeat(80));
    console.log('📊 MULTI-DEPARTMENT ACCESS COMPLETE!');
    console.log('='.repeat(80));
    console.log(`✅ Successfully updated: ${updated} technicians`);
    console.log(`❌ Errors: ${errors}`);
    console.log('='.repeat(80));

    console.log('\n📋 Users with Multi-Department Access:');
    for (const tech of multiDepartmentTechnicians) {
      console.log(`   • ${tech.email}`);
      console.log(`     Departments: ${tech.departments.join(' + ')}`);
    }
    
    console.log('\n🔄 These technicians can now switch departments without logging out!');
    console.log('📱 Use the /api/auth/switch-role endpoint with "department" parameter.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addMultiDepartmentAccess();
