DROP FUNCTION IF EXISTS main.trigger_alarm(uuid, float8, float8, float8);

CREATE OR REPLACE FUNCTION main.trigger_alarm
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
    var__alarm_record main.alarms;

BEGIN

    SELECT * INTO var__user_record
    FROM main.users WHERE id = arg__user_id::uuid LIMIT 1;

    IF var__user_record IS NULL THEN
        INSERT INTO main.users (id) VALUES (arg__user_id)
        RETURNING * INTO var__user_record;
    END IF;

    INSERT INTO main.alarms(user_alt_id, status, geom, accuracy)
    VALUES (
        var__user_record.alt_id,
        1,
        ST_SetSRID(ST_Point(arg__lon, arg__lat), 4326),
        arg__accuracy
    )
    RETURNING * INTO var__alarm_record;

    -- Найти пользователей, которых нужно уведомить
    FOR var__user_record IN
        SELECT
          a.id,
          a.token
        FROM main.users a
        LEFT OUTER JOIN main.users b ON ST_Intersects(
          a.geom,
          ST_Transform(
            ST_Buffer(
              ST_Transform(b.geom, 3857),
              5000 -- Area of interest
            ),
            4326
          )
        )
        WHERE b.id = arg__user_id AND NOT a.id = arg__user_id
    LOOP
        RETURN NEXT var__user_record;
    END LOOP;

END;

$$;

ALTER FUNCTION main.trigger_alarm(uuid, float8, float8, float8) OWNER TO darwin_user;