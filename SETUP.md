# Project Setup Guide

This guide will help you set up the project after cloning from GitHub.

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- MongoDB Atlas account (or local MongoDB)
- Firebase project

## 🚀 Quick Setup

After cloning this repository, follow these steps:

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
pnpm install
# or: npm install
```

### 2. Configure Environment Variables

#### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in your actual values:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key
- `FIREBASE_CLIENT_EMAIL`: Your Firebase client email

#### Frontend Configuration

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local` and fill in your Firebase configuration values.

### 3. Configure Firebase Service Account

```bash
cd backend/config
cp serviceAccountKey.json.example serviceAccountKey.json
```

To get your Firebase service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Download the JSON file
7. Replace the content of `backend/config/serviceAccountKey.json` with the downloaded file

### 4. Initialize the Database

```bash
cd backend
node scripts/initializeDatabase.js
```

This will create the necessary collections and seed initial data.

### 5. Start the Development Servers

#### Option 1: Using the Makefile (Recommended)

```bash
# From the project root
make dev
```

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Important Security Notes

**NEVER commit these files to Git:**
- `.env` files (backend and frontend)
- `serviceAccountKey.json`
- Any file containing API keys, passwords, or secrets

These files are already in `.gitignore` to prevent accidental commits.

## 📁 Configuration Files Checklist

After setup, you should have these files (they won't be in the repository):

- [ ] `backend/.env`
- [ ] `backend/config/serviceAccountKey.json`
- [ ] `frontend/.env.local`

## 🛠️ Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```bash
# Stop any running servers
make stop
# or manually:
./scripts/stop-servers.sh
```

### Firebase Authentication Issues
- Verify your `serviceAccountKey.json` is valid
- Check that Firebase Admin SDK is enabled in your Firebase console
- Ensure the service account has necessary permissions

### MongoDB Connection Issues
- Check your MongoDB Atlas network access settings (IP whitelist)
- Verify your connection string includes the correct username/password
- Ensure your database user has read/write permissions

## 📚 Additional Scripts

```bash
# Create sample users
cd backend
node scripts/createUsers.js

# Create sample job orders
node scripts/createSampleJobOrders.js

# Setup exact users for testing
node scripts/setupExactUsers.js
```

## 🎯 Project Presentation Setup

For quick demo setup after cloning:

```bash
# 1. Clone the repository
git clone https://github.com/ramasham/Assemblers.git
cd Assemblers

# 2. Run the automated setup script
chmod +x scripts/setup-firebase.sh
./scripts/setup-firebase.sh

# 3. Follow the prompts to enter your credentials

# 4. Start the development servers
make dev
```

## 📞 Support

If you encounter any issues during setup, please:
1. Check the troubleshooting section above
2. Review the error messages carefully
3. Ensure all prerequisites are installed
4. Verify your Firebase and MongoDB configurations

---

**Happy coding! 🎉**
