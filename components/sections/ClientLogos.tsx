import React from 'react'
import { motion } from 'framer-motion'

const ClientLogos = () => {
  // Technology logos/names - Replace with actual tech logos
  const technologies = [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'Python',
    'AWS',
    'Google Cloud',
    'Meta Ads',
    'Google Analytics',
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
                  className="flex-shrink-0 w-40 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-4 hover:shadow-md transition-shadow"
                >
                  {/* Placeholder for tech logo - Replace with actual logo images */}
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
  )
}

export default ClientLogos

