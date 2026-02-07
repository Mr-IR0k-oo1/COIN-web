mod auth;
mod db;
mod error;
mod handlers;
mod middleware;
mod models;
mod utils;
mod export;

use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};
use sqlx::postgres::PgPoolOptions;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tracing_subscriber;

#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::PgPool,
    pub jwt_secret: Arc<String>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive("coin_backend=debug".parse()?),
        )
        .init();

    // Database setup
    let database_url = std::env::var("DATABASE_URL")?;
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // Run migrations
    sqlx::migrate!()
        .run(&pool)
        .await
        .map_err(|e| format!("Migration failed: {}", e))?;

    // Bootstrap admin if needed
    db::bootstrap_admin(&pool).await?;

    let jwt_secret = std::env::var("JWT_SECRET")?;
    let state = AppState {
        db: pool.clone(),
        jwt_secret: Arc::new(jwt_secret),
    };

    // Build router
    let public_routes = Router::new()
        .route("/health", get(handlers::health))
        .route("/hackathons", get(handlers::public::list_hackathons))
        .route("/hackathons/:id", get(handlers::public::get_hackathon))
        .route("/blog", get(handlers::public::list_blog_posts))
        .route("/blog/:slug", get(handlers::public::get_blog_post))
        .route("/submit", post(handlers::public::submit_participation));

    let admin_routes = Router::new()
        .route("/login", post(handlers::admin::login))
        .route(
            "/hackathons",
            post(handlers::admin::create_hackathon)
                .get(handlers::admin::list_hackathons_admin),
        )
        .route(
            "/hackathons/:id",
            put(handlers::admin::update_hackathon)
                .delete(handlers::admin::delete_hackathon),
        )
        .route(
            "/hackathons/:id/status",
            patch(handlers::admin::update_hackathon_status),
        )
        .route(
            "/submissions",
            get(handlers::admin::list_submissions),
        )
        .route(
            "/submissions/:id",
            get(handlers::admin::get_submission)
                .delete(handlers::admin::delete_submission),
        )
        .route(
            "/submissions/:id/status",
            patch(handlers::admin::update_submission_status),
        )
        .route("/blog", post(handlers::admin::create_blog_post))
        .route("/blog/:id", put(handlers::admin::update_blog_post))
        .route("/blog/:id", delete(handlers::admin::delete_blog_post))
        .route("/metrics", get(handlers::admin::get_metrics))
        .route("/export", get(handlers::admin::export_data));

    let app = Router::new()
        .nest("/api", public_routes)
        .nest("/api/admin", admin_routes)
        .layer(middleware::jwt_layer(state.jwt_secret.clone()))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000").await?;
    tracing::info!("Server listening on http://127.0.0.1:8000");
    axum::serve(listener, app).await?;

    Ok(())
}
