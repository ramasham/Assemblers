import { initializeFirebase } from '../config/firebase.js';
import { collections } from '../services/firestore.js';
import { admin } from '../config/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Populate operations data with department-specific operations
 * Quality department sees only Quality operations
 * Production department sees only Production operations
 */

const operationsData = {
  Quality: [
    { name: 'Quality Assemblage I', currentTime: 18, department: 'Quality', category: 'Assembly' },
    { name: 'Quality Assemblage II', currentTime: 10, department: 'Quality', category: 'Assembly' },
    { name: 'Final inspection', currentTime: 13, department: 'Quality', category: 'Inspection' },
    { name: 'Packing', currentTime: 10, department: 'Quality', category: 'Packaging' }
  ],
  
  Production: [
    // Main Assembly Operations
    { name: 'Assemblage I', currentTime: 32, department: 'Production', category: 'Assembly' },
    { name: 'Assemblage II', currentTime: 30, department: 'Production', category: 'Assembly' },
    { name: 'Assemblage II tubeless', currentTime: 13, department: 'Production', category: 'Assembly' },
    { name: 'Final Touch - Cleaning&Packing', currentTime: 10, department: 'Production', category: 'Final Touch' },
    { name: 'Final Touch - Paint&Labeling', currentTime: 15, department: 'Production', category: 'Final Touch' },
    { name: 'Final Touch - Purge Vulve&Cleaning', currentTime: 5, department: 'Production', category: 'Final Touch' },
    { name: 'FocusA340', currentTime: 20, department: 'Production', category: 'Focus' },
    { name: 'FocusA360', currentTime: 10, department: 'Production', category: 'Focus' },
    { name: 'Lens Cleaning', currentTime: 35, department: 'Production', category: 'Cleaning' },
    { name: 'Objective and Doublet', currentTime: 24, department: 'Production', category: 'Assembly' },
    { name: 'Nitrogen', currentTime: 10, department: 'Production', category: 'Processing' },
    
    // Sub-Assemblies
    { name: 'Battery Contact Assy.', currentTime: 4, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Battery Cover Assy.', currentTime: 2, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Beam Combiner Assy.', currentTime: 15, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Cover Assy.', currentTime: 30, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Eyepiece Assy.', currentTime: 15, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Focus Assy.A340', currentTime: 30, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Focus Assy.A360', currentTime: 40, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Reticle Assy.', currentTime: 30, department: 'Production', category: 'Sub-Assembly' },
    { name: 'Tube Assy.', currentTime: 16, department: 'Production', category: 'Sub-Assembly' },
    
    // Troubleshooting Operations
    { name: 'Adaptors Installation', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Add Tube Spacers', currentTime: 45, department: 'Production', category: 'Troubleshooting' },
    { name: 'Adjust the Fiber Optic', currentTime: 10, department: 'Production', category: 'Troubleshooting' },
    { name: 'Adjusters', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Attaching Label', currentTime: 1, department: 'Production', category: 'Troubleshooting' },
    { name: 'Bushing Installation', currentTime: 2, department: 'Production', category: 'Troubleshooting' },
    { name: 'Change Battery contact', currentTime: 10, department: 'Production', category: 'Troubleshooting' },
    { name: 'Change Beam', currentTime: 7, department: 'Production', category: 'Troubleshooting' },
    { name: 'Change Eye Piece', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Change Power Card', currentTime: 30, department: 'Production', category: 'Troubleshooting' },
    { name: 'Change Reticle', currentTime: 2, department: 'Production', category: 'Troubleshooting' },
    { name: 'Change Reticle-Assy.II', currentTime: 7, department: 'Production', category: 'Troubleshooting' },
    { name: 'Clean the Reticle', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Clean Assemblage 1', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Clean Assemblage 2', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Contact Battery Installation', currentTime: 2, department: 'Production', category: 'Troubleshooting' },
    { name: 'Cover Assembly Only', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Cover Lacing', currentTime: 1.5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Cover lacing and macaroon', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Cover Silicon', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Dirt on Beam-Assy.I', currentTime: 8, department: 'Production', category: 'Troubleshooting' },
    { name: 'Dirt on Beam-Assy.II', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Dirt on Eye Piece', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Dirt on Objective Lens', currentTime: 45, department: 'Production', category: 'Troubleshooting' },
    { name: 'Dirt on Tube', currentTime: 45, department: 'Production', category: 'Troubleshooting' },
    { name: 'Dirt on Tube- Air blow gun', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Disassemble Assemblage I', currentTime: 11, department: 'Production', category: 'Troubleshooting' },
    { name: 'Epoxy on Blue Wire', currentTime: 1, department: 'Production', category: 'Troubleshooting' },
    { name: 'ESD Line Test', currentTime: 10, department: 'Production', category: 'Troubleshooting' },
    { name: 'Eyepiece Friction', currentTime: 7, department: 'Production', category: 'Troubleshooting' },
    { name: 'Filing Doublet', currentTime: 20, department: 'Production', category: 'Troubleshooting' },
    { name: 'Focus Dirt and reassembly', currentTime: 15, department: 'Production', category: 'Troubleshooting' },
    { name: 'Focus Shaft and Hub', currentTime: 10, department: 'Production', category: 'Troubleshooting' },
    { name: 'Focus Knob', currentTime: 32, department: 'Production', category: 'Troubleshooting' },
    { name: 'Focus Movement', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Focus Sub-Assembly Filling', currentTime: 15, department: 'Production', category: 'Troubleshooting' },
    { name: 'Housing Cleaning', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Install Cover Assy.', currentTime: 2, department: 'Production', category: 'Troubleshooting' },
    { name: 'Label Printing', currentTime: 0.3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Nitrogen Leakage', currentTime: 8, department: 'Production', category: 'Troubleshooting' },
    { name: 'Objective Lens Leakage', currentTime: 15, department: 'Production', category: 'Troubleshooting' },
    { name: 'Objective Lens Reassemblage', currentTime: 30, department: 'Production', category: 'Troubleshooting' },
    { name: 'Photoresistor Cover Installation', currentTime: 2, department: 'Production', category: 'Troubleshooting' },
    { name: 'Photoresistor Plug Replacement', currentTime: 20, department: 'Production', category: 'Troubleshooting' },
    { name: 'Power Card Installation', currentTime: 4, department: 'Production', category: 'Troubleshooting' },
    { name: 'Power Card not Working', currentTime: 30, department: 'Production', category: 'Troubleshooting' },
    { name: 'Quality tube check', currentTime: 20, department: 'Production', category: 'Troubleshooting' },
    { name: 'Reassemblage II', currentTime: 20, department: 'Production', category: 'Troubleshooting' },
    { name: 'Repaint and Device Cleaning', currentTime: 10, department: 'Production', category: 'Troubleshooting' },
    { name: 'Reticle Assembly Only', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Reticle Label', currentTime: 2, department: 'Production', category: 'Troubleshooting' },
    { name: 'Reticle Label and cleaning Troubeshooting', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Reticle Lens Cleaning', currentTime: 2, department: 'Production', category: 'Troubleshooting' },
    { name: 'Reticle Soldering', currentTime: 7, department: 'Production', category: 'Troubleshooting' },
    { name: 'Troubleshooting reticle (410)', currentTime: 14, department: 'Production', category: 'Troubleshooting' },
    { name: 'RTV', currentTime: 8, department: 'Production', category: 'Troubleshooting' },
    { name: 'Soldering Card Blue Wire', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Soldering Cover Assy.', currentTime: 16, department: 'Production', category: 'Troubleshooting' },
    { name: 'Soldering Tube Housing', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Stamp Traveller Forms', currentTime: 3, department: 'Production', category: 'Troubleshooting' },
    { name: 'Threading', currentTime: 5, department: 'Production', category: 'Troubleshooting' },
    { name: 'Tight Main Body- Focus', currentTime: 20, department: 'Production', category: 'Troubleshooting' },
    { name: 'Wire Stripping', currentTime: 1, department: 'Production', category: 'Troubleshooting' },
    { name: 'Clean beam and tube', currentTime: 10, department: 'Production', category: 'Troubleshooting' },
    { name: 'Return to Assy 1', currentTime: 17, department: 'Production', category: 'Troubleshooting' }
  ]
};

async function populateOperations() {
  try {
    console.log('\n🔧 Starting Operations Database Population...\n');
    
    // Initialize Firebase
    initializeFirebase();
    console.log('✅ Firebase initialized\n');

    const operationsCollection = collections.operations;

    // Clear existing operations
    console.log('🗑️  Clearing existing operations...');
    const existingOps = await operationsCollection.get();
    const deletePromises = existingOps.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${existingOps.docs.length} existing operations\n`);

    let totalCreated = 0;

    // Add Quality operations
    console.log('📋 Adding Quality Department Operations...');
    for (const op of operationsData.Quality) {
      await operationsCollection.add({
        ...op,
        description: `${op.name} operation for Quality department`,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`  ✅ ${op.name} (${op.currentTime} min)`);
      totalCreated++;
    }
    console.log(`✅ Added ${operationsData.Quality.length} Quality operations\n`);

    // Add Production operations
    console.log('📋 Adding Production Department Operations...');
    let assemblyCount = 0;
    let subAssemblyCount = 0;
    let troubleshootingCount = 0;

    for (const op of operationsData.Production) {
      await operationsCollection.add({
        ...op,
        description: `${op.name} operation for Production department`,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      if (op.category === 'Assembly' || op.category === 'Final Touch' || op.category === 'Focus' || op.category === 'Cleaning' || op.category === 'Processing') {
        assemblyCount++;
      } else if (op.category === 'Sub-Assembly') {
        subAssemblyCount++;
      } else if (op.category === 'Troubleshooting') {
        troubleshootingCount++;
      }
      
      totalCreated++;
    }
    
    console.log(`  ✅ Assembly Operations: ${assemblyCount}`);
    console.log(`  ✅ Sub-Assembly Operations: ${subAssemblyCount}`);
    console.log(`  ✅ Troubleshooting Operations: ${troubleshootingCount}`);
    console.log(`✅ Added ${operationsData.Production.length} Production operations\n`);

    console.log('='.repeat(80));
    console.log('📊 OPERATIONS DATABASE POPULATED!');
    console.log('='.repeat(80));
    console.log(`✅ Total Operations Created: ${totalCreated}`);
    console.log(`   • Quality Department: ${operationsData.Quality.length} operations`);
    console.log(`   • Production Department: ${operationsData.Production.length} operations`);
    console.log('='.repeat(80));

    console.log('\n📋 Department Access Summary:');
    console.log('   • Quality technicians will ONLY see Quality operations');
    console.log('   • Production technicians will ONLY see Production operations');
    console.log('   • Multi-department technicians see operations from all their departments\n');

    console.log('🔒 Security:');
    console.log('   • Firestore rules enforce department-based filtering');
    console.log('   • Operations are tagged with department field');
    console.log('   • API queries filter by user\'s active department\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

populateOperations();
