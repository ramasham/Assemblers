# Database Scripts

This directory contains utility scripts for database operations.

## Available Scripts

### `createUsers.js`
Creates all initial users for the production system.

**Usage:**
```bash
cd backend
node scripts/createUsers.js
```

**What it does:**
- Creates 1 Supervisor
- Creates 1 Planning Engineer
- Creates 10 Production Workers
- Creates 2 Quality Inspectors
- Creates 2 Test Technicians
- **Total: 16 users**

**Requirements:**
- MongoDB connection must be configured in `.env`
- `MONGODB_URI` must be set

**Default Credentials:**
- Password for all users: `ChangeMe123!`
- ⚠️ Users should change passwords after first login

**Features:**
- ✅ Checks for existing users (won't create duplicates)
- ✅ Shows progress for each user
- ✅ Displays summary at the end
- ✅ Handles errors gracefully

---

## Environment Variables Required

Make sure your `.env` file has:
```
MONGODB_URI=mongodb://localhost:27017/joddb
# or
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/joddb
```

---

## Troubleshooting

### Error: Cannot find module
```bash
# Make sure you're in the backend directory
cd backend
npm install
```

### Error: Connection refused
- Ensure MongoDB is running
- Check your MONGODB_URI in .env file

### Error: User already exists
- This is normal if you've run the script before
- The script will skip existing users automatically

---

## Future Scripts

You can add more scripts here for:
- Resetting passwords
- Generating sample job orders
- Database cleanup
- Data migration
- Backup and restore
