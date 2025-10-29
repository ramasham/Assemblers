import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync(new URL('../config/serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupRoleSwitching() {
  console.log('🔧 Setting up role switching for technicians and supervisors...\n');

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    let updates = 0;
    
    for (const doc of snapshot.docs) {
      const user = doc.data();
      const updates_needed = {};
      
      // Skip planners - they don't need role switching
      if (user.currentRole === 'planner') {
        console.log(`⏭️  Skipping ${user.email} (planner)`);
        continue;
      }
      
      // TECHNICIANS: Set up allowedRoles for role switching
      if (user.currentRole === 'technician') {
        // Mike Davis gets ALL 3 departments
        if (user.email === 'mike.davis@company.com') {
          updates_needed.departments = ['Production', 'Testing', 'Quality'];
          updates_needed.activeDepartment = 'Production';
          updates_needed.mainRole = 'technician';
          updates_needed.allowedRoles = ['technician', 'supervisor', 'planner'];
          updates_needed.permissions = {
            canApprove: false,
            canAssign: false,
            canViewReports: false,
            canCreateJobOrders: false
          };
          console.log(`✅ ${user.email} - ALL 3 departments + role switching`);
        } 
        // Other technicians: 1 department only, but can switch roles
        else {
          updates_needed.departments = [user.department];
          updates_needed.activeDepartment = user.department;
          updates_needed.mainRole = 'technician';
          updates_needed.allowedRoles = ['technician', 'supervisor', 'planner'];
          updates_needed.permissions = {
            canApprove: false,
            canAssign: false,
            canViewReports: false,
            canCreateJobOrders: false
          };
          console.log(`✅ ${user.email} - ${user.department} dept + role switching`);
        }
        
        await usersRef.doc(doc.id).update(updates_needed);
        updates++;
      }
      
      // SUPERVISORS: Set up allowedRoles for role switching
      if (user.currentRole === 'supervisor') {
        updates_needed.departments = [user.department];
        updates_needed.activeDepartment = user.department;
        updates_needed.mainRole = 'supervisor';
        updates_needed.allowedRoles = ['technician', 'supervisor', 'planner'];
        updates_needed.permissions = {
          canApprove: true,
          canAssign: true,
          canViewReports: true,
          canCreateJobOrders: false
        };
        
        await usersRef.doc(doc.id).update(updates_needed);
        console.log(`✅ ${user.email} - ${user.department} dept + role switching`);
        updates++;
      }
    }
    
    console.log(`\n✅ Updated ${updates} users with role switching capability!`);
    console.log('\n📋 Summary:');
    console.log('   - Mike Davis: ALL 3 departments (Production, Testing, Quality)');
    console.log('   - Other technicians: 1 department each');
    console.log('   - All technicians: Can switch roles (technician/supervisor/planner)');
    console.log('   - All supervisors: Can switch roles (technician/supervisor/planner)');
    console.log('   - Planners: No changes (already have full access)');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
}

setupRoleSwitching();
