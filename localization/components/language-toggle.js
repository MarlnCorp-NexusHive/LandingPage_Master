/**
 * 🔄 Language Toggle Component
 * Modern, accessible language switching component
 */

import { SUPPORTED_LANGUAGES, getLanguageInfo } from '../config/supported-languages.js';
import { UI_SETTINGS } from '../config/settings.js';

class LanguageToggle {
  constructor(options = {}) {
    this.options = {
      ...UI_SETTINGS.toggle,
      ...options
    };
    
    this.currentLanguage = 'en';
    this.element = null;
    this.isInitialized = false;
    this.eventListeners = new Map();
    
    // Bind methods
    this.init = this.init.bind(this);
    this.render = this.render.bind(this);
    this.updateLanguage = this.updateLanguage.bind(this);
    this.handleClick = this.handleClick.handleClick.bind(this);
  }

  /**
   * Initialize the language toggle
   */
  init() {
    try {
      console.log('🔄 Initializing Language Toggle...');
      
      // Create the toggle element
      this.element = this.render();
      
      // Add to DOM
      this.appendToDOM();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set initial state
      this.updateLanguage(this.currentLanguage);
      
      // Set initial active state for sliding toggle
      const langOptions = this.element.querySelectorAll('.lang-option');
      langOptions.forEach((option, index) => {
        if (this.currentLanguage === 'en' && index === 0) {
          option.classList.add('active');
          option.classList.remove('inactive');
        } else if (this.currentLanguage === 'ar' && index === 1) {
          option.classList.add('active');
          option.classList.remove('inactive');
        } else {
          option.classList.add('inactive');
          option.classList.remove('active');
        }
      });
      
      this.isInitialized = true;
      console.log('✅ Language Toggle initialized successfully');
      
      // Emit ready event
      this.emit('ready', { element: this.element });
      
    } catch (error) {
      console.error('❌ Failed to initialize Language Toggle:', error);
      this.handleError(error);
    }
  }

  /**
   * Render the finalized toggle component based on toggle-design-test.html
   */
  render() {
    console.log('🎨 Creating language toggle component...');
    
    const container = document.createElement('div');
    container.className = 'language-toggle-container';
    
    // Create the sliding toggle design
    const toggle = document.createElement('div');
    toggle.className = 'language-toggle';
    
    // Create the main toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-button';
    toggleButton.setAttribute('data-current-lang', this.currentLanguage);
    toggleButton.setAttribute('aria-label', 'Change language');
    toggleButton.setAttribute('type', 'button');
    
    // Create sliding background
    const sliderBg = document.createElement('div');
    sliderBg.className = 'slider-bg';
    if (this.currentLanguage === 'ar') {
      sliderBg.classList.add('slide-right');
    }
    
    // Create language container
    const langContainer = document.createElement('div');
    langContainer.className = 'lang-container';
    
    // Create EN option
    const enOption = document.createElement('div');
    enOption.className = 'lang-option';
    enOption.textContent = 'EN';
    enOption.classList.add(this.currentLanguage === 'en' ? 'active' : 'inactive');
    
    // Create Arabic option
    const arOption = document.createElement('div');
    arOption.className = 'lang-option';
    arOption.textContent = 'العربية';
    arOption.classList.add(this.currentLanguage === 'ar' ? 'active' : 'inactive');
    
    // Assemble the toggle
    langContainer.appendChild(enOption);
    langContainer.appendChild(arOption);
    
    toggleButton.appendChild(sliderBg);
    toggleButton.appendChild(langContainer);
    toggle.appendChild(toggleButton);
    container.appendChild(toggle);
    
    console.log('🎨 Toggle component created:', container);
    console.log('🎨 Toggle HTML:', container.innerHTML);
    
    return container;
  }

  /**
   * Append toggle to DOM
   */
  appendToDOM() {
    // Try to find header first
    let targetElement = document.querySelector('header') || 
                       document.querySelector('.header') ||
                       document.querySelector('.header-wrapper');
    
    if (!targetElement) {
      // Fallback to body
      targetElement = document.body;
    }
    
    // Insert at the beginning of the target element
    if (targetElement.firstChild) {
      targetElement.insertBefore(this.element, targetElement.firstChild);
    } else {
      targetElement.appendChild(this.element);
    }
  }

  /**
   * Set up event listeners for sliding toggle
   */
  setupEventListeners() {
    if (!this.element) return;
    
    const toggleButton = this.element.querySelector('.toggle-button');
    if (toggleButton) {
      // Listen for clicks on the toggle button
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleLanguage(e);
      });
      
      // Keyboard support
      toggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleLanguage(e);
        }
      });
    }
  }
  
  /**
   * Handle language toggle logic
   */
  toggleLanguage(event) {
    event.stopPropagation();
    
    const toggleButton = this.element.querySelector('.toggle-button');
    const currentLang = toggleButton.getAttribute('data-current-lang');
    const sliderBg = toggleButton.querySelector('.slider-bg');
    const langOptions = toggleButton.querySelectorAll('.lang-option');
    
    // Toggle to opposite language
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    // Update the current language
    toggleButton.setAttribute('data-current-lang', newLang);
    
    // Slide the background
    if (newLang === 'ar') {
      sliderBg.classList.add('slide-right');
    } else {
      sliderBg.classList.remove('slide-right');
    }
    
    // Update active/inactive states
    langOptions.forEach((option, index) => {
      if (newLang === 'en' && index === 0) {
        option.classList.add('active');
        option.classList.remove('inactive');
      } else if (newLang === 'ar' && index === 1) {
        option.classList.add('active');
        option.classList.remove('inactive');
      } else {
        option.classList.add('inactive');
        option.classList.remove('active');
      }
    });
    
    // Update internal state and emit event
    this.updateLanguage(newLang);
  }

  /**
   * Handle toggle button click
   */
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      // Toggle to opposite language
      const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
      this.updateLanguage(newLang);
      
      // Emit language change event
      this.emit('languageChanged', {
        from: this.currentLanguage,
        to: newLang,
        element: this.element
      });
      
    } catch (error) {
      console.error('❌ Error handling toggle click:', error);
      this.handleError(error);
    }
  }

  /**
   * Update language display for sliding toggle
   */
  updateLanguage(languageCode) {
    try {
      if (!SUPPORTED_LANGUAGES[languageCode]) {
        throw new Error(`Unsupported language: ${languageCode}`);
      }
      
      const previousLanguage = this.currentLanguage;
      this.currentLanguage = languageCode;
      
      // Update toggle button state
      const toggleButton = this.element.querySelector('.toggle-button');
      if (toggleButton) {
        toggleButton.setAttribute('data-current-lang', languageCode);
      }
      
      // Update sliding background
      const sliderBg = this.element.querySelector('.slider-bg');
      if (sliderBg) {
        if (languageCode === 'ar') {
          sliderBg.classList.add('slide-right');
        } else {
          sliderBg.classList.remove('slide-right');
        }
      }
      
      // Update language option states
      const langOptions = this.element.querySelectorAll('.lang-option');
      langOptions.forEach((option, index) => {
        if (languageCode === 'en' && index === 0) {
          option.classList.add('active');
          option.classList.remove('inactive');
        } else if (languageCode === 'ar' && index === 1) {
          option.classList.add('active');
          option.classList.remove('inactive');
        } else {
          option.classList.add('inactive');
          option.classList.remove('active');
        }
      });
      
      // Update RTL support
      this.updateRTL(languageCode);
      
      // Emit language update event
      this.emit('languageUpdated', {
        from: previousLanguage,
        to: languageCode,
        element: this.element
      });
      
      console.log(`🔄 Language toggle updated to: ${languageCode}`);
      
    } catch (error) {
      console.error(`❌ Failed to update language to ${languageCode}:`, error);
      this.handleError(error);
    }
  }

  /**
   * Update RTL support
   */
  updateRTL(languageCode) {
    const languageInfo = getLanguageInfo(languageCode);
    
    if (languageInfo.rtl) {
      this.element.classList.add('rtl');
      this.element.setAttribute('dir', 'rtl');
    } else {
      this.element.classList.remove('rtl');
      this.element.setAttribute('dir', 'ltr');
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Set language programmatically
   */
  setLanguage(languageCode) {
    this.updateLanguage(languageCode);
  }

  /**
   * Show/hide the toggle
   */
  setVisible(visible) {
    if (this.element) {
      this.element.style.display = visible ? 'block' : 'none';
    }
  }

  /**
   * Enable/disable the toggle
   */
  setEnabled(enabled) {
    if (this.element) {
      const toggleButton = this.element.querySelector('.toggle-button');
      if (toggleButton) {
        toggleButton.disabled = !enabled;
        toggleButton.setAttribute('aria-disabled', !enabled);
      }
    }
  }

  /**
   * Update toggle style
   */
  updateStyle(style) {
    if (this.element) {
      // Remove existing style classes
      this.element.classList.remove('style-classic', 'style-modern', 'style-minimal');
      
      // Add new style class
      this.element.classList.add(`style-${style}`);
      
      // Update options
      this.options.style = style;
    }
  }

  /**
   * Update toggle size
   */
  updateSize(size) {
    if (this.element) {
      // Remove existing size classes
      this.element.classList.remove('size-small', 'size-medium', 'size-large');
      
      // Add new size class
      this.element.classList.add(`size-${size}`);
      
      // Update options
      this.options.size = size;
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
    console.error('❌ Language Toggle Error:', error);
    
    // Emit error event
    this.emit('error', { error, timestamp: Date.now() });
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    try {
      // Remove event listeners
      if (this.element) {
        const toggleButton = this.element.querySelector('.toggle-button');
        if (toggleButton) {
          toggleButton.removeEventListener('click', this.handleClick);
        }
      }
      
      // Remove from DOM
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      
      // Clear event listeners
      this.eventListeners.clear();
      
      // Reset state
      this.isInitialized = false;
      this.element = null;
      
      console.log('🧹 Language Toggle destroyed successfully');
      
    } catch (error) {
      console.error('❌ Failed to destroy Language Toggle:', error);
    }
  }
}

// Export the class
export default LanguageToggle;

// Create and export a singleton instance
export const languageToggle = new LanguageToggle(); 