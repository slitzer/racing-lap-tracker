-- Add layout metadata columns to track_layouts
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS pit_speed_limit_high_kph INTEGER;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS max_ai_participants INTEGER;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS race_date_year INTEGER;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS race_date_month INTEGER;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS race_date_day INTEGER;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS track_surface TEXT;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS track_type TEXT;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS track_grade_filter TEXT;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS number_of_turns INTEGER;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS track_time_zone TEXT;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS track_altitude TEXT;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS length TEXT;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS dlc_id TEXT;
ALTER TABLE track_layouts ADD COLUMN IF NOT EXISTS location TEXT;
