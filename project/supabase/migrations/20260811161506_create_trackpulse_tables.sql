/*
# TRACKPULSE — Core Database Schema

## Purpose
Creates the three tables needed to persist AI track-condition analysis sessions,
per-frame predictions, and optional weather observations for the TRACKPULSE
racing intelligence dashboard.

## New Tables

### 1. analysis_sessions
Stores a single analysis session (one image upload, one video upload, or a batch).
- `id` — UUID primary key
- `created_at` — session creation timestamp
- `track_name` — name of the circuit (e.g. "Silverstone GP")
- `race_name` — name of the race event (e.g. "British Grand Prix")
- `session_type` — origin type: IMAGE, VIDEO, BATCH, or DEMO
- `current_condition` — latest classified track condition: DRY, DAMP, WET, or DRYING
- `confidence` — AI confidence score (0.0–1.0)
- `trend` — computed trend direction: IMPROVING, WORSENING, STABLE, or UNCERTAIN
- `recommendation` — human-readable tyre strategy suggestion text
- `wetness_score` — numeric wetness (0.0–1.0) derived from condition
- `frame_count` — number of frames analyzed in this session

### 2. frame_analyses
Stores individual frame/image predictions belonging to a session.
- `id` — UUID primary key
- `session_id` — foreign key → analysis_sessions.id (CASCADE on delete)
- `timestamp` — time offset within the video (seconds) or 0 for single images
- `condition` — classified condition for this frame
- `confidence` — AI confidence for this frame (0.0–1.0)
- `wetness_score` — numeric wetness for this frame
- `probabilities` — JSONB of per-class probabilities {DRY, DAMP, WET, DRYING}
- `image_path` — optional path/URL to the stored frame image
- `created_at` — row creation timestamp

### 3. weather_observations
Stores optional manually-entered or API-fetched weather data for a session.
- `id` — UUID primary key
- `session_id` — foreign key → analysis_sessions.id (CASCADE on delete)
- `temperature` — air temperature in °C
- `humidity` — relative humidity %
- `rain_probability` — chance of rain %
- `wind_speed` — wind speed in km/h
- `track_temperature` — track surface temperature in °C (nullable)
- `created_at` — row creation timestamp

## Security
- RLS enabled on all three tables.
- This is a single-tenant hackathon app with NO sign-in screen, so all CRUD
  policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because the data is intentionally shared/public across the demo.
- No user_id columns, no auth.uid() checks.

## Indexes
- `frame_analyses.session_id` — every query for a session's frames filters on this
- `weather_observations.session_id` — same pattern for weather lookups
- `analysis_sessions.created_at` DESC — history page lists sessions newest-first

## Important Notes
1. All tables use `gen_random_uuid()` for primary keys.
2. Foreign keys cascade on delete so removing a session cleans up its frames and weather.
3. `probabilities` is JSONB to store the four-class probability distribution flexibly.
4. The schema is PostgreSQL-compatible and works with the Supabase instance.
*/

-- ========================================================
-- 1. analysis_sessions
-- ========================================================
CREATE TABLE IF NOT EXISTS analysis_sessions (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      timestamptz NOT NULL DEFAULT now(),
    track_name      text NOT NULL DEFAULT 'Unknown Circuit',
    race_name       text NOT NULL DEFAULT 'Unknown Race',
    session_type    text NOT NULL DEFAULT 'IMAGE',
    current_condition text NOT NULL DEFAULT 'DRY',
    confidence      double precision NOT NULL DEFAULT 0.0,
    trend           text NOT NULL DEFAULT 'STABLE',
    recommendation  text NOT NULL DEFAULT '',
    wetness_score   double precision DEFAULT 0.0,
    frame_count     integer NOT NULL DEFAULT 0
);

ALTER TABLE analysis_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_analysis_sessions" ON analysis_sessions;
CREATE POLICY "anon_select_analysis_sessions"
    ON analysis_sessions FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_analysis_sessions" ON analysis_sessions;
CREATE POLICY "anon_insert_analysis_sessions"
    ON analysis_sessions FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_analysis_sessions" ON analysis_sessions;
CREATE POLICY "anon_update_analysis_sessions"
    ON analysis_sessions FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_analysis_sessions" ON analysis_sessions;
CREATE POLICY "anon_delete_analysis_sessions"
    ON analysis_sessions FOR DELETE
    TO anon, authenticated USING (true);

-- ========================================================
-- 2. frame_analyses
-- ========================================================
CREATE TABLE IF NOT EXISTS frame_analyses (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      uuid NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    timestamp       double precision NOT NULL DEFAULT 0,
    condition       text NOT NULL DEFAULT 'DRY',
    confidence      double precision NOT NULL DEFAULT 0.0,
    wetness_score   double precision NOT NULL DEFAULT 0.0,
    probabilities   jsonb,
    image_path      text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE frame_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_frame_analyses" ON frame_analyses;
CREATE POLICY "anon_select_frame_analyses"
    ON frame_analyses FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_frame_analyses" ON frame_analyses;
CREATE POLICY "anon_insert_frame_analyses"
    ON frame_analyses FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_frame_analyses" ON frame_analyses;
CREATE POLICY "anon_update_frame_analyses"
    ON frame_analyses FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_frame_analyses" ON frame_analyses;
CREATE POLICY "anon_delete_frame_analyses"
    ON frame_analyses FOR DELETE
    TO anon, authenticated USING (true);

-- ========================================================
-- 3. weather_observations
-- ========================================================
CREATE TABLE IF NOT EXISTS weather_observations (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      uuid NOT NULL REFERENCES analysis_sessions(id) ON DELETE CASCADE,
    temperature     double precision NOT NULL DEFAULT 0,
    humidity        double precision NOT NULL DEFAULT 0,
    rain_probability double precision NOT NULL DEFAULT 0,
    wind_speed      double precision NOT NULL DEFAULT 0,
    track_temperature double precision,
    created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE weather_observations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_weather_observations" ON weather_observations;
CREATE POLICY "anon_select_weather_observations"
    ON weather_observations FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_weather_observations" ON weather_observations;
CREATE POLICY "anon_insert_weather_observations"
    ON weather_observations FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_weather_observations" ON weather_observations;
CREATE POLICY "anon_update_weather_observations"
    ON weather_observations FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_weather_observations" ON weather_observations;
CREATE POLICY "anon_delete_weather_observations"
    ON weather_observations FOR DELETE
    TO anon, authenticated USING (true);

-- ========================================================
-- Indexes
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_frame_analyses_session_id ON frame_analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_weather_observations_session_id ON weather_observations(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_created_at ON analysis_sessions(created_at DESC);
