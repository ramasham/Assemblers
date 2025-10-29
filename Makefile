.PHONY: help install start stop restart clean setup-users check kill-ports backend frontend dev logs status

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  Technician Task Management System - Makefile Commands$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)Quick Start:$(NC)"
	@echo "  1. make install      # Install all dependencies"
	@echo "  2. make setup-users  # Create users (first time only)"
	@echo "  3. make start        # Start both servers"
	@echo "  4. Open http://localhost:3000"
	@echo ""
	@echo "$(GREEN)Login with:$(NC) planner@company.com / planner123"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"

install: ## Install all dependencies (backend + frontend)
	@echo "$(GREEN)📦 Installing backend dependencies...$(NC)"
	cd backend && npm install
	@echo "$(GREEN)📦 Installing frontend dependencies...$(NC)"
	cd frontend && pnpm install
	@echo "$(GREEN)✅ All dependencies installed!$(NC)"

kill-ports: ## Kill processes on ports 3000 and 3001
	@echo "$(YELLOW)🔪 Killing processes on ports 3000 and 3001...$(NC)"
	@lsof -ti :3001 | xargs kill -9 2>/dev/null || true
	@lsof -ti :3000 | xargs kill -9 2>/dev/null || true
	@echo "$(GREEN)✅ Ports cleared!$(NC)"

backend: kill-ports ## Start only the backend server
	@echo "$(GREEN)🚀 Starting backend server...$(NC)"
	cd backend && npm run dev

frontend: ## Start only the frontend server
	@echo "$(GREEN)🚀 Starting frontend server...$(NC)"
	cd frontend && pnpm run dev

start: kill-ports ## Start both backend and frontend servers
	@mkdir -p logs
	@echo "$(GREEN)🚀 Starting application...$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)Starting backend on port 3001...$(NC)"
	@cd backend && npm run dev > $(CURDIR)/logs/backend.log 2>&1 & echo $$! > $(CURDIR)/logs/backend.pid
	@sleep 3
	@if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Backend started successfully$(NC)"; \
	else \
		echo "$(RED)❌ Backend failed to start. Check logs/backend.log$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Starting frontend on port 3000...$(NC)"
	@cd frontend && pnpm run dev > $(CURDIR)/logs/frontend.log 2>&1 & echo $$! > $(CURDIR)/logs/frontend.pid
	@sleep 5
	@if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Frontend started successfully$(NC)"; \
	else \
		echo "$(RED)❌ Frontend failed to start. Check logs/frontend.log$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)✅ Application is running!$(NC)"
	@echo ""
	@echo "$(YELLOW)🌐 Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)🔧 Backend:$(NC)  http://localhost:3001"
	@echo ""
	@echo "$(YELLOW)📝 Logs:$(NC)"
	@echo "   Backend:  make logs-backend"
	@echo "   Frontend: make logs-frontend"
	@echo ""
	@echo "$(YELLOW)🛑 Stop:$(NC) make stop"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"

stop: ## Stop both servers
	@echo "$(YELLOW)🛑 Stopping servers...$(NC)"
	@if [ -f logs/backend.pid ]; then \
		kill $$(cat logs/backend.pid) 2>/dev/null || true; \
		rm logs/backend.pid; \
		echo "$(GREEN)✅ Backend stopped$(NC)"; \
	fi
	@if [ -f logs/frontend.pid ]; then \
		kill $$(cat logs/frontend.pid) 2>/dev/null || true; \
		rm logs/frontend.pid; \
		echo "$(GREEN)✅ Frontend stopped$(NC)"; \
	fi
	@lsof -ti :3001 | xargs kill -9 2>/dev/null || true
	@lsof -ti :3000 | xargs kill -9 2>/dev/null || true
	@echo "$(GREEN)✅ All servers stopped!$(NC)"

restart: stop start ## Restart both servers

setup-users: ## Create all users in Firebase (run once)
	@echo "$(GREEN)👥 Setting up users...$(NC)"
	cd backend && node scripts/setupAllUsers.js
	@echo "$(GREEN)✅ Users created!$(NC)"
	@echo ""
	@echo "$(YELLOW)🔑 Test login:$(NC) planner@company.com / planner123"

check: ## Check if servers are running
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)Checking server status...$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Backend is running on port 3001$(NC)"; \
	else \
		echo "$(RED)❌ Backend is NOT running$(NC)"; \
	fi
	@if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Frontend is running on port 3000$(NC)"; \
	else \
		echo "$(RED)❌ Frontend is NOT running$(NC)"; \
	fi
	@echo ""
	@if [ -f backend/config/serviceAccountKey.json ]; then \
		echo "$(GREEN)✅ Firebase credentials configured$(NC)"; \
	else \
		echo "$(RED)❌ Firebase credentials NOT found$(NC)"; \
	fi
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"

status: check ## Alias for check

logs-backend: ## Show backend logs
	@if [ -f logs/backend.log ]; then \
		tail -f logs/backend.log; \
	else \
		echo "$(RED)No backend logs found. Start the server with 'make start'$(NC)"; \
	fi

logs-frontend: ## Show frontend logs
	@if [ -f logs/frontend.log ]; then \
		tail -f logs/frontend.log; \
	else \
		echo "$(RED)No frontend logs found. Start the server with 'make start'$(NC)"; \
	fi

logs: ## Show both logs
	@echo "$(YELLOW)Showing logs... (Ctrl+C to exit)$(NC)"
	@tail -f logs/*.log 2>/dev/null || echo "$(RED)No logs found$(NC)"

clean: stop ## Clean up logs and temporary files
	@echo "$(YELLOW)🧹 Cleaning up...$(NC)"
	@rm -rf logs/*.log logs/*.pid
	@echo "$(GREEN)✅ Cleaned!$(NC)"

dev: ## Start in development mode (same as start)
	@make start

credentials: ## Show all user credentials
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)🔑 USER LOGIN CREDENTIALS$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Engineer Planner:$(NC)"
	@echo "  planner@company.com / planner123"
	@echo ""
	@echo "$(YELLOW)Supervisors:$(NC)"
	@echo "  supervisor.production@company.com / supervisor123"
	@echo "  supervisor.testing@company.com / supervisor123"
	@echo "  supervisor.quality@company.com / supervisor123"
	@echo ""
	@echo "$(YELLOW)Technicians:$(NC)"
	@echo "  mike.davis@company.com / tech123"
	@echo "  emily.chen@company.com / tech123"
	@echo "  christopher.harris@company.com / tech123"
	@echo ""
	@echo "$(BLUE)Full list: cat USER_CREDENTIALS.md$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"

test-api: ## Test if backend API is responding
	@echo "$(YELLOW)Testing backend API...$(NC)"
	@curl -s http://localhost:3001/health | grep -q "healthy" && \
		echo "$(GREEN)✅ Backend API is responding$(NC)" || \
		echo "$(RED)❌ Backend API is not responding$(NC)"

init: install setup-users ## Complete first-time setup
	@echo "$(GREEN)✅ Initialization complete!$(NC)"
	@echo "$(YELLOW)Run 'make start' to start the application$(NC)"
