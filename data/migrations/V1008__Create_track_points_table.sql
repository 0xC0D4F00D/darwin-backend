-- Tables --------------------------------------------------------------------

CREATE TABLE main.track_points (
    id uuid PRIMARY KEY,
    track_id uuid,
    captured_at timestamptz,
    geom geometry(POINT, 4326),
    altitude float8,
    horizontal_accuracy float8,
    vertical_accuracy float8,
    course float8,
    speed float8,
    created_at timestamptz,
    updated_at timestamptz
);

ALTER TABLE main.track_points OWNER TO darwin_user;

-- Indexes -------------------------------------------------------------------

CREATE INDEX ON main.track_points (track_id);
CREATE INDEX ON main.track_points USING GIST (geom);

-- Triggers ------------------------------------------------------------------

CREATE FUNCTION main.track_points__sanitize_dates() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_at := now();
        NEW.updated_at := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.created_at := OLD.created_at;
        NEW.updated_at := now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION main.track_points__sanitize_dates() OWNER TO darwin_user;

CREATE TRIGGER sanitize_dates_trg
    BEFORE INSERT OR UPDATE
    ON main.track_points
    FOR EACH ROW
    EXECUTE PROCEDURE main.track_points__sanitize_dates();

-- ---------------------------------------------------------------------------