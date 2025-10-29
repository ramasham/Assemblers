import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

// Test users from addPasswordsToUsers.js
const testUsers = [
  { email: 'planner@company.com', password: 'planner123', role: 'Planner' },
  { email: 'supervisor.production@company.com', password: 'super123', role: 'Production Supervisor' },
  { email: 'supervisor.testing@company.com', password: 'super123', role: 'Testing Supervisor' },
  { email: 'mike.davis@company.com', password: 'tech123', role: 'Technician' }
];

async function testLogin(email, password, role) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${role} login SUCCESS: ${email}`);
      console.log(`   Token: ${data.token.substring(0, 20)}...`);
      console.log(`   User: ${data.user.name}`);
      return true;
    } else {
      const error = await response.text();
      console.log(`❌ ${role} login FAILED: ${email}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${role} ERROR: ${email}`);
    console.log(`   ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🧪 Testing Login for All User Types\n');
  console.log('═'.repeat(60));
  
  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let passed = 0;
  let failed = 0;

  for (const user of testUsers) {
    const success = await testLogin(user.email, user.password, user.role);
    if (success) passed++;
    else failed++;
    console.log('');
  }

  console.log('═'.repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('🎉 All login tests passed! Your auth is working correctly.\n');
  } else {
    console.log('⚠️  Some logins failed. Check the errors above.\n');
  }
}

runTests().catch(console.error);
