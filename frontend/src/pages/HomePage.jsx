import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cloud, Thermometer } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ClimbMap from '../components/ClimbMap'
import ClimbabilityBadge from '../components/ClimbabilityBadge'
import GradeTag from '../components/GradeTag'
import { getAllBoulders, getArea, getWeatherForArea, getAllAreas } from '../api/client'
import { WEATHER } from '../api/mockData'

function AreaConditionCard({ area }) {
  const weather = getWeatherForArea(area.key)
  if (!weather) return null

  return (
    <Link
      to={`/search?area=${area.key}`}
      className="group rounded-2xl border border-rock-800 bg-rock-900 p-5 hover:border-rock-700 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-rock-100 text-sm group-hover:text-white transition-colors line-clamp-1">
            {area.name}
          </h3>
          <p className="text-xs text-rock-500 mt-1">{weather.conditions}</p>
        </div>
        <ClimbabilityBadge score={weather.climbability} showLabel={false} />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-rock-400">
          <Thermometer size={12} className="text-orange-400" />
          {weather.temperature}°F
        </span>
        <span className="flex items-center gap-1.5 text-xs text-rock-400">
          <Cloud size={12} className="text-sky-400" />
          {weather.cloud_cover}% cloud
        </span>
      </div>
    </Link>
  )
}

function FeaturedBoulderCard({ boulder }) {
  const area = getArea(boulder.area_key)
  return (
    <Link
      to={`/boulder/${boulder.key}`}
      className="group flex items-center justify-between rounded-xl border border-rock-800 bg-rock-900 px-5 py-4 hover:border-rock-700 hover:bg-rock-800/50 transition-all duration-200"
    >
      <div className="min-w-0">
        <p className="font-medium text-rock-100 group-hover:text-white transition-colors text-sm">
          {boulder.name}
        </p>
        {area && <p className="text-xs text-rock-500 mt-0.5 truncate">{area.name}</p>}
      </div>
      <div className="flex items-center gap-3 ml-3 flex-shrink-0">
        <GradeTag gradeV={boulder.grade_v} />
        <ArrowRight size={14} className="text-rock-600 group-hover:text-orange-400 transition-colors" />
      </div>
    </Link>
  )
}

export default function HomePage() {
  const boulders = useMemo(() => getAllBoulders(), [])
  const areas = useMemo(() => getAllAreas(), [])

  const weatherByArea = useMemo(() => {
    return WEATHER.reduce((acc, w) => {
      acc[w.area_key] = w
      return acc
    }, {})
  }, [])

  const featuredBoulders = useMemo(
    () => boulders.filter((b) => b.youtube_ids?.length > 0 || b.key <= 5).slice(0, 6),
    [boulders]
  )

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rock-800 bg-gradient-to-b from-rock-900 to-rock-950">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 40%)`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-800/40 bg-orange-950/30 px-3 py-1.5 text-xs font-medium text-orange-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Colorado Bouldering · Live Conditions
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-rock-100 sm:text-5xl md:text-6xl">
            Know before <br />
            <span className="text-orange-500">you go.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-rock-400 leading-relaxed">
            Weather, beta, and conditions for Colorado's best bouldering — all in one place.
            No more juggling five apps to plan a climbing day.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar large />
          </div>
          <p className="mt-4 text-xs text-rock-600">
            Try: "Eldorado", "V5", "Flagstaff", "Horsetooth"
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="border-b border-rock-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-rock-100">Conditions Map</h2>
              <p className="mt-1 text-sm text-rock-500">
                Pin color = climbability.{' '}
                <span className="text-emerald-400">Green</span> is great,{' '}
                <span className="text-amber-400">yellow</span> is fair,{' '}
                <span className="text-red-400">red</span> is poor.
              </p>
            </div>
            <Link
              to="/search"
              className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ClimbMap
            boulders={boulders}
            weatherByArea={weatherByArea}
            height="460px"
            fitToBoulders
          />
        </div>
      </section>

      {/* Today's Conditions */}
      <section className="border-b border-rock-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h2 className="text-xl font-bold text-rock-100 mb-5">Today's Conditions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <AreaConditionCard key={area.key} area={area} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Boulders */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-rock-100">Featured Problems</h2>
            <Link
              to="/search"
              className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
            >
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredBoulders.map((b) => (
              <FeaturedBoulderCard key={b.key} boulder={b} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rock-800 py-8 text-center text-xs text-rock-600">
        <p>
          Styrkur — Colorado Bouldering · Built for climbers, by climbers ·{' '}
          <span className="text-rock-700">Data sourced from Mountain Project, Meteoblue, Open-Meteo</span>
        </p>
      </footer>
    </main>
  )
}
