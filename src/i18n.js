import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment'
import HU_TRANSLATIONS from './i18n/lang/hu.json'
import EN_TRANSLATIONS from './i18n/lang/en.json'

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'hu',
    interpolation: {
      formatSeparator: ',',
      format: function (value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (value instanceof Date) return moment(value).format(format);
        return value;
      },
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: EN_TRANSLATIONS
      },
      hu: {
        translation: HU_TRANSLATIONS
      }
    }
  });

export default i18n;