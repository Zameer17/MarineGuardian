# backend/services/translator.py

from deep_translator import GoogleTranslator
from typing import Dict, List
import logging

class MarineTranslator:
    def __init__(self):
        # Mapping coastal languages to standard ISO language codes
        self.lang_codes = {
            "hindi": "hi",
            "marathi": "mr",
            "gujarati": "gu",
            "tamil": "ta",
            "malayalam": "ml",
            "bengali": "bn",
            "telugu": "te",
            "kannada": "kn",
            "odia": "or"
        }

        # In-memory LRU-like cache
        self.cache: Dict[str, Dict[str, str]] = {}

        # Curated Native Templates for Safe, Caution, and Danger alerts
        self.preset_templates = {
            "safe": {
                "hindi": "सुरक्षित: समुद्र शांत है, अनुकूल हवाएं और सामान्य नौकायन व मत्स्यव्यवसाय की अनुमति है।",
                "marathi": "सुरक्षित: समुद्र शांत असून हवामान अनुकूल आहे. सर्व प्रकारच्या मासेमारीसाठी परवानगी आहे.",
                "gujarati": "સુરક્ષિત: સમુદ્ર શાંત છે, પવન અનુકૂળ છે અને તમામ માછીમારી બોટો માટે સામાન્ય સંચાલનની મંજૂરી છે.",
                "tamil": "பாதுகாப்பானது: கடல் அமைதியாக உள்ளது, சாதகமான காற்று மற்றும் சாதாரண மீன்பிடிக்க அனுமதி உண்டு.",
                "telugu": "సురక్షితం: సముద్రం ప్రశాంతంగా ఉంది, అనుకూలమైన వాతావరణం మరియు సాధారణ చేపల వేటకు అనుమతి ఉంది.",
                "kannada": "ಸುರಕ್ಷಿತ: ಸಮುದ್ರವು ಶಾಂತವಾಗಿದೆ, ಅನುಕೂಲಕರ ಗಾಳಿ ಮತ್ತು ಸಾಮಾನ್ಯ ಮೀನುಗಾರಿಕೆಗೆ ಅನುಮತಿ ಇದೆ.",
                "malayalam": "സുരക്ഷിതം: കടൽ ശാന്തമാണ്, അനുകൂല കാലാവസ്ഥയും സാധാരണ മത്സ്യബന്ധനത്തിന് അനുമതിയും ഉണ്ട്.",
                "bengali": "নিরাপদ: সমুদ্র শান্ত রয়েছে, অনুকূল বাতাস এবং স্বাভাবিক মাছ ধরার অনুমতি রয়েছে।",
                "odia": "ସୁରକ୍ଷିତ: ସମୁଦ୍ର ଶାନ୍ତ ଅଛି, ଅନୁକୂଳ ପବନ ଏବଂ ସାଧାରଣ ମାଛ ଧରିବା ପାଇଁ ଅନୁମତି ଅଛି।"
            },
            "caution": {
                "hindi": "सावधानी: समुद्र में मध्यम लहरें और तेज हवाएं हैं। छोटी नौकाएं तट के निकट (3-5 समुद्री मील) ही रहें।",
                "marathi": "सावधान: समुद्रात मध्यम लाटा व वारे आहेत. लहान बोटींनी किनाऱ्याजवळच (३-५ नॉटिकल मैल) मासेमारी करावी.",
                "gujarati": "સાવચેતી: મધ્યમ મોજાં અને પવન. નાની બોટોએ કિનારાની નજીક (3-5 નોટિકલ માઇલ) રહેવું.",
                "tamil": "எச்சரிக்கை: மிதமான அலைகள் மற்றும் காற்று. சிறிய படகுகள் கரைக்கு அருகில் (3-5 கடல் மைல்) இருக்க வேண்டும்.",
                "telugu": "జాగ్రత్త: మధ్యస్థ అలలు మరియు గాలులు. చిన్న పడవలు తీరానికి సమీపంలో (3-5 నాటికల్ మైళ్ళు) ఉండాలి.",
                "kannada": "ಎಚ್ಚರಿಕೆ: ಮಧ್ಯಮ ಅಲೆಗಳು ಮತ್ತು ಗಾಳಿ. ಸಣ್ಣ ದೋಣಿಗಳು ತೀರದ ಸಮೀಪದಲ್ಲಿರಬೇಕು.",
                "malayalam": "ജാഗ്രത: മിതമായ തിരമാലകളും കാറ്റും. ചെറിയ ബോട്ടുകൾ തീരത്തിനടുത്ത് തുടരണം.",
                "bengali": "সতর্কতা: মাঝারি ঢেউ ও বাতাস। ছোট নৌকাগুলিকে উপকূলের কাছাকাছি (৩-৫ নটিক্যাল মাইল) থাকতে হবে।",
                "odia": "ସତର୍କତା: ମଧ୍ୟମ ଢେଉ ଏବଂ ପବନ। ଛୋଟ ଡଙ୍ଗାଗୁଡ଼ିକ ଉପକୂଳ ନିକଟରେ ରହିବା ଉଚିତ।"
            },
            "danger": {
                "hindi": "खतरा: समुद्र में तीव्र तूफान व ऊंची लहरें हैं। छोटी व मध्यम नौकाएं तुरंत बंदरगाह लौटें।",
                "marathi": "धोका: समुद्रात वादळी वारे व प्रचंड लाटा आहेत. लहान व मध्यम बोटींना मोठा धोका असून तात्काळ बंदरात परता.",
                "gujarati": "જોખમ: ભારે પવન અને ઊંચા મોજાં. નાની અને મધ્યમ બોટો તરત જ બંદરે પરત ફરે.",
                "tamil": "ஆபத்து: கடும் புயல் மற்றும் அதிக அலைகள். சிறிய மற்றும் நடுத்தர படகுகள் உடனடியாக துறைமுகம் திரும்ப வேண்டும்.",
                "telugu": "ప్రమాదం: తీవ్ర తుఫాను మరియు ఎత్తైన అలలు. చిన్న మరియు మధ్యస్థ పడవలు వెంటనే రేవుకు తిరిగి రావాలి.",
                "kannada": "ಅಪಾಯ: ತೀವ್ರ ಬಿರುಗಾಳಿ ಮತ್ತು ಎತ್ತರದ ಅಲೆಗಳು. ಸಣ್ಣ ಮತ್ತು ಮಧ್ಯಮ ದೋಣಿಗಳು ತಕ್ಷಣ ಬಂದರಿಗೆ ಮರಳಬೇಕು.",
                "malayalam": "അപകടം: കനത്ത കൊടുങ്കാറ്റും ഉയർന്ന തിരമാലകളും. ബോട്ടുകൾ ഉടൻ തുറമുഖത്തേക്ക് മടങ്ങുക.",
                "bengali": "বিপদ: প্রচণ্ড ঝড় ও উত্তাল ঢেউ। ছোট ও মাঝারি নৌকা অবিলম্বে বন্দরে ফিরে আসুন।",
                "odia": "ବିପଦ: ପ୍ରବଳ ଝଡ଼ ଏବଂ ଉଚ୍ଚ ଢେଉ। ଡଙ୍ଗାଗୁଡ଼ିକ ତୁରନ୍ତ ବନ୍ଦରକୁ ଫେରିଆସନ୍ତୁ।"
            }
        }

    def translate_advisory(self, text: str, target_langs: List[str]) -> Dict[str, str]:
        """Translates the English safety advisory with fast caching and native marine dictionaries."""
        translations = {"english": text}
        text_lower = text.lower()

        # Check preset category
        category = "safe" if "safe" in text_lower else "danger" if "danger" in text_lower else "caution"

        for lang in target_langs:
            lang_key = lang.lower().strip()
            if lang_key not in self.lang_codes:
                continue

            # 1. Use memory cache if present
            if text in self.cache and lang_key in self.cache[text]:
                translations[lang_key] = self.cache[text][lang_key]
                continue

            # 2. Use native template
            if lang_key in self.preset_templates.get(category, {}):
                translations[lang_key] = self.preset_templates[category][lang_key]
                continue

            # 3. Fallback to online translation
            tgt_code = self.lang_codes[lang_key]
            try:
                translated = GoogleTranslator(source='en', target=tgt_code).translate(text)
                translations[lang_key] = translated
                if text not in self.cache:
                    self.cache[text] = {}
                self.cache[text][lang_key] = translated
            except Exception as e:
                translations[lang_key] = self.preset_templates[category].get(lang_key, text)

        return translations

nlp_engine = MarineTranslator()