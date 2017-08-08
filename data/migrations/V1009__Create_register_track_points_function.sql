DROP FUNCTION IF EXISTS main.register_track_points(jsonb);

CREATE OR REPLACE FUNCTION main.register_track_points
(
    arg__data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql

AS $$

DECLARE

  var__point jsonb;
  var__track_id uuid;
  var__track_record main.tracks;
  var__track_point_id uuid;
  var__track_point_record main.track_points;
  var__result jsonb = '[]'::jsonb;

BEGIN

  FOR var__point IN SELECT * FROM jsonb_array_elements(arg__data)
  LOOP
    var__track_id := (var__point->>'trackId')::uuid;

    SELECT * INTO var__track_record
    FROM main.tracks
    WHERE id = var__track_id LIMIT 1;

    IF var__track_record IS NULL THEN
        INSERT INTO main.tracks (id) VALUES (var__track_id)
        RETURNING * INTO var__track_record;
    END IF;

    var__track_point_id := (var__point->>'id')::uuid;
    
    SELECT * INTO var__track_point_record
    FROM main.track_points
    WHERE track_id = var__track_id
    AND id = var__track_point_id;

    IF var__track_point_record IS NULL THEN
        INSERT INTO main.track_points (
          id, track_id, captured_at, geom, altitude,
          horizontal_accuracy, vertical_accuracy,
          course, speed
        ) VALUES (
          var__track_point_id,
          var__track_id,
          to_timestamp((var__point->>'capturedAt')::float8),
          ST_SetSRID(ST_Point(
            (var__point->>'longitude')::float8,
            (var__point->>'latitude')::float8
          ), 4326),
          (var__point->>'altitude')::float8,
          (var__point->>'horizontalAccuracy')::float8,
          (var__point->>'verticalAccuracy')::float8,
          (var__point->>'course')::float8,
          (var__point->>'speed')::float8
        ) RETURNING * INTO var__track_point_record;
    END IF;

    var__result := var__result || jsonb_build_object(
      'tid', var__track_id::text,
      'pid', var__track_point_id::text
    );
    
  END LOOP;

  RETURN var__result;
END;

$$;

ALTER FUNCTION main.register_track_points(jsonb) OWNER TO darwin_user;


-- SELECT * FROM main.register_track_points($$[
--     {
--         "id": "3a4cca90-89fd-471f-8286-55e98f8216a8",
--         "trackId": "355beffb-fcc9-4820-b598-0f16a21df96c",
--         "capturedAt": "1502205754.858",
--         "latitude": "12.34",
--         "longitude": "56.78",
--         "altitude": "90.12",
--         "horizontalAccuracy": "12.34",
--         "verticalAccuracy": "56.78",
--         "course": "90.12",
--         "speed": "34.78"
--     },
--     {
--         "id": "854b59fa-31dd-4d3b-9f7c-f385d6d7a2a7",
--         "trackId": "355beffb-fcc9-4820-b598-0f16a21df96c",
--         "capturedAt": "1502205882.355",
--         "latitude": "112.34",
--         "longitude": "156.78",
--         "altitude": "190.12",
--         "horizontalAccuracy": "112.34",
--         "verticalAccuracy": "156.78",
--         "course": "190.12",
--         "speed": "134.78"
--     }
-- ]$$::jsonb);