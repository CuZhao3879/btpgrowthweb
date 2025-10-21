import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingUp } from 'lucide-react'

export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Growth Campaign',
      client: 'Fashion Retail Co.',
      category: 'SEO & Paid Advertising',
      description: 'Increased organic traffic by 250% and revenue by 180% in 6 months through comprehensive SEO strategy and targeted paid campaigns.',
      results: [
        '250% increase in organic traffic',
        '180% revenue growth',
        '45% lower customer acquisition cost',
      ],
      image: '/images/project-1-placeholder.jpg',
    },
    {
      title: 'Social Media Brand Building',
      client: 'Tech Startup Inc.',
      category: 'Social Media Marketing',
      description: 'Built a strong social media presence from scratch, growing followers to 50K+ and generating qualified leads through engaging content.',
      results: [
        '50K+ social media followers',
        '300% engagement rate increase',
        '500+ qualified leads generated',
      ],
      image: '/images/project-2-placeholder.jpg',
    },
    {
      title: 'Content Marketing Success',
      client: 'B2B Services Ltd.',
      category: 'Content & SEO',
      description: 'Established thought leadership through strategic content marketing, resulting in significant brand visibility and lead generation.',
      results: [
        '100+ high-quality blog posts',
        '400% increase in organic leads',
        'Industry authority positioning',
      ],
      image: '/images/project-3-placeholder.jpg',
    },
    {
      title: 'Local SEO Domination',
      client: 'Restaurant Chain',
      category: 'Local SEO',
      description: 'Optimized local presence across 15 locations, achieving top 3 rankings for key local searches and increasing foot traffic.',
      results: [
        'Top 3 rankings in all locations',
        '60% increase in store visits',
        '200% more online reservations',
      ],
      image: '/images/project-4-placeholder.jpg',
    },
    {
      title: 'Email Marketing Automation',
      client: 'SaaS Platform',
      category: 'Email Marketing',
      description: 'Implemented sophisticated email automation flows that nurtured leads and increased conversion rates significantly.',
      results: [
        '150% increase in email engagement',
        '85% higher conversion rate',
        '40% reduction in churn',
      ],
      image: '/images/project-5-placeholder.jpg',
    },
    {
      title: 'Brand Repositioning',
      client: 'Manufacturing Corp.',
      category: 'Branding & Strategy',
      description: 'Completely revitalized brand identity and positioning, leading to increased market share and premium pricing power.',
      results: [
        'Complete brand refresh',
        '25% market share growth',
        '30% premium pricing achieved',
      ],
      image: '/images/project-6-placeholder.jpg',
    },
  ]

  return (
    <>
      <NextSeo
        title="Our Projects | BTP Growth Solutions"
        description="Explore our portfolio of successful marketing campaigns and the results we've achieved for our clients across various industries."
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
              Our Success Stories
            </h1>
            <p className="text-xl text-gray-600">
              Real results from real businesses. See how we&apos;ve helped our clients 
              achieve remarkable growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
                  {/* Project Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center p-6">
                        <p className="text-sm font-medium mb-1">Project Image</p>
                        <p className="text-xs opacity-80">Replace with actual screenshot</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-gray-500">
                      {project.client}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {project.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-semibold text-gray-900 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        Key Results:
                      </p>
                      <ul className="space-y-1">
                        {project.results.map((result, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full group-hover:bg-primary-50 transition-colors">
                      View Case Study
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Let&apos;s discuss how we can help you achieve similar results for your business.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">Start Your Project</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}

