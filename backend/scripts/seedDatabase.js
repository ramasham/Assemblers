import User from '../models/User.js';
import Role from '../models/Role.js';
import Device from '../models/Device.js';
import JobOrder from '../models/JobOrder.js';
import AuditLog from '../models/AuditLog.js';
import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

/**
 * Seed Database with Sample Data
 * 
 * This creates:
 * - Sample users (technicians, supervisors, planners)
 * - Sample job orders
 * - Sample devices
 * - Sample tasks
 * - Sample performance metrics
 */

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Step 1: Initialize roles first
    console.log('1️⃣  Initializing roles...');
    await Role.initializeDefaultRoles();
    console.log('✅ Roles initialized\n');

    // Step 2: Create sample users
    console.log('2️⃣  Creating sample users...');
    
    const users = [];
    
    // Planner
    let planner = await User.findByEmail('planner@company.com');
    if (!planner) {
      planner = await User.create({
        employeeId: 'EMP-001',
        name: 'John Smith',
        email: 'planner@company.com',
        password: 'demo123',
        currentRole: 'engineer-planner',
        department: 'all',
        allowedRoles: ['engineer-planner'],
        phoneNumber: '+1234567890'
      });
      console.log('  ✅ Created planner: planner@company.com');
    } else {
      console.log('  ℹ️  Planner already exists: planner@company.com');
    }
    users.push(planner);

    // Production Supervisor
    let prodSupervisor = await User.findByEmail('supervisor@company.com');
    if (!prodSupervisor) {
      prodSupervisor = await User.create({
        employeeId: 'EMP-002',
        name: 'Sarah Johnson',
        email: 'supervisor@company.com',
        password: 'demo123',
        currentRole: 'supervisor-production',
        department: 'production',
        allowedRoles: ['supervisor-production', 'supervisor-testing', 'supervisor-quality'],
        phoneNumber: '+1234567891'
      });
      console.log('  ✅ Created supervisor: supervisor@company.com');
    } else {
      console.log('  ℹ️  Supervisor already exists: supervisor@company.com');
    }
    users.push(prodSupervisor);

    // Production Technician
    let prodTech1 = await User.findByEmail('worker@company.com');
    if (!prodTech1) {
      prodTech1 = await User.create({
        employeeId: 'EMP-003',
        name: 'Mike Davis',
        email: 'worker@company.com',
        password: 'demo123',
        currentRole: 'technician-production',
        department: 'production',
        allowedRoles: ['technician-production', 'technician-testing', 'technician-quality'],
        phoneNumber: '+1234567892'
      });
      console.log('  ✅ Created technician: worker@company.com');
    } else {
      console.log('  ℹ️  Technician already exists: worker@company.com');
    }
    users.push(prodTech1);

    // Testing Technician
    let testTech = await User.findByEmail('tester@company.com');
    if (!testTech) {
      testTech = await User.create({
        employeeId: 'EMP-004',
        name: 'Emily Chen',
        email: 'tester@company.com',
        password: 'demo123',
        currentRole: 'technician-testing',
        department: 'testing',
        allowedRoles: ['technician-testing', 'technician-quality'],
        phoneNumber: '+1234567893'
      });
      console.log('  ✅ Created tester: tester@company.com');
    } else {
      console.log('  ℹ️  Tester already exists: tester@company.com');
    }
    users.push(testTech);

    // Quality Technician
    let qualityTech = await User.findByEmail('quality@company.com');
    if (!qualityTech) {
      qualityTech = await User.create({
        employeeId: 'EMP-005',
        name: 'David Lee',
        email: 'quality@company.com',
        password: 'demo123',
        currentRole: 'technician-quality',
        department: 'quality',
        allowedRoles: ['technician-quality', 'technician-production'],
        phoneNumber: '+1234567894'
      });
      console.log('  ✅ Created quality technician: quality@company.com\n');
    } else {
      console.log('  ℹ️  Quality technician already exists: quality@company.com\n');
    }
    users.push(qualityTech);

    // Step 3: Create sample job orders
    console.log('3️⃣  Creating sample job orders...');
    
    const jobOrders = [];

    const jobOrder1 = await JobOrder.create({
      jobOrderNumber: 'JO-2025-001',
      productName: 'Industrial Sensor Module',
      productCode: 'ISM-2000',
      totalQuantity: 100,
      priority: 'high',
      dueDate: new Date('2025-11-15'),
      assignedTechnicians: [prodTech1.id],
      notes: 'Urgent order for client XYZ Corp'
    });
    jobOrders.push(jobOrder1);
    console.log('  ✅ Created job order: JO-2025-001');

    const jobOrder2 = await JobOrder.create({
      jobOrderNumber: 'JO-2025-002',
      productName: 'Temperature Control Unit',
      productCode: 'TCU-500',
      totalQuantity: 50,
      priority: 'medium',
      dueDate: new Date('2025-11-30'),
      assignedTechnicians: [testTech.id],
      notes: 'Standard production run'
    });
    jobOrders.push(jobOrder2);
    console.log('  ✅ Created job order: JO-2025-002\n');

    // Step 4: Create sample devices
    console.log('4️⃣  Creating sample devices...');
    
    // Devices for JO-2025-001
    const serialNumbers1 = Array.from({ length: 10 }, (_, i) => 
      `ISM-2000-${String(i + 1).padStart(4, '0')}`
    );
    await Device.bulkCreate(jobOrder1.id, serialNumbers1);
    console.log(`  ✅ Created 10 devices for ${jobOrder1.jobOrderNumber}`);

    // Devices for JO-2025-002
    const serialNumbers2 = Array.from({ length: 5 }, (_, i) => 
      `TCU-500-${String(i + 1).padStart(4, '0')}`
    );
    await Device.bulkCreate(jobOrder2.id, serialNumbers2);
    console.log(`  ✅ Created 5 devices for ${jobOrder2.jobOrderNumber}\n`);

    // Step 5: Create sample tasks
    console.log('5️⃣  Creating sample tasks...');
    
    const devices = await Device.findAll({ jobOrderId: jobOrder1.id });
    if (devices.length > 0) {
      const device = devices[0];
      
      // Assign device to technician
      await Device.assignTechnician(device.id, prodTech1.id);

      // Create a task
      const taskData = {
        deviceId: device.id,
        jobOrderId: jobOrder1.id,
        technicianId: prodTech1.id,
        taskType: 'assembly',
        description: 'Assemble sensor module components',
        standardTime: 30, // 30 minutes
        actualTime: 28,
        startTime: new Date(Date.now() - 28 * 60 * 1000),
        endTime: new Date(),
        status: 'completed',
        approvalStatus: 'pending',
        notes: 'Assembly completed successfully'
      };

      const taskRef = await collections.tasks.add({
        ...taskData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log('  ✅ Created sample task');

      // Log the task submission
      await AuditLog.logTaskSubmission(
        prodTech1.id,
        prodTech1.name,
        taskRef.id,
        taskData,
        prodTech1.currentRole,
        prodTech1.department
      );
      console.log('  ✅ Created audit log for task submission\n');
    }

    // Step 6: Create user allowed roles mappings
    console.log('6️⃣  Setting up user role permissions...');
    
    const userAllowedRolesCollection = collections.userAllowedRoles;
    
    for (const user of users) {
      for (const roleId of user.allowedRoles) {
        await userAllowedRolesCollection.add({
          userId: user.id,
          roleId,
          grantedAt: admin.firestore.FieldValue.serverTimestamp(),
          grantedBy: planner.id, // Granted by planner
          canSwitchTo: true
        });
      }
    }
    console.log('  ✅ User role permissions configured\n');

    // Step 7: Summary
    console.log('📊 Seeding Summary:');
    console.log(`  👥 Users created: ${users.length}`);
    console.log(`  📋 Job orders created: ${jobOrders.length}`);
    console.log(`  📦 Devices created: ${serialNumbers1.length + serialNumbers2.length}`);
    console.log(`  ✅ Sample tasks created: 1`);
    console.log('\n✅ Database seeding complete!\n');

    console.log('🔐 Test Credentials:');
    console.log('  Planner:');
    console.log('    Email: planner@company.com');
    console.log('    Password: demo123\n');
    console.log('  Supervisor (Multi-role):');
    console.log('    Email: supervisor@company.com');
    console.log('    Password: demo123\n');
    console.log('  Production Worker (Multi-role):');
    console.log('    Email: worker@company.com');
    console.log('    Password: demo123\n');
    console.log('  Tester:');
    console.log('    Email: tester@company.com');
    console.log('    Password: demo123\n');
    console.log('  Quality:');
    console.log('    Email: quality@company.com');
    console.log('    Password: demo123\n');

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    console.error(error.stack);
    process.exit(1);
  }

  process.exit(0);
}

// Run seeding
seedDatabase();
