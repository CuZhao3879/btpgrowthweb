import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import Layout from '@/components/layout/Layout'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Default SEO configuration
const defaultSEO = {
  title: 'BTP Growth Solutions | Digital Marketing for SMBs',
  description: 'Empowering small and medium businesses with innovative digital marketing strategies. Expert SEO, social media, content marketing, and growth solutions.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://btpgrowth.com',
    siteName: 'BTP Growth Solutions',
    images: [
      {
        url: '/images/og-image.jpg', // Add your OG image
        width: 1200,
        height: 630,
        alt: 'BTP Growth Solutions',
      },
    ],
  },
  twitter: {
    handle: '@btpgrowth',
    cardType: 'summary_large_image',
  },
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSEO} />
      <LanguageProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LanguageProvider>
    </>
  )
}

