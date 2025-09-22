/**
 * Language Toggle JavaScript - SEO Optimized & Accessible
 * Handles language switching functionality with proper ARIA support
 */

(function() {
    'use strict';
    
    // Language configuration
    const languages = {
        en: {
            code: 'en',
            name: 'English',
            direction: 'ltr',
            locale: 'en-SA'
        },
        ar: {
            code: 'ar',
            name: 'العربية',
            direction: 'rtl',
            locale: 'ar-SA'
        }
    };
    
    // DOM Elements
    let langToggle;
    let langDropdown;
    let currentLangSpan;
    let langLinks;
    
    // State
    let currentLanguage = 'en';
    let isDropdownOpen = false;
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeLanguageToggle();
        setupEventListeners();
        loadSavedLanguage();
    });
    
    /**
     * Initialize language toggle functionality
     */
    function initializeLanguageToggle() {
        langToggle = document.getElementById('lang-toggle');
        langDropdown = document.querySelector('.lang-dropdown');
        currentLangSpan = document.querySelector('.current-lang');
        langLinks = document.querySelectorAll('.lang-dropdown a[data-lang]');
        
        if (!langToggle || !langDropdown || !currentLangSpan) {
            console.warn('Language toggle elements not found');
            return;
        }
        
        // Set initial ARIA attributes
        langToggle.setAttribute('aria-expanded', 'false');
        langToggle.setAttribute('aria-haspopup', 'true');
        langToggle.setAttribute('role', 'button');
        
        // Set initial dropdown state
        langDropdown.style.display = 'none';
        
        // Setup keyboard navigation for dropdown
        setupKeyboardNavigation();
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Toggle button click
        if (langToggle) {
            langToggle.addEventListener('click', handleToggleClick);
        }
        
        // Language link clicks
        if (langLinks) {
            langLinks.forEach(link => {
                link.addEventListener('click', handleLanguageClick);
            });
        }
        
        // Click outside to close
        document.addEventListener('click', handleOutsideClick);
        
        // Escape key to close
        document.addEventListener('keydown', handleKeyDown);
        
        // Window resize
        window.addEventListener('resize', handleResize);
    }
    
    /**
     * Handle toggle button click
     */
    function handleToggleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (isDropdownOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
    
    /**
     * Handle language selection
     */
    function handleLanguageClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const selectedLang = event.target.getAttribute('data-lang');
        if (selectedLang && languages[selectedLang]) {
            switchLanguage(selectedLang);
            closeDropdown();
        }
    }
    
    /**
     * Handle clicks outside dropdown
     */
    function handleOutsideClick(event) {
        if (isDropdownOpen && !langToggle.contains(event.target)) {
            closeDropdown();
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    function handleKeyDown(event) {
        if (!isDropdownOpen) return;
        
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                closeDropdown();
                langToggle.focus();
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                focusNextLanguage();
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                focusPreviousLanguage();
                break;
                
            case 'Enter':
            case ' ':
                event.preventDefault();
                const focusedLink = document.activeElement;
                if (focusedLink && focusedLink.getAttribute('data-lang')) {
                    focusedLink.click();
                }
                break;
        }
    }
    
    /**
     * Handle window resize
     */
    function handleResize() {
        // Close dropdown on mobile if screen becomes too small
        if (window.innerWidth < 480 && isDropdownOpen) {
            closeDropdown();
        }
    }
    
    /**
     * Open language dropdown
     */
    function openDropdown() {
        isDropdownOpen = true;
        langDropdown.style.display = 'block';
        langToggle.setAttribute('aria-expanded', 'true');
        
        // Focus first language option
        const firstLink = langDropdown.querySelector('a[data-lang]');
        if (firstLink) {
            firstLink.focus();
        }
        
        // Announce to screen readers
        announceToScreenReader('Language menu opened');
    }
    
    /**
     * Close language dropdown
     */
    function closeDropdown() {
        isDropdownOpen = false;
        langDropdown.style.display = 'none';
        langToggle.setAttribute('aria-expanded', 'false');
        
        // Announce to screen readers
        announceToScreenReader('Language menu closed');
    }
    
    /**
     * Focus next language option
     */
    function focusNextLanguage() {
        const currentFocused = document.activeElement;
        const currentIndex = Array.from(langLinks).indexOf(currentFocused);
        const nextIndex = (currentIndex + 1) % langLinks.length;
        langLinks[nextIndex].focus();
    }
    
    /**
     * Focus previous language option
     */
    function focusPreviousLanguage() {
        const currentFocused = document.activeElement;
        const currentIndex = Array.from(langLinks).indexOf(currentFocused);
        const prevIndex = currentIndex === 0 ? langLinks.length - 1 : currentIndex - 1;
        langLinks[prevIndex].focus();
    }
    
    /**
     * Switch to selected language
     */
    function switchLanguage(langCode) {
        if (!languages[langCode]) {
            console.error('Invalid language code:', langCode);
            return;
        }
        
        const lang = languages[langCode];
        currentLanguage = langCode;
        
        // Update UI
        updateLanguageUI(lang);
        
        // Update document attributes
        updateDocumentLanguage(lang);
        
        // Save preference
        saveLanguagePreference(langCode);
        
        // Update content (if translation system is available)
        updateTranslatedContent(langCode);
        
        // Announce change
        announceToScreenReader(`Language changed to ${lang.name}`);
        
        // Trigger custom event for other components
        const event = new CustomEvent('languageChanged', {
            detail: { language: langCode, langObject: lang }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Update language UI elements
     */
    function updateLanguageUI(lang) {
        if (currentLangSpan) {
            currentLangSpan.textContent = lang.code.toUpperCase();
        }
        
        // Update active state in dropdown
        langLinks.forEach(link => {
            const linkLang = link.getAttribute('data-lang');
            if (linkLang === lang.code) {
                link.setAttribute('aria-current', 'true');
                link.classList.add('active');
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Update document language attributes
     */
    function updateDocumentLanguage(lang) {
        document.documentElement.lang = lang.locale;
        document.documentElement.dir = lang.direction;
        
        // Update body class for RTL/LTR styling
        document.body.classList.remove('rtl', 'ltr');
        document.body.classList.add(lang.direction);
    }
    
    /**
     * Save language preference
     */
    function saveLanguagePreference(langCode) {
        try {
            localStorage.setItem('preferred-language', langCode);
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
    }
    
    /**
     * Load saved language preference
     */
    function loadSavedLanguage() {
        try {
            const savedLang = localStorage.getItem('preferred-language');
            if (savedLang && languages[savedLang]) {
                switchLanguage(savedLang);
            } else {
                // Try to detect browser language
                detectBrowserLanguage();
            }
        } catch (error) {
            console.warn('Could not load language preference:', error);
            detectBrowserLanguage();
        }
    }
    
    /**
     * Detect browser language preference
     */
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (languages[langCode]) {
            switchLanguage(langCode);
        } else {
            // Default to English
            switchLanguage('en');
        }
    }
    
    /**
     * Update translated content
     */
    function updateTranslatedContent(langCode) {
        // This would integrate with your translation system
        // For now, we'll handle basic RTL/LTR layout changes
        
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = getTranslation(key, langCode);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Update meta tags
        updateMetaTags(langCode);
    }
    
    /**
     * Get translation for a key
     */
    function getTranslation(key, langCode) {
        // This would integrate with your translation system
        // Placeholder implementation
        const translations = {
            'nav.home': {
                en: 'Home',
                ar: 'الرئيسية'
            },
            'nav.about': {
                en: 'About Us',
                ar: 'من نحن'
            },
            'nav.services': {
                en: 'Services',
                ar: 'الخدمات'
            },
            'nav.products': {
                en: 'Products',
                ar: 'المنتجات'
            },
            'nav.contact': {
                en: 'Contact',
                ar: 'اتصل بنا'
            }
        };
        
        return translations[key] ? translations[key][langCode] : null;
    }
    
    /**
     * Update meta tags for SEO
     */
    function updateMetaTags(langCode) {
        const lang = languages[langCode];
        
        // Update page title if it has a data attribute
        const titleElement = document.querySelector('title[data-translate]');
        if (titleElement) {
            const titleKey = titleElement.getAttribute('data-translate');
            const translatedTitle = getTranslation(titleKey, langCode);
            if (translatedTitle) {
                titleElement.textContent = translatedTitle;
            }
        }
        
        // Update meta description if it has a data attribute
        const metaDesc = document.querySelector('meta[name="description"][data-translate]');
        if (metaDesc) {
            const descKey = metaDesc.getAttribute('data-translate');
            const translatedDesc = getTranslation(descKey, langCode);
            if (translatedDesc) {
                metaDesc.setAttribute('content', translatedDesc);
            }
        }
    }
    
    /**
     * Setup keyboard navigation
     */
    function setupKeyboardNavigation() {
        if (!langLinks) return;
        
        langLinks.forEach((link, index) => {
            link.setAttribute('tabindex', '-1');
            link.setAttribute('role', 'menuitem');
            
            // Add keyboard event listeners
            link.addEventListener('keydown', function(event) {
                switch (event.key) {
                    case 'ArrowDown':
                        event.preventDefault();
                        const nextIndex = (index + 1) % langLinks.length;
                        langLinks[nextIndex].focus();
                        break;
                        
                    case 'ArrowUp':
                        event.preventDefault();
                        const prevIndex = index === 0 ? langLinks.length - 1 : index - 1;
                        langLinks[prevIndex].focus();
                        break;
                }
            });
        });
    }
    
    /**
     * Announce to screen readers
     */
    function announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        } else {
            // Create temporary live region
            const tempRegion = document.createElement('div');
            tempRegion.setAttribute('aria-live', 'polite');
            tempRegion.setAttribute('aria-atomic', 'true');
            tempRegion.className = 'sr-only';
            tempRegion.textContent = message;
            document.body.appendChild(tempRegion);
            
            // Remove after announcement
            setTimeout(() => {
                tempRegion.remove();
            }, 1000);
        }
    }
    
    /**
     * Get current language
     */
    function getCurrentLanguage() {
        return currentLanguage;
    }
    
    /**
     * Get available languages
     */
    function getAvailableLanguages() {
        return Object.keys(languages);
    }
    
    /**
     * Check if language is supported
     */
    function isLanguageSupported(langCode) {
        return languages.hasOwnProperty(langCode);
    }
    
    // Expose public API
    window.LanguageToggle = {
        switchLanguage,
        getCurrentLanguage,
        getAvailableLanguages,
        isLanguageSupported,
        openDropdown,
        closeDropdown
    };
    
})();