use crate::auth::verify_jwt;
use crate::error::AppError;
use crate::models::Claims;
use crate::AppState;
use axum::{
    extract::{Request, ConnectInfo},
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};

pub async fn auth_middleware(
    mut req: Request,
    state: crate::AppState,
    next: Next,
) -> Result<Response, AppError> {
    let secret = &state.jwt_secret;
    let path = req.uri().path();

    // Skip JWT verification for public routes
    if path.starts_with("/api/health")
        || path.contains("/api/hackathons")
        || path.contains("/api/blog")
        || path.contains("/api/submit")
        || path.starts_with("/api/admin/login")
        || path.starts_with("/api/student/register")
        || path.starts_with("/api/student/login")
    {
        return Ok(next.run(req).await);
    }

    // Require JWT for protected routes
    if path.starts_with("/api/admin") || path.starts_with("/api/student") {
        let auth_header = req
            .headers()
            .get(AUTHORIZATION)
            .and_then(|v| v.to_str().ok())
            .ok_or_else(|| AppError::Unauthorized("Missing authorization header".to_string()))?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or_else(|| AppError::Unauthorized("Invalid authorization header".to_string()))?;

        let claims = verify_jwt(token, &secret)?;
        
        // Attach claims to request extensions
        req.extensions_mut().insert(claims);
    }

    Ok(next.run(req).await)
}

pub async fn admin_guard(
    req: Request,
    next: Next,
) -> Result<Response, AppError> {
    let claims = req
        .extensions()
        .get::<Claims>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("No claims found".to_string()))?;

    if claims.role != "admin" {
        return Err(AppError::Unauthorized(
            "Admin access required".to_string(),
        ));
    }

    Ok(next.run(req).await)
}

pub async fn student_guard(
    req: Request,
    next: Next,
) -> Result<Response, AppError> {
    let claims = req
        .extensions()
        .get::<Claims>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("No claims found".to_string()))?;

    if claims.role != "student" {
        return Err(AppError::Unauthorized(
            "Student access required".to_string(),
        ));
    }

    Ok(next.run(req).await)
}
