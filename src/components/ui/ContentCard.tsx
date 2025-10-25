import { Link } from 'react-router-dom'
import { Star, Eye } from 'lucide-react'
import { ContentType } from '../../types/database'

interface ContentCardProps {
  id: number
  title: string
  year?: number | null
  rating?: number | null
  views?: number
  posterUrl?: string | null
  genres?: string[]
  type: ContentType
  language?: string | null
}

export default function ContentCard({
  id,
  title,
  year,
  rating,
  views,
  posterUrl,
  genres,
  type,
  language,
}: ContentCardProps) {
  const getTypeUrl = () => {
    switch (type) {
      case 'movie':
        return `/movie/${id}`
      case 'series':
        return `/series/${id}`
      case 'anime':
        return `/anime/${id}`
      default:
        return '#'
    }
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}م`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}ألف`
    return views.toString()
  }

  return (
    <Link
      to={getTypeUrl()}
      className="group relative block w-full aspect-[2/3] rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700/50 shadow-elevation-card hover:shadow-elevation-hover transition-all duration-normal hover:-translate-y-2"
    >
      {/* Poster Image */}
      <div className="relative w-full h-full">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-normal group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <span className="text-neutral-600 text-4xl">🎬</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-normal" />

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-3 right-3 bg-primary-500 text-neutral-950 px-2 py-1 rounded-full flex items-center gap-1 text-tiny font-medium">
            <Star className="w-3 h-3 fill-current" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Content Info - Shows on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-normal">
          <h3 className="text-h3 font-semibold text-neutral-200 mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-3 text-small text-neutral-400 mb-2">
            {year && <span>{year}</span>}
            {language && <span>{language}</span>}
          </div>

          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="bg-neutral-800/80 text-tiny text-neutral-300 px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {views !== undefined && (
            <div className="flex items-center gap-1 text-tiny text-neutral-400">
              <Eye className="w-3 h-3" />
              <span>{formatViews(views)} مشاهدة</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
