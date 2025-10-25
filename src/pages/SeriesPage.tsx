import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ContentCard from '../components/ui/ContentCard'

export default function SeriesPage() {
  const [series, setSeries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [genres, setGenres] = useState<any[]>([])

  useEffect(() => {
    fetchGenres()
    fetchSeries()
  }, [selectedGenre])

  const fetchGenres = async () => {
    const { data } = await supabase.from('genres').select('*')
    if (data) setGenres(data)
  }

  const fetchSeries = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('content')
        .select(`
          *,
          content_genres (
            genres (name_ar, slug)
          )
        `)
        .eq('type', 'series')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      const { data } = await query

      if (data) {
        let seriesWithGenres = data.map(s => ({
          ...s,
          rating: s.imdb_rating,
          views: 0,
          genres: s.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
        }))

        if (selectedGenre !== 'all') {
          seriesWithGenres = seriesWithGenres.filter(s =>
            s.genres.some((g: string) =>
              genres.find(genre => genre.slug === selectedGenre && genre.name_ar === g)
            )
          )
        }

        setSeries(seriesWithGenres)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-neutral-200 mb-2">المسلسلات</h1>
          <p className="text-body-large text-neutral-400">
            تابع أحدث وأفضل المسلسلات العربية والعالمية
          </p>
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto hide-scrollbar pb-4">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-5 py-2 rounded-full text-small font-medium transition-all duration-fast whitespace-nowrap ${
              selectedGenre === 'all'
                ? 'bg-primary-500 text-neutral-950'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
            }`}
          >
            الكل
          </button>
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.slug)}
              className={`px-5 py-2 rounded-full text-small font-medium transition-all duration-fast whitespace-nowrap ${
                selectedGenre === genre.slug
                  ? 'bg-primary-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
              }`}
            >
              {genre.name_ar}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-neutral-400 py-20">جاري التحميل...</div>
        ) : series.length === 0 ? (
          <div className="text-center text-neutral-400 py-20">لا توجد مسلسلات</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {series.map(s => (
              <ContentCard
                key={s.id}
                id={s.id}
                title={s.title_ar}
                year={s.year}
                rating={s.rating}
                views={s.views}
                posterUrl={s.poster_url}
                genres={s.genres}
                type="series"
                language={s.language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
