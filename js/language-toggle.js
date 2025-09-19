/**
 * Language Toggle Component
 * A simple, clean language toggle for the Marln website
 */

class LanguageToggle {
    constructor(container, localization) {
        this.container = container;
        this.localization = localization;
        this.currentLanguage = 'en';
        
        this.init();
    }

    /**
     * Initialize the language toggle
     */
    init() {
        // Wait for localization to be ready
        if (this.localization.isReady()) {
            this.createToggle();
        } else {
            this.localization.addObserver(() => {
                if (this.localization.isReady()) {
                    this.createToggle();
                }
            });
        }
    }

    /**
     * Create the language toggle HTML
     */
    createToggle() {
        if (this.container.querySelector('.language-toggle')) {
            return; // Already created
        }

        this.currentLanguage = this.localization.getCurrentLanguage();
        
        const toggleHTML = `
            <div class="language-toggle">
                <button class="lang-btn" data-lang="en" aria-label="Switch to English">
                    <span class="lang-text">EN</span>
                </button>
                <button class="lang-btn" data-lang="ar" aria-label="Switch to Arabic">
                    <span class="lang-text">عربي</span>
                </button>
                <div class="toggle-slider"></div>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', toggleHTML);
        this.setupEventListeners();
        this.updateToggleState();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const toggle = this.container.querySelector('.language-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', (e) => {
            const langBtn = e.target.closest('.lang-btn');
            if (langBtn) {
                const newLang = langBtn.dataset.lang;
                this.switchLanguage(newLang);
            }
        });

        // Update toggle when language changes externally
        this.localization.addObserver((language) => {
            this.currentLanguage = language;
            this.updateToggleState();
        });
    }

    /**
     * Switch language
     */
    async switchLanguage(newLang) {
        if (newLang === this.currentLanguage) return;

        try {
            const success = await this.localization.setLanguage(newLang);
            if (success) {
                this.currentLanguage = newLang;
                this.updateToggleState();
                
                // Add animation effect
                this.addSwitchAnimation();
            }
        } catch (error) {
            console.error('Failed to switch language:', error);
        }
    }

    /**
     * Update toggle visual state
     */
    updateToggleState() {
        const toggle = this.container.querySelector('.language-toggle');
        if (!toggle) return;

        const slider = toggle.querySelector('.toggle-slider');
        const enBtn = toggle.querySelector('[data-lang="en"]');
        const arBtn = toggle.querySelector('[data-lang="ar"]');

        if (this.currentLanguage === 'ar') {
            slider.style.transform = 'translateX(100%)';
            enBtn.classList.remove('active');
            arBtn.classList.add('active');
        } else {
            slider.style.transform = 'translateX(0)';
            enBtn.classList.add('active');
            arBtn.classList.remove('active');
        }
    }

    /**
     * Add switch animation
     */
    addSwitchAnimation() {
        const toggle = this.container.querySelector('.language-toggle');
        if (!toggle) return;

        toggle.classList.add('switching');
        setTimeout(() => {
            toggle.classList.remove('switching');
        }, 300);
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Destroy the toggle
     */
    destroy() {
        const toggle = this.container.querySelector('.language-toggle');
        if (toggle) {
            toggle.remove();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for localization to be available
    const initToggle = () => {
        if (window.marlnLocalization && window.marlnLocalization.isReady()) {
            // Find header menu container
            const headerMenu = document.querySelector('.header--menu__list');
            if (headerMenu) {
                // Create language toggle container
                const toggleContainer = document.createElement('li');
                toggleContainer.className = 'menu-item menu-item-lang';
                
                // Insert before the last item (usually theme toggle)
                const lastItem = headerMenu.lastElementChild;
                if (lastItem) {
                    headerMenu.insertBefore(toggleContainer, lastItem);
                } else {
                    headerMenu.appendChild(toggleContainer);
                }
                
                // Initialize language toggle
                new LanguageToggle(toggleContainer, window.marlnLocalization);
            }
        } else {
            // Retry after a short delay
            setTimeout(initToggle, 100);
        }
    };

    initToggle();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageToggle;
} 