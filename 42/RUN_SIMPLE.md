# 🚀 Quick Start - Simple Mode (No Firebase Required)

I've created a **simplified version** that works without Firebase!

## What Changed:
- ✅ Using JWT authentication instead of Firebase
- ✅ Passwords stored securely with bcrypt
- ✅ Everything else works the same
- ✅ You can add Firebase later if needed

## Run Your Project Now:

```bash
cd /home/rama/42
sudo docker-compose up --build
```

## Access Your Application:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: Running in Docker

## Create First User:

Once the containers are running, create an admin user:

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

Then login at http://localhost:3000 with:
- **Email**: admin@test.com
- **Password**: admin123

## That's It!

Your full project is now running without any Firebase setup needed! 🎉
