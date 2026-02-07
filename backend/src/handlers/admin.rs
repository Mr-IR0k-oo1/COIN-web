use crate::auth::{create_jwt, hash_password, verify_password};
use crate::error::{AppError, AppResult};
use crate::models::*;
use crate::utils::generate_slug;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use serde_json::json;
use sqlx::Row;
use uuid::Uuid;

use crate::AppState;

// Login handler
pub async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginRequest>,
) -> AppResult<Json<LoginResponse>> {
    // Find admin by email
    let admin: Admin = sqlx::query_as("SELECT * FROM admins WHERE email = $1")
        .bind(&req.email)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::Unauthorized("Invalid credentials".to_string()))?;

    // Verify password
    if !verify_password(&req.password, &admin.password_hash)? {
        return Err(AppError::Unauthorized("Invalid credentials".to_string()));
    }

    // Create JWT token
    let token = create_jwt(&admin.id.to_string(), &admin.email, &state.jwt_secret)?;

    Ok(Json(LoginResponse {
        token,
        admin: AdminResponse {
            id: admin.id.to_string(),
            name: admin.name,
            email: admin.email,
        },
    }))
}

// Hackathon handlers
pub async fn create_hackathon(
    State(state): State<AppState>,
    Json(req): Json<CreateHackathonRequest>,
) -> AppResult<(StatusCode, Json<Hackathon>)> {
    let id = Uuid::new_v4();
    let created_by = Uuid::new_v4(); // TODO: Extract from JWT

    let hackathon = sqlx::query_as::<_, Hackathon>(
        "INSERT INTO hackathons (id, name, organizer, description, mode, location, start_date, end_date, registration_deadline, official_registration_link, eligibility, status, semester, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *"
    )
    .bind(&id)
    .bind(&req.name)
    .bind(&req.organizer)
    .bind(&req.description)
    .bind(&req.mode)
    .bind(&req.location)
    .bind(&req.start_date)
    .bind(&req.end_date)
    .bind(&req.registration_deadline)
    .bind(&req.official_registration_link)
    .bind(&req.eligibility)
    .bind(req.status.as_deref().unwrap_or("UPCOMING"))
    .bind(&req.semester)
    .bind(&created_by)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(hackathon)))
}

pub async fn list_hackathons_admin(
    State(state): State<AppState>,
) -> AppResult<Json<Vec<Hackathon>>> {
    let hackathons: Vec<Hackathon> =
        sqlx::query_as("SELECT * FROM hackathons ORDER BY created_at DESC")
            .fetch_all(&state.db)
            .await?;

    Ok(Json(hackathons))
}

pub async fn update_hackathon(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(req): Json<UpdateHackathonRequest>,
) -> AppResult<Json<Hackathon>> {
    let hackathon_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?;

    // Verify hackathon exists
    let _: (String,) = sqlx::query_as("SELECT id::text FROM hackathons WHERE id = $1")
        .bind(hackathon_id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound("Hackathon not found".to_string()))?;

    let hackathon: Hackathon = sqlx::query_as(
        "UPDATE hackathons SET 
            name = COALESCE($2, name),
            organizer = COALESCE($3, organizer),
            description = COALESCE($4, description),
            mode = COALESCE($5, mode),
            location = COALESCE($6, location),
            start_date = COALESCE($7, start_date),
            end_date = COALESCE($8, end_date),
            registration_deadline = COALESCE($9, registration_deadline),
            official_registration_link = COALESCE($10, official_registration_link),
            eligibility = COALESCE($11, eligibility),
            semester = COALESCE($12, semester),
            updated_at = NOW()
         WHERE id = $1
         RETURNING *"
    )
    .bind(hackathon_id)
    .bind(&req.name)
    .bind(&req.organizer)
    .bind(&req.description)
    .bind(&req.mode)
    .bind(&req.location)
    .bind(&req.start_date)
    .bind(&req.end_date)
    .bind(&req.registration_deadline)
    .bind(&req.official_registration_link)
    .bind(&req.eligibility)
    .bind(&req.semester)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(hackathon))
}

pub async fn update_hackathon_status(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(req): Json<UpdateStatusRequest>,
) -> AppResult<Json<Hackathon>> {
    let hackathon_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?;

    let hackathon: Hackathon = sqlx::query_as(
        "UPDATE hackathons SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *",
    )
    .bind(hackathon_id)
    .bind(&req.status)
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::NotFound("Hackathon not found".to_string()))?;

    Ok(Json(hackathon))
}

pub async fn delete_hackathon(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> AppResult<StatusCode> {
    let hackathon_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?;

    let result = sqlx::query("DELETE FROM hackathons WHERE id = $1")
        .bind(hackathon_id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("Hackathon not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

// Submission handlers
#[derive(Deserialize)]
pub struct SubmissionQuery {
    pub hackathon_id: Option<String>,
    pub status: Option<String>,
    pub semester: Option<String>,
}

pub async fn list_submissions(
    State(state): State<AppState>,
    Query(query): Query<SubmissionQuery>,
) -> AppResult<Json<Vec<Submission>>> {
    let mut sql = "SELECT * FROM submissions WHERE 1=1".to_string();
    let mut count = 1;

    if query.hackathon_id.is_some() {
        count += 1;
        sql.push_str(&format!(" AND hackathon_id = ${}", count));
    }

    if query.status.is_some() {
        count += 1;
        sql.push_str(&format!(" AND status = ${}", count));
    }

    sql.push_str(" ORDER BY created_at DESC");

    let mut q = sqlx::query_as::<_, Submission>(&sql);

    if let Some(hid) = &query.hackathon_id {
        q = q.bind(Uuid::parse_str(hid)
            .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?);
    }

    if let Some(status) = &query.status {
        q = q.bind(status);
    }

    let submissions = q.fetch_all(&state.db).await?;

    Ok(Json(submissions))
}

pub async fn get_submission(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> AppResult<Json<serde_json::Value>> {
    let submission_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid submission ID".to_string()))?;

    let submission: Submission = sqlx::query_as("SELECT * FROM submissions WHERE id = $1")
        .bind(submission_id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound("Submission not found".to_string()))?;

    let participants: Vec<Participant> =
        sqlx::query_as("SELECT * FROM participants WHERE submission_id = $1")
            .bind(submission_id)
            .fetch_all(&state.db)
            .await?;

    let mentors: Vec<Mentor> = sqlx::query_as("SELECT * FROM mentors WHERE submission_id = $1")
        .bind(submission_id)
        .fetch_all(&state.db)
        .await?;

    Ok(Json(json!({
        "submission": submission,
        "participants": participants,
        "mentors": mentors
    })))
}

pub async fn update_submission_status(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(req): Json<UpdateStatusRequest>,
) -> AppResult<Json<Submission>> {
    let submission_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid submission ID".to_string()))?;

    let submission: Submission = sqlx::query_as(
        "UPDATE submissions SET status = $2 WHERE id = $1 RETURNING *",
    )
    .bind(submission_id)
    .bind(&req.status)
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::NotFound("Submission not found".to_string()))?;

    Ok(Json(submission))
}

pub async fn delete_submission(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> AppResult<StatusCode> {
    let submission_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid submission ID".to_string()))?;

    let result = sqlx::query("DELETE FROM submissions WHERE id = $1")
        .bind(submission_id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("Submission not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

// Blog handlers
pub async fn create_blog_post(
    State(state): State<AppState>,
    Json(req): Json<CreateBlogPostRequest>,
) -> AppResult<(StatusCode, Json<BlogPost>)> {
    let id = Uuid::new_v4();
    let slug = generate_slug(&req.title);
    let related_hackathon = req.related_hackathon.and_then(|h| Uuid::parse_str(&h).ok());

    let post: BlogPost = sqlx::query_as(
        "INSERT INTO blog_posts (id, title, slug, summary, content, category, author, related_hackathon, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *"
    )
    .bind(&id)
    .bind(&req.title)
    .bind(&slug)
    .bind(&req.summary)
    .bind(&req.content)
    .bind(&req.category)
    .bind(&req.author)
    .bind(&related_hackathon)
    .bind(req.status.as_deref().unwrap_or("draft"))
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(post)))
}

pub async fn update_blog_post(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(req): Json<UpdateBlogPostRequest>,
) -> AppResult<Json<BlogPost>> {
    let post_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid post ID".to_string()))?;

    // Generate new slug if title changed
    let slug = req.title.as_ref().map(generate_slug);

    let post: BlogPost = sqlx::query_as(
        "UPDATE blog_posts SET
            title = COALESCE($2, title),
            slug = COALESCE($3, slug),
            summary = COALESCE($4, summary),
            content = COALESCE($5, content),
            category = COALESCE($6, category),
            author = COALESCE($7, author),
            status = COALESCE($8, status),
            updated_at = NOW()
         WHERE id = $1
         RETURNING *"
    )
    .bind(post_id)
    .bind(&req.title)
    .bind(&slug)
    .bind(&req.summary)
    .bind(&req.content)
    .bind(&req.category)
    .bind(&req.author)
    .bind(&req.status)
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::NotFound("Blog post not found".to_string()))?;

    Ok(Json(post))
}

pub async fn delete_blog_post(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> AppResult<StatusCode> {
    let post_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid post ID".to_string()))?;

    let result = sqlx::query("DELETE FROM blog_posts WHERE id = $1")
        .bind(post_id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("Blog post not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

// Metrics handler
pub async fn get_metrics(State(state): State<AppState>) -> AppResult<Json<Metrics>> {
    let total_hackathons: i64 =
        sqlx::query_scalar("SELECT COUNT(*) FROM hackathons")
            .fetch_one(&state.db)
            .await?;

    let total_submissions: i64 =
        sqlx::query_scalar("SELECT COUNT(*) FROM submissions")
            .fetch_one(&state.db)
            .await?;

    let total_students: i64 = sqlx::query_scalar(
        "SELECT COUNT(DISTINCT email) FROM participants",
    )
    .fetch_one(&state.db)
    .await?;

    let total_mentors: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM mentors")
        .fetch_one(&state.db)
        .await?;

    Ok(Json(Metrics {
        total_hackathons,
        total_submissions,
        total_students,
        total_mentors,
    }))
}

// Export handler
#[derive(Deserialize)]
pub struct ExportQuery {
    pub semester: Option<String>,
    pub hackathon_id: Option<String>,
    pub department: Option<String>,
    pub format: Option<String>,
}

pub async fn export_data(
    State(state): State<AppState>,
    Query(query): Query<ExportQuery>,
) -> AppResult<(StatusCode, axum::response::IntoResponse)> {
    let format = query.format.as_deref().unwrap_or("csv");

    // Build dynamic query with optional filters
    let mut sql = r#"
        SELECT 
            s.id as submission_id,
            s.created_at as submitted_at,
            h.semester,
            h.name as hackathon_name,
            s.team_name,
            s.participant_count,
            s.mentor_count,
            p.name as participant_name,
            p.email as participant_email,
            p.department as participant_department,
            p.academic_year as participant_year,
            STRING_AGG(DISTINCT m.name, ', ') as mentor_names,
            STRING_AGG(DISTINCT m.department, ', ') as mentor_departments,
            s.external_registration_confirmed as external_confirmed,
            s.status
        FROM submissions s
        JOIN hackathons h ON s.hackathon_id = h.id
        LEFT JOIN participants p ON s.id = p.submission_id
        LEFT JOIN mentors m ON s.id = m.submission_id
        WHERE 1=1
    "#.to_string();

    if query.semester.is_some() {
        sql.push_str(" AND h.semester = $1");
    }

    if query.hackathon_id.is_some() {
        let param = if query.semester.is_some() { "$2" } else { "$1" };
        sql.push_str(&format!(" AND h.id = {}", param));
    }

    if query.department.is_some() {
        let param = match (query.semester.is_some(), query.hackathon_id.is_some()) {
            (true, true) => "$3",
            (true, false) | (false, true) => "$2",
            (false, false) => "$1",
        };
        sql.push_str(&format!(" AND p.department = {}", param));
    }

    sql.push_str(" GROUP BY s.id, s.created_at, h.semester, h.name, s.team_name, s.participant_count, s.mentor_count, p.name, p.email, p.department, p.academic_year, s.external_registration_confirmed, s.status ORDER BY s.created_at DESC");

    let mut q = sqlx::query_as::<_, crate::models::SubmissionDetail>(&sql);

    if let Some(sem) = &query.semester {
        q = q.bind(sem);
    }
    if let Some(hid) = &query.hackathon_id {
        q = q.bind(Uuid::parse_str(hid)
            .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?);
    }
    if let Some(dept) = &query.department {
        q = q.bind(dept);
    }

    let submissions = q.fetch_all(&state.db).await?;

    let data = if format == "xlsx" {
        crate::export::generate_xlsx(submissions)?
    } else {
        crate::export::generate_csv(submissions)?
    };

    let headers = if format == "xlsx" {
        [(
            axum::http::header::CONTENT_TYPE,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ), (
            axum::http::header::CONTENT_DISPOSITION,
            "attachment; filename=\"export.xlsx\""
        )]
    } else {
        [(
            axum::http::header::CONTENT_TYPE,
            "text/csv"
        ), (
            axum::http::header::CONTENT_DISPOSITION,
            "attachment; filename=\"export.csv\""
        )]
    };

    Ok((StatusCode::OK, (headers, data).into_response()))
}
