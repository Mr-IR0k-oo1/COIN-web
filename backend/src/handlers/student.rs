use crate::auth::{create_jwt, hash_password, verify_password};
use crate::error::{AppError, AppResult};
use crate::models::*;
// validate_srec_email is not exposed as a public function returning bool, we'll validate directly
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::Row;
use uuid::Uuid;

use crate::AppState;

#[derive(Deserialize)]
pub struct PaginationQuery {
    pub page: Option<i32>,
    pub limit: Option<i32>,
}

// Register a new student
pub async fn register(
    State(state): State<AppState>,
    Json(req): Json<RegisterStudentRequest>,
) -> AppResult<(StatusCode, Json<StudentLoginResponse>)> {
    // Validate email - must end with @srec.ac.in
    if !req.email.ends_with("@srec.ac.in") {
        return Err(AppError::BadRequest(
            "Only @srec.ac.in email addresses are allowed".to_string(),
        ));
    }

    // Validate year
    if req.year < 1 || req.year > 4 {
        return Err(AppError::BadRequest("Academic year must be between 1 and 4".to_string()));
    }

    // Hash password
    let password_hash = hash_password(&req.password)?;

    // Check if email already exists
    let existing: Option<(i32,)> = sqlx::query_as("SELECT 1 FROM students WHERE email = $1")
        .bind(&req.email)
        .fetch_optional(&state.db)
        .await?;

    if existing.is_some() {
        return Err(AppError::BadRequest("Email already registered".to_string()));
    }

    let id = Uuid::new_v4();

    // Insert student
    let student: Student = sqlx::query_as(
        "INSERT INTO students (id, name, email, password_hash, year, branch)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *"
    )
    .bind(&id)
    .bind(&req.name)
    .bind(&req.email)
    .bind(&password_hash)
    .bind(req.year)
    .bind(&req.branch)
    .fetch_one(&state.db)
    .await?;

    // Create JWT token
    let token = create_jwt(&student.id.to_string(), &student.email, &state.jwt_secret)?;

    let student_public = StudentPublic {
        id: student.id.to_string(),
        name: student.name,
        email: student.email,
        year: student.year,
        branch: student.branch,
        bio: student.bio,
        skills: vec![],
    };

    Ok((
        StatusCode::CREATED,
        Json(StudentLoginResponse {
            token,
            student: student_public,
        }),
    ))
}

// Login student
pub async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginRequest>,
) -> AppResult<Json<StudentLoginResponse>> {
    // Find student by email
    let student: Student = sqlx::query_as("SELECT * FROM students WHERE email = $1")
        .bind(&req.email)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::Unauthorized("Invalid credentials".to_string()))?;

    // Verify password
    if !verify_password(&req.password, &student.password_hash)? {
        return Err(AppError::Unauthorized("Invalid credentials".to_string()));
    }

    // Fetch skills
    let skills: Vec<String> = sqlx::query_scalar(
        "SELECT skill FROM student_skills WHERE student_id = $1 ORDER BY skill"
    )
    .bind(&student.id)
    .fetch_all(&state.db)
    .await?;

    // Create JWT token
    let token = create_jwt(&student.id.to_string(), &student.email, &state.jwt_secret)?;

    let student_public = StudentPublic {
        id: student.id.to_string(),
        name: student.name,
        email: student.email,
        year: student.year,
        branch: student.branch,
        bio: student.bio,
        skills,
    };

    Ok(Json(StudentLoginResponse {
        token,
        student: student_public,
    }))
}

// Get student profile (requires auth)
pub async fn get_profile(
    State(state): State<AppState>,
    axum::extract::ConnectInfo(info): axum::extract::ConnectInfo<std::net::SocketAddr>,
) -> AppResult<Json<StudentPublic>> {
    // Extract student ID from JWT (middleware should handle this)
    // For now, this is a placeholder - middleware will populate this
    Err(AppError::Unauthorized("Not implemented".to_string()))
}

// Update student profile (requires auth)
pub async fn update_profile(
    State(state): State<AppState>,
    Path(student_id): Path<String>,
    Json(req): Json<UpdateStudentRequest>,
) -> AppResult<Json<StudentPublic>> {
    let student_uuid = Uuid::parse_str(&student_id)
        .map_err(|_| AppError::BadRequest("Invalid student ID".to_string()))?;

    // Fetch current student
    let mut student: Student = sqlx::query_as("SELECT * FROM students WHERE id = $1")
        .bind(&student_uuid)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound("Student not found".to_string()))?;

    // Update fields if provided
    if let Some(name) = req.name {
        student.name = name;
    }
    if let Some(year) = req.year {
        if year < 1 || year > 4 {
            return Err(AppError::BadRequest(
                "Academic year must be between 1 and 4".to_string(),
            ));
        }
        student.year = year;
    }
    if let Some(branch) = req.branch {
        student.branch = branch;
    }
    if let Some(bio) = req.bio {
        student.bio = Some(bio);
    }

    // Update in database
    let updated: Student = sqlx::query_as(
        "UPDATE students SET name = $1, year = $2, branch = $3, bio = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING *"
    )
    .bind(&student.name)
    .bind(student.year)
    .bind(&student.branch)
    .bind(&student.bio)
    .bind(&student_uuid)
    .fetch_one(&state.db)
    .await?;

    // Update skills if provided
    let mut skills = vec![];
    if let Some(new_skills) = req.skills {
        // Delete old skills
        sqlx::query("DELETE FROM student_skills WHERE student_id = $1")
            .bind(&student_uuid)
            .execute(&state.db)
            .await?;

        // Insert new skills
        for skill in &new_skills {
            sqlx::query(
                "INSERT INTO student_skills (student_id, skill) VALUES ($1, $2)"
            )
            .bind(&student_uuid)
            .bind(skill)
            .execute(&state.db)
            .await?;
        }
        skills = new_skills;
    } else {
        // Fetch existing skills
        skills = sqlx::query_scalar(
            "SELECT skill FROM student_skills WHERE student_id = $1 ORDER BY skill"
        )
        .bind(&student_uuid)
        .fetch_all(&state.db)
        .await?;
    }

    let student_public = StudentPublic {
        id: updated.id.to_string(),
        name: updated.name,
        email: updated.email,
        year: updated.year,
        branch: updated.branch,
        bio: updated.bio,
        skills,
    };

    Ok(Json(student_public))
}

// Search students with filters
pub async fn search(
    State(state): State<AppState>,
    Query(params): Query<StudentSearchRequest>,
) -> AppResult<Json<serde_json::Value>> {
    // Build query with filters
    let mut base_query = String::from(
        "SELECT DISTINCT s.id, s.name, s.email, s.year, s.branch, s.bio FROM students s"
    );

    let mut where_clauses = vec![];
    let mut has_skills_filter = false;

    if params.year.is_some() {
        where_clauses.push(format!("s.year = {}", params.year.unwrap()));
    }

    if let Some(ref b) = params.branch {
        where_clauses.push(format!("s.branch ILIKE '{}'", b.replace("'", "''")));
    }

    if params.skills.is_some() {
        base_query.push_str(" LEFT JOIN student_skills ss ON s.id = ss.student_id");
        has_skills_filter = true;
    }

    if let Some(ref sk) = params.skills {
        where_clauses.push(format!("ss.skill ILIKE '%{}%'", sk.replace("'", "''")));
    }

    if !where_clauses.is_empty() {
        base_query.push_str(" WHERE ");
        base_query.push_str(&where_clauses.join(" AND "));
    }

    base_query.push_str(" ORDER BY s.name LIMIT 100");

    #[derive(sqlx::FromRow)]
    struct StudentRow {
        id: Uuid,
        name: String,
        email: String,
        year: i32,
        branch: String,
        bio: Option<String>,
    }

    let students_rows: Vec<StudentRow> = sqlx::query_as(&base_query)
        .fetch_all(&state.db)
        .await?;

    let mut students_list = vec![];

    for row in students_rows {
        let skills: Vec<String> = sqlx::query_scalar(
            "SELECT skill FROM student_skills WHERE student_id = $1 ORDER BY skill"
        )
        .bind(&row.id)
        .fetch_all(&state.db)
        .await?;

        students_list.push(StudentPublic {
            id: row.id.to_string(),
            name: row.name,
            email: row.email,
            year: row.year,
            branch: row.branch,
            bio: row.bio,
            skills,
        });
    }

    Ok(Json(json!({
        "students": students_list,
        "count": students_list.len()
    })))
}
