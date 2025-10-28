import mongoose from 'mongoose';
import Technician from '../models/Technician.js';
import bcrypt from 'bcrypt';
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

async function createUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('👥 Creating users...\n');
    
    let created = 0;
    let skipped = 0;

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await Technician.findOne({ 
          $or: [
            { email: userData.email },
            { employeeId: userData.employeeId }
          ]
        });

        if (existingUser) {
          console.log(`⏭️  Skipped: ${userData.employeeId} - ${userData.name} (already exists)`);
          skipped++;
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        await Technician.create({
          ...userData,
          password: hashedPassword
        });
        
        console.log(`✅ Created: ${userData.employeeId} - ${userData.name} (${userData.role})`);
        created++;
      } catch (error) {
        console.error(`❌ Failed to create ${userData.employeeId}: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Created: ${created} users`);
    console.log(`   ⏭️  Skipped: ${skipped} users (already exist)`);
    console.log(`   📝 Total: ${users.length} users`);
    console.log('='.repeat(60));

    if (created > 0) {
      console.log('\n⚠️  SECURITY WARNING:');
      console.log('   Default password: ChangeMe123!');
      console.log('   ⚡ Users MUST change their passwords after first login!');
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

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

console.log('🚀 Starting user creation script...\n');
createUsers();
