-- Migration: Add 2 new categories to EverTales AI
-- Date: 2026-08-12
-- Description: Adds 'Relationships & Love' and 'Moments & Milestones' categories

-- Add new categories
INSERT INTO Categories (category_name) VALUES
    ('Relationships & Love'),
    ('Moments & Milestones');

-- Verify insertion
SELECT * FROM Categories ORDER BY category_id;
