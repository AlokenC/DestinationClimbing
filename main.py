from fastapi import FastAPI
import psycopg2

app = FastAPI()

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="climbweather",
        user="postgres",
        password="1234"
    )

@app.get("/search")
def search(q:str):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT 
        """
    )
    cur.close
    conn.close
