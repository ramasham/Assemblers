# 🚀 Quick Start with Makefile

## First Time Setup

```bash
make install        # Install all dependencies
make setup-users    # Create all 18 users in Firebase
make start          # Start both servers
```

Then open: **http://localhost:3000**

---

## Daily Use

### Start Application
```bash
make start
```
Starts both backend (port 3001) and frontend (port 3000) servers.

### Stop Application
```bash
make stop
```

### Restart Application
```bash
make restart
```

### Check Status
```bash
make check
```
Shows if backend and frontend are running.

---

## Useful Commands

### View Logs
```bash
make logs-backend    # Backend logs only
make logs-frontend   # Frontend logs only
make logs            # Both logs
```

### Show User Credentials
```bash
make credentials
```

### Kill Stuck Processes
```bash
make kill-ports
```
Kills any processes on ports 3000 and 3001.

### Clean Up
```bash
make clean
```
Stops servers and removes log files.

---

## All Available Commands

Run `make help` or just `make` to see all commands:

```bash
make
```

Output:
```
════════════════════════════════════════════════════════════
  Technician Task Management System - Makefile Commands
════════════════════════════════════════════════════════════

  backend              Start only the backend server
  check                Check if servers are running
  clean                Clean up logs and temporary files
  credentials          Show all user credentials
  dev                  Start in development mode (same as start)
  frontend             Start only the frontend server
  help                 Show this help message
  init                 Complete first-time setup
  install              Install all dependencies (backend + frontend)
  kill-ports           Kill processes on ports 3000 and 3001
  logs                 Show both logs
  logs-backend         Show backend logs
  logs-frontend        Show frontend logs
  restart              Restart both servers
  setup-users          Create all users in Firebase (run once)
  start                Start both backend and frontend servers
  status               Alias for check
  stop                 Stop both servers
  test-api             Test if backend API is responding

════════════════════════════════════════════════════════════
Quick Start:
  1. make install      # Install all dependencies
  2. make setup-users  # Create users (first time only)
  3. make start        # Start both servers
  4. Open http://localhost:3000

Login with: planner@company.com / planner123
════════════════════════════════════════════════════════════
```

---

## Troubleshooting

### "Address already in use" error
```bash
make kill-ports
make start
```

### Backend won't start
1. Check logs: `make logs-backend`
2. Verify Firebase credentials exist:
   ```bash
   ls -l backend/config/serviceAccountKey.json
   ```

### Frontend won't start
1. Check logs: `make logs-frontend`
2. Check if backend is running: `make check`

### Can't login
1. Check servers are running: `make check`
2. Recreate users: `make setup-users`
3. Check credentials: `make credentials`

---

## Examples

### Complete Fresh Start
```bash
make stop
make clean
make kill-ports
make install
make setup-users
make start
```

### Quick Restart After Code Changes
```bash
make restart
```

### Check Everything is Working
```bash
make check
make test-api
```

---

## Tips

- Always run `make stop` before closing terminals
- Use `make check` to verify servers are running
- Use `make logs` to debug issues
- Run `make setup-users` only once (unless you want to reset all users)

---

**That's it! Just run `make` to see all available commands!** 🎉
