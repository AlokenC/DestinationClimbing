from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras

app = FastAPI()

# Frontend runs on Vite's default dev port. Add your prod origin here later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="climbweather",
        user="postgres",
        password="1234"
    )


# Column aliases below map DB names (area_name, lat, parent_id, grade_f...)
# to the field names the frontend's mock data already uses (name, latitude,
# parent_key, grade_font...) so client.js doesn't have to change shape.

@app.get("/areas")
def get_areas():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT id AS key, area_name AS name, lat AS latitude, lng AS longitude,
               parent_id AS parent_key
        FROM areas
        ORDER BY area_name;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


@app.get("/area/{area_id}")
def get_area(area_id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("""
        SELECT id AS key, area_name AS name, lat AS latitude, lng AS longitude,
               parent_id AS parent_key
        FROM areas
        WHERE id = %s;
    """, (area_id,))
    area = cur.fetchone()

    if not area:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Area not found")

    # Freshest prediction per forecast hour: partition by hour, keep latest fetch.
    cur.execute("""
        SELECT DISTINCT ON (forecast_time)
               temperature, precipitation, cloud_cover, humidity, wind_speed,
               snowfall, soil_moisture, climbability, forecast_time, time_fetched
        FROM weather_cache
        WHERE area_key = %s
        ORDER BY forecast_time ASC, time_fetched DESC;
    """, (area_id,))
    weather = cur.fetchall()

    cur.close()
    conn.close()

    area["weather"] = weather
    return area


@app.get("/boulders")
def get_boulders():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT id AS key, uuid AS source_uuid, climb_name AS name, grade_v,
               grade_f AS grade_font, lat AS latitude, lng AS longitude,
               area_key, is_boulder, description
        FROM climbs
        WHERE is_boulder = true
        ORDER BY climb_name;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


@app.get("/boulder/{climb_id}")
def get_boulder(climb_id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT id AS key, uuid AS source_uuid, climb_name AS name, grade_v,
               grade_f AS grade_font, lat AS latitude, lng AS longitude,
               area_key, is_boulder, description
        FROM climbs
        WHERE id = %s;
    """, (climb_id,))
    climb = cur.fetchone()
    cur.close()
    conn.close()

    if not climb:
        raise HTTPException(status_code=404, detail="Boulder not found")
    return climb


@app.get("/search")
def search(q: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    like = f"%{q}%"
    cur.execute("""
        SELECT climbs.id AS key, climbs.climb_name AS name, climbs.grade_v,
               climbs.grade_f AS grade_font, climbs.lat AS latitude,
               climbs.lng AS longitude, climbs.area_key, climbs.is_boulder,
               climbs.description
        FROM climbs
        JOIN areas ON climbs.area_key = areas.id
        WHERE climbs.is_boulder = true
          AND (climbs.climb_name ILIKE %s OR areas.area_name ILIKE %s)
        ORDER BY climbs.climb_name;
    """, (like, like))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
