import { initializeFirebase } from '../config/firebase.js';
import { db } from '../services/firestore.js';
import JobOrder from '../models/JobOrder.js';
import Device from '../models/Device.js';

// Initialize Firebase
initializeFirebase();

// Helper function to generate serial numbers
function generateSerialNumber(productCode, index) {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const serial = String(index).padStart(4, '0');
  return `${productCode}-${year}${month}-${serial}`;
}

// Helper function to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Sample job orders configuration
const jobOrdersConfig = [
  {
    jobOrderNumber: 'JO-2025-101',
    productName: 'Night Vision Device A340',
    productCode: 'NVD-A340',
    totalQuantity: 50,
    priority: 'high',
    dueDate: addDays(new Date(), 14), // 2 weeks from now
    requiredOperations: [
      'Assemblage I',
      'Assemblage II',
      'Focus A340',
      'Lens Cleaning',
      'Nitrogen',
      'Adjustment',
      'Unit Test',
      'Quality Assemblage I',
      'Final Inspection',
      'Packing'
    ]
  },
  {
    jobOrderNumber: 'JO-2025-102',
    productName: 'Night Vision Device A360',
    productCode: 'NVD-A360',
    totalQuantity: 30,
    priority: 'medium',
    dueDate: addDays(new Date(), 21), // 3 weeks from now
    requiredOperations: [
      'Assemblage I',
      'Assemblage II tubeless',
      'Focus A360',
      'Lens Cleaning',
      'Objective and Doublet',
      'Nitrogen',
      'Adjustment',
      'Unit Test',
      'Immersion',
      'Quality Assemblage II',
      'Final Inspection',
      'Packing'
    ]
  },
  {
    jobOrderNumber: 'JO-2025-103',
    productName: 'Thermal Scope Basic',
    productCode: 'TS-BASIC',
    totalQuantity: 25,
    priority: 'urgent',
    dueDate: addDays(new Date(), 7), // 1 week from now
    requiredOperations: [
      'Assemblage I',
      'Assemblage II',
      'Final Touch - Cleaning&Packing',
      'Final Touch - Paint&Labeling',
      'Lens Cleaning',
      'Adjustment',
      'Unit Test',
      'Quality Assemblage I',
      'Final Inspection',
      'Packing'
    ]
  }
];

async function getOperationsByNames(operationNames) {
  try {
    const allOperations = [];
    
    for (const name of operationNames) {
      const snapshot = await db.collection('operations')
        .where('name', '==', name)
        .where('isActive', '==', true)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        allOperations.push({
          id: doc.id,
          ...doc.data()
        });
      } else {
        console.log(`   ⚠️  Operation not found: ${name}`);
      }
    }
    
    return allOperations;
  } catch (error) {
    throw new Error(`Failed to fetch operations: ${error.message}`);
  }
}

async function createSampleJobOrders() {
  try {
    console.log('🚀 Creating sample job orders with devices...\n');
    
    const createdJobOrders = [];
    
    for (const config of jobOrdersConfig) {
      console.log(`\n📦 Creating Job Order: ${config.jobOrderNumber}`);
      console.log(`   Product: ${config.productName}`);
      console.log(`   Quantity: ${config.totalQuantity}`);
      console.log(`   Due Date: ${config.dueDate.toLocaleDateString()}`);
      
      // Get operations
      const operations = await getOperationsByNames(config.requiredOperations);
      const totalStandardTime = operations.reduce((sum, op) => sum + op.standardTime, 0);
      const estimatedHours = (totalStandardTime * config.totalQuantity) / 60;
      
      console.log(`   Operations: ${operations.length}`);
      console.log(`   Standard Time per device: ${totalStandardTime} min`);
      console.log(`   Estimated Hours: ${estimatedHours.toFixed(2)} hrs`);
      
      // Generate serial numbers
      const serialNumbers = [];
      for (let i = 1; i <= config.totalQuantity; i++) {
        serialNumbers.push(generateSerialNumber(config.productCode, i));
      }
      
      // Create job order
      const jobOrder = await JobOrder.create({
        jobOrderNumber: config.jobOrderNumber,
        productName: config.productName,
        productCode: config.productCode,
        totalQuantity: config.totalQuantity,
        completedQuantity: 0,
        priority: config.priority,
        status: 'pending',
        dueDate: config.dueDate,
        startDate: null,
        completionDate: null,
        assignedTechnicians: [],
        serialNumbers: serialNumbers,
        notes: `Required operations: ${config.requiredOperations.join(', ')}`,
        estimatedHours: estimatedHours
      });
      
      console.log(`   ✅ Job Order created: ${jobOrder.id}`);
      
      // Create devices for this job order
      console.log(`   Creating ${serialNumbers.length} devices...`);
      const devices = [];
      
      for (const serialNumber of serialNumbers) {
        const device = await Device.create({
          serialNumber: serialNumber,
          jobOrderId: jobOrder.id,
          status: 'pending',
          currentStage: 'production',
          assignedTechnicianId: null,
          notes: '',
          defects: []
        });
        
        devices.push(device);
      }
      
      console.log(`   ✅ Created ${devices.length} devices`);
      
      // Store operations in a separate collection for this job order
      const jobOrderOperationsRef = db.collection('jobOrderOperations').doc();
      await jobOrderOperationsRef.set({
        jobOrderId: jobOrder.id,
        jobOrderNumber: config.jobOrderNumber,
        operations: operations.map(op => ({
          operationId: op.id,
          name: op.name,
          category: op.category,
          standardTime: op.standardTime
        })),
        totalStandardTime: totalStandardTime,
        createdAt: new Date()
      });
      
      createdJobOrders.push({
        jobOrder,
        devices,
        operations
      });
    }
    
    console.log('\n' + '='.repeat(70));
    console.log(`✨ Successfully created ${createdJobOrders.length} job orders!`);
    console.log('='.repeat(70));
    
    // Summary
    console.log('\n📊 Summary:');
    let totalDevices = 0;
    let totalEstimatedHours = 0;
    
    for (const { jobOrder, devices } of createdJobOrders) {
      totalDevices += devices.length;
      totalEstimatedHours += jobOrder.estimatedHours || 0;
      
      console.log(`\n   ${jobOrder.jobOrderNumber} - ${jobOrder.productName}`);
      console.log(`      Devices: ${devices.length}`);
      console.log(`      Priority: ${jobOrder.priority}`);
      console.log(`      Due: ${new Date(jobOrder.dueDate).toLocaleDateString()}`);
      console.log(`      Estimated Hours: ${(jobOrder.estimatedHours || 0).toFixed(2)}`);
    }
    
    console.log(`\n   Total Devices: ${totalDevices}`);
    console.log(`   Total Estimated Hours: ${totalEstimatedHours.toFixed(2)}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating job orders:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
createSampleJobOrders();
