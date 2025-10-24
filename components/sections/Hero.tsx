import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

const Hero = () => {
  const features = [
    'AI-Powered',
    'Technology-Driven',
    'Trusted Partnership',
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Centered Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  Your Growth Partner
                </span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight">
                Accelerate Your Business <span className="text-primary-600">Growth</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600">
                We drive business growth through innovation, intelligence, and technology — empowering small and medium enterprises to scale smarter, faster, and more sustainably.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 justify-center">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="group">
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">View Our Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

