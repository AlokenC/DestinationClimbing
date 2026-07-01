import requests 
import psycopg2
from datetime import datetime
import time
import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="localhost", 
        database="climbweather",
        user="postgres",
        password="1234"
    )

def get_areas_with_coords(cur):
    cur.execute("SELECT id, lat, lng FROM areas WHERE lat IS NOT NULL AND lng IS NOT NULL")
    return cur.fetchall()

cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

def get_weather_data(lat, lng):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
    "latitude": lat,
    "longitude": lng,
    "hourly": [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation_probability",
        "precipitation",
        "snowfall",
        "wind_speed_10m",
        "cloud_cover",
        "soil_moisture_0_to_1cm"
    ],
}
    responses = openmeteo.weather_api(url, params = params)
    response = responses[0]
    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_precipitation_probability = hourly.Variables(1).ValuesAsNumpy()
    hourly_precipitation = hourly.Variables(2).ValuesAsNumpy()
    hourly_snowfall = hourly.Variables(3).ValuesAsNumpy()
    hourly_wind_speed_10m = hourly.Variables(4).ValuesAsNumpy()
    hourly_cloud_cover = hourly.Variables(5).ValuesAsNumpy()
    hourly_soil_moisture_0_to_1cm = hourly.Variables(6).ValuesAsNumpy()
    hourly_relative_humidity_2m = hourly.Variables(7).ValuesAsNumpy()

    hourly_data = {
        "date": pd.date_range(
            start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
            end =  pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
            freq = pd.Timedelta(seconds = hourly.Interval()),
            inclusive = "left"
        )
    }

    hourly_data["temperature_2m"] = hourly_temperature_2m
    hourly_data["precipitation_probability"] = hourly_precipitation_probability
    hourly_data["precipitation"] = hourly_precipitation
    hourly_data["snowfall"] = hourly_snowfall
    hourly_data["wind_speed_10m"] = hourly_wind_speed_10m
    hourly_data["cloud_cover"] = hourly_cloud_cover
    hourly_data["soil_moisture_0_to_1cm"] = hourly_soil_moisture_0_to_1cm
    hourly_data["relative_humidity_2m"] = hourly_relative_humidity_2m

    
    return pd.DataFrame(data = hourly_data)

def insert_weather(df, area_id, cur):
    fetched_at = datetime.now()
    for _, row in df.iterrows():
        cur.execute(
            """
            INSERT INTO weather_cache (area_key, temperature, precipitation, cloud_cover, humidity, wind_speed, forecast_time, time_fetched)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (area_key, forecast_time) DO NOTHING;
            """,
            (
                area_id,
                float(row["temperature_2m"]),
                float(row["precipitation"]),
                float(row["cloud_cover"]),
                float(row["relative_humidity_2m"]),
                float(row["wind_speed_10m"]),
                row["date"].to_pydatetime(),
                fetched_at
            )
        )

if __name__ == "__main__":
    conn = get_db_connection()
    cur = conn.cursor()

    areas = get_areas_with_coords(cur)
    print(f"Found {len(areas)} areas with coordinates")

    for area_id, lat, lng in areas[:3]:  # start with 3 to test
        print(f"Fetching weather for area {area_id}...")
        df = get_weather_data(lat, lng)
        insert_weather(df, area_id, cur)
        conn.commit()
        time.sleep(0.5)

    cur.close()
    conn.close()
    print("Done.")