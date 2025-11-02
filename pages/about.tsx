import { NextSeo } from 'next-seo'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Target, Zap, Award } from 'lucide-react'
import ClientLogos from '@/components/sections/ClientLogos'
import { useLanguage } from '@/contexts/LanguageContext'

export default function About() {
  const { t } = useLanguage()
  
  const values = [
    {
      icon: Target,
      title: t('about.values.results'),
      description: t('about.values.resultsDesc'),
    },
    {
      icon: Users,
      title: t('about.values.clientCentric'),
      description: t('about.values.clientCentricDesc'),
    },
    {
      icon: Zap,
      title: t('about.values.innovation'),
      description: t('about.values.innovationDesc'),
    },
    {
      icon: Award,
      title: t('about.values.excellence'),
      description: t('about.values.excellenceDesc'),
    },
  ]


  return (
    <>
      <NextSeo
        title="About Us | BTP Growth Solutions"
        description="Learn about BTP Growth Solutions - our mission, values, and the team dedicated to helping your business succeed."
      />

      {/* Hero Section */}
      <section className="relative py-20 pt-32 md:pt-36 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-services-blog-background.jpg"
            alt="About Background"
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
              {t('about.heroTitle')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('about.heroDescription')}
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
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {t('about.mission.description')}
              </p>
              <p className="text-lg text-gray-600">
                {t('about.mission.description2')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Mission Image */}
              <div className="relative aspect-video rounded-2xl shadow-xl overflow-hidden">
                <Image
                  src="/images/mission.jpg"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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
              {t('about.values.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
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

      {/* Technologies Section - Same as Home Page */}
      <ClientLogos />

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
              {t('about.cta.title')}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 bg-white text-primary-600 rounded-md font-semibold hover:bg-blue-50 transition-colors text-center">
                {t('about.cta.getInTouch')}
              </Link>
              <Link href="/services" className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center">
                {t('about.cta.viewServices')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

