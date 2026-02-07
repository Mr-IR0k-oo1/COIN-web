use crate::error::{AppError, AppResult};
use crate::models::*;
use crate::utils::validate_srec_email;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;
use serde_json::json;
use sqlx::Row;
use uuid::Uuid;

use crate::AppState;

#[derive(Deserialize)]
pub struct PaginationQuery {
    pub page: Option<i32>,
    pub limit: Option<i32>,
}

pub async fn list_hackathons(
    State(state): State<AppState>,
    Query(query): Query<PaginationQuery>,
) -> AppResult<Json<serde_json::Value>> {
    let page = query.page.unwrap_or(1).max(1);
    let limit = query.limit.unwrap_or(10).min(100);
    let offset = (page - 1) * limit;

    let total = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM hackathons")
        .fetch_one(&state.db)
        .await?;

    let hackathons: Vec<Hackathon> = sqlx::query_as(
        "SELECT * FROM hackathons ORDER BY start_date DESC LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(json!({
        "data": hackathons,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit as i64 - 1) / limit as i64
        }
    })))
}

pub async fn get_hackathon(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> AppResult<Json<Hackathon>> {
    let hackathon_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?;

    let hackathon: Hackathon = sqlx::query_as("SELECT * FROM hackathons WHERE id = $1")
        .bind(hackathon_id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound("Hackathon not found".to_string()))?;

    Ok(Json(hackathon))
}

pub async fn list_blog_posts(
    State(state): State<AppState>,
    Query(query): Query<PaginationQuery>,
) -> AppResult<Json<serde_json::Value>> {
    let page = query.page.unwrap_or(1).max(1);
    let limit = query.limit.unwrap_or(10).min(100);
    let offset = (page - 1) * limit;

    let total = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM blog_posts WHERE status = 'published'",
    )
    .fetch_one(&state.db)
    .await?;

    let posts: Vec<BlogPost> = sqlx::query_as(
        "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(json!({
        "data": posts,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit as i64 - 1) / limit as i64
        }
    })))
}

pub async fn get_blog_post(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> AppResult<Json<BlogPost>> {
    let post: BlogPost = sqlx::query_as(
        "SELECT * FROM blog_posts WHERE slug = $1 AND status = 'published'",
    )
    .bind(&slug)
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::NotFound("Blog post not found".to_string()))?;

    Ok(Json(post))
}

pub async fn submit_participation(
    State(state): State<AppState>,
    Json(req): Json<SubmitParticipationRequest>,
) -> AppResult<(StatusCode, Json<serde_json::Value>)> {
    // Parse and validate hackathon ID
    let hackathon_id = Uuid::parse_str(&req.hackathon_id)
        .map_err(|_| AppError::BadRequest("Invalid hackathon ID".to_string()))?;

    // Verify hackathon exists and status is not CLOSED
    let hackathon: Option<(String, String)> =
        sqlx::query_as("SELECT status, id::text FROM hackathons WHERE id = $1")
            .bind(hackathon_id)
            .fetch_optional(&state.db)
            .await?;

    let (status, _) = hackathon
        .ok_or_else(|| AppError::NotFound("Hackathon not found".to_string()))?;

    if status == "CLOSED" {
        return Err(AppError::BadRequest(
            "Hackathon registration is closed".to_string(),
        ));
    }

    // Validate external registration confirmation
    if !req.external_registration_confirmed {
        return Err(AppError::BadRequest(
            "External registration must be confirmed".to_string(),
        ));
    }

    // Validate participant count
    if req.participants.len() != req.participants.len() {
        return Err(AppError::BadRequest(
            "Participant count mismatch".to_string(),
        ));
    }

    // Validate mentor count
    if req.mentors.len() != req.mentors.len() {
        return Err(AppError::BadRequest(
            "Mentor count mismatch".to_string(),
        ));
    }

    // Validate all participant emails
    let mut email_set = std::collections::HashSet::new();
    for participant in &req.participants {
        validate_srec_email(&participant.email)?;
        if !email_set.insert(participant.email.clone()) {
            return Err(AppError::BadRequest(
                "Duplicate participant emails".to_string(),
            ));
        }
    }

    // Validate required fields
    if req.team_name.trim().is_empty() {
        return Err(AppError::BadRequest("Team name is required".to_string()));
    }

    if req.participants.is_empty() {
        return Err(AppError::BadRequest("At least one participant is required".to_string()));
    }

    // Create submission with transaction
    let mut tx = state.db.begin().await?;

    let submission_id = Uuid::new_v4();
    sqlx::query(
        "INSERT INTO submissions (id, hackathon_id, team_name, participant_count, mentor_count, external_registration_confirmed, status) 
         VALUES ($1, $2, $3, $4, $5, $6, 'submitted')"
    )
    .bind(&submission_id)
    .bind(&hackathon_id)
    .bind(&req.team_name)
    .bind(req.participants.len() as i32)
    .bind(req.mentors.len() as i32)
    .bind(true)
    .execute(&mut *tx)
    .await?;

    // Insert participants
    for participant in &req.participants {
        let participant_id = Uuid::new_v4();
        sqlx::query(
            "INSERT INTO participants (id, submission_id, name, email, department, academic_year) 
             VALUES ($1, $2, $3, $4, $5, $6)"
        )
        .bind(&participant_id)
        .bind(&submission_id)
        .bind(&participant.name)
        .bind(&participant.email)
        .bind(&participant.department)
        .bind(&participant.academic_year)
        .execute(&mut *tx)
        .await?;
    }

    // Insert mentors
    for mentor in &req.mentors {
        let mentor_id = Uuid::new_v4();
        sqlx::query(
            "INSERT INTO mentors (id, submission_id, name, department) VALUES ($1, $2, $3, $4)"
        )
        .bind(&mentor_id)
        .bind(&submission_id)
        .bind(&mentor.name)
        .bind(&mentor.department)
        .execute(&mut *tx)
        .await?;
    }

    tx.commit().await?;

    Ok((
        StatusCode::CREATED,
        Json(json!({
            "submission_id": submission_id,
            "status": "submitted"
        })),
    ))
}
