import { db } from '../services/firestore.js';
import { initializeFirebase } from '../config/firebase.js';
import bcrypt from 'bcrypt';

initializeFirebase();

const usersToFix = [
  { email: 'planner@company.com', password: 'planner123' },
  { email: 'supervisor.production@company.com', password: 'super123' },
  { email: 'supervisor.testing@company.com', password: 'super123' },
  { email: 'supervisor.quality@company.com', password: 'super123' }
];

async function fixPasswords() {
  console.log('🔐 Fixing passwords for planner and supervisors...\n');
  
  for (const { email, password } of usersToFix) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      if (snapshot.empty) {
        console.log(`❌ User not found: ${email}`);
        continue;
      }
      
      const doc = snapshot.docs[0];
      const passwordHash = await bcrypt.hash(password, 10);
      
      await usersRef.doc(doc.id).update({
        passwordHash: passwordHash
      });
      
      console.log(`✅ Updated password for ${email}`);
    } catch (error) {
      console.log(`❌ Error for ${email}:`, error.message);
    }
  }
  
  console.log('\n✅ All done! Try logging in now.');
  process.exit(0);
}

fixPasswords().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
