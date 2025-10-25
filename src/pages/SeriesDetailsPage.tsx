import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Content, Genre, Episode } from '../types/database'
import DynamicSEO from '../components/DynamicSEO'
import StructuredData from '../components/StructuredData'
import ContentCard from '../components/ui/ContentCard'
import { Calendar, Star, Globe, Film, Users, TrendingUp, Share2, Heart, Play, Clock } from 'lucide-react'

export default function SeriesDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [series, setSeries] = useState<Content | null>(null)
  const [genres, setGenres] = useState<Genre[]>([])
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [similarSeries, setSimilarSeries] = useState<Content[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      if (!id) return

      try {
        setLoading(true)

        // جلب بيانات المسلسل
        const { data: seriesData, error: seriesError } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .eq('type', 'series')
          .single()

        if (seriesError) throw seriesError
        setSeries(seriesData)

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

        // جلب الحلقات
        const { data: episodesData } = await supabase
          .from('episodes')
          .select('*')
          .eq('content_id', id)
          .eq('status', 'published')
          .order('season_number', { ascending: true })
          .order('episode_number', { ascending: true })

        if (episodesData) {
          setEpisodes(episodesData)
          // تعيين الموسم الأول إذا كانت هناك حلقات
          if (episodesData.length > 0 && episodesData[0].season_number) {
            setSelectedSeason(episodesData[0].season_number)
          }
        }

        // جلب مسلسلات مشابهة
        if (genresData && genresData.length > 0) {
          const genreIds = genresData.map(cg => cg.genre_id)
          
          const { data: similarData } = await supabase
            .from('content_genres')
            .select('content_id, content(*)')
            .in('genre_id', genreIds)
            .neq('content_id', id)
            .limit(8)

          if (similarData) {
            const uniqueSeries: Content[] = []
            const seenIds = new Set()
            
            similarData.forEach((item: any) => {
              if (item.content && item.content.type === 'series' && !seenIds.has(item.content.id)) {
                uniqueSeries.push(item.content as Content)
                seenIds.add(item.content.id)
              }
            })
            
            setSimilarSeries(uniqueSeries.slice(0, 6))
          }
        }
      } catch (error) {
        console.error('Error fetching series:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeriesDetails()
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

  if (!series) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-lg">المسلسل غير موجود</p>
          <Link to="/series" className="text-orange-500 hover:text-orange-400 mt-4 inline-block">
            العودة إلى المسلسلات
          </Link>
        </div>
      </div>
    )
  }

  // الحصول على المواسم المتاحة
  const availableSeasons = Array.from(
    new Set(episodes.map(ep => ep.season_number).filter(s => s !== null))
  ).sort((a, b) => (a || 0) - (b || 0)) as number[]

  // فلترة الحلقات حسب الموسم المحدد
  const filteredEpisodes = episodes.filter(ep => ep.season_number === selectedSeason)

  return (
    <>
      <DynamicSEO content={series} type="series" />
      <StructuredData 
        content={series} 
        genres={genres}
        type="series"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'المسلسلات', url: '/series' },
          { name: series.title_ar, url: `/series/${series.id}` }
        ]}
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh]">
          <div className="absolute inset-0">
            <img
              src={series.banner_url || series.poster_url || '/placeholder.jpg'}
              alt={series.title_ar}
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
                    src={series.poster_url || '/placeholder.jpg'}
                    alt={series.title_ar}
                    className="w-48 md:w-64 rounded-lg shadow-2xl"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{series.title_ar}</h1>
                  {series.title_en && (
                    <p className="text-xl md:text-2xl text-neutral-300 mb-4">{series.title_en}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
                    {series.year && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{series.year}</span>
                      </div>
                    )}
                    {series.imdb_rating && (
                      <div className="flex items-center gap-1.5 bg-orange-500/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span className="font-semibold">{series.imdb_rating}</span>
                      </div>
                    )}
                    {series.country && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <span>{series.country}</span>
                      </div>
                    )}
                    {series.language && (
                      <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm">
                        {series.language}
                      </span>
                    )}
                    {availableSeasons.length > 0 && (
                      <span className="px-3 py-1 bg-orange-500 rounded-full text-sm font-semibold">
                        {availableSeasons.length} مواسم
                      </span>
                    )}
                    {episodes.length > 0 && (
                      <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm">
                        {episodes.length} حلقة
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
                  {series.description && (
                    <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-3xl">
                      {series.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    {episodes.length > 0 && (
                      <Link
                        to={`/episode/${episodes[0].id}`}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        <span>بدء المشاهدة</span>
                      </Link>
                    )}
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
          {/* Episodes Section */}
          {episodes.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">الحلقات</h2>
                
                {/* Season Selector */}
                {availableSeasons.length > 1 && (
                  <div className="flex gap-2">
                    {availableSeasons.map((season) => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`
                          px-4 py-2 rounded-lg font-semibold transition-all
                          ${selectedSeason === season
                            ? 'bg-orange-500 text-white'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }
                        `}
                      >
                        الموسم {season}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEpisodes.map((episode) => (
                  <Link
                    key={episode.id}
                    to={`/episode/${episode.id}`}
                    className="group bg-neutral-900 rounded-lg overflow-hidden hover:bg-neutral-800 transition-colors"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={episode.thumbnail_url || series.banner_url || '/placeholder.jpg'}
                        alt={episode.title_ar}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-white text-sm font-semibold">
                        الحلقة {episode.episode_number}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-1 line-clamp-1">
                        {episode.title_ar}
                      </h3>
                      {episode.description && (
                        <p className="text-neutral-400 text-sm line-clamp-2 mb-2">
                          {episode.description}
                        </p>
                      )}
                      {episode.duration && (
                        <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{episode.duration} دقيقة</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Additional Info */}
          <section className="grid md:grid-cols-2 gap-6">
            {/* Cast */}
            {series.movie_cast && (
              <div className="bg-neutral-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  طاقم التمثيل
                </h3>
                <p className="text-neutral-300 leading-relaxed">{series.movie_cast}</p>
              </div>
            )}

            {/* Director */}
            {series.director && (
              <div className="bg-neutral-900 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Film className="w-5 h-5 text-orange-500" />
                  الإخراج
                </h3>
                <p className="text-neutral-300 leading-relaxed">{series.director}</p>
              </div>
            )}
          </section>

          {/* Similar Series */}
          {similarSeries.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                مسلسلات مشابهة
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {similarSeries.map((series) => (
                  <ContentCard
                    key={series.id}
                    id={series.id}
                    title={series.title_ar}
                    year={series.year}
                    rating={series.imdb_rating || series.user_rating}
                    posterUrl={series.poster_url}
                    type={series.type}
                    language={series.language}
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
