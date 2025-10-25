import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'video.movie' | 'video.tv_show' | 'video.episode'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export default function SEO({ 
  title, 
  description, 
  keywords = 'أفلام عربية, مسلسلات عربية, أنمي, بث مجاني, مشاهدة اون لاين, أفلام مجانية, سينما عربية',
  image = 'https://o47g7n1tgiu2.space.minimax.io/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author = 'سينماتك',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}: SEOProps) {
  const siteName = 'سينماتك'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName} - منصة البث العربية`
  const siteUrl = 'https://o47g7n1tgiu2.space.minimax.io'

  useEffect(() => {
    // Set page title
    document.title = fullTitle

    // Set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
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

    // Primary Meta Tags
    setMetaTag('description', description)
    setMetaTag('keywords', keywords)
    setMetaTag('author', author)
    setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMetaTag('language', 'Arabic')
    setMetaTag('revisit-after', '1 days')
    
    // Open Graph / Facebook
    setMetaTag('og:type', type, true)
    setMetaTag('og:url', url, true)
    setMetaTag('og:title', fullTitle, true)
    setMetaTag('og:description', description, true)
    setMetaTag('og:image', image, true)
    setMetaTag('og:image:width', '1200', true)
    setMetaTag('og:image:height', '630', true)
    setMetaTag('og:image:alt', title, true)
    setMetaTag('og:locale', 'ar_AR', true)
    setMetaTag('og:locale:alternate', 'en_US', true)
    setMetaTag('og:site_name', siteName, true)
    
    if (publishedTime) {
      setMetaTag('article:published_time', publishedTime, true)
    }
    if (modifiedTime) {
      setMetaTag('article:modified_time', modifiedTime, true)
    }
    if (section) {
      setMetaTag('article:section', section, true)
    }
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        const tagElement = document.createElement('meta')
        tagElement.setAttribute('property', 'article:tag')
        tagElement.setAttribute('content', tag)
        document.head.appendChild(tagElement)
      })
    }

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:url', url)
    setMetaTag('twitter:title', fullTitle)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', image)
    setMetaTag('twitter:image:alt', title)
    setMetaTag('twitter:creator', '@cinematech')
    setMetaTag('twitter:site', '@cinematech')

    // Mobile Web App
    setMetaTag('mobile-web-app-capable', 'yes')
    setMetaTag('apple-mobile-web-app-capable', 'yes')
    setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent')
    setMetaTag('apple-mobile-web-app-title', siteName)

    // Additional Meta Tags
    setMetaTag('format-detection', 'telephone=no')
    setMetaTag('theme-color', '#dc2626')

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // Alternate language links
    let alternateLang = document.querySelector('link[rel="alternate"][hreflang="en"]')
    if (!alternateLang) {
      alternateLang = document.createElement('link')
      alternateLang.setAttribute('rel', 'alternate')
      alternateLang.setAttribute('hreflang', 'en')
      document.head.appendChild(alternateLang)
    }
    alternateLang.setAttribute('href', url)

    // Set language and direction
    document.documentElement.lang = 'ar'
    document.documentElement.dir = 'rtl'

    // Preload critical images
    if (image && !document.querySelector(`link[rel="preload"][href="${image}"]`)) {
      const preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'image'
      preloadLink.href = image
      document.head.appendChild(preloadLink)
    }

  }, [fullTitle, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags, siteName, siteUrl])

  return null
}
