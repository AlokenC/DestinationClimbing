import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'

// Fix Leaflet's broken default icon paths when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function climbabilityColor(score) {
  if (score === undefined || score === null) return '#6e5f56'
  if (score >= 80) return '#34d399' // emerald
  if (score >= 60) return '#fbbf24' // amber
  return '#f87171' // red
}

function FitBounds({ boulders }) {
  const map = useMap()
  useEffect(() => {
    if (!boulders?.length) return
    const coords = boulders
      .filter((b) => b.latitude && b.longitude)
      .map((b) => [b.latitude, b.longitude])
    if (coords.length) {
      map.fitBounds(coords, { padding: [40, 40], maxZoom: 13 })
    }
  }, [boulders, map])
  return null
}

export default function ClimbMap({
  boulders = [],
  weatherByArea = {},
  center = [39.7392, -104.9903],
  zoom = 8,
  height = '400px',
  fitToBoulders = false,
  singleBoulder = null,
}) {
  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={singleBoulder ? [singleBoulder.latitude, singleBoulder.longitude] : center}
        zoom={singleBoulder ? 14 : zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={!singleBoulder}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {fitToBoulders && <FitBounds boulders={boulders} />}

        {boulders.map((b) => {
          if (!b.latitude || !b.longitude) return null
          const weather = weatherByArea[b.area_key]
          const color = climbabilityColor(weather?.climbability)

          return (
            <CircleMarker
              key={b.key}
              center={[b.latitude, b.longitude]}
              radius={singleBoulder ? 10 : 7}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.85,
                color: '#0b0a09',
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="min-w-[160px] p-3">
                  <p className="font-semibold text-rock-100 text-sm">{b.name}</p>
                  <p className="text-xs text-rock-400 mt-0.5">{b.grade_v}</p>
                  {weather && (
                    <p className="text-xs text-rock-400 mt-1">
                      {weather.temperature}°F · {weather.conditions}
                    </p>
                  )}
                  <Link
                    to={`/boulder/${b.key}`}
                    className="mt-2 inline-block text-xs font-medium text-orange-400 hover:text-orange-300"
                  >
                    View details →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}

        {singleBoulder && (
          <CircleMarker
            center={[singleBoulder.latitude, singleBoulder.longitude]}
            radius={12}
            pathOptions={{
              fillColor: '#f97316',
              fillOpacity: 0.9,
              color: '#fff',
              weight: 2,
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
