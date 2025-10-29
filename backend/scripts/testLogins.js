import User from '../models/User.js';

async function testAllLogins() {
  console.log('\n🔐 Testing All User Logins...\n');

  const testUsers = [
    // Engineer Planner
    { email: 'planner@company.com', password: 'eng123' },
    
    // Supervisors
    { email: 'supervisor.production@company.com', password: 'sup123' },
    { email: 'supervisor.testing@company.com', password: 'sup123' },
    { email: 'supervisor.quality@company.com', password: 'sup123' },
    
    // Production Technicians
    { email: 'mike.davis@company.com', password: 'tech123' },
    { email: 'sarah.wilson@company.com', password: 'tech123' },
    { email: 'james.brown@company.com', password: 'tech123' },
    { email: 'lisa.anderson@company.com', password: 'tech123' },
    { email: 'robert.martinez@company.com', password: 'tech123' },
    
    // Testing Technicians
    { email: 'emily.chen@company.com', password: 'tech123' },
    { email: 'david.lee@company.com', password: 'tech123' },
    { email: 'jennifer.garcia@company.com', password: 'tech123' },
    { email: 'michael.taylor@company.com', password: 'tech123' },
    { email: 'amanda.white@company.com', password: 'tech123' },
    
    // Quality Technicians
    { email: 'christopher.harris@company.com', password: 'tech123' },
    { email: 'jessica.thompson@company.com', password: 'tech123' },
    { email: 'daniel.moore@company.com', password: 'tech123' },
    { email: 'michelle.jackson@company.com', password: 'tech123' }
  ];

  for (const testUser of testUsers) {
    const user = await User.verifyPassword(testUser.email, testUser.password);
    if (user) {
      console.log(`✅ ${testUser.email}`);
      console.log(`   → Name: ${user.name}`);
      console.log(`   → Role: ${user.currentRole}`);
      console.log(`   → Department: ${user.department}\n`);
    } else {
      console.log(`❌ ${testUser.email} - Login FAILED\n`);
    }
  }

  console.log('✅ All login tests complete!\n');
  process.exit(0);
}

testAllLogins();
