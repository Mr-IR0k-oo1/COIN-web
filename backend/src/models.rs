use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// Admin
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Admin {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
}

// Hackathon
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "UPPERCASE")]
pub enum HackathonMode {
    Online,
    Offline,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "UPPERCASE")]
pub enum HackathonStatus {
    Upcoming,
    Ongoing,
    Closed,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Hackathon {
    pub id: Uuid,
    pub name: String,
    pub organizer: String,
    pub description: String,
    pub mode: String, // ONLINE or OFFLINE
    pub location: Option<String>,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub registration_deadline: DateTime<Utc>,
    pub official_registration_link: String,
    pub eligibility: String,
    pub status: String, // UPCOMING, ONGOING, CLOSED
    pub semester: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub created_by: Uuid,
}

#[derive(Debug, Deserialize)]
pub struct CreateHackathonRequest {
    pub name: String,
    pub organizer: String,
    pub description: String,
    pub mode: String,
    pub location: Option<String>,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub registration_deadline: DateTime<Utc>,
    pub official_registration_link: String,
    pub eligibility: String,
    pub semester: String,
    pub status: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateHackathonRequest {
    pub name: Option<String>,
    pub organizer: Option<String>,
    pub description: Option<String>,
    pub mode: Option<String>,
    pub location: Option<String>,
    pub start_date: Option<DateTime<Utc>>,
    pub end_date: Option<DateTime<Utc>>,
    pub registration_deadline: Option<DateTime<Utc>>,
    pub official_registration_link: Option<String>,
    pub eligibility: Option<String>,
    pub semester: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateStatusRequest {
    pub status: String,
}

// Submission
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum SubmissionStatus {
    Submitted,
    Verified,
    Archived,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Submission {
    pub id: Uuid,
    pub hackathon_id: Uuid,
    pub team_name: String,
    pub participant_count: i32,
    pub mentor_count: i32,
    pub external_registration_confirmed: bool,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct ParticipantInput {
    pub name: String,
    pub email: String,
    pub department: String,
    pub academic_year: String,
}

#[derive(Debug, Deserialize)]
pub struct MentorInput {
    pub name: String,
    pub department: String,
}

#[derive(Debug, Deserialize)]
pub struct SubmitParticipationRequest {
    pub hackathon_id: String,
    pub team_name: String,
    pub external_registration_confirmed: bool,
    pub participants: Vec<ParticipantInput>,
    pub mentors: Vec<MentorInput>,
}

// Participant
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Participant {
    pub id: Uuid,
    pub submission_id: Uuid,
    pub name: String,
    pub email: String,
    pub department: String,
    pub academic_year: String,
}

// Mentor
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Mentor {
    pub id: Uuid,
    pub submission_id: Uuid,
    pub name: String,
    pub department: String,
}

// Blog Post
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum BlogCategory {
    Article,
    Winner,
    Announcement,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum BlogStatus {
    Draft,
    Published,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct BlogPost {
    pub id: Uuid,
    pub title: String,
    pub slug: String,
    pub summary: String,
    pub content: String,
    pub category: String,
    pub author: String,
    pub related_hackathon: Option<Uuid>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBlogPostRequest {
    pub title: String,
    pub summary: String,
    pub content: String,
    pub category: String,
    pub author: String,
    pub related_hackathon: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateBlogPostRequest {
    pub title: Option<String>,
    pub summary: Option<String>,
    pub content: Option<String>,
    pub category: Option<String>,
    pub author: Option<String>,
    pub related_hackathon: Option<String>,
    pub status: Option<String>,
}

// Metrics
#[derive(Debug, Serialize)]
pub struct Metrics {
    pub total_hackathons: i64,
    pub total_submissions: i64,
    pub total_students: i64,
    pub total_mentors: i64,
}

// Auth
#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub admin: AdminResponse,
}

#[derive(Debug, Serialize)]
pub struct AdminResponse {
    pub id: String,
    pub name: String,
    pub email: String,
}

// JWT Claims
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub email: String,
    pub exp: i64,
}

// Submission with relations (for export/view)
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct SubmissionDetail {
    pub submission_id: Uuid,
    pub submitted_at: DateTime<Utc>,
    pub semester: String,
    pub hackathon_name: String,
    pub team_name: String,
    pub participant_count: i32,
    pub mentor_count: i32,
    pub participant_name: Option<String>,
    pub participant_email: Option<String>,
    pub participant_department: Option<String>,
    pub participant_year: Option<String>,
    pub mentor_names: Option<String>,
    pub mentor_departments: Option<String>,
    pub external_confirmed: bool,
    pub status: String,
}
