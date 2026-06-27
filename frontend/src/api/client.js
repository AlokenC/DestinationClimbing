import { BOULDERS, AREAS, WEATHER } from './mockData'

// --- Areas ---

export function getArea(key) {
  return AREAS.find((a) => a.key === key) ?? null
}

export function getAllAreas() {
  return AREAS
}

// --- Weather ---

export function getWeatherForArea(areaKey) {
  return WEATHER.find((w) => w.area_key === areaKey) ?? null
}

// Returns weather for a boulder's area, walking up to nearest ancestor with data
export function getWeatherForBoulder(boulder) {
  let weather = getWeatherForArea(boulder.area_key)
  if (weather) return weather
  // Walk up parent areas
  let area = getArea(boulder.area_key)
  while (area?.parent_key) {
    weather = getWeatherForArea(area.parent_key)
    if (weather) return weather
    area = getArea(area.parent_key)
  }
  return null
}

// --- Boulders ---

export function getAllBoulders() {
  return BOULDERS
}

export function getBoulder(id) {
  return BOULDERS.find((b) => b.key === parseInt(id, 10)) ?? null
}

export function searchBoulders(query, filters = {}) {
  let results = [...BOULDERS]

  if (query) {
    const q = query.toLowerCase()
    results = results.filter((b) => {
      const area = getArea(b.area_key)
      return (
        b.name.toLowerCase().includes(q) ||
        area?.name.toLowerCase().includes(q)
      )
    })
  }

  if (filters.grade) {
    const gradeOrder = [
      'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
      'V11', 'V12', 'V13', 'V14', 'V15', 'V16',
    ]
    const [minGrade, maxGrade] = filters.grade
    results = results.filter((b) => {
      const idx = gradeOrder.indexOf(b.grade_v)
      return idx >= gradeOrder.indexOf(minGrade) && idx <= gradeOrder.indexOf(maxGrade)
    })
  }

  if (filters.areaKey) {
    results = results.filter((b) => b.area_key === filters.areaKey)
  }

  return results
}

export function getClimbabilityLabel(score) {
  if (score >= 80) return { label: 'Great', color: 'emerald' }
  if (score >= 60) return { label: 'Fair', color: 'amber' }
  return { label: 'Poor', color: 'red' }
}
