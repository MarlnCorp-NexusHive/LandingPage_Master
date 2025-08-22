// Enhanced Language System for Online Hosting
(function(){
  const DEFAULT_LANG = 'en';
  const SUPPORTED_RTL = new Set(['ar']);
  const CACHE = {};

  // Enhanced error handling for online hosting
  function logError(message, error) {
    console.warn('Language System:', message, error);
  }

  // Embedded fallback translations for both languages
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
        text: "حيث تلتقي الاستراتيجية بالإبداع — لقرارات أذكى وتنفيذ أسرع ونتائج أجرأ."
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
      product1: { name: "Marln Magicpalm Scanner", desc: "جهاز بصمة أوردة الكف متقدم.", tag1: "القياسات الحيوية", tag2: "المدفوعات", tag3: "ماسح", button: "أجهزة" },
      product2: { name: "CRM System", desc: "حل متكامل لإدارة علاقات العملاء.", tag1: "CRM", tag2: "المبيعات", tag3: "العميل", button: "اعرف المزيد" },
      product3: { name: "LMS Platform", desc: "نظام إدارة تعلم متقدم.", tag1: "LMS", tag2: "التعلم", tag3: "التعليم", button: "اعرف المزيد" },
      product4: { name: "ESG System", desc: "نظام حوكمة مؤسسية.", tag1: "ESG", tag2: "الحوكمة", tag3: "المؤسسات", button: "اعرف المزيد" },
      product5: { name: "Marln TalkBright", desc: "منصة مدعومة بالذكاء الاصطناعي.", tag1: "IELTS", tag2: "مدعوم بالذكاء الاصطناعي", tag3: "التعليم", button: "اعرف المزيد" },
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
      cta: { titleHtml: "Your vision. Our precision.<span>Built right, from day one.</span>", text: "Where strategy meets creativity—powering smarter decisions, faster execution, and bolder outcomes." },
      agile: {
        title: "Our Agile Approach",
        step1: { title: "Discovery & Research", text: "Before we build, we listen." },
        step2: { title: "Design Board", text: "Vision meets execution." },
        step3: { title: "Iterative Cycle, Development & Testing", text: "Fast development sprints paired with real-world testing." },
        step4: { title: "MVP (Minimum Viable Product)", text: "Speed meets strategy." },
        step5: { title: "Production", text: "We transform polished prototypes into robust, market-ready solutions." }
      },
      products: { viewAll: "View all products" },
      product1: { name: "Marln Magicpalm Scanner", desc: "A high-end palm vein biometric device.", tag1: "Biometrics", tag2: "Payment", tag3: "Scanner", button: "Hardware" },
      product2: { name: "CRM System", desc: "Comprehensive customer relationship management solution.", tag1: "CRM", tag2: "Sales", tag3: "Customer", button: "Learn More" },
      product3: { name: "LMS Platform", desc: "Advanced learning management system.", tag1: "LMS", tag2: "Learning", tag3: "Education", button: "Learn More" },
      product4: { name: "ESG System", desc: "Enterprise governance system.", tag1: "ESG", tag2: "Governance", tag3: "Enterprise", button: "Learn More" },
      product5: { name: "Marln TalkBright", desc: "Revolutionary AI-powered platform.", tag1: "IELTS", tag2: "AI-Powered", tag3: "Education", button: "Learn More" },
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
      contact: { thank: { title: "Well done!", text: "We will contact you in the next few hours." }, form: { title: "Kick Start Your Project Right Now" }, right: { title: "Send us an email" } },
      footer: { social: "Social Links", certifications: "Certifications", officesTitle: "Offices" },
              offices: { cupertino: "Cupertino, USA", jeddah: "Jeddah, Saudi Arabia", riyadh: "Riyadh, Saudi Arabia", bangaluru: "Bengaluru, India", capetown: "Capetown, South Africa" }
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
    } catch(error) { 
      logError('Failed to save language preference', error);
    }
  }
  
  async function loadTranslations(lang){
    // Always use embedded translations for reliability
    if (EMBEDDED[lang]) {
      return EMBEDDED[lang];
    }
    
    // Fallback to default language
    if(lang !== DEFAULT_LANG) {
      return EMBEDDED[DEFAULT_LANG] || {};
    }
    
    return {};
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
        link.onerror = () => logError('Failed to load RTL CSS');
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

  function applyIndexTranslations(tr){
    // Header
    applyText('#menu-item-680 > a', tr, 'header.about');
    applyText('#menu-item-666 > a', tr, 'header.services');
    applyText('#menu-item-company > a', tr, 'header.company');
    applyText('#menu-item-contact > a', tr, 'common.contactUs');

    // Hero
    applyText('.services-hero-section-v_2--content .heading.h1', tr, 'hero.title');
    applyText('.services-hero-section-v_2--content .txt.txt-3xl p', tr, 'hero.subtitle');

    // Stats
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(1) .rr-why-hire-valmax-section--statistic__block--title', tr, 'stats.countries.title');
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(1) .rr-why-hire-valmax-section--statistic__block--num', tr, 'stats.countries.num');
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(2) .rr-why-hire-valmax-section--statistic__block--title', tr, 'stats.deployments.title');
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(2) .rr-why-hire-valmax-section--statistic__block--num', tr, 'stats.deployments.num');
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(3) .rr-why-hire-valmax-section--statistic__block--title', tr, 'stats.certifications.title');
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(3) .rr-why-hire-valmax-section--statistic__block--num', tr, 'stats.certifications.num');
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(4) .rr-why-hire-valmax-section--statistic__block--title', tr, 'stats.experts.title');
    applyText('.rr-why-hire-valmax-section--statistic__wrapper li:nth-child(4) .rr-why-hire-valmax-section--statistic__block--num', tr, 'stats.experts.num');

    // Clients we serve
    applyText('.why-our-clients .section-header h2.heading.h4', tr, 'clients.title');
    applyText('.why-our-clients-link .btn .btn-text', tr, 'common.ourProducts');
    applyText('.why-our-clients-list li:nth-child(1) .cf-title', tr, 'clients.startups.title');
    applyText('.why-our-clients-list li:nth-child(1) .why-our-clients-item-text p', tr, 'clients.startups.text');
    applyText('.why-our-clients-list li:nth-child(2) .cf-title', tr, 'clients.smvs.title');
    applyText('.why-our-clients-list li:nth-child(2) .why-our-clients-item-text p', tr, 'clients.smvs.text');
    applyText('.why-our-clients-list li:nth-child(3) .cf-title', tr, 'clients.corporates.title');
    applyText('.why-our-clients-list li:nth-child(3) .why-our-clients-item-text p', tr, 'clients.corporates.text');
    applyText('.why-our-clients-list li:nth-child(4) .cf-title', tr, 'clients.government.title');
    applyText('.why-our-clients-list li:nth-child(4) .why-our-clients-item-text p', tr, 'clients.government.text');

    // Services
    applyText('.ap-how-we-do-section .section-header .heading.h4', tr, 'services.title');
    applyText('.ap-how-we-do-section--list li:nth-child(1) h3.heading', tr, 'services.item1.title');
    applyText('.ap-how-we-do-section--list li:nth-child(1) .txt.txt-lg p', tr, 'services.item1.text');
    applyText('.ap-how-we-do-section--list li:nth-child(2) h3.heading', tr, 'services.item2.title');
    applyText('.ap-how-we-do-section--list li:nth-child(2) .txt.txt-lg p', tr, 'services.item2.text');
    applyText('.ap-how-we-do-section--list li:nth-child(3) h3.heading', tr, 'services.item3.title');
    applyText('.ap-how-we-do-section--list li:nth-child(3) .txt.txt-lg p', tr, 'services.item3.text');
    applyText('.ap-how-we-do-section--list li:nth-child(4) h3.heading', tr, 'services.item4.title');
    applyText('.ap-how-we-do-section--list li:nth-child(4) .txt.txt-lg p', tr, 'services.item4.text');

    // CTA
    applyHtml('.cta-form .cta-form--col-info h2.heading', tr, 'cta.titleHtml');
    applyText('.cta-form .cta-form--col-info .txt p', tr, 'cta.text');
    applyAll('.cta-form .btn .btn-text', tr, 'common.speakToTeam');

    // Agile
    applyText('.brand-identity-process .section-header .heading.h4', tr, 'agile.title');
    setStepTitle('.brand-identity-process--list li:nth-child(1) h3', tr, 'agile.step1.title');
    applyText('.brand-identity-process--list li:nth-child(1) .txt p', tr, 'agile.step1.text');
    setStepTitle('.brand-identity-process--list li:nth-child(2) h3', tr, 'agile.step2.title');
    applyText('.brand-identity-process--list li:nth-child(2) .txt p', tr, 'agile.step2.text');
    setStepTitle('.brand-identity-process--list li:nth-child(3) h3', tr, 'agile.step3.title');
    applyText('.brand-identity-process--list li:nth-child(3) .txt p', tr, 'agile.step3.text');
    setStepTitle('.brand-identity-process--list li:nth-child(4) h3', tr, 'agile.step4.title');
    applyText('.brand-identity-process--list li:nth-child(4) .txt p', tr, 'agile.step4.text');
    setStepTitle('.brand-identity-process--list li:nth-child(5) h3', tr, 'agile.step5.title');
    applyText('.brand-identity-process--list li:nth-child(5) .txt p', tr, 'agile.step5.text');

    // Products heading + CTA
    applyText('.featured-projects-section .section-header .heading.h4', tr, 'common.ourProducts');
    applyText('.featured-projects-section .section-header .btn .btn-text', tr, 'products.viewAll');

    // Product cards
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(1) .name', tr, 'product1.name');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(1) .txt p', tr, 'product1.desc');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(1) .btn-tag:nth-child(1) .btn-text', tr, 'product1.tag1');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(1) .btn-tag:nth-child(2) .btn-text', tr, 'product1.tag2');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(1) .btn-tag:nth-child(3) .btn-text', tr, 'product1.tag3');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(1) .btn-small .btn-text', tr, 'product1.button');

    applyText('.featured-projects-section--slider .swiper-slide:nth-child(2) .name', tr, 'product2.name');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(2) .txt p', tr, 'product2.desc');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(2) .btn-tag:nth-child(1) .btn-text', tr, 'product2.tag1');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(2) .btn-tag:nth-child(2) .btn-text', tr, 'product2.tag2');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(2) .btn-tag:nth-child(3) .btn-text', tr, 'product2.tag3');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(2) .btn-small .btn-text', tr, 'product2.button');

    applyText('.featured-projects-section--slider .swiper-slide:nth-child(3) .name', tr, 'product3.name');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(3) .txt p', tr, 'product3.desc');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(3) .btn-tag:nth-child(1) .btn-text', tr, 'product3.tag1');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(3) .btn-tag:nth-child(2) .btn-text', tr, 'product3.tag2');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(3) .btn-tag:nth-child(3) .btn-text', tr, 'product3.tag3');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(3) .btn-small .btn-text', tr, 'product3.button');

    applyText('.featured-projects-section--slider .swiper-slide:nth-child(4) .name', tr, 'product4.name');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(4) .txt p', tr, 'product4.desc');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(4) .btn-tag:nth-child(1) .btn-text', tr, 'product4.tag1');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(4) .btn-tag:nth-child(2) .btn-text', tr, 'product4.tag2');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(4) .btn-tag:nth-child(3) .btn-text', tr, 'product4.tag3');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(4) .btn-small .btn-text', tr, 'product4.button');

    applyText('.featured-projects-section--slider .swiper-slide:nth-child(5) .name', tr, 'product5.name');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(5) .txt p', tr, 'product5.desc');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(5) .btn-tag:nth-child(1) .btn-text', tr, 'product5.tag1');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(5) .btn-tag:nth-child(2) .btn-text', tr, 'product5.tag2');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(5) .btn-tag:nth-child(3) .btn-text', tr, 'product5.tag3');
    applyText('.featured-projects-section--slider .swiper-slide:nth-child(5) .btn-small .btn-text', tr, 'product5.button');

    // Why section
    applyText('.rr-why-hire-valmax-section .section-header .heading.h4', tr, 'why.title');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(1) h3.heading', tr, 'why.item1.title');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(1) .txt p', tr, 'why.item1.text');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(2) h3.heading', tr, 'why.item2.title');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(2) .txt p', tr, 'why.item2.text');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(3) h3.heading', tr, 'why.item3.title');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(3) .txt p', tr, 'why.item3.text');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(4) h3.heading', tr, 'why.item4.title');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(4) .txt p', tr, 'why.item4.text');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(5) h3.heading', tr, 'why.item5.title');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(5) .txt p', tr, 'why.item5.text');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(6) h3.heading', tr, 'why.item6.title');
    applyText('.rr-why-hire-valmax-section--items__wrapper li:nth-child(6) .txt p', tr, 'why.item6.text');

    // FAQ
    applyText('.faq .section-header .heading.h4', tr, 'faq.title');
    for(let i=1;i<=7;i++){
      applyText(`.faq-list li:nth-child(${i}) .faq-item-question-title`, tr, `faq.q${i}.title`);
      applyText(`.faq-list li:nth-child(${i}) .faq-item-answer p`, tr, `faq.q${i}.answer`);
    }

    // Contact
    applyText('.thank-you-for-another-form--title', tr, 'contact.thank.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');

    // Footer
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
    
    // Update dropdown menu items
    updateDropdownMenus(tr);
  }

  // Function to update dropdown menu items
  function updateDropdownMenus(tr) {
    // Update Services dropdown items
    const servicesDropdown = document.querySelector('.services-dropdown');
    if (servicesDropdown) {
      const servicesItems = servicesDropdown.querySelectorAll('li a');
      if (servicesItems.length >= 4) {
        applyText(servicesItems[0], tr, 'dropdown.services.aiConsulting');
        applyText(servicesItems[1], tr, 'dropdown.services.engineering');
        applyText(servicesItems[2], tr, 'dropdown.services.dataAnalytics');
        applyText(servicesItems[3], tr, 'dropdown.services.corporateTraining');
      }
    }

    // Update Company dropdown items
    const companyDropdown = document.querySelector('.company-dropdown');
    if (companyDropdown) {
      const companyItems = companyDropdown.querySelectorAll('li a');
      if (companyItems.length >= 4) {
        applyText(companyItems[0], tr, 'dropdown.company.profile');
        applyText(companyItems[1], tr, 'dropdown.company.csr');
        applyText(companyItems[2], tr, 'dropdown.company.partners');
        applyText(companyItems[3], tr, 'dropdown.company.industry');
      }
    }
  }

  async function setLanguage(lang){
    try {
      const tr = await loadTranslations(lang);
      setDirAndLang(lang);
      setButtonLabelFromLang(lang);

      // Apply translations based on page type
      if(document.querySelector('.services-hero-section-v_2')){
        applyIndexTranslations(tr);
      }

      // Update dropdown menu items
      updateDropdownMenus(tr);

      saveLang(lang);
      console.log('Language switched to:', lang);
    } catch(error) {
      logError('Failed to set language', error);
    }
  }

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

  // Enhanced initialization with better error handling
  function initializeLanguageSystem() {
    try {
      initToggleButton();
      const lang = getSavedLang();
      setLanguage(lang);
    } catch(error) {
      logError('Failed to initialize language system', error);
      // Fallback to default language
      setLanguage(DEFAULT_LANG);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageSystem);
  } else {
    initializeLanguageSystem();
  }

  // Expose for manual switching if needed
  window.setLanguage = setLanguage;
  window.getSavedLang = getSavedLang;

  // Helper: set header link text without altering structure
  function setHeaderLink(selector, tr, key){
    applyText(selector, tr, key);
  }

  // Preserve number badge span in agile step titles
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
})();
