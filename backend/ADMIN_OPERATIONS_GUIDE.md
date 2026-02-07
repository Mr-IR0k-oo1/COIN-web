# Admin Operations Guide - CoIN Backend

Comprehensive guide for SREC admins operating the CoIN backend.

## Quick Start

### Prerequisites
- Backend running at `http://localhost:8000` (or your production domain)
- Admin credentials (email + password)
- `curl` or Postman for API calls

### First Login

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@srec.ac.in",
    "password": "changeme"
  }' | jq -r '.token')

echo $TOKEN
```

Save the token for subsequent requests:
```bash
export AUTH_TOKEN="your-jwt-token-here"
```

Use in all admin requests:
```bash
curl -H "Authorization: Bearer $AUTH_TOKEN" \
  http://localhost:8000/api/admin/...
```

---

## Hackathon Management

### Create New Hackathon

```bash
curl -X POST http://localhost:8000/api/admin/hackathons \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CodeFest 2024",
    "organizer": "CSE Department",
    "description": "Annual hackathon for engineering students. Open to all departments.",
    "mode": "ONLINE",
    "location": null,
    "start_date": "2024-03-01T09:00:00Z",
    "end_date": "2024-03-02T18:00:00Z",
    "registration_deadline": "2024-02-25T23:59:59Z",
    "official_registration_link": "https://example.com/register-codefest",
    "eligibility": "All SREC students (2nd year and above)",
    "semester": "2024-1"
  }'
```

**Field Descriptions:**
- **name**: Event title (max 255 chars)
- **organizer**: Department/organization name
- **description**: Detailed event description (supports markdown)
- **mode**: `ONLINE` or `OFFLINE`
- **location**: Venue (optional if ONLINE)
- **start_date** / **end_date**: ISO 8601 format with timezone
- **registration_deadline**: When external registration closes
- **official_registration_link**: Link to external registration (must be valid URL)
- **eligibility**: Who can participate
- **semester**: Semester identifier (e.g., "2024-1", "2024-2")

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "CodeFest 2024",
  "status": "UPCOMING",
  ...
}
```

Save the `id` for future updates.

---

### List All Hackathons

```bash
curl -X GET http://localhost:8000/api/admin/hackathons \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

Returns all hackathons (public and admin view).

---

### Update Hackathon Details

```bash
HACKATHON_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X PUT http://localhost:8000/api/admin/hackathons/$HACKATHON_ID \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CodeFest 2024 - Extended Edition",
    "end_date": "2024-03-03T18:00:00Z",
    "eligibility": "All SREC students (1st year and above)"
  }'
```

**Note:** All fields are optional. Only changed fields need to be sent.

---

### Change Hackathon Status

Statuses: `UPCOMING` → `ONGOING` → `CLOSED`

```bash
HACKATHON_ID="550e8400-e29b-41d4-a716-446655440000"

# Open for participation
curl -X PATCH http://localhost:8000/api/admin/hackathons/$HACKATHON_ID/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ONGOING"}'

# Close registrations
curl -X PATCH http://localhost:8000/api/admin/hackathons/$HACKATHON_ID/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CLOSED"}'
```

**Important:** Once `CLOSED`, students cannot submit new participations.

---

## Submission Management

### View Submissions

#### All Submissions
```bash
curl -X GET http://localhost:8000/api/admin/submissions \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

#### Filter by Hackathon
```bash
HACKATHON_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X GET "http://localhost:8000/api/admin/submissions?hackathon_id=$HACKATHON_ID" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

#### Filter by Status
```bash
curl -X GET "http://localhost:8000/api/admin/submissions?status=submitted" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

Valid statuses: `submitted`, `verified`, `archived`

#### Filter by Semester
```bash
curl -X GET "http://localhost:8000/api/admin/submissions?semester=2024-1" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

#### Multiple Filters
```bash
curl -X GET "http://localhost:8000/api/admin/submissions?hackathon_id=$HACKATHON_ID&status=submitted&semester=2024-1" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

---

### Get Submission Details

View full submission with participants and mentors:

```bash
SUBMISSION_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X GET http://localhost:8000/api/admin/submissions/$SUBMISSION_ID \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Response:**
```json
{
  "submission": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "hackathon_id": "550e8400-e29b-41d4-a716-446655440000",
    "team_name": "Team Alpha",
    "participant_count": 2,
    "mentor_count": 1,
    "external_registration_confirmed": true,
    "status": "submitted",
    "created_at": "2024-02-28T15:30:00Z"
  },
  "participants": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@srec.ac.in",
      "department": "Computer Science and Engineering",
      "academic_year": "3rd"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Smith",
      "email": "jane@srec.ac.in",
      "department": "Electronics and Communication Engineering",
      "academic_year": "2nd"
    }
  ],
  "mentors": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Dr. Robert Johnson",
      "department": "Computer Science and Engineering"
    }
  ]
}
```

---

### Update Submission Status

Typical workflow:
1. **submitted**: Initial state when team submits
2. **verified**: Admin reviews and confirms valid submission
3. **archived**: Event ended, submission archived

```bash
SUBMISSION_ID="550e8400-e29b-41d4-a716-446655440000"

# Mark as verified (team confirmed valid)
curl -X PATCH http://localhost:8000/api/admin/submissions/$SUBMISSION_ID/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "verified"}'

# Archive after event
curl -X PATCH http://localhost:8000/api/admin/submissions/$SUBMISSION_ID/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "archived"}'
```

---

## Blog Management

### Create Blog Post

```bash
HACKATHON_ID="550e8400-e29b-41d4-a716-446655440000"  # optional

curl -X POST http://localhost:8000/api/admin/blog \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "CodeFest 2024 Winners Announced!",
    "summary": "Celebrating the incredible solutions from this years hackathon",
    "content": "Full article content in markdown...",
    "category": "winner",
    "author": "Dr. Admin Name",
    "related_hackathon": "'$HACKATHON_ID'"
  }'
```

**Categories:**
- `article`: General news/updates
- `winner`: Winning team announcements
- `announcement`: Important announcements

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "CodeFest 2024 Winners Announced!",
  "slug": "codefest-2024-winners-announced",
  "status": "draft",
  ...
}
```

Slug is auto-generated from title. Post is created as **draft** (not visible publicly).

---

### Publish Blog Post

```bash
POST_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X PUT http://localhost:8000/api/admin/blog/$POST_ID \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

Only **published** posts appear on the public blog page.

---

### Update Blog Post

```bash
POST_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X PUT http://localhost:8000/api/admin/blog/$POST_ID \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "CodeFest 2024 Winners Announced - Final Results!",
    "content": "Updated article content...",
    "category": "announcement"
  }'
```

---

### Delete Blog Post

```bash
POST_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X DELETE http://localhost:8000/api/admin/blog/$POST_ID \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

Returns `204 No Content` on success.

---

## Reporting & Analytics

### View Metrics

Quick overview of platform usage:

```bash
curl -X GET http://localhost:8000/api/admin/metrics \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Response:**
```json
{
  "total_hackathons": 5,
  "total_submissions": 42,
  "total_students": 128,
  "total_mentors": 16
}
```

---

### Export Submissions

Export detailed submission data for reporting/analysis.

#### Export All as CSV
```bash
curl -X GET http://localhost:8000/api/admin/export?format=csv \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -o all_submissions.csv
```

#### Export Specific Hackathon
```bash
HACKATHON_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X GET "http://localhost:8000/api/admin/export?hackathon_id=$HACKATHON_ID&format=csv" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -o codefest_submissions.csv
```

#### Export by Semester
```bash
curl -X GET "http://localhost:8000/api/admin/export?semester=2024-1&format=csv" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -o semester_2024_1.csv
```

#### Export by Department
```bash
curl -X GET "http://localhost:8000/api/admin/export?department=CSE&format=csv" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -o cse_submissions.csv
```

#### Export with Multiple Filters
```bash
curl -X GET "http://localhost:8000/api/admin/export?semester=2024-1&department=ECE&format=csv" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -o semester_2024_1_ece.csv
```

**Export Columns:**
- submission_id
- submitted_at
- semester
- hackathon_name
- team_name
- participant_count
- mentor_count
- participant_name (one row per participant)
- participant_email
- participant_department
- participant_year
- mentor_names
- mentor_departments
- external_confirmed
- status

**Note:** Each participant gets a separate row. Use a spreadsheet to aggregate.

---

## Workflow Examples

### Organizing a Hackathon - Step by Step

#### 1. Create Hackathon (3 weeks before)
```bash
curl -X POST http://localhost:8000/api/admin/hackathons \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "WebDev Challenge 2024",
    "organizer": "CSE Department",
    "description": "Build innovative web applications using modern technologies",
    "mode": "ONLINE",
    "start_date": "2024-04-15T09:00:00Z",
    "end_date": "2024-04-16T18:00:00Z",
    "registration_deadline": "2024-04-10T23:59:59Z",
    "official_registration_link": "https://forms.gle/...",
    "eligibility": "All SREC students",
    "semester": "2024-2"
  }'
```

Save the returned `id`.

#### 2. Publish Announcement (2 weeks before)
```bash
HACKATHON_ID="..." # from step 1

curl -X POST http://localhost:8000/api/admin/blog \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "WebDev Challenge 2024 Announced!",
    "summary": "Register now for our exciting hackathon",
    "content": "Details about the event...",
    "category": "announcement",
    "author": "CSE Coordinator",
    "related_hackathon": "'$HACKATHON_ID'"
  }' | jq -r '.id' > blog_post_id.txt

# Publish immediately
curl -X PUT http://localhost:8000/api/admin/blog/$(cat blog_post_id.txt) \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

#### 3. Open Registrations (1 day before)
Change hackathon status to ONGOING:
```bash
curl -X PATCH http://localhost:8000/api/admin/hackathons/$HACKATHON_ID/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ONGOING"}'
```

#### 4. Monitor Submissions (During event)
Check real-time metrics:
```bash
watch -n 60 'curl -s -X GET http://localhost:8000/api/admin/submissions \
  -H "Authorization: Bearer $AUTH_TOKEN" | jq ". | length"'
```

Or check specific hackathon:
```bash
curl -X GET "http://localhost:8000/api/admin/submissions?hackathon_id=$HACKATHON_ID" \
  -H "Authorization: Bearer $AUTH_TOKEN" | jq '.[] | {team_name, participant_count}'
```

#### 5. Verify Submissions (After event)
Review and mark as verified:
```bash
curl -X GET "http://localhost:8000/api/admin/submissions?hackathon_id=$HACKATHON_ID&status=submitted" \
  -H "Authorization: Bearer $AUTH_TOKEN" | jq '.[] | {id, team_name}' > submissions_to_verify.json

# For each submission:
SUBMISSION_ID="..."
curl -X PATCH http://localhost:8000/api/admin/submissions/$SUBMISSION_ID/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "verified"}'
```

#### 6. Announce Winners (1 day after)
```bash
WINNER_SUBMISSION_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X POST http://localhost:8000/api/admin/blog \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "WebDev Challenge 2024 - Winners!",
    "summary": "Congratulations to the winning teams!",
    "content": "## Grand Prize: Team Alpha\n\nAmazing project!",
    "category": "winner",
    "author": "CSE Coordinator",
    "related_hackathon": "'$HACKATHON_ID'"
  }' | jq -r '.id' > winner_post.txt

# Publish immediately
curl -X PUT http://localhost:8000/api/admin/blog/$(cat winner_post.txt) \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

#### 7. Close & Archive (Week after)
Close hackathon:
```bash
curl -X PATCH http://localhost:8000/api/admin/hackathons/$HACKATHON_ID/status \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CLOSED"}'
```

Export final data:
```bash
curl -X GET "http://localhost:8000/api/admin/export?hackathon_id=$HACKATHON_ID&format=csv" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -o webdev_2024_final_report.csv
```

Archive submissions:
```bash
curl -X GET "http://localhost:8000/api/admin/submissions?hackathon_id=$HACKATHON_ID&status=verified" \
  -H "Authorization: Bearer $AUTH_TOKEN" | jq -r '.[].id' | while read id; do
  curl -X PATCH http://localhost:8000/api/admin/submissions/$id/status \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status": "archived"}'
done
```

---

## Troubleshooting

### "Invalid credentials" on login
- Check email and password
- Ensure backend is running: `curl http://localhost:8000/api/health`

### "Missing authorization header" on admin endpoints
- Ensure token is in request: `Authorization: Bearer <token>`
- Token expires after 24 hours - get a new one via login

### Cannot submit registration
- Hackathon status must not be "CLOSED"
- All participant emails must end with @srec.ac.in
- No duplicate participant emails allowed

### CSV export file is empty
- Check if submissions exist for filters used
- Try export without filters: `?format=csv`
- Verify hackathon_id format (must be valid UUID)

---

## Best Practices

1. **Regular Backups**: Export data periodically
2. **Status Management**: Use CLOSED status to prevent accidental submissions
3. **Draft Posts**: Always draft and review before publishing
4. **Clear Descriptions**: Detailed hackathon descriptions improve participation
5. **Timely Updates**: Announce results quickly while interest is high
6. **Export Records**: Keep CSV exports for compliance/reporting

---

## API Rate Limits

Not currently enforced, but recommended:
- Login: 5 requests/minute per IP
- General: 60 requests/minute per IP

---

## Support

For issues:
1. Check logs: `journalctl -u coin-backend -f`
2. Verify database connection
3. Ensure `.env` variables are correct
4. Restart backend if needed: `systemctl restart coin-backend`
