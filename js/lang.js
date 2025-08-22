(function(){
  const DEFAULT_LANG = 'en';
  const SUPPORTED_RTL = new Set(['ar']);
  const CACHE = {};

  // Embedded fallback translations for file:// usage (no server)
  // Arabic and English both provided so file:// switching works without refresh
  const EMBEDDED = {
    ar: {
      header: { about: "من نحن", services: "الخدمات", company: "الشركة" },
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
      },
      about: {
        story: {
          title: "قصتنا",
          intro: "اسم \"Marln\" يجسد رواية قوية تتمحور حول الصفات التي تعكس التزام الشركة بتمكين النساء في مجال التقنية وتعزيز بيئة متنوعة وشاملة.",
          outro1: "معاً تجسد هذه القيم روح Marln Corporation وتوجه رسالتها لتمكين النساء عبر حلول استشارية مبتكرة في تقنية المعلومات.",
          outro2: "نخدم اليوم عملاء في أكثر من 10 دول مع أكثر من 50 عملية نشر مؤسسية وفريق يتجاوز 200 خبير."
        },
        mission: {
          title: "مهمتنا",
          text: "مهمتنا تمكين الأعمال بحلول تقنية مبتكرة متمحورة حول الإنسان، تقود التحول الرقمي وتطلق النمو."
        },
        benefits: {
          title: "فوائد الشراكة معنا:",
          card1: { title: "حوافز ضريبية", text: "التعاون مع شركة مملوكة لامرأة من أقلية يمكن أن يوفر حوافز ضريبية لشركتك وفق برامج حكومية." },
          card2: { title: "سمعة الأعمال المتنوعة", text: "تبني التنوع ضروري لنمو صحي. الشراكة معنا تعكس التزام شركتك بالتنوع، ونلتزم نحن بتقديم نتائج ملموسة." }
        },
        certBanner: { title: "مارلن كورب شركة معتمدة 100% مملوكة للنساء والأقليات" },
        manager: { title: "المدير التنفيذي" }
      },
      industry: {
        title: "حلول الصناعات",
        exploreSolutions: "استكشف الحلول",
        automotive: { title: "السيارات", text: "صناعة السيارات تتطور باستمرار مع ظهور تقنيات جديدة مثل المركبات الذاتية والمركبات الكهربائية وأنظمة المساعدة المتقدمة للسائق (ADAS)." },
        banking: { title: "الخدمات المصرفية", text: "حلول التوظيف التقني المصرفي مكون حاسم في صناعة الخدمات المصرفية. تحتاج البنوك إلى الأشخاص المناسبين لتطوير وتنفيذ وصيانة أنظمتها التقنية." },
        consumer: { title: "السلع والخدمات الاستهلاكية", text: "يمكن لشركة مارلن مساعدة شركات السلع والخدمات الاستهلاكية في العثور على وتوظيف متخصصين مؤهلين بهذه المهارات المطلوبة. يمكن لوكالات التوظيف أيضاً توفير خيارات توظيف مؤقتة وعقود." },
        communications: { title: "الاتصالات والإعلام", text: "إنتاج وتحرير الفيديو: مع تزايد الطلب على محتوى الفيديو عبر منصات مختلفة، أصبحت مهارات إنتاج وتحرير الفيديو ذات قيمة متزايدة." },
        healthcare: { title: "الرعاية الصحية", text: "السجلات الصحية الإلكترونية (EHR) وتقنية المعلومات الصحية (HIT): الكفاءة في أنظمة EHR وأدوات HIT ضرورية لإدارة سجلات المرضى وضمان الامتثال." },
        hitech: { title: "التقنية العالية", text: "تعتمد شركات التقنية العالية بشكل كبير على المتخصصين المهرة ذوي الخبرة في مجالات تقنية مختلفة لتطوير وتنفيذ وصيانة المنتجات والخدمات المبتكرة." },
        lifesciences: { title: "علوم الحياة", text: "تعتمد شركات علوم الحياة على مجموعة متنوعة من المتخصصين المهرة ذوي الخبرة في مجالات تقنية مختلفة لإحراز تقدم في الطب والتكنولوجيا الحيوية." },
        publicservice: { title: "الخدمة العامة", text: "القطاع العام يعتمد بشكل متزايد على التقنية لتحقيق أهدافه، وهذا الطلب على المهارات التقنية سينمو فقط في السنوات القادمة." },
        retail: { title: "التجزئة", text: "شركات التجزئة من جميع الأحجام تعتمد على مجموعة متنوعة من المهارات التقنية: أنظمة نقاط البيع (POS)، وإدارة المخزون، وإدارة سلسلة التوريد." },
        travel: { title: "السفر والسياحة", text: "صناعة السفر تتطور باستمرار مع ظهور تقنيات جديدة مثل الذكاء الاصطناعي (AI)، والتعلم الآلي (ML)، وتحليل البيانات." },
        government: { title: "الحكومة", text: "نساعد الوكالات الحكومية على الانتقال إلى السحابة لتمكين مرونة وقابلية توسع أكبر. يمكن لفريقنا مساعدتك في اختيار أفضل حل سحابي لاحتياجاتك." },
        utilities: { title: "المرافق العامة", text: "نساعد شركات المرافق العامة على الانتقال إلى السحابة لتمكين مرونة وقابلية توسع أكبر. يمكن لفريقنا مساعدتك في اختيار أفضل حل سحابي لعملك." }
      },
      ai: {
        title: "تمكين عملك بخدمات استشارية مدعومة بالذكاء الاصطناعي",
        strategic: { title: "التخطيط الاستراتيجي للأعمال" },
        operational: { title: "تحسين الكفاءة التشغيلية" },
        financial: { title: "استشارات الإدارة المالية" },
        marketing: { title: "تطوير استراتيجية التسويق" },
        hr: { title: "حلول الموارد البشرية" },
        technology: { title: "خدمات تكامل التقنية" },
        legal: { title: "القانونية والامتثال" },
        regulatory: { title: "تقييم الامتثال التنظيمي" },
        policy: { title: "تطوير وتنفيذ السياسات" },
        training: { title: "برامج التدريب والتوعية" },
        risk: { title: "إدارة وتخفيف المخاطر" },
        contract: { title: "إدارة العقود" },
        data: { title: "حماية البيانات والامتثال للخصوصية" },
        monitoring: { title: "المراقبة والتقارير" },
        research: { title: "البحوث القانونية والخدمات الاستشارية" },
        thirdparty: { title: "إدارة مخاطر الأطراف الثالثة" }
      },
      data: {
        title: "خبرة هندسة البيانات لكل متطلبات الأعمال",
        modeling: { title: "نمذجة وتصور البيانات" },
        management: { title: "إدارة البيانات" },
        strategy: { title: "تطوير استراتيجية البيانات" },
        business: { title: "الذكاء التجاري" },
        advanced: { title: "التحليلات المتقدمة" },
        performance: { title: "قياس الأداء" },
        compliance: { title: "الامتثال التنظيمي" },
        change: { title: "إدارة التغيير" },
        support: { title: "الدعم والصيانة المستمرة" }
      },
      engineering: {
        title: "حلول وخدمات الهندسة",
        solutions: { title: "حلولنا" },
        appdev: { title: "تطوير التطبيقات المخصصة" },
        mobile: { title: "تطوير تطبيقات الهاتف المحمول عبر المنصات" },
        ai: { title: "حلول البيانات الذكية التوليدية" },
        data: { title: "إعداد البيانات" },
        aistrategy: { title: "تطوير استراتيجية الذكاء الاصطناعي وخطة الطريق" },
        aimodel: { title: "تطوير نماذج الذكاء الاصطناعي/التعلم الآلي مع حلول البيانات للذكاء الاصطناعي التوليدي" },
        prompt: { title: "هندسة النصوص التوجيهية" },
        finetuning: { title: "ضبط النماذج اللغوية الكبيرة" },
        assistants: { title: "المساعدون الأذكياء" },
        quality: { title: "هندسة الجودة" },
        testauto: { title: "أتمتة الاختبارات" },
        performance: { title: "اختبار الأداء" },
        security: { title: "اختبار الأمان" },
        globalization: { title: "اختبار العولمة" },
        compliance: { title: "اختبار الامتثال والتنظيم" },
        continuous: { title: "تكامل الاختبار المستمر" },
        functionality: { title: "اختبار الوظائف" },
        usability: { title: "اختبار سهولة الاستخدام وإمكانية الوصول" },
        api: { title: "اختبار واجهات برمجة التطبيقات" },
        cloud: { title: "تقنيات السحابة" },
        migration: { title: "الانتقال إلى السحابة" },
        cloudsecurity: { title: "أمان وحوكمة السحابة" },
        multicloud: { title: "شبكات متعددة السحابة" },
        devops: { title: "عمليات التطوير والعمليات" },
        digital: { title: "الهندسة الرقمية" },
        rpa: { title: "حلول أتمتة العمليات الروبوتية (RPA)" },
        uiux: { title: "واجهة المستخدم وتجربة المستخدم" },
        fullstack: { title: "التطوير الكامل وعمليات التطوير" },
        cms: { title: "برامج إدارة المحتوى" },
        software: { title: "تطوير البرمجيات" },
        mobility: { title: "الحركية" },
        cybersecurity: { title: "الأمن السيبراني" },
        identity: { title: "إدارة الهوية والوصول" },
        network: { title: "أمان الشبكة" },
        advanced: { title: "الأمن السيبراني المتقدم" },
        audit: { title: "مراجعة واستشارات الأمان" },
        solutions2: { title: "الحلول" },
        strategic: { title: "التخطيط الاستراتيجي للأعمال" },
        operational: { title: "تحسين الكفاءة التشغيلية" },
        techintegration: { title: "خدمات تكامل التقنية" }
      },
              profile: {
          title: "شركة مارلن",
          company: { title: "الملف التعريفي للشركة", subtitle: "مارلن كورب للاستشارات: شريكك في نمو الأعمال" },
          welcome: "مرحباً بكم في شركة مارلن، وهي شركة استشارات تقنية ديناميكية مملوكة للنساء ومقرها منطقة خليج سان فرانسيسكو النابضة بالحياة. مع التزام بتمكين الشركات من خلال حلول تقنية مبتكرة، تجمع شركة مارلن بين الخبرة الصناعية والمنظور المتنوع.",
          founded: "تأسست من قبل فريق من المحترفين ذوي الخبرة، نتخصص في تقديم خدمات تقنية مخصصة تدفع الكفاءة وتعزز النمو وتحسن التميز التشغيلي. مهمتنا هي سد الفجوة بين التقنية والأعمال، وتقديم رؤى وحلول استراتيجية للعملاء تلبي تحدياتهم الفريدة.",
          believe: "في شركة مارلن، نؤمن بقوة التعاون والشمولية، ونحن مكرسون لمساعدة المنظمات على الازدهار في المشهد الرقمي سريع الخطى اليوم. انضموا إلينا ونحن نعيد تعريف مستقبل الاستشارات التقنية، حل واحد في كل مرة.",
          based: "مارلن كورب مقرها في كوبرتينو (منطقة خليج سان فرانسيسكو)، كاليفورنيا. لدينا مكاتب شريكة في الهند وسنغافورة وكندا وألمانيا.",
          marln: {
            title: "مارلن كورب",
            intro: "اسم \"مارلن\" يجسد سرداً قوياً يركز على الصفات التي تعكس التزام الشركة بتمكين النساء في التقنية وتعزيز بيئة متنوعة وشاملة.",
            mentorship: "M تعني الإرشاد، مما يسلط الضوء على تفاني مارلن في دعم وتوجيه النساء في رحلاتهن المهنية. تعطي الشركة الأولوية لبرامج الإرشاد التي تمكّن المواهب النسائية، مما يضمن حصولهن على الموارد والتشجيع اللازمين للازدهار في صناعة التقنية.",
            advocacy: "A تمثل الدعوة، حيث تدعم مارلن بنشاط تقدم النساء في التقنية. من خلال الدعوة لفرص وتمثيل متساويين، تسعى مارلن إلى كسر الحواجز وإنشاء قوة عاملة أكثر شمولية.",
            resilience: "R تعني المرونة، مما يعكس قوة وتصميم النساء اللواتي يتنقلن في تحديات المشهد التقني. مارلن ملتزمة بتعزيز بيئة يتم فيها الاحتفال بالمرونة، مما يلهم النساء للتغلب على العقبات وتحقيق أهدافهن.",
            leadership: "L تعني القيادة، مما يؤكد على أهمية القيادة النسائية داخل المنظمة وفي القطاع التقني ككل. تزرع مارلن ثقافة لا تعزز النساء في الأدوار القيادية فحسب، بل تمكّنهن أيضاً من القيادة بثقة ورؤية.",
            nurturing: "N تجسد الرعاية، مما يمثل التزام مارلن بإنشاء مجتمع داعم للنساء في التقنية. من خلال رعاية المواهب وتشجيع التعاون، تعزز مارلن بيئة يمكن للنساء فيها الازدهار ودفع الابتكار.",
            together: "معاً، هذه الصفات تجسد روح شركة مارلن، وتوجه مهمتها لتمكين النساء من خلال حلول استشارات تقنية مبتكرة مع الدعوة لمستقبل أكثر إنصافاً وشمولية في التقنية."
          }
        },
        csr: {
          title: "المسؤولية الاجتماعية للشركات",
          subtitle: "تعرف على التزام مارلن بالمسؤولية الاجتماعية للشركات، بما في ذلك مبادراتنا لتعزيز التنوع ودعم المجتمعات.",
          initiatives: {
            title: "مبادرات المسؤولية الاجتماعية للشركات",
            subtitle: "برامج شاملة مصممة لخلق تأثير إيجابي عبر المجتمعات والبيئات.",
            diversity: {
              title: "برامج التنوع",
              text: "برامج شاملة مصممة لتعزيز التنوع والشمولية في قطاع التقنية."
            },
            community: {
              title: "دعم المجتمع",
              text: "مشاركة نشطة في المبادرات المجتمعية والبرامج الخيرية التي تحدث تأثيراً إيجابياً."
            },
            environmental: {
              title: "المسؤولية البيئية",
              text: "التزام بالممارسات المستدامة والمسؤولية البيئية في جميع عملياتنا."
            }
          },
          commitment: {
            title: "التزامنا بغد أفضل",
            subtitle: "نؤمن أن الشركات لديها مسؤولية لخلق تغيير إيجابي للأشخاص والمجتمعات والكوكب.",
            focusAreas: {
              title: "مجالات التركيز",
              environment: {
                title: "البيئة",
                text: "ملتزمون بتقليل البصمة الكربونية وتعزيز الممارسات المستدامة في جميع العمليات."
              },
              community: {
                title: "المجتمع",
                text: "دعم المجتمعات المحلية من خلال برامج التطوع والتبرعات الخيرية والشراكات المجتمعية."
              },
              education: {
                title: "التعليم",
                text: "الاستثمار في المبادرات التعليمية وتوفير فرص تطوير المهارات والتعلم."
              },
              ethics: {
                title: "الأخلاق والحوكمة",
                text: "الحفاظ على أعلى معايير الممارسات التجارية الأخلاقية والحوكمة الشفافة."
              }
            }
          },
          flagship: {
            title: "المبادرات الرائدة",
            subtitle: "برامجنا الرئيسية التي تقود التغيير الهادف وتخلق تأثيراً مستداماً.",
            greenFuture: {
              title: "مشروع المستقبل الأخضر",
              text: "مبادرتنا البيئية الشاملة التي تركز على تقليل انبعاثات الكربون وتنفيذ حلول الطاقة المتجددة وتعزيز الممارسات التجارية المستدامة في جميع العمليات."
            },
            techForAll: {
              title: "التقنية للجميع",
              text: "سد الفجوة الرقمية من خلال توفير الوصول للتقنية والتدريب على محو الأمية الرقمية وفرص التعليم في العلوم والتكنولوجيا والهندسة والرياضيات للمجتمعات المحرومة."
            },
            communityCare: {
              title: "مبادرة رعاية المجتمع",
              text: "دعم المجتمعات المحلية من خلال حملات الطعام والمبادرات الصحية وبرامج الإغاثة الطارئة بالشراكة مع المنظمات المحلية."
            }
          }
        }
    },
    en: {
      header: { about: "About us", services: "Services", company: "Company" },
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
      offices: { cupertino: "Cupertino, USA", jeddah: "Jeddah, Saudi Arabia", riyadh: "Riyadh, Saudi Arabia", bangaluru: "Bangaluru, India", capetown: "Capetown, South Africa" },
      about: {
        story: { title: "Our Story", intro: "The name \"Marln\" embodies a powerful narrative centered around the qualities that reflect the company's commitment to empowering women in technology and fostering a diverse, inclusive environment.", outro1: "Together, these qualities encapsulate the spirit of Marln Corporation, guiding its mission to empower women through innovative IT consulting solutions while advocating for a more equitable and inclusive future in technology.", outro2: "Today, we serve clients across 10+ countries, with over 50 enterprise deployments and a team of 200+ experts." },
        mission: { title: "Our Mission", text: "At Marln, our mission is to empower businesses with innovative, human-centered technology solutions that drive digital transformation and unlock growth." },
        benefits: {
          title: "Benefits to organizations by partnering with us:",
          card1: { title: "Tax Incentive", text: "Collaborating with a woman-minority owned business can offer your company tax incentives. The federal government provides tax benefits to organizations that partner with minority- and women-owned businesses for products and services." },
          card2: { title: "Reputation of Diverse Businesses", text: "Embracing diversity is essential for the healthy growth of any organization. Partnering with a woman-owned business demonstrates your company's commitment to collaborating with diverse partners. In return, we are dedicated to being a diverse talent community that delivers the results you need." }
        },
        certBanner: { title: "Marln Corporation is a certified 100% women and minority owned" },
        manager: { title: "Executive Director" }
      },
      industry: {
        title: "INDUSTRY SOLUTIONS",
        exploreSolutions: "Explore Solutions",
        automotive: { title: "Automotive", text: "The automotive industry is constantly evolving, with the emergence of new technologies such as autonomous vehicles, electric vehicles, and advanced driver-assistance systems (ADAS)." },
        banking: { title: "Banking", text: "Banking technology staffing solutions are a critical component of the banking industry. Banks need to have the right people in place to develop, implement, and maintain their technology systems." },
        consumer: { title: "Consumer Goods & Services", text: "Marln Corp can help CGS companies find and recruit qualified professionals with these in-demand skillsets. Staffing agencies can also provide temporary and contract staffing options." },
        communications: { title: "Communications & Media", text: "Video Production and Editing: With the growing demand for video content across various platforms, video production and editing skills are becoming increasingly valuable." },
        healthcare: { title: "Healthcare", text: "Electronic Health Records (EHR) and Health Information Technology (HIT): Proficiency in EHR systems and HIT tools is essential for managing patient records and ensuring compliance." },
        hitech: { title: "Hi-Tech", text: "High-tech companies rely heavily on skilled professionals with expertise in various technical domains to develop, implement, and maintain innovative products and services." },
        lifesciences: { title: "Life Sciences", text: "Life sciences companies rely on a diverse range of skilled professionals with expertise in various technical domains to make advancements in medicine and biotechnology." },
        publicservice: { title: "Public Service", text: "The public sector is increasingly reliant on technology to meet its objectives, and this demand for technical skills is only going to grow in the years to come." },
        retail: { title: "Retail", text: "Retail businesses of all sizes rely on a diverse range of technical skills: Point-of-Sale (POS) Systems, Inventory Management, and Supply Chain Management." },
        travel: { title: "Travel & Tourism", text: "The travel industry is constantly evolving, with the emergence of new technologies such as artificial intelligence (AI), machine learning (ML), and data analytics." },
        government: { title: "Government", text: "We help government agencies migrate to the cloud to enable greater flexibility and scalability. Our team can help you choose the best cloud solution for your needs." },
        utilities: { title: "Utilities", text: "We help utility companies migrate to the cloud to enable greater flexibility and scalability. Our team can help you choose the best cloud solution for your business." }
      },
      ai: {
        title: "Empowering Your Business with AI Powered Consulting Services",
        strategic: { title: "Strategic Business Planning" },
        operational: { title: "Operational Efficiency Improvement" },
        financial: { title: "Financial Management Consulting" },
        marketing: { title: "Marketing Strategy Development" },
        hr: { title: "Human Resources Solutions" },
        technology: { title: "Technology Integration Services" },
        legal: { title: "Legal and Compliance" },
        regulatory: { title: "Regulatory Compliance Assessment" },
        policy: { title: "Policy Development and Implementation" },
        training: { title: "Training and Awareness Programs" },
        risk: { title: "Risk Management and Mitigation" },
        contract: { title: "Contract Management" },
        data: { title: "Data Protection and Privacy Compliance" },
        monitoring: { title: "Monitoring and Reporting" },
        research: { title: "Legal Research and Advisory Services" },
        thirdparty: { title: "Third-Party Risk Management" }
      },
      data: {
        title: "Data Engineering Expertise for Every Business Requirement",
        modeling: { title: "Data Modeling and Visualization" },
        management: { title: "Data Management" },
        strategy: { title: "Data Strategy Development" },
        business: { title: "Business Intelligence" },
        advanced: { title: "Advanced Analytics" },
        performance: { title: "Performance Measurement" },
        compliance: { title: "Regulatory Compliance" },
        change: { title: "Change Management" },
        support: { title: "Ongoing Support and Maintenance" }
      },
      engineering: {
        title: "Engineering Solutions and Services",
        solutions: { title: "Our Solutions" },
        appdev: { title: "Tailored Application Development" },
        mobile: { title: "Cross-Platform Mobile App Development" },
        ai: { title: "Generative AI Data Solutions" },
        data: { title: "Data Preparation" },
        aistrategy: { title: "AI Strategy and Roadmap Development" },
        aimodel: { title: "AI/ML Model Development With Data Solutions for Generative AI" },
        prompt: { title: "Prompt Engineering" },
        finetuning: { title: "Fine tuning LLMs" },
        assistants: { title: "Intelligent Assistants" },
        quality: { title: "Quality Engineering" },
        testauto: { title: "Test Automation" },
        performance: { title: "Performance Testing" },
        security: { title: "Security Testing" },
        globalization: { title: "Globalization Testing" },
        compliance: { title: "Compliance and Regulatory Testing" },
        continuous: { title: "Continuous Testing Integration" },
        functionality: { title: "Functionality Testing" },
        usability: { title: "Usability and Accessibility Testing" },
        api: { title: "API Testing" },
        cloud: { title: "Cloud Technologies" },
        migration: { title: "Cloud Migration" },
        cloudsecurity: { title: "Cloud Security and Governance" },
        multicloud: { title: "Multicloud Networking" },
        devops: { title: "Dev Ops and Operations" },
        digital: { title: "Digital Engineering" },
        rpa: { title: "Robotic Process Automation (RPA) Solutions" },
        uiux: { title: "UI/UX" },
        fullstack: { title: "Full Stack & Dev Ops" },
        cms: { title: "Content Management Software" },
        software: { title: "Software Development" },
        mobility: { title: "Mobility" },
        cybersecurity: { title: "Cybersecurity" },
        identity: { title: "Identity And Access Management" },
        network: { title: "Network Security" },
        advanced: { title: "Advanced Cybersec" },
        audit: { title: "Security Audit and Consulting" },
        solutions2: { title: "Solutions" },
        strategic: { title: "Strategic Business Planning" },
        operational: { title: "Operational Efficiency Improvement" },
        techintegration: { title: "Technology Integration Services" }
      },
      profile: {
        title: "Marln Corporation",
        company: { title: "Company Profile", subtitle: "Marln Corp Consulting: Your Partner in Business Growth" },
        welcome: "Welcome to Marln Corporation, a dynamic women-owned IT consulting company based in the vibrant San Francisco Bay Area. With a commitment to empowering businesses through innovative technology solutions, Marln Corporation blends industry expertise with a diverse perspective.",
        founded: "Founded by a team of experienced professionals, we specialize in delivering tailored IT services that drive efficiency, foster growth, and enhance operational excellence. Our mission is to bridge the gap between technology and business, providing clients with strategic insights and solutions that meet their unique challenges.",
        believe: "At Marln Corporation, we believe in the power of collaboration and inclusivity, and we are dedicated to helping organizations thrive in today's fast-paced digital landscape. Join us as we redefine the future of IT consulting, one solution at a time.",
        based: "Marln Corp is based in Cupertino (San Francisco Bay Area), California. We have partner offices in India, Singapore, Canada and Germany.",
        marln: {
          title: "Marln Corp",
          intro: "The name \"Marln\" embodies a powerful narrative centered around the qualities that reflect the company's commitment to empowering women in technology and fostering a diverse, inclusive environment.",
          mentorship: "M stands for Mentorship, highlighting Marln's dedication to supporting and guiding women in their professional journeys. The company prioritizes mentorship programs that empower female talent, ensuring they have the resources and encouragement needed to thrive in the tech industry.",
          advocacy: "A represents Advocacy, as Marln actively champions the advancement of women in technology. By advocating for equitable opportunities and representation, Marln seeks to break down barriers and create a more inclusive workforce.",
          resilience: "R signifies Resilience, reflecting the strength and determination of women navigating the challenges of the tech landscape. Marln is committed to fostering an environment where resilience is celebrated, inspiring women to overcome obstacles and achieve their goals.",
          leadership: "L stands for Leadership, emphasizing the importance of female leadership within the organization and the tech sector as a whole. Marln cultivates a culture that not only promotes women into leadership roles but also empowers them to lead with confidence and vision.",
          nurturing: "N embodies Nurturing, representing Marln's commitment to creating a supportive community for women in tech. By nurturing talent and encouraging collaboration, Marln fosters an environment where women can flourish and drive innovation.",
          together: "Together, these qualities encapsulate the spirit of Marln Corporation, guiding its mission to empower women through innovative IT consulting solutions while advocating for a more equitable and inclusive future in technology."
        }
      },
      csr: {
        title: "Corporate Social Responsibility",
        subtitle: "Learn about Marln's commitment to corporate social responsibility, including our initiatives to promote diversity and support communities.",
        initiatives: {
          title: "Our CSR Initiatives",
          subtitle: "Comprehensive programs designed to create positive impact across communities and environments.",
          diversity: {
            title: "Diversity Programs",
            text: "Comprehensive programs designed to promote diversity and inclusion in the technology sector."
          },
          community: {
            title: "Community Support",
            text: "Active involvement in community initiatives and charitable programs that make a positive impact."
          },
          environmental: {
            title: "Environmental Responsibility",
            text: "Commitment to sustainable practices and environmental responsibility in all our operations."
          }
        },
        commitment: {
          title: "Our Commitment to a Better Tomorrow",
          subtitle: "We believe businesses have a responsibility to create positive change for people, communities, and the planet.",
          focusAreas: {
            title: "Focus Areas",
            environment: {
              title: "Environment",
              text: "Committed to reducing our carbon footprint and promoting sustainable practices across all operations."
            },
            community: {
              title: "Community",
              text: "Supporting local communities through volunteer programs, charitable donations, and community partnerships."
            },
            education: {
              title: "Education",
              text: "Investing in educational initiatives and providing opportunities for skill development and learning."
            },
            ethics: {
              title: "Ethics & Governance",
              text: "Maintaining the highest standards of ethical business practices and transparent governance."
            }
          }
        },
        flagship: {
          title: "Flagship Initiatives",
          subtitle: "Our key programs that drive meaningful change and create lasting impact.",
          greenFuture: {
            title: "Green Future Project",
            text: "Our comprehensive environmental initiative focused on reducing carbon emissions, implementing renewable energy solutions, and promoting sustainable business practices across all operations."
          },
          techForAll: {
            title: "Tech for All",
            text: "Bridging the digital divide by providing technology access, digital literacy training, and STEM education opportunities to underserved communities."
          },
          communityCare: {
            title: "Community Care Drive",
            text: "Supporting local communities through food drives, healthcare initiatives, and emergency relief programs in partnership with local organizations."
          }
        }
      }
    }
  };


  function getSavedLang(){
    try { return localStorage.getItem('site-lang') || DEFAULT_LANG; } catch(_) { return DEFAULT_LANG; }
  }
  function saveLang(lang){
    try { localStorage.setItem('site-lang', lang); } catch(_) {}
  }
  async function loadTranslations(lang){
    // If running from file:// and we have an embedded pack, use it to avoid fetch restrictions
    if (location.protocol === 'file:' && EMBEDDED[lang]) {
      return EMBEDDED[lang];
    }
    if(CACHE[lang]) return CACHE[lang];
    try {
      const res = await fetch(`i18n/${lang}.json`, { cache: 'no-cache' });
      if(!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      CACHE[lang] = json;
      return json;
    } catch(err){
      if(lang !== DEFAULT_LANG) {
        // Try fallback to embedded or English
        if (EMBEDDED[lang]) return EMBEDDED[lang];
        return loadTranslations(DEFAULT_LANG);
      }
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

    // Footer (left navigational labels where present)
    applyText('#footer_menu_4 > li > a', tr, 'footer.social');
    applyText('#footer_menu_5 > li > a', tr, 'footer.certifications');
    applyText('.offices .offices-title', tr, 'footer.officesTitle');
    applyText('.offices-list li:nth-child(1) .offices-item p', tr, 'offices.cupertino');
    applyText('.offices-list li:nth-child(2) .offices-item p', tr, 'offices.jeddah');
    applyText('.offices-list li:nth-child(3) .offices-item p', tr, 'offices.riyadh');
    applyText('.offices-list li:nth-child(4) .offices-item p', tr, 'offices.bangaluru');
    applyText('.offices-list li:nth-child(5) .offices-item p', tr, 'offices.capetown');
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

  async function setLanguage(lang){
    const tr = await loadTranslations(lang);
    setDirAndLang(lang);
    setButtonLabelFromLang(lang);

    // Decide which page we're on using unique anchors
    if(document.querySelector('.services-hero-section-v_2')){
      applyIndexTranslations(tr);
    }
    if(document.querySelector('main.about-content')){
      applyAboutTranslations(tr);
    }
    if(document.querySelector('main.industry-content')){
      applyIndustryTranslations(tr);
    }
    if(document.querySelector('h1.fade-in') && document.querySelector('h1.fade-in').textContent.includes('AI Powered Consulting')){
      applyAiConsultingTranslations(tr);
    }
    if(document.querySelector('h1.fade-in') && document.querySelector('h1.fade-in').textContent.includes('Data Engineering Expertise')){
      applyDataAnalyticsTranslations(tr);
    }
    if(document.querySelector('h1.fade-in') && document.querySelector('h1.fade-in').textContent.includes('Engineering Solutions')){
      applyEngineeringServicesTranslations(tr);
    }
    if(document.querySelector('h1[style*="font-size: 4rem"]') && document.querySelector('h1[style*="font-size: 4rem"]').textContent.includes('Marln')){
      applyProfileTranslations(tr);
    }
    if(document.querySelector('main.csr-content')){
      applyCsrTranslations(tr);
    }
    saveLang(lang);
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