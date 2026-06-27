import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mountain, Menu, X } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
]

export default function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-rock-800 bg-rock-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white group-hover:bg-orange-400 transition-colors">
            <Mountain size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-rock-100">
            STYRKUR
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                pathname === to
                  ? 'bg-rock-800 text-rock-100'
                  : 'text-rock-400 hover:bg-rock-900 hover:text-rock-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-2 sm:flex">
          <button className="rounded-md px-4 py-2 text-sm font-medium text-rock-400 hover:text-rock-100 transition-colors">
            Log In
          </button>
          <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 transition-colors">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex sm:hidden items-center justify-center rounded-md p-2 text-rock-400 hover:bg-rock-800 hover:text-rock-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="border-t border-rock-800 bg-rock-950 px-4 pb-4 pt-2 sm:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === to
                    ? 'bg-rock-800 text-rock-100'
                    : 'text-rock-400'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-rock-800 pt-3">
              <button className="flex-1 rounded-md border border-rock-700 py-2 text-sm font-medium text-rock-300">
                Log In
              </button>
              <button className="flex-1 rounded-md bg-orange-500 py-2 text-sm font-semibold text-white">
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
