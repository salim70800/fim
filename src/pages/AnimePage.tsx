import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ContentCard from '../components/ui/ContentCard'

export default function AnimePage() {
  const [anime, setAnime] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [genres, setGenres] = useState<any[]>([])

  useEffect(() => {
    fetchGenres()
    fetchAnime()
  }, [selectedGenre])

  const fetchGenres = async () => {
    const { data } = await supabase.from('genres').select('*')
    if (data) setGenres(data)
  }

  const fetchAnime = async () => {
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
        .eq('type', 'anime')
        .eq('status', 'published')
        .order('created_at', { ascending: false})

      const { data } = await query

      if (data) {
        let animeWithGenres = data.map(a => ({
          ...a,
          rating: a.imdb_rating,
          views: 0,
          genres: a.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
        }))

        if (selectedGenre !== 'all') {
          animeWithGenres = animeWithGenres.filter(a =>
            a.genres.some((g: string) =>
              genres.find(genre => genre.slug === selectedGenre && genre.name_ar === g)
            )
          )
        }

        setAnime(animeWithGenres)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-neutral-200 mb-2">الأنمي</h1>
          <p className="text-body-large text-neutral-400">
            استمتع بأحدث وأفضل حلقات الأنمي المدبلجة
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
        ) : anime.length === 0 ? (
          <div className="text-center text-neutral-400 py-20">لا يوجد أنمي</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {anime.map(a => (
              <ContentCard
                key={a.id}
                id={a.id}
                title={a.title_ar}
                year={a.year}
                rating={a.rating}
                views={a.views}
                posterUrl={a.poster_url}
                genres={a.genres}
                type="anime"
                language={a.language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
