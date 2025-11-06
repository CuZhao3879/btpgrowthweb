import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react'
import { getAllPosts, BlogPost } from '@/lib/blog'
import { useLanguage } from '@/contexts/LanguageContext'

interface BlogPageProps {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  totalPosts: number
}

const POSTS_PER_PAGE = 6

export default function BlogPage({ posts, currentPage, totalPages, totalPosts }: BlogPageProps) {
  const router = useRouter()
  const { t, language } = useLanguage()

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const handlePageChange = (page: number) => {
    router.push({
      pathname: '/blog',
      query: { page: page.toString() },
    })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 7
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200 transition-colors"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 text-gray-400">
            ...
          </span>
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-primary-600 text-white font-semibold'
              : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
          }`}
        >
          {i}
        </button>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 text-gray-400">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200 transition-colors"
        >
          {totalPages}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    )

    return pages
  }

  return (
    <>
      <NextSeo
        title="Blog | BTP Growth Solutions"
        description="Insights, strategies, and the latest trends in business growth, digital marketing, and technology."
      />

      {/* Hero Section */}
      <section className="relative py-20 pt-32 md:pt-36 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-services-blog-background.jpg"
            alt="Blog Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {t('blog.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('blog.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">{t('blog.noPostsMessage')}</p>
              <p className="text-gray-400 text-sm">
                {t('blog.noPostsHint')} <code className="bg-gray-100 px-2 py-1 rounded">content/blog/</code> {language === 'zh' ? '即可在此查看。' : 'to see them here.'}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post) => (
                <motion.div key={post.slug} variants={itemVariants}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                      {/* Featured Image */}
                      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                        {post.image ? (
                          <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-300">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              quality={85}
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <span className="text-sm">Blog Post Image</span>
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.slug === 'social-media-marketing-strategies' || post.slug === 'seo-best-practices-2025' || post.slug === 'malaysian-business-website-2025' || post.slug === 'branding-more-than-logo'
                              ? 'bg-primary-600 text-white shadow-lg' 
                              : 'bg-white text-primary-700 shadow-md'
                          }`}>
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary-600 transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {posts.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
              {renderPagination()}
            </div>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = parseInt(context.query.page as string) || 1
  const allPosts = getAllPosts()
  
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const startIndex = (page - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const posts = allPosts.slice(startIndex, endIndex)

  // Redirect to page 1 if page number is invalid
  if (page > totalPages && totalPages > 0) {
    return {
      redirect: {
        destination: '/blog?page=1',
        permanent: false,
      },
    }
  }

  return {
    props: {
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
    },
  }
}

