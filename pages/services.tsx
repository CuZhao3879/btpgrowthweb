import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target, TrendingUp, Users, Megaphone, FileText, BarChart, 
  Mail, Video, CheckCircle 
} from 'lucide-react'
import Link from 'next/link'

export default function Services() {
  const [expandedService, setExpandedService] = useState<number | null>(null)

  const services = [
    {
      icon: Target,
      title: 'Digital Marketing Strategy',
      shortDesc: 'Comprehensive strategies tailored to your business goals.',
      fullDesc: 'We develop data-driven marketing strategies that align with your business objectives. Our approach includes market research, competitor analysis, audience targeting, and multi-channel planning to maximize your ROI.',
      features: [
        'Market Research & Analysis',
        'Competitor Benchmarking',
        'Target Audience Profiling',
        'Multi-Channel Strategy',
        'KPI Definition & Tracking',
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: TrendingUp,
      title: 'SEO Optimization',
      shortDesc: 'Improve rankings and drive organic traffic.',
      fullDesc: 'Our SEO experts optimize your website for search engines using proven techniques. We focus on technical SEO, content optimization, link building, and local SEO to improve your visibility and attract qualified traffic.',
      features: [
        'Technical SEO Audit',
        'On-Page Optimization',
        'Content Strategy',
        'Link Building',
        'Local SEO',
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Users,
      title: 'Social Media Marketing',
      shortDesc: 'Build and engage your audience across platforms.',
      fullDesc: 'We create and manage engaging social media campaigns across all major platforms. From content creation to community management, we help you build a strong social presence and connect with your audience.',
      features: [
        'Social Media Strategy',
        'Content Creation & Curation',
        'Community Management',
        'Paid Social Advertising',
        'Influencer Partnerships',
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Megaphone,
      title: 'Content Marketing',
      shortDesc: 'Create compelling content that converts.',
      fullDesc: 'Our content team creates high-quality, engaging content that resonates with your target audience. We develop blog posts, whitepapers, case studies, and more to establish your brand as an industry leader.',
      features: [
        'Content Strategy & Planning',
        'Blog Writing & Publishing',
        'Video Content Production',
        'Infographic Design',
        'Case Studies & Whitepapers',
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Mail,
      title: 'Email Marketing',
      shortDesc: 'Nurture leads and drive conversions.',
      fullDesc: 'We design and execute targeted email campaigns that nurture leads and drive conversions. Our approach includes segmentation, personalization, automation, and continuous optimization.',
      features: [
        'Email Campaign Strategy',
        'Template Design',
        'List Segmentation',
        'Marketing Automation',
        'A/B Testing & Optimization',
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: FileText,
      title: 'Brand Development',
      shortDesc: 'Build a strong, memorable brand identity.',
      fullDesc: 'We help you develop a compelling brand identity that stands out in the market. From logo design to brand guidelines, we ensure consistency across all touchpoints.',
      features: [
        'Brand Strategy',
        'Logo & Visual Identity',
        'Brand Guidelines',
        'Messaging Framework',
        'Brand Positioning',
      ],
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      icon: Video,
      title: 'Video Marketing',
      shortDesc: 'Engage audiences with compelling video content.',
      fullDesc: 'We produce professional video content that tells your story and engages your audience. From promotional videos to explainer content, we handle all aspects of video marketing.',
      features: [
        'Video Strategy',
        'Script Writing',
        'Production & Editing',
        'YouTube Optimization',
        'Video Advertising',
      ],
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: BarChart,
      title: 'Analytics & Reporting',
      shortDesc: 'Make data-driven decisions for growth.',
      fullDesc: 'We provide comprehensive analytics and reporting to track your marketing performance. Our detailed insights help you understand what\'s working and where to optimize.',
      features: [
        'Custom Dashboard Setup',
        'Performance Tracking',
        'Monthly Reports',
        'Conversion Analysis',
        'ROI Measurement',
      ],
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
  ]

  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index)
  }

  return (
    <>
      <NextSeo
        title="Our Services | BTP Growth Solutions"
        description="Comprehensive digital marketing services including SEO, social media, content marketing, and more. Tailored solutions for your business growth."
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
              Comprehensive marketing solutions designed to accelerate your business growth 
              and achieve your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              const isExpanded = expandedService === index

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${service.color}`} />
                      </div>
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                      <CardDescription className="text-base">
                        {service.shortDesc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4"
                        >
                          <p className="text-gray-600 mb-4">{service.fullDesc}</p>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle className={`h-5 w-5 ${service.color} mt-0.5 flex-shrink-0`} />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => toggleService(index)}
                        className="w-full"
                      >
                        {isExpanded ? 'Show Less' : 'Learn More'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

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

