use crate::error::{AppError, AppResult};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2, PasswordHash, PasswordVerifier,
};
use chrono::Utc;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use crate::models::Claims;

const JWT_EXPIRATION: i64 = 24 * 60 * 60; // 24 hours

pub fn hash_password(password: &str) -> AppResult<String> {
    let salt = SaltString::generate(OsRng);
    let argon2 = Argon2::default();
    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|e| AppError::InternalError(format!("Password hashing failed: {}", e)))
}

pub fn verify_password(password: &str, hash: &str) -> AppResult<bool> {
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| AppError::InternalError(format!("Invalid password hash: {}", e)))?;
    
    let argon2 = Argon2::default();
    argon2
        .verify_password(password.as_bytes(), &parsed_hash)
        .map(|_| true)
        .or_else(|_| Ok(false))
}

pub fn create_jwt(admin_id: &str, email: &str, secret: &str) -> AppResult<String> {
    let now = Utc::now().timestamp();
    let claims = Claims {
        sub: admin_id.to_string(),
        email: email.to_string(),
        exp: now + JWT_EXPIRATION,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .map_err(|e| AppError::InternalError(format!("JWT creation failed: {}", e)))
}

pub fn verify_jwt(token: &str, secret: &str) -> AppResult<Claims> {
    decode(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .map_err(|e| AppError::Unauthorized(format!("Invalid token: {}", e)))
}
