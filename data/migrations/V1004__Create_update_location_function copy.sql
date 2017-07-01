DROP FUNCTION IF EXISTS main.update_push_token(uuid, text, text);

CREATE OR REPLACE FUNCTION main.update_push_token
(
    arg__user_id uuid,
    arg__token text,
    arg__platform text
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
    SET token = arg__token, platform = arg__platform
    WHERE id = arg__user_id
    RETURNING * INTO var__user_record;

    RETURN NEXT var__user_record;
END;

$$;

ALTER FUNCTION main.update_push_token(uuid, text, text) OWNER TO darwin_user;