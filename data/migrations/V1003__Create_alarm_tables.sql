-- Tables --------------------------------------------------------------------

CREATE TABLE main.alarms (
    id bigserial PRIMARY KEY,
    user_alt_id bigint REFERENCES main.users (alt_id),
    status int,
    geom geometry(POINT, 4326),
    accuracy float8,
    created_at timestamptz,
    updated_at timestamptz
);

ALTER TABLE main.alarms OWNER TO darwin_user;

-- Indexes -------------------------------------------------------------------

CREATE INDEX ON main.alarms (status);
CREATE INDEX ON main.alarms USING GIST (geom);

-- Triggers ------------------------------------------------------------------

CREATE FUNCTION main.alarms__sanitize_dates() RETURNS TRIGGER AS $$
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

ALTER FUNCTION main.alarms__sanitize_dates() OWNER TO darwin_user;

CREATE TRIGGER sanitize_dates_trg
    BEFORE INSERT OR UPDATE
    ON main.alarms
    FOR EACH ROW
    EXECUTE PROCEDURE main.alarms__sanitize_dates();

-- ---------------------------------------------------------------------------
