#!/bin/bash

# CoIN Platform Setup Script
# This script helps you set up the entire CoIN platform locally

set -e  # Exit on error

echo "============================================"
echo "   CoIN Platform - Development Setup"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check Rust (optional for backend)
if ! command -v cargo &> /dev/null; then
    echo -e "${YELLOW}⚠ Rust/Cargo not found. Backend development won't work.${NC}"
    echo -e "${YELLOW}  Install from: https://rustup.rs/${NC}"
else
    echo -e "${GREEN}✓ Rust $(rustc --version)${NC}"
fi

# Check PostgreSQL (optional for backend)
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL not found. Backend needs a database.${NC}"
    echo -e "${YELLOW}  Install PostgreSQL or use Docker${NC}"
else
    echo -e "${GREEN}✓ PostgreSQL installed${NC}"
fi

echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_NAME=CoIN

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_FEEDBACK=false
EOF
    echo -e "${GREEN}✓ .env.local created${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

# Build verification
echo ""
echo -e "${BLUE}Building frontend...${NC}"
if npm run build &> /dev/null; then
    echo -e "${GREEN}✓ Frontend built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    echo "Run 'npm run build' to see errors"
fi

echo ""
echo -e "${BLUE}Setting up Backend...${NC}"

if [ -d "backend" ]; then
    cd backend
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "Creating backend .env..."
        cp .env.example .env 2>/dev/null || echo "Could not copy .env.example"
        echo -e "${YELLOW}⚠ Please edit backend/.env with your database credentials${NC}"
    else
        echo -e "${GREEN}✓ Backend .env already exists${NC}"
    fi
    
    cd ..
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. ${YELLOW}Frontend Development:${NC}"
echo "   npm run dev"
echo "   → Opens http://localhost:3000"
echo ""
echo "2. ${YELLOW}Backend Development (requires Rust & PostgreSQL):${NC}"
echo "   cd backend"
echo "   cargo run"
echo "   → Runs on http://localhost:8000"
echo ""
echo "3. ${YELLOW}Database Setup:${NC}"
echo "   createdb coin_srec"
echo "   cd backend && sqlx migrate run"
echo ""
echo "4. ${YELLOW}Production Build:${NC}"
echo "   npm run build && npm start"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "   See PRODUCT_ROADMAP.md for detailed setup and features"
echo ""
