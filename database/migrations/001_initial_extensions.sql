-- Migration: 001_initial_extensions.sql
-- Description: Enable required PostgreSQL extensions and utility trigger functions
-- Author: KNOWFLOW Team

-- 1. Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enable pgvector for embedding storage and similarity search
-- Vector dimension for all-MiniLM-L6-v2 is 384
CREATE EXTENSION IF NOT EXISTS "vector";

-- 3. Utility function for automatically updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
