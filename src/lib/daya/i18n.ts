// ─────────────────────────────────────────────────────────────────────────────
// DAYA MULTILINGUAL SUPPORT
// Supports 8 languages — built for Indian families.
// UI strings, quick-chips, and the AI are all language-aware.
// ─────────────────────────────────────────────────────────────────────────────

export type SupportedLanguage =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "kn"
  | "gu";

export const LANGUAGE_META: Record<
  SupportedLanguage,
  { name: string; nativeName: string; flag: string; rtl?: boolean }
> = {
  en: { name: "English", nativeName: "English", flag: "🇬🇧" },
  hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  ta: { name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  te: { name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  bn: { name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  mr: { name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  kn: { name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  gu: { name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
};

// ─────────────────────────────────────────────────────────────────────────────
// UI TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────

export type UIStrings = {
  // Header
  header_subtitle: string;
  // Input
  placeholder: string;
  send: string;
  stop: string;
  // Quick chips
  chip_hard_day: string;
  chip_plan_tomorrow: string;
  chip_good_day: string;
  chip_exhausted: string;
  chip_food_help: string;
  chip_sleep_rough: string;
  chip_meltdown: string;
  chip_recipe: string;
  // Check-in
  checkin_button: string;
  checkin_title: string;
  checkin_submit: string;
  checkin_cancel: string;
  checkin_saving: string;
  // Tabs
  tab_chat: string;
  tab_plan: string;
  tab_report: string;
  // Disclaimer
  disclaimer: string;
  // Greeting
  welcome_title: string;
  welcome_sub: string;
  // Misc
  typing: string;
  language_select: string;
};

export const UI_TRANSLATIONS: Record<SupportedLanguage, UIStrings> = {
  en: {
    header_subtitle: "Behavioral intelligence companion for",
    placeholder: "Share what happened today...",
    send: "Send",
    stop: "Stop",
    chip_hard_day: "Hard day today",
    chip_plan_tomorrow: "Plan tomorrow",
    chip_good_day: "Great day! 🎉",
    chip_exhausted: "I'm exhausted",
    chip_food_help: "Food / meal help",
    chip_sleep_rough: "Sleep was rough",
    chip_meltdown: "Meltdown happened",
    chip_recipe: "Recipe ideas",
    checkin_button: "Check-in",
    checkin_title: "Daily Check-in",
    checkin_submit: "Save & send to DAYA",
    checkin_cancel: "Cancel",
    checkin_saving: "Saving...",
    tab_chat: "Chat",
    tab_plan: "Daily Plan",
    tab_report: "Report",
    disclaimer:
      "DAYA supports observation and parent reflection. It does not diagnose, treat, or replace your care team.",
    welcome_title: "Good to see you.",
    welcome_sub: "Share how today went and DAYA will help you plan, reflect, and feel supported.",
    typing: "DAYA is thinking...",
    language_select: "Language",
  },
  hi: {
    header_subtitle: "के लिए व्यवहार सहायक",
    placeholder: "आज क्या हुआ साझा करें...",
    send: "भेजें",
    stop: "रोकें",
    chip_hard_day: "आज कठिन दिन था",
    chip_plan_tomorrow: "कल की योजना बनाएं",
    chip_good_day: "बहुत अच्छा दिन! 🎉",
    chip_exhausted: "मैं थकी/थका हुआ हूं",
    chip_food_help: "भोजन में मदद",
    chip_sleep_rough: "नींद ठीक नहीं थी",
    chip_meltdown: "मेल्टडाउन हुआ",
    chip_recipe: "रेसिपी के सुझाव",
    checkin_button: "चेक-इन",
    checkin_title: "दैनिक चेक-इन",
    checkin_submit: "सहेजें और DAYA को भेजें",
    checkin_cancel: "रद्द करें",
    checkin_saving: "सहेजा जा रहा है...",
    tab_chat: "चैट",
    tab_plan: "दैनिक योजना",
    tab_report: "रिपोर्ट",
    disclaimer:
      "DAYA माता-पिता के अवलोकन और चिंतन में मदद करता है। यह निदान, उपचार या देखभाल टीम का विकल्प नहीं है।",
    welcome_title: "आपको देखकर अच्छा लगा।",
    welcome_sub: "आज कैसा रहा बताएं और DAYA आपको योजना बनाने और समर्थन पाने में मदद करेगा।",
    typing: "DAYA सोच रहा है...",
    language_select: "भाषा",
  },
  ta: {
    header_subtitle: "நடத்தை புத்திசாலி துணைவர்",
    placeholder: "இன்று என்ன நடந்தது என்று பகிரவும்...",
    send: "அனுப்பு",
    stop: "நிறுத்து",
    chip_hard_day: "இன்று கடினமான நாள்",
    chip_plan_tomorrow: "நாளை திட்டமிடு",
    chip_good_day: "அருமையான நாள்! 🎉",
    chip_exhausted: "நான் சோர்வாக இருக்கிறேன்",
    chip_food_help: "உணவு உதவி",
    chip_sleep_rough: "தூக்கம் சரியில்லை",
    chip_meltdown: "மெல்ட்டவுன் ஆனது",
    chip_recipe: "சமையல் யோசனைகள்",
    checkin_button: "செக்-இன்",
    checkin_title: "தினசரி செக்-இன்",
    checkin_submit: "சேமித்து DAYA-க்கு அனுப்பு",
    checkin_cancel: "ரத்து செய்",
    checkin_saving: "சேமிக்கிறது...",
    tab_chat: "அரட்டை",
    tab_plan: "தினசரி திட்டம்",
    tab_report: "அறிக்கை",
    disclaimer:
      "DAYA பெற்றோரின் கவனிப்பு மற்றும் சிந்தனைக்கு உதவுகிறது. இது நோய் கண்டறிதல் அல்ல.",
    welcome_title: "வருக!",
    welcome_sub: "இன்று எப்படி சென்றது என்று பகிரவும், DAYA உதவும்.",
    typing: "DAYA யோசிக்கிறது...",
    language_select: "மொழி",
  },
  te: {
    header_subtitle: "ప్రవర్తన తెలివైన సహచరుడు",
    placeholder: "ఈరోజు ఏం జరిగిందో పంచుకోండి...",
    send: "పంపు",
    stop: "ఆపు",
    chip_hard_day: "ఈరోజు కష్టంగా ఉంది",
    chip_plan_tomorrow: "రేపటికి ప్లాన్ చేయండి",
    chip_good_day: "గొప్ప రోజు! 🎉",
    chip_exhausted: "నేను అలసిపోయాను",
    chip_food_help: "ఆహారం సహాయం",
    chip_sleep_rough: "నిద్ర సరిగా లేదు",
    chip_meltdown: "మెల్ట్‌డౌన్ జరిగింది",
    chip_recipe: "వంట ఆలోచనలు",
    checkin_button: "చెక్-ఇన్",
    checkin_title: "రోజువారీ చెక్-ఇన్",
    checkin_submit: "సేవ్ చేసి DAYA కి పంపండి",
    checkin_cancel: "రద్దు చేయండి",
    checkin_saving: "సేవ్ అవుతోంది...",
    tab_chat: "చాట్",
    tab_plan: "రోజువారీ ప్లాన్",
    tab_report: "నివేదిక",
    disclaimer:
      "DAYA తల్లిదండ్రుల పర్యవేక్షణకు మద్దతు ఇస్తుంది. ఇది వైద్య నిపుణుల స్థానంలో లేదు.",
    welcome_title: "స్వాగతం.",
    welcome_sub: "ఈరోజు ఎలా జరిగిందో పంచుకోండి, DAYA మీకు సహాయం చేస్తుంది.",
    typing: "DAYA ఆలోచిస్తోంది...",
    language_select: "భాష",
  },
  bn: {
    header_subtitle: "আচরণ বুদ্ধিমান সহায়ক",
    placeholder: "আজ কী হয়েছে শেয়ার করুন...",
    send: "পাঠান",
    stop: "থামুন",
    chip_hard_day: "আজ কঠিন দিন",
    chip_plan_tomorrow: "আগামীকালের পরিকল্পনা",
    chip_good_day: "দারুণ দিন! 🎉",
    chip_exhausted: "আমি ক্লান্ত",
    chip_food_help: "খাবার সাহায্য",
    chip_sleep_rough: "ঘুম ভালো ছিল না",
    chip_meltdown: "মেল্টডাউন হয়েছে",
    chip_recipe: "রেসিপি পরামর্শ",
    checkin_button: "চেক-ইন",
    checkin_title: "দৈনিক চেক-ইন",
    checkin_submit: "সংরক্ষণ করুন এবং DAYA-কে পাঠান",
    checkin_cancel: "বাতিল",
    checkin_saving: "সংরক্ষণ হচ্ছে...",
    tab_chat: "চ্যাট",
    tab_plan: "দৈনিক পরিকল্পনা",
    tab_report: "রিপোর্ট",
    disclaimer:
      "DAYA অভিভাবকদের পর্যবেক্ষণে সহায়তা করে। এটি রোগ নির্ণয় বা চিকিৎসা নয়।",
    welcome_title: "স্বাগতম!",
    welcome_sub: "আজ কেমন কাটল জানান, DAYA আপনাকে পরিকল্পনা করতে সাহায্য করবে।",
    typing: "DAYA ভাবছে...",
    language_select: "ভাষা",
  },
  mr: {
    header_subtitle: "वर्तणूक बुद्धिमत्ता सहयोगी",
    placeholder: "आज काय झालं ते सांगा...",
    send: "पाठवा",
    stop: "थांबवा",
    chip_hard_day: "आज कठीण दिवस होता",
    chip_plan_tomorrow: "उद्याची योजना करा",
    chip_good_day: "खूप छान दिवस! 🎉",
    chip_exhausted: "मी थकलेलो/थकलेली आहे",
    chip_food_help: "जेवणाची मदत",
    chip_sleep_rough: "झोप चांगली नव्हती",
    chip_meltdown: "मेल्टडाउन झाला",
    chip_recipe: "रेसिपी सुचवा",
    checkin_button: "चेक-इन",
    checkin_title: "दैनिक चेक-इन",
    checkin_submit: "जतन करा आणि DAYA ला पाठवा",
    checkin_cancel: "रद्द करा",
    checkin_saving: "जतन होत आहे...",
    tab_chat: "संवाद",
    tab_plan: "दैनिक योजना",
    tab_report: "अहवाल",
    disclaimer:
      "DAYA पालकांच्या निरीक्षणास मदत करतो. हे निदान किंवा उपचार नाही.",
    welcome_title: "तुम्हाला भेटून आनंद झाला.",
    welcome_sub: "आज कसं गेलं सांगा, DAYA तुम्हाला मदत करेल.",
    typing: "DAYA विचार करत आहे...",
    language_select: "भाषा",
  },
  kn: {
    header_subtitle: "ನಡವಳಿಕೆ ಬುದ್ಧಿಮತ್ತೆ ಸಹಾಯಕ",
    placeholder: "ಇಂದು ಏನಾಯಿತು ಎಂದು ಹಂಚಿಕೊಳ್ಳಿ...",
    send: "ಕಳಿಸಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    chip_hard_day: "ಇಂದು ಕಷ್ಟದ ದಿನ",
    chip_plan_tomorrow: "ನಾಳೆ ಯೋಜನೆ ಮಾಡಿ",
    chip_good_day: "ಅದ್ಭುತ ದಿನ! 🎉",
    chip_exhausted: "ನಾನು ದಣಿದಿದ್ದೇನೆ",
    chip_food_help: "ಆಹಾರ ಸಹಾಯ",
    chip_sleep_rough: "ನಿದ್ರೆ ಸರಿಯಾಗಿರಲಿಲ್ಲ",
    chip_meltdown: "ಮೆಲ್ಟ್‌ಡೌನ್ ಆಯಿತು",
    chip_recipe: "ಪಾಕವಿಧಾನ ಸಲಹೆಗಳು",
    checkin_button: "ಚೆಕ್-ಇನ್",
    checkin_title: "ದೈನಂದಿನ ಚೆಕ್-ಇನ್",
    checkin_submit: "ಉಳಿಸಿ ಮತ್ತು DAYA ಗೆ ಕಳಿಸಿ",
    checkin_cancel: "ರದ್ದು ಮಾಡಿ",
    checkin_saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    tab_chat: "ಚಾಟ್",
    tab_plan: "ದೈನಂದಿನ ಯೋಜನೆ",
    tab_report: "ವರದಿ",
    disclaimer:
      "DAYA ಪೋಷಕರ ಅವಲೋಕನಕ್ಕೆ ಬೆಂಬಲ ನೀಡುತ್ತದೆ. ಇದು ರೋಗ ನಿರ್ಣಯ ಅಲ್ಲ.",
    welcome_title: "ಸ್ವಾಗತ!",
    welcome_sub: "ಇಂದು ಹೇಗೆ ನಡೆಯಿತು ಎಂದು ಹಂಚಿಕೊಳ್ಳಿ, DAYA ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    typing: "DAYA ಯೋಚಿಸುತ್ತಿದೆ...",
    language_select: "ಭಾಷೆ",
  },
  gu: {
    header_subtitle: "વ્યવહારિક બુદ્ધિ સહાયક",
    placeholder: "આજે શું થયું તે શેર કરો...",
    send: "મોકલો",
    stop: "રોકો",
    chip_hard_day: "આજ કઠિન દિવસ હતો",
    chip_plan_tomorrow: "કાલ માટે યોજના",
    chip_good_day: "ખૂબ સારો દિવસ! 🎉",
    chip_exhausted: "હું થાકી/થાક્યો ગઈ/ગયો",
    chip_food_help: "ભોજન સહાય",
    chip_sleep_rough: "ઊઘ સારી ન હતી",
    chip_meltdown: "મેલ્ટડાઉન થયો",
    chip_recipe: "રેસિપી સૂચનો",
    checkin_button: "ચેક-ઇન",
    checkin_title: "દૈનિક ચેક-ઇન",
    checkin_submit: "સાચવો અને DAYA ને મોકલો",
    checkin_cancel: "રદ કરો",
    checkin_saving: "સાચવી રહ્યા છીએ...",
    tab_chat: "ચેટ",
    tab_plan: "દૈનિક યોજના",
    tab_report: "અહેવાલ",
    disclaimer:
      "DAYA માતા-પિતાના અવલોકન અને ચિંતનને ટેકો આપે છે. તે નિદાન કે ઉપચાર નથી.",
    welcome_title: "સ્વાગત છે!",
    welcome_sub: "આજ કેવો ગયો જણાવો, DAYA તમને મદદ કરશે.",
    typing: "DAYA વિચારી રહ્યો છે...",
    language_select: "ભાષા",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE INSTRUCTION FOR AI
// Injected into the system prompt so the AI responds in the chosen language.
// ─────────────────────────────────────────────────────────────────────────────

export function getLanguageInstruction(lang: SupportedLanguage): string {
  if (lang === "en") return "";

  const meta = LANGUAGE_META[lang];
  return `\nLANGUAGE INSTRUCTION: The parent has selected ${meta.name} (${meta.nativeName}) as their preferred language. You MUST respond entirely in ${meta.name}. Use natural, warm, conversational ${meta.name} — not literal translation. Emotional nuances should feel authentic to the language. All section headers (💛, 🧠, 🌱, 🗓️, etc.) should be followed by ${meta.name} text. If you quote specific data (numbers, dates), those may remain in numerals.\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK CHIPS — contextual pre-built messages
// ─────────────────────────────────────────────────────────────────────────────

export function getQuickChips(
  t: UIStrings,
  childName: string,
  lang: SupportedLanguage
): Array<{ label: string; message: string; emoji: string }> {
  // Messages sent to AI are always in English for consistency
  const chips = [
    { label: t.chip_hard_day, message: `${childName} had a really hard day today and I'm struggling with what happened.`, emoji: "😔" },
    { label: t.chip_plan_tomorrow, message: `Can you help me plan tomorrow based on today's check-in data?`, emoji: "🗓️" },
    { label: t.chip_good_day, message: `We had a great day today! ${childName} was doing really well.`, emoji: "🎉" },
    { label: t.chip_exhausted, message: `I'm exhausted and feeling overwhelmed. Can you help me figure out tomorrow?`, emoji: "💤" },
    { label: t.chip_food_help, message: `I need help with meal ideas for ${childName} — food has been difficult lately.`, emoji: "🍽️" },
    { label: t.chip_sleep_rough, message: `Sleep was rough last night for ${childName}. What should I watch for today?`, emoji: "🌙" },
    { label: t.chip_meltdown, message: `${childName} had a meltdown today. Can you help me understand what happened and plan recovery?`, emoji: "🌊" },
    { label: t.chip_recipe, message: `Can you suggest some sensory-friendly recipe ideas for ${childName}?`, emoji: "🧑‍🍳" },
  ];

  // For non-English, prefix the AI message with a language hint so the AI knows to respond in their language
  if (lang !== "en") {
    const meta = LANGUAGE_META[lang];
    return chips.map((c) => ({
      ...c,
      message: `[Respond in ${meta.name}] ${c.message}`,
    }));
  }

  return chips;
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSIST LANGUAGE PREFERENCE
// ─────────────────────────────────────────────────────────────────────────────

export function saveLanguagePreference(lang: SupportedLanguage): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("daya_language", lang);
  }
}

export function loadLanguagePreference(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("daya_language") as SupportedLanguage | null;
  return stored && stored in LANGUAGE_META ? stored : "en";
}
