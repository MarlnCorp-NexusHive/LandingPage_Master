/**
 * DOM Helper Utilities for Localization
 * Provides common functions for DOM manipulation and localization tasks
 */

export class DOMHelpers {
    /**
     * Find all elements with data-i18n attributes
     * @param {string} selector - Optional CSS selector to limit search
     * @returns {NodeList} Elements with data-i18n attributes
     */
    static findLocalizableElements(selector = '') {
        const baseSelector = selector || 'body';
        return document.querySelectorAll(`${baseSelector} [data-i18n]`);
    }

    /**
     * Find elements with specific data-i18n key
     * @param {string} key - The data-i18n key to search for
     * @param {string} selector - Optional CSS selector to limit search
     * @returns {NodeList} Elements with matching data-i18n key
     */
    static findElementsByKey(key, selector = '') {
        const baseSelector = selector || 'body';
        return document.querySelectorAll(`${baseSelector} [data-i18n="${key}"]`);
    }

    /**
     * Update element text content with translation
     * @param {Element} element - DOM element to update
     * @param {string} translation - Translated text
     * @param {boolean} preserveHTML - Whether to preserve HTML content
     */
    static updateElementText(element, translation, preserveHTML = false) {
        if (!element || !translation) return;

        if (preserveHTML) {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    }

    /**
     * Update element placeholder attribute
     * @param {Element} element - DOM element to update
     * @param {string} translation - Translated placeholder text
     */
    static updateElementPlaceholder(element, translation) {
        if (!element || !translation) return;
        
        if (element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', translation);
        }
    }

    /**
     * Update element title attribute
     * @param {Element} element - DOM element to update
     * @param {string} translation - Translated title text
     */
    static updateElementTitle(element, translation) {
        if (!element || !translation) return;
        
        if (element.hasAttribute('title')) {
            element.setAttribute('title', translation);
        }
    }

    /**
     * Update element alt attribute
     * @param {Element} element - DOM element to update
     * @param {string} translation - Translated alt text
     */
    static updateElementAlt(element, translation) {
        if (!element || !translation) return;
        
        if (element.hasAttribute('alt')) {
            element.setAttribute('alt', translation);
        }
    }

    /**
     * Update form element labels
     * @param {Element} element - Form element
     * @param {string} translation - Translated label text
     */
    static updateFormLabel(element, translation) {
        if (!element || !translation) return;

        // Find associated label
        const id = element.id;
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) {
                label.textContent = translation;
            }
        }

        // Update aria-label if present
        if (element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', translation);
        }
    }

    /**
     * Update element with all possible localization attributes
     * @param {Element} element - DOM element to update
     * @param {Object} translations - Object containing all translations for the element
     */
    static updateElementCompletely(element, translations) {
        if (!element || !translations) return;

        // Update text content
        if (translations.text) {
            this.updateElementText(element, translations.text, translations.preserveHTML);
        }

        // Update placeholder
        if (translations.placeholder) {
            this.updateElementPlaceholder(element, translations.placeholder);
        }

        // Update title
        if (translations.title) {
            this.updateElementTitle(element, translations.title);
        }

        // Update alt
        if (translations.alt) {
            this.updateElementAlt(element, translations.alt);
        }

        // Update form label
        if (translations.label) {
            this.updateFormLabel(element, translations.label);
        }
    }

    /**
     * Batch update multiple elements
     * @param {Array} updates - Array of {element, translation, preserveHTML} objects
     */
    static batchUpdate(updates) {
        updates.forEach(({ element, translation, preserveHTML = false }) => {
            this.updateElementText(element, translation, preserveHTML);
        });
    }

    /**
     * Create a debounced function for performance
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Check if element is visible in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} Whether element is visible
     */
    static isElementVisible(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Add loading state to element
     * @param {Element} element - Element to add loading state to
     * @param {string} loadingText - Text to show while loading
     */
    static addLoadingState(element, loadingText = 'Loading...') {
        if (!element) return;

        element.setAttribute('data-loading', 'true');
        element.setAttribute('data-original-text', element.textContent);
        element.textContent = loadingText;
        element.style.opacity = '0.7';
        element.style.pointerEvents = 'none';
    }

    /**
     * Remove loading state from element
     * @param {Element} element - Element to remove loading state from
     */
    static removeLoadingState(element) {
        if (!element) return;

        element.removeAttribute('data-loading');
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
            element.removeAttribute('data-original-text');
        }
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }

    /**
     * Add error state to element
     * @param {Element} element - Element to add error state to
     * @param {string} errorText - Error text to show
     */
    static addErrorState(element, errorText = 'Error') {
        if (!element) return;

        element.setAttribute('data-error', 'true');
        element.setAttribute('data-original-text', element.textContent);
        element.textContent = errorText;
        element.style.color = '#dc3545';
        element.style.borderColor = '#dc3545';
    }

    /**
     * Remove error state from element
     * @param {Element} element - Element to remove error state from
     */
    static removeErrorState(element) {
        if (!element) return;

        element.removeAttribute('data-error');
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
            element.removeAttribute('data-original-text');
        }
        element.style.color = '';
        element.style.borderColor = '';
    }

    /**
     * Get computed style value
     * @param {Element} element - Element to get style from
     * @param {string} property - CSS property name
     * @returns {string} Computed style value
     */
    static getComputedStyle(element, property) {
        if (!element) return '';
        return window.getComputedStyle(element).getPropertyValue(property);
    }

    /**
     * Set CSS custom property
     * @param {Element} element - Element to set property on
     * @param {string} property - CSS custom property name
     * @param {string} value - Property value
     */
    static setCSSProperty(element, property, value) {
        if (!element) return;
        element.style.setProperty(property, value);
    }

    /**
     * Add CSS class with transition
     * @param {Element} element - Element to add class to
     * @param {string} className - Class name to add
     * @param {number} duration - Transition duration in milliseconds
     */
    static addClassWithTransition(element, className, duration = 300) {
        if (!element) return;

        element.style.transition = `all ${duration}ms ease-in-out`;
        element.classList.add(className);
        
        // Remove transition after animation completes
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    /**
     * Remove CSS class with transition
     * @param {Element} element - Element to remove class from
     * @param {string} className - Class name to remove
     * @param {number} duration - Transition duration in milliseconds
     */
    static removeClassWithTransition(element, className, duration = 300) {
        if (!element) return;

        element.style.transition = `all ${duration}ms ease-in-out`;
        element.classList.remove(className);
        
        // Remove transition after animation completes
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }
}

export default DOMHelpers; 