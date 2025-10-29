import { db } from '../services/firestore.js';

async function checkUser() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', 'planner@company.com').get();
  
  if (!snapshot.empty) {
    const user = snapshot.docs[0].data();
    console.log('Planner user data:');
    console.log('- Email:', user.email);
    console.log('- Has passwordHash:', !!user.passwordHash);
    console.log('- currentRole:', user.currentRole);
    console.log('- allowedRoles:', user.allowedRoles);
    
    // Check other users too
    const allUsers = await usersRef.limit(3).get();
    console.log('\nFirst 3 users:');
    allUsers.forEach(doc => {
      const u = doc.data();
      console.log(`- ${u.email}: passwordHash=${!!u.passwordHash}`);
    });
  } else {
    console.log('User not found');
  }
  
  process.exit(0);
}

checkUser();
