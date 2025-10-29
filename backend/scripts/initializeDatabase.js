import Role from '../models/Role.js';
import { admin } from '../config/firebase.js';

/**
 * Initialize Database Collections and Default Data
 * 
 * This script:
 * 1. Creates all necessary Firestore collections
 * 2. Initializes default roles
 * 3. Sets up indexes (must be done manually in Firebase Console)
 * 
 * Run this once when setting up a new database
 */

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Step 1: Initialize default roles
    console.log('📋 Initializing default roles...');
    const rolesResult = await Role.initializeDefaultRoles();
    
    console.log('\nRoles initialization results:');
    rolesResult.forEach(result => {
      if (result.status === 'created') {
        console.log(`  ✅ Created role: ${result.role.roleId}`);
      } else if (result.status === 'exists') {
        console.log(`  ℹ️  Role already exists: ${result.role.roleId}`);
      } else if (result.status === 'error') {
        console.log(`  ❌ Error creating role ${result.roleId}: ${result.error}`);
      }
    });

    // Step 2: Display required indexes
    console.log('\n📊 Required Firestore Indexes:');
    console.log('Please create these indexes manually in Firebase Console:\n');
    
    const requiredIndexes = [
      {
        collection: 'users',
        fields: [
          { field: 'employeeId', mode: 'ASCENDING' },
          { field: 'email', mode: 'ASCENDING' },
          { field: 'firebaseUid', mode: 'ASCENDING' },
          { field: 'currentRole', mode: 'ASCENDING' },
          { field: 'department', mode: 'ASCENDING' }
        ]
      },
      {
        collection: 'devices',
        fields: [
          { field: 'serialNumber', mode: 'ASCENDING' },
          { field: 'jobOrderId', mode: 'ASCENDING' },
          { field: 'assignedTechnicianId', mode: 'ASCENDING' },
          { field: 'status', mode: 'ASCENDING' },
          { field: 'currentStage', mode: 'ASCENDING' }
        ]
      },
      {
        collection: 'tasks',
        fields: [
          { field: 'deviceId', mode: 'ASCENDING' },
          { field: 'technicianId', mode: 'ASCENDING' },
          { field: 'jobOrderId', mode: 'ASCENDING' },
          { field: 'status', mode: 'ASCENDING' },
          { field: 'approvalStatus', mode: 'ASCENDING' }
        ],
        compositeIndexes: [
          {
            fields: [
              { field: 'technicianId', mode: 'ASCENDING' },
              { field: 'createdAt', mode: 'DESCENDING' }
            ]
          }
        ]
      },
      {
        collection: 'job_orders',
        fields: [
          { field: 'jobOrderNumber', mode: 'ASCENDING' },
          { field: 'status', mode: 'ASCENDING' },
          { field: 'priority', mode: 'ASCENDING' },
          { field: 'dueDate', mode: 'ASCENDING' },
          { field: 'department', mode: 'ASCENDING' }
        ]
      },
      {
        collection: 'performanceMetrics',
        fields: [
          { field: 'userId', mode: 'ASCENDING' },
          { field: 'jobOrderId', mode: 'ASCENDING' },
          { field: 'date', mode: 'DESCENDING' },
          { field: 'period', mode: 'ASCENDING' }
        ],
        compositeIndexes: [
          {
            fields: [
              { field: 'userId', mode: 'ASCENDING' },
              { field: 'date', mode: 'DESCENDING' }
            ]
          }
        ]
      },
      {
        collection: 'auditLogs',
        fields: [
          { field: 'userId', mode: 'ASCENDING' },
          { field: 'action', mode: 'ASCENDING' },
          { field: 'timestamp', mode: 'DESCENDING' },
          { field: 'resourceType', mode: 'ASCENDING' },
          { field: 'success', mode: 'ASCENDING' }
        ],
        compositeIndexes: [
          {
            fields: [
              { field: 'userId', mode: 'ASCENDING' },
              { field: 'timestamp', mode: 'DESCENDING' }
            ]
          }
        ]
      },
      {
        collection: 'alerts',
        fields: [
          { field: 'alertType', mode: 'ASCENDING' },
          { field: 'severity', mode: 'ASCENDING' },
          { field: 'assignedToDepartment', mode: 'ASCENDING' },
          { field: 'isRead', mode: 'ASCENDING' },
          { field: 'createdAt', mode: 'DESCENDING' }
        ]
      },
      {
        collection: 'sessions',
        fields: [
          { field: 'userId', mode: 'ASCENDING' },
          { field: 'sessionId', mode: 'ASCENDING' },
          { field: 'isActive', mode: 'ASCENDING' },
          { field: 'expiresAt', mode: 'ASCENDING' }
        ]
      }
    ];

    requiredIndexes.forEach((indexInfo, idx) => {
      console.log(`${idx + 1}. Collection: ${indexInfo.collection}`);
      console.log('   Single Field Indexes:');
      indexInfo.fields.forEach(field => {
        console.log(`   - ${field.field} (${field.mode})`);
      });
      if (indexInfo.compositeIndexes) {
        console.log('   Composite Indexes:');
        indexInfo.compositeIndexes.forEach((composite, cIdx) => {
          console.log(`   Composite ${cIdx + 1}:`);
          composite.fields.forEach(field => {
            console.log(`     - ${field.field} (${field.mode})`);
          });
        });
      }
      console.log('');
    });

    console.log('\n💡 To create indexes in Firebase Console:');
    console.log('1. Go to https://console.firebase.google.com');
    console.log('2. Select your project');
    console.log('3. Navigate to Firestore Database > Indexes');
    console.log('4. Click "Create Index" and add the indexes listed above\n');

    // Step 3: Display Firestore Security Rules reminder
    console.log('🔒 Security Rules Reminder:');
    console.log('Don\'t forget to update your Firestore Security Rules!');
    console.log('See DATABASE_SCHEMA.md for recommended security rules.\n');

    console.log('✅ Database initialization complete!\n');
    console.log('Next steps:');
    console.log('1. Create the required indexes in Firebase Console');
    console.log('2. Update Firestore Security Rules');
    console.log('3. Run the seed script to create sample data: npm run seed\n');

  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run initialization
initializeDatabase();
