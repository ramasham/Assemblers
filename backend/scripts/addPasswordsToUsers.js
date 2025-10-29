import { db } from '../services/firestore.js';
import { admin, initializeFirebase } from '../config/firebase.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase
initializeFirebase();

// User credentials mapping
const credentials = {
  'planner@company.com': 'planner123',
  'supervisor.production@company.com': 'super123',
  'supervisor.testing@company.com': 'super123',
  'supervisor.quality@company.com': 'super123',
  'mike.davis@company.com': 'tech123',
  'sarah.wilson@company.com': 'tech123',
  'james.brown@company.com': 'tech123',
  'lisa.anderson@company.com': 'tech123',
  'robert.martinez@company.com': 'tech123',
  'emily.chen@company.com': 'tech123',
  'david.lee@company.com': 'tech123',
  'jennifer.garcia@company.com': 'tech123',
  'michael.taylor@company.com': 'tech123',
  'amanda.white@company.com': 'tech123',
  'christopher.harris@company.com': 'tech123',
  'jessica.thompson@company.com': 'tech123',
  'daniel.moore@company.com': 'tech123',
  'michelle.jackson@company.com': 'tech123'
};

async function addPasswords() {
  try {
    console.log('🔐 Adding passwords to existing users...\n');

    const usersCollection = db.collection('users');
    const snapshot = await usersCollection.get();

    let updated = 0;
    let created = 0;
    let skipped = 0;

    for (const doc of snapshot.docs) {
      const user = doc.data();
      const email = user.email.toLowerCase();
      
      if (!credentials[email]) {
        console.log(`⏭️  Skipped ${email} - no password defined`);
        skipped++;
        continue;
      }

      const password = credentials[email];

      try {
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Update Firestore with password hash
        await usersCollection.doc(doc.id).update({
          passwordHash: passwordHash,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create/update Firebase Auth user
        try {
          await admin.auth().createUser({
            uid: user.uid || doc.id,
            email: email,
            password: password,
            displayName: user.name,
            emailVerified: true
          });
          console.log(`✅ Created Firebase Auth + Firestore password for ${email}`);
          created++;
        } catch (authError) {
          if (authError.code === 'auth/email-already-exists') {
            // Update existing Firebase Auth user
            const existingUser = await admin.auth().getUserByEmail(email);
            await admin.auth().updateUser(existingUser.uid, {
              password: password
            });
            console.log(`✅ Updated Firebase Auth + Firestore password for ${email}`);
            updated++;
          } else if (authError.code === 'auth/uid-already-exists') {
            // Update with email lookup
            const existingUser = await admin.auth().getUserByEmail(email);
            await admin.auth().updateUser(existingUser.uid, {
              password: password
            });
            console.log(`✅ Updated Firebase Auth + Firestore password for ${email}`);
            updated++;
          } else {
            throw authError;
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${email}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`\n✅ Done!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addPasswords();
