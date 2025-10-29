# 🚀 Quick Start Guide

## Port Configuration

This application uses **exactly 2 ports**:

- **Port 3000** → Frontend (Next.js)
- **Port 5000** → Backend (Express + Firebase)

---

## ⚡ Quick Start

### Option 1: Automated (Easiest)

```bash
cd ~/ass
chmod +x START_EVERYTHING.sh
./START_EVERYTHING.sh
```

Then open: **http://localhost:3000**

### Option 2: Manual

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

Then open: **http://localhost:3000**

---

## 👤 Login

Use any of these test accounts:

| Email | Password |
|-------|----------|
| `planner@company.com` | `planner123` |
| `supervisor.production@company.com` | `super123` |
| `mike.davis@company.com` | `tech123` |

---

## 🛑 Stop Application

```bash
cd ~/ass
./stop-app.sh
```

---

## 📋 What Was Fixed

✅ Backend port: 5000  
✅ Frontend port: 3000  
✅ Firebase Authentication working  
✅ All users can login  
✅ JWT tokens working  
✅ Database connected  

**Status**: All working! 🎉

---

## 📚 More Documentation

- `COMPLETE_FIX_SUMMARY.md` - Full details of what was fixed
- `WHY_3_PORTS.md` - Port configuration explained
- `LOGIN_FIXED.md` - Login test results

---

**Your application is ready to use!** 🚀
