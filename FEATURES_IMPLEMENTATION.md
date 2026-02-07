# CoIN Features Implementation Guide

Complete checklist of all features and their implementation status.

## ✅ Implemented Features

### Core Platform

- ✅ Homepage with feature overview
- ✅ Public hackathon browsing
- ✅ Blog posts listing
- ✅ Individual blog post pages
- ✅ Student participation submission form (multi-step)
- ✅ Success confirmation page

### Admin Panel

- ✅ Admin login page
- ✅ JWT authentication
- ✅ Protected routes middleware
- ✅ Admin dashboard with metrics
- ✅ Navigation sidebar

### Backend

- ✅ Rust/Axum REST API
- ✅ PostgreSQL database
- ✅ JWT token authentication
- ✅ Argon2 password hashing
- ✅ SQLx prepared statements
- ✅ Database migrations
- ✅ Error handling
- ✅ CORS middleware

### Frontend-Backend Integration

- ✅ API service layer (`lib/services/backend.ts`)
- ✅ Type mapping (frontend ↔ backend)
- ✅ Zustand state stores
- ✅ JWT token management
- ✅ Error handling layer

---

## 📋 Feature Implementation Roadmap

### Admin Hackathon Management

#### Create Hackathon Page
**Status**: Needs Implementation

```typescript
// app/admin/hackathons/create/page.tsx
// Form for creating new hackathons
// - Input fields for all hackathon properties
// - Date pickers
// - Mode/status selectors
// - Integration with useHackathonStore.createHackathon()
```

**Implementation Steps**:
1. Create form component with validation
2. Handle form submission
3. Call `backendService.createHackathon()`
4. Update Zustand store
5. Redirect to hackathons list

**Code Template**:
```typescript
'use client'

import { useState } from 'react'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import AdminLayout from '@/components/AdminLayout'

export default function CreateHackathonPage() {
  const { createHackathon } = useHackathonStore()
  const [formData, setFormData] = useState({
    name: '',
    organizer: '',
    // ... other fields
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createHackathon(formData)
      // Redirect to list
    } catch (err) {
      // Show error
    }
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </AdminLayout>
  )
}
```

#### Hackathons List (Admin)
**Status**: Needs Implementation

```typescript
// app/admin/hackathons/page.tsx
// Shows all hackathons with edit/delete options
```

#### Edit Hackathon Page
**Status**: Needs Implementation

```typescript
// app/admin/hackathons/[id]/edit/page.tsx
// Pre-populated form for editing
```

### Admin Submission Management

#### Submissions List Page
**Status**: Needs Implementation

```typescript
// app/admin/submissions/page.tsx
// Table of all submissions
// Filters: hackathon, status, semester, department
// Bulk actions
```

#### Submission Details Page
**Status**: Needs Implementation

```typescript
// app/admin/submissions/[id]/page.tsx
// Full submission details
// Participant & mentor info
// Status change controls
```

### Admin Blog Management

#### Create Blog Post Page
**Status**: Needs Implementation

```typescript
// app/admin/blog/create/page.tsx
// Rich text editor
// Category selection
// Status (draft/publish)
```

#### Blog Posts List (Admin)
**Status**: Needs Implementation

```typescript
// app/admin/blog/page.tsx
// All posts with edit/delete
// Draft & published status
```

#### Edit Blog Post Page
**Status**: Needs Implementation

```typescript
// app/admin/blog/[id]/edit/page.tsx
// Edit form with rich editor
```

### Admin Reports & Export

#### Reports Page
**Status**: Needs Implementation

```typescript
// app/admin/reports/page.tsx
// Dashboard with data visualizations
// Charts for:
//   - Participation by semester
//   - Submissions by hackathon
//   - Participation by department
//   - Mentor distribution
```

**Implementation**:
- Add Chart library: `npm install recharts`
- Create chart components
- Use `backendService.getMetrics()`

```typescript
import { BarChart, Bar, XAxis, YAxis } from 'recharts'

export function SubmissionsByHackathon() {
  const { hackathons } = useHackathonStore()
  
  const data = hackathons.map(h => ({
    name: h.name,
    submissions: /* count from store */
  }))

  return <BarChart data={data}>{/* */}</BarChart>
}
```

#### Export Data Page
**Status**: Needs Implementation

```typescript
// app/admin/reports/export/page.tsx
// Export filters:
//   - Format: CSV, XLSX
//   - Semester filter
//   - Hackathon filter
//   - Department filter
// Download button
```

**Implementation**:
```typescript
const handleExport = async () => {
  const blob = await backendService.exportData({
    semester: selectedSemester,
    hackathon_id: selectedHackathon,
    department: selectedDept,
    format: 'csv'
  })
  
  // Trigger download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'export.csv'
  a.click()
}
```

### Settings & Configuration

#### Admin Settings Page
**Status**: Needs Implementation

```typescript
// app/admin/settings/page.tsx
// - Change password
// - View admin info
// - System logs
```

### Frontend Pages Needing Updates

#### Blog Detail Page (app/blog/[slug]/page.tsx)
**Current Status**: Uses mock store

**Update to Backend**:
```typescript
'use client'

import { useBlogStore } from '@/lib/store/blogStore'
import { useEffect, useState } from 'react'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { getBlogPostBySlug, fetchBlogPosts } = useBlogStore()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      await fetchBlogPosts()
      const foundPost = getBlogPostBySlug(params.slug)
      setPost(foundPost)
    }
    loadPost()
  }, [params.slug])

  if (!post) return <div>Loading...</div>

  return (
    // Render post
  )
}
```

#### Hackathon Detail Page (app/hackathons/[slug]/page.tsx)
**Current Status**: Uses mock store

**Update to Backend**:
```typescript
'use client'

import { useHackathonStore } from '@/lib/store/hackathonStore'
import { useEffect, useState } from 'react'

export default function HackathonDetailPage({ params }) {
  const { getHackathonById, fetchHackathons } = useHackathonStore()
  const [hackathon, setHackathon] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      await fetchHackathons()
      const found = getHackathonById(params.slug)
      setHackathon(found)
    }
    loadData()
  }, [params.slug])

  if (!hackathon) return <div>Loading...</div>

  return (
    // Render details + register button
  )
}
```

---

## 🔧 Implementation Priority

### Phase 1 (MVP - Weeks 1-2)
- [ ] Admin Hackathon CRUD (Create, Read, Update, Delete)
- [ ] Admin Submission Review & Status Updates
- [ ] Basic Reports Page
- [ ] Blog Post CRUD (Admin)

### Phase 2 (Enhanced - Weeks 3-4)
- [ ] Advanced Reports with Charts
- [ ] Data Export (CSV/XLSX)
- [ ] Admin Settings
- [ ] User Profile Pages

### Phase 3 (Polish - Weeks 5+)
- [ ] Analytics Dashboard
- [ ] Notifications System
- [ ] Email Integration
- [ ] Advanced Filtering/Search

---

## 🎯 Step-by-Step: Create Hackathon Page

### 1. Create the Page Component

```bash
mkdir -p app/admin/hackathons/create
touch app/admin/hackathons/create/page.tsx
```

### 2. Build the Form

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import AdminLayout from '@/components/AdminLayout'

const DEPARTMENTS = ['CSE', 'ECE', 'ME', 'EEE', 'CE', 'CHE', 'IT']

export default function CreateHackathonPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { createHackathon } = useHackathonStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    organizer: '',
    description: '',
    mode: 'Online',
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    officialLink: '',
    eligibility: '',
    semester: '',
  })

  if (!isAuthenticated) {
    router.push('/admin/login')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name.trim()) throw new Error('Event name is required')
      if (!formData.organizer.trim()) throw new Error('Organizer is required')
      if (!formData.description.trim()) throw new Error('Description is required')

      await createHackathon(formData)
      router.push('/admin/hackathons')
    } catch (err: any) {
      setError(err.message || 'Failed to create hackathon')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Hackathon</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Event Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coin-500"
              required
            />
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-sm font-medium mb-2">Organizer *</label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coin-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-coin-500"
              required
            />
          </div>

          {/* Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Online</option>
                <option>In-Person</option>
                <option>Hybrid</option>
              </select>
            </div>

            {formData.mode === 'In-Person' && (
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Registration Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">Registration Deadline</label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Official Link */}
          <div>
            <label className="block text-sm font-medium mb-2">Official Registration Link</label>
            <input
              type="url"
              name="officialLink"
              value={formData.officialLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Eligibility */}
          <div>
            <label className="block text-sm font-medium mb-2">Eligibility Criteria</label>
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium mb-2">Semester</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="e.g., 2024-1"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-coin-600 text-white rounded-lg hover:bg-coin-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Hackathon'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
```

### 3. Update Routing

Add to admin layout navigation (if exists).

### 4. Test

1. Start backend: `cd backend && cargo run`
2. Start frontend: `npm run dev`
3. Login to admin
4. Navigate to create hackathon page
5. Fill form and submit
6. Verify data appears in list and database

---

## 📚 Similar Features to Implement

Use the same pattern for:
- Edit Hackathon (PUT, pre-fill form)
- Delete Hackathon (DELETE with confirmation)
- Create Blog Post (POST with rich editor)
- Update Blog Post (PUT)
- View Submissions (GET list, add table)
- Change Submission Status (PATCH)

---

## 🧪 Testing Checklist

For each new feature:

- [ ] Form validation works
- [ ] Backend API called correctly
- [ ] Error messages displayed
- [ ] Success message shown
- [ ] Data updates in store
- [ ] Page redirects appropriately
- [ ] Token included in request headers
- [ ] Database reflects changes
- [ ] UI reflects new data without reload

---

## 📝 Resources

- Next.js Forms: https://nextjs.org/learn/dashboard-app/mutating-data
- Zustand: https://github.com/pmndrs/zustand
- Tailwind Forms: https://tailwindui.com/components/forms
- Date Input Best Practices: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
