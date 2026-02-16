use crate::error::{AppError, AppResult};
use crate::models::*;
use crate::AppState;
use axum::{
    extract::{Query, State},
    http::{header, StatusCode},
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct MetricsQuery {
    pub semester: Option<String>,
}

pub async fn get_metrics(
    State(state): State<AppState>,
    Query(query): Query<MetricsQuery>,
) -> AppResult<Json<Metrics>> {
    let mut hackathon_sql = "SELECT COUNT(*) FROM hackathons WHERE 1=1".to_string();
    let mut submission_sql =
        "SELECT COUNT(s.*) FROM submissions s JOIN hackathons h ON s.hackathon_id = h.id WHERE 1=1"
            .to_string();
    let mut participant_sql = "SELECT COUNT(DISTINCT p.email) FROM participants p JOIN submissions s ON p.submission_id = s.id JOIN hackathons h ON s.hackathon_id = h.id WHERE 1=1".to_string();
    let mut mentor_sql = "SELECT COUNT(m.*) FROM mentors m JOIN submissions s ON m.submission_id = s.id JOIN hackathons h ON s.hackathon_id = h.id WHERE 1=1".to_string();

    if let Some(sem) = &query.semester {
        hackathon_sql.push_str(" AND semester = $1");
        submission_sql.push_str(" AND h.semester = $1");
        participant_sql.push_str(" AND h.semester = $1");
        mentor_sql.push_str(" AND h.semester = $1");
    }

    let mut h_q = sqlx::query_scalar::<_, i64>(&hackathon_sql);
    let mut s_q = sqlx::query_scalar::<_, i64>(&submission_sql);
    let mut p_q = sqlx::query_scalar::<_, i64>(&participant_sql);
    let mut m_q = sqlx::query_scalar::<_, i64>(&mentor_sql);

    if let Some(sem) = &query.semester {
        h_q = h_q.bind(sem);
        s_q = s_q.bind(sem);
        p_q = p_q.bind(sem);
        m_q = m_q.bind(sem);
    }

    let total_hackathons = h_q.fetch_one(&state.db).await?;
    let total_submissions = s_q.fetch_one(&state.db).await?;
    let total_students = p_q.fetch_one(&state.db).await?;
    let total_mentors = m_q.fetch_one(&state.db).await?;

    Ok(Json(Metrics {
        total_hackathons,
        total_submissions,
        total_students,
        total_mentors,
    }))
}

#[derive(Deserialize)]
pub struct ExportQuery {
    pub semester: Option<String>,
    pub hackathon_id: Option<String>,
    pub format: Option<String>,
}

pub async fn export_data(
    State(state): State<AppState>,
    Query(query): Query<ExportQuery>,
) -> AppResult<impl IntoResponse> {
    let format = query.format.as_deref().unwrap_or("csv");

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
    "#
    .to_string();

    if query.semester.is_some() {
        sql.push_str(" AND h.semester = $1");
    }

    if query.hackathon_id.is_some() {
        let param = if query.semester.is_some() { "$2" } else { "$1" };
        sql.push_str(&format!(" AND h.id = {}", param));
    }

    sql.push_str(" GROUP BY s.id, s.created_at, h.semester, h.name, s.team_name, s.participant_count, s.mentor_count, p.name, p.email, p.department, p.academic_year, s.external_registration_confirmed, s.status ORDER BY s.created_at DESC");

    let mut q = sqlx::query_as::<_, SubmissionDetail>(&sql);

    if let Some(sem) = &query.semester {
        q = q.bind(sem);
    }
    if let Some(hid) = &query.hackathon_id {
        q = q.bind(
            Uuid::parse_str(hid).map_err(|_| AppError::BadRequest("Invalid ID".to_string()))?,
        );
    }

    let submissions = q.fetch_all(&state.db).await?;

    let data = if format == "xlsx" {
        crate::export::generate_xlsx(submissions)?
    } else {
        crate::export::generate_csv(submissions)?
    };

    let filename = format!("export.{}", format);
    let content_type = if format == "xlsx" {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    } else {
        "text/csv"
    };

    let response = (
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, content_type.to_string()),
            (
                header::CONTENT_DISPOSITION,
                format!("attachment; filename=\"{}\"", filename),
            ),
        ],
        data,
    );

    Ok(response)
}
