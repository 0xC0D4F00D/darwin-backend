-- Tables --------------------------------------------------------------------

CREATE TABLE main.tracks (
    id uuid PRIMARY KEY,
    created_at timestamptz,
    updated_at timestamptz
);

ALTER TABLE main.tracks OWNER TO darwin_user;

-- Triggers ------------------------------------------------------------------

CREATE FUNCTION main.tracks__sanitize_dates() RETURNS TRIGGER AS $$
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

ALTER FUNCTION main.tracks__sanitize_dates() OWNER TO darwin_user;

CREATE TRIGGER sanitize_dates_trg
    BEFORE INSERT OR UPDATE
    ON main.tracks
    FOR EACH ROW
    EXECUTE PROCEDURE main.tracks__sanitize_dates();

-- ---------------------------------------------------------------------------
