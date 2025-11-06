import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, Tag, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPosts, getPostBySlug, getLatestPosts, BlogPost } from '@/lib/blog'
import ReactMarkdown from 'react-markdown'
import { useLanguage } from '@/contexts/LanguageContext'

interface BlogPostPageProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogPostPage({ post, relatedPosts }: BlogPostPageProps) {
  const { t, language } = useLanguage()
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t('blog.notFound')}</h1>
        <Link href="/blog">
          <Button className="mt-4">{t('blog.backToBlog')}</Button>
        </Link>
      </div>
    )
  }

  // Schema.org structured data for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image || '',
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'BTP Growth Solutions',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://btpgrowth.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BTP Growth Solutions',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://btpgrowth.com'}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://btpgrowth.com'}/blog/${post.slug}`,
    },
  }

  return (
    <>
      <NextSeo
        title={`${post.title} | BTP Growth Solutions Blog`}
        description={post.description}
        openGraph={{
          title: post.title,
          description: post.description,
          images: post.image ? [{ url: post.image }] : [],
          type: 'article',
          article: {
            publishedTime: post.date,
            tags: [post.category],
          },
        }}
      />
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero Section with Featured Image */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Link href="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('blog.backToBlog')}
              </Button>
            </Link>

            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600">{post.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {language === 'zh' 
                    ? new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
                    : new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <section className="bg-white py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                  quality={90}
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="prose prose-lg prose-blue max-w-none
                prose-headings:font-heading prose-headings:font-bold prose-headings:scroll-mt-24
                prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:text-gray-900
                prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-gray-800
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-6 prose-ul:space-y-2
                prose-ol:my-6 prose-ol:space-y-2
                prose-li:text-gray-700 prose-li:my-2 prose-li:leading-relaxed
                prose-img:rounded-xl prose-img:shadow-xl prose-img:my-0 prose-img:w-full prose-img:h-auto
                prose-img:border prose-img:border-gray-200 prose-img:block
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500
                prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:my-6
                prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:italic
                prose-blockquote:text-gray-800
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-code:text-sm prose-code:text-primary-700 prose-code:font-mono
                prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
                prose-pre:shadow-lg prose-pre:my-6 prose-pre:overflow-x-auto
                prose-hr:my-10 prose-hr:border-gray-300
              "
            >
              <ReactMarkdown
                components={{
                  // Render images using Next.js Image component for optimization
                  img: ({ node, ...props }: any) => {
                    const src = props.src || ''
                    const alt = props.alt || 'Article image'
                    
                    // Check if it's an external URL
                    const isExternal = src.startsWith('http://') || src.startsWith('https://')
                    
                    // For external images, use regular img tag (can add remotePatterns in next.config.js if needed)
                    if (isExternal) {
                      return (
                        <img 
                          src={src}
                          alt={alt}
                          className="rounded-xl shadow-xl w-full h-auto border border-gray-200 my-8 block"
                          loading="lazy"
                          decoding="async"
                        />
                      )
                    }
                    
                    // For local images, use Next.js Image component with fill
                    return (
                      <div className="relative w-full my-8" style={{ minHeight: '200px', aspectRatio: '16/9' }}>
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="rounded-xl shadow-xl border border-gray-200 object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                          loading="lazy"
                          quality={85}
                        />
                      </div>
                    )
                  },
                  // Convert paragraphs that start with "Why This Matters" to divs
                  // Also handle figure captions (italics starting with "Figure")
                  p: ({ node, ...props }: any) => {
                    const getText = (children: any): string => {
                      if (typeof children === 'string') return children
                      if (Array.isArray(children)) {
                        return children.map(getText).join('')
                      }
                      if (children?.props?.children) return getText(children.props.children)
                      return ''
                    }
                    const text = getText(props.children)
                    
                    // Handle "Why This Matters" as a special div
                    if (text.includes('Why This Matters')) {
                      return (
                        <div className="my-6 p-4 bg-blue-50 border-l-4 border-primary-400 rounded-r-lg text-gray-800 font-medium leading-relaxed">
                          {props.children}
                        </div>
                      )
                    }
                    
                    // Handle figure captions - convert to caption div
                    if (text.includes('Figure') && (text.includes(':') || text.startsWith('Figure'))) {
                      return (
                        <p className="text-sm text-gray-500 text-center mt-2 italic mb-8" {...props} />
                      )
                    }
                    
                    return <p {...props} />
                  },
                  h2: ({ node, ...props }) => {
                    const getText = (children: any): string => {
                      if (typeof children === 'string') return children
                      if (Array.isArray(children)) {
                        return children.map(getText).join('')
                      }
                      if (children?.props?.children) return getText(children.props.children)
                      return ''
                    }
                    const text = getText(props.children)
                    const isStrategy = text.includes('Strategy')
                    // Check if title starts with a number (e.g., "1. ", "2. ", etc.)
                    const isNumberedTitle = /^\d+\.\s/.test(text.trim())
                    
                    if (isNumberedTitle) {
                      const match = text.match(/^(\d+)\.\s(.+)$/)
                      const number = match ? match[1] : ''
                      const titleText = match ? match[2] : text
                      
                      return (
                        <div className="my-10">
                          <h2 
                            {...props} 
                            className="scroll-mt-24 text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-4 pb-3 border-b border-gray-200"
                          >
                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                              {number}
                            </span>
                            <span>{titleText}</span>
                          </h2>
                        </div>
                      )
                    }
                    
                    return (
                      <div className="my-10">
                        <h2 
                          {...props} 
                          className={`scroll-mt-24 relative ${
                            isStrategy 
                              ? 'bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-4 rounded-lg border-l-4 border-primary-600 shadow-md text-xl md:text-2xl font-black text-gray-900' 
                              : 'text-2xl md:text-3xl font-bold text-gray-900 pl-6 border-l-4 border-primary-500 py-2'
                          }`}
                        >
                          {!isStrategy && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
                          )}
                          {props.children}
                        </h2>
                      </div>
                    )
                  },
                  hr: () => (
                    <div className="my-12">
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>
                  ),
                  ul: ({ node, ...props }) => {
                    const getText = (children: any): string => {
                      if (typeof children === 'string') return children
                      if (Array.isArray(children)) {
                        return children.map(getText).join('')
                      }
                      if (children?.props?.children) return getText(children.props.children)
                      return ''
                    }
                    const text = getText(props.children)
                    if (text.includes('✅')) {
                      return (
                        <div className="my-6 p-5 bg-green-50 border border-green-200 rounded-lg">
                          <ul {...props} className="list-none space-y-2 m-0" />
                        </div>
                      )
                    }
                    return <ul {...props} />
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </motion.div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">
                {t('blog.relatedArticles')}
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative h-40 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                        {relatedPost.image ? (
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                            quality={85}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <span className="text-sm">Blog Post</span>
                          </div>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2 hover:text-primary-600 transition-colors">
                          {relatedPost.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {relatedPost.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(relatedPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{relatedPost.readingTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 items-stretch">
            {/* Left Card - Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 text-center lg:text-left py-12 px-8 md:px-16 bg-white rounded-2xl border-2 border-gray-200 shadow-2xl flex flex-col"
            >
              {/* Logo + Title */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="BTP Growth Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-900 whitespace-nowrap">
                  BTP Growth Solutions
                </h2>
              </div>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-10 max-w-2xl lg:max-w-none">
                {t('cta.subtitle')}
              </p>

              {/* Features List */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 mb-10 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-white rounded-full border-2 border-primary-600 flex items-center justify-center shadow-sm">
                    <Check className="h-[18px] w-[18px] text-primary-600 stroke-[2.5]" />
                  </div>
                  <span className="text-gray-700 font-medium">{t('cta.features.allInOne')}</span>
                </div>
                <div className="hidden md:block text-gray-300">|</div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-white rounded-full border-2 border-primary-600 flex items-center justify-center shadow-sm">
                    <Check className="h-[18px] w-[18px] text-primary-600 stroke-[2.5]" />
                  </div>
                  <span className="text-gray-700 font-medium">{t('cta.features.aiPowered')}</span>
                </div>
                <div className="hidden md:block text-gray-300">|</div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-white rounded-full border-2 border-primary-600 flex items-center justify-center shadow-sm">
                    <Check className="h-[18px] w-[18px] text-primary-600 stroke-[2.5]" />
                  </div>
                  <span className="text-gray-700 font-medium">{t('cta.features.techDriven')}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <p className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {t('cta.takeBusinessNext')}
                </p>
                <div className="hidden sm:flex items-center text-primary-600">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/contact">{t('cta.letsStart')}</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Card - Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="py-4 px-3 bg-white rounded-2xl border-2 border-gray-200 shadow-2xl flex flex-col"
            >
              <div className="space-y-4 flex-grow">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('cta.contact.emailLabel')}</p>
                  <a 
                    href="mailto:marketing@btpgrowth.com" 
                    className="text-primary-600 hover:text-primary-700 font-medium text-base break-all"
                  >
                    marketing@btpgrowth.com
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('cta.contact.phoneLabel')}</p>
                  <a 
                    href="tel:+60105421018" 
                    className="text-primary-600 hover:text-primary-700 font-medium text-base"
                  >
                    +6010-5421018
                  </a>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">{t('contact.info.findUs')}</p>
                  <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src="https://www.google.com/maps?q=No+41,+Lorong+Kendi+9,+Taman+Merak+14100+Simpang+Ampat,+Pulau+Pinang&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                      title="BTP Growth Solutions Location"
                    ></iframe>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{t('cta.contact.businessHours')}:</p>
                      <p className="text-sm text-gray-700 font-medium">Mon - Fri: 9am - 6pm</p>
                      <p className="text-sm text-gray-700 font-medium">Sat: 9am - 1pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  const relatedPosts = getLatestPosts(slug, 3)

  return {
    props: {
      post,
      relatedPosts,
    },
  }
}

