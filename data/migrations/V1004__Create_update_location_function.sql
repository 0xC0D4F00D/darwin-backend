DROP FUNCTION IF EXISTS main.update_location(uuid, float8, float8, float8);

CREATE OR REPLACE FUNCTION main.update_location
(
    arg__user_id uuid,
    arg__lat float8,
    arg__lon float8,
    arg__accuracy float8
)
RETURNS SETOF main.users
LANGUAGE plpgsql

AS $$

DECLARE

    var__user_record main.users;

BEGIN

    SELECT * INTO var__user_record
    FROM main.users WHERE id = arg__user_id::uuid LIMIT 1;

    IF var__user_record IS NULL THEN
        INSERT INTO main.users (id) VALUES (arg__user_id)
        RETURNING * INTO var__user_record;
    END IF;

    UPDATE main.users
    SET
        geom = ST_SetSRID(ST_Point(arg__lon, arg__lat), 4326),
        accuracy = arg__accuracy
    WHERE id = var__user_record.id
    RETURNING * INTO var__user_record;

    RETURN NEXT var__user_record;
END;

$$;

ALTER FUNCTION main.update_location(uuid, float8, float8, float8) OWNER TO darwin_user;

-- SELECT main.update_location('4dda91a1-c038-4a80-9202-fdd03fc3effd', 56.2965039, 43.936058900000035, 20.3);