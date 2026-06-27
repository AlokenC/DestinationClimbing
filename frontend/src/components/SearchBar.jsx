import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function SearchBar({ initialValue = '', onSearch, large = false }) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <Search
          size={large ? 20 : 16}
          className="absolute left-4 text-rock-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search boulders, areas, grades..."
          className={`w-full rounded-xl border border-rock-700 bg-rock-900 text-rock-100 placeholder-rock-500
            focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors
            ${large ? 'py-4 pl-12 pr-36 text-base' : 'py-3 pl-10 pr-28 text-sm'}`}
        />
        <button
          type="submit"
          className={`absolute right-2 rounded-lg bg-orange-500 font-semibold text-white hover:bg-orange-400 transition-colors
            ${large ? 'px-5 py-2.5 text-sm' : 'px-4 py-2 text-xs'}`}
        >
          Search
        </button>
      </div>
    </form>
  )
}
