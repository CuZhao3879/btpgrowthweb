import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const Hero = () => {
  const { t, language } = useLanguage()
  
  const features = [
    t('hero.features.aiPowered'),
    t('hero.features.techDriven'),
    t('hero.features.trustedPartnership'),
  ]

  return (
    <section 
      className="relative bg-black flex items-center"
      style={{ 
        margin: 0, 
        padding: 0,
        width: '100vw',
        maxWidth: '100vw',
        overflow: 'hidden',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        minHeight: '600px',
        height: 'auto'
      }}
    >
      {/* Background Image - Desktop */}
      <div 
        className="absolute inset-0 hidden md:block"
        style={{ 
          width: '100%',
          height: '100%',
          left: 0, 
          right: 0, 
          top: 0, 
          bottom: 0,
          margin: 0,
          padding: 0
        }}
      >
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero Background Desktop"
          fill
          className="object-cover object-center"
          priority
          quality={100}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>

      {/* Background Image - Mobile */}
      <div 
        className="absolute inset-0 block md:hidden"
        style={{ 
          width: '100%',
          height: '100%',
          left: 0, 
          right: 0, 
          top: 0, 
          bottom: 0,
          margin: 0,
          padding: 0
        }}
      >
        <Image
          src="/images/hero-bg-phonee.jpeg"
          alt="Hero Background Mobile"
          fill
          className="object-cover object-top"
          priority
          quality={100}
          style={{ objectFit: 'cover', objectPosition: 'top', width: '100%', height: '100%' }}
        />
        {/* Dark overlay for mobile - 80% opacity */}
        <div className="absolute inset-0 bg-black/80"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl">
          {/* Left-aligned Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-blue-600/30 text-blue-200 rounded-full text-sm font-semibold border border-blue-500/40 backdrop-blur-sm">
                  {t('hero.badge') || 'Your Growth Partner'}
                </span>
              </motion.div>
              
              <h1 className="text-[2.5rem] md:text-[3.125rem] lg:text-[4rem] font-heading font-bold leading-tight">
                {language === 'zh' ? (
                  <>
                    <span className="text-white">{t('hero.titleLine1')}</span>
                    <br />
                    <span className="text-white">{t('hero.titleLine2Part1')}</span>
                    <span className="text-blue-400">{t('hero.titleLine2Part2')}</span>
                  </>
                ) : (
                  <>
                <span className="text-white">{t('hero.title')}</span>
                <br />
                <span className="text-white">{t('hero.titleMiddle')} </span>
                <span className="text-blue-400">{t('hero.titleHighlight')}</span>
                  </>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" strokeWidth={2.5} />
                  </div>
                  <span className="text-white font-medium text-base">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Button asChild size="lg" className="group bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 rounded-xl">
                <Link href="/contact">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/40 text-white bg-transparent rounded-xl backdrop-blur-sm cursor-pointer"
              >
                <Link href="/services">{t('services.viewAll')}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

