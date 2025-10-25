import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Content, Genre, Server } from '../types/database'
import DynamicSEO from '../components/DynamicSEO'
import StructuredData from '../components/StructuredData'
import VideoPlayer from '../components/ui/VideoPlayer'
import ContentCard from '../components/ui/ContentCard'
import { Calendar, Clock, Star, Globe, Film, Users, TrendingUp, Share2, Heart, Bookmark } from 'lucide-react'

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Content | null>(null)
  const [genres, setGenres] = useState<Genre[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [similarMovies, setSimilarMovies] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return

      try {
        setLoading(true)

        // جلب بيانات الفيلم
        const { data: movieData, error: movieError } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .eq('type', 'movie')
          .single()

        if (movieError) throw movieError
        setMovie(movieData)

        // جلب التصنيفات
        const { data: genresData } = await supabase
          .from('content_genres')
          .select('genre_id, genres(*)')
          .eq('content_id', id)

        if (genresData) {
          const genresList: Genre[] = []
          genresData.forEach((cg: any) => {
            if (cg.genres) {
              genresList.push(cg.genres as Genre)
            }
          })
          setGenres(genresList)
        }

        // جلب السيرفرات
        const { data: serversData } = await supabase
          .from('servers')
          .select('*')
          .eq('content_id', id)
          .eq('is_active', true)
          .order('priority', { ascending: true })

        if (serversData) {
          setServers(serversData)
        }

        // جلب أفلام مشابهة
        if (genresData && genresData.length > 0) {
          const genreIds = genresData.map(cg => cg.genre_id)
          
          const { data: similarData } = await supabase
            .from('content_genres')
            .select('content_id, content(*)')
            .in('genre_id', genreIds)
            .neq('content_id', id)
            .limit(8)

          if (similarData) {
            const uniqueMovies: Content[] = []
            const seenIds = new Set()
            
            similarData.forEach((item: any) => {
              if (item.content && item.content.type === 'movie' && !seenIds.has(item.content.id)) {
                uniqueMovies.push(item.content as Content)
                seenIds.add(item.content.id)
              }
            })
            
            setSimilarMovies(uniqueMovies.slice(0, 6))
          }
        }
      } catch (error) {
        console.error('Error fetching movie:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-lg">الفيلم غير موجود</p>
          <Link to="/movies" className="text-orange-500 hover:text-orange-400 mt-4 inline-block">
            العودة إلى الأفلام
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <DynamicSEO content={movie} type="movie" />
      <StructuredData 
        content={movie} 
        genres={genres}
        type="movie"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'الأفلام', url: '/movies' },
          { name: movie.title_ar, url: `/movie/${movie.id}` }
        ]}
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section with Backdrop */}
        <div className="relative h-[60vh] md:h-[70vh]">
          <div className="absolute inset-0">
            <img
              src={movie.banner_url || movie.poster_url || '/placeholder.jpg'}
              alt={movie.title_ar}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={movie.poster_url || '/placeholder.jpg'}
                    alt={movie.title_ar}
                    className="w-48 md:w-64 rounded-lg shadow-2xl"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title_ar}</h1>
                  {movie.title_en && (
                    <p className="text-xl md:text-2xl text-neutral-300 mb-4">{movie.title_en}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
                    {movie.year && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{movie.year}</span>
                      </div>
                    )}
                    {movie.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{movie.duration} دقيقة</span>
                      </div>
                    )}
                    {movie.imdb_rating && (
                      <div className="flex items-center gap-1.5 bg-orange-500/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span className="font-semibold">{movie.imdb_rating}</span>
                      </div>
                    )}
                    {movie.country && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <span>{movie.country}</span>
                      </div>
                    )}
                    {movie.language && (
                      <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm">
                        {movie.language}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm"
                        >
                          {genre.name_ar}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {movie.description && (
                    <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-3xl">
                      {movie.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors flex items-center gap-2">
                      <Film className="w-5 h-5" />
                      <span>مشاهدة الآن</span>
                    </button>
                    <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-colors flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>إضافة للمفضلة</span>
                    </button>
                    <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-colors flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      <span>مشاركة</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Video Player */}
          {servers.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">مشاهدة الفيلم</h2>
              <VideoPlayer servers={servers} title={movie.title_ar} autoPlay={false} />
            </section>
          )}

          {/* Additional Info */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Cast */}
            {movie.movie_cast && (
              <div className="bg-neutral-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  طاقم التمثيل
                </h3>
                <p className="text-neutral-300 leading-relaxed">{movie.movie_cast}</p>
              </div>
            )}

            {/* Director */}
            {movie.director && (
              <div className="bg-neutral-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Film className="w-5 h-5 text-orange-500" />
                  الإخراج
                </h3>
                <p className="text-neutral-300 leading-relaxed">{movie.director}</p>
              </div>
            )}
          </section>

          {/* Gallery */}
          {movie.gallery_urls && movie.gallery_urls.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">معرض الصور</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movie.gallery_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${movie.title_ar} - صورة ${index + 1}`}
                    className="w-full aspect-video object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                أفلام مشابهة
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {similarMovies.map((movie) => (
                  <ContentCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title_ar}
                    year={movie.year}
                    rating={movie.imdb_rating || movie.user_rating}
                    posterUrl={movie.poster_url}
                    type={movie.type}
                    language={movie.language}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
