const GRADE_COLORS = {
  easy: 'bg-sky-900/60 text-sky-300 ring-1 ring-sky-700',
  mid: 'bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-700',
  hard: 'bg-orange-900/60 text-orange-300 ring-1 ring-orange-700',
  project: 'bg-red-900/60 text-red-300 ring-1 ring-red-700',
}

function getGradeColor(gradeV) {
  const num = parseInt(gradeV?.replace('V', '') ?? '0', 10)
  if (num <= 3) return GRADE_COLORS.easy
  if (num <= 6) return GRADE_COLORS.mid
  if (num <= 9) return GRADE_COLORS.hard
  return GRADE_COLORS.project
}

export default function GradeTag({ gradeV, gradeFont, size = 'sm' }) {
  const colorClass = getGradeColor(gradeV)
  const textSize = size === 'lg' ? 'text-base px-3 py-1' : 'text-xs px-2.5 py-0.5'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${colorClass} ${textSize}`}
    >
      {gradeV}
      {gradeFont && (
        <span className="opacity-60 font-normal">· {gradeFont}</span>
      )}
    </span>
  )
}
