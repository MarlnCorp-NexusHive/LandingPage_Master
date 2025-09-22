/**
 * LMS University JavaScript - SEO Optimized & Accessible
 * Handles interactive functionality, accessibility, and performance optimization
 */

(function() {
    'use strict';
    
    // DOM Elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.querySelector('.lang-dropdown');
    const dropdownMenus = document.querySelectorAll('.dropdown');
    const skipLink = document.querySelector('.skip-link');
    
    // State Management
    let isMobileMenuOpen = false;
    let isLangDropdownOpen = false;
    let currentLang = 'en';
    
    // Initialize on DOM Content Loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
        setupEventListeners();
        setupAccessibility();
        setupPerformanceOptimizations();
    });
    
    /**
     * Initialize the application
     */
    function initializeApp() {
        // Set initial ARIA states
        updateAriaStates();
        
        // Initialize language from localStorage or browser preference
        initializeLanguage();
        
        // Setup smooth scrolling for anchor links
        setupSmoothScrolling();
        
        // Initialize lazy loading for images
        initializeLazyLoading();
        
        // Setup intersection observer for animations
        setupScrollAnimations();
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }
        
        // Language toggle
        if (langToggle) {
            langToggle.addEventListener('click', toggleLanguageDropdown);
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', handleOutsideClick);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Window resize
        window.addEventListener('resize', handleWindowResize);
        
        // Scroll events for header
        window.addEventListener('scroll', handleScroll);
        
        // Form submissions
        document.addEventListener('submit', handleFormSubmission);
    }
    
    /**
     * Setup accessibility features
     */
    function setupAccessibility() {
        // Skip link functionality
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Focus management for dropdowns
        setupFocusManagement();
        
        // ARIA live regions for dynamic content
        setupLiveRegions();
        
        // High contrast mode detection
        setupHighContrastMode();
    }
    
    /**
     * Setup performance optimizations
     */
    function setupPerformanceOptimizations() {
        // Preload critical resources
        preloadCriticalResources();
        
        // Setup service worker if available
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
        
        // Optimize images
        optimizeImages();
        
        // Setup analytics (if needed)
        setupAnalytics();
    }
    
    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
        
        if (isMobileMenuOpen) {
            mainNav.classList.add('mobile-menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileMenuToggle.setAttribute('aria-label', 'Close mobile menu');
            
            // Focus first menu item
            const firstMenuItem = mainNav.querySelector('a');
            if (firstMenuItem) {
                firstMenuItem.focus();
            }
        } else {
            mainNav.classList.remove('mobile-menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Open mobile menu');
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    }
    
    /**
     * Toggle language dropdown
     */
    function toggleLanguageDropdown() {
        isLangDropdownOpen = !isLangDropdownOpen;
        
        if (isLangDropdownOpen) {
            langDropdown.style.display = 'block';
            langToggle.setAttribute('aria-expanded', 'true');
        } else {
            langDropdown.style.display = 'none';
            langToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    /**
     * Handle clicks outside dropdowns
     */
    function handleOutsideClick(event) {
        // Close mobile menu
        if (isMobileMenuOpen && !mainNav.contains(event.target)) {
            toggleMobileMenu();
        }
        
        // Close language dropdown
        if (isLangDropdownOpen && !langToggle.contains(event.target)) {
            toggleLanguageDropdown();
        }
        
        // Close other dropdowns
        dropdownMenus.forEach(dropdown => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu && !dropdown.contains(event.target)) {
                dropdownMenu.style.display = 'none';
                dropdown.querySelector('a').setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    /**
     * Handle keyboard navigation
     */
    function handleKeyboardNavigation(event) {
        // ESC key closes all dropdowns
        if (event.key === 'Escape') {
            if (isMobileMenuOpen) {
                toggleMobileMenu();
            }
            if (isLangDropdownOpen) {
                toggleLanguageDropdown();
            }
        }
        
        // Tab navigation for dropdowns
        if (event.key === 'Tab') {
            handleTabNavigation(event);
        }
        
        // Arrow keys for dropdown navigation
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            handleArrowNavigation(event);
        }
    }
    
    /**
     * Handle tab navigation
     */
    function handleTabNavigation(event) {
        const activeElement = document.activeElement;
        
        // Check if we're in a dropdown
        const dropdown = activeElement.closest('.dropdown');
        if (dropdown) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu && dropdownMenu.style.display !== 'none') {
                const focusableElements = dropdownMenu.querySelectorAll('a');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey && activeElement === firstElement) {
                    event.preventDefault();
                    dropdown.querySelector('a').focus();
                } else if (!event.shiftKey && activeElement === lastElement) {
                    event.preventDefault();
                    // Focus next element after dropdown
                    const nextElement = dropdown.nextElementSibling;
                    if (nextElement) {
                        nextElement.focus();
                    }
                }
            }
        }
    }
    
    /**
     * Handle arrow key navigation
     */
    function handleArrowNavigation(event) {
        const activeElement = document.activeElement;
        const dropdown = activeElement.closest('.dropdown');
        
        if (dropdown) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (dropdownMenu && dropdownMenu.style.display !== 'none') {
                const focusableElements = Array.from(dropdownMenu.querySelectorAll('a'));
                const currentIndex = focusableElements.indexOf(activeElement);
                
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    const nextIndex = (currentIndex + 1) % focusableElements.length;
                    focusableElements[nextIndex].focus();
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
                    focusableElements[prevIndex].focus();
                }
            }
        }
    }
    
    /**
     * Handle window resize
     */
    function handleWindowResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && isMobileMenuOpen) {
            toggleMobileMenu();
        }
        
        // Update responsive images
        updateResponsiveImages();
    }
    
    /**
     * Handle scroll events
     */
    function handleScroll() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update progress indicator if exists
        updateScrollProgress();
    }
    
    /**
     * Handle form submissions
     */
    function handleFormSubmission(event) {
        const form = event.target;
        
        if (form.tagName === 'FORM') {
            // Add loading state
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
            
            // Validate form
            if (!validateForm(form)) {
                event.preventDefault();
                showNotification('Please fill in all required fields.', 'error');
            }
        }
    }
    
    /**
     * Initialize language
     */
    function initializeLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang) {
            currentLang = savedLang;
        } else {
            // Check browser language
            const browserLang = navigator.language.split('-')[0];
            currentLang = ['ar', 'en'].includes(browserLang) ? browserLang : 'en';
        }
        
        updateLanguage(currentLang);
    }
    
    /**
     * Update language
     */
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        
        // Update document language
        document.documentElement.lang = lang === 'ar' ? 'ar-SA' : 'en-SA';
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update language toggle text
        const currentLangSpan = document.querySelector('.current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = lang.toUpperCase();
        }
        
        // Update content (if you have translation system)
        updateTranslatedContent(lang);
    }
    
    /**
     * Update translated content
     */
    function updateTranslatedContent(lang) {
        // This would integrate with your translation system
        // For now, we'll just update the document direction
        const body = document.body;
        if (lang === 'ar') {
            body.classList.add('rtl');
        } else {
            body.classList.remove('rtl');
        }
    }
    
    /**
     * Setup smooth scrolling
     */
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    /**
     * Initialize lazy loading
     */
    function initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    /**
     * Setup scroll animations
     */
    function setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            const animatedElements = document.querySelectorAll('.feature-card, .tip-card, .hosting-feature');
            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }
    
    /**
     * Setup focus management
     */
    function setupFocusManagement() {
        // Trap focus in mobile menu when open
        document.addEventListener('keydown', function(e) {
            if (isMobileMenuOpen && e.key === 'Tab') {
                const focusableElements = mainNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    /**
     * Setup live regions
     */
    function setupLiveRegions() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }
    
    /**
     * Setup high contrast mode
     */
    function setupHighContrastMode() {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
        
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    }
    
    /**
     * Preload critical resources
     */
    function preloadCriticalResources() {
        const criticalImages = [
            'images/marlncorplight.svg',
            'images/lms-university-hero-saudi-arabia.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    /**
     * Optimize images
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading attribute for lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding attribute for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }
    
    /**
     * Setup analytics
     */
    function setupAnalytics() {
        // Google Analytics or other analytics setup would go here
        // This is a placeholder for analytics implementation
    }
    
    /**
     * Update ARIA states
     */
    function updateAriaStates() {
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Open mobile menu');
        }
        
        if (langToggle) {
            langToggle.setAttribute('aria-expanded', 'false');
        }
        
        dropdownMenus.forEach(dropdown => {
            const trigger = dropdown.querySelector('a[aria-haspopup]');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    /**
     * Update responsive images
     */
    function updateResponsiveImages() {
        const images = document.querySelectorAll('img[data-srcset]');
        
        images.forEach(img => {
            const srcset = img.dataset.srcset;
            if (srcset) {
                img.srcset = srcset;
            }
        });
    }
    
    /**
     * Update scroll progress
     */
    function updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    }
    
    /**
     * Validate form
     */
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
        
        // Create visual notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Expose functions for external use
    window.LMSUniversity = {
        toggleMobileMenu,
        toggleLanguageDropdown,
        updateLanguage,
        showNotification
    };
    
})();
