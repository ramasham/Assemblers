import User from '../models/User.js';
import Role from '../models/Role.js';
import admin from 'firebase-admin';

async function setupExactUsers() {
  console.log('\n🗑️  Cleaning up existing users...\n');

  try {
    // Delete all existing users from Firestore
    const usersSnapshot = await admin.firestore().collection('users').get();
    const deletePromises = usersSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${usersSnapshot.docs.length} users from Firestore`);

    // Delete all existing users from Firebase Auth
    let deletedAuthCount = 0;
    const listUsersResult = await admin.auth().listUsers();
    for (const user of listUsersResult.users) {
      try {
        await admin.auth().deleteUser(user.uid);
        deletedAuthCount++;
      } catch (error) {
        console.log(`⚠️  Could not delete ${user.email}: ${error.message}`);
      }
    }
    console.log(`✅ Deleted ${deletedAuthCount} users from Firebase Auth\n`);

  } catch (error) {
    console.error('Error cleaning up:', error.message);
  }

  console.log('👥 Creating NEW users...\n');

  // 1 Engineer Planner
  const planner = await User.create({
    email: 'planner@company.com',
    password: 'eng123',
    name: 'John Smith',
    employeeId: 'ENG-001',
    allowedRoles: ['Engineer Planner'],
    currentRole: 'Engineer Planner',
    department: 'Engineering',
    phoneNumber: '+1234567890'
  });
  console.log('✅ Created Engineer Planner: planner@company.com');

  // 3 Supervisors (Production, Testing, Quality)
  const supervisors = [
    {
      email: 'supervisor.production@company.com',
      name: 'Sarah Johnson',
      employeeId: 'SUP-P001',
      department: 'Production'
    },
    {
      email: 'supervisor.testing@company.com',
      name: 'Michael Rodriguez',
      employeeId: 'SUP-T001',
      department: 'Testing'
    },
    {
      email: 'supervisor.quality@company.com',
      name: 'Jennifer Martinez',
      employeeId: 'SUP-Q001',
      department: 'Quality'
    }
  ];

  for (const sup of supervisors) {
    await User.create({
      email: sup.email,
      password: 'sup123',
      name: sup.name,
      employeeId: sup.employeeId,
      allowedRoles: ['Production Supervisor'],
      currentRole: 'Production Supervisor',
      department: sup.department,
      phoneNumber: '+1234567890'
    });
    console.log(`✅ Created Supervisor (${sup.department}): ${sup.email}`);
  }

  // 14 Technicians (5 Production, 5 Testing, 4 Quality)
  const technicians = [
    // 5 Production Technicians
    { name: 'Mike Davis', email: 'mike.davis@company.com', id: 'TECH-P001', dept: 'Production', role: 'Production Technician' },
    { name: 'Sarah Wilson', email: 'sarah.wilson@company.com', id: 'TECH-P002', dept: 'Production', role: 'Production Technician' },
    { name: 'James Brown', email: 'james.brown@company.com', id: 'TECH-P003', dept: 'Production', role: 'Production Technician' },
    { name: 'Lisa Anderson', email: 'lisa.anderson@company.com', id: 'TECH-P004', dept: 'Production', role: 'Production Technician' },
    { name: 'Robert Martinez', email: 'robert.martinez@company.com', id: 'TECH-P005', dept: 'Production', role: 'Production Technician' },
    
    // 5 Testing Technicians
    { name: 'Emily Chen', email: 'emily.chen@company.com', id: 'TECH-T001', dept: 'Testing', role: 'Testing Technician' },
    { name: 'David Lee', email: 'david.lee@company.com', id: 'TECH-T002', dept: 'Testing', role: 'Testing Technician' },
    { name: 'Jennifer Garcia', email: 'jennifer.garcia@company.com', id: 'TECH-T003', dept: 'Testing', role: 'Testing Technician' },
    { name: 'Michael Taylor', email: 'michael.taylor@company.com', id: 'TECH-T004', dept: 'Testing', role: 'Testing Technician' },
    { name: 'Amanda White', email: 'amanda.white@company.com', id: 'TECH-T005', dept: 'Testing', role: 'Testing Technician' },
    
    // 4 Quality Technicians
    { name: 'Christopher Harris', email: 'christopher.harris@company.com', id: 'TECH-Q001', dept: 'Quality', role: 'Quality Technician' },
    { name: 'Jessica Thompson', email: 'jessica.thompson@company.com', id: 'TECH-Q002', dept: 'Quality', role: 'Quality Technician' },
    { name: 'Daniel Moore', email: 'daniel.moore@company.com', id: 'TECH-Q003', dept: 'Quality', role: 'Quality Technician' },
    { name: 'Michelle Jackson', email: 'michelle.jackson@company.com', id: 'TECH-Q004', dept: 'Quality', role: 'Quality Technician' }
  ];

  for (const tech of technicians) {
    await User.create({
      email: tech.email,
      password: 'tech123',
      name: tech.name,
      employeeId: tech.id,
      allowedRoles: [tech.role],
      currentRole: tech.role,
      department: tech.dept,
      phoneNumber: '+1234567890'
    });
    console.log(`✅ Created ${tech.role}: ${tech.email}`);
  }

  console.log('\n✅ Database setup complete!\n');
  console.log('📊 Summary:');
  console.log('   - 1 Engineer Planner');
  console.log('   - 3 Supervisors (Production, Testing, Quality)');
  console.log('   - 14 Technicians (5 Production, 5 Testing, 4 Quality)');
  console.log('   - Total: 18 users\n');

  // Verify
  const allUsers = await User.findAll();
  console.log(`🔍 Verification: Found ${allUsers.length} users in database\n`);

  process.exit(0);
}

setupExactUsers().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
