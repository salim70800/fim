import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ContentCard from '../components/ui/ContentCard'
import { Movie } from '../types/database'

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [genres, setGenres] = useState<any[]>([])

  useEffect(() => {
    fetchGenres()
    fetchMovies()
  }, [selectedGenre])

  const fetchGenres = async () => {
    const { data } = await supabase.from('genres').select('*')
    if (data) setGenres(data)
  }

  const fetchMovies = async () => {
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
        .eq('type', 'movie')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      const { data } = await query

      if (data) {
        let moviesWithGenres = data.map(m => ({
          ...m,
          rating: m.imdb_rating,
          views: 0,
          genres: m.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
        }))

        // Filter by genre if selected
        if (selectedGenre !== 'all') {
          moviesWithGenres = moviesWithGenres.filter(m =>
            m.genres.some((g: string) =>
              genres.find(genre => genre.slug === selectedGenre && genre.name_ar === g)
            )
          )
        }

        setMovies(moviesWithGenres)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-neutral-200 mb-2">الأفلام</h1>
          <p className="text-body-large text-neutral-400">
            اكتشف مجموعة واسعة من الأفلام العربية والعالمية
          </p>
        </div>

        {/* Filter Bar */}
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

        {/* Movies Grid */}
        {loading ? (
          <div className="text-center text-neutral-400 py-20">جاري التحميل...</div>
        ) : movies.length === 0 ? (
          <div className="text-center text-neutral-400 py-20">لا توجد أفلام</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map(movie => (
              <ContentCard
                key={movie.id}
                id={movie.id}
                title={movie.title_ar}
                year={movie.year}
                rating={movie.rating}
                views={movie.views}
                posterUrl={movie.poster_url}
                genres={movie.genres}
                type="movie"
                language={movie.language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
