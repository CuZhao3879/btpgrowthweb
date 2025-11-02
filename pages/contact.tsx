import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.info.email'),
      value: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'marketing@btpgrowth.com',
      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'marketing@btpgrowth.com'}`,
    },
    {
      icon: Phone,
      label: t('contact.info.phone'),
      value: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+60105421018',
      href: `tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+60105421018'}`,
    },
    {
      icon: Clock,
      label: t('contact.info.hours'),
      value: t('contact.info.hoursValue'),
      href: '#',
    },
  ]

  return (
    <>
      <NextSeo
        title="Contact Us | BTP Growth Solutions"
        description="Get in touch with BTP Growth Solutions. We're here to help your business grow. Contact us for a free consultation."
      />

      {/* Hero Section */}
      <section className="relative py-20 pt-32 md:pt-36 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-services-blog-background.jpg"
            alt="Contact Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {t('contact.heroTitle')}
            </h1>
            <p className="text-xl text-gray-200">
              {t('contact.heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-stretch">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 h-full"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('contact.form.title')}</CardTitle>
                  <CardDescription>
                    {t('contact.form.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.form.name')}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('contact.form.namePlaceholder')}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.form.email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('contact.form.emailPlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('contact.form.phonePlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.message')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.form.messagePlaceholder')}
                        rows={6}
                        required
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                        {t('contact.form.success')}
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {t('contact.form.error')}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        t('contact.form.sending')
                      ) : (
                        <>
                          {t('contact.form.submit')}
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{t('contact.info.title')}</CardTitle>
                  <CardDescription>
                    {t('contact.info.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{info.label}</p>
                            {info.href !== '#' ? (
                              <a
                                href={info.href}
                                className="text-gray-600 hover:text-primary-600 transition-colors"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-gray-600">{info.value}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Map */}
                  <div className="pt-4 mt-auto border-t border-gray-200">
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary-600" />
                      </div>
                      <p className="font-medium text-gray-900 pt-2">{t('contact.info.findUs')}</p>
                    </div>
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-200 mt-2">
                      <iframe
                        src="https://www.google.com/maps?q=No+41,+Lorong+Kendi+9,+Taman+Merak+14100+Simpang+Ampat,+Pulau+Pinang&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                        title="BTP Growth Solutions Location"
                      ></iframe>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

