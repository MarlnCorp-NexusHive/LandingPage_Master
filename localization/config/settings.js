/**
 * ⚙️ Localization System Settings
 * Central configuration for all localization features
 */

export const LOCALIZATION_SETTINGS = {
  // Performance Settings
  performance: {
    cacheEnabled: true,
    cacheExpiry: 3600000, // 1 hour in milliseconds
    lazyLoading: true,
    preloadLanguages: ['en', 'ar'],
    maxCacheSize: 10 * 1024 * 1024, // 10MB
    compressionEnabled: true
  },

  // UI Settings
  ui: {
    showLanguageIndicator: true,
    showLanguageCode: true,
    showNativeName: true,
    showFlag: true,
    animationDuration: 300,
    smoothTransitions: true,
    mobileOptimized: true
  },

  // Language Settings
  language: {
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    autoDetect: true,
    rememberUserChoice: true,
    urlParameter: 'lang',
    cookieName: 'marln-lang',
    localStorageKey: 'marln-language'
  },

  // RTL Support
  rtl: {
    enabled: true,
    autoDetect: true,
    cssClass: 'rtl',
    bodyAttribute: true,
    htmlAttribute: true,
    mobileMenuSupport: true
  },

  // Error Handling
  errors: {
    showConsoleWarnings: true,
    fallbackToDefault: true,
    logMissingTranslations: true,
    gracefulDegradation: true
  },

  // Development Settings
  development: {
    debugMode: false,
    verboseLogging: false,
    performanceMonitoring: true,
    hotReload: false
  },

  // SEO Settings
  seo: {
    hreflangEnabled: true,
    alternateLinks: true,
    canonicalUrls: true,
    metaLanguageTags: true
  },

  // Analytics
  analytics: {
    trackLanguageChanges: true,
    trackPerformance: true,
    trackErrors: true,
    googleAnalytics: false
  }
};

// Performance Settings
export const PERFORMANCE_SETTINGS = {
  // Cache Configuration
  cache: {
    enabled: LOCALIZATION_SETTINGS.performance.cacheEnabled,
    expiry: LOCALIZATION_SETTINGS.performance.cacheExpiry,
    maxSize: LOCALIZATION_SETTINGS.performance.maxCacheSize,
    compression: LOCALIZATION_SETTINGS.performance.compressionEnabled
  },

  // Loading Strategy
  loading: {
    lazy: LOCALIZATION_SETTINGS.performance.lazyLoading,
    preload: LOCALIZATION_SETTINGS.performance.preloadLanguages,
    priority: ['en', 'ar'], // Load order priority
    timeout: 5000 // 5 seconds timeout
  },

  // Memory Management
  memory: {
    maxTranslations: 1000, // Max translations in memory
    cleanupInterval: 300000, // 5 minutes
    gcThreshold: 0.8 // Garbage collection threshold
  }
};

// UI Configuration
export const UI_SETTINGS = {
  // Toggle Button
  toggle: {
    size: 'medium', // small, medium, large
    style: 'modern', // classic, modern, minimal
    position: 'header', // header, footer, floating
    animation: 'slide', // slide, fade, bounce
    showText: true,
    showIcon: true
  },

  // Dropdown Menu
  dropdown: {
    maxHeight: 300,
    scrollEnabled: true,
    searchEnabled: true,
    groupingEnabled: true,
    showFlags: true,
    showNativeNames: true
  },

  // Language Indicator
  indicator: {
    show: LOCALIZATION_SETTINGS.ui.showLanguageIndicator,
    format: 'code', // code, name, native, flag
    position: 'top-right',
    size: 'small'
  }
};

// RTL Configuration
export const RTL_SETTINGS = {
  // CSS Classes
  classes: {
    rtl: LOCALIZATION_SETTINGS.rtl.cssClass,
    ltr: 'ltr',
    rtlContainer: 'rtl-container',
    rtlText: 'rtl-text'
  },

  // Attributes
  attributes: {
    dir: true,
    lang: true,
    dataRtl: true
  },

  // Mobile Support
  mobile: {
    menuDirection: true,
    dropdownDirection: true,
    textAlignment: true,
    iconFlip: true
  }
};

// Error Configuration
export const ERROR_SETTINGS = {
  // Logging Levels
  logging: {
    error: true,
    warning: LOCALIZATION_SETTINGS.errors.showConsoleWarnings,
    info: false,
    debug: LOCALIZATION_SETTINGS.development.debugMode
  },

  // Fallback Strategy
  fallback: {
    enabled: LOCALIZATION_SETTINGS.errors.fallbackToDefault,
    strategy: 'cascade', // cascade, default, nearest
    defaultLanguage: LOCALIZATION_SETTINGS.language.fallbackLanguage
  },

  // User Feedback
  userFeedback: {
    showErrors: false,
    showWarnings: false,
    showSuccess: true,
    timeout: 3000
  }
};

// Development Configuration
export const DEV_SETTINGS = {
  // Debug Mode
  debug: {
    enabled: LOCALIZATION_SETTINGS.development.debugMode,
    verbose: LOCALIZATION_SETTINGS.development.verboseLogging,
    performance: LOCALIZATION_SETTINGS.development.performanceMonitoring
  },

  // Hot Reload
  hotReload: {
    enabled: LOCALIZATION_SETTINGS.development.hotReload,
    watchFiles: ['*.json', '*.js'],
    reloadDelay: 1000
  },

  // Testing
  testing: {
    mockTranslations: false,
    fakeLanguage: false,
    performanceBenchmarks: true
  }
};

// Export all settings
export default {
  LOCALIZATION_SETTINGS,
  PERFORMANCE_SETTINGS,
  UI_SETTINGS,
  RTL_SETTINGS,
  ERROR_SETTINGS,
  DEV_SETTINGS
}; 