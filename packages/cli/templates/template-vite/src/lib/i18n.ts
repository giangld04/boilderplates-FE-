import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          'nav.dashboard': 'Dashboard',
          'nav.settings': 'Settings',
          'nav.profile': 'Profile',
          'auth.signIn': 'Sign In',
          'auth.signOut': 'Sign Out',
        },
      },
      vi: {
        translation: {
          'nav.dashboard': 'Bảng điều khiển',
          'nav.settings': 'Cài đặt',
          'nav.profile': 'Hồ sơ',
          'auth.signIn': 'Đăng nhập',
          'auth.signOut': 'Đăng xuất',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
