export interface Genre {
  id: number
  name_ar: string
  name_en: string
  slug: string
  created_at: string
}

// النوع الموحد للمحتوى (الجدول الجديد)
export interface Content {
  id: number
  title_ar: string
  title_en: string | null
  slug: string
  type: 'movie' | 'series' | 'anime'
  description: string | null
  year: number | null
  duration: number | null
  imdb_rating: number | null
  user_rating: number | null
  country: string | null
  language: string | null
  poster_url: string | null
  banner_url: string | null
  gallery_urls: string[] | null
  trailer_url: string | null
  movie_cast: string | null
  director: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  status: 'published' | 'draft' | 'archived'
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ContentWithGenres extends Content {
  genres?: Genre[]
}

// الأنواع القديمة (للتوافق مع الكود القديم)
export interface Movie {
  id: number
  title_ar: string
  title_en: string | null
  description: string | null
  year: number | null
  country: string | null
  language: string | null
  rating: number | null
  views: number
  poster_url: string | null
  backdrop_url: string | null
  trailer_url: string | null
  duration: number | null
  created_at: string
  updated_at: string
}

export interface Series {
  id: number
  title_ar: string
  title_en: string | null
  description: string | null
  year: number | null
  country: string | null
  language: string | null
  rating: number | null
  views: number
  poster_url: string | null
  backdrop_url: string | null
  trailer_url: string | null
  seasons_count: number
  status: string | null
  created_at: string
  updated_at: string
}

export interface Anime {
  id: number
  title_ar: string
  title_en: string | null
  description: string | null
  year: number | null
  language: string | null
  rating: number | null
  views: number
  poster_url: string | null
  backdrop_url: string | null
  trailer_url: string | null
  episodes_count: number
  status: string | null
  created_at: string
  updated_at: string
}

export interface Episode {
  id: number
  content_id: number
  episode_number: number
  season_number: number
  title_ar: string
  title_en: string | null
  slug: string
  description: string | null
  thumbnail_url: string | null
  duration: number | null
  air_date: string | null
  seo_title: string | null
  seo_description: string | null
  status: 'published' | 'draft'
  created_at: string
  updated_at: string
}

export interface Server {
  id: number
  content_id: number
  episode_id: number | null
  server_name: string
  server_type: string | null
  embed_url: string
  quality: string | null
  language: string | null
  priority: number
  is_active: boolean
  created_at: string
}

export interface ContentGenre {
  content_id: number
  genre_id: number
}

export type ContentType = 'movie' | 'series' | 'anime'
