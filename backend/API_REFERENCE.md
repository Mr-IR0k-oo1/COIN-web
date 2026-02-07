# CoIN Backend - API Reference

## Overview

All API endpoints are available at `http://localhost:8000/api` (development) or your production domain.

**Content-Type**: All requests and responses use `application/json` unless otherwise noted.

**Authentication**: Admin endpoints require JWT token in `Authorization: Bearer <token>` header.

## Error Response Format

```json
{
  "error": "Error message description",
  "status": 400
}
```

## Public Endpoints

### Health Check
```http
GET /api/health

Response 200:
{
  "status": "ok"
}
```

---

## Hackathons

### List Hackathons
```http
GET /api/hackathons?page=1&limit=10

Query Parameters:
  page    (optional): Page number (default: 1)
  limit   (optional): Items per page (default: 10, max: 100)

Response 200:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "CodeFest 2024",
      "organizer": "CSE Department",
      "description": "Annual hackathon for students",
      "mode": "ONLINE",
      "location": null,
      "start_date": "2024-03-01T09:00:00Z",
      "end_date": "2024-03-02T18:00:00Z",
      "registration_deadline": "2024-02-25T23:59:59Z",
      "official_registration_link": "https://example.com/register",
      "eligibility": "All SREC students",
      "status": "UPCOMING",
      "semester": "2024-1",
      "created_at": "2024-02-01T10:00:00Z",
      "updated_at": "2024-02-01T10:00:00Z",
      "created_by": "550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### Get Hackathon
```http
GET /api/hackathons/:id

Path Parameters:
  id: Hackathon UUID

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "CodeFest 2024",
  ...
}

Response 404:
{
  "error": "Hackathon not found",
  "status": 404
}
```

---

## Blog Posts

### List Blog Posts
```http
GET /api/blog?page=1&limit=10

Query Parameters:
  page  (optional): Page number (default: 1)
  limit (optional): Items per page (default: 10, max: 100)

Returns only published posts.

Response 200:
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "CodeFest 2024 Winners Announced",
      "slug": "codefest-2024-winners-announced",
      "summary": "Celebrating the winners of our hackathon",
      "content": "Long form content...",
      "category": "winner",
      "author": "Admin Name",
      "related_hackathon": "550e8400-e29b-41d4-a716-446655440000",
      "status": "published",
      "created_at": "2024-03-05T10:00:00Z",
      "updated_at": "2024-03-05T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

### Get Blog Post
```http
GET /api/blog/:slug

Path Parameters:
  slug: Unique blog post slug

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "CodeFest 2024 Winners Announced",
  ...
}

Response 404:
{
  "error": "Blog post not found",
  "status": 404
}
```

---

## Student Submission

### Submit Participation
```http
POST /api/submit
Content-Type: application/json

Request Body:
{
  "hackathon_id": "550e8400-e29b-41d4-a716-446655440000",
  "team_name": "Team Alpha",
  "external_registration_confirmed": true,
  "participants": [
    {
      "name": "John Doe",
      "email": "john@srec.ac.in",
      "department": "Computer Science and Engineering",
      "academic_year": "3rd"
    },
    {
      "name": "Jane Smith",
      "email": "jane@srec.ac.in",
      "department": "Electronics and Communication Engineering",
      "academic_year": "2nd"
    }
  ],
  "mentors": [
    {
      "name": "Dr. Robert Johnson",
      "department": "Computer Science and Engineering"
    }
  ]
}

Response 201:
{
  "submission_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "submitted"
}

Response 400:
{
  "error": "Email must end with @srec.ac.in",
  "status": 400
}

Response 404:
{
  "error": "Hackathon not found",
  "status": 404
}
```

**Validation Rules:**
- `hackathon_id`: Must be valid UUID of existing hackathon
- `hackathon.status`: Must not be "CLOSED"
- `external_registration_confirmed`: Must be `true`
- `team_name`: Must not be empty
- `participants`: Minimum 1 required
  - `email`: Must end with `@srec.ac.in`
  - All emails must be unique
  - All required fields mandatory
- `mentors`: Can be empty array

---

## Admin Endpoints

All admin endpoints require JWT authentication:
```http
Authorization: Bearer <jwt_token>
```

### Login
```http
POST /api/admin/login
Content-Type: application/json

Request Body:
{
  "email": "admin@srec.ac.in",
  "password": "password"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin Name",
    "email": "admin@srec.ac.in"
  }
}

Response 401:
{
  "error": "Invalid credentials",
  "status": 401
}
```

Token expiration: 24 hours

---

## Hackathon Management (Admin)

### Create Hackathon
```http
POST /api/admin/hackathons
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "CodeFest 2024",
  "organizer": "CSE Department",
  "description": "Annual hackathon for all students",
  "mode": "ONLINE",
  "location": null,
  "start_date": "2024-03-01T09:00:00Z",
  "end_date": "2024-03-02T18:00:00Z",
  "registration_deadline": "2024-02-25T23:59:59Z",
  "official_registration_link": "https://example.com/register",
  "eligibility": "All SREC students, min 2nd year",
  "semester": "2024-1"
}

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "CodeFest 2024",
  "status": "UPCOMING",
  ...
}
```

### List Hackathons (Admin)
```http
GET /api/admin/hackathons
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "CodeFest 2024",
    ...
  }
]
```

### Update Hackathon
```http
PUT /api/admin/hackathons/:id
Authorization: Bearer <token>
Content-Type: application/json

Path Parameters:
  id: Hackathon UUID

Request Body (all fields optional):
{
  "name": "CodeFest 2024 - Updated",
  "description": "Updated description",
  "status": "ONGOING"
}

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  ...
}
```

### Update Hackathon Status
```http
PATCH /api/admin/hackathons/:id/status
Authorization: Bearer <token>
Content-Type: application/json

Path Parameters:
  id: Hackathon UUID

Request Body:
{
  "status": "CLOSED"
}

Valid statuses: UPCOMING, ONGOING, CLOSED

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "CLOSED",
  ...
}
```

---

## Submission Management (Admin)

### List Submissions
```http
GET /api/admin/submissions?hackathon_id=&status=&semester=
Authorization: Bearer <token>

Query Parameters (all optional):
  hackathon_id: Filter by hackathon UUID
  status: Filter by status (submitted, verified, archived)
  semester: Filter by semester (in related hackathon)

Response 200:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "hackathon_id": "550e8400-e29b-41d4-a716-446655440000",
    "team_name": "Team Alpha",
    "participant_count": 2,
    "mentor_count": 1,
    "external_registration_confirmed": true,
    "status": "submitted",
    "created_at": "2024-02-28T15:30:00Z"
  }
]
```

### Get Submission Details
```http
GET /api/admin/submissions/:id
Authorization: Bearer <token>

Path Parameters:
  id: Submission UUID

Response 200:
{
  "submission": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "hackathon_id": "550e8400-e29b-41d4-a716-446655440000",
    "team_name": "Team Alpha",
    "participant_count": 2,
    "mentor_count": 1,
    "status": "submitted",
    "created_at": "2024-02-28T15:30:00Z"
  },
  "participants": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "submission_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@srec.ac.in",
      "department": "CSE",
      "academic_year": "3rd"
    }
  ],
  "mentors": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "submission_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Dr. Johnson",
      "department": "CSE"
    }
  ]
}
```

### Update Submission Status
```http
PATCH /api/admin/submissions/:id/status
Authorization: Bearer <token>
Content-Type: application/json

Path Parameters:
  id: Submission UUID

Request Body:
{
  "status": "verified"
}

Valid statuses: submitted, verified, archived

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "verified",
  ...
}
```

---

## Blog Management (Admin)

### Create Blog Post
```http
POST /api/admin/blog
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "CodeFest 2024 Winners Announced",
  "summary": "Celebrating the winners of our hackathon",
  "content": "Long form article content here...",
  "category": "winner",
  "author": "Admin Name",
  "related_hackathon": "550e8400-e29b-41d4-a716-446655440000"
}

Valid categories: article, winner, announcement

Response 201:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "CodeFest 2024 Winners Announced",
  "slug": "codefest-2024-winners-announced",
  "status": "draft",
  ...
}
```

### Update Blog Post
```http
PUT /api/admin/blog/:id
Authorization: Bearer <token>
Content-Type: application/json

Path Parameters:
  id: Blog post UUID

Request Body (all fields optional):
{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "published"
}

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated Title",
  "status": "published",
  ...
}
```

### Delete Blog Post
```http
DELETE /api/admin/blog/:id
Authorization: Bearer <token>

Path Parameters:
  id: Blog post UUID

Response 204: (No Content)
```

---

## Metrics (Admin)

### Get Metrics
```http
GET /api/admin/metrics
Authorization: Bearer <token>

Response 200:
{
  "total_hackathons": 5,
  "total_submissions": 42,
  "total_students": 128,
  "total_mentors": 16
}
```

---

## Export (Admin)

### Export Data
```http
GET /api/admin/export?semester=&hackathon_id=&department=&format=csv
Authorization: Bearer <token>

Query Parameters (all optional):
  semester:      Filter by semester (e.g., "2024-1")
  hackathon_id:  Filter by hackathon UUID
  department:    Filter by participant department
  format:        'csv' or 'xlsx' (default: csv)

Response 200:
Binary file content (CSV or XLSX)
Content-Type: text/csv or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

CSV Columns:
  submission_id
  submitted_at
  semester
  hackathon_name
  team_name
  participant_count
  mentor_count
  participant_name
  participant_email
  participant_department
  participant_year
  mentor_names
  mentor_departments
  external_confirmed
  status
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- Login endpoint: 5 requests per minute per IP
- General endpoints: 60 requests per minute per IP

---

## CORS Policy

Frontend domain must be configured in `CorsLayer` configuration.

Default (development): Permissive (allow all origins)

Production configuration:
```rust
CorsLayer::very_permissive()
  .allow_origin("https://coin.srec.ac.in".parse()?)
```

---

## Webhook Events

Not currently implemented. Future feature candidates:
- Submission created/updated
- Hackathon status changed
- Blog post published

---

## Pagination

List endpoints support pagination with:
- `page`: 1-indexed page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

---

## Version History

### v1.0.0 (Current)
- Initial release
- All core endpoints implemented
- JWT authentication
- CSV/XLSX export
- Student submission validation
