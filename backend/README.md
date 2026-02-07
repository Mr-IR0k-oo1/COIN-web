# CoIN Backend - Collaborative Innovation Center

Production-ready Rust/Axum backend for SREC's CoIN platform.

## Tech Stack

- **Language**: Rust 2021 Edition
- **Framework**: Axum (async web framework)
- **Database**: PostgreSQL (SQLx with prepared queries)
- **Authentication**: JWT + Argon2 password hashing
- **Export**: CSV/XLSX
- **Config**: dotenv

## Project Structure

```
backend/
├── src/
│   ├── main.rs              # Application entry point
│   ├── error.rs             # Error types and handlers
│   ├── models.rs            # Data models and request/response types
│   ├── auth.rs              # JWT and password hashing utilities
│   ├── db.rs                # Database initialization
│   ├── middleware.rs        # JWT validation middleware
│   ├── utils.rs             # Helper functions
│   ├── export.rs            # CSV/XLSX export logic
│   ├── handlers/
│   │   ├── mod.rs           # Handler module exports
│   │   ├── public.rs        # Public API endpoints
│   │   └── admin.rs         # Protected admin endpoints
│   └── routes/              # Route definitions (auto-generated from handlers)
├── migrations/              # SQLx database migrations
├── Cargo.toml              # Dependencies
└── .env.example            # Environment variables template
```

## Setup

### Prerequisites

- Rust 1.70+
- PostgreSQL 13+
- Cargo

### Installation

1. Clone the repository:
```bash
cd backend
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/coin_srec
JWT_SECRET=your-very-secure-jwt-secret-minimum-32-chars
ADMIN_BOOTSTRAP_EMAIL=admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=securepassword
RUST_LOG=debug
FRONTEND_URL=http://localhost:3000
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE coin_srec;
```

5. Run migrations:
```bash
cargo sqlx migrate run
```

6. Build and run:
```bash
cargo build --release
./target/release/coin-backend
```

Or for development:
```bash
cargo run
```

Server will listen on `http://127.0.0.1:8000`

## Database Schema

### Admins
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String, Argon2)
- `created_at` (Timestamp)

### Hackathons
- `id` (UUID)
- `name`, `organizer`, `description`
- `mode` (ONLINE | OFFLINE)
- `location` (optional)
- `start_date`, `end_date`, `registration_deadline`
- `official_registration_link`
- `eligibility`
- `status` (UPCOMING | ONGOING | CLOSED)
- `semester`
- `created_at`, `updated_at`
- `created_by` (FK: admins.id)

### Submissions
- `id` (UUID)
- `hackathon_id` (FK)
- `team_name`
- `participant_count`, `mentor_count`
- `external_registration_confirmed` (bool)
- `status` (submitted | verified | archived)
- `created_at`

### Participants
- `id` (UUID)
- `submission_id` (FK)
- `name`, `email` (@srec.ac.in), `department`, `academic_year`

### Mentors
- `id` (UUID)
- `submission_id` (FK)
- `name`, `department`

### Blog Posts
- `id` (UUID)
- `title`, `slug` (unique)
- `summary`, `content`
- `category` (article | winner | announcement)
- `author`, `related_hackathon` (FK, optional)
- `status` (draft | published)
- `created_at`, `updated_at`

## API Endpoints

### Public Endpoints

#### Hackathons
```
GET /api/hackathons?page=1&limit=10
GET /api/hackathons/:id
```

#### Blog
```
GET /api/blog?page=1&limit=10
GET /api/blog/:slug
```

#### Student Submission
```
POST /api/submit
Content-Type: application/json

{
  "hackathon_id": "uuid",
  "team_name": "Team Alpha",
  "external_registration_confirmed": true,
  "participants": [
    {
      "name": "John Doe",
      "email": "john@srec.ac.in",
      "department": "CSE",
      "academic_year": "3rd"
    }
  ],
  "mentors": [
    {
      "name": "Dr. Smith",
      "department": "CSE"
    }
  ]
}
```

**Validation Rules:**
- `external_registration_confirmed` must be `true`
- All participant emails must end with `@srec.ac.in`
- No duplicate participant emails
- `participant_count` must match `participants.length`
- `mentor_count` must match `mentors.length`

### Admin Endpoints (JWT Protected)

#### Authentication
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@srec.ac.in",
  "password": "password"
}

Response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "admin": {
    "id": "uuid",
    "name": "Admin Name",
    "email": "admin@srec.ac.in"
  }
}
```

All subsequent admin requests must include:
```
Authorization: Bearer <token>
```

#### Hackathon Management
```
POST /api/admin/hackathons
GET /api/admin/hackathons
PUT /api/admin/hackathons/:id
PATCH /api/admin/hackathons/:id/status
```

#### Submission Management
```
GET /api/admin/submissions?hackathon_id=&status=&semester=
GET /api/admin/submissions/:id
PATCH /api/admin/submissions/:id/status
```

#### Blog Management
```
POST /api/admin/blog
PUT /api/admin/blog/:id
DELETE /api/admin/blog/:id
```

#### Metrics
```
GET /api/admin/metrics

Response:
{
  "total_hackathons": 5,
  "total_submissions": 42,
  "total_students": 128,
  "total_mentors": 16
}
```

#### Export
```
GET /api/admin/export?semester=2024-1&hackathon_id=&department=CSE&format=csv

Query Parameters:
- semester (optional): Filter by semester
- hackathon_id (optional): Filter by hackathon UUID
- department (optional): Filter by participant department
- format (optional): 'csv' or 'xlsx' (default: csv)

Response: Binary file (CSV or XLSX)
```

**Export Columns:**
- submission_id
- submitted_at
- semester
- hackathon_name
- team_name
- participant_count
- mentor_count
- participant_name
- participant_email
- participant_department
- participant_year
- mentor_names
- mentor_departments
- external_confirmed
- status

## Security

### Authentication & Authorization
- **JWT Bearer tokens** for admin endpoints
- **24-hour token expiration**
- **Password hashing**: Argon2 (industry standard)
- **SQLx prepared queries** (prevents SQL injection)
- **Input validation**: Serde with custom validators

### CORS
- Configured to allow requests from frontend domain
- Modify `CorsLayer` in main.rs for production

### Best Practices
- All admin routes require valid JWT
- Passwords never logged or returned
- Rate limiting available via middleware (implement as needed)
- Prepared statements for all database queries
- Input validation on all endpoints

## Development

### Building
```bash
cargo build           # Debug build
cargo build --release # Release optimized build
```

### Testing
```bash
cargo test
```

### Linting
```bash
cargo clippy
cargo fmt
```

### Database Migrations
```bash
# Create new migration
sqlx migrate add -r migration_name

# Run migrations
sqlx migrate run

# Revert last migration
sqlx migrate revert
```

## Production Deployment

### Environment Setup
```env
DATABASE_URL=postgresql://prod_user:secure_password@prod-db-host:5432/coin_srec
JWT_SECRET=generate-random-secure-string-min-32-chars
ADMIN_BOOTSTRAP_EMAIL=production-admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=strong-generated-password-change-immediately
RUST_LOG=info
FRONTEND_URL=https://coin.srec.ac.in
```

### Build for Production
```bash
cargo build --release
# Binary: target/release/coin-backend
```

### Running
```bash
export DATABASE_URL=...
export JWT_SECRET=...
./target/release/coin-backend
```

### Systemd Service (Linux)
Create `/etc/systemd/system/coin-backend.service`:

```ini
[Unit]
Description=CoIN Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=coin-backend
WorkingDirectory=/opt/coin-backend
ExecStart=/opt/coin-backend/coin-backend
Restart=on-failure
RestartSec=5s
EnvironmentFile=/opt/coin-backend/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable coin-backend
sudo systemctl start coin-backend
```

## Admin Operations Guide

### First-Time Setup

1. **Database initialization**: Migrations run automatically on startup
2. **Bootstrap admin**: Created automatically from environment variables
3. **Change default password**:
   ```bash
   # Login with default credentials
   curl -X POST http://localhost:8000/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@srec.ac.in","password":"changeme"}'
   ```

### Creating Events

```bash
curl -X POST http://localhost:8000/api/admin/hackathons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CodeFest 2024",
    "organizer": "CSE Department",
    "description": "Annual hackathon",
    "mode": "ONLINE",
    "location": null,
    "start_date": "2024-03-01T09:00:00Z",
    "end_date": "2024-03-02T18:00:00Z",
    "registration_deadline": "2024-02-25T23:59:59Z",
    "official_registration_link": "https://...",
    "eligibility": "All SREC students",
    "semester": "2024-1"
  }'
```

### Exporting Reports

```bash
# Export all submissions as CSV
curl -X GET "http://localhost:8000/api/admin/export?format=csv" \
  -H "Authorization: Bearer $TOKEN" \
  -o submissions.csv

# Export by semester
curl -X GET "http://localhost:8000/api/admin/export?semester=2024-1&format=csv" \
  -H "Authorization: Bearer $TOKEN" \
  -o semester_report.csv

# Export by department
curl -X GET "http://localhost:8000/api/admin/export?department=CSE&format=csv" \
  -H "Authorization: Bearer $TOKEN" \
  -o cse_submissions.csv
```

### Monitoring

Check metrics:
```bash
curl -X GET http://localhost:8000/api/admin/metrics \
  -H "Authorization: Bearer $TOKEN"
```

View logs:
```bash
# For systemd
journalctl -u coin-backend -f

# For direct execution
export RUST_LOG=debug
./target/release/coin-backend
```

## Troubleshooting

### Database Connection Errors
- Verify PostgreSQL is running
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure database exists and user has proper permissions

### JWT Token Errors
- Token expired: Get new token via login endpoint
- Invalid token: Ensure `Authorization: Bearer <token>` format
- Secret mismatch: `JWT_SECRET` must be identical on encode/decode

### Migration Issues
- Check migrations folder exists at `migrations/`
- Ensure SQLx CLI is installed: `cargo install sqlx-cli`
- Check database connection before running migrations

## Performance Optimization

- Connection pooling enabled (max 5 connections)
- Database indexes on frequently queried columns
- Prepared statements for all queries
- Async/await for non-blocking I/O
- Pagination on list endpoints (limit: 100)

## Error Handling

All errors return JSON with status code and message:

```json
{
  "error": "Hackathon not found",
  "status": 404
}
```

Status codes:
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Contributing

Follow Rust conventions and style:
```bash
cargo fmt       # Format code
cargo clippy    # Lint checks
cargo test      # Run tests
```

## License

Internal institutional software. Not for external distribution.
