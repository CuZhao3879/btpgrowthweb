import { NextSeo } from 'next-seo'
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

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      bio: 'With over 15 years of marketing experience, John leads our vision.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Strategy',
      bio: 'Sarah crafts data-driven strategies that deliver exceptional results.',
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      bio: 'Michael brings creative excellence to every campaign we launch.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Client Success Manager',
      bio: 'Emily ensures our clients achieve their goals and beyond.',
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
              We&apos;re a team of passionate marketing professionals dedicated to helping 
              small and medium businesses achieve extraordinary growth.
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

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A diverse group of experts passionate about your success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                {/* Placeholder for team member photo */}
                <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <div className="text-gray-500 text-xs">
                    <p>Photo</p>
                    <p>Placeholder</p>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

