import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Pre-load default translations synchronously to prevent SSR flash
import enTranslations from '@/locales/en.json'
import zhTranslations from '@/locales/zh.json'

const translationsMap: Record<Language, Record<string, any>> = {
  en: enTranslations,
  zh: zhTranslations,
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en')
  const [translations, setTranslations] = useState<Record<string, any>>(translationsMap.en)

  useEffect(() => {
    // Load saved language preference
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language
      if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
        setLanguageState(savedLang)
        setTranslations(translationsMap[savedLang])
      }
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(translationsMap[language])
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setTranslations(translationsMap[lang])
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

