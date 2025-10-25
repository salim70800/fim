import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import HeroCarousel from '../components/ui/HeroCarousel'
import ContentCard from '../components/ui/ContentCard'
import SEO from '../components/SEO'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'

export default function HomePage() {
  const [featuredContent, setFeaturedContent] = useState<any[]>([])
  const [latestMovies, setLatestMovies] = useState<any[]>([])
  const [latestSeries, setLatestSeries] = useState<any[]>([])
  const [latestAnime, setLatestAnime] = useState<any[]>([])
  const [latestEpisodes, setLatestEpisodes] = useState<any[]>([])
  const [topRated, setTopRated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // Fetch featured content (is_featured = true)
      const { data: featured } = await supabase
        .from('content')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('imdb_rating', { ascending: false })
        .limit(5)
      
      if (featured) {
        const featuredMapped = featured.map(c => ({
          id: c.id,
          title: c.title_ar,
          description: c.description || 'لا يوجد وصف متاح',
          year: c.year,
          backdropUrl: c.banner_url || c.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200',
          type: c.type,
          rating: c.imdb_rating,
          genres: []
        }))
        setFeaturedContent(featuredMapped)
      }

      // Fetch latest movies with genres
      const { data: moviesData } = await supabase
        .from('content')
        .select(`
          *,
          content_genres (
            genres (name_ar)
          )
        `)
        .eq('type', 'movie')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12)
      
      if (moviesData) {
        const moviesWithGenres = moviesData.map(m => ({
          ...m,
          rating: m.imdb_rating,
          views: 0,
          genres: m.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
        }))
        setLatestMovies(moviesWithGenres)
      }

      // Fetch latest series
      const { data: seriesData } = await supabase
        .from('content')
        .select(`
          *,
          content_genres (
            genres (name_ar)
          )
        `)
        .eq('type', 'series')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12)
      
      if (seriesData) {
        const seriesWithGenres = seriesData.map(s => ({
          ...s,
          rating: s.imdb_rating,
          views: 0,
          genres: s.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
        }))
        setLatestSeries(seriesWithGenres)
      }

      // Fetch latest anime
      const { data: animeData } = await supabase
        .from('content')
        .select(`
          *,
          content_genres (
            genres (name_ar)
          )
        `)
        .eq('type', 'anime')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12)
      
      if (animeData) {
        const animeWithGenres = animeData.map(a => ({
          ...a,
          rating: a.imdb_rating,
          views: 0,
          genres: a.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
        }))
        setLatestAnime(animeWithGenres)
      }

      // Fetch top rated (mixed)
      const allContent = [
        ...(moviesData || []).map(m => ({ ...m, type: 'movie' as const, rating: m.imdb_rating })),
        ...(seriesData || []).map(s => ({ ...s, type: 'series' as const, rating: s.imdb_rating })),
        ...(animeData || []).map(a => ({ ...a, type: 'anime' as const, rating: a.imdb_rating }))
      ]
      const sorted = allContent.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8)
      setTopRated(sorted.map(item => ({
        ...item,
        views: 0,
        genres: item.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
      })))

      // Fetch latest episodes
      const { data: episodesData } = await supabase
        .from('episodes')
        .select(`
          *,
          content:content_id (
            id,
            title_ar,
            poster_url,
            type
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12)

      if (episodesData) {
        const episodesWithContent = episodesData.map(ep => ({
          ...ep,
          content: Array.isArray(ep.content) ? ep.content[0] : ep.content
        })).filter(ep => ep.content)
        setLatestEpisodes(episodesWithContent)
      }

    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const ScrollSection = ({ title, items, type }: { title: string; items: any[]; type: 'movie' | 'series' | 'anime' }) => {
    const scrollRef = useState<HTMLDivElement | null>(null)

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef[0]) {
        const scrollAmount = 300
        scrollRef[0].scrollBy({
          left: direction === 'right' ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        })
      }
    }

    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h2 font-semibold text-neutral-200">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-lg transition-all duration-fast"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-lg transition-all duration-fast"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={el => scrollRef[1](el)}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
        >
          {items.map(item => (
            <div key={item.id} className="flex-shrink-0 w-64">
              <ContentCard
                id={item.id}
                title={item.title_ar}
                year={item.year}
                rating={item.rating}
                views={item.views}
                posterUrl={item.poster_url}
                genres={item.genres}
                type={type}
                language={item.language}
              />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-400 text-xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title="الرئيسية"
        description="منصة البث العربية الشاملة - شاهد أحدث الأفلام والمسلسلات وحلقات الأنمي مجاناً بجودة عالية مع سيرفرات متعددة"
        keywords="أفلام عربية, مسلسلات عربية, أنمي مدبلج, بث مباشر, مشاهدة مجانية, أفلام اون لاين, مسلسلات اون لاين"
      />
      
      {/* Hero Carousel */}
      <HeroCarousel slides={featuredContent} />

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-16">
        {/* أحدث الحلقات */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-neutral-200 mb-6">أحدث الحلقات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestEpisodes.map((episode: any) => (
              <a
                key={episode.id}
                href={`/episode/${episode.id}`}
                className="group bg-neutral-900 rounded-lg overflow-hidden hover:bg-neutral-800 transition-all duration-300 border border-neutral-800 hover:border-orange-500"
              >
                <div className="flex gap-4 p-4">
                  {/* صورة المسلسل/الأنمي */}
                  <div className="relative w-24 h-32 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={episode.content?.poster_url || 'https://via.placeholder.com/96x128?text=No+Image'}
                      alt={episode.content?.title_ar}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Play className="w-8 h-8 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* معلومات الحلقة */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                        {episode.content?.title_ar}
                      </h3>
                      <p className="text-neutral-400 text-sm mb-2">
                        {episode.season_number ? `الموسم ${episode.season_number} - ` : ''}الحلقة {episode.episode_number}
                      </p>
                      <p className="text-neutral-500 text-xs line-clamp-2">
                        {episode.title_ar}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
                      {episode.duration && (
                        <span>{episode.duration} دقيقة</span>
                      )}
                      {episode.air_date && (
                        <span>• {new Date(episode.air_date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <ScrollSection title="أحدث الأفلام" items={latestMovies} type="movie" />
        <ScrollSection title="أحدث المسلسلات" items={latestSeries} type="series" />
        <ScrollSection title="أحدث حلقات الأنمي" items={latestAnime} type="anime" />

        {/* Top Rated - Grid */}
        <section className="mb-16">
          <h2 className="text-h2 font-semibold text-neutral-200 mb-6">أعلى تقييماً</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRated.map(item => (
              <ContentCard
                key={item.id}
                id={item.id}
                title={item.title_ar}
                year={item.year}
                rating={item.rating}
                views={item.views}
                posterUrl={item.poster_url}
                genres={item.genres}
                type={item.type}
                language={item.language}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
