import { Language } from './translations';

export interface QuestionOption {
  label: string;
  value: string;
}

export interface CounsellingQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
}

type Tier = 1 | 2 | 3;

const QUESTIONS: Record<Language, Record<Tier, CounsellingQuestion[]>> = {
  en: {
    1: [
      {
        id: 'q1_nausea',
        text: 'Is the mother experiencing severe nausea, vomiting, or inability to retain fluids?',
        options: [
          { label: 'No / Mild morning sickness only', value: 'NO' },
          { label: 'Yes, severe and persistent vomiting', value: 'YES_SEVERE' },
        ],
      },
      {
        id: 'q1_bleeding',
        text: 'Is there any vaginal bleeding, spotting, or severe lower abdominal cramping?',
        options: [
          { label: 'No spotting or cramping', value: 'NO' },
          { label: 'Yes, spotting or active bleeding (Urgent)', value: 'YES' },
        ],
      },
      {
        id: 'q1_folic_acid',
        text: 'Is the mother taking daily Folic Acid (5mg) supplements?',
        options: [
          { label: 'Yes, taking daily after food', value: 'YES' },
          { label: 'No / Missed more than 3 days', value: 'NO' },
        ],
      },
      {
        id: 'q1_diet',
        text: 'Is the mother consuming at least one source of green leafy vegetables or lentils daily?',
        options: [
          { label: 'Yes, balanced meals daily', value: 'YES' },
          { label: 'No, poor appetite / unbalanced diet', value: 'NO' },
        ],
      },
      {
        id: 'q1_anc_reg',
        text: 'Has the mother completed her 1st Antenatal Care (ANC) registration at the PHC?',
        options: [
          { label: 'Yes, registered & MCP card issued', value: 'YES' },
          { label: 'Not registered yet', value: 'NO' },
        ],
      },
    ],
    2: [
      {
        id: 'q2_fetal_movement',
        text: 'Is the mother feeling regular baby movements (kicks) daily?',
        options: [
          { label: 'Yes, active and regular kicks', value: 'YES' },
          { label: 'No / Noticeably reduced movement', value: 'NO_REDUCED' },
        ],
      },
      {
        id: 'q2_swelling',
        text: 'Is there sudden swelling (edema) in hands, feet, or face?',
        options: [
          { label: 'No swelling / Normal mild evening swelling', value: 'NO' },
          { label: 'Yes, noticeable facial or hand swelling', value: 'YES_SEVERE' },
        ],
      },
      {
        id: 'q2_ifa_compliance',
        text: 'Is the mother taking daily Iron & Folic Acid (IFA) tablets with Vitamin C / citrus water?',
        options: [
          { label: 'Yes, daily IFA compliance', value: 'YES' },
          { label: 'No / Stopped due to constipation or nausea', value: 'NO' },
        ],
      },
      {
        id: 'q2_calcium',
        text: 'Is Calcium supplementation (500mg) taken separately from Iron tablets?',
        options: [
          { label: 'Yes, 2 hours gap maintained', value: 'YES' },
          { label: 'No / Taking together or irregular', value: 'NO' },
        ],
      },
      {
        id: 'q2_tetanus',
        text: 'Has Tetanus Toxoid (TT-1 / TT-2 / Booster) injection been administered?',
        options: [
          { label: 'Yes, verified on MCP card', value: 'YES' },
          { label: 'Pending / Delayed', value: 'NO' },
        ],
      },
    ],
    3: [
      {
        id: 'q3_headache_vision',
        text: 'Does the mother have severe persistent headache, blurred vision, or epigastric pain?',
        options: [
          { label: 'No such symptoms', value: 'NO' },
          { label: 'Yes (High risk of preeclampsia)', value: 'YES' },
        ],
      },
      {
        id: 'q3_birth_plan',
        text: 'Has the family identified an institutional delivery hospital and saved emergency ambulance (108)?',
        options: [
          { label: 'Yes, hospital, transport & attendant fixed', value: 'YES' },
          { label: 'No, birth plan not finalized', value: 'NO_PLAN' },
        ],
      },
      {
        id: 'q3_discharge',
        text: 'Is there any premature leaking of water (amniotic fluid) or bleeding?',
        options: [
          { label: 'No leaking or bleeding', value: 'NO' },
          { label: 'Yes, watery discharge or bleeding (Emergency)', value: 'YES' },
        ],
      },
      {
        id: 'q3_breastfeeding_awareness',
        text: 'Has early and exclusive breastfeeding (first golden hour colostrum) been counselled?',
        options: [
          { label: 'Yes, mother & family are prepared', value: 'YES' },
          { label: 'Not counselled yet', value: 'NO' },
        ],
      },
      {
        id: 'q3_rest_nutrition',
        text: 'Is the mother resting at least 2 hours in afternoon & sleeping on her left side?',
        options: [
          { label: 'Yes, adequate rest and position', value: 'YES' },
          { label: 'No, doing heavy household labour', value: 'NO' },
        ],
      },
    ],
  },
  hi: {
    1: [
      {
        id: 'q1_nausea',
        text: 'क्या माँ को गंभीर मितली, उल्टी, या तरल पदार्थ रखने में असमर्थता हो रही है?',
        options: [
          { label: 'नहीं / केवल हल्की सुबह की मितली', value: 'NO' },
          { label: 'हाँ, गंभीर और लगातार उल्टी', value: 'YES_SEVERE' },
        ],
      },
      {
        id: 'q1_bleeding',
        text: 'क्या योनि से रक्तस्राव, धब्बे, या तेज निचले पेट में ऐंठन है?',
        options: [
          { label: 'कोई धब्बा या ऐंठन नहीं', value: 'NO' },
          { label: 'हाँ, धब्बा या सक्रिय रक्तस्राव (तत्काल)', value: 'YES' },
        ],
      },
      {
        id: 'q1_folic_acid',
        text: 'क्या माँ रोजाना फोलिक एसिड (5mg) की गोली ले रही है?',
        options: [
          { label: 'हाँ, भोजन के बाद रोजाना', value: 'YES' },
          { label: 'नहीं / 3 दिन से अधिक छूट गई', value: 'NO' },
        ],
      },
      {
        id: 'q1_diet',
        text: 'क्या माँ रोजाना हरी पत्तेदार सब्जियों या दाल का सेवन कर रही है?',
        options: [
          { label: 'हाँ, संतुलित भोजन रोजाना', value: 'YES' },
          { label: 'नहीं / कम भूख / असंतुलित आहार', value: 'NO' },
        ],
      },
      {
        id: 'q1_anc_reg',
        text: 'क्या माँ ने प्राथमिक स्वास्थ्य केंद्र (PHC) में पहली प्रसव पूर्व देखभाल (ANC) पंजीकरण कराया है?',
        options: [
          { label: 'हाँ, पंजीकृत और MCP कार्ड जारी', value: 'YES' },
          { label: 'अभी तक पंजीकृत नहीं', value: 'NO' },
        ],
      },
    ],
    2: [
      {
        id: 'q2_fetal_movement',
        text: 'क्या माँ को रोजाना नियमित शिशु की हरकत (लात) महसूस होती है?',
        options: [
          { label: 'हाँ, सक्रिय और नियमित हरकत', value: 'YES' },
          { label: 'नहीं / हरकत में कमी', value: 'NO_REDUCED' },
        ],
      },
      {
        id: 'q2_swelling',
        text: 'क्या हाथों, पैरों या चेहरे में अचानक सूजन (एडिमा) है?',
        options: [
          { label: 'कोई सूजन नहीं / हल्की शाम की सूजन', value: 'NO' },
          { label: 'हाँ, चेहरे या हाथों में स्पष्ट सूजन', value: 'YES_SEVERE' },
        ],
      },
      {
        id: 'q2_ifa_compliance',
        text: 'क्या माँ रोजाना आयरन और फोलिक एसिड (IFA) की गोली विटामिन C / नींबू पानी के साथ ले रही है?',
        options: [
          { label: 'हाँ, रोजाना IFA ले रही है', value: 'YES' },
          { label: 'नहीं / कब्ज या मितली से बंद', value: 'NO' },
        ],
      },
      {
        id: 'q2_calcium',
        text: 'क्या कैल्शियम (500mg) आयरन की गोली से अलग समय पर लिया जा रहा है?',
        options: [
          { label: 'हाँ, 2 घंटे का अंतराल', value: 'YES' },
          { label: 'नहीं / साथ में या अनियमित', value: 'NO' },
        ],
      },
      {
        id: 'q2_tetanus',
        text: 'क्या टिटनेस टॉक्सॉइड (TT-1 / TT-2 / बूस्टर) का टीका लगाया गया है?',
        options: [
          { label: 'हाँ, MCP कार्ड पर सत्यापित', value: 'YES' },
          { label: 'लंबित / विलंबित', value: 'NO' },
        ],
      },
    ],
    3: [
      {
        id: 'q3_headache_vision',
        text: 'क्या माँ को गंभीर लगातार सिरदर्द, धुंधली दृष्टि, या पेट के ऊपरी हिस्से में दर्द है?',
        options: [
          { label: 'ऐसे लक्षण नहीं', value: 'NO' },
          { label: 'हाँ (प्रीएक्लेम्पसिया का उच्च जोखिम)', value: 'YES' },
        ],
      },
      {
        id: 'q3_birth_plan',
        text: 'क्या परिवार ने अस्पताल में प्रसव और आपातकालीन एम्बुलेंस (108) की व्यवस्था की है?',
        options: [
          { label: 'हाँ, अस्पताल, परिवहन और साथी तय', value: 'YES' },
          { label: 'नहीं, जन्म योजना अंतिम नहीं', value: 'NO_PLAN' },
        ],
      },
      {
        id: 'q3_discharge',
        text: 'क्या पानी (एम्नियोटिक द्रव) का समय से पहले रिसाव या रक्तस्राव है?',
        options: [
          { label: 'कोई रिसाव या रक्तस्राव नहीं', value: 'NO' },
          { label: 'हाँ, पानी जैसा रिसाव या रक्तस्राव (आपातकाल)', value: 'YES' },
        ],
      },
      {
        id: 'q3_breastfeeding_awareness',
        text: 'क्या शीघ्र और विशेष स्तनपान (पहले घंटे का कोलोस्ट्रम) के बारे में परामर्श दिया गया है?',
        options: [
          { label: 'हाँ, माँ और परिवार तैयार हैं', value: 'YES' },
          { label: 'अभी तक परामर्श नहीं', value: 'NO' },
        ],
      },
      {
        id: 'q3_rest_nutrition',
        text: 'क्या माँ दोपहर में कम से कम 2 घंटे आराम करती है और बाईं करवट सोती है?',
        options: [
          { label: 'हाँ, पर्याप्त आराम और सही स्थिति', value: 'YES' },
          { label: 'नहीं, भारी घरेलू काम कर रही है', value: 'NO' },
        ],
      },
    ],
  },
  mr: {
    1: [
      {
        id: 'q1_nausea',
        text: 'गरोदर मातेला तीव्र मळमळ, उलट्या किंवा द्रव धरून ठेवण्यात अक्षमता आहे का?',
        options: [
          { label: 'नाही / फक्त हलकी सकाळची मळमळ', value: 'NO' },
          { label: 'होय, तीव्र आणि सतत उलट्या', value: 'YES_SEVERE' },
        ],
      },
      {
        id: 'q1_bleeding',
        text: 'योनीमार्गातून रक्तस्त्राव, डाग किंवा तीव्र खालच्या पोटात वेदना आहेत का?',
        options: [
          { label: 'डाग किंवा वेदना नाहीत', value: 'NO' },
          { label: 'होय, डाग किंवा सक्रिय रक्तस्त्राव (तातडीचे)', value: 'YES' },
        ],
      },
      {
        id: 'q1_folic_acid',
        text: 'गरोदर माता दररोज फोलिक अॅसिड (5mg) गोळी घेत आहे का?',
        options: [
          { label: 'होय, जेवणानंतर दररोज', value: 'YES' },
          { label: 'नाही / 3 दिवसांपेक्षा जास्त चुकले', value: 'NO' },
        ],
      },
      {
        id: 'q1_diet',
        text: 'गरोदर माता दररोज हिरव्या पालेभाज्या किंवा डाळीचे सेवन करते का?',
        options: [
          { label: 'होय, दररोज संतुलित आहार', value: 'YES' },
          { label: 'नाही / कमी भूक / असंतुलित आहार', value: 'NO' },
        ],
      },
      {
        id: 'q1_anc_reg',
        text: 'गरोदर मातेने प्राथमिक आरोग्य केंद्रात (PHC) पहिली प्रसूतीपूर्व काळजी (ANC) नोंदणी केली आहे का?',
        options: [
          { label: 'होय, नोंदणी आणि MCP कार्ड जारी', value: 'YES' },
          { label: 'अद्याप नोंदणी नाही', value: 'NO' },
        ],
      },
    ],
    2: [
      {
        id: 'q2_fetal_movement',
        text: 'गरोदर मातेला दररोज नियमित बाळाची हालचाल (लाथ) जाणवते का?',
        options: [
          { label: 'होय, सक्रिय आणि नियमित हालचाल', value: 'YES' },
          { label: 'नाही / हालचालीत घट', value: 'NO_REDUCED' },
        ],
      },
      {
        id: 'q2_swelling',
        text: 'हात, पाय किंवा चेहऱ्यावर अचानक सूज (एडिमा) आहे का?',
        options: [
          { label: 'सूज नाही / हलकी संध्याकाळची सूज', value: 'NO' },
          { label: 'होय, चेहऱ्यावर किंवा हातावर स्पष्ट सूज', value: 'YES_SEVERE' },
        ],
      },
      {
        id: 'q2_ifa_compliance',
        text: 'गरोदर माता दररोज लोह आणि फोलिक अॅसिड (IFA) गोळी विटामिन C / लिंबू पाण्यासोबत घेते का?',
        options: [
          { label: 'होय, दररोज IFA घेते', value: 'YES' },
          { label: 'नाही / कब्ज किंवा मळमळमुळे थांबवले', value: 'NO' },
        ],
      },
      {
        id: 'q2_calcium',
        text: 'कॅल्शियम (500mg) लोहाच्या गोळीपासून वेगळ्या वेळी घेतले जाते का?',
        options: [
          { label: 'होय, 2 तासांचे अंतर', value: 'YES' },
          { label: 'नाही / एकत्र किंवा अनियमित', value: 'NO' },
        ],
      },
      {
        id: 'q2_tetanus',
        text: 'टिटणस टॉक्सॉइड (TT-1 / TT-2 / बूस्टर) लस दिली आहे का?',
        options: [
          { label: 'होय, MCP कार्डवर सत्यापित', value: 'YES' },
          { label: 'प्रलंबित / विलंबित', value: 'NO' },
        ],
      },
    ],
    3: [
      {
        id: 'q3_headache_vision',
        text: 'गरोदर मातेला तीव्र सतत डोकेदुखी, धूसर दृष्टी किंवा पोटाच्या वरच्या भागात वेदना आहेत का?',
        options: [
          { label: 'अशी लक्षणे नाहीत', value: 'NO' },
          { label: 'होय (प्रीएक्लेम्पसियाचा उच्च धोका)', value: 'YES' },
        ],
      },
      {
        id: 'q3_birth_plan',
        text: 'कुटुंबाने रुग्णालयात प्रसूती आणि आपत्कालीन ॲम्ब्युलन्स (108) व्यवस्था केली आहे का?',
        options: [
          { label: 'होय, रुग्णालय, वाहतूक आणि सोबती ठरले', value: 'YES' },
          { label: 'नाही, जन्म योजना अंतिम नाही', value: 'NO_PLAN' },
        ],
      },
      {
        id: 'q3_discharge',
        text: 'पाणी (एम्नियोटिक द्रव) लवकर गळते किंवा रक्तस्त्राव आहे का?',
        options: [
          { label: 'गळणे किंवा रक्तस्त्राव नाही', value: 'NO' },
          { label: 'होय, पाण्यासारखे गळणे किंवा रक्तस्त्राव (आपत्कालीन)', value: 'YES' },
        ],
      },
      {
        id: 'q3_breastfeeding_awareness',
        text: 'लवकर आणि विशेष स्तनपान (पहिल्या तासाचे कोलोस्ट्रम) बद्दल समुपदेशन केले आहे का?',
        options: [
          { label: 'होय, माता आणि कुटुंब तयार आहे', value: 'YES' },
          { label: 'अद्याप समुपदेशन नाही', value: 'NO' },
        ],
      },
      {
        id: 'q3_rest_nutrition',
        text: 'गरोदर माता दुपारी किमान 2 तास विश्रांती घेते आणि डाव्या बाजूने झोपते का?',
        options: [
          { label: 'होय, पुरेशी विश्रांती आणि योग्य स्थिती', value: 'YES' },
          { label: 'नाही, जड घरगुती काम करते', value: 'NO' },
        ],
      },
    ],
  },
};

export const getTierQuestions = (language: Language, tier: Tier): CounsellingQuestion[] => {
  return QUESTIONS[language]?.[tier] ?? QUESTIONS.en[tier];
};
