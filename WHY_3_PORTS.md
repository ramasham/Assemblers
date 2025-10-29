# 🔌 Port Configuration

## Your Application Uses Only 2 Ports

Your application has been configured to use **exactly 2 ports**:

### 📊 Port Configuration

| Port | Purpose | Status | Details |
|------|---------|--------|---------|
| **5000** | 🔧 Backend API | Required | Express server with Firebase Auth |
| **3000** | 🎨 Frontend | Required | Next.js development server |

---

## 🎯 The Setup

```
┌─────────────────────────────────────────┐
│  🎨 Frontend (Next.js)                  │
│  Port: 3000                             │
│  URL: http://localhost:3000             │
└─────────────────────────────────────────┘
                  ↓ API calls
┌─────────────────────────────────────────┐
│  🔧 Backend (Express + Firebase)        │
│  Port: 5000                             │
│  URL: http://localhost:5000             │
└─────────────────────────────────────────┘
```

---

## � How to Start Your Application

All old processes have been cleaned up. Now you can start fresh with only 2 ports:

### Method 1: Automated Start (Recommended)

```bash
cd ~/ass
chmod +x START_EVERYTHING.sh
./START_EVERYTHING.sh
```

This script will:
- ✅ Clean up any old processes
- ✅ Free up ports 3000 and 5000
- ✅ Start backend on port 5000
- ✅ Start frontend on port 3000
- ✅ Show you the URLs to use

### Method 2: Manual Start (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd ~/ass/backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd ~/ass/frontend
npm run dev
```

**Expected Output:**
```
✓ Ready in 1234ms
○ Local: http://localhost:3000
```

Then open: **http://localhost:3000** and login! 🎉

---

## ✅ Verification

After starting, verify both ports are running:

```bash
# Check backend (should return health status)
curl http://localhost:5000/health

# Check frontend (should return HTML)
curl http://localhost:3000 | head -20
```

---

## 📝 Summary

**Ports Used**: Only 2
1. **Port 5000** = Backend API
2. **Port 3000** = Frontend UI

**URLs**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**All old processes cleaned up** ✅  
**Port 3001 no longer used** ✅  
**Ready to start fresh** ✅
