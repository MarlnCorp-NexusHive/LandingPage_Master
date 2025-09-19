/**
 * 🌍 Supported Languages Configuration
 * Easy to add new languages for international expansion
 */

export const SUPPORTED_LANGUAGES = {
  // English (Default)
  en: {
    name: 'English',
    native: 'English',
    code: 'en',
    rtl: false,
    flag: '🇺🇸',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    locale: 'en-US'
  },
  
  // Arabic (Current)
  ar: {
    name: 'Arabic',
    native: 'العربية',
    code: 'ar',
    rtl: true,
    flag: '🇸🇦',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'SAR',
    locale: 'ar-SA'
  },
  
  // Spanish (Future - Easy to add)
  es: {
    name: 'Spanish',
    native: 'Español',
    code: 'es',
    rtl: false,
    flag: '🇪🇸',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'EUR',
    locale: 'es-ES'
  },
  
  // French (Future - Easy to add)
  fr: {
    name: 'French',
    native: 'Français',
    code: 'fr',
    rtl: false,
    flag: '🇫🇷',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'EUR',
    locale: 'fr-FR'
  },
  
  // German (Future - Easy to add)
  de: {
    name: 'German',
    native: 'Deutsch',
    code: 'de',
    rtl: false,
    flag: '🇩🇪',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    currency: 'EUR',
    locale: 'de-DE'
  },
  
  // Chinese (Future - Easy to add)
  zh: {
    name: 'Chinese',
    native: '中文',
    code: 'zh',
    rtl: false,
    flag: '🇨🇳',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'CNY',
    locale: 'zh-CN'
  },
  
  // Japanese (Future - Easy to add)
  ja: {
    name: 'Japanese',
    native: '日本語',
    code: 'ja',
    rtl: false,
    flag: '🇯🇵',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'JPY',
    locale: 'ja-JP'
  },
  
  // Korean (Future - Easy to add)
  ko: {
    name: 'Korean',
    native: '한국어',
    code: 'ko',
    rtl: false,
    flag: '🇰🇷',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'KRW',
    locale: 'ko-KR'
  },
  
  // Hindi (Future - Easy to add)
  hi: {
    name: 'Hindi',
    native: 'हिन्दी',
    code: 'hi',
    rtl: false,
    flag: '🇮🇳',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'INR',
    locale: 'hi-IN'
  },
  
  // Portuguese (Future - Easy to add)
  pt: {
    name: 'Portuguese',
    native: 'Português',
    code: 'pt',
    rtl: false,
    flag: '🇵🇹',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'EUR',
    locale: 'pt-PT'
  }
};

// Helper functions for easy language management
export const getLanguageInfo = (code) => {
  return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES.en;
};

export const isRTL = (code) => {
  return SUPPORTED_LANGUAGES[code]?.rtl || false;
};

export const getDirection = (code) => {
  return SUPPORTED_LANGUAGES[code]?.direction || 'ltr';
};

export const getActiveLanguages = () => {
  // Return only languages that have translation files
  return ['en', 'ar']; // Currently only English and Arabic are active
};

export const getFutureLanguages = () => {
  // Return languages planned for future implementation
  return ['es', 'fr', 'de', 'zh', 'ja', 'ko', 'hi', 'pt'];
};

// Language grouping for UI organization
export const LANGUAGE_GROUPS = {
  primary: ['en', 'ar'],           // Currently supported
  european: ['es', 'fr', 'de', 'pt'], // European languages
  asian: ['zh', 'ja', 'ko'],       // Asian languages
  other: ['hi']                     // Other languages
};

// Export default language
export const DEFAULT_LANGUAGE = 'en';

// Export RTL languages
export const RTL_LANGUAGES = Object.keys(SUPPORTED_LANGUAGES).filter(
  code => SUPPORTED_LANGUAGES[code].rtl
); 