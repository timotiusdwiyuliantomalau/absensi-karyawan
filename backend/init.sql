-- Initial database setup script
-- This script is executed when the MySQL container starts

-- Create the main database (already created by environment variable)
-- CREATE DATABASE IF NOT EXISTS transaction_db;

-- Create application user if not exists
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'%';

-- Flush privileges to ensure changes take effect
FLUSH PRIVILEGES;

-- Use the transaction database
USE transaction_db;

-- Optional: Create some sample data for testing
-- This will be created by GORM migration, but here's the schema for reference
/*
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at)
);
*/