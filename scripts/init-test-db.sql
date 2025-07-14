-- Initialize test database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create test database if not exists
SELECT 'CREATE DATABASE webxemphim_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'webxemphim_test')\gexec

-- Set timezone
SET timezone = 'UTC';

-- Create user service schema
CREATE SCHEMA IF NOT EXISTS user_service;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE webxemphim_test TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA user_service TO postgres; 