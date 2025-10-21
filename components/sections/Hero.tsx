import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

const Hero = () => {
  const features = [
    'Data-Driven Strategies',
    'Proven Results',
    'Expert Team',
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
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
                Accelerate Your Business
                <span className="text-primary-600"> Growth</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600">
                We help small and medium businesses achieve remarkable results through 
                innovative digital marketing strategies and proven growth solutions.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4">
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
              className="flex flex-col sm:flex-row gap-4"
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

          {/* Right Content - Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Placeholder for hero image - Replace with actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <p className="text-sm font-medium mb-2">Hero Image Placeholder</p>
                  <p className="text-xs opacity-80">Replace with your brand image</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

