// Contact Popup Management
class ContactPopup {
    constructor() {
        this.modal = document.getElementById('contact-popup-modal');
        this.closeBtn = document.getElementById('contact-popup-close');
        this.contactBtn = document.getElementById('contact-btn');
        this.signInBtn = document.querySelector('.nav-signin');
        
        this.init();
    }
    
    init() {
        if (this.contactBtn) {
            this.contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPopup();
            });
        }
        
        if (this.signInBtn) {
            this.signInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPopup();
            });
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hidePopup();
            });
        }
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hidePopup();
                }
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
                this.hidePopup();
            }
        });
    }
    
    showPopup() {
        if (this.modal) {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    hidePopup() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// Language and Theme Management
class AppState {
    constructor() {
        this.language = localStorage.getItem('language') || 'en';
        this.theme = localStorage.getItem('theme') || 'light';
        this.mounted = false;
        
        this.init();
    }
    
    init() {
        this.setLanguage(this.language);
        this.setTheme(this.theme);
        this.mounted = true;
    }
    
    setLanguage(lang) {
        if (lang === 'en' || lang === 'ar') {
            this.language = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            document.documentElement.dir = 'ltr'; // Keep LTR for both languages
            this.updateLanguageContent();
        }
    }
    
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.theme = theme;
            localStorage.setItem('theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeContent();
        }
    }
    
    toggleLanguage() {
        this.setLanguage(this.language === 'en' ? 'ar' : 'en');
    }
    
    toggleTheme() {
        this.setTheme(this.theme === 'light' ? 'dark' : 'light');
    }
    
    updateLanguageContent() {
        // Update all elements with data-en and data-ar attributes
        const elements = document.querySelectorAll('[data-en], [data-ar]');
        elements.forEach(element => {
            const enText = element.getAttribute('data-en');
            const arText = element.getAttribute('data-ar');
            
            if (enText && arText) {
                element.innerHTML = this.language === 'ar' ? arText : enText;
            }
        });
        
        // Update language toggle button
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            const flag = languageToggle.querySelector('.language-flag');
            const text = languageToggle.querySelector('.language-text');
            const icon = languageToggle.querySelector('.language-icon');
            
            if (flag) {
                flag.textContent = this.language === 'ar' ? 'ع' : 'EN';
            }
            if (text) {
                text.textContent = this.language === 'ar' ? 'العربية' : 'English';
            }
            if (languageToggle) {
                languageToggle.setAttribute('aria-label', 
                    this.language === 'ar' ? 'Switch to English' : 'Switch to Arabic'
                );
            }
        }
        
        // Update hero image for both languages
        const heroImg = document.getElementById('hero-img');
        if (heroImg) {
            heroImg.src = 'images/tablet-mockup.png';
        }
    }
    
    updateThemeContent() {
        // Update logo based on theme
        const logoImg = document.getElementById('logo-img');
        if (logoImg) {
            logoImg.src = this.theme === 'dark' ? 'images/marlncorpdark.svg' : 'images/marlncorplight.svg';
        }
        
        // Update theme toggle emoji
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const emoji = themeToggle.querySelector('.theme-emoji');
            
            if (emoji) {
                emoji.textContent = this.theme === 'dark' ? '☀️' : '🌙';
            }
            
            themeToggle.setAttribute('aria-label', 
                this.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }
}

// Navigation Management
class Navigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        const icon = this.navToggle.querySelector('.nav-toggle-icon');
        if (icon) {
            icon.setAttribute('icon', this.navMenu.classList.contains('active') ? 'tabler:x' : 'tabler:menu-2');
        }
        this.navToggle.setAttribute('aria-label', 
            this.navMenu.classList.contains('active') ? 'Close menu' : 'Open menu'
        );
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        const icon = this.navToggle.querySelector('.nav-toggle-icon');
        if (icon) {
            icon.setAttribute('icon', 'tabler:menu-2');
        }
        this.navToggle.setAttribute('aria-label', 'Open menu');
    }
}

// Accordion Management
class Accordion {
    constructor() {
        this.accordionItems = document.querySelectorAll('.accordion-item');
        this.init();
    }
    
    init() {
        this.accordionItems.forEach(item => {
            const trigger = item.querySelector('.accordion-trigger');
            const content = item.querySelector('.accordion-content');
            
            if (trigger && content) {
                trigger.addEventListener('click', () => this.toggleItem(item, trigger, content));
            }
        });
    }
    
    toggleItem(item, trigger, content) {
        const isOpen = content.classList.contains('active');
        
        // Close all other items
        this.accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherTrigger = otherItem.querySelector('.accordion-trigger');
                const otherContent = otherItem.querySelector('.accordion-content');
                if (otherTrigger && otherContent) {
                    otherContent.classList.remove('active');
                    otherTrigger.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        // Toggle current item
        if (isOpen) {
            content.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
        } else {
            content.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
        }
    }
}

// Modal Management
class Modal {
    constructor() {
        this.contactModal = document.getElementById('contact-modal');
        this.termsModal = document.getElementById('terms-modal');
        this.contactBtn = document.getElementById('contact-btn');
        this.termsBtn = document.getElementById('terms-btn');
        this.contactModalClose = document.getElementById('contact-modal-close');
        this.termsModalClose = document.getElementById('terms-modal-close');
        
        this.init();
    }
    
    init() {
        // Contact modal
        if (this.contactBtn && this.contactModal) {
            this.contactBtn.addEventListener('click', () => this.openModal(this.contactModal));
        }
        
        if (this.contactModalClose && this.contactModal) {
            this.contactModalClose.addEventListener('click', () => this.closeModal(this.contactModal));
        }
        
        // Terms modal
        if (this.termsBtn && this.termsModal) {
            this.termsBtn.addEventListener('click', () => this.openModal(this.termsModal));
        }
        
        if (this.termsModalClose && this.termsModal) {
            this.termsModalClose.addEventListener('click', () => this.closeModal(this.termsModal));
        }
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.active');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }
    
    openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}


// Smooth Scrolling
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// Form Handling
class FormHandler {
    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = {
            name: formData.get('name') || document.getElementById('contact-name').value,
            email: formData.get('email') || document.getElementById('contact-email').value,
            message: formData.get('message') || document.getElementById('contact-message').value
        };
        
        // Here you would typically send the data to a server
        console.log('Contact form submitted:', data);
        
        // Show success message (you can customize this)
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        this.contactForm.reset();
        
        // Close modal
        const modal = document.getElementById('contact-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Intersection Observer for animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .large-feature, .accordion-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    window.appState = new AppState();
    window.contactPopup = new ContactPopup();
    window.navigation = new Navigation();
    window.accordion = new Accordion();
    window.modal = new Modal();
    window.smoothScroll = new SmoothScroll();
    window.formHandler = new FormHandler();
    window.scrollAnimations = new ScrollAnimations();
    
    // Set up event listeners for language and theme toggles
    const languageToggle = document.getElementById('language-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            window.appState.toggleLanguage();
        });
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            window.appState.toggleTheme();
        });
    }
    
    // Add scroll effect to header
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth >= 768 && window.navigation) {
        window.navigation.closeMenu();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        document.title = '👋 Come back to MARLN CRM Corporate';
    } else {
        // Page is visible
        document.title = 'MARLN CRM Corporate';
    }
});

// Service Worker registration (if you want to add PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can add a service worker here if needed
        console.log('Service Worker support detected');
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        Navigation,
        Accordion,
        Modal,
        SmoothScroll,
        FormHandler,
        ScrollAnimations
    };
}
