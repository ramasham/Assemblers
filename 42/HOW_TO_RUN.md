# 🚀 HOW TO RUN THE PROJECT (NO DOCKER)

## Step 1: Setup MongoDB Atlas (Free Cloud Database - 5 minutes)

### 1.1 Create Account
1. Go to: https://cloud.mongodb.com
2. Click "Try Free"
3. Sign up with Google/Email

### 1.2 Create Database
1. Click "Build a Database"
2. Choose "M0 FREE" tier
3. Choose any cloud provider (AWS recommended)
4. Choose closest region to you
5. Click "Create Cluster" (wait 3-5 minutes)

### 1.3 Setup Database Access
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `admin`
4. Password: `admin123` (or create your own)
5. Click "Add User"

### 1.4 Setup Network Access
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for testing)
4. Click "Confirm"

### 1.5 Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Click "Drivers"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password (admin123)

---

## Step 2: Configure Backend

### 2.1 Update .env file
```bash
nano /home/rama/42/backend/.env
```

### 2.2 Paste this (replace with YOUR connection string):
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/technician-task-db?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=CyM9IBlaNcbjXuCrWI52eJ81vbUGHOqSGhPsdvw/Zm8=

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace the MONGODB_URI with your actual connection string from Step 1.5

---

## Step 3: Start Backend Server

```bash
cd /home/rama/42/backend
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

**Leave this terminal running!**

---

## Step 4: Start Frontend (Open NEW Terminal)

### 4.1 Open a new terminal and run:
```bash
cd /home/rama/42/frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Leave this terminal running too!**

---

## Step 5: Create First User

### 5.1 Open a THIRD terminal and run:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "employeeId": "ADMIN001",
    "role": "admin"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "...",
    "email": "admin@test.com",
    "name": "Admin User",
    "employeeId": "ADMIN001",
    "role": "admin",
    "token": "..."
  }
}
```

---

## Step 6: Login to Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. Login with:
   - **Email:** `admin@test.com`
   - **Password:** `admin123`

🎉 **You're in!**

---

## 📋 Quick Reference

### Start Both Servers:
```bash
# Terminal 1 - Backend
cd /home/rama/42/backend && npm start

# Terminal 2 - Frontend  
cd /home/rama/42/frontend && npm run dev
```

### Access Application:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

### Stop Servers:
Press `Ctrl + C` in each terminal

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection string in .env
cat /home/rama/42/backend/.env

# Make sure you replaced <password> with actual password
# Make sure no spaces or quotes around the connection string
```

### Frontend won't start
```bash
# Make sure backend is running first
curl http://localhost:5000/health

# If backend is not running, start it first
cd /home/rama/42/backend && npm start
```

### Can't create user
```bash
# Make sure backend is running
# Check backend terminal for errors
# Make sure MongoDB is connected (check backend logs)
```

### Can't login
- Make sure you created the user first (Step 5)
- Use exact credentials: admin@test.com / admin123
- Check browser console for errors (F12)

---

## 📊 What You'll See

### Dashboard Features:
- **Real-time metrics** (productivity, efficiency, utilization)
- **Charts and graphs** (job progress, technician performance)
- **Job order tracking** with serial numbers
- **Task logging** with time tracking
- **Alert system** for delays and issues
- **Role-based access** (admin, supervisor, planner, technician)

### Test Data:
After login, you can:
1. Create job orders
2. Assign tasks to technicians
3. Log work hours
4. View analytics and reports
5. Manage alerts

---

## 🎯 Summary

**3 Simple Steps:**
1. ✅ Setup MongoDB Atlas (5 min)
2. ✅ Start backend: `cd backend && npm start`
3. ✅ Start frontend: `cd frontend && npm run dev`

**Then access:** http://localhost:5173

**That's it!** 🚀

---

## Need Help?

Check the logs in your terminals:
- **Backend errors:** Check Terminal 1 (backend)
- **Frontend errors:** Check Terminal 2 (frontend)
- **Browser errors:** Press F12 > Console tab

Good luck with your hackathon! 🎉
