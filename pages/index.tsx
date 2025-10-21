import { NextSeo } from 'next-seo'
import Hero from '@/components/sections/Hero'
import ServicesPreview from '@/components/sections/ServicesPreview'
import ClientLogos from '@/components/sections/ClientLogos'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Home | BTP Growth Solutions"
        description="Accelerate your business growth with innovative digital marketing strategies. We help SMBs achieve remarkable results through data-driven solutions."
      />
      
      <Hero />
      <ClientLogos />
      <ServicesPreview />
      <CTA />
    </>
  )
}

