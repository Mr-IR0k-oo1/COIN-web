use crate::error::AppResult;
use crate::models::SubmissionDetail;
use csv::Writer;
use std::io::Cursor;

pub fn generate_csv(submissions: Vec<SubmissionDetail>) -> AppResult<Vec<u8>> {
    let mut wtr = Writer::from_writer(vec![]);

    // Write header
    wtr.write_record(&[
        "submission_id",
        "submitted_at",
        "semester",
        "hackathon_name",
        "team_name",
        "participant_count",
        "mentor_count",
        "participant_name",
        "participant_email",
        "participant_department",
        "participant_year",
        "mentor_names",
        "mentor_departments",
        "external_confirmed",
        "status",
    ])
    .map_err(|e| crate::error::AppError::InternalError(format!("CSV write error: {}", e)))?;

    for submission in submissions {
        wtr.write_record(&[
            submission.submission_id.to_string(),
            submission.submitted_at.to_rfc3339(),
            submission.semester,
            submission.hackathon_name,
            submission.team_name,
            submission.participant_count.to_string(),
            submission.mentor_count.to_string(),
            submission.participant_name.unwrap_or_default(),
            submission.participant_email.unwrap_or_default(),
            submission.participant_department.unwrap_or_default(),
            submission.participant_year.unwrap_or_default(),
            submission.mentor_names.unwrap_or_default(),
            submission.mentor_departments.unwrap_or_default(),
            submission.external_confirmed.to_string(),
            submission.status,
        ])
        .map_err(|e| crate::error::AppError::InternalError(format!("CSV write error: {}", e)))?;
    }

    wtr.flush()
        .map_err(|e| crate::error::AppError::InternalError(format!("CSV flush error: {}", e)))?;

    Ok(wtr.into_inner().map_err(|e| {
        crate::error::AppError::InternalError(format!("CSV extraction error: {}", e))
    })?)
}

pub fn generate_xlsx(submissions: Vec<SubmissionDetail>) -> AppResult<Vec<u8>> {
    // For now, return CSV as fallback
    // Full XLSX support would require additional library setup
    generate_csv(submissions)
}
