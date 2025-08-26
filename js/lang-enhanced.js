// Enhanced Language System for Hosted Environments
(function(){
  const DEFAULT_LANG = 'en';
  const SUPPORTED_RTL = new Set(['ar']);
  const CACHE = {};

  // Enhanced error handling for hosted environments
  function logError(message, error) {
    console.warn('Enhanced Language System:', message, error);
  }

  // Embedded translations (always available)
  const EMBEDDED = {
    ar: {
      header: { about: "من نحن", services: "الخدمات", company: "الشركة" },
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
      common: {
        contactUs: "تواصل معنا",
        scheduleMeeting: "احجز اجتماعاً",
        speakToTeam: "تحدث إلى فريقنا",
        sendMessage: "أرسل الرسالة",
        namePlaceholder: "الاسم*",
        emailPlaceholder: "البريد الإلكتروني*",
        messagePlaceholder: "أخبرنا عن مشروعك",
        ourProducts: "منتجاتنا الذكية"
      },
      hero: {
        title: "رؤية شاملة 360°. تأثير أقصى",
        subtitle: "تعرف على Nexushive CRM: نظام إدارة علاقات العملاء الذكي الذي يستبق الاحتياج."
      },
      stats: {
        countries: { title: "الدول المخدومة", num: "10+" },
        deployments: { title: "عمليات نشر على مستوى المؤسسات", num: "50+" },
        certifications: { title: "الشهادات المحصلة", num: "7" },
        experts: { title: "الخبراء", num: "200+" }
      },
      clients: {
        title: "العملاء الذين نخدمهم",
        startups: { title: "الشركات الناشئة", text: "الأفكار الكبيرة تستحق تنفيذاً جريئاً." },
        smvs: { title: "المشاريع الصغيرة والمتوسطة", text: "الشركات في مرحلة النمو تحتاج أكثر من مجرد زخم." },
        corporates: { title: "الشركات الكبرى", text: "للمؤسسات الضخمة التي تتعامل مع أسواق معقدة." },
        government: { title: "القطاع الحكومي", text: "من التحول الرقمي إلى إشراك المواطنين." }
      },
      services: {
        title: "خبراتنا",
        item1: { title: "إعادة هندسة العمليات", text: "نحلل ونعيد تصميم ونحسن سير عملك المواجه للعملاء." },
        item2: { title: "تخصيص المنتجات", text: "كل عمل فريد — ويجب أن يكون نظام CRM كذلك." },
        item3: { title: "النشر", text: "من التجريبي إلى الإطلاق الكامل، نضمن إطلاق CRM سلس." },
        item4: { title: "دعم العملاء", text: "بعد الإطلاق نبقى معك." }
      },
      cta: {
        titleHtml: "رؤيتك. دقتنا.<span>نبنيها بالشكل الصحيح منذ اليوم الأول.</span>",
        text: "حيث تلتقي الاستراتيجية بالإبداع — لقرارات أذكى وتنفيذ أسرع."
      },
      agile: {
        title: "منهجيتنا الرشيقة",
        step1: { title: "الاستكشاف والبحث", text: "قبل أن نبني، نصغي." },
        step2: { title: "لوحة التصميم", text: "يلتقي التصور بالتنفيذ." },
        step3: { title: "دورات تطوير واختبار متكررة", text: "دورات تطوير سريعة مقرونة باختبارات واقعية." },
        step4: { title: "المنتج الأولي القابل للإطلاق (MVP)", text: "سرعة مع استراتيجية." },
        step5: { title: "الإنتاج", text: "نحوّل النماذج المصقولة إلى حلول قوية جاهزة للسوق." }
      },
      products: { viewAll: "عرض جميع المنتجات" },
      why: {
        title: "لماذا تختار Marln؟",
        item1: { title: "نتائج مثبتة", text: "+70 علامة أُطلقت. +12 منتجاً نُفّذ." },
        item2: { title: "نهج فردي", text: "لا حلول عامة للجميع." },
        item3: { title: "تكامل سلس", text: "نندمج في منظومتك — لا العكس." },
        item4: { title: "الامتثال", text: "الامتثال جزء أساسي وليس لاحقاً." },
        item5: { title: "ميزات مدعومة بالذكاء الاصطناعي", text: "ذكاء اصطناعي حيث يحدث الأثر." },
        item6: { title: "تحليل تنبؤي", text: "ارَ المستقبل قبل حدوثه." }
      },
      faq: {
        title: "الأسئلة المتكررة",
        q1: { title: "ما الخدمات التي تقدمها شركة Marln؟", answer: "نقدم حلولاً متكاملة عبر بناء الهوية." },
        q2: { title: "هل تعملون على بناء العلامات من الصفر أم إعادة بناء العلامات القائمة؟", answer: "كلاهما." },
        q3: { title: "كيف يختلف نهجكم عن غيركم؟", answer: "نبدأ كل مشروع ببحث عميق ومواءمة أعمال." },
        q4: { title: "ما القطاعات التي تخدمونها؟", answer: "عملنا عبر عدة مجالات منها التقنية المالية." },
        q5: { title: "هل تقدمون دعماً بعد الإطلاق وصيانة؟", answer: "نعم." },
        q6: { title: "ما المدة المعتادة لمشاريعكم؟", answer: "تختلف حسب النطاق." },
        q7: { title: "كيف نبدأ؟", answer: "ببساطة — تواصل معنا." }
      },
      contact: {
        thank: { title: "أحسنت!", text: "سنتواصل معك خلال الساعات القادمة." },
        form: { title: "ابدأ مشروعك الآن" },
        right: { title: "أرسل لنا بريداً إلكترونياً" }
      },
      footer: { social: "روابط التواصل الاجتماعي", certifications: "الشهادات", officesTitle: "مكاتبنا" },
      offices: {
        cupertino: "كوبرتينو، الولايات المتحدة",
        jeddah: "جدة، المملكة العربية السعودية",
        riyadh: "الرياض، المملكة العربية السعودية",
        bangaluru: "بنغالورو، الهند",
        capetown: "كيب تاون، جنوب أفريقيا"
      }
    },
    en: {
      header: { about: "About us", services: "Services", company: "Company" },
      dropdown: {
        services: {
          aiConsulting: "AI Powered Consulting",
          engineering: "Engineering Services",
          dataAnalytics: "Data Analytics",
          corporateTraining: "Corporate Training"
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
        messagePlaceholder: "Tell about your project",
        ourProducts: "Our AI Products"
      },
      hero: {
        title: "360° Insight. Maximum Impact",
        subtitle: "Meet Nexushive CRM: the AI CRM that thinks ahead."
      },
      stats: {
        countries: { title: "Countries Served", num: "10+" },
        deployments: { title: "Enterprise Deployments", num: "50+" },
        certifications: { title: "Certifications Obtained", num: "7" },
        experts: { title: "Experts", num: "200+" }
      },
      clients: {
        title: "Clients We Serve",
        startups: { title: "Startups", text: "Big ideas deserve bold execution." },
        smvs: { title: "Small & Medium Ventures", text: "Growth-stage businesses need more than just momentum." },
        corporates: { title: "LARGE CORPORATES", text: "For enterprise giants navigating complex markets." },
        government: { title: "GOVERNMENT", text: "From digital transformation to citizen engagement." }
      },
      services: {
        title: "Our Expertise",
        item1: { title: "Business Process Re-engineering", text: "We analyze, redesign, and optimize your customer-facing workflows." },
        item2: { title: "Product Customization", text: "Every business is unique — your CRM should be too." },
        item3: { title: "Deployment", text: "From pilot to full-scale rollout, we ensure a seamless CRM launch." },
        item4: { title: "Customer Support", text: "Beyond deployment, we stay by your side." }
      },
      cta: {
        titleHtml: "Your vision. Our precision.<span>Built right, from day one.</span>",
        text: "Where strategy meets creativity—powering smarter decisions, faster execution, and bolder outcomes."
      },
      agile: {
        title: "Our Agile Approach",
        step1: { title: "Discovery & Research", text: "Before we build, we listen." },
        step2: { title: "Design Board", text: "Vision meets execution." },
        step3: { title: "Iterative Cycle, Development & Testing", text: "Fast development sprints paired with real-world testing." },
        step4: { title: "MVP (Minimum Viable Product)", text: "Speed meets strategy." },
        step5: { title: "Production", text: "We transform polished prototypes into robust, market-ready solutions." }
      },
      products: { viewAll: "View all products" },
      why: {
        title: "Why Opt For Marln?",
        item1: { title: "Proven Results", text: "70+ brands launched. 12+ products deployed." },
        item2: { title: "Individual Approach", text: "No one-size-fits-all." },
        item3: { title: "Seamless Integration", text: "We fit into your ecosystem — not the other way around." },
        item4: { title: "Compliance", text: "Compliance is built-in, not bolted on." },
        item5: { title: "AI-Features", text: "AI that works where it matters." },
        item6: { title: "Predictive Analysis", text: "See what's next — before it happens." }
      },
      faq: {
        title: "Frequently asked questions",
        q1: { title: "What services does Marln Corp offer?", answer: "We offer end-to-end solutions across branding." },
        q2: { title: "Do you only work on new brand builds, or also rebrands?", answer: "Both." },
        q3: { title: "How is your process different from other agencies?", answer: "At Marln Corp, every project starts with deep research." },
        q4: { title: "What industries do you serve?", answer: "We've worked across multiple domains." },
        q5: { title: "Do you offer post-launch support and maintenance?", answer: "Yes." },
        q6: { title: "What is your typical project timeline?", answer: "Project timelines vary based on scope." },
        q7: { title: "How do we get started?", answer: "Simple — just get in touch with us." }
      },
      contact: {
        thank: { title: "Well done!", text: "We will contact you in the next few hours." },
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

  function getSavedLang(){
    try { 
      return localStorage.getItem('site-lang') || DEFAULT_LANG; 
    } catch(error) { 
      logError('localStorage access failed, using default language', error);
      return DEFAULT_LANG; 
    }
  }
  
  function saveLang(lang){
    try { 
      localStorage.setItem('site-lang', lang); 
      console.log('Language saved to localStorage:', lang);
    } catch(error) { 
      logError('Failed to save language preference', error);
    }
  }
  
  // Enhanced translation loading with hosted environment priority
  async function loadTranslations(lang){
    console.log('Enhanced: Loading translations for language:', lang);
    
    // PRIORITY 1: Use embedded translations for hosted environments
    if (EMBEDDED[lang]) {
      console.log('Enhanced: Using embedded translations for:', lang);
      return EMBEDDED[lang];
    }
    
    // PRIORITY 2: Check cache
    if(CACHE[lang]) {
      console.log('Enhanced: Using cached translations for:', lang);
      return CACHE[lang];
    }
    
    // PRIORITY 3: Try to load from JSON (fallback)
    try {
      console.log('Enhanced: Attempting to load from JSON file for:', lang);
      const res = await fetch(`i18n/${lang}.json`, { 
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if(!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = await res.json();
      CACHE[lang] = json;
      console.log('Enhanced: Successfully loaded from JSON file for:', lang);
      return json;
    } catch(err){
      logError(`Enhanced: Failed to load JSON for ${lang}`, err);
      
      // Final fallback to default language
      if(lang !== DEFAULT_LANG) {
        console.log(`Enhanced: Falling back to default language: ${DEFAULT_LANG}`);
        return loadTranslations(DEFAULT_LANG);
      }
      
      console.log('Enhanced: No translations available, returning empty object');
      return {};
    }
  }

  function setDirAndLang(lang){
    const html = document.documentElement;
    html.lang = lang;
    const isRtl = SUPPORTED_RTL.has(lang);
    html.dir = isRtl ? 'rtl' : 'ltr';
    html.classList.toggle('rtl', isRtl);
    ensureRtlCss(isRtl);
  }

  function ensureRtlCss(isRtl){
    let link = document.getElementById('rtl-css');
    if(isRtl){
      if(!link){
        link = document.createElement('link');
        link.id = 'rtl-css';
        link.rel = 'stylesheet';
        link.href = 'css/rtl.css';
        link.onerror = () => logError('Enhanced: Failed to load RTL CSS');
        document.head.appendChild(link);
      }
    } else if(link){
      link.remove();
    }
  }

  function setButtonLabelFromLang(lang){
    const btn = document.querySelector('.menu-item-lang .lang-toggle-button');
    if(btn){ 
      btn.textContent = lang === 'en' ? 'EN' : 'AR';
      btn.setAttribute('data-lang', lang);
    }
  }

  function tGet(translations, key){
    return key.split('.').reduce((acc, part)=> (acc && acc[part] != null ? acc[part] : undefined), translations);
  }

  function applyText(selector, translations, key){
    const el = document.querySelector(selector);
    const val = tGet(translations, key);
    if(el && typeof val === 'string'){ el.textContent = val; }
  }
  
  function applyHtml(selector, translations, key){
    const el = document.querySelector(selector);
    const val = tGet(translations, key);
    if(el && typeof val === 'string'){ el.innerHTML = val; }
  }
  
  function applyAttr(selector, attr, translations, key){
    document.querySelectorAll(selector).forEach(el => {
      const val = tGet(translations, key);
      if(typeof val === 'string'){ el.setAttribute(attr, val); }
    });
  }
  
  function applyAll(selector, translations, key){
    document.querySelectorAll(selector).forEach(el => {
      const val = tGet(translations, key);
      if(typeof val === 'string'){ el.textContent = val; }
    });
  }

  // Enhanced dropdown menu updates
  function updateDropdownMenus(translations) {
    console.log('Enhanced: Updating dropdown menus with:', Object.keys(translations));
    
    // Services dropdown
    const servicesDropdown = document.querySelector('.services-dropdown');
    if (servicesDropdown) {
        const servicesItems = servicesDropdown.querySelectorAll('a');
        servicesItems.forEach((item, index) => {
            const key = `dropdown.services.${['aiConsulting', 'engineering', 'dataAnalytics', 'corporateTraining'][index]}`;
            const val = tGet(translations, key);
            if (val && typeof val === 'string') {
                item.textContent = val;
            }
        });
    }
    
    // Company dropdown
    const companyDropdown = document.querySelector('.company-dropdown');
    if (companyDropdown) {
        const companyItems = companyDropdown.querySelectorAll('a');
        companyItems.forEach((item, index) => {
            const key = `dropdown.company.${['profile', 'csr', 'partners', 'industry'][index]}`;
            const val = tGet(translations, key);
            if (val && typeof val === 'string') {
                item.textContent = val;
            }
        });
    }
  }

  // Main language switching function
  async function setLanguage(lang){
    console.log('Enhanced: setLanguage called with:', lang);
    
    try {
      const tr = await loadTranslations(lang);
      console.log('Enhanced: Translations loaded successfully for:', lang);
      
      setDirAndLang(lang);
      setButtonLabelFromLang(lang);

      // Apply translations based on page detection
      if(document.querySelector('.services-hero-section-v_2')){
        console.log('Enhanced: Applying index page translations');
        applyIndexTranslations(tr);
      }
      
      // Update dropdown menus
      updateDropdownMenus(tr);
      
      saveLang(lang);
      console.log('Enhanced: Language switch completed successfully for:', lang);
      
    } catch (error) {
      logError('Enhanced: setLanguage failed', error);
      // Fallback to basic language switching
      try {
        setDirAndLang(lang);
        setButtonLabelFromLang(lang);
        saveLang(lang);
      } catch (fallbackError) {
        logError('Enhanced: Fallback language switch also failed', fallbackError);
      }
    }
  }

  // Initialize language toggle
  function initToggleButton(){
    const toggleBtn = document.querySelector('.menu-item-lang .lang-toggle-button');
    if(toggleBtn) {
      toggleBtn.addEventListener('click', function(e){
        e.preventDefault();
        const currentLang = this.getAttribute('data-lang');
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        this.setAttribute('data-lang', newLang);
        setLanguage(newLang);
      });
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function(){
    console.log('Enhanced: DOM ready, initializing language system');
    initToggleButton();
    const lang = getSavedLang();
    setLanguage(lang);
  });

  // Expose functions globally
  window.setLanguage = setLanguage;
  window.getSavedLang = getSavedLang;
  window.updateDropdownMenus = updateDropdownMenus;

  // Helper functions
  function setHeaderLink(selector, tr, key){
    applyText(selector, tr, key);
  }

  function setStepTitle(selector, tr, key){
    const el = document.querySelector(selector);
    if(!el) return;
    const title = tGet(tr, key);
    if(typeof title !== 'string') return;
    const numSpan = el.querySelector('span');
    if(numSpan){
      el.innerHTML = numSpan.outerHTML + ' ' + title;
    } else {
      el.textContent = title;
    }
  }

  // Apply index page translations
  function applyIndexTranslations(tr){
    // Header
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // Stats
    applyText('.rr-why-hire-valmax-section--statistic__block--title', tr, 'stats.countries.title');
    applyText('.rr-why-hire-valmax-section--statistic__block--num', tr, 'stats.countries.num');

    // Clients
    applyText('.why-our-clients .section-header h2.heading.h4', tr, 'clients.title');
    applyText('.why-our-clients-link .btn .btn-text', tr, 'common.ourProducts');

    // Services
    applyText('.ap-how-we-do-section .section-header .heading.h4', tr, 'services.title');

    // CTA
    applyHtml('.cta-form .cta-form--col-info h2.heading', tr, 'cta.titleHtml');
    applyText('.cta-form .cta-form--col-info .txt p', tr, 'cta.text');

    // Agile
    applyText('.brand-identity-process .section-header .heading.h4', tr, 'agile.title');

    // Products
    applyText('.featured-projects-section .section-header .heading.h4', tr, 'common.ourProducts');

    // Why section
    applyText('.rr-why-hire-valmax-section .section-header .heading.h4', tr, 'why.title');

    // FAQ
    applyText('.faq .section-header .heading.h4', tr, 'faq.title');

    // Contact
    applyText('.contact-us--form--title', tr, 'contact.form.title');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
  }

  console.log('Enhanced Language System loaded successfully');
})();
