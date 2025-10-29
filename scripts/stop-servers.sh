#!/bin/bash

# Stop backend
if [ -f logs/backend.pid ]; then
    kill $(cat logs/backend.pid) 2>/dev/null || true
    rm -f logs/backend.pid
fi

# Stop frontend
if [ -f logs/frontend.pid ]; then
    kill $(cat logs/frontend.pid) 2>/dev/null || true
    rm -f logs/frontend.pid
fi

# Fallback - kill by pattern (runs in subshell to avoid killing parent)
(pkill -f "backend/server.js" 2>/dev/null || true)
(pkill -f "npm run dev" 2>/dev/null || true)
(pkill -f "next-server" 2>/dev/null || true)
(pkill -f "next dev" 2>/dev/null || true)

# Give processes time to die
sleep 1

echo "✅ Servers stopped"
