import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import BoulderCard from '../components/BoulderCard'
import { searchBoulders, getAllAreas } from '../api/client'

const V_GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10+']

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [minGrade, setMinGrade] = useState('V0')
  const [maxGrade, setMaxGrade] = useState('V10+')
  const [areaKey, setAreaKey] = useState(
    searchParams.get('area') ? parseInt(searchParams.get('area'), 10) : null
  )
  const [showFilters, setShowFilters] = useState(false)

  const areas = useMemo(() => getAllAreas(), [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [searchParams])

  const results = useMemo(() => {
    return searchBoulders(query, {
      ...(minGrade !== 'V0' || maxGrade !== 'V10+' ? { grade: [minGrade, maxGrade] } : {}),
      ...(areaKey ? { areaKey } : {}),
    })
  }, [query, minGrade, maxGrade, areaKey])

  function handleSearch(newQuery) {
    setQuery(newQuery)
    setSearchParams(newQuery ? { q: newQuery } : {})
  }

  function clearFilters() {
    setMinGrade('V0')
    setMaxGrade('V10+')
    setAreaKey(null)
  }

  const hasActiveFilters = minGrade !== 'V0' || maxGrade !== 'V10+' || areaKey

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar initialValue={query} onSearch={handleSearch} large />
      </div>

      {/* Filter row */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? 'border-orange-700 bg-orange-950/40 text-orange-400'
              : 'border-rock-700 bg-rock-900 text-rock-400 hover:border-rock-600 hover:text-rock-100'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white font-bold">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-rock-500 hover:text-rock-300 transition-colors"
          >
            <X size={13} /> Clear filters
          </button>
        )}

        <span className="ml-auto text-sm text-rock-500">
          {results.length} result{results.length !== 1 ? 's' : ''}
          {query && (
            <span className="text-rock-600">
              {' '}for "<span className="text-rock-400">{query}</span>"
            </span>
          )}
        </span>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 rounded-2xl border border-rock-800 bg-rock-900 p-5">
          <div className="grid gap-5 sm:grid-cols-3">
            {/* Min grade */}
            <div>
              <label className="block text-xs font-medium text-rock-400 mb-2 uppercase tracking-wide">
                Min Grade
              </label>
              <select
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="w-full rounded-lg border border-rock-700 bg-rock-800 px-3 py-2.5 text-sm text-rock-100 focus:border-orange-500 focus:outline-none"
              >
                {V_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Max grade */}
            <div>
              <label className="block text-xs font-medium text-rock-400 mb-2 uppercase tracking-wide">
                Max Grade
              </label>
              <select
                value={maxGrade}
                onChange={(e) => setMaxGrade(e.target.value)}
                className="w-full rounded-lg border border-rock-700 bg-rock-800 px-3 py-2.5 text-sm text-rock-100 focus:border-orange-500 focus:outline-none"
              >
                {V_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-medium text-rock-400 mb-2 uppercase tracking-wide">
                Area
              </label>
              <select
                value={areaKey ?? ''}
                onChange={(e) =>
                  setAreaKey(e.target.value ? parseInt(e.target.value, 10) : null)
                }
                className="w-full rounded-lg border border-rock-700 bg-rock-800 px-3 py-2.5 text-sm text-rock-100 focus:border-orange-500 focus:outline-none"
              >
                <option value="">All areas</option>
                {areas.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-2xl border border-rock-800 bg-rock-900 py-20 text-center">
          <p className="text-rock-400 text-lg font-medium">No boulders found</p>
          <p className="mt-2 text-sm text-rock-600">
            Try a different search or adjust your filters
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((boulder) => (
            <BoulderCard key={boulder.key} boulder={boulder} />
          ))}
        </div>
      )}
    </main>
  )
}
