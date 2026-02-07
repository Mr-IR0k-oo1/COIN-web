# CoIN Implementation Checklist

Complete checklist for getting CoIN frontend and backend working together.

## Pre-Flight Checklist

### System Requirements
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Rust 1.70+ installed (`rustc --version`)
- [ ] PostgreSQL 13+ installed (`psql --version`)
- [ ] Git installed
- [ ] 2+ terminal windows open

### Repository Setup
- [ ] Repository cloned to local machine
- [ ] All files in correct locations
- [ ] No merge conflicts

## Backend Setup (Terminal 1)

### Installation
- [ ] Rust installed and configured
- [ ] PostgreSQL server running (`pg_isready`)
- [ ] Database created (`psql -U postgres -l | grep coin`)
- [ ] Database user created and has permissions

### Configuration
- [ ] `backend/.env.example` exists
- [ ] `backend/.env` created from example
- [ ] Database URL correct in `.env`
- [ ] JWT_SECRET is 32+ random characters
- [ ] Admin bootstrap credentials set

### Compilation & Migrations
- [ ] `cd backend` successful
- [ ] SQLx CLI installed (`cargo install sqlx-cli`)
- [ ] Migrations run successfully (`sqlx migrate run`)
- [ ] `cargo build` succeeds with no errors
- [ ] `cargo run` starts without panicking

### Runtime Verification
- [ ] Server listening on `http://127.0.0.1:8000`
- [ ] Health check works (`curl http://localhost:8000/api/health`)
- [ ] No error messages in output
- [ ] Server ready to accept requests

## Frontend Setup (Terminal 2)

### Installation
- [ ] Node.js 18+ installed
- [ ] `npm install` completes successfully
- [ ] All dependencies resolved
- [ ] node_modules created
- [ ] package-lock.json updated (if applicable)

### Configuration
- [ ] `.env.example` exists (if applicable)
- [ ] `.env.local` created
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:8000/api` set
- [ ] All required env vars present

### Build & Startup
- [ ] `npm run build` succeeds (optional, for verification)
- [ ] `npm run dev` starts without errors
- [ ] Next.js development server running
- [ ] Ready message displays with port 3000

### Frontend Access
- [ ] Browser can access `http://localhost:3000`
- [ ] No CORS errors in console
- [ ] No build errors
- [ ] Homepage loads without console errors

## Integration Testing

### Public Pages
- [ ] Homepage loads (`http://localhost:3000`)
- [ ] Hackathons page loads (`/hackathons`)
- [ ] Blog page loads (`/blog`)
- [ ] Submit page loads (`/submit`)

### API Connectivity
- [ ] Console shows no CORS errors
- [ ] Network tab shows API calls to `localhost:8000`
- [ ] API responses are valid JSON
- [ ] No 401/403 authorization errors on public endpoints

### Admin Login
- [ ] Login page accessible (`/admin/login`)
- [ ] Can enter email and password
- [ ] Submit button functional
- [ ] API receives login request (check Network tab)
- [ ] Gets JWT token in response
- [ ] Token saved to localStorage
- [ ] Redirects to dashboard on success

### Admin Dashboard
- [ ] Dashboard page loads (`/admin/dashboard`)
- [ ] Shows metrics (if backend has data)
- [ ] Shows recent hackathons list
- [ ] Shows recent blog posts list
- [ ] No console errors
- [ ] Layout renders correctly

### Student Submission
- [ ] Submit form loads (`/submit`)
- [ ] Can select hackathon
- [ ] Can enter team info
- [ ] Can add participants
- [ ] Can add mentors
- [ ] Can review submission
- [ ] Form validation works
- [ ] Submission sends to backend
- [ ] Success page displays
- [ ] Data appears in backend database

## Database Verification

### Tables Exist
- [ ] `admins` table created
- [ ] `hackathons` table created
- [ ] `submissions` table created
- [ ] `participants` table created
- [ ] `mentors` table created
- [ ] `blog_posts` table created

### Sample Data
- [ ] Bootstrap admin user exists
- [ ] Can query tables with `SELECT * FROM ...`
- [ ] Foreign keys are correct
- [ ] Indexes are created

### Data Integrity
- [ ] Submitted data appears in database
- [ ] Participant emails have @srec.ac.in domain
- [ ] Timestamps are correct
- [ ] UUIDs are valid format

## Feature Tests

### Hackathon Submission (Critical)
- [ ] Can view hackathons
- [ ] Can submit team participation
- [ ] Validates email format (@srec.ac.in)
- [ ] Validates no duplicate emails
- [ ] Validates participant count matches
- [ ] Stores in database correctly
- [ ] Shows success confirmation

### Admin Authentication (Critical)
- [ ] Can login with bootstrap credentials
- [ ] JWT token created
- [ ] Token stored in localStorage
- [ ] Protected routes accessible with token
- [ ] Logout clears token
- [ ] Redirects to login without token

### Blog (Important)
- [ ] Public blog list shows posts
- [ ] Can click individual post
- [ ] Post details display correctly
- [ ] Only published posts shown

### Metrics (Important)
- [ ] Dashboard shows total hackathons
- [ ] Dashboard shows total submissions
- [ ] Dashboard shows total students
- [ ] Dashboard shows total mentors
- [ ] Numbers update after new submission

## Documentation Review

### Setup & Integration
- [ ] Read `SETUP.md`
- [ ] Read `INTEGRATION_GUIDE.md`
- [ ] Understand service layer pattern
- [ ] Understand Zustand store pattern
- [ ] Know where to find API endpoints

### Backend Documentation
- [ ] Read `backend/README.md`
- [ ] Read `backend/API_REFERENCE.md`
- [ ] Understand JWT flow
- [ ] Know all API endpoints
- [ ] Understand database schema

### Admin Guide
- [ ] Read `backend/ADMIN_OPERATIONS_GUIDE.md`
- [ ] Know how to create hackathons
- [ ] Know how to manage submissions
- [ ] Know how to publish blog posts
- [ ] Know how to export data

### Implementation Plan
- [ ] Read `FEATURES_IMPLEMENTATION.md`
- [ ] Understand what pages need building
- [ ] Know which features are priority
- [ ] Have implementation templates ready

## Code Quality Checks

### TypeScript
- [ ] No TypeScript errors (`npm run tsc -- --noEmit`)
- [ ] Types are properly defined
- [ ] No `any` types without reason
- [ ] Props are properly typed

### Frontend Code
- [ ] No console errors on any page
- [ ] No console warnings
- [ ] All pages render cleanly
- [ ] Responsive design works

### Backend Code
- [ ] `cargo clippy` has no errors
- [ ] `cargo fmt --check` passes
- [ ] All endpoints have error handling
- [ ] Database queries are parameterized (SQLx)

## Performance Checks

### Frontend
- [ ] Pages load in < 3 seconds
- [ ] No unrelated API calls
- [ ] State updates efficiently
- [ ] No memory leaks in console

### Backend
- [ ] API responses < 200ms
- [ ] No N+1 query problems
- [ ] Database indexes are used
- [ ] No slow query logs

## Security Checks

### Authentication
- [ ] JWT tokens expire (24 hours)
- [ ] Token required for admin endpoints
- [ ] Password is hashed (Argon2)
- [ ] Credentials never logged

### Data Validation
- [ ] Email format validated
- [ ] Required fields enforced
- [ ] Input sanitized
- [ ] Duplicate emails rejected

### API Security
- [ ] CORS restricted (or permissive for dev)
- [ ] SQL injection prevented (SQLx)
- [ ] HTTPS ready (backend)
- [ ] No sensitive data in logs

## Deployment Readiness

### Production Checklist
- [ ] Backend `.env` has strong JWT_SECRET
- [ ] Backend `.env` has strong database password
- [ ] Frontend `.env.production` configured
- [ ] API URL points to production domain
- [ ] Database backups automated
- [ ] Error logging configured
- [ ] HTTPS enabled
- [ ] CORS configured for production domain

### Documentation Complete
- [ ] README exists and is updated
- [ ] API documentation complete
- [ ] Deployment instructions clear
- [ ] Admin guide up to date
- [ ] Emergency procedures documented

## Team Knowledge Transfer

### Backend Developer Knows
- [ ] How to run backend
- [ ] How to write new endpoints
- [ ] How to modify database schema
- [ ] How to deploy
- [ ] How to troubleshoot issues

### Frontend Developer Knows
- [ ] How to run frontend
- [ ] How to use service layer
- [ ] How to use Zustand stores
- [ ] How to add new pages
- [ ] How to test with backend

### DevOps/Admin Knows
- [ ] How to set up production environment
- [ ] How to manage deployments
- [ ] How to handle backups/recovery
- [ ] How to monitor system health
- [ ] How to escalate issues

## Final Sign-Off

### System Works End-to-End
- [ ] User visits public site
- [ ] User browses hackathons
- [ ] User submits participation
- [ ] Data appears in database
- [ ] Admin can login
- [ ] Admin can view submissions
- [ ] Admin can manage content
- [ ] All without errors

### Quality Standards Met
- [ ] Code is clean and formatted
- [ ] No console errors or warnings
- [ ] No unhandled promises
- [ ] Performance is acceptable
- [ ] Security practices followed
- [ ] Documentation is complete
- [ ] Ready for production

### Go/No-Go Decision
- [ ] All critical items checked
- [ ] All high-priority items checked
- [ ] Most nice-to-have items checked
- [ ] Team confident in system
- [ ] Ready to proceed

## Sign-Off

**System Ready for Production**: ________ (Date)

**Backend Lead**: __________________ (Name/Signature)

**Frontend Lead**: _________________ (Name/Signature)

**DevOps/Admin**: _________________ (Name/Signature)

---

## Quick Reference

### Start Development

```bash
# Terminal 1: Backend
cd backend
cargo run

# Terminal 2: Frontend
npm run dev

# Browser
http://localhost:3000
```

### Login Credentials

- Email: `admin@srec.ac.in` (or configured)
- Password: `changeme` (from backend `.env`)

### Useful URLs

- Public Site: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- API Health: http://localhost:8000/api/health
- Database: `psql -U coin_user -d coin_srec`

### Key Commands

```bash
# Frontend
npm run dev     # Start dev server
npm run build   # Build for production
npm run tsc     # Type check

# Backend
cargo run       # Start development
cargo build --release  # Build release
cargo clippy    # Lint checks

# Database
psql -U coin_user -d coin_srec  # Connect
\dt              # List tables
```

## If Something Goes Wrong

### Backend Won't Start
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Check migrations ran: `sqlx migrate run`
4. Check port 8000 not in use: `lsof -i :8000`
5. Review error message carefully

### Frontend Won't Start
1. Check Node version: `node --version` (should be 18+)
2. Verify `npm install` completed
3. Check .env.local exists and is valid
4. Check port 3000 not in use: `lsof -i :3000`
5. Clear .next cache: `rm -rf .next`

### Can't Connect Frontend to Backend
1. Verify backend is running: `curl http://localhost:8000/api/health`
2. Check NEXT_PUBLIC_API_URL in .env.local
3. Check browser console for CORS errors
4. Check Network tab to see actual request
5. Verify backend CORS allows localhost:3000

### Login Fails
1. Verify credentials (email/password from .env)
2. Check backend is receiving request
3. Verify database connection
4. Check admin user exists: `psql ... -c "SELECT * FROM admins;"`
5. Check JWT_SECRET in .env

### Database Issues
1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string: `DATABASE_URL`
3. Verify user permissions
4. Run migrations: `sqlx migrate run`
5. Check table structure: `\dt`

---

Good luck! You've got this. 🚀
