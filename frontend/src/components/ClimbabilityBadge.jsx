export default function ClimbabilityBadge({ score, showLabel = true }) {
  let color, ring, label

  if (score >= 80) {
    color = 'text-emerald-400'
    ring = 'ring-emerald-700 bg-emerald-950/60'
    label = 'Great'
  } else if (score >= 60) {
    color = 'text-amber-400'
    ring = 'ring-amber-700 bg-amber-950/60'
    label = 'Fair'
  } else {
    color = 'text-red-400'
    ring = 'ring-red-800 bg-red-950/60'
    label = 'Poor'
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ring-1 px-3 py-1.5 ${ring}`}>
      {/* Score circle */}
      <span className={`text-sm font-bold tabular-nums ${color}`}>{score}</span>
      {showLabel && (
        <span className={`text-xs font-semibold uppercase tracking-wide ${color}`}>
          {label}
        </span>
      )}
    </div>
  )
}
