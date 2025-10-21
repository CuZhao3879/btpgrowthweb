import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const CTA = () => {
  return (
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
            Let&apos;s discuss how we can help you achieve your marketing goals 
            and take your business to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/projects">View Our Work</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA

