import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
    ],
    services: [
      { label: 'Digital Marketing', href: '/services#digital-marketing' },
      { label: 'SEO Optimization', href: '/services#seo' },
      { label: 'Social Media', href: '/services#social-media' },
      { label: 'Content Creation', href: '/services#content' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const socialLinks = [
    { 
      icon: Facebook, 
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', 
      label: 'Facebook',
      color: 'hover:text-blue-600'
    },
    { 
      icon: Instagram, 
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', 
      label: 'Instagram',
      color: 'hover:text-pink-600'
    },
    { 
      icon: Linkedin, 
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#', 
      label: 'LinkedIn',
      color: 'hover:text-blue-700'
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">BTP</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                BTP Growth
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Empowering small and medium businesses with innovative marketing solutions 
              to accelerate growth and achieve success.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-colors ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@btpgrowth.com'}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@btpgrowth.com'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1-555-123-4567'}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (555) 123-4567'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  {process.env.NEXT_PUBLIC_CONTACT_ADDRESS || '123 Business St, City, State 12345'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} BTP Growth Solutions. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

