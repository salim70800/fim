import { useEffect } from 'react'
import { Content, Episode } from '../types/database'

interface DynamicSEOProps {
  content?: Content
  episode?: Episode
  type: 'movie' | 'series' | 'anime' | 'episode' | 'home' | 'page'
  customTitle?: string
  customDescription?: string
  customKeywords?: string
  breadcrumbs?: Array<{ name: string; url: string }>
}

export default function DynamicSEO({
  content,
  episode,
  type,
  customTitle,
  customDescription,
  customKeywords,
  breadcrumbs
}: DynamicSEOProps) {
  const siteUrl = 'https://o47g7n1tgiu2.space.minimax.io'
  const siteName = 'سينماتك'
  
  // بناء البيانات الأساسية
  let title = customTitle || siteName
  let description = customDescription || 'شاهد أحدث الأفلام والمسلسلات والأنمي العربية والعالمية بجودة عالية. منصة بث مجانية بالكامل مع محتوى متجدد يومياً'
  let keywords = customKeywords || 'أفلام عربية, مسلسلات عربية, أنمي, بث مجاني, مشاهدة اون لاين, أفلام مجانية, سينما عربية'
  let image = `${siteUrl}/og-image.jpg`
  let url = siteUrl
  let ogType: 'website' | 'video.movie' | 'video.tv_show' | 'video.episode' = 'website'

  // تخصيص حسب نوع المحتوى
  if (content && type === 'movie') {
    title = content.seo_title || `${content.title_ar} - فيلم ${content.year || ''} | مشاهدة وتحميل`
    description = content.seo_description || content.description || `شاهد فيلم ${content.title_ar} ${content.year ? `(${content.year})` : ''} بجودة عالية. ${content.title_en ? content.title_en + ' - ' : ''}${content.description?.substring(0, 100) || ''}`
    keywords = content.seo_keywords || `${content.title_ar}, ${content.title_en || ''}, فيلم ${content.year || ''}, ${content.country || ''}, أفلام ${content.language || 'عربية'}`
    image = content.banner_url || content.poster_url || image
    url = `${siteUrl}/movie/${content.id}`
    ogType = 'video.movie'
  } else if (content && (type === 'series' || type === 'anime')) {
    const contentType = type === 'series' ? 'مسلسل' : 'أنمي'
    const contentTypeEn = type === 'series' ? 'Series' : 'Anime'
    title = content.seo_title || `${content.title_ar} - ${contentType} ${content.year || ''} | جميع الحلقات`
    description = content.seo_description || content.description || `شاهد ${contentType} ${content.title_ar} ${content.year ? `(${content.year})` : ''} بجودة عالية. ${content.title_en ? content.title_en + ' - ' : ''}${content.description?.substring(0, 100) || ''}`
    keywords = content.seo_keywords || `${content.title_ar}, ${content.title_en || ''}, ${contentType} ${content.year || ''}, ${content.country || ''}, ${contentTypeEn}, ${content.language || 'عربية'}`
    image = content.banner_url || content.poster_url || image
    url = `${siteUrl}/${type}/${content.id}`
    ogType = 'video.tv_show'
  } else if (episode && content) {
    const contentType = content.type === 'anime' ? 'أنمي' : 'مسلسل'
    title = episode.seo_title || `${content.title_ar} - الحلقة ${episode.episode_number} ${episode.season_number ? `- الموسم ${episode.season_number}` : ''}`
    description = episode.seo_description || episode.description || `شاهد الحلقة ${episode.episode_number} ${episode.season_number ? `من الموسم ${episode.season_number}` : ''} من ${contentType} ${content.title_ar}. ${episode.title_ar ? episode.title_ar + ' - ' : ''}${episode.description?.substring(0, 100) || ''}`
    keywords = `${content.title_ar}, الحلقة ${episode.episode_number}, ${contentType}, ${content.title_en || ''}, مشاهدة ${content.title_ar}`
    image = episode.thumbnail_url || content.banner_url || content.poster_url || image
    url = `${siteUrl}/${content.type}/${content.id}/episode/${episode.id}`
    ogType = 'video.episode'
  }

  // تأكد أن العنوان يحتوي على اسم الموقع
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return
      
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    updateMetaTag('language', 'Arabic')
    
    // Open Graph
    updateMetaTag('og:type', ogType, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:image:width', '1200', true)
    updateMetaTag('og:image:height', '630', true)
    updateMetaTag('og:image:alt', title, true)
    updateMetaTag('og:site_name', siteName, true)
    updateMetaTag('og:locale', 'ar_AR', true)
    updateMetaTag('og:locale:alternate', 'en_US', true)
    
    // Video specific meta
    if (content && (type === 'movie' || type === 'series' || type === 'anime')) {
      if (content.year) {
        updateMetaTag('video:release_date', `${content.year}-01-01`, true)
      }
      if (content.duration) {
        updateMetaTag('video:duration', String(content.duration * 60), true)
      }
      // genres property removed as it's not in Content type
    }
    
    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', fullTitle)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:image:alt', title)
    updateMetaTag('twitter:site', '@cinematech')
    updateMetaTag('twitter:creator', '@cinematech')
    
    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // Alternate language
    let alternateLang = document.querySelector('link[rel="alternate"][hreflang="en"]')
    if (!alternateLang) {
      alternateLang = document.createElement('link')
      alternateLang.setAttribute('rel', 'alternate')
      alternateLang.setAttribute('hreflang', 'en')
      document.head.appendChild(alternateLang)
    }
    alternateLang.setAttribute('href', url)

    // Language and direction
    document.documentElement.lang = 'ar'
    document.documentElement.dir = 'rtl'

    // Preload hero image
    if (image && !document.querySelector(`link[rel="preload"][href="${image}"]`)) {
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'image'
      preloadLink.href = image
      preloadLink.setAttribute('fetchpriority', 'high')
      document.head.appendChild(preloadLink)
    }
  }, [fullTitle, description, keywords, image, url, siteName, ogType, type, content, episode])

  return null
}
