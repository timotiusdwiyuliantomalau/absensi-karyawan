-- Initial database setup script
-- This script is executed when the MySQL container starts

-- Use the transaction database
USE transaction_db;

-- Create application user if not exists (with different host patterns)
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'password';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'%';
GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'localhost';

-- Also ensure root can connect from anywhere
ALTER USER 'root'@'%' IDENTIFIED BY 'password';
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';

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