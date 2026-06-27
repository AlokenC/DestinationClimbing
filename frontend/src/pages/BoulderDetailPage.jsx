import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, MapPin, Bookmark, ExternalLink, Video } from 'lucide-react'
import { getBoulder, getArea, getWeatherForBoulder } from '../api/client'
import GradeTag from '../components/GradeTag'
import WeatherCard from '../components/WeatherCard'
import VideoCard from '../components/VideoCard'
import ClimbMap from '../components/ClimbMap'
import ClimbabilityBadge from '../components/ClimbabilityBadge'

const MOCK_VIDEOS = [
  { id: 'L_jWHffIx5E', title: 'Beta sequence — the key move' },
  { id: 'vt1Pwfss5B0', title: 'Full send from low' },
]

export default function BoulderDetailPage() {
  const { id } = useParams()
  const boulder = getBoulder(id)

  if (!boulder) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-rock-400 text-lg">Boulder not found.</p>
        <Link
          to="/search"
          className="mt-4 inline-block text-sm text-orange-400 hover:text-orange-300"
        >
          ← Back to search
        </Link>
      </main>
    )
  }

  const area = getArea(boulder.area_key)
  const weather = getWeatherForBoulder(boulder)

  const videos = boulder.youtube_ids?.length > 0
    ? boulder.youtube_ids.map((id, i) => ({ id, title: MOCK_VIDEOS[i]?.title ?? `Beta video ${i + 1}` }))
    : MOCK_VIDEOS

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Breadcrumb + Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/search"
          className="flex items-center gap-1.5 text-sm text-rock-400 hover:text-rock-100 transition-colors"
        >
          <ChevronLeft size={16} />
          All boulders
        </Link>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-rock-700 bg-rock-900 px-4 py-2 text-sm font-medium text-rock-400 hover:border-rock-600 hover:text-rock-100 transition-colors">
            <Bookmark size={14} />
            Save
          </button>
          <a
            href={`https://www.mountainproject.com/search?q=${encodeURIComponent(boulder.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-rock-700 bg-rock-900 px-4 py-2 text-sm font-medium text-rock-400 hover:border-rock-600 hover:text-rock-100 transition-colors"
          >
            <ExternalLink size={14} />
            Mountain Project
          </a>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-3xl font-extrabold text-rock-100 sm:text-4xl">
            {boulder.name}
          </h1>
          <GradeTag gradeV={boulder.grade_v} gradeFont={boulder.grade_font} size="lg" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          {area && (
            <span className="flex items-center gap-1.5 text-sm text-rock-400">
              <MapPin size={13} className="text-orange-400" />
              {area.name}
            </span>
          )}
          {weather && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-rock-500">Conditions:</span>
              <ClimbabilityBadge score={weather.climbability} />
            </div>
          )}
        </div>
      </div>

      {/* Main layout: left wide + right sidebar */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Map */}
          {boulder.latitude && boulder.longitude && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-rock-500">
                Location
              </h2>
              <ClimbMap
                boulders={[boulder]}
                height="260px"
                singleBoulder={boulder}
              />
              <p className="mt-2 text-xs text-rock-600">
                {boulder.latitude.toFixed(5)}, {boulder.longitude.toFixed(5)}
              </p>
            </section>
          )}

          {/* Description */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-rock-500">
              About
            </h2>
            <div className="rounded-2xl border border-rock-800 bg-rock-900 p-5">
              <p className="text-rock-300 leading-relaxed text-sm">
                {boulder.description}
              </p>
              {area && (
                <div className="mt-4 border-t border-rock-800 pt-4">
                  <p className="text-xs font-medium text-rock-500 mb-1">Area</p>
                  <p className="text-sm text-rock-300">{area.description}</p>
                </div>
              )}
            </div>
          </section>

          {/* Beta Videos */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Video size={14} className="text-rock-500" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-rock-500">
                Beta Videos
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.map((v) => (
                <VideoCard key={v.id} youtubeId={v.id} title={v.title} />
              ))}
            </div>
            <p className="mt-3 text-xs text-rock-600">
              Videos sourced from YouTube. Full video search coming in MK1.
            </p>
          </section>
        </div>

        {/* Right sidebar: Weather */}
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-rock-500">
              Today's Weather
            </h2>
            <WeatherCard weather={weather} />
          </section>

          {/* Quick stats */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-rock-500">
              Details
            </h2>
            <div className="rounded-2xl border border-rock-800 bg-rock-900 divide-y divide-rock-800">
              {[
                ['V-Scale', boulder.grade_v],
                ['Font Scale', boulder.grade_font ?? '—'],
                ['Area', area?.name ?? '—'],
                ['Coordinates', boulder.latitude ? `${boulder.latitude.toFixed(3)}, ${boulder.longitude.toFixed(3)}` : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-rock-500">{label}</span>
                  <span className="text-sm font-medium text-rock-200">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Nearby boulders teaser */}
          <div className="rounded-2xl border border-rock-800 border-dashed bg-rock-900/40 p-5 text-center">
            <p className="text-xs font-medium text-rock-500 uppercase tracking-wide mb-1">
              Coming Soon
            </p>
            <p className="text-sm text-rock-400">
              Save boulders, build a tick list, and link to your 8a profile.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
