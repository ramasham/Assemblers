# 🚀 How to Start Your Application

## Quick Start Guide

### Step 1: Start Backend Server

Open a terminal and run:

```bash
cd /home/rsham/ass/backend
npm run dev
```

You should see:
```
✅ Firebase Admin initialized with service account file
📧 Service account: firebase-adminsdk-xxxxx@...
🚀 Server running on port 3001
```

**Keep this terminal open!**

---

### Step 2: Setup Users (First Time Only)

Open a **NEW** terminal and run:

```bash
cd /home/rsham/ass/backend
node scripts/setupAllUsers.js
```

This will create all 18 users. You only need to do this once.

---

### Step 3: Start Frontend

Open **ANOTHER** terminal and run:

```bash
cd /home/rsham/ass/frontend
pnpm run dev
```

You should see:
```
- Local:        http://localhost:3000
```

---

### Step 4: Open Browser

Go to: **http://localhost:3000**

---

## 🔑 Test Login Credentials

Try any of these to login:

```
Engineer Planner:
planner@company.com / planner123

Production Supervisor:
supervisor.production@company.com / supervisor123

Production Technician:
mike.davis@company.com / tech123
```

---

## ❌ Troubleshooting

### "Failed to fetch" error

**Problem**: Backend is not running

**Solution**: Make sure backend server is running in Step 1

Check if backend is running:
```bash
lsof -i :3001
```

If nothing shows up, backend is not running. Go back to Step 1.

---

### "Invalid email or password" error

**Problem**: Users haven't been created yet

**Solution**: Run Step 2 to create users

---

### Backend crashes on startup

**Problem**: Firebase credentials issue

**Solution**: Check that `/home/rsham/ass/backend/config/serviceAccountKey.json` exists

```bash
ls -l /home/rsham/ass/backend/config/serviceAccountKey.json
```

If file doesn't exist, you need to download it from Firebase Console.

---

## 📝 Summary

**You need 3 terminals running:**

1. **Terminal 1**: Backend server (`npm run dev`)
2. **Terminal 2**: Frontend server (`pnpm run dev`)  
3. **Terminal 3**: For running setup scripts (optional)

**Then open browser to:** http://localhost:3000
