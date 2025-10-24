import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, TrendingUp, Users, Megaphone, FileText, BarChart } from 'lucide-react'

const ServicesPreview = () => {
  const services = [
    {
      icon: Megaphone,
      title: 'Meta Ads Solutions',
      description: 'Strategic Facebook and Instagram advertising campaigns that drive conversions and maximize ROI.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: TrendingUp,
      title: 'SEO Optimization',
      description: 'Improve your search rankings and drive organic traffic to your website.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Users,
      title: 'Social Media Marketing',
      description: 'Build and engage your audience across all major social platforms.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: FileText,
      title: 'Web Development',
      description: 'Custom, responsive websites built with modern technologies for optimal performance.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Target,
      title: 'Software Development',
      description: 'Tailored software solutions to streamline your operations and enhance productivity.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      icon: BarChart,
      title: 'Brand Development',
      description: 'Develop a strong brand identity that stands out in the market.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
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
            const Icon = service.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-gray-200">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${service.color}`} />
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

