# Quick Start Guide

## 🚀 Get Running in 10 Minutes

This is the fastest way to get the Technician Task Management System running locally.

---

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free)
- Firebase account (free)

---

## 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in new terminal)
cd frontend
npm install
```

---

## 2. Setup MongoDB Atlas

1. Create free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist all IPs: `0.0.0.0/0`
4. Get connection string

---

## 3. Setup Firebase

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Get web app config
4. Download service account JSON (for backend)

---

## 4. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB and Firebase credentials
```

---

## 5. Configure Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your Firebase web config
```

---

## 6. Start Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## 7. Create First User

Using Postman or curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Test Admin",
    "employeeId": "ADMIN001",
    "role": "admin"
  }'
```

---

## 8. Login

1. Open http://localhost:5173
2. Login with: `admin@test.com` / `admin123`
3. Explore the dashboard!

---

## Need Help?

See full documentation:
- **SETUP.md** - Detailed setup instructions
- **README.md** - Complete project overview
- **USER_GUIDE.md** - How to use the system

---

## Common Issues

**Backend won't start?**
- Check MongoDB connection string
- Verify Firebase credentials

**Frontend can't connect?**
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env

**Can't login?**
- Verify user was created successfully
- Check Firebase console for errors

---

**That's it!** You're ready to build for your hackathon! 🎉
