/**
 * Marln Corporation Localization System
 * A clean, modern localization system for the Marln website
 */

class MarlnLocalization {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.initialized = false;
        this.observers = [];
        
        // Initialize the system
        this.init();
    }

    /**
     * Initialize the localization system
     */
    async init() {
        try {
            // Load translations
            await this.loadTranslations();
            
            // Set initial language from localStorage or browser preference
            const savedLang = localStorage.getItem('marln-language') || this.getBrowserLanguage();
            await this.setLanguage(savedLang);
            
            // Mark as initialized
            this.initialized = true;
            
            // Notify observers
            this.notifyObservers();
            
            console.log('Marln Localization System initialized successfully');
        } catch (error) {
            console.error('Failed to initialize localization system:', error);
        }
    }

    /**
     * Load translation files
     */
    async loadTranslations() {
        try {
            const [enTranslations, arTranslations] = await Promise.all([
                fetch('i18n/en.json').then(res => res.json()),
                fetch('i18n/ar.json').then(res => res.json())
            ]);

            this.translations = {
                en: enTranslations,
                ar: arTranslations
            };
        } catch (error) {
            console.error('Failed to load translations:', error);
            throw error;
        }
    }

    /**
     * Get browser language preference
     */
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ar') ? 'ar' : 'en';
    }

    /**
     * Set the current language
     */
    async setLanguage(language) {
        if (!this.translations[language]) {
            console.error(`Language '${language}' not supported`);
            return false;
        }

        try {
            // Update current language
            this.currentLanguage = language;
            
            // Save to localStorage
            localStorage.setItem('marln-language', language);
            
            // Update HTML attributes
            document.documentElement.lang = language;
            document.documentElement.dir = this.translations[language].meta.direction;
            
            // Apply translations
            this.applyTranslations();
            
            // Notify observers
            this.notifyObservers();
            
            console.log(`Language changed to: ${language}`);
            return true;
        } catch (error) {
            console.error(`Failed to set language to ${language}:`, error);
            return false;
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get translation for a key
     */
    get(key, defaultValue = '') {
        if (!this.initialized) {
            return defaultValue;
        }

        try {
            const keys = key.split('.');
            let value = this.translations[this.currentLanguage];
            
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    return defaultValue;
                }
            }
            
            return value || defaultValue;
        } catch (error) {
            console.error(`Translation key error for '${key}':`, error);
            return defaultValue;
        }
    }

    /**
     * Apply translations to the DOM
     */
    applyTranslations() {
        if (!this.initialized) return;

        // Update header navigation
        this.updateHeaderNavigation();
        
        // Update dropdown menus
        this.updateDropdownMenus();
        
        // Update hero section
        this.updateHeroSection();
        
        // Update statistics section
        this.updateStatisticsSection();
        
        // Update clients section
        this.updateClientsSection();
        
        // Update services section
        this.updateServicesSection();
        
        // Update CTA section
        this.updateCTASection();
        
        // Update agile approach section
        this.updateAgileSection();
        
        // Update products section
        this.updateProductsSection();
        
        // Update contact section
        this.updateContactSection();
        
        // Update footer
        this.updateFooter();
    }

    /**
     * Update header navigation
     */
    updateHeaderNavigation() {
        const selectors = {
            'header.about': '[href*="about-us"]',
            'header.services': 'li:has(.sub-menu.services-dropdown) > a',
            'header.company': 'li:has(.sub-menu.company-dropdown) > a',
            'header.contact': '[href*="#contact"]'
        };

        Object.entries(selectors).forEach(([key, selector]) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = this.get(key);
            }
        });
    }

    /**
     * Update dropdown menus
     */
    updateDropdownMenus() {
        // Services dropdown
        const servicesDropdown = document.querySelector('.services-dropdown');
        if (servicesDropdown) {
            const aiConsulting = servicesDropdown.querySelector('a[href*="ai-powered-consulting"]');
            const engineering = servicesDropdown.querySelector('a[href*="engineering-services"]');
            const dataAnalytics = servicesDropdown.querySelector('a[href*="data-analytics"]');
            const corporateTraining = servicesDropdown.querySelector('a[href*="a1siliconvalley"]');

            if (aiConsulting) aiConsulting.textContent = this.get('dropdown.services.aiConsulting');
            if (engineering) engineering.textContent = this.get('dropdown.services.engineering');
            if (dataAnalytics) dataAnalytics.textContent = this.get('dropdown.services.dataAnalytics');
            if (corporateTraining) corporateTraining.textContent = this.get('dropdown.services.corporateTraining');
        }

        // Company dropdown
        const companyDropdown = document.querySelector('.company-dropdown');
        if (companyDropdown) {
            const profile = companyDropdown.querySelector('a[href*="marln-company-profile"]');
            const csr = companyDropdown.querySelector('a[href*="corporate-social-responsibility"]');
            const partners = companyDropdown.querySelector('a[href*="technology-partners"]');
            const industry = companyDropdown.querySelector('a[href*="industry"]');

            if (profile) profile.textContent = this.get('dropdown.company.profile');
            if (csr) csr.textContent = this.get('dropdown.company.csr');
            if (partners) partners.textContent = this.get('dropdown.company.partners');
            if (industry) industry.textContent = this.get('dropdown.company.industry');
        }
    }

    /**
     * Update hero section
     */
    updateHeroSection() {
        // This would need to be implemented based on the actual HTML structure
        // For now, we'll use a generic approach
        const heroTitle = document.querySelector('h1, .hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle, p:contains("Meet Nexushive CRM")');
        
        if (heroTitle) heroTitle.textContent = this.get('hero.title');
        if (heroSubtitle) heroSubtitle.textContent = this.get('hero.subtitle');
    }

    /**
     * Update statistics section
     */
    updateStatisticsSection() {
        const statsSection = document.querySelector('.rr-statistics-section');
        if (!statsSection) return;

        const stats = [
            { key: 'stats.countries', selector: '.rr-why-hire-valmax-section--statistic__block--title' },
            { key: 'stats.deployments', selector: '.rr-why-hire-valmax-section--statistic__block--title' },
            { key: 'stats.certifications', selector: '.rr-why-hire-valmax-section--statistic__block--title' },
            { key: 'stats.experts', selector: '.rr-why-hire-valmax-section--statistic__block--title' }
        ];

        stats.forEach((stat, index) => {
            const element = statsSection.querySelectorAll(stat.selector)[index];
            if (element) {
                element.textContent = this.get(stat.key + '.title');
            }
        });
    }

    /**
     * Update clients section
     */
    updateClientsSection() {
        const clientsSection = document.querySelector('.why-our-clients');
        if (!clientsSection) return;

        const title = clientsSection.querySelector('.section-header .heading');
        if (title) title.textContent = this.get('clients.title');

        // Update individual client items
        const clientItems = clientsSection.querySelectorAll('.why-our-clients-item');
        const clientKeys = ['startups', 'smvs', 'corporates', 'government'];

        clientItems.forEach((item, index) => {
            const key = clientKeys[index];
            if (key) {
                const titleEl = item.querySelector('.cf-title');
                const descEl = item.querySelector('.why-our-clients-item-text p');
                
                if (titleEl) titleEl.textContent = this.get(`clients.${key}.title`);
                if (descEl) descEl.textContent = this.get(`clients.${key}.description`);
            }
        });
    }

    /**
     * Update services section
     */
    updateServicesSection() {
        const servicesSection = document.querySelector('.ap-how-we-do-section');
        if (!servicesSection) return;

        const title = servicesSection.querySelector('.section-header .heading');
        if (title) title.textContent = this.get('services.title');

        // Update individual service items
        const serviceItems = servicesSection.querySelectorAll('.ap-how-we-do-section--item');
        const serviceKeys = ['businessProcess', 'customization', 'deployment', 'support'];

        serviceItems.forEach((item, index) => {
            const key = serviceKeys[index];
            if (key) {
                const titleEl = item.querySelector('.heading');
                const descEl = item.querySelector('.txt p, .txt-lg p');
                
                if (titleEl) titleEl.textContent = this.get(`services.${key}.title`);
                if (descEl) descEl.textContent = this.get(`services.${key}.description`);
            }
        });
    }

    /**
     * Update CTA section
     */
    updateCTASection() {
        const ctaSection = document.querySelector('.cta-form');
        if (!ctaSection) return;

        const title = ctaSection.querySelector('.heading');
        const description = ctaSection.querySelector('.txt p');
        
        if (title) {
            title.innerHTML = this.get('cta.title') + '<span>' + this.get('cta.subtitle') + '</span>';
        }
        if (description) description.textContent = this.get('cta.description');
    }

    /**
     * Update agile approach section
     */
    updateAgileSection() {
        const agileSection = document.querySelector('.brand-identity-process');
        if (!agileSection) return;

        const title = agileSection.querySelector('.section-header .heading');
        if (title) title.textContent = this.get('agile.title');

        // Update individual agile steps
        const agileItems = agileSection.querySelectorAll('.brand-identity-process--list li');
        const agileKeys = ['discovery', 'design', 'development', 'mvp', 'production'];

        agileItems.forEach((item, index) => {
            const key = agileKeys[index];
            if (key) {
                const titleEl = item.querySelector('h3');
                const descEl = item.querySelector('.txt p');
                
                if (titleEl) {
                    // Preserve the number span
                    const numSpan = titleEl.querySelector('span');
                    if (numSpan) {
                        titleEl.innerHTML = numSpan.outerHTML + ' ' + this.get(`agile.${key}.title`);
                    } else {
                        titleEl.textContent = this.get(`agile.${key}.title`);
                    }
                }
                if (descEl) descEl.textContent = this.get(`agile.${key}.description`);
            }
        });
    }

    /**
     * Update products section
     */
    updateProductsSection() {
        const productsSection = document.querySelector('.featured-projects-section');
        if (!productsSection) return;

        const title = productsSection.querySelector('.section-header .heading');
        const viewAllBtn = productsSection.querySelector('.section-header--col--btn a');
        
        if (title) title.textContent = this.get('products.title');
        if (viewAllBtn) viewAllBtn.textContent = this.get('products.viewAll');
    }

    /**
     * Update contact section
     */
    updateContactSection() {
        const contactSection = document.querySelector('.contact-us');
        if (!contactSection) return;

        const title = contactSection.querySelector('.contact-us--form--title');
        if (title) title.textContent = this.get('contact.title');

        // Update form placeholders
        const nameInput = contactSection.querySelector('input[name="your-name"]');
        const emailInput = contactSection.querySelector('input[name="your-email"]');
        const messageInput = contactSection.querySelector('textarea[name="your-message"]');
        const submitBtn = contactSection.querySelector('input[type="submit"]');

        if (nameInput) nameInput.placeholder = this.get('contact.form.name');
        if (emailInput) emailInput.placeholder = this.get('contact.form.email');
        if (messageInput) messageInput.placeholder = this.get('contact.form.message');
        if (submitBtn) submitBtn.value = this.get('contact.form.send');
    }

    /**
     * Update footer
     */
    updateFooter() {
        // This would need to be implemented based on the actual footer structure
        const footer = document.querySelector('footer');
        if (footer) {
            const copyright = footer.querySelector('.copyright');
            if (copyright) copyright.textContent = this.get('footer.copyright');
        }
    }

    /**
     * Add observer for language changes
     */
    addObserver(callback) {
        this.observers.push(callback);
    }

    /**
     * Remove observer
     */
    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    /**
     * Notify all observers
     */
    notifyObservers() {
        this.observers.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (error) {
                console.error('Observer callback error:', error);
            }
        });
    }

    /**
     * Toggle between languages
     */
    async toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
        return await this.setLanguage(newLang);
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    /**
     * Check if system is ready
     */
    isReady() {
        return this.initialized;
    }
}

// Create global instance
window.marlnLocalization = new MarlnLocalization();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarlnLocalization;
} 