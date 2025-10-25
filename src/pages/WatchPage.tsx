import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Play, Star, Eye, Calendar, Globe, Clock, AlertCircle } from 'lucide-react'
import ContentCard from '../components/ui/ContentCard'
import SEO from '../components/SEO'

export default function WatchPage() {
  const { type, id } = useParams()
  const [content, setContent] = useState<any>(null)
  const [servers, setServers] = useState<any[]>([])
  const [episodes, setEpisodes] = useState<any[]>([])
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedServer, setSelectedServer] = useState<number>(0)
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null)

  useEffect(() => {
    if (type && id) {
      fetchContent()
    }
  }, [type, id])

  const fetchContent = async () => {
    try {
      setLoading(true)
      
      // Fetch main content
      const tableName = type === 'movie' ? 'movies' : type === 'series' ? 'series' : 'anime'
      const { data } = await supabase
        .from(tableName)
        .select(`
          *,
          content_genres (
            genres (name_ar)
          )
        `)
        .eq('id', id)
        .single()

      if (data) {
        const contentData = {
          ...data,
          genres: data.content_genres?.map((cg: any) => cg.genres?.name_ar).filter(Boolean) || []
        }
        setContent(contentData)

        // Fetch servers
        const { data: serversData } = await supabase
          .from('servers')
          .select('*')
          .eq('content_type', type)
          .eq('content_id', id)
          .is('episode_id', null)

        if (serversData) setServers(serversData)

        // Fetch episodes if series or anime
        if (type === 'series' || type === 'anime') {
          const { data: episodesData } = await supabase
            .from('episodes')
            .select('*')
            .eq('content_type', type)
            .eq('content_id', id)
            .order('episode_number', { ascending: true })

          if (episodesData) setEpisodes(episodesData)
        }

        // Fetch similar content
        const { data: similarData } = await supabase
          .from(tableName)
          .select('*')
          .neq('id', id)
          .limit(12)

        if (similarData) setSimilar(similarData)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-400 text-xl">جاري التحميل...</div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-400 text-xl">المحتوى غير موجود</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={content.title_ar}
        description={content.description || `شاهد ${content.title_ar} مجاناً بجودة عالية مع سيرفرات متعددة`}
        keywords={`${content.title_ar}, ${content.genres?.join(', ')}, مشاهدة, بث مباشر, اون لاين`}
        image={content.poster_url || content.backdrop_url}
        type={type === 'movie' ? 'video.movie' : 'video.tv_show'}
      />
      {/* Hero Background */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={content.backdrop_url || content.poster_url}
          alt={content.title_ar}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/80 to-neutral-900" />
        
        <div className="absolute bottom-0 container mx-auto px-4 pb-8">
          <h1 className="text-hero font-bold text-neutral-200 mb-2">{content.title_ar}</h1>
          {content.title_en && (
            <p className="text-body-large text-neutral-400 mb-4">{content.title_en}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-neutral-800 rounded-lg overflow-hidden mb-6">
              <div className="aspect-video bg-neutral-950 flex items-center justify-center">
                {servers.length > 0 ? (
                  <iframe
                    src={servers[selectedServer]?.server_url}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-neutral-400">
                    <Play className="w-16 h-16 mx-auto mb-2" />
                    <p>لا توجد سيرفرات متاحة</p>
                  </div>
                )}
              </div>

              {/* Server Tabs */}
              {servers.length > 0 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {servers.map((server, index) => (
                    <button
                      key={server.id}
                      onClick={() => setSelectedServer(index)}
                      className={`px-4 py-2 rounded-lg text-small font-medium whitespace-nowrap transition-all duration-fast ${
                        selectedServer === index
                          ? 'bg-primary-500 text-neutral-950'
                          : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                    >
                      {server.server_name} {server.quality && `(${server.quality})`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {content.description && (
              <div className="mb-6">
                <h3 className="text-h3 font-semibold text-neutral-200 mb-3">القصة</h3>
                <p className="text-body text-neutral-400 leading-relaxed">
                  {content.description}
                </p>
              </div>
            )}

            {/* Episodes Grid */}
            {episodes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-h3 font-semibold text-neutral-200 mb-4">الحلقات</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {episodes.map(episode => (
                    <button
                      key={episode.id}
                      onClick={() => setSelectedEpisode(episode.id)}
                      className={`p-4 rounded-lg border transition-all duration-fast ${
                        selectedEpisode === episode.id
                          ? 'bg-primary-500 border-primary-500 text-neutral-950'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      <div className="text-small font-medium">
                        الحلقة {episode.episode_number}
                      </div>
                      {episode.title_ar && (
                        <div className="text-tiny mt-1 line-clamp-1">
                          {episode.title_ar}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Poster */}
            <img
              src={content.poster_url}
              alt={content.title_ar}
              className="w-full rounded-lg mb-6"
            />

            {/* Info */}
            <div className="bg-neutral-800 rounded-lg p-6 mb-6">
              <h3 className="text-h3 font-semibold text-neutral-200 mb-4">المعلومات</h3>
              
              <div className="space-y-3">
                {content.rating && (
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-primary-500 fill-current" />
                    <span className="text-body text-neutral-300">
                      {content.rating.toFixed(1)} / 10
                    </span>
                  </div>
                )}

                {content.views !== undefined && (
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-primary-500" />
                    <span className="text-body text-neutral-300">
                      {content.views.toLocaleString('ar-EG')} مشاهدة
                    </span>
                  </div>
                )}

                {content.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    <span className="text-body text-neutral-300">{content.year}</span>
                  </div>
                )}

                {content.language && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary-500" />
                    <span className="text-body text-neutral-300">{content.language}</span>
                  </div>
                )}

                {content.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <span className="text-body text-neutral-300">{content.duration} دقيقة</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {content.genres && content.genres.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-700">
                  <h4 className="text-small font-semibold text-neutral-300 mb-3">التصنيفات</h4>
                  <div className="flex flex-wrap gap-2">
                    {content.genres.map((genre: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-neutral-700 text-tiny text-neutral-300 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Content */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h3 className="text-h2 font-semibold text-neutral-200 mb-6">محتوى مشابه</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {similar.map(item => (
                <ContentCard
                  key={item.id}
                  id={item.id}
                  title={item.title_ar}
                  year={item.year}
                  rating={item.rating}
                  posterUrl={item.poster_url}
                  type={type as any}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
