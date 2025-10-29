import User from '../models/User.js';
import { initializeFirebase } from '../config/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Enable ALL technicians to switch between ALL 3 departments
 * - Production
 * - Testing  
 * - Quality
 */

async function enableDepartmentSwitching() {
  try {
    console.log('\n🔄 Enabling Department Switching for All Technicians...\n');
    
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    // Get all users
    const allUsers = await User.findAll();
    
    let updated = 0;
    let skipped = 0;

    for (const user of allUsers) {
      // Only update technicians
      if (user.mainRole === 'technician' || 
          (user.currentRole && user.currentRole.toLowerCase().includes('technician'))) {
        
        // Update user with all 3 departments
        await User.update(user.id, {
          departments: ['Production', 'Testing', 'Quality'],
          allowedRoles: ['technician', 'supervisor', 'planner']
        });
        
        updated++;
        console.log(`✅ ${user.name} - Now has access to ALL 3 departments`);
      } else {
        skipped++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 DEPARTMENT SWITCHING ENABLED!');
    console.log('='.repeat(80));
    console.log(`✅ Updated: ${updated} technicians`);
    console.log(`⏭️  Skipped: ${skipped} non-technicians\n`);

    console.log('📋 All technicians can now switch between:');
    console.log('   • Production Department');
    console.log('   • Testing Department');
    console.log('   • Quality Department\n');

    console.log('📱 Usage:');
    console.log('   POST /api/auth/switch-role');
    console.log('   Body: {"department": "Production|Testing|Quality"}\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

enableDepartmentSwitching();
