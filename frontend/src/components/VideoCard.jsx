import { useState } from 'react'
import { Play } from 'lucide-react'

export default function VideoCard({ youtubeId, title }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-rock-900"
      aria-label={`Play video: ${title}`}
    >
      <img
        src={thumb}
        alt={title}
        className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-200"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/30 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-200">
          <Play size={22} className="text-white ml-1" fill="white" />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
          <p className="text-sm font-medium text-white line-clamp-1">{title}</p>
        </div>
      )}
    </button>
  )
}
