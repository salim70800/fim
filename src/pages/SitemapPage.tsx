import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SitemapPage() {
  const [sitemap, setSitemap] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateSitemap()
  }, [])

  const generateSitemap = async () => {
    try {
      const siteUrl = 'https://h3zw3d7hye7k.space.minimax.io'
      const currentDate = new Date().toISOString()

      // جلب المحتوى
      const { data: content } = await supabase
        .from('content')
        .select('id, slug, type, updated_at, is_featured')
        .eq('status', 'published')

      // جلب الحلقات
      const { data: episodes } = await supabase
        .from('episodes')
        .select('id, slug, updated_at')
        .eq('status', 'published')
        .limit(1000)

      // بناء XML
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/movies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/series</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/anime</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${siteUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>\n`

      // إضافة المحتوى
      content?.forEach(item => {
        const priority = item.is_featured ? '1.0' : '0.9'
        const changefreq = item.is_featured ? 'daily' : 'weekly'
        const lastmod = item.updated_at || currentDate
        
        xml += `  <url>
    <loc>${siteUrl}/${item.type}/${item.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n`
      })

      // إضافة الحلقات
      episodes?.forEach(episode => {
        const lastmod = episode.updated_at || currentDate
        
        xml += `  <url>
    <loc>${siteUrl}/episode/${episode.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`
      })

      xml += `</urlset>`

      setSitemap(xml)
      setLoading(false)

      // تنزيل تلقائي
      const blob = new Blob([xml], { type: 'application/xml' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sitemap.xml'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error generating sitemap:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>جاري إنشاء Sitemap...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sitemap XML</h1>
        <div className="bg-neutral-800 p-6 rounded-lg">
          <pre className="text-sm overflow-auto max-h-96 text-green-400">
            {sitemap}
          </pre>
        </div>
        <div className="mt-6 text-center">
          <p className="text-neutral-400">تم تنزيل الملف تلقائياً</p>
          <button
            onClick={generateSitemap}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            إعادة التوليد
          </button>
        </div>
      </div>
    </div>
  )
}
