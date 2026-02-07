# Database Migration Guide - CoIN Backend

Complete guide for managing database schema changes and migrations.

## Overview

CoIN uses **SQLx migrations** for managing database schema versions. Each migration is a timestamped SQL file that tracks changes to the database structure.

Migrations provide:
- Version control for schema
- Rollback capability
- Audit trail of changes
- Automatic execution on startup

---

## Initial Setup

### Install SQLx CLI

```bash
cargo install sqlx-cli --no-default-features --features postgres
```

### Create Database

```bash
# Via psql
psql -U postgres
CREATE DATABASE coin_srec;
\q

# Or via command line
createdb coin_srec
```

### Set DATABASE_URL

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/coin_srec"
```

### Run Initial Migrations

```bash
sqlx migrate run
```

This executes all migration files in the `migrations/` directory in sequence.

---

## Migration Files

### Initial Schema (001_initial_schema.sql)

Located at: `backend/migrations/001_initial_schema.sql`

Creates all core tables:
- **admins**: User accounts for faculty/staff
- **hackathons**: Event definitions
- **submissions**: Team participation records
- **participants**: Student information
- **mentors**: Faculty mentors
- **blog_posts**: News and announcements

**Includes:**
- Primary keys (UUIDs)
- Foreign key relationships
- Check constraints (ENUM-like validation)
- Indexes on frequently queried columns
- Timestamps with timezone support

---

## Creating New Migrations

When you need to change the schema:

### 1. Create Migration File

```bash
sqlx migrate add -r <name>
```

Options:
- `-r`: Create reversible migration (up + down)
- `-n`: Create reversible only (without down, for data migrations)

**Example:**
```bash
sqlx migrate add -r add_submission_notes
```

Creates two files:
- `migrations/<timestamp>_add_submission_notes.sql`
- `migrations/<timestamp>_add_submission_notes.down.sql`

### 2. Write Migration SQL

**UP migration (add feature):**
```sql
-- migrations/20240301120000_add_submission_notes.sql

ALTER TABLE submissions
ADD COLUMN notes TEXT,
ADD COLUMN verification_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_submissions_verification_date 
ON submissions(verification_date);
```

**DOWN migration (rollback):**
```sql
-- migrations/20240301120000_add_submission_notes.down.sql

DROP INDEX IF EXISTS idx_submissions_verification_date;

ALTER TABLE submissions
DROP COLUMN IF EXISTS verification_date,
DROP COLUMN IF EXISTS notes;
```

### 3. Test Locally

```bash
# Run new migration
sqlx migrate run

# Verify changes
psql $DATABASE_URL -c "\d submissions"

# Rollback if needed
sqlx migrate revert
```

### 4. Commit to Git

```bash
git add migrations/
git commit -m "Migration: add submission notes and verification date"
```

---

## Common Migrations

### Add Column

```sql
ALTER TABLE table_name
ADD COLUMN column_name DATA_TYPE [DEFAULT value] [NOT NULL];

-- Rollback
ALTER TABLE table_name
DROP COLUMN column_name;
```

**Example:**
```sql
-- Add category filter to submissions
ALTER TABLE submissions
ADD COLUMN category VARCHAR(50) DEFAULT 'general';
```

### Remove Column

```sql
ALTER TABLE table_name
DROP COLUMN column_name;

-- Rollback
ALTER TABLE table_name
ADD COLUMN column_name DATA_TYPE;
```

### Create Index

```sql
CREATE INDEX idx_name ON table_name(column_name);

-- Rollback
DROP INDEX IF EXISTS idx_name;
```

### Add Foreign Key

```sql
ALTER TABLE table_name
ADD CONSTRAINT fk_name 
FOREIGN KEY (column_name) 
REFERENCES other_table(id) 
ON DELETE CASCADE;

-- Rollback
ALTER TABLE table_name
DROP CONSTRAINT fk_name;
```

### Create New Table

```sql
CREATE TABLE new_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rollback
DROP TABLE IF EXISTS new_table;
```

### Add Constraint

```sql
ALTER TABLE table_name
ADD CONSTRAINT constraint_name CHECK (condition);

-- Rollback
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;
```

**Example:**
```sql
-- Ensure participant_count is positive
ALTER TABLE submissions
ADD CONSTRAINT check_participant_count CHECK (participant_count > 0);
```

### Rename Column

```sql
ALTER TABLE table_name
RENAME COLUMN old_name TO new_name;

-- Rollback
ALTER TABLE table_name
RENAME COLUMN new_name TO old_name;
```

### Change Data Type

```sql
ALTER TABLE table_name
ALTER COLUMN column_name TYPE new_type;

-- For complex conversions
ALTER TABLE table_name
ALTER COLUMN column_name TYPE new_type USING column_name::new_type;
```

---

## Migration Workflow

### Development Environment

1. **Make changes locally**
   ```bash
   cd backend
   sqlx migrate add -r feature_name
   ```

2. **Write migration SQL**
   - Edit UP and DOWN files
   - Test with `sqlx migrate run`

3. **Test rollback**
   ```bash
   sqlx migrate revert  # Go down one version
   sqlx migrate run     # Go back up
   ```

4. **Update Rust models/code** if needed

5. **Commit**
   ```bash
   git add migrations/ src/
   git commit -m "Add feature: ..."
   ```

### Production Deployment

1. **Pull latest code**
   ```bash
   git pull origin main
   cd backend
   ```

2. **Backup database**
   ```bash
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

3. **Run migrations**
   ```bash
   sqlx migrate run
   ```

4. **Verify changes**
   ```bash
   psql $DATABASE_URL -c "SELECT version FROM _sqlx_migrations;"
   ```

5. **Restart backend**
   ```bash
   systemctl restart coin-backend
   ```

6. **Test endpoints**
   ```bash
   curl http://localhost:8000/api/health
   ```

### Rollback (If Needed)

```bash
# Revert last migration
sqlx migrate revert

# Verify
psql $DATABASE_URL -c "SELECT version FROM _sqlx_migrations;"

# Restart backend
systemctl restart coin-backend
```

---

## Schema Diagram

Current tables and relationships:

```
admins (id, name, email, password_hash, created_at)
  ↓
  └─→ hackathons (id, name, ..., created_by ← FK)
        ↓
        └─→ submissions (id, hackathon_id ← FK, team_name, ...)
              ├─→ participants (id, submission_id ← FK, name, email, ...)
              └─→ mentors (id, submission_id ← FK, name, department)

blog_posts (id, title, slug, ..., related_hackathon ← FK optional)
```

---

## Data Migrations

Sometimes you need to transform data during migration.

### Example: Split Email into Username + Domain

```sql
-- UP: Add new column, populate, drop old
ALTER TABLE participants
ADD COLUMN username VARCHAR(255);

UPDATE participants 
SET username = SPLIT_PART(email, '@', 1);

ALTER TABLE participants
ALTER COLUMN username SET NOT NULL,
DROP COLUMN email;

-- DOWN: Reverse the process
ALTER TABLE participants
ADD COLUMN email VARCHAR(255);

UPDATE participants
SET email = username || '@srec.ac.in';

ALTER TABLE participants
DROP COLUMN username;
```

---

## Monitoring Migrations

### Check Migration History

```bash
psql $DATABASE_URL -c "SELECT version, success, installed_on FROM _sqlx_migrations ORDER BY installed_on;"
```

**Output:**
```
version |       success | installed_on
--------+---------------+------------------------------
1       | t             | 2024-02-01 10:00:00+00
2       | t             | 2024-02-05 14:30:00+00
```

### Check Failed Migrations

```bash
psql $DATABASE_URL -c "SELECT * FROM _sqlx_migrations WHERE success = false;"
```

If a migration failed:
1. Check error logs
2. Fix the SQL
3. Manually rollback changes if needed
4. Create a new migration to fix

### Database Size

```bash
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

---

## Best Practices

1. **Keep migrations small**
   - One logical change per migration
   - Easier to debug and rollback

2. **Write reversible migrations**
   - Always include UP and DOWN
   - Test both directions

3. **Avoid data loss**
   - Use `DROP TABLE IF EXISTS` not `DROP TABLE`
   - Backup before major changes

4. **Index for performance**
   - Add indexes on frequently queried columns
   - Especially for JOINs and WHERE clauses

5. **Name clearly**
   ```bash
   # Good
   sqlx migrate add -r add_submission_status_index
   
   # Avoid
   sqlx migrate add -r fix
   ```

6. **Test in staging first**
   - Never run untested migrations in production
   - Use identical database schema in staging

7. **Document complex migrations**
   ```sql
   -- This migration adds audit trail columns to track changes
   -- Used by the new admin dashboard reporting feature
   ```

8. **Use transactions** (SQLx does automatically)
   - Each migration runs in a transaction
   - Auto-rollbacks if any statement fails

---

## Troubleshooting

### "Migration failed" Error

```
Error: error executing query: ERROR: duplicate key value violates unique constraint
```

**Causes:**
- Data already exists
- Constraint conflicts

**Fix:**
```sql
-- Remove duplicates before adding constraint
DELETE FROM table_name 
WHERE id NOT IN (SELECT MAX(id) FROM table_name GROUP BY unique_column);
```

### "Column already exists"

```
Error: ERROR: column "name" of relation "table_name" already exists
```

**Fix:**
```sql
-- Check what exists
psql $DATABASE_URL -c "\d table_name"

-- Use IF NOT EXISTS
ALTER TABLE table_name
ADD COLUMN IF NOT EXISTS new_column VARCHAR(255);
```

### Locked Migrations

```
Error: Attempt to update schema history table failed
```

**Cause:** Another process is running a migration

**Fix:**
```bash
# Wait for other process to finish
# Or kill long-running query
psql $DATABASE_URL -c "SELECT pid, query FROM pg_stat_activity WHERE query ILIKE '%migration%';"
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid();"
```

### Syntax Errors

```
Error: Error executing query: ERROR: syntax error at or near "CREATE"
```

**Fix:**
1. Check SQL syntax carefully
2. Test in psql first
3. Look for missing semicolons

---

## Advanced Topics

### Zero-Downtime Migrations

For large tables, use safe practices:

```sql
-- Add column with default (doesn't lock long)
ALTER TABLE table_name
ADD COLUMN new_column VARCHAR(255) DEFAULT 'value';

-- Later, drop default if no longer needed
ALTER TABLE table_name
ALTER COLUMN new_column DROP DEFAULT;

-- Create index without blocking writes
CREATE INDEX CONCURRENTLY idx_name ON table_name(new_column);
```

### Partitioning (Advanced)

For very large tables:

```sql
-- Partition submissions by hackathon_id
CREATE TABLE submissions_partitioned (
    id UUID,
    hackathon_id UUID,
    ...
) PARTITION BY LIST (hackathon_id);

-- Migrate data, drop old table
ALTER TABLE submissions RENAME TO submissions_old;
ALTER TABLE submissions_partitioned RENAME TO submissions;
DROP TABLE submissions_old;
```

---

## Version Control

All migrations are tracked in Git:

```bash
# View migration history
git log migrations/

# See what changed
git show HEAD:migrations/001_initial_schema.sql

# Revert a migration commit
git revert <commit-hash>
```

---

## Emergency Procedures

### Restore from Backup

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Verify
psql $DATABASE_URL -c "SELECT COUNT(*) FROM hackathons;"
```

### Reset Database (Development Only)

```bash
# Drop and recreate
dropdb coin_srec
createdb coin_srec

# Re-run all migrations
sqlx migrate run
```

### Manual Schema Fix

```bash
# Connect directly
psql $DATABASE_URL

-- View migrations
SELECT * FROM _sqlx_migrations;

-- Manually update if needed (careful!)
UPDATE _sqlx_migrations SET success = true WHERE version = 2;
```

---

## Migration Checklist

Before deploying a migration:

- [ ] Migration written and tested locally
- [ ] UP and DOWN migrations both work
- [ ] Data backup created
- [ ] New Rust code handles schema changes
- [ ] Code review completed
- [ ] Tested in staging environment
- [ ] No long locks expected (< 1 second)
- [ ] Rollback plan documented
- [ ] Team notified of maintenance window (if needed)

---

## Resources

- [SQLx Migrations Docs](https://github.com/launchbadge/sqlx/tree/main/sqlx-cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Best Practices](https://wiki.postgresql.org/wiki/Performance_Optimization)
