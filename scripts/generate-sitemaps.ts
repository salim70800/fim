// Script لتوليد Sitemap ثابت
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabaseUrl = 'https://fricraexcepedkxdigsa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyaWNyYWV4Y2VwZWRreGRpZ3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzY2NTMsImV4cCI6MjA3NjgxMjY1M30.UthrNpOGx12Cgfdeuj5Kw5AEwgSt9efHp08FI7mw8vY'

const supabase = createClient(supabaseUrl, supabaseKey)
const siteUrl = 'https://h3zw3d7hye7k.space.minimax.io'

async function generateMainSitemap() {
  console.log('Generating main sitemap...')
  
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

  fs.writeFileSync('public/sitemap.xml', xml, 'utf-8')
  console.log('Main sitemap generated successfully!')
  return xml
}

async function generateImageSitemap() {
  console.log('Generating image sitemap...')
  
  const currentDate = new Date().toISOString()

  const { data: content } = await supabase
    .from('content')
    .select('id, title_ar, title_en, type, poster_url, banner_url')
    .eq('status', 'published')

  const { data: episodes } = await supabase
    .from('episodes')
    .select('id, title_ar, thumbnail_url')
    .eq('status', 'published')
    .limit(1000)

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`

  content?.forEach(item => {
    const pageUrl = `${siteUrl}/${item.type}/${item.id}`
    const images = []
    
    if (item.poster_url) {
      images.push({
        url: item.poster_url,
        title: `${item.title_ar || item.title_en} - بوستر`,
        caption: `صورة بوستر ${item.type === 'movie' ? 'فيلم' : item.type === 'series' ? 'مسلسل' : 'أنمي'} ${item.title_ar || item.title_en}`
      })
    }
    
    if (item.banner_url) {
      images.push({
        url: item.banner_url,
        title: `${item.title_ar || item.title_en} - خلفية`,
        caption: `صورة خلفية ${item.type === 'movie' ? 'فيلم' : item.type === 'series' ? 'مسلسل' : 'أنمي'} ${item.title_ar || item.title_en}`
      })
    }

    if (images.length > 0) {
      xml += `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${currentDate}</lastmod>\n`
      
      images.forEach(img => {
        xml += `    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>\n`
      })
      
      xml += `  </url>\n`
    }
  })

  episodes?.forEach(episode => {
    if (episode.thumbnail_url) {
      const pageUrl = `${siteUrl}/episode/${episode.id}`
      
      xml += `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <image:image>
      <image:loc>${episode.thumbnail_url}</image:loc>
      <image:title>${episode.title_ar} - الحلقة</image:title>
      <image:caption>صورة مصغرة للحلقة ${episode.title_ar}</image:caption>
    </image:image>
  </url>\n`
    }
  })

  xml += `</urlset>`

  fs.writeFileSync('public/sitemap-images.xml', xml, 'utf-8')
  console.log('Image sitemap generated successfully!')
  return xml
}

async function generateSitemapIndex() {
  console.log('Generating sitemap index...')
  
  const currentDate = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-images.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://fricraexcepedkxdigsa.supabase.co/functions/v1/generate-sitemap</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`

  fs.writeFileSync('public/sitemap-index.xml', xml, 'utf-8')
  console.log('Sitemap index generated successfully!')
  return xml
}

async function main() {
  try {
    await generateMainSitemap()
    await generateImageSitemap()
    await generateSitemapIndex()
    console.log('All sitemaps generated successfully!')
  } catch (error) {
    console.error('Error generating sitemaps:', error)
    process.exit(1)
  }
}

main()
