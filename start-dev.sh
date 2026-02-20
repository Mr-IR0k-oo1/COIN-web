#!/bin/bash

# COIN-web Development Startup Script
# This script starts all services needed for development

set -e

echo "🚀 Starting COIN-web Development Environment"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Step 1: Starting PostgreSQL Database...${NC}"

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^coin-postgres$"; then
    echo "   Container 'coin-postgres' already exists. Starting it..."
    docker start coin-postgres
else
    echo "   Creating new PostgreSQL container..."
    docker run -d \
      --name coin-postgres \
      -e POSTGRES_USER=coin_user \
      -e POSTGRES_PASSWORD=coin_password \
      -e POSTGRES_DB=coin_srec \
      -p 5432:5432 \
      postgres:15-alpine
fi

# Wait for PostgreSQL to be ready
echo "   Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is accepting connections
until docker exec coin-postgres pg_isready -U coin_user -d coin_srec &> /dev/null; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done

echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
echo ""

echo -e "${YELLOW}🦀 Step 2: Starting Rust Backend...${NC}"
echo "   Backend will run on http://localhost:8000"
echo "   To start the backend, open a new terminal and run:"
echo -e "   ${GREEN}cd backend && cargo run${NC}"
echo ""

echo -e "${YELLOW}⚛️  Step 3: Starting Next.js Frontend...${NC}"
echo "   Frontend will run on http://localhost:3000"
echo "   To start the frontend, open a new terminal and run:"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""

echo -e "${GREEN}✅ Database is running!${NC}"
echo ""
echo "📋 Quick Commands:"
echo "   Stop database:    docker stop coin-postgres"
echo "   Start database:   docker start coin-postgres"
echo "   Remove database:  docker rm -f coin-postgres"
echo "   View DB logs:     docker logs -f coin-postgres"
echo ""
echo "🔗 Access Points:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/api/health"
echo ""
echo "👤 Default Admin Credentials:"
echo "   Email:     admin@srec.ac.in"
echo "   Password:  CoIN2024SREC"
echo ""
