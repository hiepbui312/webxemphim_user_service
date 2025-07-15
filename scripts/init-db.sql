-- Create development database if not exists
SELECT 'CREATE DATABASE webxemphim_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'webxemphim_dev')\gexec

-- Set timezone
SET timezone = 'UTC';

-- Create user service schema
CREATE SCHEMA IF NOT EXISTS user_service;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE webxemphim_dev TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA user_service TO postgres; 