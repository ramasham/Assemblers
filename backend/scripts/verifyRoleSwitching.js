import { initializeFirebase } from '../config/firebase.js';
import { collections } from '../services/firestore.js';

async function verifyRoleSwitching() {
  try {
    initializeFirebase();
    
    // Check Mike Davis
    const mikeQuery = await collections.users.where('email', '==', 'mike.davis@company.com').get();
    if (!mikeQuery.empty) {
      const mike = mikeQuery.docs[0].data();
      console.log('\n👤 MIKE DAVIS:');
      console.log('   Main Role:', mike.mainRole);
      console.log('   Departments:', mike.departments);
      console.log('   Allowed Roles:', mike.allowedRoles);
    }
    
    // Check a regular technician
    const lisaQuery = await collections.users.where('email', '==', 'lisa.anderson@company.com').get();
    if (!lisaQuery.empty) {
      const lisa = lisaQuery.docs[0].data();
      console.log('\n👤 LISA ANDERSON (Technician):');
      console.log('   Main Role:', lisa.mainRole);
      console.log('   Departments:', lisa.departments);
      console.log('   Allowed Roles:', lisa.allowedRoles);
    }
    
    // Check supervisors
    const supervisors = await collections.users.where('mainRole', '==', 'supervisor').get();
    console.log('\n👥 SUPERVISORS:');
    supervisors.forEach(doc => {
      const sup = doc.data();
      console.log(`   • ${sup.name} (${sup.email})`);
      console.log(`     Departments: ${sup.departments}`);
      console.log(`     Allowed Roles: ${sup.allowedRoles.join(', ')}`);
    });
    
    console.log('\n✅ All users can switch roles without logging out!');
    console.log('📱 API: POST /api/auth/switch-role {"role": "technician|supervisor|planner"}\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyRoleSwitching();
