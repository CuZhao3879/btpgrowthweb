import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  
  // Check if we're on the homepage
  const isHomePage = router.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      // On homepage: Change to white navbar after scrolling past Hero section
      // On other pages: Always show white navbar
      if (isHomePage) {
        setIsScrolled(window.scrollY > window.innerHeight * 0.95)
      } else {
        setIsScrolled(true)
      }
    }
    
    // Initial check
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/blog', label: t('nav.blog') },
  ]

  const isActive = (path: string) => router.pathname === path

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white shadow-md border-b border-gray-200'
          : 'bg-black border-b border-white/20'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
              <Image
                src="/images/logo.png"
                alt="BTP Growth Logo"
                width={48}
                height={48}
                className="object-cover"
                priority
              />
            </div>
            <span className={cn(
              "font-heading font-bold text-xl transition-colors duration-500",
              isScrolled ? 'text-gray-900' : 'text-white'
            )}>
              BTP Growth
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-500',
                  isScrolled
                    ? (isActive(link.href) ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600')
                    : (isActive(link.href) ? 'text-blue-400' : 'text-white hover:text-blue-300')
                )}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher isDark={!isScrolled && isHomePage} />
            <Button asChild size="sm" className={cn(
              "transition-colors duration-500",
              isScrolled ? '' : 'bg-blue-600 hover:bg-blue-700'
            )}>
              <Link href="/contact">{t('nav.contact')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher isDark={!isScrolled && isHomePage} />
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className={cn(
                  "h-6 w-6 transition-colors duration-500",
                  isScrolled ? 'text-gray-900' : 'text-white'
                )} />
              ) : (
                <Menu className={cn(
                  "h-6 w-6 transition-colors duration-500",
                  isScrolled ? 'text-gray-900' : 'text-white'
                )} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block py-2 text-base font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="w-full mt-4">
                <Link href="/contact">{t('nav.contact')}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar

