import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const [isRTL, setIsRTL] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsRTL(i18n.language === 'ar')
  }, [i18n.language])

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
    }

    i18n.on('languageChanged', handleLanguageChange)

    handleLanguageChange(i18n.language)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLanguage).then(() => {
      navigate(0)
    })
  }

  return (
    <div className={isRTL ? 'rtl' : ''}>
      <label
        onClick={toggleLanguage}
        className="px-4 py-2 border border-white rounded-full cursor-pointer"
      >
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </label>
    </div>
  )
}

export default LanguageSwitcher