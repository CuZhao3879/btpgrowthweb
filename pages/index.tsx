import { NextSeo } from 'next-seo'
import Hero from '@/components/sections/Hero'
import ServicesPreview from '@/components/sections/ServicesPreview'
import ClientLogos from '@/components/sections/ClientLogos'
import CTA from '@/components/sections/CTA'

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://btpgrowth.com'
  
  return (
    <>
      <NextSeo
        title="BTP Growth | AI-Powered Business Growth Agency"
        description="Your trusted partner leveraging AI and marketing innovation to accelerate growth, streamline operations, and create smarter customer experiences — empowering your business to thrive in the digital era."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: siteUrl,
          siteName: 'BTP Growth Solutions',
          title: 'BTP Growth Solutions | AI-Powered Business Growth Agency',
          description: 'Your trusted partner leveraging AI and marketing innovation to accelerate growth, streamline operations, and create smarter customer experiences — empowering your business to thrive in the digital era.',
          images: [
            {
              url: `${siteUrl}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: 'BTP Growth Solutions | AI-Powered Business Growth Agency',
            },
          ],
        }}
        twitter={{
          handle: '@btpgrowth',
          cardType: 'summary_large_image',
        }}
      />
      
      <Hero />
      <ClientLogos />
      <ServicesPreview />
      <CTA />
    </>
  )
}

