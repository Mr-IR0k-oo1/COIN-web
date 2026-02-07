# CoIN - Quick Reference Guide

## 🚀 Start Development (5 Minutes)

```bash
# Clone and enter directory
cd hackweb

# Option 1: Using Docker (Easiest)
docker-compose up -d
npm install
npm run dev
# Frontend: http://localhost:3000
# Backend: http://localhost:8000

# Option 2: Manual Setup
# Terminal 1: npm run dev (frontend)
# Terminal 2: cd backend && cargo run (backend)
# Ensure PostgreSQL is running on localhost:5432
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Frontend config (API URL, etc.) |
| `backend/.env` | Backend config (DB, JWT, etc.) |
| `lib/services/backend.ts` | API client implementation |
| `lib/store/` | State management (Zustand) |
| `lib/types/` | TypeScript type definitions |
| `backend/src/` | Rust backend code |
| `migrations/` | Database schema changes |

## 🔐 Default Login

```
Email: admin@srec.ac.in
Password: (Set in backend/.env - ADMIN_BOOTSTRAP_PASSWORD)
```

## 📊 Project URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Database | postgresql://localhost:5432 |
| pgAdmin | http://localhost:5050 |

## 💾 Database Commands

```bash
# Create database
createdb coin_srec

# Run migrations
cd backend && sqlx migrate run

# Check migration status
sqlx migrate status

# Revert last migration
sqlx migrate revert

# Connect to database
psql -U coin_user -d coin_srec
```

## 🛠️ Common Commands

### Frontend
```bash
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Run production
npm run lint            # Check code style
npm run type-check      # Check TypeScript
```

### Backend
```bash
cd backend
cargo run               # Development mode
cargo build --release   # Production build
cargo test              # Run tests
cargo clippy            # Lint code
cargo fmt               # Format code
```

## 🐛 Troubleshooting

### "Cannot connect to API"
```bash
# Check backend is running
curl http://localhost:8000/health

# Check NEXT_PUBLIC_API_URL in .env.local
cat .env.local

# Verify CORS in backend/.env
FRONTEND_URL=http://localhost:3000
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@localhost:5432/coin_srec

# Start with Docker if needed
docker-compose up -d postgres
```

### "Port already in use"
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### "TypeScript errors"
```bash
npm run type-check      # See detailed errors
npm install             # Reinstall dependencies
rm -rf node_modules     # Nuclear option
npm install
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "Add my feature"

# Push and create PR
git push origin feature/my-feature

# After review, merge to main
git checkout main
git pull origin main
git merge feature/my-feature
git push origin main
```

## 🔑 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_NAME=CoIN
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/coin_srec
JWT_SECRET=your-super-secret-key-minimum-32-chars
ADMIN_BOOTSTRAP_EMAIL=admin@srec.ac.in
ADMIN_BOOTSTRAP_PASSWORD=ChangeMe123!
RUST_LOG=info
FRONTEND_URL=http://localhost:3000
```

## 📚 Documentation Map

```
README.md                    # Start here!
├── API_SETUP.md            # API configuration & testing
├── PRODUCT_ROADMAP.md      # Development phases
├── PRODUCT_SUMMARY.md      # Product overview
├── LAUNCH_CHECKLIST.md     # Pre-launch tasks
└── QUICK_REFERENCE.md      # This file
```

## 🎯 Key Concepts

### State Management (Zustand)
```typescript
// Create store
export const useStudentStore = create<StudentStore>((set) => ({
  // state
  students: [],
  // actions
  setStudents: (students) => set({ students }),
}))

// Use in component
const students = useStudentStore((state) => state.students)
```

### API Service
```typescript
// All API calls go through backend.ts
import { backendService } from '@/lib/services/backend'

// Examples
await backendService.login(email, password)
await backendService.getHackathons()
await backendService.submitParticipation(data)
```

### Type Safety
```typescript
// Types defined in lib/types/index.ts
interface Hackathon {
  id: string
  name: string
  status: 'UPCOMING' | 'ONGOING' | 'CLOSED'
  // ...
}
```

## 🚨 Emergency Procedures

### If backend crashes
```bash
# Check logs
docker-compose logs backend

# Restart
docker-compose restart backend

# Or rebuild
cd backend
cargo build
cargo run
```

### If database is corrupted
```bash
# Backup first (ALWAYS!)
pg_dump coin_srec > backup.sql

# Drop and recreate
dropdb coin_srec
createdb coin_srec

# Run migrations
cd backend && sqlx migrate run
```

### If completely stuck
```bash
# Nuclear reset
docker-compose down -v
rm -rf node_modules
docker-compose up -d
npm install
npm run dev
```

## 📈 Performance Tips

### Frontend
- Use React DevTools for debugging
- Check Lighthouse scores (Ctrl+Shift+I)
- Enable Network tab to see API calls
- Use dark mode for easier development

### Backend
```bash
# Check slow queries
RUST_LOG=debug cargo run  # Shows all queries

# Benchmark
cargo bench
```

### Database
```sql
-- Check slow queries in PostgreSQL
SELECT query, calls, total_time, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Check indexes
\d+ table_name
```

## 🔄 Development Checklist

Before committing code:
- [ ] Tests pass (`npm test`)
- [ ] No console errors (F12)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Accessibility check
- [ ] No secrets in code
- [ ] Updated relevant docs

## 📞 Getting Help

1. Check documentation in project root
2. Search GitHub issues
3. Ask team members
4. Check framework docs:
   - Next.js: https://nextjs.org/docs
   - Axum: https://docs.rs/axum/
   - SQLx: https://github.com/launchbadge/sqlx

## 📊 Useful Links

- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Rust**: https://doc.rust-lang.org/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Docker**: https://docs.docker.com/

## 🎓 Learning Path

New to the codebase?

1. Read README.md
2. Review PRODUCT_SUMMARY.md
3. Look at file structure
4. Check lib/types/ for data models
5. Review a simple page (e.g., /about)
6. Check backend handlers
7. Read API_SETUP.md for integrations

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Setup (Docker) | 5 min |
| Setup (Manual) | 30 min |
| First build | 10 min |
| Learn codebase | 2-4 hours |
| Add simple feature | 1-2 hours |
| Add complex feature | 4-8 hours |
| Full deployment | 2-4 hours |

## 🎯 Success = 

- ✅ Both servers running
- ✅ Frontend loads on localhost:3000
- ✅ Can login as admin
- ✅ Database has data
- ✅ No console errors
- ✅ API responding on localhost:8000

---

**Quick wins to get started:**

1. ✅ Start Docker: `docker-compose up -d`
2. ✅ Install deps: `npm install`
3. ✅ Start frontend: `npm run dev`
4. ✅ Check http://localhost:3000
5. ✅ Explore the code!

**Good luck! 🚀**
