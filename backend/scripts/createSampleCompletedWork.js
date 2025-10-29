import { initializeFirebase } from '../config/firebase.js';
import { db } from '../services/firestore.js';

// Initialize Firebase
initializeFirebase();

// Helper function to generate random actual time (80%-120% of standard time)
function generateActualTime(standardTime) {
  const variance = 0.2; // ±20%
  const min = standardTime * (1 - variance);
  const max = standardTime * (1 + variance);
  return Math.round(min + Math.random() * (max - min));
}

// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to subtract days
function subtractDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

async function createSampleCompletedWork() {
  try {
    console.log('🚀 Creating sample completed work for technicians...\n');
    
    // Get all technicians
    const techniciansSnapshot = await db.collection('users')
      .where('allowedRoles', 'array-contains', 'Production Technician')
      .get();
    
    const technicians = [];
    techniciansSnapshot.forEach(doc => {
      technicians.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${technicians.length} technicians\n`);
    
    // Get job orders
    const jobOrdersSnapshot = await db.collection('jobOrders')
      .where('jobOrderNumber', '>=', 'JO-2025-101')
      .get();
    
    const jobOrders = [];
    jobOrdersSnapshot.forEach(doc => {
      jobOrders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${jobOrders.length} job orders\n`);
    
    // Get operations for each job order
    const jobOrderOperations = {};
    const operationsSnapshot = await db.collection('jobOrderOperations').get();
    operationsSnapshot.forEach(doc => {
      const data = doc.data();
      jobOrderOperations[data.jobOrderId] = data.operations;
    });
    
    // Create completed work for the last 7 days
    const totalWorkEntries = [];
    const today = new Date();
    
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const workDate = subtractDays(today, dayOffset);
      const workDateStr = workDate.toISOString().split('T')[0];
      
      console.log(`\n📅 Creating work entries for ${workDateStr}:`);
      
      // Each technician works on ~2-4 devices per day
      for (const technician of technicians) {
        const devicesPerDay = 2 + Math.floor(Math.random() * 3); // 2-4 devices
        
        for (let d = 0; d < devicesPerDay; d++) {
          // Pick a random job order
          const jobOrder = getRandomItem(jobOrders);
          const operations = jobOrderOperations[jobOrder.id] || [];
          
          if (operations.length === 0) continue;
          
          // Pick 2-5 random operations
          const numOperations = Math.min(2 + Math.floor(Math.random() * 4), operations.length);
          const selectedOperations = [];
          const usedIndices = new Set();
          
          while (selectedOperations.length < numOperations) {
            const index = Math.floor(Math.random() * operations.length);
            if (!usedIndices.has(index)) {
              usedIndices.add(index);
              selectedOperations.push(operations[index]);
            }
          }
          
          // Create work entry
          const totalStandardTime = selectedOperations.reduce((sum, op) => sum + op.standardTime, 0);
          const totalActualTime = selectedOperations.reduce((sum, op) => sum + generateActualTime(op.standardTime), 0);
          
          // Calculate metrics
          const efficiency = (totalStandardTime / totalActualTime) * 100;
          const productivity = 1 / (totalActualTime / 60); // devices per hour
          const workHours = totalActualTime / 60;
          
          const workEntry = {
            technicianId: technician.id || technician.uid,
            technicianName: technician.name,
            technicianEmail: technician.email,
            jobOrderId: jobOrder.id,
            jobOrderNumber: jobOrder.jobOrderNumber,
            productName: jobOrder.productName,
            date: workDate,
            dateString: workDateStr,
            operations: selectedOperations.map(op => ({
              operationId: op.operationId,
              name: op.name,
              category: op.category,
              standardTime: op.standardTime,
              actualTime: generateActualTime(op.standardTime)
            })),
            devicesCompleted: 1,
            totalStandardTime: totalStandardTime,
            totalActualTime: totalActualTime,
            efficiency: Math.round(efficiency * 100) / 100,
            productivity: Math.round(productivity * 100) / 100,
            workHours: Math.round(workHours * 100) / 100,
            utilization: Math.min(100, Math.round((workHours / 8) * 100)), // Assuming 8-hour workday
            notes: '',
            status: 'completed',
            submittedAt: new Date(workDate.getTime() + 18 * 60 * 60 * 1000), // End of day
            approvedBy: null,
            approvedAt: null,
            createdAt: new Date()
          };
          
          totalWorkEntries.push(workEntry);
        }
      }
    }
    
    console.log(`   Created work entries for all technicians`);
    
    // Batch write all work entries
    console.log(`\n📝 Writing ${totalWorkEntries.length} work entries to database...`);
    
    const batchSize = 500;
    let written = 0;
    
    for (let i = 0; i < totalWorkEntries.length; i += batchSize) {
      const batch = db.batch();
      const chunk = totalWorkEntries.slice(i, i + batchSize);
      
      for (const entry of chunk) {
        const docRef = db.collection('completedWork').doc();
        batch.set(docRef, entry);
      }
      
      await batch.commit();
      written += chunk.length;
      console.log(`   Wrote ${written}/${totalWorkEntries.length} entries...`);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log(`✨ Successfully created ${totalWorkEntries.length} work entries!`);
    console.log('='.repeat(70));
    
    // Calculate and display summary statistics
    console.log('\n📊 Summary Statistics:');
    
    const groupedByTechnician = {};
    for (const entry of totalWorkEntries) {
      if (!groupedByTechnician[entry.technicianId]) {
        groupedByTechnician[entry.technicianId] = {
          name: entry.technicianName,
          entries: [],
          totalDevices: 0,
          totalHours: 0,
          totalEfficiency: 0
        };
      }
      groupedByTechnician[entry.technicianId].entries.push(entry);
      groupedByTechnician[entry.technicianId].totalDevices += entry.devicesCompleted;
      groupedByTechnician[entry.technicianId].totalHours += entry.workHours;
      groupedByTechnician[entry.technicianId].totalEfficiency += entry.efficiency;
    }
    
    console.log('\n   Top Performers (by efficiency):');
    const performers = Object.values(groupedByTechnician)
      .map(tech => ({
        ...tech,
        avgEfficiency: tech.totalEfficiency / tech.entries.length
      }))
      .sort((a, b) => b.avgEfficiency - a.avgEfficiency)
      .slice(0, 5);
    
    performers.forEach((tech, index) => {
      console.log(`   ${index + 1}. ${tech.name}`);
      console.log(`      Devices: ${tech.totalDevices}`);
      console.log(`      Hours: ${tech.totalHours.toFixed(2)}`);
      console.log(`      Avg Efficiency: ${tech.avgEfficiency.toFixed(2)}%`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating completed work:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
createSampleCompletedWork();
