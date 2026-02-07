-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Hackathons table
CREATE TABLE IF NOT EXISTS hackathons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    mode VARCHAR(50) NOT NULL CHECK (mode IN ('ONLINE', 'OFFLINE')),
    location VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    official_registration_link VARCHAR(255) NOT NULL,
    eligibility TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ONGOING', 'CLOSED')),
    semester VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hackathon_id UUID NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    participant_count INTEGER NOT NULL CHECK (participant_count > 0),
    mentor_count INTEGER NOT NULL DEFAULT 0 CHECK (mentor_count >= 0),
    external_registration_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL
);

-- Mentors table
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('article', 'winner', 'announcement')),
    author VARCHAR(255) NOT NULL,
    related_hackathon UUID REFERENCES hackathons(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_hackathons_status ON hackathons(status);
CREATE INDEX idx_hackathons_semester ON hackathons(semester);
CREATE INDEX idx_submissions_hackathon ON submissions(hackathon_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_participants_submission ON participants(submission_id);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_mentors_submission ON mentors(submission_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
