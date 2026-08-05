// Simple i18n system — English + Hindi implemented, others coming soon.

export type LangCode = 'en' | 'hi' | 'mr' | 'pa' | 'ta' | 'te' | 'kn' | 'gu'

export interface LangMeta {
  code: LangCode
  label: string
  nativeLabel: string
  available: boolean
}

export const LANGUAGES: LangMeta[] = [
  { code: 'en', label: 'English',    nativeLabel: 'English',              available: true  },
  { code: 'hi', label: 'Hindi',      nativeLabel: 'हिंदी',                available: true  },
  { code: 'mr', label: 'Marathi',    nativeLabel: 'मराठी',                available: false },
  { code: 'pa', label: 'Punjabi',    nativeLabel: 'ਪੰਜਾਬੀ',              available: false },
  { code: 'ta', label: 'Tamil',      nativeLabel: 'தமிழ்',               available: false },
  { code: 'te', label: 'Telugu',     nativeLabel: 'తెలుగు',              available: false },
  { code: 'kn', label: 'Kannada',    nativeLabel: 'ಕನ್ನಡ',              available: false },
  { code: 'gu', label: 'Gujarati',   nativeLabel: 'ગુજરાતી',             available: false },
]

// ─── Translation strings ──────────────────────────────────────────────────────
export type TranslationKey =
  // Navbar
  | 'nav.home' | 'nav.features' | 'nav.solutions' | 'nav.dashboard'
  | 'nav.expenses' | 'nav.schemes' | 'nav.pricing' | 'nav.resources'
  | 'nav.about' | 'nav.contact' | 'nav.getStarted' | 'nav.signOut' | 'nav.login'
  // Profile
  | 'profile.title' | 'profile.edit' | 'profile.save' | 'profile.saved'
  | 'profile.name' | 'profile.phone' | 'profile.location' | 'profile.language'
  | 'profile.role' | 'profile.email' | 'profile.changePhoto'
  // Hero
  | 'hero.eyebrow' | 'hero.title1' | 'hero.title2' | 'hero.subtitle'
  | 'hero.cta' | 'hero.secondary'
  // Scanner
  | 'scanner.title' | 'scanner.subtitle' | 'scanner.upload'
  | 'scanner.camera' | 'scanner.drag' | 'scanner.gallery'
  | 'scanner.diagnosing' | 'scanner.done' | 'scanner.another'
  | 'scanner.report' | 'scanner.confidence'
  // Weather
  | 'weather.eyebrow' | 'weather.title1' | 'weather.title2'
  | 'weather.advice' | 'weather.sprayWindow' | 'weather.forecast'
  // Common
  | 'common.loading' | 'common.error' | 'common.retry'

type Translations = Record<TranslationKey, string>

export const translations: Record<LangCode, Translations> = {
  en: {
    // Navbar
    'nav.home':        'Home',
    'nav.features':    'Features',
    'nav.solutions':   'Solutions',
    'nav.dashboard':   'Dashboard',
    'nav.expenses':    'Expenses',
    'nav.schemes':     'Schemes',
    'nav.pricing':     'Pricing',
    'nav.resources':   'Resources',
    'nav.about':       'About',
    'nav.contact':     'Contact',
    'nav.getStarted':  'Get Started',
    'nav.signOut':     'Sign out',
    'nav.login':       'Login',
    // Profile
    'profile.title':       'Your Profile',
    'profile.edit':        'Edit Profile',
    'profile.save':        'Save Profile',
    'profile.saved':       'Saved!',
    'profile.name':        'Full Name',
    'profile.phone':       'Phone Number',
    'profile.location':    'Location / Village',
    'profile.language':    'Language',
    'profile.role':        'Role',
    'profile.email':       'Email (cannot change)',
    'profile.changePhoto': 'Change photo',
    // Hero
    'hero.eyebrow':    'AI-Powered Farming',
    'hero.title1':     'Grow Smarter,',
    'hero.title2':     'Harvest Better.',
    'hero.subtitle':   'AI disease detection, weather intelligence, and government schemes — all in one platform built for Indian farmers.',
    'hero.cta':        'Start for Free',
    'hero.secondary':  'See how it works',
    // Scanner
    'scanner.title':      'Detect disease in seconds.',
    'scanner.subtitle':   "Point, capture, scan. Sasya's computer-vision engine reads your crop's health and hands you a complete action plan.",
    'scanner.upload':     'Upload',
    'scanner.camera':     'Camera',
    'scanner.drag':       'Drag & drop your leaf photo',
    'scanner.gallery':    'Gallery',
    'scanner.diagnosing': 'Diagnosing',
    'scanner.done':       'Diagnosis complete',
    'scanner.another':    '← Scan another leaf',
    'scanner.report':     'AI Report',
    'scanner.confidence': 'Confidence',
    // Weather
    'weather.eyebrow':  'Weather Intelligence',
    'weather.title1':   'Know the sky,',
    'weather.title2':   'before the sky changes.',
    'weather.advice':   'AI Farming Advice',
    'weather.sprayWindow': 'Best Spray Window',
    'weather.forecast': 'Day Forecast',
    // Common
    'common.loading': 'Loading…',
    'common.error':   'Something went wrong.',
    'common.retry':   'Retry',
  },

  hi: {
    // Navbar
    'nav.home':        'होम',
    'nav.features':    'सुविधाएँ',
    'nav.solutions':   'समाधान',
    'nav.dashboard':   'डैशबोर्ड',
    'nav.expenses':    'खर्च',
    'nav.schemes':     'योजनाएँ',
    'nav.pricing':     'मूल्य',
    'nav.resources':   'संसाधन',
    'nav.about':       'हमारे बारे में',
    'nav.contact':     'संपर्क',
    'nav.getStarted':  'शुरू करें',
    'nav.signOut':     'साइन आउट',
    'nav.login':       'लॉगिन',
    // Profile
    'profile.title':       'आपकी प्रोफ़ाइल',
    'profile.edit':        'प्रोफ़ाइल संपादित करें',
    'profile.save':        'प्रोफ़ाइल सहेजें',
    'profile.saved':       'सहेजा गया!',
    'profile.name':        'पूरा नाम',
    'profile.phone':       'फ़ोन नंबर',
    'profile.location':    'स्थान / गाँव',
    'profile.language':    'भाषा',
    'profile.role':        'भूमिका',
    'profile.email':       'ईमेल (बदला नहीं जा सकता)',
    'profile.changePhoto': 'फ़ोटो बदलें',
    // Hero
    'hero.eyebrow':    'AI-संचालित खेती',
    'hero.title1':     'समझदारी से उगाएँ,',
    'hero.title2':     'बेहतर फ़सल काटें।',
    'hero.subtitle':   'AI रोग पहचान, मौसम जानकारी, और सरकारी योजनाएँ — भारतीय किसानों के लिए एक प्लेटफ़ॉर्म।',
    'hero.cta':        'मुफ़्त शुरू करें',
    'hero.secondary':  'देखें कैसे काम करता है',
    // Scanner
    'scanner.title':      'कुछ ही सेकंड में रोग पहचानें।',
    'scanner.subtitle':   'फ़ोटो लें, स्कैन करें। सस्या की AI इंजन आपकी फ़सल का स्वास्थ्य जाँचती है।',
    'scanner.upload':     'अपलोड',
    'scanner.camera':     'कैमरा',
    'scanner.drag':       'पत्ती की फ़ोटो यहाँ खींचें',
    'scanner.gallery':    'गैलरी',
    'scanner.diagnosing': 'जाँच हो रही है',
    'scanner.done':       'निदान पूर्ण',
    'scanner.another':    '← दूसरी पत्ती स्कैन करें',
    'scanner.report':     'AI रिपोर्ट',
    'scanner.confidence': 'विश्वास स्तर',
    // Weather
    'weather.eyebrow':  'मौसम जानकारी',
    'weather.title1':   'आसमान को समझें,',
    'weather.title2':   'बदलाव से पहले।',
    'weather.advice':   'AI कृषि सलाह',
    'weather.sprayWindow': 'सबसे अच्छा छिड़काव समय',
    'weather.forecast': 'दिन का पूर्वानुमान',
    // Common
    'common.loading': 'लोड हो रहा है…',
    'common.error':   'कुछ गलत हो गया।',
    'common.retry':   'पुनः प्रयास करें',
  },

  // Others — fallback to English (coming soon)
  mr: {} as Translations,
  pa: {} as Translations,
  ta: {} as Translations,
  te: {} as Translations,
  kn: {} as Translations,
  gu: {} as Translations,
}

export function t(lang: LangCode, key: TranslationKey): string {
  return translations[lang]?.[key] || translations['en'][key] || key
}
