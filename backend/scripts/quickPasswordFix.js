import { db } from '../services/firestore.js';
import { admin, initializeFirebase } from '../config/firebase.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
initializeFirebase();

async function quickTest() {
  const email = 'planner@company.com';
  const password = 'planner123';
  
  console.log(`Testing login for ${email}...`);
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  console.log('Password hash created');
  
  // Find user in Firestore
  const usersCollection = db.collection('users');
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  
  if (snapshot.empty) {
    console.log('User not found!');
    return;
  }
  
  const doc = snapshot.docs[0];
  console.log('User found:', doc.id);
  
  // Update with password hash
  await usersCollection.doc(doc.id).update({
    passwordHash: passwordHash
  });
  
  console.log('Password hash added to Firestore!');
  console.log('\nNow try logging in with:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

quickTest().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
