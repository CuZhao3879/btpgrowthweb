import React from 'react'
import { motion } from 'framer-motion'

const ClientLogos = () => {
  // Technology logos - Your actual logo images
  const technologies = [
    { name: 'Cursor', image: '/images/tech-logos/cursor.jpg' },
    { name: 'DigitalOcean', image: '/images/tech-logos/digitalocean.jpg' },
    { name: 'Google Analytics', image: '/images/tech-logos/googleanalytics.jpg' },
    { name: 'Meta', image: '/images/tech-logos/meta.jpg' },
  ]

  // Duplicate for seamless loop
  const duplicatedTechs = [...technologies, ...technologies]

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
                x: [0, -100 * technologies.length],
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
              {duplicatedTechs.map((tech, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[300px] h-[150px] bg-white rounded-lg shadow-sm flex items-center justify-center p-6 hover:shadow-md transition-shadow"
                >
                  {/* 400x200px JPG Logo - Your actual images */}
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback to text if image not found
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<span class="text-base text-gray-700 text-center font-semibold whitespace-nowrap">${tech.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClientLogos

