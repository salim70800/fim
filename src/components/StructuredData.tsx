import { useEffect } from 'react'
import { Content, Episode, Genre } from '../types/database'

interface StructuredDataProps {
  content?: Content
  episode?: Episode
  type: 'movie' | 'series' | 'anime' | 'episode' | 'home' | 'page'
  breadcrumbs?: Array<{ name: string; url: string }>
  genres?: Genre[]
}

export default function StructuredData({
  content,
  episode,
  type,
  breadcrumbs,
  genres
}: StructuredDataProps) {
  const siteUrl = 'https://o47g7n1tgiu2.space.minimax.io'

  useEffect(() => {
    // إزالة الـ structured data القديمة
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"].dynamic-schema')
    oldScripts.forEach(script => script.remove())

    // إنشاء structured data جديدة
    const schemas: any[] = []

    // BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.name,
          'item': `${siteUrl}${item.url}`
        }))
      })
    }

    // Movie Schema
    if (content && type === 'movie') {
      const movieSchema = {
        '@context': 'https://schema.org',
        '@type': 'Movie',
        'name': content.title_ar,
        'alternateName': content.title_en || undefined,
        'description': content.description || undefined,
        'image': content.poster_url || undefined,
        'datePublished': content.year ? `${content.year}-01-01` : undefined,
        'inLanguage': content.language || 'ar',
        'countryOfOrigin': {
          '@type': 'Country',
          'name': content.country || 'Egypt'
        },
        'url': `${siteUrl}/movie/${content.id}`,
        'aggregateRating': content.imdb_rating ? {
          '@type': 'AggregateRating',
          'ratingValue': content.imdb_rating,
          'bestRating': '10',
          'worstRating': '1',
          'ratingCount': 100
        } : undefined,
        'duration': content.duration ? `PT${content.duration}M` : undefined,
        'genre': genres?.map((g) => g.name_ar || g.name_en).join(', ') || undefined
      }
      schemas.push(movieSchema)
    }

    // TVSeries Schema
    if (content && (type === 'series' || type === 'anime')) {
      const seriesSchema = {
        '@context': 'https://schema.org',
        '@type': 'TVSeries',
        'name': content.title_ar,
        'alternateName': content.title_en || undefined,
        'description': content.description || undefined,
        'image': content.poster_url || undefined,
        'datePublished': content.year ? `${content.year}-01-01` : undefined,
        'inLanguage': content.language || 'ar',
        'countryOfOrigin': {
          '@type': 'Country',
          'name': content.country || 'Egypt'
        },
        'url': `${siteUrl}/${type}/${content.id}`,
        'aggregateRating': content.imdb_rating ? {
          '@type': 'AggregateRating',
          'ratingValue': content.imdb_rating,
          'bestRating': '10',
          'worstRating': '1',
          'ratingCount': 100
        } : undefined,
        'genre': genres?.map((g) => g.name_ar || g.name_en).join(', ') || undefined
      }
      schemas.push(seriesSchema)
    }

    // TVEpisode Schema
    if (episode && content && type === 'episode') {
      const episodeSchema = {
        '@context': 'https://schema.org',
        '@type': 'TVEpisode',
        'name': episode.title_ar || `الحلقة ${episode.episode_number}`,
        'description': episode.description || undefined,
        'episodeNumber': episode.episode_number,
        'seasonNumber': episode.season_number || 1,
        'image': episode.thumbnail_url || content.poster_url || undefined,
        'datePublished': episode.air_date || undefined,
        'url': `${siteUrl}/${content.type}/${content.id}/episode/${episode.id}`,
        'partOfSeries': {
          '@type': 'TVSeries',
          'name': content.title_ar,
          'url': `${siteUrl}/${content.type}/${content.id}`
        }
      }
      schemas.push(episodeSchema)
    }

    // VideoObject Schema للأفلام
    if (content && type === 'movie' && content.trailer_url) {
      const videoSchema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        'name': content.title_ar,
        'description': content.description || undefined,
        'thumbnailUrl': content.poster_url || undefined,
        'uploadDate': content.year ? `${content.year}-01-01` : undefined,
        'duration': content.duration ? `PT${content.duration}M` : undefined,
        'contentUrl': content.trailer_url,
        'embedUrl': content.trailer_url
      }
      schemas.push(videoSchema)
    }

    // إضافة الـ schemas إلى الـ head
    schemas.forEach((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.className = 'dynamic-schema'
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    // تنظيف عند الـ unmount
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"].dynamic-schema')
      scripts.forEach(script => script.remove())
    }
  }, [content, episode, type, breadcrumbs, siteUrl])

  return null
}
