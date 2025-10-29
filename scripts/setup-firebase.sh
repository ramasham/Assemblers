#!/bin/bash

# 🔥 Firebase Setup Helper Script
# This script helps you set up Firebase for JODDB

set -e  # Exit on any error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🔥 JODDB Firebase Setup Helper                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if service account file exists
SERVICE_ACCOUNT_FILE="backend/config/serviceAccountKey.json"

if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "❌ Firebase service account key not found!"
    echo ""
    echo "📋 Please follow these steps:"
    echo ""
    echo "1. Go to: https://console.firebase.google.com/"
    echo "2. Select your project (or create one named 'joddb')"
    echo "3. Click ⚙️  → Project Settings → Service Accounts"
    echo "4. Click 'Generate new private key'"
    echo "5. Download the JSON file"
    echo ""
    echo "6. Save it as: $SERVICE_ACCOUNT_FILE"
    echo ""
    echo "💡 Quick command to move from Downloads:"
    echo "   mv ~/Downloads/joddb-*-firebase-adminsdk-*.json $SERVICE_ACCOUNT_FILE"
    echo ""
    exit 1
fi

echo "✅ Firebase service account key found!"
echo ""

# Verify it's valid JSON
if ! jq empty "$SERVICE_ACCOUNT_FILE" 2>/dev/null; then
    echo "❌ Invalid JSON in service account file!"
    echo "   Please re-download from Firebase Console"
    exit 1
fi

echo "✅ Service account file is valid JSON"
echo ""

# Check if .env is configured
if ! grep -q "GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccountKey.json" backend/.env; then
    echo "⚠️  Updating backend/.env..."
    echo "GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccountKey.json" >> backend/.env
    echo "✅ Environment configured"
else
    echo "✅ Environment already configured"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting Firebase Setup Process..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Create users
echo "📝 Step 1/2: Creating users in Firebase..."
if node backend/scripts/setupAllUsers.js; then
    echo "✅ Users created successfully!"
else
    echo "❌ Failed to create users"
    exit 1
fi
echo ""

# Step 2: Configure role switching
echo "🔄 Step 2/2: Configuring role switching..."
if node backend/scripts/configureRoleSwitching.js; then
    echo "✅ Role switching configured!"
else
    echo "❌ Failed to configure role switching"
    exit 1
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Firebase Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ What was configured:"
echo "   • 14 Technicians - Can switch between ALL 3 departments"
echo "   • 14 Technicians - Can switch roles (technician/supervisor/planner)"
echo "   • 3 Supervisors - Can switch roles"
echo "   • 1 Planner - Admin access"
echo ""
echo "🔄 Next steps:"
echo "   1. Restart servers: make restart"
echo "   2. Test login: http://localhost:3000"
echo "   3. Login with: planner@company.com / planner123"
echo ""
echo "🎯 Technicians can now:"
echo "   • Switch departments: Production ↔ Testing ↔ Quality"
echo "   • Switch roles: Technician ↔ Supervisor ↔ Planner"
echo ""
