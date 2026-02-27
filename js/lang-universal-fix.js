// Universal Arabic Language System Fix
// This script ensures Arabic language works on ALL hosting platforms

(function() {
    'use strict';
    
    const DEFAULT_LANG = 'en';
    const SUPPORTED_RTL = new Set(['ar']);
    const CACHE = {};
    
    console.log('🌍 Universal Arabic Language System: Initializing...');
    
    // Enhanced error handling for all hosting environments
    function logError(message, error) {
        console.warn('🌍 Language System:', message, error);
    }
    
    // Comprehensive embedded translations for ALL pages
    const EMBEDDED = {
        ar: {
            // Header Navigation
            header: { 
                about: "من نحن", 
                services: "الخدمات", 
                company: "الشركة" 
            },
            
            // Dropdown Menus
            dropdown: {
                services: {
                    aiConsulting: "الاستشارات المدعومة بالذكاء الاصطناعي",
                    engineering: "خدمات الهندسة",
                    dataAnalytics: "تحليل البيانات",
                    corporateTraining: "التدريب المؤسسي"
                },
                company: {
                    profile: "الملف التعريفي لشركة Marln",
                    csr: "المسؤولية الاجتماعية للشركات (CSR)",
                    partners: "الشركاء التقنيون",
                    industry: "الصناعة"
                }
            },
            
            // Common Elements
            common: {
                contactUs: "تواصل معنا",
                scheduleMeeting: "احجز اجتماعاً",
                speakToTeam: "تحدث إلى فريقنا",
                sendMessage: "أرسل الرسالة",
                namePlaceholder: "الاسم*",
                emailPlaceholder: "البريد الإلكتروني*",
                messagePlaceholder: "أخبرنا عن مشروعك",
                ourProducts: "منتجاتنا الذكية",
                yourName: "اسمك",
                yourEmail: "بريدك الإلكتروني",
                companyName: "اسم الشركة",
                tellUsAboutProject: "أخبرنا عن مشروعك"
            },
            
            // Industry Page Specific
            industry: {
                title: "حلول الصناعة",
                automotive: {
                    title: "السيارات",
                    desc: "تتطور صناعة السيارات باستمرار مع ظهور تقنيات جديدة مثل المركبات المستقلة والمركبات الكهربائية وأنظمة المساعدة المتقدمة للسائق (ADAS)."
                },
                banking: {
                    title: "الخدمات المصرفية",
                    desc: "حلول التوظيف التقني المصرفي مكون حاسم في الصناعة المصرفية. تحتاج البنوك إلى الأشخاص المناسبين لتطوير وتنفيذ وصيانة أنظمتها التقنية."
                },
                consumerGoods: {
                    title: "السلع والخدمات الاستهلاكية",
                    desc: "يمكن لشركة Marln Corp مساعدة شركات CGS في العثور على محترفين مؤهلين بهذه المهارات المطلوبة. يمكن لوكالات التوظيف أيضاً توفير خيارات التوظيف المؤقت والعقود."
                },
                communications: {
                    title: "الاتصالات والإعلام",
                    desc: "إنتاج وتحرير الفيديو: مع تزايد الطلب على محتوى الفيديو عبر منصات مختلفة، أصبحت مهارات إنتاج وتحرير الفيديو ذات قيمة متزايدة."
                },
                healthcare: {
                    title: "الرعاية الصحية",
                    desc: "السجلات الصحية الإلكترونية (EHR) وتكنولوجيا المعلومات الصحية (HIT): الكفاءة في أنظمة EHR وأدوات HIT ضرورية لإدارة سجلات المرضى وضمان الامتثال."
                },
                hiTech: {
                    title: "التقنية العالية",
                    desc: "تعتمد شركات التقنية العالية بشكل كبير على المحترفين المهرة ذوي الخبرة في مجالات تقنية مختلفة لتطوير وتنفيذ وصيانة المنتجات والخدمات المبتكرة."
                },
                lifeSciences: {
                    title: "علوم الحياة",
                    desc: "تعتمد شركات علوم الحياة على مجموعة متنوعة من المحترفين المهرة ذوي الخبرة في مجالات تقنية مختلفة لإحراز تقدم في الطب والتكنولوجيا الحيوية."
                },
                publicService: {
                    title: "الخدمة العامة",
                    desc: "القطاع العام يعتمد بشكل متزايد على التكنولوجيا لتحقيق أهدافه، وهذا الطلب على المهارات التقنية سينمو فقط في السنوات القادمة."
                },
                retail: {
                    title: "التجزئة",
                    desc: "تعتمد شركات التجزئة من جميع الأحجام على مجموعة متنوعة من المهارات التقنية: أنظمة نقاط البيع (POS) وإدارة المخزون وإدارة سلسلة التوريد."
                },
                travel: {
                    title: "السفر والسياحة",
                    desc: "تتطور صناعة السفر باستمرار مع ظهور تقنيات جديدة مثل الذكاء الاصطناعي (AI) والتعلم الآلي (ML) وتحليل البيانات."
                },
                government: {
                    title: "الحكومة",
                    desc: "نساعد الوكالات الحكومية على الانتقال إلى السحابة لتمكين مرونة وقابلية توسع أكبر. يمكن لفريقنا مساعدتك في اختيار أفضل حل سحابي لاحتياجاتك."
                },
                utilities: {
                    title: "المرافق",
                    desc: "نساعد شركات المرافق على الانتقال إلى السحابة لتمكين مرونة وقابلية توسع أكبر. يمكن لفريقنا مساعدتك في اختيار أفضل حل سحابي لعملك."
                },
                exploreSolutions: "استكشف الحلول"
            },
            
            // Contact Section
            contact: {
                form: { title: "ابدأ مشروعك الآن" },
                right: { title: "أرسل لنا بريداً إلكترونياً" },
                thank: { title: "أحسنت!", text: "سنتواصل معك خلال الساعات القادمة أو يمكنك حجز موعد الآن." }
            },
            
            // Footer
            footer: { 
                social: "روابط التواصل الاجتماعي", 
                certifications: "الشهادات", 
                officesTitle: "مكاتبنا" 
            },
            
            // Offices
            offices: {
                cupertino: "كوبرتينو، الولايات المتحدة",
                jeddah: "جدة، المملكة العربية السعودية",
                riyadh: "الرياض، المملكة العربية السعودية",
                bangaluru: "بنغالورو، الهند",
                capetown: "كيب تاون، جنوب أفريقيا"
            }
        },
        
        en: {
            // English translations (fallback)
            header: { about: "About us", services: "Services", company: "Company" },
            dropdown: {
                services: {
                    aiConsulting: "AI Powered Consulting",
                    engineering: "Engineering Services",
                    dataAnalytics: "Data Engineering",
                    corporateTraining: "Corporate Training",
                    cybersecurity: "CYBERSECURITY"
                },
                company: {
                    profile: "Marln Company Profile",
                    csr: "Corporate Social Responsibility (CSR)",
                    partners: "Technology Partners",
                    industry: "Industry"
                }
            },
            common: {
                contactUs: "Contact us",
                scheduleMeeting: "Schedule a meeting",
                speakToTeam: "Speak to Our Team",
                sendMessage: "send message",
                namePlaceholder: "Name*",
                emailPlaceholder: "E-mail*",
                messagePlaceholder: "Tell about your project"
            },
            industry: {
                title: "Industry Solutions",
                exploreSolutions: "Explore Solutions"
            },
            contact: {
                form: { title: "Kick Start Your Project Right Now" },
                right: { title: "Send us an email" }
            },
            footer: { social: "Social Links", certifications: "Certifications", officesTitle: "Offices" },
            offices: {
                cupertino: "Cupertino, USA",
                jeddah: "Jeddah, Saudi Arabia",
                riyadh: "Riyadh, Saudi Arabia",
                bangaluru: "Bengaluru, India",
                capetown: "Capetown, South Africa"
            }
        }
    };
    
    // Universal translation loading function
    async function loadTranslations(lang) {
        console.log('🌍 Loading translations for language:', lang);
        
        // PRIORITY 1: Use embedded translations (always works)
        if (EMBEDDED[lang]) {
            console.log('🌍 Using embedded translations for:', lang);
            return EMBEDDED[lang];
        }
        
        // PRIORITY 2: Check cache
        if (CACHE[lang]) {
            console.log('🌍 Using cached translations for:', lang);
            return CACHE[lang];
        }
        
        // PRIORITY 3: Try to load from JSON (fallback only)
        try {
            console.log('🌍 Attempting to load from JSON file for:', lang);
            const res = await fetch(`i18n/${lang}.json`, { 
                cache: 'no-cache',
                headers: { 'Accept': 'application/json' }
            });
            
            if (res.ok) {
                const json = await res.json();
                CACHE[lang] = json;
                console.log('🌍 Successfully loaded JSON translations for:', lang);
                return json;
            }
        } catch (err) {
            logError(`Failed to load JSON translations for ${lang}`, err);
        }
        
        // FINAL FALLBACK: Use embedded translations
        if (EMBEDDED[lang]) {
            console.log(`🌍 Using embedded translations as final fallback for ${lang}`);
            return EMBEDDED[lang];
        }
        
        // LAST RESORT: Default language
        if (lang !== DEFAULT_LANG) {
            console.log(`🌍 Falling back to default language: ${DEFAULT_LANG}`);
            return loadTranslations(DEFAULT_LANG);
        }
        
        console.log('🌍 No translations available, returning empty object');
        return {};
    }
    
    // Set direction and language
    function setDirAndLang(lang) {
        const html = document.documentElement;
        html.lang = lang;
        const isRtl = SUPPORTED_RTL.has(lang);
        html.dir = isRtl ? 'rtl' : 'ltr';
        html.classList.toggle('rtl', isRtl);
        ensureRtlCss(isRtl);
        console.log(`🌍 Set language to: ${lang}, RTL: ${isRtl}`);
    }
    
    // Ensure RTL CSS is loaded
    function ensureRtlCss(isRtl) {
        let link = document.getElementById('rtl-css');
        if (isRtl) {
            if (!link) {
                link = document.createElement('link');
                link.id = 'rtl-css';
                link.rel = 'stylesheet';
                link.href = 'css/rtl.css';
                link.onerror = () => logError('Failed to load RTL CSS');
                document.head.appendChild(link);
                console.log('🌍 RTL CSS loaded');
            }
        } else if (link) {
            link.remove();
            console.log('🌍 RTL CSS removed');
        }
    }
    
    // Update language toggle button
    function setButtonLabelFromLang(lang) {
        const btn = document.querySelector('.menu-item-lang .lang-toggle-button');
        if (btn) { 
            btn.textContent = lang === 'en' ? 'EN' : 'AR';
            btn.setAttribute('data-lang', lang);
            console.log(`🌍 Updated language button to: ${lang}`);
        }
    }
    
    // Get translation value
    function tGet(translations, key) {
        return key.split('.').reduce((acc, part) => 
            (acc && acc[part] != null ? acc[part] : undefined), translations);
    }
    
    // Apply text to DOM elements
    function applyText(selector, translations, key) {
        const val = tGet(translations, key);
        if (typeof val === 'string') {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) el.textContent = val;
            });
        }
    }
    
    // Apply attribute to DOM elements
    function applyAttr(selector, attr, translations, key) {
        const val = tGet(translations, key);
        if (typeof val === 'string') {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) el.setAttribute(attr, val);
            });
        }
    }
    
    // Apply industry page translations
    function applyIndustryTranslations(translations) {
        console.log('🌍 Applying industry page translations');
        
        // Industry title
        applyText('.industry-title span', translations, 'industry.title');
        
        // Industry cards
        const industryCards = document.querySelectorAll('.industry-card');
        industryCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            const button = card.querySelector('.contact-scroll-btn');
            
            if (title && index < 12) {
                const industryKeys = [
                    'automotive', 'banking', 'consumerGoods', 'communications',
                    'healthcare', 'hiTech', 'lifeSciences', 'publicService',
                    'retail', 'travel', 'government', 'utilities'
                ];
                
                if (industryKeys[index]) {
                    applyText(title, translations, `industry.${industryKeys[index]}.title`);
                    applyText(desc, translations, `industry.${industryKeys[index]}.desc`);
                }
            }
            
            if (button) {
                applyText(button, translations, 'industry.exploreSolutions');
            }
        });
    }
    
    // Apply header translations
    function applyHeaderTranslations(translations) {
        console.log('🌍 Applying header translations');
        
        // Header links
        applyText('#header_menu .menu-item-680 a', translations, 'header.about');
        applyText('#header_menu .menu-item-666 > a', translations, 'header.services');
        applyText('#header_menu .menu-item-company > a', translations, 'header.company');
        
        // Dropdown menus
        const servicesDropdown = document.querySelector('.services-dropdown');
        if (servicesDropdown) {
            const servicesItems = servicesDropdown.querySelectorAll('a');
            const serviceKeys = ['aiConsulting', 'engineering', 'dataAnalytics', 'corporateTraining'];
            servicesItems.forEach((item, index) => {
                if (serviceKeys[index]) {
                    applyText(item, translations, `dropdown.services.${serviceKeys[index]}`);
                }
            });
        }
        
        const companyDropdown = document.querySelector('.company-dropdown');
        if (companyDropdown) {
            const companyItems = companyDropdown.querySelectorAll('a');
            const companyKeys = ['profile', 'csr', 'partners', 'industry'];
            companyItems.forEach((item, index) => {
                if (companyKeys[index]) {
                    applyText(item, translations, `dropdown.company.${companyKeys[index]}`);
                }
            });
        }
    }
    
    // Apply contact form translations
    function applyContactTranslations(translations) {
        console.log('🌍 Applying contact form translations');
        
        applyText('.contact-us--form--title', translations, 'contact.form.title');
        applyAttr('input[name="your-name"]', 'placeholder', translations, 'common.namePlaceholder');
        applyAttr('input[name="your-email"]', 'placeholder', translations, 'common.emailPlaceholder');
        applyAttr('textarea[name="your-message"]', 'placeholder', translations, 'common.messagePlaceholder');
        applyAttr('input[type="submit"][value]', 'value', translations, 'common.sendMessage');
        
        applyText('.contact-us--connect .heading', translations, 'contact.right.title');
    }
    
    // Apply footer translations
    function applyFooterTranslations(translations) {
        console.log('🌍 Applying footer translations');
        
        applyText('#footer_menu_4 > li > a', translations, 'footer.social');
        applyText('#footer_menu_5 > li > a', translations, 'footer.certifications');
        applyText('.offices .offices-title', translations, 'footer.officesTitle');
        
        // Office locations
        const officeElements = document.querySelectorAll('.offices-list li .offices-item p');
        if (officeElements.length >= 5) {
            applyText(officeElements[0], translations, 'offices.cupertino');
            applyText(officeElements[1], translations, 'offices.jeddah');
            applyText(officeElements[2], translations, 'offices.riyadh');
            applyText(officeElements[3], translations, 'offices.bangaluru');
            applyText(officeElements[4], translations, 'offices.capetown');
        }
    }
    
    // Main language switching function
    async function setLanguage(lang) {
        try {
            console.log(`🌍 Switching to language: ${lang}`);
            
            // Set direction and language
            setDirAndLang(lang);
            
            // Load translations
            const translations = await loadTranslations(lang);
            
            if (!translations || Object.keys(translations).length === 0) {
                throw new Error('No translations available');
            }
            
            console.log('🌍 Translations loaded successfully:', Object.keys(translations));
            
            // Apply translations based on page type
            if (document.querySelector('main.industry-content')) {
                applyIndustryTranslations(translations);
            }
            
            // Always apply header, contact, and footer translations
            applyHeaderTranslations(translations);
            applyContactTranslations(translations);
            applyFooterTranslations(translations);
            
            // Update button label
            setButtonLabelFromLang(lang);
            
            // Save language preference
            try {
                localStorage.setItem('site-lang', lang);
                console.log('🌍 Language preference saved');
            } catch (error) {
                logError('Failed to save language preference', error);
            }
            
            console.log(`🌍 Language switch completed successfully for: ${lang}`);
            
        } catch (error) {
            logError('setLanguage failed', error);
            console.log('🌍 Falling back to default language');
            setLanguage(DEFAULT_LANG);
        }
    }
    
    // Initialize language toggle button
    function initToggleButton() {
        const toggleBtn = document.querySelector('.menu-item-lang .lang-toggle-button');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const currentLang = this.getAttribute('data-lang') || 'en';
                const newLang = currentLang === 'en' ? 'ar' : 'en';
                console.log(`🌍 Language toggle clicked: ${currentLang} -> ${newLang}`);
                setLanguage(newLang);
            });
            console.log('🌍 Language toggle button initialized');
        } else {
            console.log('🌍 Language toggle button not found');
        }
    }
    
    // Get saved language
    function getSavedLang() {
        try {
            return localStorage.getItem('site-lang') || DEFAULT_LANG;
        } catch (error) {
            logError('Failed to get saved language', error);
            return DEFAULT_LANG;
        }
    }
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🌍 DOM ready, initializing language system');
        initToggleButton();
        const lang = getSavedLang();
        setLanguage(lang);
    });
    
    // Also initialize on window load
    window.addEventListener('load', function() {
        console.log('🌍 Window loaded, ensuring language system is ready');
        const lang = getSavedLang();
        if (lang !== 'en') {
            setLanguage(lang);
        }
    });
    
    // Export functions for manual use
    window.setLanguage = setLanguage;
    window.getSavedLang = getSavedLang;
    
    console.log('🌍 Universal Arabic Language System: Ready!');
})();
