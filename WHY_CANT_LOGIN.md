# 🔍 WHY YOU CAN'T LOGIN - COMPLETE DIAGNOSIS

## Root Causes Identified:

### ❌ Problem 1: Backend Server is NOT Running
**Evidence**: No Node.js processes found, port 3001 not listening
**Why it matters**: Frontend tries to call `http://localhost:3001/api/auth/login` but nothing is there
**Result**: "Failed to fetch" error in browser console

### ❌ Problem 2: Users Haven't Been Created Yet  
**Why it matters**: Even if backend was running, there are no users in Firebase/Firestore to authenticate
**Result**: Would get "Invalid email or password" error

### ✅ Fixed: Frontend API URL Configuration
**Was**: Using `http://localhost:5000` (wrong port)
**Now**: Using `http://localhost:3001` (correct port)
**File**: `/home/rsham/ass/frontend/.env`

---

## 📋 THE COMPLETE FIX - Step by Step

### **TERMINAL 1: Start Backend**

```bash
cd /home/rsham/ass/backend
npm run dev
```

**Expected Output:**
```
[nodemon] 3.1.10
[nodemon] starting `node server.js`
📁 Loading Firebase credentials from file...
✅ Firebase Admin initialized with service account file
📧 Service account: firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
✅ Firebase and Firestore initialized
🚀 Server running on port 3001
Server is listening on http://localhost:3001
```

**⚠️ IMPORTANT**: Keep this terminal window open! Don't close it!

---

### **TERMINAL 2: Setup Users (First Time Only)**

Open a **NEW** terminal:

```bash
cd /home/rsham/ass/backend
node scripts/setupAllUsers.js
```

**Expected Output:**
```
🚀 Starting Complete User Setup...
✅ Firebase initialized
🗑️  Cleaning up existing users...
✅ Deleted X users from Firestore
✅ Deleted X users from Firebase Auth
👥 Creating NEW users...
✅ Created Engineer Planner: planner@company.com
✅ Created Supervisor (Production): supervisor.production@company.com
... (more users)
✅ Successfully created: 18 users
```

**You only need to run this ONCE**

---

### **TERMINAL 3: Start Frontend**

Open **ANOTHER** new terminal:

```bash
cd /home/rsham/ass/frontend
pnpm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000

 ✓ Ready in 2.3s
```

**⚠️ IMPORTANT**: Keep this terminal window open too!

---

### **STEP 4: Test in Browser**

1. Open browser to: **http://localhost:3000**
2. You should see the login page
3. Try logging in with:
   ```
   Email: planner@company.com
   Password: planner123
   ```

---

## 🔑 All Login Credentials

### Engineer Planner
```
planner@company.com / planner123
```

### Supervisors
```
supervisor.production@company.com / supervisor123
supervisor.testing@company.com / supervisor123
supervisor.quality@company.com / supervisor123
```

### Production Technicians
```
mike.davis@company.com / tech123
sarah.wilson@company.com / tech123
james.brown@company.com / tech123
lisa.anderson@company.com / tech123
robert.martinez@company.com / tech123
```

### Testing Technicians
```
emily.chen@company.com / tech123
david.lee@company.com / tech123
jennifer.garcia@company.com / tech123
michael.taylor@company.com / tech123
amanda.white@company.com / tech123
```

### Quality Technicians
```
christopher.harris@company.com / tech123
jessica.thompson@company.com / tech123
daniel.moore@company.com / tech123
michelle.jackson@company.com / tech123
```

---

## ✅ Quick Check Before Login

Run this command to verify everything is ready:

```bash
/home/rsham/ass/check-ready.sh
```

This will check:
- ✅ Firebase credentials exist
- ✅ Backend server is running
- ✅ Frontend server is running
- ✅ Backend API is responding

---

## 🐛 Debugging Tips

### Check if Backend is Running
```bash
lsof -i :3001
```
If nothing shows, backend is NOT running.

### Check if Frontend is Running
```bash
lsof -i :3000
```
If nothing shows, frontend is NOT running.

### Check Backend Logs
Look at the terminal where you started backend (`npm run dev`)
Look for errors or warnings

### Check Frontend Console
Open browser DevTools (F12)
Go to Console tab
Look for errors (especially "Failed to fetch")

### Test Backend API Directly
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"ok","timestamp":"..."}`

---

## 💡 Pro Tips

1. **Always start backend BEFORE frontend**
2. **Always run user setup script BEFORE trying to login**
3. **Keep both backend and frontend terminals open**
4. **If you get "Failed to fetch", backend is not running**
5. **If you get "Invalid credentials", users weren't created**

---

## 🎯 Quick Start Command (All in One)

You can also use the root scripts:

**Terminal 1:**
```bash
cd /home/rsham/ass
npm run dev:backend
```

**Terminal 2:**
```bash
cd /home/rsham/ass  
npm run dev:frontend
```

---

## Files You Can Reference

- **/home/rsham/ass/USER_CREDENTIALS.md** - All login credentials
- **/home/rsham/ass/START_APP.md** - Startup instructions
- **/home/rsham/ass/check-ready.sh** - Pre-login checklist script
- **/home/rsham/ass/backend/scripts/setupAllUsers.js** - User creation script

---

**That's it! Follow these steps exactly and you'll be able to login.** 🚀
