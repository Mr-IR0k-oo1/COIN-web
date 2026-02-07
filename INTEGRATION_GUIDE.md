# CoIN Frontend-Backend Integration Guide

Complete guide for connecting the Next.js frontend with the Rust/Axum backend.

## Overview

The frontend and backend are fully integrated with:
- **API Communication**: Type-safe service layer for all backend calls
- **State Management**: Zustand stores synchronized with backend data
- **Authentication**: JWT token-based admin access
- **Data Mapping**: Frontend/backend type converters

## Architecture

### Service Layer (lib/services/backend.ts)

Provides methods for all backend operations:

```typescript
// Hackathons
backendService.getHackathons()
backendService.getHackathonById(id)
backendService.createHackathon(data)
backendService.updateHackathon(id, data)
backendService.updateHackathonStatus(id, status)

// Blog
backendService.getBlogPosts()
backendService.getBlogPostBySlug(slug)
backendService.createBlogPost(data)
backendService.updateBlogPost(id, data)
backendService.deleteBlogPost(id)

// Submissions
backendService.getSubmissions(filters)
backendService.getSubmissionById(id)
backendService.submitParticipation(data)
backendService.updateSubmissionStatus(id, status)

// Auth
backendService.login(email, password)

// Metrics
backendService.getMetrics()

// Export
backendService.exportData(filters)
```

### State Stores

#### useAuthStore (lib/store/authStore.ts)

Manages admin authentication:

```typescript
const { isAuthenticated, admin, token, login, logout, initializeAuth } = useAuthStore()

// Login
await login(email, password)

// Logout
logout()

// Initialize on app load
initializeAuth()
```

#### useHackathonStore (lib/store/hackathonStore.ts)

Manages hackathon data:

```typescript
const { hackathons, fetchHackathons, getHackathonById, createHackathon, updateHackathon } = useHackathonStore()

// Fetch all
await fetchHackathons()

// Get specific
const h = getHackathonById(id)

// Create
await createHackathon(data)

// Update
await updateHackathon(id, data)
```

#### useBlogStore (lib/store/blogStore.ts)

Manages blog posts:

```typescript
const { posts, fetchBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost } = useBlogStore()

// Fetch all
await fetchBlogPosts()

// Get by slug
const post = getBlogPostBySlug(slug)

// Create
await createBlogPost(data)

// Update
await updateBlogPost(id, data)
```

#### useSubmissionStore (lib/store/submissionStore.ts)

Manages student submissions:

```typescript
const { submissions, submitParticipation, fetchSubmissions } = useSubmissionStore()

// Submit participation
const result = await submitParticipation(submissionData)

// Fetch admin submissions
await fetchSubmissions(filters)
```

## Setup Instructions

### 1. Environment Variables

Create `.env.local`:

```env
# Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# In production
# NEXT_PUBLIC_API_URL=https://api.coin.srec.ac.in/api
```

### 2. Backend Startup

Ensure backend is running:

```bash
cd backend
cargo run
# Server listens on http://127.0.0.1:8000
```

### 3. Frontend Development

```bash
npm run dev
# Frontend on http://localhost:3000
```

### 4. Test Integration

#### Test Hackathons Load

```typescript
// In any component
const { hackathons, fetchHackathons } = useHackathonStore()

useEffect(() => {
  fetchHackathons()
}, [])
```

#### Test Admin Login

Navigate to `/admin/login` and use credentials from backend bootstrap:
- Email: `admin@srec.ac.in` (or configured email)
- Password: `changeme` (or configured password)

#### Test Student Submission

Navigate to `/submit` and submit participation via the form.

## Key Integration Points

### 1. Admin Login (app/admin/login/page.tsx)

```typescript
const { login } = useAuthStore()

const handleSubmit = async (e: React.FormEvent) => {
  const success = await login(email, password)
  if (success) {
    router.push('/admin/dashboard')
  }
}
```

### 2. Hackathon List (app/hackathons/page.tsx)

```typescript
const { hackathons, fetchHackathons } = useHackathonStore()

useEffect(() => {
  fetchHackathons()
}, [])
```

### 3. Student Submission (app/submit/page.tsx)

```typescript
const { submitParticipation } = useSubmissionStore()

const result = await submitParticipation({
  hackathonId,
  teamName,
  participants,
  mentors,
  externalConfirmed: true,
})
```

### 4. Blog Posts (app/blog/page.tsx)

```typescript
const { posts, fetchBlogPosts } = useBlogStore()

useEffect(() => {
  fetchBlogPosts()
}, [])
```

### 5. Admin Dashboard (app/admin/dashboard/page-integrated.tsx)

```typescript
const { fetchHackathons, hackathons } = useHackathonStore()
const { fetchBlogPosts, posts } = useBlogStore()

useEffect(() => {
  await fetchHackathons()
  await fetchBlogPosts()
  const metrics = await backendService.getMetrics()
}, [])
```

## Type Mapping

The frontend has its own types that map to backend responses:

### Frontend Type: Hackathon

```typescript
interface Hackathon {
  id: string
  slug: string
  name: string
  organizer: string
  mode: 'In-Person' | 'Online' | 'Hybrid'
  status: 'Active' | 'Closed' | 'Upcoming' | 'Completed'
  startDate: string
  endDate: string
  registrationDeadline: string
  // ...
}
```

### Backend Type: Hackathon

```typescript
{
  id: string
  name: string
  mode: "ONLINE" | "OFFLINE"
  status: "UPCOMING" | "ONGOING" | "CLOSED"
  start_date: string
  end_date: string
  registration_deadline: string
  // ...
}
```

**Mapping Logic**: Done in `backendService.mapBackendHackathon()`

## Data Flow Example: Admin Creates Hackathon

```
Frontend (User fills form)
   ↓
Admin Dashboard: <CreateHackathonForm />
   ↓
handleSubmit() calls useHackathonStore.createHackathon()
   ↓
Creates calls backendService.createHackathon()
   ↓
POST /api/admin/hackathons with JWT token
   ↓
Backend validates, stores in PostgreSQL
   ↓
Returns BackendHackathon response
   ↓
Frontend maps to Hackathon type
   ↓
Updates Zustand store
   ↓
Component re-renders with new data
```

## API Endpoint Mapping

| Frontend Action | Backend Endpoint | Method |
|---|---|---|
| List hackathons | `/api/hackathons` | GET |
| Get hackathon | `/api/hackathons/:id` | GET |
| Create hackathon | `/api/admin/hackathons` | POST |
| Update hackathon | `/api/admin/hackathons/:id` | PUT |
| Change status | `/api/admin/hackathons/:id/status` | PATCH |
| List blog posts | `/api/blog` | GET |
| Get blog post | `/api/blog/:slug` | GET |
| Create post | `/api/admin/blog` | POST |
| Update post | `/api/admin/blog/:id` | PUT |
| Delete post | `/api/admin/blog/:id` | DELETE |
| Submit participation | `/api/submit` | POST |
| List submissions | `/api/admin/submissions` | GET |
| Get submission | `/api/admin/submissions/:id` | GET |
| Update status | `/api/admin/submissions/:id/status` | PATCH |
| Login | `/api/admin/login` | POST |
| Get metrics | `/api/admin/metrics` | GET |
| Export | `/api/admin/export` | GET |

## Error Handling

All service calls include error handling:

```typescript
try {
  const data = await backendService.getHackathons()
} catch (err) {
  console.error('Failed to fetch hackathons:', err.message)
  // Show user-friendly error message
}
```

Store mutations also handle errors:

```typescript
fetchHackathons: async () => {
  set({ isLoading: true, error: null })
  try {
    const hackathons = await backendService.getHackathons()
    set({ hackathons, isLoading: false })
  } catch (err) {
    set({ error: err.message, isLoading: false })
  }
}
```

## Authentication Flow

### Login

1. User submits email + password on `/admin/login`
2. `useAuthStore.login()` calls `backendService.login()`
3. Backend validates credentials, returns JWT token
4. Token stored in localStorage
5. User redirected to `/admin/dashboard`

### Protected Routes

1. JWT token stored in localStorage
2. API layer automatically adds `Authorization: Bearer <token>` header
3. Backend validates token in middleware
4. Request succeeds or fails with 401

### Logout

1. User clicks logout
2. `useAuthStore.logout()` clears state and localStorage
3. User redirected to `/admin/login`

## Development Workflow

### 1. Adding a New Admin Feature

```typescript
// 1. Add to backend service
export const backendService = {
  async myNewFeature() {
    return api.post('/admin/my-endpoint', data)
  }
}

// 2. Add to Zustand store
export const useMyStore = create((set) => ({
  myMethod: async () => {
    const result = await backendService.myNewFeature()
    set({ /* update state */ })
  }
}))

// 3. Use in component
const { myMethod } = useMyStore()
await myMethod()
```

### 2. Handling New Backend Responses

```typescript
// Add mapping function if types differ
function mapBackendResponse(data: BackendType): FrontendType {
  return {
    // map fields
  }
}

// Update service to use mapping
async getFeature() {
  const data = await api.get('/endpoint')
  return mapBackendResponse(data)
}
```

### 3. Testing

```typescript
// Manual testing via Postman/curl
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srec.ac.in","password":"password"}'

# Get token from response
TOKEN="..."

# Test protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/admin/metrics
```

## Troubleshooting

### Backend Not Responding

1. Check backend is running: `curl http://localhost:8000/api/health`
2. Check `NEXT_PUBLIC_API_URL` is correct
3. Check CORS is enabled (should be by default)

### Login Fails

1. Verify email/password match bootstrap values
2. Check backend is receiving request: `journalctl -u coin-backend -f`
3. Verify database connection: `psql $DATABASE_URL`

### Data Not Loading

1. Check browser console for errors
2. Check store is calling `fetchHackathons()` on mount
3. Verify backend returns data: `curl http://localhost:8000/api/hackathons`

### Type Errors

1. Ensure types in `lib/types.ts` match what backend sends
2. Add mapping functions in `backendService` if needed
3. Check API responses with `console.log()`

## Production Deployment

### Environment Variables

```env
# Production
NEXT_PUBLIC_API_URL=https://api.coin.srec.ac.in/api
```

### CORS Configuration

In `backend/src/main.rs`:

```rust
.layer(
  CorsLayer::very_permissive()
    .allow_origin("https://coin.srec.ac.in".parse()?)
)
```

### API Base URL

Update in `lib/api.ts`:

```typescript
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  'http://127.0.0.1:8000/api'
```

## API Documentation

- Full API Reference: See `backend/API_REFERENCE.md`
- Admin Guide: See `backend/ADMIN_OPERATIONS_GUIDE.md`
- Database Schema: See `backend/DATABASE_MIGRATION_GUIDE.md`
