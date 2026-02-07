use crate::error::{AppError, AppResult};
use regex::Regex;
use lazy_static::lazy_static;

lazy_static! {
    static ref SREC_EMAIL_REGEX: Regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@srec\.ac\.in$").unwrap();
}

pub fn validate_srec_email(email: &str) -> AppResult<()> {
    if SREC_EMAIL_REGEX.is_match(email) {
        Ok(())
    } else {
        Err(AppError::BadRequest(
            "Email must end with @srec.ac.in".to_string(),
        ))
    }
}

pub fn generate_slug(title: &str) -> String {
    title
        .to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

pub fn validate_uuid(id: &str) -> AppResult<uuid::Uuid> {
    uuid::Uuid::parse_str(id).map_err(|_| AppError::BadRequest("Invalid UUID format".to_string()))
}
