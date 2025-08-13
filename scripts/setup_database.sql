-- Create database
CREATE DATABASE IF NOT EXISTS transaction_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use database
USE transaction_db;

-- Create transactions table (this will be handled by GORM AutoMigrate)
-- But here's the structure for reference:
/*
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('success', 'pending', 'failed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- Insert sample data for testing
INSERT INTO transactions (user_id, amount, status, created_at) VALUES
(1, 100.50, 'success', NOW()),
(1, 75.25, 'pending', NOW()),
(2, 200.00, 'success', NOW()),
(2, 150.75, 'failed', NOW()),
(3, 300.00, 'success', NOW()),
(3, 125.50, 'pending', NOW()),
(1, 50.00, 'success', NOW()),
(2, 175.25, 'success', NOW()),
(3, 225.75, 'success', NOW()),
(1, 90.00, 'pending', NOW());