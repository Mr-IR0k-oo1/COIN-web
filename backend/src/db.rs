use crate::auth::hash_password;
use crate::error::AppResult;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn bootstrap_admin(pool: &PgPool) -> AppResult<()> {
    let admin_email = std::env::var("ADMIN_BOOTSTRAP_EMAIL")
        .unwrap_or_else(|_| "admin@srec.ac.in".to_string());
    let admin_password = std::env::var("ADMIN_BOOTSTRAP_PASSWORD")
        .unwrap_or_else(|_| "changeme".to_string());

    // Check if admin exists
    let existing = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM admins WHERE email = $1")
        .bind(&admin_email)
        .fetch_one(pool)
        .await?;

    if existing == 0 {
        let id = Uuid::new_v4();
        let password_hash = hash_password(&admin_password)?;

        sqlx::query(
            "INSERT INTO admins (id, name, email, password_hash) VALUES ($1, $2, $3, $4)",
        )
        .bind(id)
        .bind("Initial Admin")
        .bind(&admin_email)
        .bind(&password_hash)
        .execute(pool)
        .await?;

        tracing::info!("Bootstrap admin created: {}", admin_email);
    }

    Ok(())
}
