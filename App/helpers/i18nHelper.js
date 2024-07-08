import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../locales/enLanguage';
import esTranslations from '../locales/esLanguage';
import ptTranslations from '../locales/ptLanguage';

const resources = {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
    pt: { translation: ptTranslations },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;