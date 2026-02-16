use crate::error::{AppError, AppResult};
use crate::models::SubmissionDetail;
use csv::Writer;

fn get_headers() -> Vec<&'static str> {
    vec![
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
    ]
}

fn get_submission_row(submission: &SubmissionDetail) -> Vec<String> {
    vec![
        submission.submission_id.to_string(),
        submission.submitted_at.to_rfc3339(),
        submission.semester.clone(),
        submission.hackathon_name.clone(),
        submission.team_name.clone(),
        submission.participant_count.to_string(),
        submission.mentor_count.to_string(),
        submission.participant_name.clone().unwrap_or_default(),
        submission.participant_email.clone().unwrap_or_default(),
        submission
            .participant_department
            .clone()
            .unwrap_or_default(),
        submission.participant_year.clone().unwrap_or_default(),
        submission.mentor_names.clone().unwrap_or_default(),
        submission.mentor_departments.clone().unwrap_or_default(),
        submission.external_confirmed.to_string(),
        submission.status.clone(),
    ]
}

pub fn generate_csv(submissions: Vec<SubmissionDetail>) -> AppResult<Vec<u8>> {
    let mut wtr = Writer::from_writer(vec![]);

    // Write header
    wtr.write_record(get_headers())
        .map_err(|e| AppError::InternalError(format!("CSV write error: {}", e)))?;

    for submission in submissions {
        wtr.write_record(get_submission_row(&submission))
            .map_err(|e| AppError::InternalError(format!("CSV write error: {}", e)))?;
    }

    wtr.flush()
        .map_err(|e| AppError::InternalError(format!("CSV flush error: {}", e)))?;

    Ok(wtr
        .into_inner()
        .map_err(|e| AppError::InternalError(format!("CSV extraction error: {}", e)))?)
}

pub fn generate_xlsx(submissions: Vec<SubmissionDetail>) -> AppResult<Vec<u8>> {
    use rust_xlsxwriter::{Format, Workbook};

    let mut workbook = Workbook::new();
    let worksheet = workbook.add_worksheet();

    // Add formats
    let header_format = Format::new().set_bold().set_background_color("#F3F4F6");

    // Write headers
    let headers = get_headers();
    for (col, header) in headers.iter().enumerate() {
        worksheet
            .write_string_with_format(0, col as u16, *header, &header_format)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
    }

    // Write data
    for (row, submission) in submissions.iter().enumerate() {
        let row_idx = (row + 1) as u32;
        worksheet
            .write_string(row_idx, 0, &submission.submission_id.to_string())
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(row_idx, 1, &submission.submitted_at.to_rfc3339())
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(row_idx, 2, &submission.semester)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(row_idx, 3, &submission.hackathon_name)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(row_idx, 4, &submission.team_name)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_number(row_idx, 5, submission.participant_count as f64)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_number(row_idx, 6, submission.mentor_count as f64)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(
                row_idx,
                7,
                submission.participant_name.as_deref().unwrap_or(""),
            )
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(
                row_idx,
                8,
                submission.participant_email.as_deref().unwrap_or(""),
            )
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(
                row_idx,
                9,
                submission.participant_department.as_deref().unwrap_or(""),
            )
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(
                row_idx,
                10,
                submission.participant_year.as_deref().unwrap_or(""),
            )
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(
                row_idx,
                11,
                submission.mentor_names.as_deref().unwrap_or(""),
            )
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(
                row_idx,
                12,
                submission.mentor_departments.as_deref().unwrap_or(""),
            )
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_boolean(row_idx, 13, submission.external_confirmed)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
        worksheet
            .write_string(row_idx, 14, &submission.status)
            .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
    }

    // Set column widths for better readability
    worksheet
        .set_column_width(3, 30)
        .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
    worksheet
        .set_column_width(4, 25)
        .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;
    worksheet
        .set_column_width(8, 35)
        .map_err(|e| AppError::InternalError(format!("XLSX error: {}", e)))?;

    workbook
        .save_to_buffer()
        .map_err(|e| AppError::InternalError(format!("XLSX save error: {}", e)))
}
