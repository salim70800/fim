import { useState, useEffect, useRef } from 'react'
import { Server } from '../../types/database'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  servers: Server[]
  title: string
  autoPlay?: boolean
}

export default function VideoPlayer({ servers, title, autoPlay = false }: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showServerList, setShowServerList] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // اختيار السيرفر الأول النشط عند التحميل
  useEffect(() => {
    const activeServers = servers.filter(s => s.is_active)
    if (activeServers.length > 0) {
      // ترتيب حسب الأولوية
      const sortedServers = [...activeServers].sort((a, b) => a.priority - b.priority)
      setSelectedServer(sortedServers[0])
    }
  }, [servers])

  const handleServerChange = (server: Server) => {
    setIsLoading(true)
    setSelectedServer(server)
    setShowServerList(false)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const activeServers = servers.filter(s => s.is_active)

  if (activeServers.length === 0) {
    return (
      <div className="w-full aspect-video bg-neutral-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-2">لا توجد سيرفرات متاحة حالياً</p>
          <p className="text-sm text-neutral-500">يرجى المحاولة لاحقاً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* مشغل الفيديو */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        )}
        
        {selectedServer && (
          <iframe
            ref={iframeRef}
            src={selectedServer.embed_url}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        )}

        {/* شريط التحكم السفلي */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button className="hover:text-orange-500 transition-colors">
                <Play className="w-5 h-5" />
              </button>
              <button className="hover:text-orange-500 transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-sm">{selectedServer?.quality || 'HD'}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm">{selectedServer?.server_name}</span>
              <button className="hover:text-orange-500 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="hover:text-orange-500 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة السيرفرات */}
      <div className="bg-neutral-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">السيرفرات المتاحة</h3>
          <span className="text-sm text-neutral-400">{activeServers.length} سيرفر</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {activeServers.map((server) => (
            <button
              key={server.id}
              onClick={() => handleServerChange(server)}
              className={`
                px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${selectedServer?.id === server.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }
              `}
            >
              <div className="flex flex-col items-start">
                <span>{server.server_name}</span>
                <span className="text-xs opacity-75">
                  {server.quality} • {server.language}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* معلومات السيرفر الحالي */}
        {selectedServer && (
          <div className="mt-3 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">السيرفر الحالي:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{selectedServer.server_name}</span>
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded text-xs">
                  {selectedServer.quality}
                </span>
                <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-xs">
                  {selectedServer.language}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
