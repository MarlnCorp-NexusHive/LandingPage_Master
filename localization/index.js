/**
 * 🌍 Marln Localization System - Main Entry Point
 * Professional, scalable localization system for international expansion
 */

// Import core components
import LocalizationEngine from './core/localization-engine.js';
import LanguageToggle from './components/language-toggle.js';

// Import configurations
import { SUPPORTED_LANGUAGES, getActiveLanguages } from './config/supported-languages.js';
import { LOCALIZATION_SETTINGS } from './config/settings.js';

// Import styles
import './styles/language-toggle.css';

/**
 * Main Localization System Class
 * Orchestrates all localization functionality
 */
class MarlnLocalizationSystem {
  constructor(options = {}) {
    this.options = {
      ...LOCALIZATION_SETTINGS,
      ...options
    };
    
    this.engine = null;
    this.toggle = null;
    this.isInitialized = false;
    this.eventListeners = new Map();
    
    // Bind methods
    this.init = this.init.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
    this.getCurrentLanguage = this.getCurrentLanguage.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  /**
   * Initialize the localization system
   */
  async init() {
    try {
      console.log('🚀 Initializing Marln Localization System...');
      
      // Initialize localization engine
      this.engine = new LocalizationEngine(this.options);
      await this.engine.init();
      
      // Initialize language toggle
      this.toggle = new LanguageToggle(this.options.ui);
      this.toggle.init();
      
      // Connect engine and toggle
      this.connectComponents();
      
      // Set up global event listeners
      this.setupGlobalEvents();
      
      this.isInitialized = true;
      console.log('✅ Marln Localization System initialized successfully');
      
      // Emit ready event
      this.emit('ready', {
        engine: this.engine,
        toggle: this.toggle,
        currentLanguage: this.getCurrentLanguage()
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize Marln Localization System:', error);
      this.handleError(error);
    }
  }

  /**
   * Connect engine and toggle components
   */
  connectComponents() {
    if (!this.engine || !this.toggle) return;
    
    // Listen for toggle language changes
    this.toggle.on('languageChanged', async (data) => {
      try {
        // Update engine language
        await this.engine.setLanguage(data.to);
        
        // Emit system language change event
        this.emit('languageChanged', {
          from: data.from,
          to: data.to,
          source: 'toggle'
        });
        
      } catch (error) {
        console.error('❌ Failed to sync language change:', error);
        this.handleError(error);
      }
    });
    
    // Listen for engine language changes
    this.engine.on('languageChanged', (data) => {
      try {
        // Update toggle display
        this.toggle.setLanguage(data.to);
        
        // Emit system language change event
        this.emit('languageChanged', {
          from: data.from,
          to: data.to,
          source: 'engine'
        });
        
      } catch (error) {
        console.error('❌ Failed to sync engine language change:', error);
        this.handleError(error);
      }
    });
    
    // Listen for engine ready event
    this.engine.on('ready', (data) => {
      // Sync toggle with engine language
      this.toggle.setLanguage(data.language);
    });
    
    // Listen for toggle ready event
    this.toggle.on('ready', (data) => {
      // Sync engine with toggle language
      this.engine.setLanguage(this.toggle.getCurrentLanguage());
    });
  }

  /**
   * Set up global event listeners
   */
  setupGlobalEvents() {
    // Listen for language changes from external sources
    window.addEventListener('marln-language-change', (event) => {
      const { language } = event.detail;
      if (language && SUPPORTED_LANGUAGES[language]) {
        this.setLanguage(language);
      }
    });
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isInitialized) {
        // Refresh language state when page becomes visible
        this.refreshLanguageState();
      }
    });
    
    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', (event) => {
      if (event.key === LOCALIZATION_SETTINGS.language.localStorageKey) {
        const newLanguage = event.newValue;
        if (newLanguage && SUPPORTED_LANGUAGES[newLanguage]) {
          this.setLanguage(newLanguage);
        }
      }
    });
  }

  /**
   * Set language for the entire system
   */
  async setLanguage(languageCode) {
    try {
      if (!SUPPORTED_LANGUAGES[languageCode]) {
        throw new Error(`Unsupported language: ${languageCode}`);
      }
      
      console.log(`🌍 Setting system language to: ${languageCode}`);
      
      // Update engine
      if (this.engine) {
        await this.engine.setLanguage(languageCode);
      }
      
      // Update toggle
      if (this.toggle) {
        this.toggle.setLanguage(languageCode);
      }
      
      // Emit system event
      this.emit('languageSet', {
        language: languageCode,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error(`❌ Failed to set system language to ${languageCode}:`, error);
      this.handleError(error);
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    if (this.engine) {
      return this.engine.getCurrentLanguage();
    }
    return LOCALIZATION_SETTINGS.language.defaultLanguage;
  }

  /**
   * Get language info
   */
  getLanguageInfo(languageCode = null) {
    const code = languageCode || this.getCurrentLanguage();
    return SUPPORTED_LANGUAGES[code] || SUPPORTED_LANGUAGES[LOCALIZATION_SETTINGS.language.defaultLanguage];
  }

  /**
   * Check if language is RTL
   */
  isRTL(languageCode = null) {
    const code = languageCode || this.getCurrentLanguage();
    const languageInfo = this.getLanguageInfo(code);
    return languageInfo.rtl || false;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return { ...SUPPORTED_LANGUAGES };
  }

  /**
   * Get active languages (with translation files)
   */
  getActiveLanguages() {
    return getActiveLanguages();
  }

  /**
   * Refresh language state
   */
  async refreshLanguageState() {
    try {
      if (this.engine) {
        await this.engine.updatePage();
      }
      
      console.log('🔄 Language state refreshed');
      
    } catch (error) {
      console.error('❌ Failed to refresh language state:', error);
      this.handleError(error);
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    if (this.engine) {
      return this.engine.getPerformanceMetrics();
    }
    return {};
  }

  /**
   * Show/hide language toggle
   */
  setToggleVisible(visible) {
    if (this.toggle) {
      this.toggle.setVisible(visible);
    }
  }

  /**
   * Enable/disable language toggle
   */
  setToggleEnabled(enabled) {
    if (this.toggle) {
      this.toggle.setEnabled(enabled);
    }
  }

  /**
   * Update toggle style
   */
  updateToggleStyle(style) {
    if (this.toggle) {
      this.toggle.updateStyle(style);
    }
  }

  /**
   * Update toggle size
   */
  updateToggleSize(size) {
    if (this.toggle) {
      this.toggle.updateSize(size);
    }
  }

  /**
   * Insert language toggle into specific container
   */
  insertLanguageToggle(selector) {
    try {
      console.log(`🔍 Attempting to insert toggle into: ${selector}`);
      
      const container = document.querySelector(selector);
      if (!container) {
        console.warn(`⚠️ Container not found: ${selector}`);
        return;
      }
      
      console.log(`🔍 Container found:`, container);
      console.log(`🔍 Container HTML before:`, container.innerHTML);

      // Create a new toggle instance for this container
      const toggle = new LanguageToggle(this.options.ui);
      toggle.init();
      
      // Clear container and insert toggle
      console.log(`🔍 Clearing container and inserting toggle...`);
      container.innerHTML = '';
      container.appendChild(toggle.element);
      
      console.log(`🔍 Container HTML after insertion:`, container.innerHTML);
      
      // Connect toggle to engine
      toggle.on('languageChanged', async (data) => {
        try {
          await this.engine.setLanguage(data.to);
          
          // Emit system language change event
          this.emit('languageChanged', {
            from: data.from,
            to: data.to,
            source: 'toggle',
            container: selector
          });
          
        } catch (error) {
          console.error('❌ Failed to sync language change:', error);
          this.handleError(error);
        }
      });
      
      console.log(`✅ Language toggle inserted into: ${selector}`);
    console.log(`🔍 Toggle element:`, toggle.element);
    console.log(`🔍 Container element:`, container);
      
    } catch (error) {
      console.error(`❌ Failed to insert language toggle into ${selector}:`, error);
      this.handleError(error);
    }
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
    console.error('❌ Marln Localization System Error:', error);
    
    // Emit error event
    this.emit('error', { error, timestamp: Date.now() });
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    try {
      console.log('🧹 Destroying Marln Localization System...');
      
      // Destroy engine
      if (this.engine) {
        this.engine.destroy();
        this.engine = null;
      }
      
      // Destroy toggle
      if (this.toggle) {
        this.toggle.destroy();
        this.toggle = null;
      }
      
      // Clear event listeners
      this.eventListeners.clear();
      
      // Reset state
      this.isInitialized = false;
      
      console.log('✅ Marln Localization System destroyed successfully');
      
    } catch (error) {
      console.error('❌ Failed to destroy Marln Localization System:', error);
    }
  }
}

// Create and export singleton instance
export const marlnLocalization = new MarlnLocalizationSystem();

// Export individual components for advanced usage
export { LocalizationEngine, LanguageToggle };

// Export configurations
export { SUPPORTED_LANGUAGES, LOCALIZATION_SETTINGS };

// Export utility functions
export { getActiveLanguages };

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    marlnLocalization.init();
  });
} else {
  // DOM is already ready
  marlnLocalization.init();
}

// Export for global usage
window.MarlnLocalization = marlnLocalization;

// Export for module usage
export default marlnLocalization; 