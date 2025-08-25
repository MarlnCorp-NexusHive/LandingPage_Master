(function(){
  const DEFAULT_LANG = 'en';
  const SUPPORTED_RTL = new Set(['ar']);
  const CACHE = {};

  // Enhanced error handling for online hosting
  function logError(message, error) {
    console.warn('Language System:', message, error);
  }

  // Embedded fallback translations for file:// usage (no server)
  // Arabic and English both provided so file:// switching works without refresh
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
        ourProducts: "منتجاتنا الذكية",
        yourName: "اسمك",
        yourEmail: "بريدك الإلكتروني",
        companyName: "اسم الشركة",
        tellUsAboutProject: "أخبرنا عن مشروعك"
      },
      hero: {
        title: "رؤية شاملة 360°. تأثير أقصى",
        subtitle: "تعرف على Nexushive CRM: نظام إدارة علاقات العملاء الذكي الذي يستبق الاحتياج. من الرؤى التنبؤية إلى الأتمتة، صُمم لتعزيز المبيعات وتبسيط تفاعل العملاء."
      },
      stats: {
        countries: { title: "الدول المخدومة", num: "10+" },
        deployments: { title: "عمليات نشر على مستوى المؤسسات", num: "50+" },
        certifications: { title: "الشهادات المحصلة", num: "7" },
        experts: { title: "الخبراء", num: "200+" }
      },
      clients: {
        title: "العملاء الذين نخدمهم",
        startups: {
          title: "الشركات الناشئة",
          text: "الأفكار الكبيرة تستحق تنفيذاً جريئاً. نتعاون مع المؤسسين الطموحين لتحويل المفاهيم الأولية إلى علامات تجارية قوية وقابلة للتوسع — مصممة لتتجاوز الضوضاء وتقود المستقبل."
        },
        smvs: {
          title: "المشاريع الصغيرة والمتوسطة",
          text: "الشركات في مرحلة النمو تحتاج أكثر من مجرد زخم — تحتاج إلى استراتيجية حادة وهوية جذابة لإطلاق قفزتها التالية. نساعد المشاريع الصغيرة والمتوسطة على التحول إلى رواد سوق."
        },
        corporates: {
          title: "الشركات الكبرى",
          text: "للمؤسسات الضخمة التي تتعامل مع أسواق معقدة، نصوغ سرديات علامة تجارية عالية التأثير وأنظمة تصميم تعزز السلطة والثقة والابتكار."
        },
        government: {
          title: "القطاع الحكومي",
          text: "من التحول الرقمي إلى إشراك المواطنين، نتعاون مع الجهات الحكومية لإنشاء حلول تواصل واضحة وسهلة الوصول ومواكبة للمستقبل."
        }
      },
      services: {
        title: "خبراتنا",
        item1: {
          title: "إعادة هندسة العمليات",
          text: "نحلل ونعيد تصميم ونحسن سير عملك المواجه للعملاء لتحسين الكفاءة وإزالة العوائق ومواءمة العمليات مع استراتيجية CRM الحديثة."
        },
        item2: {
          title: "تخصيص المنتجات",
          text: "كل عمل فريد — ويجب أن يكون نظام CRM كذلك. نخصص المنصات لتلائم احتياجاتك بدقة مع وحدات وتدفّقات وواجهات قابلة للتوسع مع فريقك وأهدافك."
        },
        item3: {
          title: "النشر",
          text: "من التجريبي إلى الإطلاق الكامل، نضمن إطلاق CRM سلس. ندير إعداد البيئات والاختبارات وتأهيل المستخدم وإدارة التغيير لضمان أقل تعطل وأعلى اعتماد."
        },
        item4: {
          title: "دعم العملاء",
          text: "بعد الإطلاق نبقى معك. يضمن فريق الدعم المخصص لدينا حلاً سريعاً للمشكلات وتحسيناً مستمراً للأداء وطول عمر المنصة — حتى يركز فريقك على النمو."
        }
      },
      cta: {
        titleHtml: "رؤيتك. دقتنا.<span>نبنيها بالشكل الصحيح منذ اليوم الأول.</span>",
        text: "حيث تلتقي الاستراتيجية بالإبداع — لقرارات أذكى وتنفيذ أسرع ونتائج أجرأ."
      },
      agile: {
        title: "منهجيتنا الرشيقة",
        step1: { title: "الاستكشاف والبحث", text: "قبل أن نبني، نصغي. من مقابلات أصحاب المصلحة إلى تحليل السوق ورؤى المستخدم، نكشف التحديات الحقيقية — لا الظاهرة فقط — ونحوّل الافتراضات إلى بيانات قابلة للتنفيذ." },
        step2: { title: "لوحة التصميم", text: "يلتقي التصور بالتنفيذ. نحوّل المفاهيم إلى حلول ملموسة عبر النمذجة السريعة وملاحظات أصحاب المصلحة والتحسينات المتكررة." },
        step3: { title: "دورات تطوير واختبار متكررة", text: "دورات تطوير سريعة مقرونة باختبارات واقعية لضمان أن كل تحديث يحقق تقدماً ملموساً." },
        step4: { title: "المنتج الأولي القابل للإطلاق (MVP)", text: "سرعة مع استراتيجية. أطلق نواة منتج جاهزة للسوق خلال أسابيع، لتحقق الطلب وتجمع بيانات المستخدم الحقيقية وتُحسن بثقة." },
        step5: { title: "الإنتاج", text: "نحوّل النماذج المصقولة إلى حلول قوية جاهزة للسوق — مصممة للتوسع والأمان والأداء السلس." }
      },
      products: { viewAll: "عرض جميع المنتجات" },
      product1: { name: "Marln Magicpalm Scanner", desc: "جهاز بصمة أوردة الكف متقدم يوفر مصادقة آمنة دون لمس للتحكم في الوصول والمدفوعات والتحقق من الهوية عبر الصناعات.", tag1: "القياسات الحيوية", tag2: "المدفوعات", tag3: "ماسح", button: "أجهزة" },
      product2: { name: "CRM System", desc: "حل متكامل لإدارة علاقات العملاء يبسّط عمليات المبيعات والتسويق وخدمة العملاء لتعزيز نمو الأعمال.", tag1: "CRM", tag2: "المبيعات", tag3: "العميل", button: "اعرف المزيد" },
      product3: { name: "LMS Platform", desc: "نظام إدارة تعلم متقدم يقدم تجارب تعليمية مشوّقة مع إدارة دورات شاملة وتتبع وتحليلات.", tag1: "LMS", tag2: "التعلم", tag3: "التعليم", button: "اعرف المزيد" },
      product4: { name: "ESG System", desc: "نظام حوكمة مؤسسية يوفر إشرافاً شاملاً وإدارة للمخاطر ومراقبة للامتثال لعمليات المؤسسات واسعة النطاق.", tag1: "ESG", tag2: "الحوكمة", tag3: "المؤسسات", button: "اعرف المزيد" },
      product5: { name: "Marln TalkBright", desc: "منصة مدعومة بالذكاء الاصطناعي تُحدث تحولاً في التحضير لاختبار IELTS من خلال تغذية راجعة ذكية وتحليل فوري ومسارات تعلم مخصصة.", tag1: "IELTS", tag2: "مدعوم بالذكاء الاصطناعي", tag3: "التعليم", button: "اعرف المزيد" },
      why: {
        title: "لماذا تختار Marln؟",
        item1: { title: "نتائج مثبتة", text: "+70 علامة أُطلقت. +12 منتجاً نُفّذ.\nمدعومة بالنتائج ومحل ثقة للشركات الناشئة والمؤسسات والجهات الحكومية." },
        item2: { title: "نهج فردي", text: "لا حلول عامة للجميع. كل عميل يحصل على حل مصمم خصيصاً ومتوافقاً مع أهدافه وحجمه وثقافته." },
        item3: { title: "تكامل سلس", text: "نندمج في منظومتك — لا العكس.\nحلولنا تتكامل بسهولة مع أدواتك وتدفّقات عملك القائمة." },
        item4: { title: "الامتثال", text: "الامتثال جزء أساسي وليس لاحقاً.\nمن التعامل مع البيانات إلى النشر نضمن توافق أنظمتك مع المعايير التنظيمية والأخلاقية." },
        item5: { title: "ميزات مدعومة بالذكاء الاصطناعي", text: "ذكاء اصطناعي حيث يحدث الأثر.\nسواء CRM ذكي أو تجارب مستخدم تكيفية أو رؤى فورية — ندمج الذكاء الاصطناعي لأثر أعمال حقيقي." },
        item6: { title: "تحليل تنبؤي", text: "ارَ المستقبل قبل حدوثه.\nنحوّل البيانات إلى استبصار يساعدك على اتخاذ قرارات واعية واستباقية." }
      },
      faq: {
        title: "الأسئلة المتكررة",
        q1: { title: "ما الخدمات التي تقدمها شركة Marln؟", answer: "نقدم حلولاً متكاملة عبر بناء الهوية، وتصميم واجهات وتجربة المستخدم، وتطوير المنتجات، وأنظمة CRM، والتحول الرقمي — مخصصة للشركات الناشئة والمؤسسات والجهات الحكومية." },
        q2: { title: "هل تعملون على بناء العلامات من الصفر أم إعادة بناء العلامات القائمة؟", answer: "كلاهما. ننشئ علامات من الصفر ونختص أيضاً في تحديثات استراتيجية للعلامات التي تريد التطور دون فقدان جوهرها." },
        q3: { title: "كيف يختلف نهجكم عن غيركم؟", answer: "نبدأ كل مشروع ببحث عميق ومواءمة أعمال. نمزج التفكير التصميمي والمنهجيات الرشيقة وخبرات معتمدة لنقدم حلولاً ليست إبداعية فحسب — بل قابلة للتوسع واستراتيجية." },
        q4: { title: "ما القطاعات التي تخدمونها؟", answer: "عملنا عبر عدة مجالات منها التقنية المالية، التعليم، التجارة الإلكترونية، القطاع العام، SaaS، وأنماط الحياة — ونكيف نهجنا مع احتياجات كل قطاع." },
        q5: { title: "هل تقدمون دعماً بعد الإطلاق وصيانة؟", answer: "نعم. سواء نشر CRM أو إدارة أصول العلامة أو دعم تصميم مستمر — نقدم شراكات طويلة الأمد لإبقاء أنظمتك وعلامتك تعمل بسلاسة." },
        q6: { title: "ما المدة المعتادة لمشاريعكم؟", answer: "تختلف حسب النطاق. على سبيل المثال، هوية العلامة تحتاج 3–5 أسابيع، بينما تنفيذ CRM أو إطلاق منتج 6–12 أسبوعاً. نعمل بدورات رشيقة لتسليم أسرع وبجودة عالية." },
        q7: { title: "كيف نبدأ؟", answer: "ببساطة — تواصل معنا وسنحدد مكالمة استكشافية لفهم أهدافك وتحدياتك وكيف نقدم الحل الأنسب." }
      },
      contact: {
        thank: { title: "أحسنت!", text: "سنتواصل معك خلال الساعات القادمة أو يمكنك حجز موعد الآن." },
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
        ourProducts: "Our AI Products",
        yourName: "Your Name",
        yourEmail: "Your Email",
        companyName: "Company Name",
        tellUsAboutProject: "Tell us about your project"
      },
      hero: {
        title: "360° Insight. Maximum Impact",
        subtitle: "Meet Nexushive CRM: the AI CRM that thinks ahead. From predictive insights to automated workflows, it's built to supercharge your sales and simplify customer engagement."
      },
      stats: {
        countries: { title: "Countries Served", num: "10+" },
        deployments: { title: "Enterprise Deployments", num: "50+" },
        certifications: { title: "Certifications Obtained", num: "7" },
        experts: { title: "Experts", num: "200+" }
      },
      clients: {
        title: "Clients We Serve",
        startups: { title: "Startups", text: "Big ideas deserve bold execution. We collaborate with ambitious founders to transform raw concepts into powerful, scalable brands — built to break through the noise and lead the future." },
        smvs: { title: "Small & Medium Ventures", text: "Growth-stage businesses need more than just momentum — they need sharp strategy and magnetic branding to unlock their next leap. We help SMVs evolve into market leaders." },
        corporates: { title: "LARGE CORPORATES", text: "For enterprise giants navigating complex markets, we craft high-impact brand narratives and design systems that elevate authority, trust, and innovation." },
        government: { title: "GOVERNMENT", text: "From digital transformation to citizen engagement, we partner with public sector institutions to create clear, accessible, and future-forward communication solutions." }
      },
      services: {
        title: "Our Expertise",
        item1: { title: "Business Process Re-engineering", text: "We analyze, redesign, and optimize your customer-facing workflows to improve efficiency, eliminate friction, and align operations with modern CRM strategy." },
        item2: { title: "Product Customization", text: "Every business is unique — your CRM should be too. We tailor CRM platforms to match your exact needs, with custom modules, workflows, and interfaces that adapt to your team and scale with your goals." },
        item3: { title: "Deployment", text: "From pilot to full-scale rollout, we ensure a seamless CRM launch. Our team handles environment setup, testing, user onboarding, and change management to guarantee minimal disruption and maximum adoption." },
        item4: { title: "Customer Support", text: "Beyond deployment, we stay by your side. Our dedicated CRM support team ensures rapid issue resolution, continuous performance optimization, and platform longevity — so your team stays focused on what matters most: growth." }
      },
      cta: { titleHtml: "Your vision. Our precision.<span>Built right, from day one.</span>", text: "Where strategy meets creativity—powering smarter decisions, faster execution, and bolder outcomes." },
      agile: {
        title: "Our Agile Approach",
        step1: { title: "Discovery & Research", text: "Before we build, we listen. Through stakeholder interviews, market analysis, and user insights, we uncover the real challenges-not just the obvious ones. This phase transforms assumptions into actionable data, setting the stage for solutions that hit the mark from day one." },
        step2: { title: "Design Board", text: "Vision meets execution. Our collaborate design board turns concepts into tangible solutions-through rapid prototyping, stakeholder feedback, and iterative refinements. No endless revisions, just focused progress toward a design that works. For you." },
        step3: { title: "Iterative Cycle, Development & Testing", text: "Fast development sprints paired with real-world testing; ensuring every update delivers measurable progress." },
        step4: { title: "MVP (Minimum Viable Product)", text: "Speed meets strategy. Launch a market-ready core product in weeks. Validate demand, gather real user data, and refine with precision before heavy investment." },
        step5: { title: "Production", text: "We transform polished prototypes into robust, market-ready solutions- engineered for scale, security, and seamless performance. Your product, fully realized." }
      },
      products: { viewAll: "View all products" },
      product1: { name: "Marln Magicpalm Scanner", desc: "A high-end palm vein biometric device offering ultra-secure, touchless authentication for access control, payments, and identity verification across industries.", tag1: "Biometrics", tag2: "Payment", tag3: "Scanner", button: "Hardware" },
      product2: { name: "CRM System", desc: "Comprehensive customer relationship management solution that streamlines sales, marketing, and customer service operations for enhanced business growth.", tag1: "CRM", tag2: "Sales", tag3: "Customer", button: "Learn More" },
      product3: { name: "LMS Platform", desc: "Advanced learning management system that delivers engaging educational experiences with comprehensive course management, tracking, and analytics capabilities.", tag1: "LMS", tag2: "Learning", tag3: "Education", button: "Learn More" },
      product4: { name: "ESG System", desc: "Enterprise governance system that provides comprehensive oversight, risk management, and compliance monitoring for large-scale organizational operations.", tag1: "ESG", tag2: "Governance", tag3: "Enterprise", button: "Learn More" },
      product5: { name: "Marln TalkBright", desc: "Revolutionary AI-powered platform that transforms IELTS exam preparation through intelligent feedback, real-time analysis, and personalized learning pathways for speaking, writing, reading, and listening skills.", tag1: "IELTS", tag2: "AI-Powered", tag3: "Education", button: "Learn More" },
      why: {
        title: "Why Opt For Marln?",
        item1: { title: "Proven Results", text: "70+ brands launched. 12+ products deployed.\nBacked by results, trusted by startups, enterprises, and public institutions." },
        item2: { title: "Individual Approach", text: "No one-size-fits-all. Every client gets a tailored solution, aligned with their goals, scale, and culture." },
        item3: { title: "Seamless Integration", text: "We fit into your ecosystem — not the other way around.\nOur solutions integrate effortlessly with your existing tools and workflows." },
        item4: { title: "Compliance", text: "Compliance is built-in, not bolted on.\nFrom data handling to deployment, we ensure your systems meet regulatory and ethical standards." },
        item5: { title: "AI-Features", text: "AI that works where it matters.\nWhether it's smart CRMs, adaptive UX, or real-time insights — we integrate AI for real business impact." },
        item6: { title: "Predictive Analysis", text: "See what's next — before it happens.\nOur systems turn data into foresight, helping you make informed, forward-thinking decisions." }
      },
      faq: {
        title: "Frequently asked questions",
        q1: { title: "What services does Marln Corp offer?", answer: "We offer end-to-end solutions across branding, UI/UX design, product development, CRM systems, and digital transformation — tailored for startups, corporates, and government clients." },
        q2: { title: "Do you only work on new brand builds, or also rebrands?", answer: "Both. We help create brands from scratch, but also specialize in strategic brand refreshes for businesses looking to evolve without losing their essence." },
        q3: { title: "How is your process different from other agencies?", answer: "At Marln Corp, every project starts with deep research and business alignment. We combine design thinking, agile methodology, and certified expertise to deliver solutions that are not just creative — but scalable and strategic." },
        q4: { title: "What industries do you serve?", answer: "We've worked across multiple domains including fintech, edtech, e-commerce, public sector, SaaS, and lifestyle brands — adapting our process to match each industry's needs." },
        q5: { title: "Do you offer post-launch support and maintenance?", answer: "Yes. Whether it's CRM deployments, brand asset management, or ongoing design support — we provide long-term partnerships to keep your systems and brand running flawlessly." },
        q6: { title: "What is your typical project timeline?", answer: "Project timelines vary based on scope. For example, a brand identity project typically takes 3–5 weeks, while CRM implementations or product launches can take 6–12 weeks. We work in agile sprints for faster, high-quality delivery." },
        q7: { title: "How do we get started?", answer: "Simple — just get in touch with us and our team will schedule a discovery call to understand your goals, challenges, and how we can deliver the right solution." }
      },
      contact: { thank: { title: "Well done!", text: "We will contact you in the next few hours or you can schedule an appointment now." }, form: { title: "Kick Start Your Project Right Now" }, right: { title: "Send us an email" } },
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
      console.log('Language saved to localStorage:', lang);
    } catch(error) { 
      logError('Failed to save language preference', error);
    }
  }
  
  async function loadTranslations(lang){
    console.log('Loading translations for language:', lang);
    
    // Enhanced error handling for online hosting
    if (location.protocol === 'file:' && EMBEDDED[lang]) {
      console.log('Using embedded translations for file:// protocol');
      return EMBEDDED[lang];
    }
    
    if(CACHE[lang]) {
      console.log('Using cached translations for:', lang);
      return CACHE[lang];
    }
    
    try {
      console.log('Attempting to load translations from JSON file for:', lang);
      // Try to load from JSON file first
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
      console.log('Successfully loaded translations from JSON file for:', lang);
      console.log('JSON translations keys:', Object.keys(json));
      console.log('Sample dropdown keys:', {
        aiConsulting: json['dropdown.services.aiConsulting'],
        engineering: json['dropdown.services.engineering']
      });
      return json;
    } catch(err){
      logError(`Failed to load translations for ${lang}`, err);
      
      // Fallback to embedded translations
      if (EMBEDDED[lang]) {
        console.log(`Using embedded translations for ${lang} as fallback`);
        console.log('Embedded translations keys:', Object.keys(EMBEDDED[lang]));
        console.log('Embedded dropdown structure:', EMBEDDED[lang].dropdown);
        return EMBEDDED[lang];
      }
      
      // Final fallback to default language
      if(lang !== DEFAULT_LANG) {
        console.log(`Falling back to default language: ${DEFAULT_LANG}`);
        return loadTranslations(DEFAULT_LANG);
      }
      
      console.log('No translations available, returning empty object');
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
        // Add error handling for CSS loading
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
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // Hero
    applyText('.services-hero-section-v_2--content .heading.h1', tr, 'hero.title');
    applyText('.services-hero-section-v_2--content .txt.txt-3xl p', tr, 'hero.subtitle');

    // Stats
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(1) .rr-why-hire-marlncorp-section--statistic__block--title', tr, 'stats.countries.title');
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(1) .rr-why-hire-marlncorp-section--statistic__block--num', tr, 'stats.countries.num');
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(2) .rr-why-hire-marlncorp-section--statistic__block--title', tr, 'stats.deployments.title');
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(2) .rr-why-hire-marlncorp-section--statistic__block--num', tr, 'stats.deployments.num');
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(3) .rr-why-hire-marlncorp-section--statistic__block--title', tr, 'stats.certifications.title');
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(3) .rr-why-hire-marlncorp-section--statistic__block--num', tr, 'stats.certifications.num');
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(4) .rr-why-hire-marlncorp-section--statistic__block--title', tr, 'stats.experts.title');
    applyText('.rr-why-hire-marlncorp-section--statistic__wrapper li:nth-child(4) .rr-why-hire-marlncorp-section--statistic__block--num', tr, 'stats.experts.num');

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

    // Product cards (use position as provided on index)
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
    applyText('.rr-why-hire-marlncorp-section .section-header .heading.h4', tr, 'why.title');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(1) h3.heading', tr, 'why.item1.title');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(1) .txt p', tr, 'why.item1.text');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(2) h3.heading', tr, 'why.item2.title');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(2) .txt p', tr, 'why.item2.text');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(3) h3.heading', tr, 'why.item3.title');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(3) .txt p', tr, 'why.item3.text');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(4) h3.heading', tr, 'why.item4.title');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(4) .txt p', tr, 'why.item4.text');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(5) h3.heading', tr, 'why.item5.title');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(5) .txt p', tr, 'why.item5.text');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(6) h3.heading', tr, 'why.item6.title');
    applyText('.rr-why-hire-marlncorp-section--items__wrapper li:nth-child(6) .txt p', tr, 'why.item6.text');

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

    // Footer (left navigational labels where present)
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');

    // Update dropdown menu items for index page
    updateDropdownMenus(tr);
  }

  function applyAboutTranslations(tr){
    // Header (same selectors as index)
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // About page main headings
    applyText('.about-section h2', tr, 'about.story.title');
    applyText('.mission-section h2', tr, 'about.mission.title');

    // About story paragraphs
    applyText('.about-section > p:nth-of-type(1)', tr, 'about.story.intro');
    applyText('.about-section > p:nth-of-type(2)', tr, 'about.story.outro1');
    applyText('.about-section > p:nth-of-type(3)', tr, 'about.story.outro2');

    // Values grid (M A R L N) - using the colored boxes structure
    const valueCards = document.querySelectorAll('.about-section > div > div');
    if (valueCards.length >= 5) {
      applyText(valueCards[0].querySelector('h3'), tr, 'about.values.m.title');
      applyText(valueCards[0].querySelector('p'), tr, 'about.values.m.text');
      applyText(valueCards[1].querySelector('h3'), tr, 'about.values.a.title');
      applyText(valueCards[1].querySelector('p'), tr, 'about.values.a.text');
      applyText(valueCards[2].querySelector('h3'), tr, 'about.values.r.title');
      applyText(valueCards[2].querySelector('p'), tr, 'about.values.r.text');
      applyText(valueCards[3].querySelector('h3'), tr, 'about.values.l.title');
      applyText(valueCards[3].querySelector('p'), tr, 'about.values.l.text');
      applyText(valueCards[4].querySelector('h3'), tr, 'about.values.n.title');
      applyText(valueCards[4].querySelector('p'), tr, 'about.values.n.text');
    }

    // Mission paragraphs
    const missionParagraphs = document.querySelectorAll('.mission-section p');
    if (missionParagraphs.length >= 2) {
      applyText(missionParagraphs[0], tr, 'about.mission.text');
      applyText(missionParagraphs[1], tr, 'about.mission.subtitle');
    }

    // Contact form
    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    // Contact info
    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
  }

  function applyIndustryTranslations(tr){
    // Header (same selectors as other pages)
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // Industry page main title
    applyText('.industry-title span', tr, 'industry.title');

    // Industry cards - apply translations to each card
    const industryCards = document.querySelectorAll('.industry-card');
    
    // Map industry types to translation keys
    const industryMap = [
      { key: 'automotive', emoji: '🚗' },
      { key: 'banking', emoji: '🏦' },
      { key: 'consumer', emoji: '🛍️' },
      { key: 'communications', emoji: '📺' },
      { key: 'healthcare', emoji: '🏥' },
      { key: 'hitech', emoji: '💻' },
      { key: 'lifesciences', emoji: '🧬' },
      { key: 'publicservice', emoji: '🏛️' },
      { key: 'retail', emoji: '🛒' },
      { key: 'travel', emoji: '✈️' },
      { key: 'government', emoji: '🏛️' },
      { key: 'utilities', emoji: '⚡' }
    ];

    industryCards.forEach((card, index) => {
      if (index < industryMap.length) {
        const industry = industryMap[index];
        
        // Update title
        const titleElement = card.querySelector('h3');
        if (titleElement) {
          titleElement.textContent = tGet(tr, `industry.${industry.key}.title`);
        }
        
        // Update description
        const descElement = card.querySelector('p');
        if (descElement) {
          descElement.textContent = tGet(tr, `industry.${industry.key}.text`);
        }
        
        // Update explore solutions button
        const buttonElement = card.querySelector('.contact-scroll-btn');
        if (buttonElement) {
          buttonElement.textContent = tGet(tr, 'industry.exploreSolutions');
        }
      }
    });

    // Contact form
    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    // Contact info
    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
  }

  function applyAiConsultingTranslations(tr){
    // Header (same selectors as other pages)
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // AI Consulting page main title
    applyText('h1.fade-in', tr, 'ai.title');

    // Business consulting services - titles and content
    const serviceBoxes = document.querySelectorAll('.six-boxes-section .service-box');
    if (serviceBoxes.length >= 6) {
      // First row (3 boxes)
      applyText(serviceBoxes[0].querySelector('h3'), tr, 'ai.strategic.title');
      applyText(serviceBoxes[0].querySelector('p'), tr, 'ai.strategic.text');
      applyText(serviceBoxes[1].querySelector('h3'), tr, 'ai.operational.title');
      applyText(serviceBoxes[1].querySelector('p'), tr, 'ai.operational.text');
      applyText(serviceBoxes[2].querySelector('h3'), tr, 'ai.financial.title');
      applyText(serviceBoxes[2].querySelector('p'), tr, 'ai.financial.text');
      
      // Second row (3 boxes)
      applyText(serviceBoxes[3].querySelector('h3'), tr, 'ai.marketing.title');
      applyText(serviceBoxes[3].querySelector('p'), tr, 'ai.marketing.text');
      applyText(serviceBoxes[4].querySelector('h3'), tr, 'ai.hr.title');
      applyText(serviceBoxes[4].querySelector('p'), tr, 'ai.hr.text');
      applyText(serviceBoxes[5].querySelector('h3'), tr, 'ai.technology.title');
      applyText(serviceBoxes[5].querySelector('p'), tr, 'ai.technology.text');
    }

    // Legal and compliance section - titles and content
    applyText('h2.fade-in:nth-of-type(2)', tr, 'ai.legal.title');
    
    const complianceBoxes = document.querySelectorAll('.legal-compliance-section .compliance-box');
    if (complianceBoxes.length >= 9) {
      // First row (3 boxes)
      applyText(complianceBoxes[0].querySelector('h3'), tr, 'ai.regulatory.title');
      applyText(complianceBoxes[0].querySelector('p'), tr, 'ai.regulatory.text');
      applyText(complianceBoxes[1].querySelector('h3'), tr, 'ai.policy.title');
      applyText(complianceBoxes[1].querySelector('p'), tr, 'ai.policy.text');
      applyText(complianceBoxes[2].querySelector('h3'), tr, 'ai.training.title');
      applyText(complianceBoxes[2].querySelector('p'), tr, 'ai.training.text');
      
      // Second row (3 boxes)
      applyText(complianceBoxes[3].querySelector('h3'), tr, 'ai.risk.title');
      applyText(complianceBoxes[3].querySelector('p'), tr, 'ai.risk.text');
      applyText(complianceBoxes[4].querySelector('h3'), tr, 'ai.contract.title');
      applyText(complianceBoxes[4].querySelector('p'), tr, 'ai.contract.text');
      applyText(complianceBoxes[5].querySelector('h3'), tr, 'ai.data.title');
      applyText(complianceBoxes[5].querySelector('p'), tr, 'ai.data.text');
      
      // Third row (3 boxes)
      applyText(complianceBoxes[6].querySelector('h3'), tr, 'ai.monitoring.title');
      applyText(complianceBoxes[6].querySelector('p'), tr, 'ai.monitoring.text');
      applyText(complianceBoxes[7].querySelector('h3'), tr, 'ai.research.title');
      applyText(complianceBoxes[7].querySelector('p'), tr, 'ai.research.text');
      applyText(complianceBoxes[8].querySelector('h3'), tr, 'ai.thirdparty.title');
      applyText(complianceBoxes[8].querySelector('p'), tr, 'ai.thirdparty.text');
    }

    // Contact form
    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    // Contact info
    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
  }

  function applyDataAnalyticsTranslations(tr){
    // Header (same selectors as other pages)
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // Data Analytics page main title
    applyText('h1.fade-in', tr, 'data.title');

    // Data analytics services
    applyText('h3:nth-of-type(1)', tr, 'data.modeling.title');
    applyText('h3:nth-of-type(2)', tr, 'data.management.title');
    applyText('h3:nth-of-type(3)', tr, 'data.strategy.title');
    applyText('h3:nth-of-type(4)', tr, 'data.business.title');
    applyText('h3:nth-of-type(5)', tr, 'data.advanced.title');
    applyText('h3:nth-of-type(6)', tr, 'data.performance.title');
    applyText('h3:nth-of-type(7)', tr, 'data.compliance.title');
    applyText('h3:nth-of-type(8)', tr, 'data.change.title');
    applyText('h3:nth-of-type(9)', tr, 'data.support.title');

    // Contact form
    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    // Contact info
    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
  }

  function applyEngineeringServicesTranslations(tr){
    // Header (same selectors as other pages)
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // Engineering Services page main title
    applyText('h1.fade-in', tr, 'engineering.title');

    // Solutions section
    applyText('h2.fade-in:nth-of-type(1)', tr, 'engineering.solutions.title');
    applyText('h3:nth-of-type(1)', tr, 'engineering.appdev.title');
    applyText('h3:nth-of-type(2)', tr, 'engineering.mobile.title');

    // Generative AI section
    applyText('h2.fade-in:nth-of-type(2)', tr, 'engineering.ai.title');
    applyText('h3:nth-of-type(3)', tr, 'engineering.data.title');
    applyText('h3:nth-of-type(4)', tr, 'engineering.aistrategy.title');
    applyText('h3:nth-of-type(5)', tr, 'engineering.aimodel.title');
    applyText('h3:nth-of-type(6)', tr, 'engineering.prompt.title');
    applyText('h3:nth-of-type(7)', tr, 'engineering.finetuning.title');
    applyText('h3:nth-of-type(8)', tr, 'engineering.assistants.title');

    // Quality Engineering section
    applyText('h2.fade-in:nth-of-type(3)', tr, 'engineering.quality.title');
    applyText('h3:nth-of-type(9)', tr, 'engineering.testauto.title');
    applyText('h3:nth-of-type(10)', tr, 'engineering.performance.title');
    applyText('h3:nth-of-type(11)', tr, 'engineering.security.title');
    applyText('h3:nth-of-type(12)', tr, 'engineering.globalization.title');
    applyText('h3:nth-of-type(13)', tr, 'engineering.compliance.title');
    applyText('h3:nth-of-type(14)', tr, 'engineering.continuous.title');
    applyText('h3:nth-of-type(15)', tr, 'engineering.functionality.title');
    applyText('h3:nth-of-type(16)', tr, 'engineering.usability.title');
    applyText('h3:nth-of-type(17)', tr, 'engineering.api.title');

    // Cloud Technologies section
    applyText('h2.fade-in:nth-of-type(4)', tr, 'engineering.cloud.title');
    applyText('h3:nth-of-type(18)', tr, 'engineering.migration.title');
    applyText('h3:nth-of-type(19)', tr, 'engineering.cloudsecurity.title');
    applyText('h3:nth-of-type(20)', tr, 'engineering.multicloud.title');
    applyText('h3:nth-of-type(21)', tr, 'engineering.devops.title');

    // Digital Engineering section
    applyText('h2.fade-in:nth-of-type(5)', tr, 'engineering.digital.title');
    applyText('h3:nth-of-type(22)', tr, 'engineering.rpa.title');
    applyText('h3:nth-of-type(23)', tr, 'engineering.uiux.title');
    applyText('h3:nth-of-type(24)', tr, 'engineering.fullstack.title');
    applyText('h3:nth-of-type(25)', tr, 'engineering.cms.title');
    applyText('h3:nth-of-type(26)', tr, 'engineering.software.title');
    applyText('h3:nth-of-type(27)', tr, 'engineering.mobility.title');

    // Cybersecurity section
    applyText('h2.fade-in:nth-of-type(6)', tr, 'engineering.cybersecurity.title');
    applyText('h3:nth-of-type(28)', tr, 'engineering.identity.title');
    applyText('h3:nth-of-type(29)', tr, 'engineering.network.title');
    applyText('h3:nth-of-type(30)', tr, 'engineering.advanced.title');
    applyText('h3:nth-of-type(31)', tr, 'engineering.audit.title');

    // Solutions section (second one)
    applyText('h2.fade-in:nth-of-type(7)', tr, 'engineering.solutions2.title');
    applyText('h3:nth-of-type(32)', tr, 'engineering.strategic.title');
    applyText('h3:nth-of-type(33)', tr, 'engineering.operational.title');
    applyText('h3:nth-of-type(34)', tr, 'engineering.techintegration.title');

    // Contact form
    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    // Contact info
    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
  }

  function applyProfileTranslations(tr){
    // Header (same selectors as other pages)
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // Main title
    applyText('h1[style*="font-size: 4rem"]', tr, 'profile.title');

    // Company profile section
    applyText('h2[style*="font-size: 2.5rem"]:nth-of-type(1)', tr, 'profile.company.title');
    applyText('h3[style*="font-size: 1.8rem"]', tr, 'profile.company.subtitle');

    // Company profile paragraphs
    const paragraphs = document.querySelectorAll('.company-profile-section p');
    if (paragraphs.length >= 4) {
      applyText(paragraphs[0], tr, 'profile.welcome');
      applyText(paragraphs[1], tr, 'profile.founded');
      applyText(paragraphs[2], tr, 'profile.believe');
      applyText(paragraphs[3], tr, 'profile.based');
    }

    // Marln explanation section
    applyText('h2[style*="font-size: 2.5rem"]:nth-of-type(2)', tr, 'profile.marln.title');

    // Marln explanation paragraphs
    const marlnParagraphs = document.querySelectorAll('.marln-explanation-section p');
    if (marlnParagraphs.length >= 7) {
      applyText(marlnParagraphs[0], tr, 'profile.marln.intro');
      applyText(marlnParagraphs[1], tr, 'profile.marln.mentorship');
      applyText(marlnParagraphs[2], tr, 'profile.marln.advocacy');
      applyText(marlnParagraphs[3], tr, 'profile.marln.resilience');
      applyText(marlnParagraphs[4], tr, 'profile.marln.leadership');
      applyText(marlnParagraphs[5], tr, 'profile.marln.nurturing');
      applyText(marlnParagraphs[6], tr, 'profile.marln.together');
    }

    // Contact form
    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    // Contact info
    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
  }

  function applyCsrTranslations(tr){
    // Header (same selectors as other pages)
    setHeaderLink('#menu-item-680 > a', tr, 'header.about');
    setHeaderLink('#menu-item-666 > a', tr, 'header.services');
    setHeaderLink('#menu-item-company > a', tr, 'header.company');
    setHeaderLink('#menu-item-contact > a', tr, 'common.contactUs');

    // Hero section
    applyText('.hero-section h1', tr, 'csr.title');
    applyText('.hero-section p', tr, 'csr.subtitle');

    // CSR Initiatives section
    applyText('.csr-section .section-header h2', tr, 'csr.initiatives.title');
    applyText('.csr-section .section-header p', tr, 'csr.initiatives.subtitle');

    // Initiative cards
    const initiativeCards = document.querySelectorAll('.csr-section .service-box');
    if (initiativeCards.length >= 3) {
      applyText(initiativeCards[0].querySelector('h3'), tr, 'csr.initiatives.diversity.title');
      applyText(initiativeCards[0].querySelector('p'), tr, 'csr.initiatives.diversity.text');
      applyText(initiativeCards[1].querySelector('h3'), tr, 'csr.initiatives.community.title');
      applyText(initiativeCards[1].querySelector('p'), tr, 'csr.initiatives.community.text');
      applyText(initiativeCards[2].querySelector('h3'), tr, 'csr.initiatives.environmental.title');
      applyText(initiativeCards[2].querySelector('p'), tr, 'csr.initiatives.environmental.text');
    }

    // Commitment section
    applyText('.csr-commitment-section h2', tr, 'csr.commitment.title');
    applyText('.csr-commitment-section p', tr, 'csr.commitment.subtitle');
    applyText('.csr-commitment-section h3', tr, 'csr.commitment.focusAreas.title');

    // Focus areas cards
    const focusCards = document.querySelectorAll('.csr-commitment-section .csr-card');
    if (focusCards.length >= 4) {
      applyText(focusCards[0].querySelector('h4'), tr, 'csr.commitment.focusAreas.environment.title');
      applyText(focusCards[0].querySelector('p'), tr, 'csr.commitment.focusAreas.environment.text');
      applyText(focusCards[1].querySelector('h4'), tr, 'csr.commitment.focusAreas.community.title');
      applyText(focusCards[1].querySelector('p'), tr, 'csr.commitment.focusAreas.community.text');
      applyText(focusCards[2].querySelector('h4'), tr, 'csr.commitment.focusAreas.education.title');
      applyText(focusCards[2].querySelector('p'), tr, 'csr.commitment.focusAreas.education.text');
      applyText(focusCards[3].querySelector('h4'), tr, 'csr.commitment.focusAreas.ethics.title');
      applyText(focusCards[3].querySelector('p'), tr, 'csr.commitment.focusAreas.ethics.text');
    }

    // Flagship initiatives section
    applyText('.flagship-initiatives-section .section-header h2', tr, 'csr.flagship.title');
    applyText('.flagship-initiatives-section .section-header p', tr, 'csr.flagship.subtitle');

    // Flagship initiative cards
    const flagshipCards = document.querySelectorAll('.flagship-initiatives-section .csr-card');
    if (flagshipCards.length >= 3) {
      applyText(flagshipCards[0].querySelector('h4'), tr, 'csr.flagship.greenFuture.title');
      applyText(flagshipCards[0].querySelector('p'), tr, 'csr.flagship.greenFuture.text');
      applyText(flagshipCards[1].querySelector('h4'), tr, 'csr.flagship.techForAll.title');
      applyText(flagshipCards[1].querySelector('p'), tr, 'csr.flagship.techForAll.text');
      applyText(flagshipCards[2].querySelector('h4'), tr, 'csr.flagship.communityCare.title');
      applyText(flagshipCards[2].querySelector('p'), tr, 'csr.flagship.communityCare.text');
    }

    // Contact form
    applyText('.contact-us--form--title', tr, 'contact.form.title');
    applyAttr('input[name="your-name"]', 'placeholder', tr, 'common.namePlaceholder');
    applyAttr('input[name="your-email"]', 'placeholder', tr, 'common.emailPlaceholder');
    applyAttr('textarea[name="your-message"]', 'placeholder', tr, 'common.messagePlaceholder');
    applyAttr('input[type="submit"][value]', 'value', tr, 'common.sendMessage');

    // Contact info
    applyText('.contact-us--connect .heading', tr, 'contact.right.title');
    applyText('.thank-you-for-another-form--text', tr, 'contact.thank.text');
    applyText('.thank-you-for-another-form--btn .btn-text', tr, 'common.scheduleMeeting');

    // Footer
    applyAll('#footer .footer-contact-btn .btn .btn-text', tr, 'common.contactUs');
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
  }

  // Function to update dropdown menu items
  // Helper function to apply text to DOM elements directly
function applyTextToElement(element, translations, key) {
  let val = tGet(translations, key);
  // If tGet failed, try direct access for flat JSON structure
  if (val === undefined && translations[key]) {
    val = translations[key];
  }
  if (element && typeof val === 'string') {
    element.textContent = val;
  }
}

function updateDropdownMenus(translations) {
    console.log('updateDropdownMenus called with translations:', Object.keys(translations));
    
    // Services dropdown
    const servicesDropdown = document.querySelector('.services-dropdown');
    if (servicesDropdown) {
        const servicesItems = servicesDropdown.querySelectorAll('a');
        console.log('Services items found:', servicesItems.length);
        
        servicesItems.forEach((item, index) => {
            const key = `dropdown.services.${['aiConsulting', 'engineering', 'dataAnalytics', 'corporateTraining'][index]}`;
            applyTextToElement(item, translations, key);
        });
    }
    
    // Company dropdown
    const companyDropdown = document.querySelector('.company-dropdown');
    if (companyDropdown) {
        const companyItems = companyDropdown.querySelectorAll('a');
        console.log('Company items found:', companyItems.length);
        
        companyItems.forEach((item, index) => {
            const key = `dropdown.company.${['profile', 'csr', 'partners', 'industry'][index]}`;
            applyTextToElement(item, translations, key);
        });
    }
    
    // Additional attempts with delays
    setTimeout(() => {
        const servicesDropdown2 = document.querySelector('.services-dropdown');
        if (servicesDropdown2) {
            const servicesItems2 = servicesDropdown2.querySelectorAll('a');
            servicesItems2.forEach((item, index) => {
                const key = `dropdown.services.${['aiConsulting', 'engineering', 'dataAnalytics', 'corporateTraining'][index]}`;
                applyTextToElement(item, translations, key);
            });
        }
        
        const companyDropdown2 = document.querySelector('.company-dropdown');
        if (companyDropdown2) {
            const companyItems2 = companyDropdown2.querySelectorAll('a');
            companyItems2.forEach((item, index) => {
                const key = `dropdown.company.${['profile', 'csr', 'partners', 'industry'][index]}`;
                applyTextToElement(item, translations, key);
            });
        }
    }, 1000);
    
    setTimeout(() => {
        const servicesDropdown3 = document.querySelector('.services-dropdown');
        if (servicesDropdown3) {
            const servicesItems3 = servicesDropdown3.querySelectorAll('a');
            servicesItems3.forEach((item, index) => {
                const key = `dropdown.services.${['aiConsulting', 'engineering', 'dataAnalytics', 'corporateTraining'][index]}`;
                applyTextToElement(item, translations, key);
            });
        }
        
        const companyDropdown3 = document.querySelector('.company-dropdown');
        if (companyDropdown3) {
            const companyItems3 = companyDropdown3.querySelectorAll('a');
            companyItems3.forEach((item, index) => {
                const key = `dropdown.company.${['profile', 'csr', 'partners', 'industry'][index]}`;
                applyTextToElement(item, translations, key);
            });
        }
    }, 2000);
    
    // Listen for window load event
    window.addEventListener('load', () => {
        const servicesDropdown4 = document.querySelector('.services-dropdown');
        if (servicesDropdown4) {
            const servicesItems4 = servicesDropdown4.querySelectorAll('a');
            servicesItems4.forEach((item, index) => {
                const key = `dropdown.services.${['aiConsulting', 'engineering', 'dataAnalytics', 'corporateTraining'][index]}`;
                applyTextToElement(item, translations, key);
            });
        }
        
        const companyDropdown4 = document.querySelector('.company-dropdown');
        if (companyDropdown4) {
            const companyItems4 = companyDropdown4.querySelectorAll('a');
            companyItems4.forEach((item, index) => {
                const key = `dropdown.company.${['profile', 'csr', 'partners', 'industry'][index]}`;
                applyTextToElement(item, translations, key);
            });
        }
    });
  }

  async function setLanguage(lang){
    console.log('setLanguage called with:', lang);
    
    try {
      const tr = await loadTranslations(lang);
      console.log('Translations loaded successfully for:', lang);
      
      setDirAndLang(lang);
      setButtonLabelFromLang(lang);

      // Decide which page we're on using unique anchors
      if(document.querySelector('.services-hero-section-v_2')){
        console.log('Applying index page translations');
        applyIndexTranslations(tr);
      }
      if(document.querySelector('main.about-content')){
        console.log('Applying about page translations');
        applyAboutTranslations(tr);
      }
      if(document.querySelector('main.industry-content')){
        console.log('Applying industry page translations');
        applyIndustryTranslations(tr);
      }
      if(document.querySelector('h1.fade-in') && document.querySelector('h1.fade-in').textContent.includes('AI Powered Consulting')){
        console.log('Applying AI consulting page translations');
        applyAiConsultingTranslations(tr);
      }
      if(document.querySelector('h1.fade-in') && document.querySelector('h1.fade-in').textContent.includes('Data Engineering Expertise')){
        console.log('Applying data analytics page translations');
        applyDataAnalyticsTranslations(tr);
      }
      if(document.querySelector('h1.fade-in') && document.querySelector('h1.fade-in').textContent.includes('Engineering Solutions')){
        console.log('Applying engineering services page translations');
        applyEngineeringServicesTranslations(tr);
      }
      if(document.querySelector('h1[style*="font-size: 4rem"]') && document.querySelector('h1[style*="font-size: 4rem"]').textContent.includes('Marln')){
        console.log('Applying profile page translations');
        applyProfileTranslations(tr);
      }
      if(document.querySelector('main.csr-content')){
        console.log('Applying CSR page translations');
        applyCsrTranslations(tr);
      }
      
      // Update dropdown menu items
      console.log('Updating dropdown menus');
      updateDropdownMenus(tr);
      
      // Also try to update dropdowns after a delay in case they're not immediately available
      setTimeout(() => {
        console.log('Updating dropdown menus with delay');
        updateDropdownMenus(tr);
      }, 100);
      
      saveLang(lang);
      console.log('Language switch completed successfully for:', lang);
      
    } catch (error) {
      logError('setLanguage failed', error);
      // Try fallback approach
      try {
        console.log('Attempting fallback language switch');
        setDirAndLang(lang);
        setButtonLabelFromLang(lang);
        saveLang(lang);
      } catch (fallbackError) {
        logError('Fallback language switch also failed', fallbackError);
      }
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

  document.addEventListener('DOMContentLoaded', function(){
    initToggleButton();
    const lang = getSavedLang();
    setLanguage(lang);
  });

  // Expose for manual switching if needed
  window.setLanguage = setLanguage;
  window.getSavedLang = getSavedLang;
  window.updateDropdownMenus = updateDropdownMenus;

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