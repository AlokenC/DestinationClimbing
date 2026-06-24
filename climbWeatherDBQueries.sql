CREATE TABLE areas (
        id                      SERIAL PRIMARY KEY,
        uuid            TEXT UNIQUE,
        area_name       TEXT NOT NULL,
        parent_id       INTEGER REFERENCES areas(id),
        lat                     FLOAT,
        lng                     FLOAT
);

CREATE TABLE climbs (
        id                      SERIAL PRIMARY KEY,
        uuid            TEXT UNIQUE,
        climb_name      TEXT NOT NULL,
        area_key        INTEGER REFERENCES areas(id) NOT NULL,
        lat                     FLOAT,
        lng                     FLOAT,
        is_boulder      BOOLEAN NOT NULL,
        grade_v         TEXT,
        grade_f         TEXT,
        description     TEXT
);

CREATE TABLE weather_cache (
        id                      SERIAL PRIMARY KEY,
        area_key        INTEGER REFERENCES areas(id) NOT NULL,
        temperature     FLOAT,
        precipitation FLOAT,
        cloud_cover     FLOAT,
        humidity        FLOAT,
        wind_speed      FLOAT,
        climbability FLOAT,
        forecast_time   TIMESTAMP,
        time_fetched TIMESTAMP
);


INSERT INTO areas (uuid, area_name, parent_id, lat, lng)
VALUES ('test-uuid-1', 'Flagtaff Mountain', NULL, 33.99, 33.99);

INSERT INTO areas (uuid, area_name, parent_id, lat, lng)
VALUES ('test-uuid-2', 'Monkey Traverse', 1, 33.99, 33.99);

INSERT INTO climbs (uuid, climb_name, area_key, lat, lng, is_boulder, grade_v, grade_f, description)
VALUES ('test-uuid-2', 'Chode Toad Load Mode Low SDS', 2, 39.991, -105.301, TRUE, 'V10', '7c+', 'Dream Boulder ascended by two goats with a vision.');

Select * FROM climbs