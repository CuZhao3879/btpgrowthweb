import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: t('footer.company.about'), href: '/about' },
      { label: t('footer.company.services'), href: '/services' },
      { label: t('footer.company.blog'), href: '/blog' },
      { label: t('footer.company.contact'), href: '/contact' },
    ],
    services: [
      { label: t('footer.services.metaAds'), href: '/services#meta-ads' },
      { label: t('footer.services.brandDev'), href: '/services#brand-development' },
      { label: t('footer.services.socialMedia'), href: '/services#social-media' },
      { label: t('footer.services.webDev'), href: '/services#web-dev' },
      { label: t('footer.services.softwareDev'), href: '/services#software-development' },
      { label: t('footer.services.seo'), href: '/services#seo' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const socialLinks = [
    { 
      image: '/images/services/instagram.png',
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', 
      label: 'Instagram',
    },
    { 
      image: '/images/services/xiaohongshu.png',
      href: process.env.NEXT_PUBLIC_XIAOHONGSHU_URL || '#', 
      label: '小红书',
    },
    { 
      image: '/images/services/gmail.png',
      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'marketing@btpgrowth.com'}`, 
      label: 'Email',
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                <Image
                  src="/images/logo.png"
                  alt="BTP Growth Logo"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                BTP Growth
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                    aria-label={social.label}
                  >
                    <Image
                      src={social.image}
                      alt={social.label}
                      width={36}
                      height={36}
                      className="h-9 w-9 object-contain"
                    />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.company.title')}</h3>
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
            <h3 className="text-white font-semibold mb-4">{t('footer.services.title')}</h3>
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
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">{t('footer.contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'marketing@btpgrowth.com'}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'marketing@btpgrowth.com'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+60105421018'}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+60105421018'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              {t('footer.copyright').replace('2024', currentYear.toString())}
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

