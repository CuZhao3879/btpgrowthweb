import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const ClientLogos = () => {
  const { t } = useLanguage()
  const baseVelocity = -20 // 基础速度（负数向左滚动）
  const baseX = useMotionValue(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Technology logos - Your actual logo images (in order)
  const technologies = [
    { name: 'Meta', image: '/images/tech-logos/meta.jpg' },
    { name: 'Cursor', image: '/images/tech-logos/cursor.jpg' },
    { name: 'Adobe', image: '/images/tech-logos/adobe.jpg' },
    { name: 'GitHub', image: '/images/tech-logos/github.jpg' },
    { name: 'DigitalOcean', image: '/images/tech-logos/digitalocean.jpg' },
    { name: 'Google Analytics', image: '/images/tech-logos/googleanalytics.jpg' },
    { name: 'React', image: '/images/tech-logos/react.jpg' },
    { name: 'Node.js', image: '/images/tech-logos/nodejs.jpg' },
  ]

  // Duplicate for seamless loop (4 copies for smooth scrolling)
  const duplicatedTechs = [...technologies, ...technologies, ...technologies, ...technologies]
  
  // 自动滚动动画
  useAnimationFrame((t, delta) => {
    if (!isDragging) {
      let moveBy = baseVelocity * (delta / 1000)
      baseX.set(baseX.get() + moveBy)
      
      // 重置位置以实现无限循环
      const itemWidth = 256 + 32 // logo width + gap
      const resetPoint = -(itemWidth * technologies.length)
      
      if (baseX.get() <= resetPoint) {
        baseX.set(baseX.get() + itemWidth * technologies.length)
      }
      if (baseX.get() >= 0) {
        baseX.set(baseX.get() - itemWidth * technologies.length)
      }
    }
  })

  return (
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
            {t('techLogos.title')}
          </h2>
          <p className="text-gray-600">
            {t('techLogos.subtitle')}
          </p>
        </motion.div>

        {/* Scrolling logos - with drag support */}
        <div className="relative overflow-hidden">
          <motion.div
            ref={scrollerRef}
            className="flex gap-8 items-center cursor-grab active:cursor-grabbing"
            style={{ x: baseX }}
            drag="x"
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            dragConstraints={{ left: -2000, right: 2000 }}
            dragTransition={{ power: 0.2, timeConstant: 200 }}
          >
            {duplicatedTechs.map((tech, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-64 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center p-2 hover:shadow-md transition-shadow relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {/* Technology logo image - fills container */}
                <Image
                  src={tech.image}
                  alt={tech.name}
                  width={256}
                  height={128}
                  className="object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ClientLogos

