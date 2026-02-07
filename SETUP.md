# CoIN Complete Setup Guide

Complete setup instructions for both frontend and backend.

## Prerequisites

- **Node.js 18+** (frontend)
- **Rust 1.70+** (backend)
- **PostgreSQL 13+** (database)
- **Git**

## Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone <your-repo>
cd hackweb
```

### 2. Setup Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Build and run
cargo run

# Output should show:
# Server listening on http://127.0.0.1:8000
```

### 3. Setup Frontend (New Terminal)

```bash
cd ..

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev

# Frontend at http://localhost:3000
```

### 4. Test Integration

Navigate to:
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login
- Use email: `admin@srec.ac.in`, password: `changeme`

---

## Detailed Backend Setup

### 1. Install Rust

```bash
# Via rustup (recommended)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Verify
rustc --version  # Should be 1.70+
cargo --version
```

### 2. Install PostgreSQL

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Windows
Download from https://www.postgresql.org/download/windows/

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE coin_srec;
CREATE USER coin_user WITH PASSWORD 'coin_password';
GRANT ALL PRIVILEGES ON DATABASE coin_srec TO coin_user;

# Exit
\q
```

### 4. Configure Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required Variables:**
```env
DATABASE_URL=postgresql://coin_user:coin_password@localhost:5432/coin_srec
JWT_SECRET=your-super-secret-key-min-32-chars-random
ADMIN_BOOTSTRAP_EMAIL=admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=changeme
RUST_LOG=debug
FRONTEND_URL=http://localhost:3000
```

### 5. Run Migrations

```bash
# Install SQLx CLI
cargo install sqlx-cli --no-default-features --features postgres

# Set database URL
export DATABASE_URL=postgresql://coin_user:coin_password@localhost:5432/coin_srec

# Run migrations
sqlx migrate run

# Output should show migrations applied
```

### 6. Build & Run

```bash
cd backend

# Development
cargo run

# Or release build
cargo build --release
./target/release/coin-backend
```

**Success Output:**
```
Server listening on http://127.0.0.1:8000
```

### 7. Verify Backend

```bash
# Health check
curl http://localhost:8000/api/health

# Expected response:
# {"status":"ok"}
```

---

## Detailed Frontend Setup

### 1. Install Node.js

#### Using nvm (Recommended)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 18
nvm install 18
nvm use 18

# Verify
node --version  # v18.x.x
npm --version   # 9.x.x
```

#### macOS
```bash
brew install node@18
```

#### Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Dependencies

```bash
cd hackweb
npm install

# Or with yarn
yarn install
```

### 3. Setup Environment

```bash
# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
```

### 4. Start Development Server

```bash
npm run dev

# Output:
# ▲ Next.js 14.2.0
# - Local: http://localhost:3000
```

### 5. Access Frontend

Open http://localhost:3000

---

## Environment Configuration

### Frontend (.env.local)

```env
# API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Production
# NEXT_PUBLIC_API_URL=https://api.coin.srec.ac.in/api
```

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://coin_user:password@localhost:5432/coin_srec

# Security
JWT_SECRET=your-random-string-minimum-32-characters-long
ADMIN_BOOTSTRAP_EMAIL=admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=initial-password-change-after-login

# Logging
RUST_LOG=debug

# CORS
FRONTEND_URL=http://localhost:3000
```

---

## Development Workflow

### Terminal 1: Backend

```bash
cd backend
cargo watch -x run
# Auto-reloads on file changes
```

### Terminal 2: Frontend

```bash
npm run dev
```

### Terminal 3: Database

```bash
# Monitor database
psql -U coin_user -d coin_srec

# Useful commands:
\dt                    # List tables
SELECT * FROM admins;  # View admins
\q                     # Exit
```

---

## File Structure

```
hackweb/
├── app/                      # Next.js pages & layouts
│   ├── admin/               # Admin routes
│   │   ├── login/          # Admin login page
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── hackathons/     # Hackathon CRUD
│   │   ├── submissions/    # Submission review
│   │   ├── blog/           # Blog management
│   │   └── reports/        # Reports & export
│   ├── hackathons/         # Public hackathon pages
│   ├── blog/               # Public blog pages
│   ├── submit/             # Student submission form
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── ui/                # UI components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer
│   └── AdminLayout.tsx    # Admin layout wrapper
├── lib/                    # Utilities & stores
│   ├── services/          # Backend API service
│   │   └── backend.ts     # API calls
│   ├── store/             # Zustand stores
│   │   ├── authStore.ts   # Auth state
│   │   ├── hackathonStore.ts
│   │   ├── blogStore.ts
│   │   └── submissionStore.ts
│   ├── api.ts             # HTTP client
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Helper functions
├── backend/               # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   ├── handlers/      # Request handlers
│   │   ├── models.rs      # Data structures
│   │   ├── auth.rs        # Auth logic
│   │   ├── db.rs          # Database setup
│   │   ├── middleware.rs  # JWT middleware
│   │   └── ...
│   ├── migrations/        # Database migrations
│   ├── Cargo.toml         # Rust dependencies
│   └── .env.example       # Example env vars
└── ...
```

---

## Common Issues & Solutions

### Backend Port Already in Use

```bash
# Find process on port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or change port in backend/src/main.rs
tokio::net::TcpListener::bind("127.0.0.1:8001")
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U coin_user -d coin_srec -c "SELECT 1;"

# Verify DATABASE_URL format
# postgresql://user:password@host:port/database
```

### Frontend API Errors

1. **"Cannot GET /api/..."**: Backend not running
   - Check: `curl http://localhost:8000/api/health`
   - Restart: `cargo run`

2. **CORS errors**: Backend CORS not configured
   - Check: `backend/src/main.rs` has `CorsLayer`
   - May need to restart frontend

3. **"Invalid token"**: Token expired or JWT_SECRET mismatch
   - Login again
   - Check JWT_SECRET matches between frontend/backend

### Type Errors

Run type checker:
```bash
npm run tsc -- --noEmit
```

---

## Production Deployment

### Backend Deployment

See `backend/DEPLOYMENT.md`

### Frontend Deployment

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL https://api.coin.srec.ac.in/api
```

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD npm start
```

```bash
docker build -t coin-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.coin.srec.ac.in/api coin-frontend
```

#### Nginx

```nginx
upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name coin.srec.ac.in;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Security Checklist

### Development
- ✓ Use `.env` (never commit secrets)
- ✓ CORS allows localhost:3000 during dev
- ✓ JWT_SECRET is random, 32+ chars
- ✓ Database has password

### Production
- ✓ Use strong JWT_SECRET (256-bit random)
- ✓ Use strong database password
- ✓ Enable HTTPS everywhere
- ✓ Set CORS to specific frontend domain
- ✓ Keep dependencies updated
- ✓ Regular database backups
- ✓ Monitor access logs
- ✓ Rate limit API endpoints

---

## Useful Commands

### Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Production start
npm start

# Type check
npm run tsc -- --noEmit

# Lint
npm run lint
```

### Backend

```bash
# Development with auto-reload
cargo watch -x run

# Build release
cargo build --release

# Run binary
./target/release/coin-backend

# Format code
cargo fmt

# Lint
cargo clippy

# Tests
cargo test

# Database migration
sqlx migrate add -r migration_name
sqlx migrate run
sqlx migrate revert
```

### Database

```bash
# Connect
psql -U coin_user -d coin_srec

# Backup
pg_dump coin_srec > backup.sql

# Restore
psql coin_srec < backup.sql

# List databases
\l

# List tables
\dt

# Exit
\q
```

---

## Troubleshooting Guide

### Port Already in Use

```bash
# Find and kill
lsof -i :3000    # Frontend
lsof -i :8000    # Backend
lsof -i :5432    # Database

kill -9 <PID>
```

### Database Connection Issues

```bash
# Test PostgreSQL
pg_isready

# Check credentials
psql -U coin_user -d coin_srec

# Reset password
sudo -u postgres psql
ALTER USER coin_user WITH PASSWORD 'newpassword';
```

### Permission Denied

```bash
# Fix file permissions
chmod 600 .env
chmod 600 backend/.env

# Fix directory permissions
chmod 755 .
```

### Slow Startup

```bash
# Frontend: Clear next cache
rm -rf .next

# Backend: Clean build
cargo clean
cargo build
```

---

## Getting Help

### Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Rust Book**: https://doc.rust-lang.org/book/
- **Axum**: https://github.com/tokio-rs/axum
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Zustand**: https://github.com/pmndrs/zustand

### Debug Logging

```typescript
// Frontend
console.log('Debug info:', { data })

// Backend (Rust)
tracing::debug!("Debug message: {:?}", value)
println!("Quick debug: {:?}", variable)
```

---

## Next Steps

1. ✅ Complete setup (this guide)
2. 📖 Read INTEGRATION_GUIDE.md
3. 🎯 Check FEATURES_IMPLEMENTATION.md
4. 💻 Start implementing missing features
5. 🧪 Test with backend + frontend together
6. 🚀 Deploy to production

---

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review INTEGRATION_GUIDE.md
3. Check GitHub Issues
4. Contact development team
