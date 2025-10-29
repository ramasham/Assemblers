import User from '../models/User.js';
import Role from '../models/Role.js';
import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';

/**
 * Create 14 Technicians with Individual Credentials
 */

async function create14Technicians() {
  console.log('👥 Creating 14 Technicians...\n');

  try {
    // Ensure roles exist first
    await Role.initializeDefaultRoles();

    const technicians = [
      // Production Technicians (5)
      { 
        employeeId: 'TECH-P001', 
        name: 'Mike Davis', 
        email: 'mike.davis@company.com',
        password: 'tech123',
        department: 'production',
        role: 'technician-production',
        allowedRoles: ['technician-production']
      },
      { 
        employeeId: 'TECH-P002', 
        name: 'Sarah Wilson', 
        email: 'sarah.wilson@company.com',
        password: 'tech123',
        department: 'production',
        role: 'technician-production',
        allowedRoles: ['technician-production']
      },
      { 
        employeeId: 'TECH-P003', 
        name: 'James Brown', 
        email: 'james.brown@company.com',
        password: 'tech123',
        department: 'production',
        role: 'technician-production',
        allowedRoles: ['technician-production']
      },
      { 
        employeeId: 'TECH-P004', 
        name: 'Lisa Anderson', 
        email: 'lisa.anderson@company.com',
        password: 'tech123',
        department: 'production',
        role: 'technician-production',
        allowedRoles: ['technician-production']
      },
      { 
        employeeId: 'TECH-P005', 
        name: 'Robert Martinez', 
        email: 'robert.martinez@company.com',
        password: 'tech123',
        department: 'production',
        role: 'technician-production',
        allowedRoles: ['technician-production']
      },

      // Testing Technicians (5)
      { 
        employeeId: 'TECH-T001', 
        name: 'Emily Chen', 
        email: 'emily.chen@company.com',
        password: 'tech123',
        department: 'testing',
        role: 'technician-testing',
        allowedRoles: ['technician-testing']
      },
      { 
        employeeId: 'TECH-T002', 
        name: 'David Lee', 
        email: 'david.lee@company.com',
        password: 'tech123',
        department: 'testing',
        role: 'technician-testing',
        allowedRoles: ['technician-testing']
      },
      { 
        employeeId: 'TECH-T003', 
        name: 'Jennifer Garcia', 
        email: 'jennifer.garcia@company.com',
        password: 'tech123',
        department: 'testing',
        role: 'technician-testing',
        allowedRoles: ['technician-testing']
      },
      { 
        employeeId: 'TECH-T004', 
        name: 'Michael Taylor', 
        email: 'michael.taylor@company.com',
        password: 'tech123',
        department: 'testing',
        role: 'technician-testing',
        allowedRoles: ['technician-testing']
      },
      { 
        employeeId: 'TECH-T005', 
        name: 'Amanda White', 
        email: 'amanda.white@company.com',
        password: 'tech123',
        department: 'testing',
        role: 'technician-testing',
        allowedRoles: ['technician-testing']
      },

      // Quality Technicians (4)
      { 
        employeeId: 'TECH-Q001', 
        name: 'Christopher Harris', 
        email: 'christopher.harris@company.com',
        password: 'tech123',
        department: 'quality',
        role: 'technician-quality',
        allowedRoles: ['technician-quality']
      },
      { 
        employeeId: 'TECH-Q002', 
        name: 'Jessica Thompson', 
        email: 'jessica.thompson@company.com',
        password: 'tech123',
        department: 'quality',
        role: 'technician-quality',
        allowedRoles: ['technician-quality']
      },
      { 
        employeeId: 'TECH-Q003', 
        name: 'Daniel Moore', 
        email: 'daniel.moore@company.com',
        password: 'tech123',
        department: 'quality',
        role: 'technician-quality',
        allowedRoles: ['technician-quality']
      },
      { 
        employeeId: 'TECH-Q004', 
        name: 'Michelle Jackson', 
        email: 'michelle.jackson@company.com',
        password: 'tech123',
        department: 'quality',
        role: 'technician-quality',
        allowedRoles: ['technician-quality']
      }
    ];

    const createdUsers = [];

    for (const techData of technicians) {
      try {
        // Check if user already exists
        let user = await User.findByEmail(techData.email);
        
        if (!user) {
          user = await User.create({
            employeeId: techData.employeeId,
            name: techData.name,
            email: techData.email,
            password: techData.password,
            currentRole: techData.role,
            department: techData.department,
            allowedRoles: techData.allowedRoles,
            phoneNumber: ''
          });
          console.log(`✅ Created: ${techData.email} (${techData.name}) - ${techData.department}`);
        } else {
          console.log(`ℹ️  Exists: ${techData.email} (${techData.name})`);
        }
        
        createdUsers.push(user);

        // Create user allowed roles mapping
        const userAllowedRolesCollection = collections.userAllowedRoles;
        for (const roleId of techData.allowedRoles) {
          const existing = await userAllowedRolesCollection
            .where('userId', '==', user.id)
            .where('roleId', '==', roleId)
            .limit(1)
            .get();
          
          if (existing.empty) {
            await userAllowedRolesCollection.add({
              userId: user.id,
              roleId,
              grantedAt: admin.firestore.FieldValue.serverTimestamp(),
              grantedBy: 'system',
              canSwitchTo: true
            });
          }
        }

      } catch (error) {
        console.error(`❌ Error creating ${techData.email}: ${error.message}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total technicians: ${createdUsers.length}`);
    console.log(`   Production: 5`);
    console.log(`   Testing: 5`);
    console.log(`   Quality: 4`);
    console.log('\n✅ All technicians created!\n');

    console.log('🔐 All Technician Credentials:');
    console.log('   Password for all: tech123\n');
    console.log('Production Technicians:');
    technicians.filter(t => t.department === 'production').forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.email} - ${t.name}`);
    });
    console.log('\nTesting Technicians:');
    technicians.filter(t => t.department === 'testing').forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.email} - ${t.name}`);
    });
    console.log('\nQuality Technicians:');
    technicians.filter(t => t.department === 'quality').forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.email} - ${t.name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }

  process.exit(0);
}

create14Technicians();
