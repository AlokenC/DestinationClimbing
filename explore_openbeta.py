import requests
import json

url = "https://stg-api.openbeta.io/"

query = """
query MyQuery {
  cragsNear(
    maxDistance: 1000000
    minDistance: 10
    lnglat: { lat: 40.01, lng: -105.37 }
    includeCrags: true
  ) {
    crags {
      areaName
      metadata {
        isBoulder
      }
      uuid
      climbs {
        id
        name
        fa
        uuid
        type {
          bouldering
        }
      }
    }
    _id
  }
}

"""

response = requests.post(
    url,
    headers={"content-type": "application/json"},
    json={"query": query}
)

print(json.dumps(response.json(), indent=2))
