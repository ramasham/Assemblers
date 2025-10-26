# Setup Guide - Technician Task Management System

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Firebase Account** - [Sign up](https://firebase.google.com/)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create an account
3. Click **"Build a Database"**
4. Choose **FREE** tier (M0 Sandbox)
5. Select your preferred cloud provider and region
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 2: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username (e.g., `admin`) and a strong password
5. Set **"Database User Privileges"** to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Whitelist IP Address

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0) for development
   - For production, use specific IP addresses
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go back to **"Database"** in the sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your actual credentials
6. Save this for later

---

## Part 2: Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "technician-task-manager")
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click on **"Email/Password"** under Sign-in method
4. Enable **"Email/Password"**
5. Click **"Save"**

### Step 3: Get Web App Credentials

1. In Project Overview, click the **Web icon** (</>)
2. Enter app nickname (e.g., "frontend")
3. Click **"Register app"**
4. Copy the Firebase configuration object:
   ```javascript
   {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   }
   ```
5. Save this for later

### Step 4: Generate Service Account (Backend)

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Go to **"Service accounts"** tab
4. Click **"Generate new private key"**
5. Click **"Generate key"** (downloads a JSON file)
6. **IMPORTANT**: Keep this file secure, never commit to Git

---

## Part 3: Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your values:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/technician-task-db?retryWrites=true&w=majority
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Firebase Admin SDK (from service account JSON)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

   **Notes**:
   - Replace `username` and `password` in MONGODB_URI
   - For `FIREBASE_PRIVATE_KEY`, copy from the downloaded JSON file
   - Make sure to keep the `\n` characters in the private key

### Step 4: Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-xxx.mongodb.net
✅ Firebase Admin initialized
╔═══════════════════════════════════════════════════════════════╗
║   🚀 Technician Task Management System - Backend API         ║
║   Server running on: http://localhost:5000                   ║
╚═══════════════════════════════════════════════════════════════╝
```

### Step 5: Test the API

Open a browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-26T..."
}
```

---

## Part 4: Frontend Setup

### Step 1: Open New Terminal and Navigate to Frontend

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React, React Router
- Tailwind CSS, Shadcn/UI
- Firebase Client SDK
- Axios, Recharts, Lucide Icons, Framer Motion

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in Firebase config:
   ```env
   # Firebase Configuration (from Firebase Console)
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   
   # Backend API URL
   VITE_API_URL=http://localhost:5000/api
   ```

### Step 4: Install Tailwind CSS Plugin

```bash
npm install -D tailwindcss-animate
```

### Step 5: Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 6: Open in Browser

Navigate to [http://localhost:5173](http://localhost:5173)

---

## Part 5: Create Initial User

Since you don't have users yet, you need to create one via the backend API.

### Option 1: Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new POST request
3. URL: `http://localhost:5000/api/auth/register`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
     "email": "admin@example.com",
     "password": "admin123",
     "name": "Admin User",
     "employeeId": "EMP001",
     "role": "admin",
     "phoneNumber": "+1234567890",
     "specialization": "System Admin"
   }
   ```
6. Click **Send**

### Option 2: Using curl

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User",
    "employeeId": "EMP001",
    "role": "admin",
    "phoneNumber": "+1234567890",
    "specialization": "System Admin"
  }'
```

### Create Sample Users for Testing

Create a few users with different roles:

**Technician:**
```json
{
  "email": "tech1@example.com",
  "password": "password123",
  "name": "John Technician",
  "employeeId": "TECH001",
  "role": "technician",
  "specialization": "Assembly"
}
```

**Supervisor:**
```json
{
  "email": "supervisor@example.com",
  "password": "password123",
  "name": "Sarah Supervisor",
  "employeeId": "SUP001",
  "role": "supervisor"
}
```

**Planner:**
```json
{
  "email": "planner@example.com",
  "password": "password123",
  "name": "Mike Planner",
  "employeeId": "PLAN001",
  "role": "planner"
}
```

---

## Part 6: Login and Test

1. Go to [http://localhost:5173](http://localhost:5173)
2. You'll be redirected to the login page
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
4. Click **Sign In**
5. You should be redirected to the Dashboard!

---

## Part 7: Deploy to Production (Optional)

### Deploy Backend to Render

1. Go to [Render.com](https://render.com/) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: technician-task-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: main
5. Add Environment Variables (same as your `.env` file)
6. Click **"Create Web Service"**
7. Copy the deployed URL (e.g., `https://your-app.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com/) and sign up
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables (update `VITE_API_URL` to your Render backend URL)
6. Click **"Deploy"**
7. Your app will be live at `https://your-app.vercel.app`

### Update CORS in Backend

Update `FRONTEND_URL` in your backend `.env` to your Vercel URL.

---

## Troubleshooting

### Backend won't start
- ✅ Check MongoDB connection string is correct
- ✅ Ensure MongoDB IP whitelist includes your IP
- ✅ Verify Firebase credentials are properly formatted
- ✅ Check if port 5000 is already in use

### Frontend won't connect to backend
- ✅ Ensure backend is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Verify CORS settings in backend
- ✅ Check browser console for errors

### Firebase authentication errors
- ✅ Verify Firebase config in frontend `.env`
- ✅ Ensure Email/Password is enabled in Firebase Console
- ✅ Check Firebase service account in backend
- ✅ Verify private key format (keep `\n` characters)

### MongoDB connection issues
- ✅ Check username and password in connection string
- ✅ Verify IP whitelist (use 0.0.0.0/0 for testing)
- ✅ Ensure cluster is running (not paused)
- ✅ Check network connectivity

---

## Next Steps

1. ✅ Create more users with different roles
2. ✅ Create job orders via Postman or add a UI form
3. ✅ Log tasks as a technician
4. ✅ View analytics on supervisor dashboard
5. ✅ Customize the system for your needs
6. ✅ Add more features and pages

---

## Useful Commands

### Backend
```bash
npm install           # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## Project URLs

- **Frontend Dev**: http://localhost:5173
- **Backend Dev**: http://localhost:5000
- **API Docs**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, Firebase) are properly configured
4. Review the logs in your terminal

Good luck with your hackathon! 🚀
