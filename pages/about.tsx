import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Target, Zap, Award } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'We focus on measurable outcomes that directly impact your bottom line.',
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Your success is our success. We build long-term partnerships.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We stay ahead of trends to give you a competitive advantage.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in everything we do.',
    },
  ]


  return (
    <>
      <NextSeo
        title="About Us | BTP Growth Solutions"
        description="Learn about BTP Growth Solutions - our mission, values, and the team dedicated to helping your business succeed."
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
              About BTP Growth Solutions
            </h1>
            <p className="text-xl text-gray-600">
              We&apos;re a team of forward-thinking growth strategists dedicated to empowering 
              small and medium businesses through innovation, intelligence, and technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                At BTP Growth Solutions, we believe every business deserves the opportunity 
                to thrive in the digital age. Our mission is to democratize access to 
                world-class marketing expertise.
              </p>
              <p className="text-lg text-gray-600">
                We combine data-driven strategies, creative excellence, and cutting-edge 
                technology to deliver measurable results for our clients. Your growth is 
                our passion.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Placeholder for mission image */}
              <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <p className="text-sm font-medium">Mission Image Placeholder</p>
                  <p className="text-xs opacity-80 mt-2">Replace with team or office photo</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we work with our clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
              The Technologies That Power Our Growth
            </h2>
            <p className="text-gray-600">
              Leveraging cutting-edge tools and platforms to drive innovation and results
            </p>
          </motion.div>

          {/* Scrolling logos */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <motion.div
                className="flex gap-8 items-center"
                animate={{
                  x: [0, -1600],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'AWS', 'Google Cloud', 'Meta Ads', 'Google Analytics', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'AWS', 'Google Cloud', 'Meta Ads', 'Google Analytics'].map((tech, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-40 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-4 hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm text-gray-700 text-center font-semibold whitespace-nowrap">
                      {tech}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

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
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Let&apos;s discuss how we can help you achieve your goals 
              and take your business to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 bg-white text-primary-600 rounded-md font-semibold hover:bg-blue-50 transition-colors text-center">
                Get in Touch
              </Link>
              <Link href="/services" className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center">
                View Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

