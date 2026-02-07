# Backend Setup Guide - CoIN Platform

## Choose Your Setup Method

### ⭐ Option 1: Docker (Easiest - Recommended)

**Requirements:**
- Docker installed
- No PostgreSQL or Rust needed

**Steps:**

```bash
# 1. Start database with Docker
docker-compose up -d

# 2. Install Rust (if you want to run backend code)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 3. Database is ready! It's running in Docker
# You can now run backend or skip to testing

# 4. Run migrations (if needed)
cd backend
sqlx migrate run

# 5. Start backend
cargo run
```

**Verify Database is Running:**
```bash
# Check if database container is up
docker-compose ps

# Should show:
# coin-postgres     postgres:15-alpine   Up
```

---

### 🛠️ Option 2: Manual Setup (Linux/macOS)

**Requirements:**
- Rust 1.70+
- PostgreSQL 13+
- Linux or macOS

**Install Rust:**
```bash
# Download and install
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add to PATH
source $HOME/.cargo/env

# Verify
rustc --version
cargo --version
```

**Install PostgreSQL:**

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
psql --version
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
psql --version
```

**Fedora/RedHat:**
```bash
sudo yum install -y postgresql-server postgresql-contrib
sudo systemctl start postgresql-server
psql --version
```

**Create Database:**
```bash
# Create database
createdb coin_srec

# Verify
psql -l | grep coin_srec
```

**Configure Backend:**
```bash
cd backend

# .env file is already created with default values
# Edit if needed (nano, vim, or your editor)
nano .env

# Key variables:
# DATABASE_URL=postgresql://user:password@localhost:5432/coin_srec
# JWT_SECRET=your-super-secret-key
# ADMIN_BOOTSTRAP_PASSWORD=ChangeMe123!
```

**Run Migrations:**
```bash
cd backend
sqlx database create
sqlx migrate run
```

**Start Backend:**
```bash
cd backend
cargo run
# Backend will run on http://localhost:8000
```

---

### 🐳 Option 3: Full Docker Setup

Everything runs in containers (best for production):

```bash
# Start all services
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: localhost:5432
- pgAdmin: http://localhost:5050 (if enabled)

---

## Backend Environment Configuration

### File Location
`backend/.env` (already created)

### Default Configuration
```env
DATABASE_URL=postgresql://coin_user:coin_password@localhost:5432/coin_srec
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
ADMIN_BOOTSTRAP_EMAIL=admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=ChangeMe123!
RUST_LOG=info
FRONTEND_URL=http://localhost:3000
```

### Customization
Edit these values as needed:

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost:5432/coin_srec` |
| `JWT_SECRET` | Token signing key | Min 32 random chars |
| `ADMIN_BOOTSTRAP_EMAIL` | Admin email | `admin@srec.ac.in` |
| `ADMIN_BOOTSTRAP_PASSWORD` | Admin password | `SecurePass123!` |
| `RUST_LOG` | Log level | `debug`, `info`, `warn` |
| `FRONTEND_URL` | Frontend location | `http://localhost:3000` |

---

## Verify Setup

### Check Rust Installation
```bash
rustc --version
# Should output: rustc 1.70.0 (or newer)

cargo --version
# Should output: cargo 1.70.0 (or newer)
```

### Check PostgreSQL
```bash
psql --version
# Should output: psql (PostgreSQL) 15.x

# Connect to database
psql -U coin_user -d coin_srec
# Should connect successfully
```

### Check Backend Compilation
```bash
cd backend
cargo build
# Should complete without errors
```

### Check Migrations
```bash
cd backend
sqlx migrate status
# Should show all migrations
```

---

## Running the Full Stack

### Terminal 1: Start Database (if using manual setup)
```bash
# Start PostgreSQL
# On macOS: brew services start postgresql
# On Linux: sudo systemctl start postgresql
# Or with Docker: docker-compose up -d
```

### Terminal 2: Start Frontend
```bash
npm run dev
# Frontend on http://localhost:3000
```

### Terminal 3: Start Backend
```bash
cd backend
cargo run
# Backend on http://localhost:8000
```

---

## Common Issues & Solutions

### "Cannot find `rustc`"
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reload shell
source $HOME/.cargo/env
```

### "PostgreSQL connection refused"
```bash
# Start PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Docker: docker-compose up -d postgres

# Check it's running
psql -U postgres -c "SELECT 1"
```

### "Database 'coin_srec' does not exist"
```bash
# Create database
createdb coin_srec

# Verify
psql -l | grep coin_srec
```

### "Cannot run migrations"
```bash
# Ensure database exists
createdb coin_srec

# Run migrations
cd backend
sqlx migrate run
```

### "Port 8000 already in use"
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Or use different port
ROCKET_PORT=8001 cargo run
```

### "JWT_SECRET not found"
```bash
# Check backend/.env exists
cat backend/.env

# If missing, create it
cp backend/.env.example backend/.env
```

---

## Database Management

### View Database Status
```bash
# List databases
psql -l

# Connect to database
psql -U coin_user -d coin_srec

# List tables
\dt

# Show migrations
\d schema_version

# Quit
\q
```

### Reset Database (⚠️ Deletes all data)
```bash
# Drop database
dropdb coin_srec

# Create new
createdb coin_srec

# Run migrations
cd backend && sqlx migrate run
```

### Backup Database
```bash
# Create backup
pg_dump coin_srec > backup.sql

# Restore backup
psql coin_srec < backup.sql
```

---

## Next Steps

1. ✅ Choose setup method above
2. ✅ Follow installation steps
3. ✅ Verify with checks above
4. ✅ Start all three services
5. ✅ Test API endpoints

### Test Backend is Running
```bash
# Check health
curl http://localhost:8000/health

# Should return 200 OK
```

### Test API Connectivity
```bash
# List hackathons
curl http://localhost:8000/api/hackathons

# Should return JSON
```

---

## Production Deployment

When ready to deploy:

1. **Change JWT_SECRET** to random 32+ character string
2. **Update DATABASE_URL** to production database
3. **Set RUST_LOG** to `info` or `warn`
4. **Update FRONTEND_URL** to production domain
5. **Enable HTTPS** in production
6. **Configure CORS_ALLOWED_ORIGINS** properly
7. **Set up monitoring** and error tracking

See `LAUNCH_CHECKLIST.md` for full pre-launch tasks.

---

## Troubleshooting Resources

- **Rust Issues**: https://www.rust-lang.org/tools/install
- **PostgreSQL Issues**: https://www.postgresql.org/docs/
- **SQLx Issues**: https://github.com/launchbadge/sqlx
- **Axum Framework**: https://docs.rs/axum/

---

**Having issues?** Check QUICK_REFERENCE.md for more commands and solutions.
