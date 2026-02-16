use crate::auth::verify_jwt;
use crate::error::AppError;
use crate::models::Claims;
use crate::AppState;
use axum::{
    extract::{Request, State},
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut req: Request,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = req
        .headers()
        .get(AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::Unauthorized("Missing authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Unauthorized("Invalid authorization header".to_string()))?;

    let claims = verify_jwt(token, &state.jwt_secret)?;

    // Attach claims to request extensions
    req.extensions_mut().insert(claims);

    Ok(next.run(req).await)
}

pub async fn admin_guard(req: Request, next: Next) -> Result<Response, AppError> {
    let claims = req
        .extensions()
        .get::<Claims>()
        .ok_or_else(|| AppError::Unauthorized("Authentication required".to_string()))?;

    if claims.role != "admin" {
        return Err(AppError::Forbidden("Admin access required".to_string()));
    }

    Ok(next.run(req).await)
}

pub async fn student_guard(req: Request, next: Next) -> Result<Response, AppError> {
    let claims = req
        .extensions()
        .get::<Claims>()
        .ok_or_else(|| AppError::Unauthorized("Authentication required".to_string()))?;

    if claims.role != "student" {
        return Err(AppError::Forbidden("Student access required".to_string()));
    }

    Ok(next.run(req).await)
}
