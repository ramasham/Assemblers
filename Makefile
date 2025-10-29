.PHONY: help install start stop restart clean check logs logs-backend logs-frontend setup-users migrate operations init test-login dev

# Colors
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
CYAN=\033[0;36m
NC=\033[0m

# Default target
.DEFAULT_GOAL := start

help: ## 📖 Show all available commands
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║$(NC)  $(GREEN)🚀 Production Management System - Quick Commands$(NC)    $(BLUE)║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-18s$(NC) %s\n", $$1, $$2}"
	@echo ""
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  🎯 Quick Start:$(NC)"
	@echo "     1. $(CYAN)make$(NC)              → Start application"
	@echo "     2. Open $(CYAN)http://localhost:3000$(NC)"
	@echo "     3. Login: $(CYAN)planner@company.com$(NC) / $(CYAN)planner123$(NC)"
	@echo ""
	@echo "$(GREEN)  🛑 Stop:$(NC)          $(CYAN)make stop$(NC)"
	@echo "$(GREEN)  📊 Check Status:$(NC)  $(CYAN)make check$(NC)"
	@echo "$(GREEN)  📝 View Logs:$(NC)     $(CYAN)make logs$(NC)"
	@echo "$(YELLOW)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"

install: ## 📦 Install dependencies
	@echo "$(GREEN)📦 Installing backend dependencies...$(NC)"
	@cd backend && npm install --silent
	@echo "$(GREEN)📦 Installing frontend dependencies...$(NC)"
	@cd frontend && npm install --silent
	@echo "$(GREEN)✅ All dependencies installed!$(NC)"

clean-ports: ## 🧹 Clean up port locks
	@echo "$(YELLOW)🧹 Cleaning port locks...$(NC)"
	@rm -rf frontend/.next/dev/lock 2>/dev/null || true
	@echo "$(GREEN)✅ Locks cleared!$(NC)"

backend: clean-ports ## 🔧 Start backend only (port 5000)
	@echo "$(GREEN)🔧 Starting backend on port 5000...$(NC)"
	@cd backend && node server.js

frontend: ## 🎨 Start frontend only (port 3000)
	@echo "$(GREEN)🎨 Starting frontend on port 3000...$(NC)"
	@cd frontend && npm run dev

start: clean-ports ## 🚀 Start both backend & frontend
	@mkdir -p logs
	@if [ ! -d "backend/node_modules" ]; then \
		echo "$(YELLOW)📦 Backend dependencies missing, installing...$(NC)"; \
		cd backend && npm install --silent; \
	fi
	@if [ ! -d "frontend/node_modules" ]; then \
		echo "$(YELLOW)📦 Frontend dependencies missing, installing...$(NC)"; \
		cd frontend && npm install --silent; \
	fi
	@echo "$(YELLOW)🔧 Starting backend (port 5000)...$(NC)"
	@cd backend && node server.js > $(CURDIR)/logs/backend.log 2>&1 & echo $$! > $(CURDIR)/logs/backend.pid
	@sleep 3
	@if lsof -Pi:5000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Backend running on http://localhost:5000$(NC)"; \
	else \
		echo "$(RED)❌ Backend failed! Check: make logs-backend$(NC)"; exit 1; \
	fi
	@echo "$(YELLOW)🎨 Starting frontend...$(NC)"
	@cd frontend && npm run dev > $(CURDIR)/logs/frontend.log 2>&1 & echo $$! > $(CURDIR)/logs/frontend.pid
	@sleep 5
	@if pgrep -f "next dev" > /dev/null 2>&1; then \
		FRONTEND_PORT=$$(grep -oP "localhost:\K[0-9]+" $(CURDIR)/logs/frontend.log | head -1); \
		echo "$(GREEN)✅ Frontend running on http://localhost:$$FRONTEND_PORT$(NC)"; \
	else \
		echo "$(RED)❌ Frontend failed! Check: make logs-frontend$(NC)"; exit 1; \
	fi
	@echo ""
	@echo "$(GREEN)✅ Application is LIVE!$(NC)"
	@echo "$(YELLOW)📖 View logs: make logs$(NC)"
	@echo "$(YELLOW)🛑 Stop:      make stop$(NC)"

stop: ## 🛑 Stop all servers
	@echo "$(YELLOW)🛑 Stopping servers...$(NC)"
	@bash scripts/stop-servers.sh
	@echo "$(GREEN)✅ All servers stopped!$(NC)"

restart: stop start ## 🔄 Restart everything

check: ## 📊 Check status
	@echo "$(BLUE)📊 Checking server status...$(NC)"
	@if lsof -Pi:5000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Backend$(NC) running on port 5000"; \
	else \
		echo "$(RED)❌ Backend$(NC) not running"; \
	fi
	@if lsof -Pi:3000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Frontend$(NC) running on port 3000"; \
	else \
		echo "$(RED)❌ Frontend$(NC) not running"; \
	fi

logs: ## 📝 View all logs
	@tail -f logs/*.log 2>/dev/null || echo "$(RED)No logs found. Run: make start$(NC)"

logs-backend: ## 📝 View backend logs
	@tail -f logs/backend.log 2>/dev/null || echo "$(RED)No backend logs. Run: make start$(NC)"

logs-frontend: ## 📝 View frontend logs
	@tail -f logs/frontend.log 2>/dev/null || echo "$(RED)No frontend logs. Run: make start$(NC)"

clean: stop ## 🧹 Clean logs and locks
	@echo "$(YELLOW)🧹 Cleaning logs and locks...$(NC)"
	@rm -rf logs/*.log logs/*.pid frontend/.next/dev/lock
	@echo "$(GREEN)✅ Cleaned!$(NC)"

setup-users: ## 👥 Create users
	@cd backend && node scripts/setupAllUsers.js

migrate: ## 🔄 Migrate users
	@cd backend && node scripts/migrateRoleSwitching.js
	@cd backend && node scripts/addMultiDepartmentTechnicians.js

configure-roles: ## 🎭 Configure role switching
	@cd backend && node scripts/configureRoleSwitching.js

operations: ## 📋 Populate operations
	@cd backend && node scripts/populateDepartmentOperations.js

init: install setup-users configure-roles operations ## 🎬 First-time setup
	@echo "$(GREEN)✅ Setup complete! Run: make start$(NC)"

test-login: ## 🧪 Test login API
	@curl -s -X POST http://localhost:5000/api/auth/login \
		-H "Content-Type: application/json" \
		-d '{"email":"planner@company.com","password":"planner123"}' | grep -q "success" && \
		echo "$(GREEN)✅ Login working!$(NC)" || echo "$(RED)❌ Login failed!$(NC)"

dev: start ## 🚀 Alias for start
