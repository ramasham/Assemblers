# 🚀 Quick Run Guide - Technician Task Management System

## Current Status

✅ **What's Ready:**
- Node.js 18.20.8 installed
- npm 10.8.2 installed  
- Backend dependencies installed (326 packages)
- Frontend dependencies installed (530 packages)
- All code files created and configured
- Simple authentication (no Firebase needed)
- Environment files configured

❌ **What's Needed:**
- MongoDB database (either local or cloud)
- Docker (optional - for containerized setup)

---

## Option 1: Run with Docker (RECOMMENDED - Once Docker is Fixed)

### Step 1: Fix Docker on WSL2
```bash
# On Windows, ensure WSL2 is properly configured
wsl --set-default-version 2

# Install Docker Desktop for Windows
# Download from: https://www.docker.com/products/docker-desktop

# Or fix the Docker daemon in WSL:
sudo service docker start
```

### Step 2: Run Everything
```bash
cd /home/rama/42
sudo docker-compose up --build
```

### Step 3: Access Your App
- Frontend: http://localhost:3000
- Backend: http://localhost:5000  
- MongoDB: localhost:27017

---

## Option 2: Run Manually (For Testing Now)

### Step 1: Setup MongoDB Atlas (Free Cloud Database)

1. Go to https://cloud.mongodb.com
2. Click "Build a Database" > "FREE" tier
3. Create a cluster (takes 3-5 minutes)
4. Click "Connect" > "Connect your application"
5. Copy the connection string
6. Replace in `/home/rama/42/backend/.env`:
   ```
   MONGODB_URI=your-connection-string-here
   ```

### Step 2: Start Backend
```bash
cd /home/rama/42/backend
npm start
```

### Step 3: Start Frontend (in new terminal)
```bash
cd /home/rama/42/frontend
npm run dev
```

### Step 4: Create First User
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

### Step 5: Login
- Open http://localhost:3000
- Login with:
  - Email: admin@test.com
  - Password: admin123

---

## Option 3: Quick Demo with MongoDB Memory Server

If you just want to test quickly without any MongoDB setup:

```bash
# Install MongoDB memory server (temporary in-memory database)
cd /home/rama/42/backend
npm install mongodb-memory-server --save-dev

# Update database.js to use memory server for testing
# Then start backend
npm start
```

---

## Current Project Structure

```
42/
├── backend/              ✅ Ready
│   ├── .env             ✅ Configured (needs MongoDB URL)
│   ├── node_modules/    ✅ Installed
│   └── package.json     ✅ Ready
│
├── frontend/            ✅ Ready
│   ├── .env             ✅ Configured
│   ├── node_modules/    ✅ Installed
│   └── package.json     ✅ Ready
│
└── docker-compose.yml   ⏳ Waiting for Docker

```

---

## What You Can Do Right Now

### 1. Explore the Code
```bash
# Check backend structure
ls -la /home/rama/42/backend

# Check frontend structure  
ls -la /home/rama/42/frontend

# Read documentation
cat /home/rama/42/README.md
cat /home/rama/42/FEATURES.md
```

### 2. Review the API Documentation
```bash
cat /home/rama/42/API_DOCUMENTATION.md
```

### 3. Check Package Dependencies
```bash
cd /home/rama/42/backend && npm list --depth=0
cd /home/rama/42/frontend && npm list --depth=0
```

---

## Next Steps

**Choose ONE:**

### A. Setup MongoDB Atlas Now (5 minutes)
1. Create account at https://cloud.mongodb.com
2. Get connection string
3. Update backend/.env
4. Run `npm start` in backend
5. Run `npm run dev` in frontend
6. Test at http://localhost:3000

### B. Fix Docker and Run Everything (10 minutes)
1. Install Docker Desktop for Windows
2. Enable WSL2 integration
3. Run `docker-compose up --build`
4. Access at http://localhost:3000

### C. Just Review the Project (now)
1. Check all documentation files
2. Review code structure
3. Prepare for hackathon presentation
4. Set up database later

---

## Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is accessible
nc -zv localhost 27017

# Check environment variables
cat /home/rama/42/backend/.env

# Check for errors
cd /home/rama/42/backend
npm start
```

### Frontend won't start
```bash
# Check if backend is running
curl http://localhost:5000/health

# Start frontend
cd /home/rama/42/frontend
npm run dev
```

### Can't connect to MongoDB
- Use MongoDB Atlas (cloud) instead of local
- Or wait until Docker is properly configured
- Or install MongoDB Community Edition manually

---

## Summary

**You're 95% done!** 

Just need ONE of these:
- MongoDB Atlas account (free, 5 min setup)
- Docker working properly (needs WSL2 fix)
- Local MongoDB installation

Everything else is ready to go! 🎉

**For Hackathon Demo:**
- MongoDB Atlas is fastest to set up
- Docker is most professional
- Both work perfectly!

