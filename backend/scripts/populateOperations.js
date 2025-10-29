import { initializeFirebase } from '../config/firebase.js';
import { db } from '../services/firestore.js';

// Initialize Firebase
initializeFirebase();

// Operations data from the provided table
const operationsData = {
  Quality: [
    { name: 'Quality Assemblage I', standardTime: 18 },
    { name: 'Quality Assemblage II', standardTime: 10 },
    { name: 'Final Inspection', standardTime: 13 },
    { name: 'Packing', standardTime: 10 }
  ],
  
  Production: [
    { name: 'Assemblage I', standardTime: 32 },
    { name: 'Assemblage II', standardTime: 30 },
    { name: 'Assemblage II tubeless', standardTime: 13 },
    { name: 'Final Touch - Cleaning&Packing', standardTime: 10 },
    { name: 'Final Touch - Paint&Labeling', standardTime: 15 },
    { name: 'Final Touch - Purge Valve&Cleaning', standardTime: 5 },
    { name: 'Focus A340', standardTime: 20 },
    { name: 'Focus A360', standardTime: 10 },
    { name: 'Lens Cleaning', standardTime: 35 },
    { name: 'Objective and Doublet', standardTime: 24 },
    { name: 'Nitrogen', standardTime: 10 }
  ],
  
  'Sub-Assemblies': [
    { name: 'Battery Contact Assy.', standardTime: 4 },
    { name: 'Battery Cover Assy.', standardTime: 2 },
    { name: 'Beam Combiner Assy.', standardTime: 15 },
    { name: 'Cover Assy.', standardTime: 30 },
    { name: 'Eyepiece Assy.', standardTime: 15 },
    { name: 'Focus Assy. A340', standardTime: 30 },
    { name: 'Focus Assy. A360', standardTime: 40 },
    { name: 'Reticle Assy.', standardTime: 30 },
    { name: 'Tube Assy.', standardTime: 16 }
  ],
  
  Test: [
    { name: 'Operation', standardTime: null }, // Header row, skip
    { name: 'Adjustment', standardTime: 37 },
    { name: 'Unit Test', standardTime: 20 },
    { name: 'Immersion', standardTime: 3 }
  ],
  
  Troubleshooting: [
    { name: 'Adaptors Installation', standardTime: 3 },
    { name: 'Add Tube Spacers', standardTime: 45 },
    { name: 'Adjust the Fiber Optic', standardTime: 10 },
    { name: 'Adjusters', standardTime: 5 },
    { name: 'Attaching Label', standardTime: 1 },
    { name: 'Bushing Installation', standardTime: 2 },
    { name: 'Change Battery contact', standardTime: 10 },
    { name: 'Change Beam', standardTime: 7 },
    { name: 'Change Eye Piece', standardTime: 3 },
    { name: 'Change Power Card', standardTime: 30 },
    { name: 'Change Reticle', standardTime: 2 },
    { name: 'Change Reticle-Assy.II', standardTime: 7 },
    { name: 'Clean the Reticle', standardTime: 5 },
    { name: 'Clean Assemblage 1', standardTime: 5 },
    { name: 'Clean Assemblage 2', standardTime: 3 },
    { name: 'Contact Battery Installation', standardTime: 2 },
    { name: 'Cover Assembly Only', standardTime: 3 },
    { name: 'Cover Lacing', standardTime: 1.5 },
    { name: 'Cover lacing and macaroon', standardTime: 3 },
    { name: 'Cover Silicon', standardTime: 5 },
    { name: 'Dirt on Beam-Assy.I', standardTime: 8 },
    { name: 'Dirt on Beam-Assy.II', standardTime: 5 },
    { name: 'Dirt on Eye Piece', standardTime: 3 },
    { name: 'Dirt on Objective Lens', standardTime: 45 },
    { name: 'Dirt on Tube', standardTime: 45 },
    { name: 'Dirt on Tube- Air blow gun', standardTime: 3 },
    { name: 'Disassemble Assemblage I', standardTime: 11 },
    { name: 'Epoxy on Blue Wire', standardTime: 1 },
    { name: 'ESD Line Test', standardTime: 10 },
    { name: 'Eyepiece Friction', standardTime: 7 },
    { name: 'Filing Doublet', standardTime: 20 },
    { name: 'Focus Dirt and reassembly', standardTime: 15 },
    { name: 'Focus Shaft and Hub', standardTime: 10 },
    { name: 'Focus Knob', standardTime: 32 },
    { name: 'Focus Movement', standardTime: 5 },
    { name: 'Focus Sub-Assembly Filing', standardTime: 15 },
    { name: 'Housing Cleaning', standardTime: 5 },
    { name: 'Install Cover Assy.', standardTime: 2 },
    { name: 'Label Printing', standardTime: 0.3 },
    { name: 'Nitrogen Leakage', standardTime: 8 },
    { name: 'Objective Lens Leakage', standardTime: 15 },
    { name: 'Objective Lens Reassemblage', standardTime: 30 },
    { name: 'Photoresistor Cover Installation', standardTime: 2 },
    { name: 'Photoresistor Plug Replacement', standardTime: 20 },
    { name: 'Power Card Installation', standardTime: 4 },
    { name: 'Power Card not Working', standardTime: 30 },
    { name: 'Quality tube check', standardTime: 20 },
    { name: 'Reassemblage II', standardTime: 20 },
    { name: 'Repaint and Device Cleaning', standardTime: 10 },
    { name: 'Reticle Assembly Only', standardTime: 5 },
    { name: 'Reticle Label', standardTime: 2 },
    { name: 'Reticle Label and cleaning Troubleshooting', standardTime: 5 },
    { name: 'Reticle Lens Cleaning', standardTime: 2 },
    { name: 'Reticle Soldering', standardTime: 7 },
    { name: 'Troubleshooting reticle (410)', standardTime: 14 },
    { name: 'RTV', standardTime: 8 },
    { name: 'Soldering Card and Blue Wire', standardTime: 3 },
    { name: 'Soldering Cover Assy.', standardTime: 16 },
    { name: 'Soldering Tube Housing', standardTime: 3 },
    { name: 'Stamp Traveller Forms', standardTime: 3 },
    { name: 'Threading', standardTime: 5 },
    { name: 'Tight Main Body- Focus', standardTime: 20 },
    { name: 'Wire Stripping', standardTime: 1 },
    { name: 'Clean beam and tube', standardTime: 10 },
    { name: 'Return to Assy 1', standardTime: 17 }
  ]
};

async function populateOperations() {
  try {
    console.log('🚀 Starting operations population...\n');
    
    let totalCreated = 0;
    const batch = db.batch();
    
    for (const [category, operations] of Object.entries(operationsData)) {
      console.log(`\n📁 Processing category: ${category}`);
      console.log(`   Operations to add: ${operations.length}`);
      
      for (const operation of operations) {
        // Skip header rows or invalid entries
        if (!operation.standardTime || operation.name === 'Operation' || operation.name === 'Current Time (min)') {
          console.log(`   ⏭️  Skipping: ${operation.name} (no standard time)`);
          continue;
        }
        
        const operationRef = db.collection('operations').doc();
        const operationData = {
          name: operation.name,
          category: category,
          standardTime: operation.standardTime,
          description: `${category} operation: ${operation.name}`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        batch.set(operationRef, operationData);
        totalCreated++;
        
        console.log(`   ✅ Added: ${operation.name} (${operation.standardTime} min)`);
      }
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log('\n' + '='.repeat(60));
    console.log(`✨ Successfully created ${totalCreated} operations!`);
    console.log('='.repeat(60));
    
    // Display summary by category
    console.log('\n📊 Summary by Category:');
    for (const [category, operations] of Object.entries(operationsData)) {
      const validOps = operations.filter(op => op.standardTime && op.name !== 'Operation');
      const totalTime = validOps.reduce((sum, op) => sum + op.standardTime, 0);
      const avgTime = totalTime / validOps.length;
      
      console.log(`\n   ${category}:`);
      console.log(`      Operations: ${validOps.length}`);
      console.log(`      Total Standard Time: ${totalTime} min`);
      console.log(`      Average Time: ${avgTime.toFixed(2)} min`);
    }
    
    // Verify the data
    const snapshot = await db.collection('operations').get();
    console.log(`\n✅ Verification: ${snapshot.size} operations in database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating operations:', error);
    process.exit(1);
  }
}

// Run the script
populateOperations();
