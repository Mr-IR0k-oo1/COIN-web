# CoIN Backend - Quick Start Guide

Get the CoIN backend running in 5 minutes.

## Setup (First Time)

### 1. Prerequisites
```bash
# Rust (install from https://rustup.rs/)
rustc --version    # Should be 1.70+

# PostgreSQL (install locally or use Docker)
psql --version     # Should be 13+
```

### 2. Clone & Configure
```bash
cd backend
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL=postgresql://user:password@localhost:5432/coin_srec
# JWT_SECRET=your-random-secret-string
```

### 3. Create Database
```bash
# PostgreSQL already running
createdb coin_srec
```

### 4. Run
```bash
cargo run
# Server starts on http://127.0.0.1:8000
```

## Testing the API

### Health Check
```bash
curl http://localhost:8000/api/health
# {"status":"ok"}
```

### Login (Admin)
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srec.ac.in","password":"changeme"}'

# Response includes JWT token
```

### Create Hackathon
```bash
TOKEN="your-jwt-token-from-login"

curl -X POST http://localhost:8000/api/admin/hackathons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Hackathon",
    "organizer": "CSE",
    "description": "Test event",
    "mode": "ONLINE",
    "start_date": "2024-03-01T09:00:00Z",
    "end_date": "2024-03-02T18:00:00Z",
    "registration_deadline": "2024-02-25T23:59:59Z",
    "official_registration_link": "https://example.com",
    "eligibility": "All students",
    "semester": "2024-1"
  }'
```

### List Hackathons
```bash
curl http://localhost:8000/api/hackathons
```

### Submit Participation
```bash
curl -X POST http://localhost:8000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "hackathon_id": "550e8400-e29b-41d4-a716-446655440000",
    "team_name": "Team A",
    "external_registration_confirmed": true,
    "participants": [
      {
        "name": "John",
        "email": "john@srec.ac.in",
        "department": "CSE",
        "academic_year": "3"
      }
    ],
    "mentors": []
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── main.rs              # Entry point
│   ├── models.rs            # Data types
│   ├── auth.rs              # JWT + password hashing
│   ├── db.rs                # Database setup
│   ├── error.rs             # Error handling
│   ├── middleware.rs        # JWT middleware
│   ├── utils.rs             # Helper functions
│   ├── export.rs            # CSV export
│   └── handlers/
│       ├── admin.rs         # Admin endpoints
│       └── public.rs        # Public endpoints
├── migrations/
│   └── 001_initial_schema.sql   # Database schema
├── Cargo.toml               # Dependencies
├── .env.example             # Environment template
├── README.md                # Full documentation
├── API_REFERENCE.md         # Complete API docs
├── ADMIN_OPERATIONS_GUIDE.md # Admin guide
├── DATABASE_MIGRATION_GUIDE.md # Migration guide
└── DEPLOYMENT.md            # Production guide
```

## Key Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/hackathons` - List events
- `GET /api/hackathons/:id` - Event details
- `GET /api/blog` - Blog posts
- `GET /api/blog/:slug` - Post details
- `POST /api/submit` - Student submission

### Admin (JWT Required)
- `POST /api/admin/login` - Login
- `POST /api/admin/hackathons` - Create event
- `GET /api/admin/hackathons` - List events
- `PUT /api/admin/hackathons/:id` - Update event
- `PATCH /api/admin/hackathons/:id/status` - Change status
- `GET /api/admin/submissions` - View submissions
- `PATCH /api/admin/submissions/:id/status` - Verify submission
- `GET /api/admin/metrics` - Analytics
- `GET /api/admin/export` - Export data (CSV/XLSX)
- `POST /api/admin/blog` - Create blog post
- `PUT /api/admin/blog/:id` - Edit post
- `DELETE /api/admin/blog/:id` - Delete post

## Common Commands

```bash
# Run in development
cargo run

# Build release
cargo build --release

# Run tests
cargo test

# Format code
cargo fmt

# Lint
cargo clippy

# Database migrations
sqlx migrate run
sqlx migrate add -r my_migration
sqlx migrate revert

# Database shell
psql $DATABASE_URL
```

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@host:5432/coin_srec
JWT_SECRET=random-string-minimum-32-characters

# Optional (defaults provided)
ADMIN_BOOTSTRAP_EMAIL=admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=changeme
RUST_LOG=debug
FRONTEND_URL=http://localhost:3000
```

## Database Schema

**Tables:**
- `admins` - Admin users
- `hackathons` - Events
- `submissions` - Team participations
- `participants` - Student members
- `mentors` - Faculty mentors
- `blog_posts` - News articles

## Authentication

JWT tokens expire after 24 hours. Login again to get a new token.

```bash
# Include token in admin requests
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/admin/...
```

## Student Email Validation

All participant emails must end with `@srec.ac.in`.

```
✅ john@srec.ac.in
❌ john@gmail.com
❌ john@example.com
```

## Common Issues

**Port 8000 already in use**
```bash
# Find process using port
lsof -i :8000
# Kill process or change port in main.rs
```

**Database connection failed**
```bash
# Check PostgreSQL is running
psql postgres -c "SELECT 1;"

# Verify DATABASE_URL
echo $DATABASE_URL

# Create database if needed
createdb coin_srec
```

**Migrations failed**
```bash
# Revert and retry
sqlx migrate revert
sqlx migrate run
```

## Next Steps

1. **Read Full Docs**: Check README.md for complete guide
2. **API Reference**: See API_REFERENCE.md for all endpoints
3. **Admin Guide**: Read ADMIN_OPERATIONS_GUIDE.md for operations
4. **Deploy**: Follow DEPLOYMENT.md for production setup

## Support

- **Documentation**: /backend/README.md
- **API Docs**: /backend/API_REFERENCE.md
- **Admin Guide**: /backend/ADMIN_OPERATIONS_GUIDE.md
- **Deployment**: /backend/DEPLOYMENT.md
