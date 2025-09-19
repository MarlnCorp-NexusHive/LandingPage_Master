/**
 * 🌍 Simple Language Toggle - Self-contained and working
 */

class SimpleLanguageToggle {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentLanguage = this.getStoredLanguage();
        this.translations = {};
        this.init();
    }

    init() {
        this.loadTranslations().then(() => {
            this.createToggle();
            this.setupEventListeners();
                    // Apply the stored language immediately
        this.applyTranslations(this.currentLanguage);
        // Set initial document direction
        this.updateToggleLayout(this.currentLanguage);
        }).catch(error => {
            // Create toggle anyway with fallback
            this.createToggle();
            this.setupEventListeners();
            // Set initial document direction even on error
            this.updateToggleLayout(this.currentLanguage);
        });
        

    }

    createToggle() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            return;
        }

        // Determine initial active state based on current language
        const isArabic = this.currentLanguage === 'ar';
        const enClass = isArabic ? 'inactive' : 'active';
        const arClass = isArabic ? 'active' : 'inactive';
        const enText = 'EN';
        const arText = 'العربية';

        // Create the sliding toggle design
        const toggleHTML = `
            <div class="language-toggle">
                <button class="toggle-button" data-current-lang="${this.currentLanguage}">
                    <div class="slider-bg"></div>
                    <div class="lang-container">
                        <div class="lang-option ${enClass}">${enText}</div>
                        <div class="lang-option ${arClass}">${arText}</div>
                    </div>
                </button>
            </div>
        `;

        container.innerHTML = toggleHTML;
        
        // Apply initial language state
        this.updateToggleLayout(this.currentLanguage);
    }

    setupEventListeners() {
        const toggleButton = document.querySelector(`#${this.containerId} .toggle-button`);
        if (toggleButton) {
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleLanguage();
            });

            // Keyboard support
            toggleButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleLanguage();
                }
            });
        }
    }

    toggleLanguage() {
        const toggleButton = document.querySelector(`#${this.containerId} .toggle-button`);
        const sliderBg = toggleButton.querySelector('.slider-bg');
        const langOptions = toggleButton.querySelectorAll('.lang-option');
        
        // Store the old language before updating
        const oldLang = this.currentLanguage;
        
        // Toggle to opposite language
        const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
        
        // Update the current language
        toggleButton.setAttribute('data-current-lang', newLang);
        this.currentLanguage = newLang;
        
        // Save the language preference to localStorage
        this.saveLanguagePreference(newLang);
        
        // Apply translations and update layout
        this.applyTranslations(newLang);
        
        // Update the toggle layout (this will handle slider positioning and active states)
        this.updateToggleLayout(newLang);
        
        // Ensure header maintains LTR layout even in Arabic mode
        const header = document.querySelector('header');
        if (header) {
            header.style.direction = 'ltr';
            header.style.textAlign = 'left';
        }
        
        // Emit custom event for other parts of the system
        const event = new CustomEvent('languageChanged', {
            detail: { from: oldLang, to: newLang }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Load translation files
     */
    async loadTranslations() {
        try {
            // Try multiple possible paths for translation files
            const possiblePaths = [
                './localization/languages/',
                '/localization/languages/',
                '../localization/languages/',
                '../../localization/languages/'
            ];
            
            let enData, arData;
            let loadedPath = '';
            
            // Try to load from each possible path
            for (const path of possiblePaths) {
                try {
                    // Load English translations
                    const enResponse = await fetch(path + 'en.json');
                    if (enResponse.ok) {
                        enData = await enResponse.json();
                        
                        // Load Arabic translations from the same path
                        const arResponse = await fetch(path + 'ar.json');
                        if (arResponse.ok) {
                            arData = await arResponse.json();
                            loadedPath = path;
                            break;
                        }
                    }
                } catch (pathError) {
                    continue;
                }
            }
            
            if (!enData || !arData) {
                throw new Error('Failed to load translations from any path');
            }
            

            
            this.translations = { en: enData, ar: arData };
            
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Apply translations to the page
     */
    applyTranslations(language) {
        if (!this.translations[language]) {
            return;
        }
        
        // Validate translation structure - check if translations exist
        if (!this.translations[language] || Object.keys(this.translations[language]).length === 0) {
            return;
        }
        
        // Find all elements with data-i18n attributes
        const elements = document.querySelectorAll('[data-i18n]');
        let updatedCount = 0;
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key, language);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                    element.placeholder = translation;
                } else if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    // Check if translation contains HTML tags
                    if (translation.includes('<') && translation.includes('>')) {
                        element.innerHTML = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
                updatedCount++;
            } else {
                // Try to find partial matches
                this.findPartialTranslation(key, language);
            }
        });
        
        // Handle data-i18n-placeholder attributes
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key, language);
            
            if (translation) {
                element.placeholder = translation;
                updatedCount++;
            }
        });
        
        // Handle data-i18n-value attributes
        const valueElements = document.querySelectorAll('[data-i18n-value]');
        
        valueElements.forEach(element => {
            const key = element.getAttribute('data-i18n-value');
            const translation = this.getTranslation(key, language);
            
            if (translation) {
                element.value = translation;
                updatedCount++;
            }
        });
        
        // Special debug for FAQ section
        const faqElements = document.querySelectorAll('.faq [data-i18n], [class*="faq"] [data-i18n]');
        faqElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
        });
        
    }
    
    /**
     * Try to find partial translation matches
     */
    findPartialTranslation(key, language) {
        const keys = key.split('.');
        const possibleMatches = [];
        
        // Try different combinations of the key
        for (let i = 1; i < keys.length; i++) {
            const partialKey = keys.slice(0, i).join('.');
            const translation = this.getTranslation(partialKey, language);
            if (translation) {
                possibleMatches.push({ key: partialKey, translation });
            }
        }
        
        // Partial matches logic (silent)
    }
    
    /**
     * Get translation by key
     */
    getTranslation(key, language) {
        const keys = key.split('.');
        let value = this.translations[language];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }
    
    /**
     * Update toggle layout for language switching
     */
    updateToggleLayout(language) {
        const toggleButton = document.querySelector(`#${this.containerId} .toggle-button`);
        const langContainer = toggleButton.querySelector('.lang-container');
        const langOptions = toggleButton.querySelectorAll('.lang-option');
        const sliderBg = toggleButton.querySelector('.slider-bg');
        
        // Set document language attribute only
        if (language === 'ar') {
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('lang', 'en');
        }
        
        if (language === 'ar') {
            // Arabic mode - keep LTR layout for button
            toggleButton.style.direction = 'ltr';
            langContainer.style.flexDirection = 'row';
            
            // Keep language options in original order
            langOptions[0].textContent = 'EN';
            langOptions[1].textContent = 'العربية';
            
            // Position slider on Arabic side (RIGHT side for Arabic active)
            sliderBg.classList.add('slide-right');
            // Remove any inline styles that might interfere with CSS transitions
            sliderBg.style.removeProperty('left');
            sliderBg.style.removeProperty('transform');
            
            // Update active/inactive states for Arabic
            langOptions[0].classList.remove('active');
            langOptions[0].classList.add('inactive');
            langOptions[1].classList.remove('inactive');
            langOptions[1].classList.add('active');

        } else {
            // English mode - LTR layout
            toggleButton.style.direction = 'ltr';
            langContainer.style.flexDirection = 'row';
            
            // Keep language options in original order
            langOptions[0].textContent = 'EN';
            langOptions[1].textContent = 'العربية';
            
            // Position slider on English side (LEFT side for English active)
            sliderBg.classList.remove('slide-right');
            // Remove any inline styles that might interfere with CSS transitions
            sliderBg.style.removeProperty('left');
            sliderBg.style.removeProperty('transform');
            
            // Update active/inactive states for English
            langOptions[0].classList.remove('inactive');
            langOptions[0].classList.add('active');
            langOptions[1].classList.remove('active');
            langOptions[1].classList.add('inactive');

        }
    }
    
    /**
     * Get stored language preference from localStorage
     */
    getStoredLanguage() {
        try {
            const stored = localStorage.getItem('marln_language_preference');
            return stored === 'ar' ? 'ar' : 'en';
        } catch (error) {
            return 'en';
        }
    }
    
    /**
     * Save language preference to localStorage
     */
    saveLanguagePreference(language) {
        try {
            localStorage.setItem('marln_language_preference', language);
        } catch (error) {
            // Silent fail
        }
    }
}

// Export for use
window.SimpleLanguageToggle = SimpleLanguageToggle; 