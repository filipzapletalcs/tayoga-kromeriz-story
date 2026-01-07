-- Migration: Add reserved_spots column to recurring_classes and workshops
-- Run this in Supabase SQL Editor

-- 1. Add reserved_spots to recurring_classes
ALTER TABLE recurring_classes
ADD COLUMN IF NOT EXISTS reserved_spots INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN recurring_classes.reserved_spots IS 'Number of spots already reserved outside the online system (phone reservations, etc.). Applies to all instances.';

-- 2. Add reserved_spots to workshops
ALTER TABLE workshops
ADD COLUMN IF NOT EXISTS reserved_spots INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN workshops.reserved_spots IS 'Number of spots already reserved outside the online system (phone reservations, etc.)';

-- 3. Update check_capacity function for recurring classes to account for reserved spots
CREATE OR REPLACE FUNCTION check_capacity(instance_id UUID)
RETURNS BOOLEAN AS $$
  SELECT (
    SELECT COALESCE(ci.capacity_override, rc.capacity) - COALESCE(rc.reserved_spots, 0)
    FROM class_instances ci
    JOIN recurring_classes rc ON ci.recurring_class_id = rc.id
    WHERE ci.id = instance_id
  ) > (
    SELECT COUNT(*)
    FROM registrations
    WHERE class_instance_id = instance_id
  );
$$ LANGUAGE SQL;

-- 4. Update check_workshop_capacity to account for reserved spots
CREATE OR REPLACE FUNCTION check_workshop_capacity(p_workshop_id UUID)
RETURNS BOOLEAN AS $$
  SELECT (
    SELECT capacity - COALESCE(reserved_spots, 0)
    FROM workshops
    WHERE id = p_workshop_id
  ) > (
    SELECT COUNT(*)
    FROM registrations
    WHERE workshop_id = p_workshop_id
  );
$$ LANGUAGE SQL;
