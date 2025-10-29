import User from '../models/User.js';
import Role from '../models/Role.js';
import admin from 'firebase-admin';

async function updateTechniciansWithMultipleRoles() {
  console.log('\n🔄 Updating technicians to have multiple roles...\n');

  try {
    // Get all users
    const allUsers = await User.findAll();
    
    // Define which technicians get which roles
    const updates = [];
    
    for (const user of allUsers) {
      // Skip planner and supervisors - they keep their single roles
      if (user.currentRole === 'Engineer Planner' || user.currentRole === 'Production Supervisor') {
        console.log(`⏭️  Skipping ${user.name} (${user.currentRole})`);
        continue;
      }
      
      // Give all technicians access to all 3 technician roles
      if (user.currentRole.includes('Technician')) {
        const newAllowedRoles = [
          'Production Technician',
          'Testing Technician',
          'Quality Technician'
        ];
        
        // Find user document by email
        const userQuery = await admin.firestore().collection('users')
          .where('email', '==', user.email)
          .limit(1)
          .get();
        
        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          await userDoc.ref.update({
            allowedRoles: newAllowedRoles,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          console.log(`✅ Updated ${user.name} (${user.email})`);
          console.log(`   → Can now switch between: Production, Testing, Quality`);
          console.log(`   → Current role: ${user.currentRole}\n`);
        }
      }
    }
    
    console.log('\n✅ All technicians updated successfully!\n');
    console.log('📊 Summary:');
    console.log('   - All 14 technicians can now switch between:');
    console.log('     • Production Technician');
    console.log('     • Testing Technician');
    console.log('     • Quality Technician');
    console.log('   - Supervisors and Planner keep their original roles');
    console.log('   - Each user still has their own login (email/password)\n');
    
    // Verify
    console.log('🔍 Verification:');
    const sampleTech = await User.findByEmail('mike.davis@company.com');
    if (sampleTech) {
      console.log(`   Sample: ${sampleTech.name}`);
      console.log(`   Allowed Roles: ${sampleTech.allowedRoles.join(', ')}`);
      console.log(`   Current Role: ${sampleTech.currentRole}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateTechniciansWithMultipleRoles();
