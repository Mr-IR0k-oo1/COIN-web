# Installing Missing Dependencies

You're missing Rust and PostgreSQL. Here are your options:

---

## ⭐ EASIEST OPTION: Use Docker (No Install Needed!)

If you don't want to install Rust or PostgreSQL, just use Docker:

```bash
# Start database only (PostgreSQL in Docker)
docker-compose up -d postgres

# Then just use the CLI tools (no Rust needed yet)
# You can test the frontend without backend first
```

This runs PostgreSQL in a container. **No system installation needed.**

---

## 🦀 INSTALL RUST (Required for Backend)

### On Arch Linux:

```bash
# Using pacman (official packages)
sudo pacman -S rustup

# Initialize Rust
rustup default stable

# Verify
rustc --version
cargo --version
```

### Or Universal Method (Works on Any Linux):

```bash
# Download and run installer
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add to PATH
source $HOME/.cargo/env

# Verify
rustc --version
cargo --version
```

**Time:** ~5-10 minutes  
**Space:** ~2-3 GB

---

## 🐘 INSTALL POSTGRESQL

### On Arch Linux:

```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Initialize database cluster
sudo -u postgres initdb --locale en_US.UTF-8 -D /var/lib/postgres/data

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
psql --version
```

### Using Docker (Easier):

```bash
# Start PostgreSQL in Docker
docker-compose up -d postgres

# That's it! No installation needed
# It's already running on localhost:5432
```

**Time (Arch):** ~5 minutes  
**Time (Docker):** ~1 minute  
**Space:** ~500 MB

---

## ✅ VERIFY INSTALLATIONS

### Check Rust:
```bash
rustc --version    # Should show: rustc 1.75.0 (or newer)
cargo --version    # Should show: cargo 1.75.0 (or newer)
```

### Check PostgreSQL:
```bash
psql --version     # Should show: psql (PostgreSQL) 15.x
psql -U postgres -c "SELECT 1"  # Should connect and return 1
```

---

## 🚀 QUICKEST PATH TO WORKING SYSTEM

### Option 1: Docker + Rust (15 minutes total)

```bash
# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 2. Start PostgreSQL in Docker
docker-compose up -d postgres

# 3. Wait for database to be ready (30 seconds)
sleep 30

# 4. Run migrations
cd backend
sqlx migrate run

# 5. Start backend
cargo run
```

✅ Result: Backend running on http://localhost:8000

### Option 2: Docker Only (5 minutes)

```bash
# Just start database
docker-compose up -d

# Frontend works immediately
npm run dev    # http://localhost:3000

# Backend can wait until Rust is installed
```

✅ Result: Frontend running, database ready for backend

### Option 3: Full Native Setup (30 minutes)

```bash
# Install Rust (Arch Linux)
sudo pacman -S rustup
rustup default stable

# Install PostgreSQL (Arch Linux)
sudo pacman -S postgresql
sudo systemctl start postgresql

# Create database
createdb coin_srec

# Run migrations
cd backend
sqlx migrate run

# Start everything
# Terminal 1: npm run dev
# Terminal 2: cd backend && cargo run
```

✅ Result: Full system running entirely on your machine

---

## 🎯 MY RECOMMENDATION FOR ARCH LINUX

Since you're on Arch Linux, here's the fastest path:

```bash
# Step 1: Install Rust (5 min)
sudo pacman -S rustup
rustup default stable

# Step 2: Use Docker for PostgreSQL (1 min)
docker-compose up -d postgres

# Step 3: Wait for database
sleep 30

# Step 4: Run migrations
cd backend
sqlx migrate run

# Step 5: Start everything
# Terminal 1:
npm run dev

# Terminal 2:
cd backend && cargo run
```

**Total Time:** ~15 minutes  
**Total Install:** ~1.5 GB  
**No System Bloat:** PostgreSQL runs in container

---

## ❓ SHOULD I INSTALL OR USE DOCKER?

| Factor | Native | Docker |
|--------|--------|--------|
| **Speed** | Fastest | ~1 min slower |
| **Space** | ~2.5 GB | ~500 MB |
| **Setup** | 20-30 min | 5-10 min |
| **Performance** | Native | Slight overhead |
| **Cleanup** | Leaves files | Clean: `docker-compose down` |
| **Production-like** | Less | More |

**Recommendation:** Use Docker for Postgres, native Rust

---

## 🐛 TROUBLESHOOTING INSTALLATION

### Rust Install Fails
```bash
# Try the alternative installer
wget https://sh.rustup.rs -O rustup-init.sh
chmod +x rustup-init.sh
./rustup-init.sh
```

### PostgreSQL Service Won't Start (Arch)
```bash
# Check service status
sudo systemctl status postgresql

# View logs
sudo journalctl -xe

# Try Docker instead
docker-compose up -d postgres
```

### Permission Denied on `rustup`
```bash
# Make sure curl is working
which curl

# If not found, install curl first
sudo pacman -S curl

# Then retry Rust installer
```

### Docker Not Found
```bash
# Install Docker
sudo pacman -S docker docker-compose

# Start Docker daemon
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📋 INSTALLATION CHECKLIST

After installation, verify everything:

- [ ] `rustc --version` shows version
- [ ] `cargo --version` shows version
- [ ] `psql --version` shows version OR `docker ps` shows postgres container
- [ ] Can connect to database: `psql -U coin_user -d coin_srec`
- [ ] Can build backend: `cd backend && cargo build`
- [ ] Frontend starts: `npm run dev`

---

## 🚀 READY TO START?

Once you have Rust installed:

```bash
# Start everything
docker-compose up -d           # Start database
cd backend && cargo run        # Terminal 2: Start backend
npm run dev                    # Terminal 3: Start frontend
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## ✅ NEXT STEPS

1. **Choose Option 1, 2, or 3** above
2. **Follow the commands** in order
3. **Verify installations** with the checklist
4. **Start the three services** in different terminals
5. **Open http://localhost:3000** in your browser

**You'll be fully set up in 15-30 minutes!**

---

**Need more help?** See SETUP_BACKEND.md for detailed backend setup instructions.
