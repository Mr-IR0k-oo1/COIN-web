-- Add slug column to hackathons table
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Create index for slug-based queries
CREATE INDEX IF NOT EXISTS idx_hackathons_slug ON hackathons(slug);
