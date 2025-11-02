import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target, TrendingUp, Users, Megaphone, FileText, BarChart,
  CheckCircle, X
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Services() {
  const { t } = useLanguage()
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const services = [
    {
      icon: Megaphone,
      image: '/images/services/meta-ads.jpg',
      title: 'Meta Ads Solutions',
      description: 'Strategic Facebook and Instagram advertising campaigns that drive conversions.',
      features: [
        'Campaign Strategy & Planning',
        'Ad Creative Development',
        'Audience Targeting & Segmentation',
        'A/B Testing & Optimization',
        'Performance Tracking & Reporting',
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      pricing: [
        {
          name: 'Starter',
          price: 'RM 499',
          paymentType: '/month',
          description: 'Perfect for small businesses starting with Meta Ads',
          features: ['Campaign setup', 'Basic targeting', 'Monthly reporting', 'Email support'],
        },
        {
          name: 'Professional',
          price: 'RM 1599',
          paymentType: '/month',
          description: 'Advanced campaigns for growing businesses',
          features: ['All Starter features', 'Advanced targeting', 'A/B testing', 'Weekly reporting', 'Priority support'],
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'RM 3599',
          paymentType: '/month',
          description: 'Comprehensive solution for large-scale operations',
          features: ['All Professional features', 'Dedicated account manager', 'Custom strategy', 'Daily reporting', '24/7 support'],
        },
      ],
    },
    {
      icon: BarChart,
      image: '/images/services/brand-development.jpg',
      title: 'Brand Development',
      description: 'Develop a strong brand identity that stands out in the market.',
      features: [
        'Brand Strategy',
        'Logo & Visual Identity',
        'Brand Guidelines',
        'Messaging Framework',
        'Brand Positioning',
      ],
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      pricing: [
        {
          name: 'Starter',
          price: 'RM 899',
          paymentType: 'one-time payment',
          description: 'Essential brand elements',
          features: ['Logo design', 'Color palette', 'Typography', '2 revisions'],
        },
        {
          name: 'Professional',
          price: 'RM 1599',
          paymentType: 'one-time payment',
          description: 'Complete brand identity',
          features: ['All Starter features', 'Brand guidelines', 'Business cards', 'Social media templates', '5 revisions'],
          popular: true,
        },
        {
          name: 'Premium',
          price: 'RM 2880',
          paymentType: 'one-time payment',
          description: 'Full brand development',
          features: ['All Professional features', 'Brand strategy', 'Market research', 'Complete stationery', 'Unlimited revisions'],
        },
      ],
    },
    {
      icon: Users,
      image: '/images/services/social-media.jpg',
      title: 'Social Media Marketing',
      description: 'Build and engage your audience across all major social platforms.',
      features: [
        'Social Media Strategy',
        'Content Creation & Curation',
        'Community Management',
        'Paid Social Advertising',
        'Influencer Partnerships',
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      pricing: [
        {
          name: 'Essentials',
          price: 'RM 1500',
          paymentType: '/month',
          description: 'Social media management basics',
          features: ['2 platforms', '10 posts/month', 'Basic analytics', 'Monthly strategy'],
        },
        {
          name: 'Professional',
          price: 'RM 3000',
          paymentType: '/month',
          description: 'Complete social media solution',
          features: ['4 platforms', '20 posts/month', 'Community management', 'Detailed analytics', 'Weekly strategy'],
          popular: true,
        },
        {
          name: 'Premium',
          price: 'RM 8000',
          paymentType: '/month',
          description: 'Full-service social media management',
          features: ['All platforms', 'Unlimited posts', 'Influencer outreach', 'Advanced analytics', 'Daily optimization'],
        },
      ],
    },
    {
      icon: FileText,
      image: '/images/services/web-development.jpg',
      title: 'Web Development',
      description: 'Custom, responsive websites built with modern technologies for optimal performance.',
      features: [
        'Custom Design & Development',
        'Responsive & Mobile-First',
        'SEO-Friendly Structure',
        'Performance Optimization',
        'Ongoing Maintenance & Support',
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      pricing: [
        {
          name: 'Landing Page',
          price: 'RM 899',
          paymentType: 'one-time payment',
          description: 'Single page website for campaigns',
          features: ['1-page design', 'Responsive layout', 'Contact form', 'Basic SEO'],
        },
        {
          name: 'Business Website',
          price: 'RM 2280',
          paymentType: 'one-time payment',
          description: 'Multi-page website for businesses',
          features: ['5-10 pages', 'Custom design', 'CMS integration', 'Advanced SEO', '3 months support'],
          popular: true,
        },
        {
          name: 'E-Commerce',
          price: 'RM 12000',
          paymentType: 'one-time payment',
          description: 'Full online store solution',
          features: ['Unlimited pages', 'Shopping cart', 'Payment gateway', 'Inventory management', '6 months support'],
        },
      ],
    },
    {
      icon: Target,
      image: '/images/services/software-development.jpg',
      title: 'Software Development',
      description: 'Tailored software solutions to streamline your operations and enhance productivity.',
      features: [
        'Custom Software Solutions',
        'System Integration',
        'Mobile App Development',
        'API Development',
        'Cloud Solutions',
      ],
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      pricing: [
        {
          name: 'MVP',
          price: 'RM 899',
          paymentType: '/month',
          description: 'Minimum viable product',
          features: ['Core functionality', 'Basic UI/UX', '3 revisions', '1 month support'],
        },
        {
          name: 'Full Product',
          price: 'RM 1599',
          paymentType: '/month',
          description: 'Complete software solution',
          features: ['Advanced features', 'Custom UI/UX', 'Unlimited revisions', 'Testing', '3 months support'],
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'RM 4599',
          paymentType: '/month',
          description: 'Large-scale custom solutions',
          features: ['Complex systems', 'Integration', 'Scalable architecture', 'Full documentation', '12 months support'],
        },
      ],
    },
    {
      icon: TrendingUp,
      image: '/images/services/seo-optimization.jpg',
      title: 'SEO Optimization',
      description: 'Improve your search rankings and drive organic traffic to your website.',
      features: [
        'Technical SEO Audit',
        'On-Page Optimization',
        'Content Strategy',
        'Link Building',
        'Local SEO',
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      pricing: [
        {
          name: 'Basic',
          price: 'RM 1500',
          paymentType: '/month',
          description: 'Essential SEO for local businesses',
          features: ['Site audit', 'Keyword research', 'On-page optimization', 'Monthly reports'],
        },
        {
          name: 'Growth',
          price: 'RM 3000',
          paymentType: '/month',
          description: 'Comprehensive SEO for competitive markets',
          features: ['All Basic features', 'Content strategy', 'Link building', 'Local SEO', 'Bi-weekly reports'],
          popular: true,
        },
        {
          name: 'Premium',
          price: 'RM 7000',
          paymentType: '/month',
          description: 'Full-service SEO for enterprise',
          features: ['All Growth features', 'Technical SEO', 'Competitor analysis', 'Custom strategy', 'Weekly reports'],
        },
      ],
    },
  ]

  return (
    <>
      <NextSeo
        title="Our Services | BTP Growth Solutions"
        description="Comprehensive growth solutions including Meta Ads, SEO, social media marketing, web development, software development, and brand development."
      />

      {/* Hero Section */}
      <section className="relative py-20 pt-32 md:pt-36 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-services-blog-background.jpg"
            alt="Services Background"
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
              {t('servicesPage.title')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('servicesPage.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
                    {/* Service Image - 16:9 Aspect Ratio */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    <CardHeader>
                      <CardTitle className="text-2xl group-hover:text-primary-600 transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => setSelectedService(index)}
                        variant="outline"
                        className="w-full group-hover:bg-primary-50 transition-colors"
                      >
                        {t('servicesPage.viewPricing')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Modal */}
      {selectedService !== null && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold">
                {services[selectedService].title} - {t('servicesPage.pricing.title')}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {services[selectedService].pricing.map((plan, idx) => (
                  <Card
                    key={idx}
                    className={`relative ${plan.popular ? 'border-2 border-primary-500 shadow-lg' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          {t('servicesPage.pricing.popular')}
                        </span>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                      <div className="mb-2">
                        <div className="text-3xl font-bold text-primary-600">
                          {plan.price}
                          {plan.paymentType && plan.paymentType === '/month' && (
                            <span className="text-2xl font-semibold">{t('servicesPage.pricing.month')}</span>
                          )}
                        </div>
                        {plan.paymentType && plan.paymentType === 'one-time payment' && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {t('servicesPage.pricing.oneTime')}
                          </div>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        asChild
                        className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        <Link href="/contact">{t('servicesPage.pricing.getStarted')}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              {t('servicesPage.ctaTitle')}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              {t('servicesPage.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 bg-white text-primary-600 rounded-md font-semibold hover:bg-blue-50 transition-colors text-center border border-primary-600">
                {t('cta.getInTouch')}
              </Link>
              <Link href="/services" className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center">
                {t('cta.viewServices')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
