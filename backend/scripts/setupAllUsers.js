import User from '../models/User.js';
import { admin, initializeFirebase } from '../config/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

const allUsers = [
  // 1 Engineer Planner
  {
    email: 'planner@company.com',
    password: 'planner123',
    name: 'John Smith',
    employeeId: 'ENG-001',
    allowedRoles: ['Engineer Planner'],
    currentRole: 'Engineer Planner',
    department: 'Engineering',
    phoneNumber: '+1234567890'
  },
  
  // 3 Supervisors
  {
    email: 'supervisor.production@company.com',
    password: 'supervisor123',
    name: 'Sarah Johnson',
    employeeId: 'SUP-P001',
    allowedRoles: ['Production Supervisor'],
    currentRole: 'Production Supervisor',
    department: 'Production',
    phoneNumber: '+1234567891'
  },
  {
    email: 'supervisor.testing@company.com',
    password: 'supervisor123',
    name: 'Michael Rodriguez',
    employeeId: 'SUP-T001',
    allowedRoles: ['Production Supervisor'],
    currentRole: 'Production Supervisor',
    department: 'Testing',
    phoneNumber: '+1234567892'
  },
  {
    email: 'supervisor.quality@company.com',
    password: 'supervisor123',
    name: 'Jennifer Martinez',
    employeeId: 'SUP-Q001',
    allowedRoles: ['Production Supervisor'],
    currentRole: 'Production Supervisor',
    department: 'Quality',
    phoneNumber: '+1234567893'
  },
  
  // 5 Production Technicians
  {
    email: 'mike.davis@company.com',
    password: 'tech123',
    name: 'Mike Davis',
    employeeId: 'TECH-P001',
    allowedRoles: ['Production Technician'],
    currentRole: 'Production Technician',
    department: 'Production',
    phoneNumber: '+1234567894'
  },
  {
    email: 'sarah.wilson@company.com',
    password: 'tech123',
    name: 'Sarah Wilson',
    employeeId: 'TECH-P002',
    allowedRoles: ['Production Technician'],
    currentRole: 'Production Technician',
    department: 'Production',
    phoneNumber: '+1234567895'
  },
  {
    email: 'james.brown@company.com',
    password: 'tech123',
    name: 'James Brown',
    employeeId: 'TECH-P003',
    allowedRoles: ['Production Technician'],
    currentRole: 'Production Technician',
    department: 'Production',
    phoneNumber: '+1234567896'
  },
  {
    email: 'lisa.anderson@company.com',
    password: 'tech123',
    name: 'Lisa Anderson',
    employeeId: 'TECH-P004',
    allowedRoles: ['Production Technician'],
    currentRole: 'Production Technician',
    department: 'Production',
    phoneNumber: '+1234567897'
  },
  {
    email: 'robert.martinez@company.com',
    password: 'tech123',
    name: 'Robert Martinez',
    employeeId: 'TECH-P005',
    allowedRoles: ['Production Technician'],
    currentRole: 'Production Technician',
    department: 'Production',
    phoneNumber: '+1234567898'
  },
  
  // 5 Testing Technicians
  {
    email: 'emily.chen@company.com',
    password: 'tech123',
    name: 'Emily Chen',
    employeeId: 'TECH-T001',
    allowedRoles: ['Testing Technician'],
    currentRole: 'Testing Technician',
    department: 'Testing',
    phoneNumber: '+1234567899'
  },
  {
    email: 'david.lee@company.com',
    password: 'tech123',
    name: 'David Lee',
    employeeId: 'TECH-T002',
    allowedRoles: ['Testing Technician'],
    currentRole: 'Testing Technician',
    department: 'Testing',
    phoneNumber: '+1234567900'
  },
  {
    email: 'jennifer.garcia@company.com',
    password: 'tech123',
    name: 'Jennifer Garcia',
    employeeId: 'TECH-T003',
    allowedRoles: ['Testing Technician'],
    currentRole: 'Testing Technician',
    department: 'Testing',
    phoneNumber: '+1234567901'
  },
  {
    email: 'michael.taylor@company.com',
    password: 'tech123',
    name: 'Michael Taylor',
    employeeId: 'TECH-T004',
    allowedRoles: ['Testing Technician'],
    currentRole: 'Testing Technician',
    department: 'Testing',
    phoneNumber: '+1234567902'
  },
  {
    email: 'amanda.white@company.com',
    password: 'tech123',
    name: 'Amanda White',
    employeeId: 'TECH-T005',
    allowedRoles: ['Testing Technician'],
    currentRole: 'Testing Technician',
    department: 'Testing',
    phoneNumber: '+1234567903'
  },
  
  // 4 Quality Technicians
  {
    email: 'christopher.harris@company.com',
    password: 'tech123',
    name: 'Christopher Harris',
    employeeId: 'TECH-Q001',
    allowedRoles: ['Quality Technician'],
    currentRole: 'Quality Technician',
    department: 'Quality',
    phoneNumber: '+1234567904'
  },
  {
    email: 'jessica.thompson@company.com',
    password: 'tech123',
    name: 'Jessica Thompson',
    employeeId: 'TECH-Q002',
    allowedRoles: ['Quality Technician'],
    currentRole: 'Quality Technician',
    department: 'Quality',
    phoneNumber: '+1234567905'
  },
  {
    email: 'daniel.moore@company.com',
    password: 'tech123',
    name: 'Daniel Moore',
    employeeId: 'TECH-Q003',
    allowedRoles: ['Quality Technician'],
    currentRole: 'Quality Technician',
    department: 'Quality',
    phoneNumber: '+1234567906'
  },
  {
    email: 'michelle.jackson@company.com',
    password: 'tech123',
    name: 'Michelle Jackson',
    employeeId: 'TECH-Q004',
    allowedRoles: ['Quality Technician'],
    currentRole: 'Quality Technician',
    department: 'Quality',
    phoneNumber: '+1234567907'
  }
];

async function setupAllUsers() {
  try {
    console.log('\n🚀 Starting Complete User Setup...\n');
    
    // Initialize Firebase
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    console.log('🗑️  Cleaning up existing users...\n');

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

    console.log('👥 Creating NEW users...\n');

    let created = 0;
    let errors = 0;

    for (const userData of allUsers) {
      try {
        await User.create(userData);
        console.log(`✅ Created ${userData.currentRole}: ${userData.email}`);
        created++;
      } catch (error) {
        console.error(`❌ Failed to create ${userData.email}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 SETUP COMPLETE!');
    console.log('='.repeat(80));
    console.log(`✅ Successfully created: ${created} users`);
    console.log(`❌ Errors: ${errors} users`);
    console.log(`📝 Total: ${allUsers.length} users\n`);

    console.log('👥 User Distribution:');
    console.log('   - 1 Engineer Planner');
    console.log('   - 3 Supervisors (Production, Testing, Quality)');
    console.log('   - 5 Production Technicians');
    console.log('   - 5 Testing Technicians');
    console.log('   - 4 Quality Technicians');
    console.log('   - Total: 18 users\n');

    console.log('='.repeat(80));
    console.log('🔑 ALL LOGIN CREDENTIALS');
    console.log('='.repeat(80));
    console.log('\n📧 ENGINEER PLANNER:');
    console.log('   Email: planner@company.com');
    console.log('   Password: planner123\n');
    
    console.log('📧 SUPERVISORS:');
    console.log('   Production: supervisor.production@company.com | supervisor123');
    console.log('   Testing:    supervisor.testing@company.com    | supervisor123');
    console.log('   Quality:    supervisor.quality@company.com    | supervisor123\n');
    
    console.log('📧 PRODUCTION TECHNICIANS:');
    console.log('   mike.davis@company.com      | tech123');
    console.log('   sarah.wilson@company.com    | tech123');
    console.log('   james.brown@company.com     | tech123');
    console.log('   lisa.anderson@company.com   | tech123');
    console.log('   robert.martinez@company.com | tech123\n');
    
    console.log('📧 TESTING TECHNICIANS:');
    console.log('   emily.chen@company.com      | tech123');
    console.log('   david.lee@company.com       | tech123');
    console.log('   jennifer.garcia@company.com | tech123');
    console.log('   michael.taylor@company.com  | tech123');
    console.log('   amanda.white@company.com    | tech123\n');
    
    console.log('📧 QUALITY TECHNICIANS:');
    console.log('   christopher.harris@company.com  | tech123');
    console.log('   jessica.thompson@company.com    | tech123');
    console.log('   daniel.moore@company.com        | tech123');
    console.log('   michelle.jackson@company.com    | tech123\n');

    console.log('='.repeat(80));
    console.log('✅ All users are ready to login!');
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupAllUsers();
