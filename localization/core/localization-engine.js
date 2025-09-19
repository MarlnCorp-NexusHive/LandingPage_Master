/**
 * 🚀 Marln Localization Engine
 * Core localization system for international expansion
 */

import { SUPPORTED_LANGUAGES, getLanguageInfo, isRTL, getDirection } from '../config/supported-languages.js';
import { LOCALIZATION_SETTINGS, PERFORMANCE_SETTINGS } from '../config/settings.js';

class LocalizationEngine {
  constructor() {
    this.currentLanguage = LOCALIZATION_SETTINGS.language.defaultLanguage;
    this.previousLanguage = null;
    this.translations = new Map();
    this.cache = new Map();
    this.isInitialized = false;
    this.eventListeners = new Map();
    
    // Performance tracking
    this.performanceMetrics = {
      languageSwitchTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      loadTime: 0
    };
    
    // Bind methods
    this.init = this.init.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
    this.getTranslation = this.getTranslation.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  /**
   * Initialize the localization engine
   */
  async init() {
    try {
      console.log('🚀 Initializing Marln Localization Engine...');
      
      // Load default language
      await this.loadLanguage(this.currentLanguage);
      
      // Load user's saved language preference
      const savedLanguage = this.getSavedLanguage();
      if (savedLanguage && savedLanguage !== this.currentLanguage) {
        await this.setLanguage(savedLanguage);
      }
      
      // Preload active languages
      if (PERFORMANCE_SETTINGS.loading.lazy) {
        this.preloadLanguages(PERFORMANCE_SETTINGS.loading.preload);
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize RTL support
      this.initializeRTL();
      
      this.isInitialized = true;
      console.log('✅ Localization Engine initialized successfully');
      
      // Emit ready event
      this.emit('ready', { language: this.currentLanguage });
      
    } catch (error) {
      console.error('❌ Failed to initialize Localization Engine:', error);
      this.handleError(error);
    }
  }

  /**
   * Load language translations
   */
  async loadLanguage(languageCode) {
    try {
      // Check cache first
      if (this.cache.has(languageCode)) {
        const cached = this.cache.get(languageCode);
        if (Date.now() - cached.timestamp < PERFORMANCE_SETTINGS.cache.expiry) {
          this.translations.set(languageCode, cached.data);
          this.performanceMetrics.cacheHitRate++;
          return cached.data;
        }
      }
      
      // Load from file
      const startTime = performance.now();
      const response = await fetch(`/localization/languages/${languageCode}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load language: ${languageCode}`);
      }
      
      const translations = await response.json();
      
      // Cache the translations
      this.cache.set(languageCode, {
        data: translations,
        timestamp: Date.now()
      });
      
      // Store in memory
      this.translations.set(languageCode, translations);
      
      // Update performance metrics
      this.performanceMetrics.loadTime = performance.now() - startTime;
      
      console.log(`📚 Language loaded: ${languageCode}`);
      return translations;
      
    } catch (error) {
      console.error(`❌ Failed to load language ${languageCode}:`, error);
      
      // Fallback to default language
      if (languageCode !== LOCALIZATION_SETTINGS.language.fallbackLanguage) {
        console.log(`🔄 Falling back to ${LOCALIZATION_SETTINGS.language.fallbackLanguage}`);
        return this.loadLanguage(LOCALIZATION_SETTINGS.language.fallbackLanguage);
      }
      
      throw error;
    }
  }

  /**
   * Set current language
   */
  async setLanguage(languageCode) {
    try {
      if (!SUPPORTED_LANGUAGES[languageCode]) {
        throw new Error(`Unsupported language: ${languageCode}`);
      }
      
      const startTime = performance.now();
      
      // Store previous language
      this.previousLanguage = this.currentLanguage;
      this.currentLanguage = languageCode;
      
      // Load language if not already loaded
      if (!this.translations.has(languageCode)) {
        await this.loadLanguage(languageCode);
      }
      
      // Update page content
      await this.updatePage();
      
      // Update RTL support
      this.updateRTL();
      
      // Save user preference
      this.saveLanguage(languageCode);
      
      // Update performance metrics
      this.performanceMetrics.languageSwitchTime = performance.now() - startTime;
      
      // Emit language change event
      this.emit('languageChanged', {
        from: this.previousLanguage,
        to: languageCode,
        switchTime: this.performanceMetrics.languageSwitchTime
      });
      
      console.log(`🌍 Language changed to: ${languageCode}`);
      
    } catch (error) {
      console.error(`❌ Failed to set language to ${languageCode}:`, error);
      this.handleError(error);
      
      // Revert to previous language
      this.currentLanguage = this.previousLanguage;
    }
  }

  /**
   * Update page content with current language
   */
  async updatePage() {
    try {
      const translations = this.translations.get(this.currentLanguage);
      if (!translations) {
        throw new Error('No translations available for current language');
      }
      
      // Update HTML attributes
      this.updateHTMLAttributes();
      
      // Update page content using data attributes
      this.updateContentWithDataAttributes(translations);
      
      // Update navigation and menus
      this.updateNavigation(translations);
      
      // Update forms and placeholders
      this.updateForms(translations);
      
      // Update meta tags for SEO
      this.updateMetaTags();
      
      console.log('📄 Page content updated successfully');
      
    } catch (error) {
      console.error('❌ Failed to update page content:', error);
      this.handleError(error);
    }
  }

  /**
   * Update HTML attributes for language and direction
   */
  updateHTMLAttributes() {
    const languageInfo = getLanguageInfo(this.currentLanguage);
    
    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
    
    // Update HTML dir attribute for RTL
    if (isRTL(this.currentLanguage)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('rtl');
    }
    
    // Add language-specific classes
    document.documentElement.classList.add(`lang-${this.currentLanguage}`);
    if (this.previousLanguage) {
      document.documentElement.classList.remove(`lang-${this.previousLanguage}`);
    }
  }

  /**
   * Update content using data-i18n attributes
   */
  updateContentWithDataAttributes(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key, translations);
      
      if (translation) {
        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          if (element.hasAttribute('placeholder')) {
            element.placeholder = translation;
          }
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  /**
   * Update navigation elements
   */
  updateNavigation(translations) {
    // Update header navigation
    this.updateHeaderNavigation(translations);
    
    // Update mobile navigation
    this.updateMobileNavigation(translations);
    
    // Update mobile dropdown menus
    this.updateMobileDropdownMenus(translations);
    
    // Update dropdown menus
    this.updateDropdownMenus(translations);
  }

  /**
   * Update header navigation
   */
  updateHeaderNavigation(translations) {
    const headerElements = [
      { selector: '#menu-item-680 a', key: 'header.about' },
      { selector: '#menu-item-666 > a', key: 'header.services' },
      { selector: '#menu-item-products a', key: 'header.products' },
      { selector: '#menu-item-company > a', key: 'header.company' },
      { selector: '#menu-item-contact a', key: 'header.contact' },
      { selector: '#menu-item-1680 a', key: 'header.insights' }
    ];
    
    headerElements.forEach(({ selector, key }) => {
      const element = document.querySelector(selector);
      if (element) {
        const translation = this.getTranslation(key, translations);
        if (translation) {
          element.textContent = translation;
        }
      }
    });
  }

  /**
   * Update mobile navigation
   */
  updateMobileNavigation(translations) {
    const mobileElements = [
      { selector: '.mobile-menu-nav .mobile-menu-link[href*="about-us"]', key: 'header.about' },
      { selector: '.mobile-menu-nav .mobile-dropdown-toggle[data-dropdown="services"] span', key: 'header.services' },
      { selector: '.mobile-menu-nav .mobile-dropdown-toggle[data-dropdown="products"] span', key: 'header.products' },
      { selector: '.mobile-menu-nav .mobile-dropdown-toggle[data-dropdown="company"] span', key: 'header.company' },
      { selector: '.mobile-menu-nav .mobile-menu-link.contact-scroll-btn', key: 'header.contact' }
    ];
    
    mobileElements.forEach(({ selector, key }) => {
      const element = document.querySelector(selector);
      if (element) {
        const translation = this.getTranslation(key, translations);
        if (translation) {
          element.textContent = translation;
        }
      }
    });
  }

  /**
   * Update mobile dropdown menus
   */
  updateMobileDropdownMenus(translations) {
    // Update mobile services dropdown
    this.updateMobileServicesDropdown(translations);
    
    // Update mobile products dropdown
    this.updateMobileProductsDropdown(translations);
    
    // Update mobile company dropdown
    this.updateMobileCompanyDropdown(translations);
  }

  /**
   * Update mobile services dropdown
   */
  updateMobileServicesDropdown(translations) {
    const servicesDropdown = document.querySelector('#services-dropdown');
    if (servicesDropdown) {
      const items = servicesDropdown.querySelectorAll('li a');
      const keys = [
        'dropdown.services.aiConsulting',
        'dropdown.services.engineering',
        'dropdown.services.dataAnalytics',
        'dropdown.services.corporateTraining'
      ];
      
      items.forEach((item, index) => {
        if (keys[index]) {
          const translation = this.getTranslation(keys[index], translations);
          if (translation) {
            item.textContent = translation;
          }
        }
      });
    }
  }

  /**
   * Update mobile products dropdown
   */
  updateMobileProductsDropdown(translations) {
    const productsDropdown = document.querySelector('#products-dropdown');
    if (productsDropdown) {
      const items = productsDropdown.querySelectorAll('li a');
      const keys = [
        'dropdown.products.lmsUniversity',
        'dropdown.products.crmUniversity',
        'dropdown.products.esg',
        'dropdown.products.lmsCorporate',
        'dropdown.products.crmCorporate'
      ];
      
      items.forEach((item, index) => {
        if (keys[index]) {
          const translation = this.getTranslation(keys[index], translations);
          if (translation) {
            item.textContent = translation;
          }
        }
      });
    }
  }

  /**
   * Update mobile company dropdown
   */
  updateMobileCompanyDropdown(translations) {
    const companyDropdown = document.querySelector('#company-dropdown');
    if (companyDropdown) {
      const items = companyDropdown.querySelectorAll('li a');
      const keys = [
        'dropdown.company.profile',
        'dropdown.company.csr',
        'dropdown.company.partners',
        'dropdown.company.industry'
      ];
      
      items.forEach((item, index) => {
        if (keys[index]) {
          const translation = this.getTranslation(keys[index], translations);
          if (translation) {
            item.textContent = translation;
          }
        }
      });
    }
  }

  /**
   * Update dropdown menus
   */
  updateDropdownMenus(translations) {
    // Services dropdown
    this.updateServicesDropdown(translations);
    
    // Products dropdown
    this.updateProductsDropdown(translations);
    
    // Company dropdown
    this.updateCompanyDropdown(translations);
  }

  /**
   * Update services dropdown
   */
  updateServicesDropdown(translations) {
    const servicesDropdown = document.querySelector('.services-dropdown');
    if (servicesDropdown) {
      const items = servicesDropdown.querySelectorAll('li a');
      const keys = [
        'dropdown.services.aiConsulting',
        'dropdown.services.engineering',
        'dropdown.services.dataAnalytics',
        'dropdown.services.corporateTraining'
      ];
      
      items.forEach((item, index) => {
        if (keys[index]) {
          const translation = this.getTranslation(keys[index], translations);
          if (translation) {
            item.textContent = translation;
          }
        }
      });
    }
  }

  /**
   * Update products dropdown
   */
  updateProductsDropdown(translations) {
    const productsDropdown = document.querySelector('.products-dropdown');
    if (productsDropdown) {
      const items = productsDropdown.querySelectorAll('li a');
      const keys = [
        'dropdown.products.lmsUniversity',
        'dropdown.products.crmUniversity',
        'dropdown.products.esg',
        'dropdown.products.lmsCorporate',
        'dropdown.products.crmCorporate'
      ];
      
      items.forEach((item, index) => {
        if (keys[index]) {
          const translation = this.getTranslation(keys[index], translations);
          if (translation) {
            item.textContent = translation;
          }
        }
      });
    }
  }

  /**
   * Update company dropdown
   */
  updateCompanyDropdown(translations) {
    const companyDropdown = document.querySelector('.company-dropdown');
    if (companyDropdown) {
      const items = companyDropdown.querySelectorAll('li a');
      const keys = [
        'dropdown.company.profile',
        'dropdown.company.csr',
        'dropdown.company.partners',
        'dropdown.company.industry'
      ];
      
      items.forEach((item, index) => {
        if (keys[index]) {
          const translation = this.getTranslation(keys[index], translations);
          if (translation) {
            item.textContent = translation;
          }
        }
      });
    }
  }

  /**
   * Update forms and placeholders
   */
  updateForms(translations) {
    // Contact form
    this.updateContactForm(translations);
    
    // Other forms
    this.updateOtherForms(translations);
  }

  /**
   * Update contact form
   */
  updateContactForm(translations) {
    const formElements = [
      { selector: 'input[name="your-name"]', key: 'common.namePlaceholder', attribute: 'placeholder' },
      { selector: 'input[name="your-email"]', key: 'common.emailPlaceholder', attribute: 'placeholder' },
      { selector: 'textarea[name="your-message"]', key: 'common.messagePlaceholder', attribute: 'placeholder' },
      { selector: 'input[type="submit"]', key: 'common.sendMessage', attribute: 'value' }
    ];
    
    formElements.forEach(({ selector, key, attribute }) => {
      const element = document.querySelector(selector);
      if (element) {
        const translation = this.getTranslation(key, translations);
        if (translation) {
          element.setAttribute(attribute, translation);
        }
      }
    });
  }

  /**
   * Update other forms
   */
  updateOtherForms(translations) {
    // Add other form updates here
  }

  /**
   * Update meta tags for SEO
   */
  updateMetaTags() {
    const languageInfo = getLanguageInfo(this.currentLanguage);
    
    // Update hreflang
    const hreflang = document.querySelector('link[hreflang]');
    if (hreflang) {
      hreflang.hreflang = this.currentLanguage;
    }
    
    // Update language meta tag
    const langMeta = document.querySelector('meta[name="language"]');
    if (langMeta) {
      langMeta.content = this.currentLanguage;
    }
  }

  /**
   * Get translation by key
   */
  getTranslation(key, translations = null) {
    try {
      const trans = translations || this.translations.get(this.currentLanguage);
      if (!trans) return null;
      
      // Split key by dots (e.g., "header.about")
      const keys = key.split('.');
      let result = trans;
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return null;
        }
      }
      
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to get translation for key: ${key}`, error);
      return null;
    }
  }

  /**
   * Initialize RTL support
   */
  initializeRTL() {
    if (isRTL(this.currentLanguage)) {
      this.updateRTL();
    }
  }

  /**
   * Update RTL support
   */
  updateRTL() {
    const languageInfo = getLanguageInfo(this.currentLanguage);
    
    if (languageInfo.rtl) {
      // Add RTL-specific styling
      document.documentElement.classList.add('rtl');
      document.body.classList.add('rtl');
      
      // Update mobile menu direction
      const mobileMenu = document.querySelector('.mobile-menu-container');
      if (mobileMenu) {
        mobileMenu.style.direction = 'rtl';
        mobileMenu.style.textAlign = 'right';
      }
    } else {
      // Remove RTL styling
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('rtl');
      
      // Update mobile menu direction
      const mobileMenu = document.querySelector('.mobile-menu-container');
      if (mobileMenu) {
        mobileMenu.style.direction = 'ltr';
        mobileMenu.style.textAlign = 'left';
      }
    }
  }

  /**
   * Preload languages for better performance
   */
  async preloadLanguages(languageCodes) {
    try {
      const promises = languageCodes.map(code => this.loadLanguage(code));
      await Promise.allSettled(promises);
      console.log('📚 Languages preloaded successfully');
    } catch (error) {
      console.error('❌ Failed to preload languages:', error);
    }
  }

  /**
   * Get saved language from storage
   */
  getSavedLanguage() {
    try {
      // Try localStorage first
      const saved = localStorage.getItem(LOCALIZATION_SETTINGS.language.localStorageKey);
      if (saved && SUPPORTED_LANGUAGES[saved]) {
        return saved;
      }
      
      // Try cookies
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === LOCALIZATION_SETTINGS.language.cookieName && SUPPORTED_LANGUAGES[value]) {
          return value;
        }
      }
      
      // Try URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get(LOCALIZATION_SETTINGS.language.urlParameter);
      if (urlLang && SUPPORTED_LANGUAGES[urlLang]) {
        return urlLang;
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Failed to get saved language:', error);
      return null;
    }
  }

  /**
   * Save language preference
   */
  saveLanguage(languageCode) {
    try {
      // Save to localStorage
      localStorage.setItem(LOCALIZATION_SETTINGS.language.localStorageKey, languageCode);
      
      // Save to cookies
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.cookie = `${LOCALIZATION_SETTINGS.language.cookieName}=${languageCode}; expires=${expiryDate.toUTCString()}; path=/`;
      
      // Update URL parameter
      const url = new URL(window.location);
      url.searchParams.set(LOCALIZATION_SETTINGS.language.urlParameter, languageCode);
      window.history.replaceState({}, '', url);
      
    } catch (error) {
      console.error('❌ Failed to save language preference:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for language toggle clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-language-toggle]')) {
        e.preventDefault();
        const language = e.target.getAttribute('data-language');
        if (language) {
          this.setLanguage(language);
        }
      }
    });
    
    // Listen for language dropdown changes
    document.addEventListener('change', (e) => {
      if (e.target.matches('[data-language-select]')) {
        const language = e.target.value;
        if (language) {
          this.setLanguage(language);
        }
      }
    });
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Error handling
   */
  handleError(error) {
    console.error('❌ Localization Engine Error:', error);
    
    // Emit error event
    this.emit('error', { error, timestamp: Date.now() });
    
    // Show user feedback if enabled
    if (LOCALIZATION_SETTINGS.errors.showConsoleWarnings) {
      // Could show a toast notification here
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get language info
   */
  getLanguageInfo(languageCode = null) {
    const code = languageCode || this.currentLanguage;
    return getLanguageInfo(code);
  }

  /**
   * Check if language is RTL
   */
  isRTL(languageCode = null) {
    const code = languageCode || this.currentLanguage;
    return isRTL(code);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    try {
      // Clear cache
      this.cache.clear();
      
      // Clear translations
      this.translations.clear();
      
      // Remove event listeners
      this.eventListeners.clear();
      
      // Reset state
      this.isInitialized = false;
      this.currentLanguage = LOCALIZATION_SETTINGS.language.defaultLanguage;
      
      console.log('🧹 Localization Engine destroyed successfully');
      
    } catch (error) {
      console.error('❌ Failed to destroy Localization Engine:', error);
    }
  }
}

// Export the class
export default LocalizationEngine;

// Create and export a singleton instance
export const localizationEngine = new LocalizationEngine(); 