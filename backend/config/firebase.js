import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  // Check if already initialized
  if (admin.apps.length > 0) {
    console.log('ℹ️  Firebase already initialized, skipping...');
    return;
  }

  try {
    // Priority 1: Use service account file (RECOMMENDED for production)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const serviceAccountPath = join(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS);
      console.log('📁 Loading Firebase credentials from file...');
      
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log('✅ Firebase Admin initialized with service account file');
      console.log(`📧 Service account: ${serviceAccount.client_email}`);
    }
    // Priority 2: Use JSON string from environment variable
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('📝 Loading Firebase credentials from environment variable...');
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log('✅ Firebase Admin initialized with environment JSON');
    }
    // Priority 3: Use individual environment variables (fallback)
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('🔑 Loading Firebase credentials from environment variables...');
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
      });
      
      console.log('✅ Firebase Admin initialized with environment variables');
      console.log(`📧 Service account: ${process.env.FIREBASE_CLIENT_EMAIL}`);
    }
    else {
      console.error('❌ No Firebase credentials found!');
      console.error('Please set one of:');
      console.error('  1. GOOGLE_APPLICATION_CREDENTIALS (path to service account file)');
      console.error('  2. FIREBASE_SERVICE_ACCOUNT (JSON string)');
      console.error('  3. FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
      throw new Error('Firebase credentials not configured');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
};

export { admin, initializeFirebase };
