-- Tables --------------------------------------------------------------------

CREATE TABLE main.users (
    id uuid PRIMARY KEY,
    alt_id bigserial,
    token text,
    platform text,
    geom geometry(POINT, 4326),
    accuracy float8,
    created_at timestamptz,
    updated_at timestamptz
);

ALTER TABLE main.users OWNER TO darwin_user;

-- Indexes -------------------------------------------------------------------

CREATE UNIQUE INDEX ON main.users (alt_id);
CREATE INDEX ON main.users USING GIST (geom);

-- Triggers ------------------------------------------------------------------

CREATE FUNCTION main.users__sanitize_dates() RETURNS TRIGGER AS $$
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

ALTER FUNCTION main.users__sanitize_dates() OWNER TO darwin_user;

CREATE TRIGGER sanitize_dates_trg
    BEFORE INSERT OR UPDATE
    ON main.users
    FOR EACH ROW
    EXECUTE PROCEDURE main.users__sanitize_dates();

-- ---------------------------------------------------------------------------
