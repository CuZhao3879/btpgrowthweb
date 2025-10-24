import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, TrendingUp, Users, Megaphone, FileText, BarChart } from 'lucide-react'

const ServicesPreview = () => {
  const services = [
    {
      title: 'Meta Ads Solutions',
      description: 'Strategic Facebook and Instagram advertising campaigns that drive conversions and maximize ROI.',
      image: '/images/services/meta-ads.png',
    },
    {
      title: 'Brand Development',
      description: 'Develop a strong brand identity that stands out in the market.',
      image: '/images/services/brand-development.png',
    },
    {
      title: 'Social Media Marketing',
      description: 'Build and engage your audience across all major social platforms.',
      image: '/images/services/social-media.png',
    },
    {
      title: 'Web Development',
      description: 'Custom, responsive websites built with modern technologies for optimal performance.',
      image: '/images/services/web-development.png',
    },
    {
      title: 'Software Development',
      description: 'Tailored software solutions to streamline your operations and enhance productivity.',
      image: '/images/services/software-development.png',
    },
    {
      title: 'SEO Optimization',
      description: 'Improve your search rankings and drive organic traffic to your website.',
      image: '/images/services/seo-optimization.png',
    },
  ]

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

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive growth solutions designed to help your business thrive in the digital age.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {services.map((service, index) => {
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-gray-200">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 overflow-hidden">
                      {/* Small icon image */}
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          // Fallback to gradient if image not found
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%233b82f6"/%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <Button asChild size="lg">
            <Link href="/services">View All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesPreview

