use crate::auth::{create_jwt, verify_password};
use crate::error::{AppError, AppResult};
use crate::models::*;
use crate::utils::generate_slug;
use axum::{
    extract::{Extension, Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use serde_json::json;
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
    let token = create_jwt(
        &admin.id.to_string(),
        &admin.email,
        "admin",
        &state.jwt_secret,
    )?;

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
    Extension(claims): Extension<Claims>,
    Json(req): Json<CreateHackathonRequest>,
) -> AppResult<(StatusCode, Json<Hackathon>)> {
    let id = Uuid::new_v4();
    let slug = generate_slug(&req.name);
    // Use admin_id from JWT claims
    let created_by = Uuid::parse_str(&claims.sub)
        .map_err(|_| AppError::BadRequest("Invalid admin ID in token".to_string()))?;

    let hackathon = sqlx::query_as::<_, Hackathon>(
        "INSERT INTO hackathons (id, name, slug, organizer, description, mode, location, start_date, end_date, registration_deadline, official_registration_link, eligibility, status, semester, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *"
    )
    .bind(&id)
    .bind(&req.name)
    .bind(&slug)
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
         RETURNING *",
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
    #[allow(dead_code)]
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
        q = q.bind(
            Uuid::parse_str(hid)
                .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?,
        );
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

    let submission: serde_json::Value = sqlx::query_as::<_, (serde_json::Value,)>(
        "SELECT s.*, h.name as hackathon_name 
         FROM submissions s 
         JOIN hackathons h ON s.hackathon_id = h.id 
         WHERE s.id = $1",
    )
    .bind(submission_id)
    .fetch_optional(&state.db)
    .await?
    .map(|(v,)| v)
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

    let submission: Submission =
        sqlx::query_as("UPDATE submissions SET status = $2 WHERE id = $1 RETURNING *")
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
    let post_id =
        Uuid::parse_str(&id).map_err(|_| AppError::BadRequest("Invalid post ID".to_string()))?;

    // Generate new slug if title changed
    let slug = req.title.as_ref().map(|t| generate_slug(t));

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
         RETURNING *",
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
    let post_id =
        Uuid::parse_str(&id).map_err(|_| AppError::BadRequest("Invalid post ID".to_string()))?;

    let result = sqlx::query("DELETE FROM blog_posts WHERE id = $1")
        .bind(post_id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("Blog post not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

// Metrics and export handlers have been moved to metrics.rs
