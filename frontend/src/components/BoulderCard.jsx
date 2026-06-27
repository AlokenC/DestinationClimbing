import { Link } from 'react-router-dom'
import { MapPin, Thermometer, Wind } from 'lucide-react'
import GradeTag from './GradeTag'
import ClimbabilityBadge from './ClimbabilityBadge'
import { getArea, getWeatherForBoulder } from '../api/client'

export default function BoulderCard({ boulder }) {
  const area = getArea(boulder.area_key)
  const weather = getWeatherForBoulder(boulder)

  return (
    <Link
      to={`/boulder/${boulder.key}`}
      className="group block rounded-2xl border border-rock-800 bg-rock-900 p-5 hover:border-rock-700 hover:bg-rock-800/60 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-rock-100 group-hover:text-white transition-colors">
            {boulder.name}
          </h3>
          {area && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-rock-500">
              <MapPin size={11} />
              <span className="truncate">{area.name}</span>
            </div>
          )}
        </div>
        <GradeTag gradeV={boulder.grade_v} gradeFont={boulder.grade_font} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-rock-400 leading-relaxed">
        {boulder.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-rock-800 pt-4">
        {weather ? (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-rock-400">
              <Thermometer size={13} className="text-orange-400" />
              {weather.temperature}°F
            </span>
            <span className="flex items-center gap-1.5 text-xs text-rock-400">
              <Wind size={13} className="text-sky-400" />
              {weather.wind_speed} mph
            </span>
          </div>
        ) : (
          <span className="text-xs text-rock-600">No weather data</span>
        )}
        {weather && <ClimbabilityBadge score={weather.climbability} />}
      </div>
    </Link>
  )
}
