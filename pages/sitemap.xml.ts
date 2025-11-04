import { GetServerSideProps } from 'next'
import { getAllPosts } from '@/lib/blog'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://btpgrowth.com'

interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: string
  priority: number
}

function generateSitemap(): string {
  const posts = getAllPosts()
  
  // 静态页面
  const staticPages: SitemapUrl[] = [
    {
      loc: `${SITE_URL}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      loc: `${SITE_URL}/about`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/services`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${SITE_URL}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    },
  ]

  // 博客文章页面
  const blogPages: SitemapUrl[] = posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: 'monthly',
    priority: 0.7,
  }))

  const allUrls = [...staticPages, ...blogPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return sitemap
}

export default function Sitemap() {
  // This component will never be rendered
  return null
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSitemap()

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

