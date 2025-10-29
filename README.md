# 🚀 HOW TO RUN YOUR APPLICATION

## ✅ SIMPLEST WAY (Recommended)

Just run this command:

```bash
cd /home/rsham/ass
./start.sh
```

That's it! Both servers will start automatically.

Then open: **http://localhost:3000**

Login with: **planner@company.com** / **planner123**

---

## 🛑 To Stop the Servers

Press `Ctrl+C` in the terminal where you ran `./start.sh`

Or run:
```bash
make stop
```

---

## 📋 Alternative: Using Makefile

```bash
# Check if everything is ready
make check

# Setup users (first time only)
make setup-users

# Start servers (in background)
make start

# Stop servers
make stop

# See all commands
make help
```

---

## 📋 Alternative: Manual Start

**Terminal 1 - Backend:**
```bash
cd /home/rsham/ass/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/rsham/ass/frontend
pnpm run dev
```

---

## 🔑 Login Credentials

```
Engineer Planner:
planner@company.com / planner123

Supervisors:
supervisor.production@company.com / supervisor123
supervisor.testing@company.com / supervisor123
supervisor.quality@company.com / supervisor123

Technicians (any):
mike.davis@company.com / tech123
emily.chen@company.com / tech123
christopher.harris@company.com / tech123
```

**See all 18 users:**
```bash
make credentials
```
or
```bash
cat USER_CREDENTIALS.md
```

---

## ✅ Quick Commands Summary

| Task | Command |
|------|---------|
| **Start app** | `./start.sh` |
| **Stop app** | `Ctrl+C` or `make stop` |
| **Check status** | `make check` |
| **View credentials** | `make credentials` |
| **Setup users** | `make setup-users` |
| **See all commands** | `make help` |

---

## 🐛 Troubleshooting

### Port already in use
```bash
make kill-ports
./start.sh
```

### Can't login
1. Make sure both servers are running: `make check`
2. Run user setup: `make setup-users`
3. Try again with: `planner@company.com` / `planner123`

### Need to restart
```bash
make restart
```

---

**THAT'S IT! Just run `./start.sh` and you're good to go!** 🎉
