import React from 'react'
import { motion } from 'framer-motion'

const ClientLogos = () => {
  // Placeholder client names - Replace with actual client logos
  const clients = [
    'Client Company A',
    'Client Company B',
    'Client Company C',
    'Client Company D',
    'Client Company E',
    'Client Company F',
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-gray-600">
            We&apos;re proud to partner with innovative companies across industries
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center justify-center"
            >
              {/* Placeholder for client logo - Replace with actual logo images */}
              <div className="w-full h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-4 hover:shadow-md transition-shadow">
                <span className="text-xs text-gray-400 text-center font-medium">
                  {client}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClientLogos

