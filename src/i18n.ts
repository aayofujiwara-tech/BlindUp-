import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import jaNav from './locales/ja/nav.json';
import jaTimer from './locales/ja/timer.json';
import jaSetup from './locales/ja/setup.json';
import jaTts from './locales/ja/tts.json';

import enNav from './locales/en/nav.json';
import enTimer from './locales/en/timer.json';
import enSetup from './locales/en/setup.json';
import enTts from './locales/en/tts.json';

const savedLang = localStorage.getItem('i18nextLng') || 'ja';

i18n.use(initReactI18next).init({
  resources: {
    ja: { nav: jaNav, timer: jaTimer, setup: jaSetup, tts: jaTts },
    en: { nav: enNav, timer: enTimer, setup: enSetup, tts: enTts },
  },
  lng: savedLang,
  fallbackLng: 'ja',
  interpolation: { escapeValue: false },
});

export default i18n;
