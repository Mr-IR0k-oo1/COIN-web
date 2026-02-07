# Deployment Guide - CoIN Backend

Production deployment steps for CoIN backend on Linux servers.

## Prerequisites

- Ubuntu 20.04 LTS or later (or compatible Linux distro)
- PostgreSQL 13+
- Rust toolchain
- Systemd (for service management)
- Nginx or Apache (for reverse proxy)

---

## Server Setup

### 1. Create Service User

```bash
# Create non-root user for running the service
sudo useradd -m -s /bin/bash coin-backend
sudo usermod -aG sudo coin-backend

# Create application directory
sudo mkdir -p /opt/coin-backend
sudo chown coin-backend:coin-backend /opt/coin-backend
```

### 2. Install Dependencies

```bash
sudo apt update
sudo apt install -y \
  build-essential \
  pkg-config \
  libssl-dev \
  libpq-dev \
  curl \
  git

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 3. Setup PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE coin_srec;
CREATE USER coin_user WITH PASSWORD 'strong_secure_password_here';
ALTER ROLE coin_user SET client_encoding TO 'utf8';
ALTER ROLE coin_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE coin_user SET default_transaction_deferrable TO on;
ALTER ROLE coin_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE coin_srec TO coin_user;
\c coin_srec
GRANT ALL PRIVILEGES ON SCHEMA public TO coin_user;
EOF
```

---

## Deploy Backend

### 1. Clone Repository

```bash
sudo -u coin-backend -i
cd /opt/coin-backend
git clone https://github.com/your-org/coin-backend.git .
```

### 2. Build Release Binary

```bash
# Build optimized release
cargo build --release

# Binary location: target/release/coin-backend
ls -lh target/release/coin-backend
```

### 3. Setup Environment

```bash
# Create .env file
sudo -u coin-backend tee /opt/coin-backend/.env > /dev/null << EOF
DATABASE_URL=postgresql://coin_user:strong_secure_password_here@localhost:5432/coin_srec
JWT_SECRET=generate-a-random-secure-string-minimum-32-characters-long
ADMIN_BOOTSTRAP_EMAIL=admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=initial-bootstrap-password-change-immediately
RUST_LOG=info
FRONTEND_URL=https://coin.srec.ac.in
EOF

# Secure permissions
sudo -u coin-backend chmod 600 /opt/coin-backend/.env
```

### 4. Run Migrations

```bash
cd /opt/coin-backend
export $(cat .env | xargs)
sqlx migrate run
```

### 5. Test Run

```bash
/opt/coin-backend/target/release/coin-backend
# Should see: "Server listening on http://127.0.0.1:8000"
# Press Ctrl+C to stop
```

---

## Systemd Service

### Create Service File

```bash
sudo tee /etc/systemd/system/coin-backend.service > /dev/null << 'EOF'
[Unit]
Description=CoIN Backend Service
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=coin-backend
Group=coin-backend
WorkingDirectory=/opt/coin-backend
ExecStart=/opt/coin-backend/target/release/coin-backend
Restart=on-failure
RestartSec=5s

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/opt/coin-backend

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=coin-backend

[Install]
WantedBy=multi-user.target
EOF
```

### Enable & Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable on boot
sudo systemctl enable coin-backend

# Start service
sudo systemctl start coin-backend

# Check status
sudo systemctl status coin-backend

# View logs
sudo journalctl -u coin-backend -f
```

---

## Nginx Reverse Proxy

### Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

### Configure Reverse Proxy

```bash
sudo tee /etc/nginx/sites-available/coin-backend > /dev/null << 'EOF'
upstream coin_backend {
    server 127.0.0.1:8000;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name coin.srec.ac.in;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name coin.srec.ac.in;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/coin.srec.ac.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/coin.srec.ac.in/privkey.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
    location / {
        proxy_pass http://coin_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    location /api/admin/login {
        limit_req zone=api_limit burst=5 nodelay;
        proxy_pass http://coin_backend;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/coin-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --webroot -w /var/www/certbot \
  -d coin.srec.ac.in \
  -d www.coin.srec.ac.in \
  --email admin@srec.ac.in \
  --agree-tos \
  --non-interactive

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Maintenance

### Check Service Status

```bash
# Service status
sudo systemctl status coin-backend

# Recent logs
sudo journalctl -u coin-backend -n 50

# Live logs
sudo journalctl -u coin-backend -f

# Error logs
sudo journalctl -u coin-backend -p err
```

### Monitor Database

```bash
# Connection count
psql -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Database size
psql -c "SELECT pg_size_pretty(pg_database_size('coin_srec'));"

# Slow queries
psql -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;"
```

### Health Checks

```bash
# API health
curl https://coin.srec.ac.in/api/health

# Database connection
curl -s https://coin.srec.ac.in/api/health | jq .

# Metrics endpoint (requires auth)
curl -H "Authorization: Bearer $TOKEN" https://coin.srec.ac.in/api/admin/metrics
```

### Backup Schedule

```bash
# Create backup script
sudo tee /usr/local/bin/backup-coin-db.sh > /dev/null << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/coin-db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

pg_dump coin_srec | gzip > $BACKUP_DIR/coin_srec_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/coin_srec_$DATE.sql.gz"
EOF

sudo chmod +x /usr/local/bin/backup-coin-db.sh

# Schedule via cron (daily at 2 AM)
sudo tee /etc/cron.d/coin-backup > /dev/null << 'EOF'
0 2 * * * root /usr/local/bin/backup-coin-db.sh
EOF
```

### Log Rotation

```bash
sudo tee /etc/logrotate.d/coin-backend > /dev/null << 'EOF'
/var/log/coin-backend.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 coin-backend coin-backend
    sharedscripts
    postrotate
        systemctl reload coin-backend > /dev/null 2>&1 || true
    endscript
}
EOF
```

---

## Update & Upgrade

### Deploy New Version

```bash
cd /opt/coin-backend

# Pull latest code
git pull origin main

# Build new release
cargo build --release

# Run migrations if needed
export $(cat .env | xargs)
sqlx migrate run

# Test new binary
./target/release/coin-backend &
sleep 2
curl http://localhost:8000/api/health
kill %1

# Restart service
sudo systemctl restart coin-backend

# Verify
sudo systemctl status coin-backend
```

### Rollback

```bash
# If update fails, rollback to previous commit
cd /opt/coin-backend
git revert HEAD
cargo build --release

# Rebuild database if needed
export $(cat .env | xargs)
sqlx migrate revert

# Restart
sudo systemctl restart coin-backend
```

---

## Security Checklist

- [ ] Use HTTPS with valid certificate
- [ ] Set strong JWT_SECRET (min 32 random characters)
- [ ] Change bootstrap admin password immediately
- [ ] Use strong PostgreSQL password
- [ ] Enable firewall and restrict ports
- [ ] Disable root SSH login
- [ ] Use SSH key authentication
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Monitor access logs for unusual activity
- [ ] Regular database backups
- [ ] Document emergency contact procedures

---

## Performance Tuning

### PostgreSQL Configuration

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/13/main/postgresql.conf

# Recommended settings:
# shared_buffers = 256MB (25% of RAM)
# effective_cache_size = 1GB (50-75% of RAM)
# work_mem = 16MB
# maintenance_work_mem = 64MB
# max_connections = 200

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Rust Optimization

Binary already compiled with:
```toml
[profile.release]
opt-level = 3
lto = true
```

### Connection Pooling

Backend uses SQLx connection pool (max 5 connections).
Adjust in `main.rs` if needed:

```rust
let pool = PgPoolOptions::new()
    .max_connections(10)  // Adjust based on load
    .connect(&database_url)
    .await?;
```

---

## Troubleshooting Deployment

### Backend won't start
```bash
# Check logs
sudo journalctl -u coin-backend -n 100

# Common causes:
# 1. Database connection failed
#    → Check DATABASE_URL and PostgreSQL status
# 2. Port 8000 already in use
#    → Change port in main.rs or kill other process
# 3. Migration failed
#    → Run: sqlx migrate revert, then migrate run
```

### High CPU Usage
```bash
# Check slow queries
psql coin_srec -c "SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Add indexes if needed
psql coin_srec -c "CREATE INDEX idx_name ON table(column);"
```

### High Memory Usage
```bash
# Check connection count
psql -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Reduce max_connections if needed
```

### Nginx SSL Issues
```bash
# Test SSL configuration
sudo ssl-test-sslscan coin.srec.ac.in

# Check certificate expiry
curl -vI https://coin.srec.ac.in 2>&1 | grep "expire"

# Verify certificate
sudo openssl x509 -in /etc/letsencrypt/live/coin.srec.ac.in/fullchain.pem -text -noout
```

---

## Disaster Recovery

### Restore from Backup

```bash
# Stop backend
sudo systemctl stop coin-backend

# Restore database
psql coin_srec < /backups/coin-db/coin_srec_TIMESTAMP.sql

# Verify data
psql -c "SELECT COUNT(*) FROM submissions;"

# Restart backend
sudo systemctl start coin-backend
```

### Point-in-Time Recovery

```bash
# PostgreSQL PITR requires WAL archiving (advanced setup)
# Contact DevOps team for detailed PITR procedure
```

---

## Monitoring Tools

### Install Monitoring Stack (Optional)

```bash
# Prometheus (metrics collection)
sudo apt install -y prometheus

# Grafana (visualization)
sudo apt install -y grafana-server

# Configure backend to expose metrics on /metrics endpoint
# (Not implemented yet - feature for v1.1)
```

---

## Contact & Support

- **DevOps Team**: devops@srec.ac.in
- **Backend Owner**: backend-team@srec.ac.in
- **Emergency**: +91-xxx-xxx-xxxx

---

## Deployment Checklist

Before going live:

- [ ] Database backups tested and working
- [ ] SSL certificate installed and valid
- [ ] Environment variables configured securely
- [ ] Admin account created and password changed
- [ ] Health check endpoint responding
- [ ] All API endpoints tested
- [ ] Rate limiting configured
- [ ] Logs being collected
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Team trained on deployment procedures
