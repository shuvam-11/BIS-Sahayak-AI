/**
 * BIS Sahayak AI - Multilingual Internationalization
 * Languages: English, Hindi, Odia, Bengali, Telugu, Tamil, Marathi
 * Preserves essential technical BIS terminology (IS Number, Clause, ISI Mark, HUID, Scheme)
 */

import { LanguageCode } from '../types';

export interface TranslationDict {
  appName: string;
  tagline: string;
  subTagline: string;
  askAIBtn: string;
  findStandardBtn: string;
  navHome: string;
  navAskAI: string;
  navFindStandard: string;
  navCertification: string;
  navTesting: string;
  navHallmarking: string;
  navConsumer: string;
  navDashboard: string;
  navAdmin: string;
  navAbout: string;
  disclaimerText: string;
  verifiedBadge: string;
  needsVerificationBadge: string;
  notVerifiedBadge: string;
  demoDataBadge: string;
  sourcesLabel: string;
  howItWorksTitle: string;
  responsibleAITitle: string;
  searchPlaceholder: string;
}

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  en: {
    appName: 'BIS Sahayak AI',
    tagline: 'Your Intelligent Guide to Indian Standards & BIS Services',
    subTagline: 'Ask in Simple Language. Find the Right BIS Information. Understand What to Do.',
    askAIBtn: 'Ask BIS AI',
    findStandardBtn: 'Find My Standard',
    navHome: 'Home',
    navAskAI: 'Ask BIS AI',
    navFindStandard: 'Find My Standard',
    navCertification: 'Certification Guide',
    navTesting: 'Testing & Labs',
    navHallmarking: 'Hallmarking',
    navConsumer: 'Consumer Help',
    navDashboard: 'Dashboard',
    navAdmin: 'Knowledge Base',
    navAbout: 'About & Trust',
    disclaimerText: 'BIS Sahayak AI is an informational guidance assistant. It does not replace official BIS decisions or legal conformity assessments. Verify requirements on official BIS portals.',
    verifiedBadge: 'Source-Backed & Verified',
    needsVerificationBadge: 'Needs Official Verification',
    notVerifiedBadge: 'Unable to Verify (Source or Refuse)',
    demoDataBadge: 'AUTHORITATIVE BIS DATASET',
    sourcesLabel: 'Authoritative Sources & Clauses',
    howItWorksTitle: 'How BIS Sahayak Works',
    responsibleAITitle: 'Responsible AI & Trust Framework',
    searchPlaceholder: 'Describe your product or ask any question about Indian Standards...'
  },
  hi: {
    appName: 'BIS Sahayak AI',
    tagline: 'भारतीय मानकों और BIS सेवाओं के लिए आपका बुद्धिमत्तापूर्ण मार्गदर्शक',
    subTagline: 'सरल भाषा में पूछें। सही BIS जानकारी पाएं। समझें कि आगे क्या करना है।',
    askAIBtn: 'BIS AI से पूछें',
    findStandardBtn: 'मेरा मानक खोजें',
    navHome: 'होम',
    navAskAI: 'BIS AI से पूछें',
    navFindStandard: 'मेरा मानक खोजें',
    navCertification: 'प्रमाणीकरण मार्गदर्शिका',
    navTesting: 'परीक्षण व प्रयोगशालाएं',
    navHallmarking: 'Hallmarking',
    navConsumer: 'उपभोक्ता सहायता',
    navDashboard: 'डैशबोर्ड',
    navAdmin: 'ज्ञानकोष',
    navAbout: 'विश्वसनीयता व नियम',
    disclaimerText: 'BIS Sahayak AI एक सूचनात्मक सहायक है। यह आधिकारिक BIS निर्णयों का स्थान नहीं लेता है। manakonline.in पर सत्यापन करें।',
    verifiedBadge: 'प्रमाणित स्रोत द्वारा सत्यापित',
    needsVerificationBadge: 'आधिकारिक सत्यापन आवश्यक',
    notVerifiedBadge: 'सत्यापित नहीं (Source or Refuse)',
    demoDataBadge: 'आधिकारिक BIS डेटासेट',
    sourcesLabel: 'आधिकारिक स्रोत व Clause विवरण',
    howItWorksTitle: 'BIS Sahayak कैसे कार्य करता है',
    responsibleAITitle: 'उत्तरदायी AI व विश्वसनीयता ढांचा',
    searchPlaceholder: 'अपने उत्पाद का वर्णन करें या भारतीय मानकों के बारे में प्रश्न पूछें...'
  },
  or: {
    appName: 'BIS Sahayak AI',
    tagline: 'ଭାରତୀୟ ମାନକ ଏବଂ BIS ସେବା ପାଇଁ ଆପଣଙ୍କ ବୁଦ୍ଧିମତାପୂର୍ଣ୍ଣ ମାର୍ଗଦର୍ଶକ',
    subTagline: 'ସରଳ ଭାଷାରେ ପଚାରନ୍ତୁ। ସଠିକ୍ BIS ତଥ୍ୟ ପାଆନ୍ତୁ। ଆଗକୁ କଣ କରିବେ ବୁଝନ୍ତୁ।',
    askAIBtn: 'BIS AI କୁ ପଚାରନ୍ତୁ',
    findStandardBtn: 'ମୋର ମାନକ ଖୋଜନ୍ତୁ',
    navHome: 'ମୂଳପୃଷ୍ଠା',
    navAskAI: 'BIS AI କୁ ପଚାରନ୍ତୁ',
    navFindStandard: 'ମୋର ମାନକ ଖୋଜନ୍ତୁ',
    navCertification: 'Certification ଗାଇଡ୍',
    navTesting: 'Testing ଓ ଲାବୋରେଟୋରୀ',
    navHallmarking: 'Hallmarking',
    navConsumer: 'ଗ୍ରାହକ ସହାୟତା',
    navDashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    navAdmin: 'ଜ୍ଞାନକୋଷ',
    navAbout: 'ବିଶ୍ୱସନୀୟତା',
    disclaimerText: 'BIS Sahayak AI ଏକ ସୂଚନାପୂର୍ଣ୍ଣ ସହାୟକ ଅଟେ। ଆନୁଷ୍ଠାନିକ BIS ନିଷ୍ପତ୍ତି ପାଇଁ manakonline.in ରେ ଯାଞ୍ଚ କରନ୍ତୁ।',
    verifiedBadge: 'ପ୍ରମାଣିତ ଉତ୍ସ ଦ୍ୱାରା ଯାଞ୍ଚ ହୋଇଛି',
    needsVerificationBadge: 'ଆନୁଷ୍ଠାନିକ ଯାଞ୍ଚ ଆବଶ୍ୟକ',
    notVerifiedBadge: 'ଯାଞ୍ଚ ଅସମ୍ଭବ (Source or Refuse)',
    demoDataBadge: 'ଆନୁଷ୍ଠାନିକ BIS ଡାଟାସେଟ୍',
    sourcesLabel: 'ଆନୁଷ୍ଠାନିକ ଉତ୍ସ ଏବଂ Clause',
    howItWorksTitle: 'BIS Sahayak କିପରି କାମ କରେ',
    responsibleAITitle: 'ଦାୟିତ୍ୱପୂର୍ଣ୍ଣ AI ଢାଞ୍ଚା',
    searchPlaceholder: 'ଆପଣଙ୍କ ଉତ୍ପାଦ ବିଷୟରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ କିମ୍ବା ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...'
  },
  bn: {
    appName: 'BIS Sahayak AI',
    tagline: 'ভারতীয় মান ও BIS সেবার জন্য আপনার বুদ্ধিমান সহায়ক',
    subTagline: 'সহজ ভাষায় জিজ্ঞাসা করুন। সঠিক BIS তথ্য পান। পরবর্তী পদক্ষেপ বুঝুন।',
    askAIBtn: 'BIS AI-কে জিজ্ঞাসা করুন',
    findStandardBtn: 'আমার Standard খুঁজুন',
    navHome: 'হোম',
    navAskAI: 'BIS AI-কে জিজ্ঞাসা করুন',
    navFindStandard: 'আমার Standard খুঁজুন',
    navCertification: 'Certification নির্দেশিকা',
    navTesting: 'Testing ও গবেষণাগার',
    navHallmarking: 'Hallmarking',
    navConsumer: 'ভোক্তা সহায়তা',
    navDashboard: 'ড্যাশবোর্ড',
    navAdmin: 'জ্ঞানভাণ্ডার',
    navAbout: 'বিশ্বাসযোগ্যতা',
    disclaimerText: 'BIS Sahayak AI একটি তথ্যভিত্তিক নির্দেশিকা সহায়ক। অফিশিয়াল BIS সিদ্ধান্তের বিকল্প নয়।',
    verifiedBadge: 'যাচাইকৃত উৎস দ্বারা সমর্থিত',
    needsVerificationBadge: 'সরকারি যাচাইকরণ প্রয়োজন',
    notVerifiedBadge: 'যাচাই করা যায়নি (Source or Refuse)',
    demoDataBadge: 'অফিশিয়াল BIS ডেটাসেট',
    sourcesLabel: 'অফিশিয়াল উৎস ও Clause',
    howItWorksTitle: 'BIS Sahayak কীভাবে কাজ করে',
    responsibleAITitle: 'দায়িত্বশীল AI ফ্রেমওয়ার্ক',
    searchPlaceholder: 'আপনার পণ্য বর্ণনা করুন বা ভারতীয় মান সম্পর্কে জিজ্ঞাসা করুন...'
  },
  te: {
    appName: 'BIS Sahayak AI',
    tagline: 'భారతీయ ప్రమాణాలు మరియు BIS సేవల కొరకు మీ తెలివైన మార్గదర్శి',
    subTagline: 'సరళమైన భాషలో అడగండి. సరైన BIS సమాచారాన్ని కనుగొనండి.',
    askAIBtn: 'BIS AIని అడగండి',
    findStandardBtn: 'నా ప్రమాణాన్ని కనుగొనండి',
    navHome: 'హోమ్',
    navAskAI: 'BIS AIని అడగండి',
    navFindStandard: 'నా ప్రమాణాన్ని కనుగొనండి',
    navCertification: 'Certification గైడ్',
    navTesting: 'Testing & ల్యాబ్స్',
    navHallmarking: 'Hallmarking',
    navConsumer: 'వినియోగదారుల సహాయం',
    navDashboard: 'డాష్‌బోర్డ్',
    navAdmin: 'నాలెడ్జ్ బేస్',
    navAbout: 'విశ్వసనీయత',
    disclaimerText: 'BIS Sahayak AI సమాచార సహాయక సాధనం. అధికారిక BIS నిర్ణయాల కొరకు manakonline.in చూడండి.',
    verifiedBadge: 'ధృవీకరించబడిన మూలం',
    needsVerificationBadge: 'అధికారిక ధృవీకరణ అవసరం',
    notVerifiedBadge: 'ధృవీకరించబడలేదు (Source or Refuse)',
    demoDataBadge: 'అధికారిక BIS డేటాసెట్',
    sourcesLabel: 'అధికారిక ఆధారాలు మరియు Clause',
    howItWorksTitle: 'BIS Sahayak ఎలా పనిచేస్తుంది',
    responsibleAITitle: 'బాధ్యతాయుతమైన AI ఫ్రేమ్‌వర్క్',
    searchPlaceholder: 'మీ ఉత్పత్తిని వివరించండి లేదా భారతీయ ప్రమాణాలపై ప్రశ్నలు అడగండి...'
  },
  ta: {
    appName: 'BIS Sahayak AI',
    tagline: 'இந்திய தரநிலைகள் மற்றும் BIS சேவைகளுக்கான உங்கள் புத்திசாலி வழிகாட்டி',
    subTagline: 'எளிய மொழியில் கேளுங்கள். சரியான BIS தகவலைப் பெறுங்கள்.',
    askAIBtn: 'BIS AI-யிடம் கேளுங்கள்',
    findStandardBtn: 'என் தரநிலையைக் கண்டறி',
    navHome: 'முகப்பு',
    navAskAI: 'BIS AI-யிடம் கேளுங்கள்',
    navFindStandard: 'என் தரநிலையைக் கண்டறி',
    navCertification: 'Certification வழிகாட்டி',
    navTesting: 'Testing மற்றும் ஆய்வகங்கள்',
    navHallmarking: 'Hallmarking',
    navConsumer: 'நுகர்வோர் உதவி',
    navDashboard: 'டாஷ்போர்டு',
    navAdmin: 'அறிவுத் தளம்',
    navAbout: 'நம்பகத்தன்மை',
    disclaimerText: 'BIS Sahayak AI தகவல் வழிகாட்டுதல் உதவியாளர். அதிகாரப்பூர்வ BIS முடிவுகளுக்கு மாற்றாகாது.',
    verifiedBadge: 'சரிபார்க்கப்பட்ட ஆதாரம்',
    needsVerificationBadge: 'அதிகாரப்பூர்வ சரிபார்ப்பு தேவை',
    notVerifiedBadge: 'சரிபார்க்க முடியவில்லை (Source or Refuse)',
    demoDataBadge: 'அதிகாரப்பூர்வ BIS தரவுத்தொகுப்பு',
    sourcesLabel: 'அதிகாரப்பூர்வ ஆதாரங்கள் மற்றும் Clause',
    howItWorksTitle: 'BIS Sahayak எவ்வாறு செயல்படுகிறது',
    responsibleAITitle: 'பொறுப்பான AI கட்டமைப்பு',
    searchPlaceholder: 'உங்கள் தயாரிப்பை விவரிக்கவும் அல்லது இந்திய தரநிலைகள் பற்றி கேட்கவும்...'
  },
  mr: {
    appName: 'BIS Sahayak AI',
    tagline: 'भारतीय मानके आणि BIS सेवांसाठी तुमचा बुद्धिमान मार्गदर्शक',
    subTagline: 'सोप्या भाषेत विचारा. योग्य BIS माहिती मिळवा. काय करावे ते समजून घ्या.',
    askAIBtn: 'BIS AI ला विचारा',
    findStandardBtn: 'माझे मानक शोधा',
    navHome: 'होम',
    navAskAI: 'BIS AI ला विचारा',
    navFindStandard: 'माझे मानक शोधा',
    navCertification: 'Certification मार्गदर्शक',
    navTesting: 'Testing आणि प्रयोगशाळा',
    navHallmarking: 'Hallmarking',
    navConsumer: 'ग्राहक मदत',
    navDashboard: 'डॅशबोर्ड',
    navAdmin: 'ज्ञानकोश',
    navAbout: 'विश्वासार्हता',
    disclaimerText: 'BIS Sahayak AI एक माहितीपूर्ण मार्गदर्शक आहे. अधिकृत BIS निर्णयासाठी manakonline.in पहा.',
    verifiedBadge: 'सत्यापित स्त्रोतासह सिद्ध',
    needsVerificationBadge: 'अधिकृत पडताळणी आवश्यक',
    notVerifiedBadge: 'सत्यापित नाही (Source or Refuse)',
    demoDataBadge: 'अधिकृत BIS डेटासेट',
    sourcesLabel: 'अधिकृत संदर्भ व Clause तपशील',
    howItWorksTitle: 'BIS Sahayak कसे काम करते',
    responsibleAITitle: 'जबाबदार AI फ्रेमवर्क',
    searchPlaceholder: 'तुमच्या उत्पादनाचे वर्णन करा किंवा भारतीय मानकांबद्दल प्रश्न विचारा...'
  }
};
