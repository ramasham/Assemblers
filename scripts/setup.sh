#!/bin/bash

# Setup Script for Assemblers Project
# This script helps configure the project after cloning from GitHub

set -e  # Exit on error

echo "🚀 Assemblers Project Setup"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
echo ""

# Install backend dependencies
if [ -d "backend" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Backend directory not found${NC}"
fi

# Install frontend dependencies
if [ -d "frontend" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    cd ..
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend directory not found${NC}"
fi

echo ""
echo "🔧 Step 2: Setting up configuration files..."
echo ""

# Setup backend .env
if [ -f "backend/.env.example" ] && [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your actual credentials${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env already exists or .env.example not found${NC}"
fi

# Setup frontend .env
if [ -f "frontend/.env.example" ] && [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
    echo -e "${YELLOW}⚠️  Please edit frontend/.env.local with your Firebase credentials${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env.local already exists or .env.example not found${NC}"
fi

# Setup Firebase service account key
if [ -f "backend/config/serviceAccountKey.json.example" ] && [ ! -f "backend/config/serviceAccountKey.json" ]; then
    cp backend/config/serviceAccountKey.json.example backend/config/serviceAccountKey.json
    echo -e "${GREEN}✅ Created backend/config/serviceAccountKey.json${NC}"
    echo -e "${YELLOW}⚠️  Please replace with your actual Firebase service account key${NC}"
else
    echo -e "${YELLOW}⚠️  serviceAccountKey.json already exists or .example not found${NC}"
fi

# Create logs directory
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo -e "${GREEN}✅ Created logs directory${NC}"
fi

echo ""
echo "📝 Step 3: Configuration Instructions"
echo "======================================"
echo ""
echo "You need to configure the following files with your actual credentials:"
echo ""
echo "1. backend/.env"
echo "   - Add your MongoDB connection string"
echo "   - Set a secure JWT_SECRET"
echo "   - Add Firebase credentials"
echo ""
echo "2. frontend/.env.local"
echo "   - Add your Firebase web app configuration"
echo ""
echo "3. backend/config/serviceAccountKey.json"
echo "   - Download from Firebase Console → Project Settings → Service Accounts"
echo "   - Replace the example file with your actual key"
echo ""
echo -e "${YELLOW}📖 For detailed setup instructions, see SETUP.md${NC}"
echo ""

# Ask if user wants to initialize the database
echo ""
read -p "Do you want to initialize the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please ensure you have configured backend/.env and serviceAccountKey.json first!"
    read -p "Continue with database initialization? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd backend
        node scripts/initializeDatabase.js
        cd ..
        echo -e "${GREEN}✅ Database initialized${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "🎯 Next steps:"
echo "1. Edit configuration files with your credentials (see above)"
echo "2. Run 'make dev' to start both servers"
echo "   Or run servers separately:"
echo "   - Backend: cd backend && npm start"
echo "   - Frontend: cd frontend && pnpm dev"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
