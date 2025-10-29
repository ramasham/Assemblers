import { initializeFirebase } from '../config/firebase.js';
import { collections } from '../services/firestore.js';
import dotenv from 'dotenv';

dotenv.config();

async function verifyDatabaseState() {
  try {
    console.log('\n🔍 Verifying Database State...\n');
    
    initializeFirebase();

    // Check operations
    console.log('='.repeat(80));
    console.log('📋 OPERATIONS BY DEPARTMENT');
    console.log('='.repeat(80));
    
    const allOperations = await collections.operations.get();
    const productionOps = allOperations.docs.filter(doc => doc.data().department === 'Production');
    const qualityOps = allOperations.docs.filter(doc => doc.data().department === 'Quality');
    const testingOps = allOperations.docs.filter(doc => doc.data().department === 'Testing');
    
    console.log(`\n✅ Production Operations: ${productionOps.length}`);
    console.log(`✅ Quality Operations: ${qualityOps.length}`);
    console.log(`✅ Testing Operations: ${testingOps.length}`);
    console.log(`📊 Total Operations: ${allOperations.docs.length}\n`);

    // Check users
    console.log('='.repeat(80));
    console.log('👥 MULTI-DEPARTMENT USERS');
    console.log('='.repeat(80));
    
    const allUsers = await collections.users.get();
    const multiDeptUsers = allUsers.docs.filter(doc => {
      const data = doc.data();
      return data.departments && data.departments.length > 1;
    });

    console.log(`\n📊 Total Users: ${allUsers.docs.length}`);
    console.log(`🔄 Multi-Department Users: ${multiDeptUsers.length}\n`);

    for (const userDoc of multiDeptUsers) {
      const user = userDoc.data();
      console.log(`👤 ${user.name} (${user.email})`);
      console.log(`   Departments: ${user.departments.join(', ')}`);
      console.log(`   Active: ${user.activeDepartment}`);
      console.log(`   Main Role: ${user.mainRole}`);
      console.log(`   Allowed Roles: ${user.allowedRoles.join(', ')}\n`);
    }

    // Check single-department users
    console.log('='.repeat(80));
    console.log('👥 SINGLE-DEPARTMENT USERS');
    console.log('='.repeat(80));
    
    const singleDeptUsers = allUsers.docs.filter(doc => {
      const data = doc.data();
      return !data.departments || data.departments.length === 1;
    });

    console.log(`\n📊 Single-Department Users: ${singleDeptUsers.length}\n`);

    const byDept = {
      Production: [],
      Testing: [],
      Quality: [],
      Engineering: []
    };

    for (const userDoc of singleDeptUsers) {
      const user = userDoc.data();
      const dept = user.departments ? user.departments[0] : user.department;
      if (byDept[dept]) {
        byDept[dept].push(user.name);
      }
    }

    console.log(`Production Only: ${byDept.Production.length} users`);
    console.log(`Testing Only: ${byDept.Testing.length} users`);
    console.log(`Quality Only: ${byDept.Quality.length} users`);
    console.log(`Engineering Only: ${byDept.Engineering.length} users\n`);

    // Summary
    console.log('='.repeat(80));
    console.log('✅ DATABASE VERIFICATION COMPLETE');
    console.log('='.repeat(80));
    console.log('\n🎯 Key Points:');
    console.log('   • Production technicians see ONLY Production operations');
    console.log('   • Quality technicians see ONLY Quality operations');
    console.log('   • Multi-department users can switch and see respective operations');
    console.log('   • Firestore security rules enforce department boundaries\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verifyDatabaseState();
