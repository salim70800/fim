import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Content, Episode, Server } from '../types/database'
import DynamicSEO from '../components/DynamicSEO'
import VideoPlayer from '../components/ui/VideoPlayer'
import { ChevronLeft, ChevronRight, Home, List, Calendar, Clock } from 'lucide-react'

export default function SingleEpisodePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState<Content | null>(null)
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [servers, setServers] = useState<Server[]>([])
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      if (!id) return

      try {
        setLoading(true)

        // جلب بيانات الحلقة
        const { data: episodeData, error: episodeError } = await supabase
          .from('episodes')
          .select('*')
          .eq('id', id)
          .single()

        if (episodeError) throw episodeError
        setEpisode(episodeData)

        // جلب بيانات المحتوى الأساسي
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('id', episodeData.content_id)
          .single()

        if (contentError) throw contentError
        setContent(contentData)

        // جلب السيرفرات الخاصة بالحلقة
        const { data: serversData } = await supabase
          .from('servers')
          .select('*')
          .eq('episode_id', id)
          .eq('is_active', true)
          .order('priority', { ascending: true })

        if (serversData) {
          setServers(serversData)
        }

        // جلب جميع حلقات المحتوى للتنقل
        const { data: episodesData } = await supabase
          .from('episodes')
          .select('*')
          .eq('content_id', episodeData.content_id)
          .eq('status', 'published')
          .order('season_number', { ascending: true })
          .order('episode_number', { ascending: true })

        if (episodesData) {
          setAllEpisodes(episodesData)
        }
      } catch (error) {
        console.error('Error fetching episode:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodeDetails()
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

  if (!content || !episode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 text-lg mb-4">الحلقة غير موجودة</p>
          <Link to="/" className="text-orange-500 hover:text-orange-400">
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  // العثور على الحلقة السابقة والتالية
  const currentIndex = allEpisodes.findIndex(ep => ep.id === episode.id)
  const previousEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null
  const nextEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null

  const contentType = content.type === 'anime' ? 'anime' : 'series'
  const contentTypeAr = content.type === 'anime' ? 'أنمي' : 'مسلسل'

  return (
    <>
      <DynamicSEO content={content} episode={episode} type="episode" />
      
      <div className="min-h-screen bg-black">
        {/* Breadcrumb Navigation */}
        <div className="bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Link to="/" className="hover:text-orange-500 transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronLeft className="w-4 h-4" />
              <Link 
                to={`/${contentType}s`} 
                className="hover:text-orange-500 transition-colors"
              >
                {contentType === 'anime' ? 'الأنمي' : 'المسلسلات'}
              </Link>
              <ChevronLeft className="w-4 h-4" />
              <Link 
                to={`/${contentType}/${content.id}`}
                className="hover:text-orange-500 transition-colors"
              >
                {content.title_ar}
              </Link>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-white">الحلقة {episode.episode_number}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Episode Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {episode.title_ar}
            </h1>
            {episode.title_en && (
              <p className="text-xl text-neutral-400">{episode.title_en}</p>
            )}
            <div className="flex items-center justify-center gap-4 mt-4 text-neutral-400">
              {episode.season_number && (
                <span className="flex items-center gap-1.5">
                  <List className="w-4 h-4" />
                  الموسم {episode.season_number}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                الحلقة {episode.episode_number}
              </span>
              {episode.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {episode.duration} دقيقة
                </span>
              )}
              {episode.air_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(episode.air_date).toLocaleDateString('ar-EG')}
                </span>
              )}
            </div>
          </div>

          {/* Video Player */}
          {servers.length > 0 ? (
            <VideoPlayer servers={servers} title={`${content.title_ar} - ${episode.title_ar}`} autoPlay={true} />
          ) : (
            <div className="w-full aspect-video bg-neutral-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-neutral-400 mb-2">لا توجد سيرفرات متاحة لهذه الحلقة</p>
                <p className="text-sm text-neutral-500">يرجى المحاولة لاحقاً</p>
              </div>
            </div>
          )}

          {/* Episode Description */}
          {episode.description && (
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-3">نبذة عن الحلقة</h2>
              <p className="text-neutral-300 leading-relaxed">{episode.description}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            {previousEpisode ? (
              <button
                onClick={() => navigate(`/episode/${previousEpisode.id}`)}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 rounded-lg p-4 transition-colors text-right"
              >
                <div className="flex items-center justify-between">
                  <ChevronRight className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">الحلقة السابقة</p>
                    <p className="text-white font-semibold">الحلقة {previousEpisode.episode_number}</p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex-1"></div>
            )}

            <Link
              to={`/${contentType}/${content.id}`}
              className="px-6 py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
            >
              <List className="w-5 h-5" />
              <span>جميع الحلقات</span>
            </Link>

            {nextEpisode ? (
              <button
                onClick={() => navigate(`/episode/${nextEpisode.id}`)}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 rounded-lg p-4 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">الحلقة التالية</p>
                    <p className="text-white font-semibold">الحلقة {nextEpisode.episode_number}</p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-orange-500" />
                </div>
              </button>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>

          {/* All Episodes List */}
          {allEpisodes.length > 0 && (
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">جميع الحلقات</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allEpisodes.map((ep) => (
                  <Link
                    key={ep.id}
                    to={`/episode/${ep.id}`}
                    className={`
                      p-4 rounded-lg transition-all
                      ${ep.id === episode.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">الحلقة {ep.episode_number}</p>
                        <p className="text-sm opacity-75 line-clamp-1">{ep.title_ar}</p>
                      </div>
                      {ep.duration && (
                        <span className="text-sm opacity-75">{ep.duration} د</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Series/Anime */}
          <div className="text-center">
            <Link
              to={`/${contentType}/${content.id}`}
              className="inline-block px-6 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-white font-semibold transition-colors"
            >
              العودة إلى صفحة {contentTypeAr}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
