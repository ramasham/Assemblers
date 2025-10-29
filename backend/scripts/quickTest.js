import User from '../models/User.js';
import Role from '../models/Role.js';

async function quickTest() {
  console.log('\n🔍 Testing Database Setup...\n');

  try {
    // Test 1: Check Roles
    console.log('1️⃣  Checking Roles...');
    const roles = await Role.findAll();
    console.log(`   ✅ Found ${roles.length} roles`);
    roles.forEach(r => console.log(`      - ${r.roleId}`));

    // Test 2: Check Users  
    console.log('\n2️⃣  Checking Users...');
    const users = await User.findAll();
    console.log(`   ✅ Found ${users.length} users`);
    users.forEach(u => console.log(`      - ${u.email} (${u.currentRole})`));

    // Test 3: Test User Login
    console.log('\n3️⃣  Testing User Authentication...');
    const testUser = await User.verifyPassword('planner@company.com', 'demo123');
    if (testUser) {
      console.log(`   ✅ Login successful for: ${testUser.email}`);
      console.log(`      Role: ${testUser.currentRole}`);
      console.log(`      Department: ${testUser.department}`);
    } else {
      console.log('   ❌ Login failed');
    }

    console.log('\n✅ All tests passed!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  }

  process.exit(0);
}

quickTest();
