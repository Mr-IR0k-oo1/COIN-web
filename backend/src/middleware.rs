use crate::auth::verify_jwt;
use crate::error::AppError;
use axum::{
    extract::Request,
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};
use std::sync::Arc;

pub fn jwt_layer(
    secret: Arc<String>,
) -> axum::middleware::FromFnLayer<
    impl Fn(Request, Next) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<Response, AppError>> + Send>>
        + Clone,
    Request,
    AppError,
> {
    axum::middleware::from_fn(move |req: Request, next: Next| {
        let secret = secret.clone();
        Box::pin(async move {
            let path = req.uri().path();

            // Skip JWT verification for public routes
            if path.starts_with("/api/health")
                || path.contains("/api/hackathons")
                || path.contains("/api/blog")
                || path.contains("/api/submit")
                || path.starts_with("/api/admin/login")
            {
                return Ok(next.run(req).await);
            }

            // Require JWT for admin routes (except login)
            if path.starts_with("/api/admin") && !path.ends_with("/login") {
                let auth_header = req
                    .headers()
                    .get(AUTHORIZATION)
                    .and_then(|v| v.to_str().ok())
                    .ok_or_else(|| AppError::Unauthorized("Missing authorization header".to_string()))?;

                let token = auth_header
                    .strip_prefix("Bearer ")
                    .ok_or_else(|| AppError::Unauthorized("Invalid authorization header".to_string()))?;

                verify_jwt(token, &secret)?;
            }

            Ok(next.run(req).await)
        })
    })
}
