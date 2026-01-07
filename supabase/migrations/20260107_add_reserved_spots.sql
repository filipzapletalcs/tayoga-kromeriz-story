-- Migration: Add reserved_spots column to one_time_classes
-- Run this in Supabase SQL Editor

-- Add reserved_spots column for pre-filled registrations (e.g., phone reservations)
ALTER TABLE one_time_classes
ADD COLUMN IF NOT EXISTS reserved_spots INTEGER NOT NULL DEFAULT 0;

-- Add comment explaining the field
COMMENT ON COLUMN one_time_classes.reserved_spots IS 'Number of spots already reserved outside the online system (phone reservations, etc.)';

-- Update the capacity check function to account for reserved spots
CREATE OR REPLACE FUNCTION check_one_time_class_capacity(p_class_id UUID)
RETURNS BOOLEAN AS $$
  SELECT (
    SELECT capacity - COALESCE(reserved_spots, 0)
    FROM one_time_classes
    WHERE id = p_class_id
  ) > (
    SELECT COUNT(*)
    FROM registrations
    WHERE one_time_class_id = p_class_id
  );
$$ LANGUAGE SQL;
