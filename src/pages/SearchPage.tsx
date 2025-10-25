import { useState, useEffect } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ContentCard from '../components/ui/ContentCard'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'anime'>('all')

  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch()
    } else {
      setResults([])
    }
  }, [searchQuery, selectedType])

  const performSearch = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('content')
        .select('*')
        .eq('status', 'published')
        .or(`title_ar.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%`)

      // Filter by type if not 'all'
      if (selectedType !== 'all') {
        query = query.eq('type', selectedType)
      }

      const { data } = await query.limit(50)

      if (data) {
        const results = data.map(item => ({
          ...item,
          rating: item.imdb_rating,
          views: 0
        }))
        setResults(results)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Search Hero */}
        <div className="bg-gradient-to-b from-neutral-950 to-neutral-900 rounded-lg p-8 md:p-12 mb-8">
          <h1 className="text-h1 font-bold text-neutral-200 mb-6 text-center">البحث</h1>
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أفلام، مسلسلات، أو أنمي..."
              className="w-full h-16 pr-14 pl-6 bg-neutral-800 border border-neutral-700 rounded-lg text-body text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-fast"
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-4">
          {[
            { value: 'all', label: 'الكل' },
            { value: 'movie', label: 'أفلام' },
            { value: 'series', label: 'مسلسلات' },
            { value: 'anime', label: 'أنمي' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedType(value as any)}
              className={`px-5 py-2 rounded-full text-small font-medium transition-all duration-fast whitespace-nowrap ${
                selectedType === value
                  ? 'bg-primary-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-neutral-400 py-20">جاري البحث...</div>
        ) : searchQuery.length < 2 ? (
          <div className="text-center text-neutral-400 py-20">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>اكتب كلمتين على الأقل للبحث</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-neutral-400 py-20">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl mb-2">لا توجد نتائج</p>
            <p className="text-small">جرب كلمات مختلفة أو قم بتغيير الفلاتر</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-body text-neutral-400">
                تم العثور على {results.length} نتيجة
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.map(item => (
                <ContentCard
                  key={`${item.type}-${item.id}`}
                  id={item.id}
                  title={item.title_ar}
                  year={item.year}
                  rating={item.rating}
                  views={item.views}
                  posterUrl={item.poster_url}
                  type={item.type}
                  language={item.language}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
