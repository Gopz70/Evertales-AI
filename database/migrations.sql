-- Migration: Add is_public field to Stories table
-- Purpose: Enable public/private story visibility
-- Date: August 2026

ALTER TABLE Stories ADD COLUMN is_public BOOLEAN DEFAULT FALSE AFTER is_favorite;

-- Note: If you already have this column, this migration will fail safely.
-- In that case, you can ignore the error and continue.
