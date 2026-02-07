-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
    branch VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Student skills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL,
    UNIQUE(student_id, skill)
);

-- Indexes
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_branch ON students(branch);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_student_skills_student_id ON student_skills(student_id);
