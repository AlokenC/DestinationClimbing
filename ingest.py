import requests
import psycopg2
import time

def get_db_connection():
    return psycopg2.connect(
        host="localhost", 
        database="climbweather",
        user="postgres",
        password="1234"
    )

def get_colorado_subregions():
    url = "https://api.openbeta.io/"
    query = """
    query {
      areas(filter: {area_name: {match: "Colorado"}}) {
        areaName
        uuid
        children {
          areaName
          uuid
        }
      }
    }
    """
    response = requests.post(
        url,
        headers={"content-type": "application/json"},
        json={"query": query},
        timeout=15
    )
    
    data = response.json()
    areas = data["data"]["areas"]
    
    # Find the one that's actually named exactly "Colorado", not a fuzzy partial match
    colorado = next((a for a in areas if a["areaName"] == "Colorado"), None)
    
    if colorado is None:
        raise ValueError("Could not find an area named exactly 'Colorado'")
    
    print(f"Found real Colorado area with {len(colorado['children'])} sub-regions")
    return colorado["children"]


def get_subregion_data(uuid):
    url = "https://api.openbeta.io/"
    query = """
    query MyQuery {
      area(uuid: "%s") {
        areaName
        uuid
        metadata { lat lng }
        climbs {
          uuid
          name
          grades { vscale font }
          type { bouldering }
        }
        children {
          areaName
          uuid
          metadata { lat lng }
          climbs {
            uuid
            name
            grades { vscale font }
            type { bouldering }
          }
          children {
            areaName
            uuid
            metadata { lat lng }
            climbs {
              uuid
              name
              grades { vscale font }
              type { bouldering }
            }
          }
        }
      }
    }
    """ % uuid
    
    response = requests.post(url, headers={"content-type": "application/json"}, json={"query": query})
    
    if response.status_code != 200 or not response.text:
        print(f"FAILED to fetch uuid {uuid}")
        return None
    
    data = response.json()
    return data["data"]["area"]



def insert_area(area, cur, parent_db_id=None):
    if area is None:
        return
    
    metadata = area.get("metadata") or {}
    
    cur.execute(
        """
        INSERT INTO areas (uuid, area_name, parent_id, lat, lng)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (uuid) DO NOTHING
        RETURNING id;
        """,
        (
            area.get("uuid"),
            area.get("areaName"),
            parent_db_id,
            metadata.get("lat"),
            metadata.get("lng"),
        )
    )
    
    result = cur.fetchone()
    if result is None:
        # Area already existed (ON CONFLICT triggered) — look up its id instead
        cur.execute("SELECT id FROM areas WHERE uuid = %s;", (area.get("uuid"),))
        this_area_id = cur.fetchone()[0]
    else:
        this_area_id = result[0]
    
    # Insert climbs at this level
    climbs = area.get("climbs") or []
    for climb in climbs:
        grades = climb.get("grades") or {}
        climb_type = climb.get("type") or {}
        is_boulder = climb_type.get("bouldering")
        
        if not is_boulder:
            continue  # skip non-boulder climbs
        
        cur.execute(
            """
            INSERT INTO climbs (uuid, climb_name, area_key, is_boulder, grade_v, grade_f)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (uuid) DO NOTHING;
            """,
            (
                climb.get("uuid"),
                climb.get("name"),
                this_area_id,
                is_boulder,
                grades.get("vscale"),
                grades.get("font"),
            )
        )
    
    # Recurse into children
    children = area.get("children") or []
    for child in children:
        insert_area(child, cur, parent_db_id=this_area_id)


if __name__ == "__main__":
    conn = get_db_connection()
    cur = conn.cursor()
    
    subregions = get_colorado_subregions()
    print(f"Found {len(subregions)} sub-regions to process")
    
    for region in subregions:
        print(f"Fetching: {region['areaName']}...")
        area_data = get_subregion_data(region["uuid"])
        
        if area_data:
            insert_area(area_data, cur)
            conn.commit()  # commit after each sub-region, not all at once
            print(f"  Inserted successfully")
        
        time.sleep(1)  # stay polite to OpenBeta's server
    
    cur.close()
    conn.close()
    print("Done.")