import Technician from '../models/Technician.js';
import { admin, initializeFirebase } from '../config/firebase.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '../.env') });

const users = [
  // Supervisor (Has full system control)
  {
    employeeId: "SUP001",
    name: "Production Supervisor",
    email: "supervisor@company.com",
    password: "ChangeMe123!",
    role: "supervisor",
    phoneNumber: "+1234567890",
    specialization: "Production Oversight & Management",
    shiftTiming: "morning"
  },
  // Planning Engineer
  {
    employeeId: "PLAN001",
    name: "Planning Engineer",
    email: "planner@company.com",
    password: "ChangeMe123!",
    role: "planner",
    phoneNumber: "+1234567891",
    specialization: "Production Planning & Scheduling",
    shiftTiming: "morning"
  },
  // Production Team (10 users)
  ...Array.from({ length: 10 }, (_, i) => ({
    employeeId: `PROD${String(i + 1).padStart(3, '0')}`,
    name: `Production Worker ${i + 1}`,
    email: `prod${i + 1}@company.com`,
    password: "ChangeMe123!",
    role: "production",
    phoneNumber: `+123456789${String(i + 2).padStart(2, '0')}`,
    specialization: `Assembly Line ${String.fromCharCode(65 + (i % 3))}`, // A, B, or C
    shiftTiming: i < 4 ? "morning" : i < 7 ? "afternoon" : "night"
  })),
  // Quality Team (2 users)
  {
    employeeId: "QA001",
    name: "Quality Inspector 1",
    email: "qa1@company.com",
    password: "ChangeMe123!",
    role: "quality",
    phoneNumber: "+1234567912",
    specialization: "Final Quality Inspection",
    shiftTiming: "morning"
  },
  {
    employeeId: "QA002",
    name: "Quality Inspector 2",
    email: "qa2@company.com",
    password: "ChangeMe123!",
    role: "quality",
    phoneNumber: "+1234567913",
    specialization: "In-Process Quality Control",
    shiftTiming: "afternoon"
  },
  // Testing Team (2 users)
  {
    employeeId: "TEST001",
    name: "Test Technician 1",
    email: "test1@company.com",
    password: "ChangeMe123!",
    role: "testing",
    phoneNumber: "+1234567914",
    specialization: "Functional Testing",
    shiftTiming: "morning"
  },
  {
    employeeId: "TEST002",
    name: "Test Technician 2",
    email: "test2@company.com",
    password: "ChangeMe123!",
    role: "testing",
    phoneNumber: "+1234567915",
    specialization: "Performance Testing",
    shiftTiming: "afternoon"
  }
];

async function createUsersWithFirebase() {
  try {
    console.log('🚀 Starting Firebase user creation script...\n');
    
    // Initialize Firebase
    console.log('🔥 Initializing Firebase and Firestore...');
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    console.log('👥 Creating users in Firebase Authentication and Firestore...\n');
    
    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const userData of users) {
      try {
        // Check if user already exists in Firestore
        const existingByEmployeeId = await Technician.findByEmployeeId(userData.employeeId);
        const existingByEmail = await Technician.findByEmail(userData.email);

        if (existingByEmployeeId || existingByEmail) {
          console.log(`⏭️  Skipped: ${userData.employeeId} - ${userData.name} (already exists in Firestore)`);
          skipped++;
          continue;
        }

        // Create user in Firebase Authentication
        let firebaseUser;
        try {
          firebaseUser = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
            emailVerified: false // Set to true if you want to skip email verification
          });
          console.log(`🔥 Firebase Auth: Created ${userData.email}`);
        } catch (firebaseError) {
          if (firebaseError.code === 'auth/email-already-exists') {
            // User exists in Firebase, get their UID
            console.log(`⚠️  Firebase Auth: User ${userData.email} already exists, fetching UID...`);
            const existingFirebaseUser = await admin.auth().getUserByEmail(userData.email);
            firebaseUser = existingFirebaseUser;
          } else {
            throw firebaseError;
          }
        }

        // Create user in Firestore with Firebase UID
        await Technician.create({
          employeeId: userData.employeeId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phoneNumber: userData.phoneNumber,
          specialization: userData.specialization,
          shiftTiming: userData.shiftTiming,
          firebaseUid: firebaseUser.uid,
          isActive: true
        });
        
        console.log(`✅ Firestore: Created ${userData.employeeId} - ${userData.name} (${userData.role})`);
        console.log(`   🔗 Linked to Firebase UID: ${firebaseUser.uid}\n`);
        created++;
        
      } catch (error) {
        console.error(`❌ Failed to create ${userData.employeeId}:`);
        console.error(`   Error: ${error.message}\n`);
        errors++;
      }
    }

    console.log('=' .repeat(70));
    console.log('📊 Summary:');
    console.log(`   ✅ Created: ${created} users`);
    console.log(`   ⏭️  Skipped: ${skipped} users (already exist)`);
    console.log(`   ❌ Errors: ${errors} users`);
    console.log(`   📝 Total: ${users.length} users`);
    console.log('='.repeat(70));

    if (created > 0) {
      console.log('\n⚠️  SECURITY WARNING:');
      console.log('   Default password: ChangeMe123!');
      console.log('   ⚡ Users MUST change their passwords after first login!');
      console.log('\n💡 Users can reset passwords using "Forgot Password" on login page');
    }

    console.log('\n🎉 User creation complete!\n');
    
    // Display role distribution
    console.log('👥 Role Distribution:');
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role.padEnd(15)}: ${count} user${count > 1 ? 's' : ''}`);
    });

    console.log('\n📧 Test Logins:');
    console.log('   Supervisor: supervisor@company.com / ChangeMe123!');
    console.log('   Planner: planner@company.com / ChangeMe123!');
    console.log('   Production: prod1@company.com / ChangeMe123!');
    console.log('   Quality: qa1@company.com / ChangeMe123!');
    console.log('   Testing: test1@company.com / ChangeMe123!');

    console.log('\n✅ All done!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🔥 Firebase + MongoDB User Creation Script\n');
createUsersWithFirebase();
