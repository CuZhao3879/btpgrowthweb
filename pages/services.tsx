import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target, TrendingUp, Users, Megaphone, FileText, BarChart,
  CheckCircle, X
} from 'lucide-react'

export default function Services() {
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const services = [
    {
      image: '/images/services/meta-ads.jpg',
      title: 'Meta Ads Solutions',
      description: 'Strategic Facebook and Instagram advertising campaigns that drive conversions and maximize ROI.',
      features: [
        'Campaign Strategy & Planning',
        'Ad Creative Development',
        'Audience Targeting & Segmentation',
        'A/B Testing & Optimization',
        'Performance Tracking & Reporting',
      ],
      pricing: [
        {
          name: 'Starter',
          price: 'Contact Us',
          description: 'Perfect for small businesses starting with Meta Ads',
          features: ['Campaign setup', 'Basic targeting', 'Monthly reporting', 'Email support'],
        },
        {
          name: 'Professional',
          price: 'Contact Us',
          description: 'Advanced campaigns for growing businesses',
          features: ['All Starter features', 'Advanced targeting', 'A/B testing', 'Weekly reporting', 'Priority support'],
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'Contact Us',
          description: 'Comprehensive solution for large-scale operations',
          features: ['All Professional features', 'Dedicated account manager', 'Custom strategy', 'Daily reporting', '24/7 support'],
        },
      ],
    },
    {
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
      pricing: [
        {
          name: 'Starter',
          price: 'Contact Us',
          description: 'Essential brand elements',
          features: ['Logo design', 'Color palette', 'Typography', '2 revisions'],
        },
        {
          name: 'Professional',
          price: 'Contact Us',
          description: 'Complete brand identity',
          features: ['All Starter features', 'Brand guidelines', 'Business cards', 'Social media templates', '5 revisions'],
          popular: true,
        },
        {
          name: 'Premium',
          price: 'Contact Us',
          description: 'Full brand development',
          features: ['All Professional features', 'Brand strategy', 'Market research', 'Complete stationery', 'Unlimited revisions'],
        },
      ],
    },
    {
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
      pricing: [
        {
          name: 'Essentials',
          price: 'Contact Us',
          description: 'Social media management basics',
          features: ['2 platforms', '10 posts/month', 'Basic analytics', 'Monthly strategy'],
        },
        {
          name: 'Professional',
          price: 'Contact Us',
          description: 'Complete social media solution',
          features: ['4 platforms', '20 posts/month', 'Community management', 'Detailed analytics', 'Weekly strategy'],
          popular: true,
        },
        {
          name: 'Premium',
          price: 'Contact Us',
          description: 'Full-service social media management',
          features: ['All platforms', 'Unlimited posts', 'Influencer outreach', 'Advanced analytics', 'Daily optimization'],
        },
      ],
    },
    {
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
      pricing: [
        {
          name: 'Landing Page',
          price: 'Contact Us',
          description: 'Single page website for campaigns',
          features: ['1-page design', 'Responsive layout', 'Contact form', 'Basic SEO'],
        },
        {
          name: 'Business Website',
          price: 'Contact Us',
          description: 'Multi-page website for businesses',
          features: ['5-10 pages', 'Custom design', 'CMS integration', 'Advanced SEO', '3 months support'],
          popular: true,
        },
        {
          name: 'E-Commerce',
          price: 'Contact Us',
          description: 'Full online store solution',
          features: ['Unlimited pages', 'Shopping cart', 'Payment gateway', 'Inventory management', '6 months support'],
        },
      ],
    },
    {
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
      pricing: [
        {
          name: 'MVP',
          price: 'Contact Us',
          description: 'Minimum viable product',
          features: ['Core functionality', 'Basic UI/UX', '3 revisions', '1 month support'],
        },
        {
          name: 'Full Product',
          price: 'Contact Us',
          description: 'Complete software solution',
          features: ['Advanced features', 'Custom UI/UX', 'Unlimited revisions', 'Testing', '3 months support'],
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'Contact Us',
          description: 'Large-scale custom solutions',
          features: ['Complex systems', 'Integration', 'Scalable architecture', 'Full documentation', '12 months support'],
        },
      ],
    },
    {
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
      pricing: [
        {
          name: 'Basic',
          price: 'Contact Us',
          description: 'Essential SEO for local businesses',
          features: ['Site audit', 'Keyword research', 'On-page optimization', 'Monthly reports'],
        },
        {
          name: 'Growth',
          price: 'Contact Us',
          description: 'Comprehensive SEO for competitive markets',
          features: ['All Basic features', 'Content strategy', 'Link building', 'Local SEO', 'Bi-weekly reports'],
          popular: true,
        },
        {
          name: 'Premium',
          price: 'Contact Us',
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
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive growth solutions designed to accelerate your business growth 
              and achieve your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
                    {/* Service Image - 1080x1080px JPG */}
                    <div className="relative w-full aspect-square bg-gray-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image not found
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"%3E%3Crect width="1080" height="1080" fill="%233b82f6"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dy=".3em"%3EService%3C/text%3E%3C/svg%3E';
                        }}
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
                            <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => setSelectedService(index)}
                        variant="outline"
                        className="w-full group-hover:bg-primary-50 transition-colors"
                      >
                        View Pricing
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
                {services[selectedService].title} - Pricing Plans
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
                          Most Popular
                        </span>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {plan.price}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        asChild
                        className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        <Link href="/contact">Get Started</Link>
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Let&apos;s discuss which services are right for your business and create 
              a customized strategy for your success.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
