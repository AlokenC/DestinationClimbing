import { Thermometer, Wind, Droplets, Cloud, Eye } from 'lucide-react'
import ClimbabilityBadge from './ClimbabilityBadge'

function Stat({ icon: Icon, label, value, iconColor }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-rock-900/70 px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon size={16} className={iconColor} />
        <span className="text-sm text-rock-400">{label}</span>
      </div>
      <span className="text-sm font-semibold text-rock-100">{value}</span>
    </div>
  )
}

function getConditionEmoji(conditions) {
  const c = (conditions ?? '').toLowerCase()
  if (c.includes('storm') || c.includes('rain')) return '⛈'
  if (c.includes('overcast') || c.includes('cloudy')) return '☁️'
  if (c.includes('partly')) return '⛅'
  if (c.includes('clear') || c.includes('sunny')) return '☀️'
  return '🌤'
}

function climbabilityExplain(score) {
  if (score >= 85) return 'Excellent conditions — get out there.'
  if (score >= 70) return 'Good conditions with minor caveats.'
  if (score >= 55) return 'Manageable, but not ideal.'
  if (score >= 40) return 'Conditions are marginal — consider waiting.'
  return 'Poor conditions — not recommended today.'
}

export default function WeatherCard({ weather }) {
  if (!weather) {
    return (
      <div className="rounded-2xl border border-rock-800 bg-rock-900 p-6 text-center text-rock-500 text-sm">
        No weather data available.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-rock-800 bg-rock-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{getConditionEmoji(weather.conditions)}</span>
            <span className="text-xl font-bold text-rock-100">
              {weather.temperature}°F
            </span>
          </div>
          <p className="mt-1 text-sm text-rock-400">{weather.conditions}</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-rock-500 mb-1.5">
            Climbability
          </div>
          <ClimbabilityBadge score={weather.climbability} />
        </div>
      </div>

      <div className="space-y-2">
        <Stat
          icon={Wind}
          label="Wind"
          value={`${weather.wind_speed} mph`}
          iconColor="text-sky-400"
        />
        <Stat
          icon={Cloud}
          label="Cloud Cover"
          value={`${weather.cloud_cover}%`}
          iconColor="text-rock-400"
        />
        <Stat
          icon={Droplets}
          label="Humidity"
          value={`${weather.humidity}%`}
          iconColor="text-blue-400"
        />
        <Stat
          icon={Eye}
          label="Precipitation"
          value={weather.precipitation === 0 ? 'None' : `${weather.precipitation}"`}
          iconColor="text-indigo-400"
        />
      </div>

      <div className="mt-4 rounded-xl border border-rock-700/50 bg-rock-800/40 px-4 py-3">
        <p className="text-xs text-rock-400">{climbabilityExplain(weather.climbability)}</p>
      </div>

      <p className="mt-3 text-right text-xs text-rock-600">
        Updated{' '}
        {new Date(weather.time_fetched).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  )
}
