import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Stethoscope, Bot, FileText, Pill, Bell, PhoneCall, User, Home,
  ChevronLeft, ChevronRight, Mic, Camera, MicOff, VideoOff,
  Video, PhoneOff, MessageCircle, Volume2, Star, Check, Clock,
  AlertTriangle, Search, Download, Share2, Plus, X, Globe, ChevronDown,
  Activity, ClipboardList, Ambulance, Heart, ShieldCheck, Maximize2,
  UserCheck, Settings, MapPin, TrendingUp, Users, LogOut, Megaphone,
  UserPlus, LogIn, BarChart2, Eye, Calendar, CheckCircle, Package, Play
} from "lucide-react";

/* ---------------------------------------------------------
   DESIGN TOKENS
--------------------------------------------------------- */
const C = {
  bg: "#FAF7F1",
  surface: "#FFFFFF",
  border: "#E7E0D3",
  ink: "#16302A",
  inkSoft: "#5B6E68",
  teal: "#0B6B58",
  tealDark: "#084F41",
  tealSoft: "#E4F1EC",
  saffron: "#E8A23A",
  saffronSoft: "#FBF0DD",
  green: "#3F8F5F",
  greenSoft: "#E7F4EC",
  yellow: "#D9A02B",
  yellowSoft: "#FBF1D9",
  orange: "#D9722C",
  orangeSoft: "#FBE9DA",
  red: "#C4432B",
  redSoft: "#FAE4DE",
};

const heading = { fontFamily: "'Poppins', system-ui, sans-serif" };
const body = { fontFamily: "system-ui, -apple-system, sans-serif" };

/* ---------------------------------------------------------
   AUDIO SERVICE — Uses Voice folder MP3s only
--------------------------------------------------------- */
const DEMO_MODE = true;
const CONNECTION_DELAY = 1500;

const VOICE_FILES = {
  welcome: "/Voice/Voice 1.mp3",
  asha: "/Voice/Voice 2.mp3",
  emergency: "/Voice/Voice 3.mp3",
};

let currentAudio = null;

function playVoice(key) {
  return new Promise((resolve) => {
    stopCurrentAudio();
    const audio = new Audio(VOICE_FILES[key]);
    currentAudio = audio;
    audio.onended = () => { currentAudio = null; resolve(); };
    audio.onerror = () => { currentAudio = null; resolve(); };
    audio.play().catch(() => { currentAudio = null; resolve(); });
  });
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

function speakMarathi() { return false; }
function stopSpeech() { stopCurrentAudio(); }
function isSpeechSupported() { return true; }

/* ---------------------------------------------------------
   TRILINGUAL TRANSLATIONS (English, Marathi, Hindi)
--------------------------------------------------------- */
const TRANSLATIONS = {
  English: {
    appName: "SANNIDHYA",
    tagline: "No matter the distance, always together.",
    hello: "Hello,",
    patientName: "Ramesh Patil",
    patientId: "Patient ID",
    howCanWeHelp: "How can we help you today?",

    // Home Tiles
    aiChecker: "AI Symptom Checker",
    aiCheckerSub: "Guidance & risk check",
    consultDoctor: "Consult Doctor",
    consultDoctorSub: "Talk to a doctor",
    healthRecords: "Health Records",
    healthRecordsSub: "Consultations & reports",
    medicines: "Medicines",
    medicinesSub: "Check availability",
    reminders: "Reminders",
    remindersSub: "Medicine alarms",
    emergency: "Emergency",
    emergencySub: "Get help now",

    // Bottom Navigation
    navHome: "Home",
    navMyths: "Myths",
    navRecords: "Record",
    navMedicines: "Medicine",
    navEmergency: "Emergency",
    navProfile: "Profile",

    // Myth Busters
    mythBustersTitle: "Health Awareness",
    mythBustersSub: "Common health beliefs — let's separate fact from fiction",
    commonBelief: "Common Belief",
    sannidhyaExplains: "SANNIDHYA explains",
    watchVideo: "Watch",
    searchVideos: "Search videos...",
    noResults: "No results found",
    aajiTab: "Aaji Cha Batwa",
    mythsTab: "Myth vs Reality",
    outbreaksTab: "Disease Outbreaks",
    outbreaksSub: "Stay informed about disease outbreaks in your area",
    outbreakHealthAlert: "Health Alert – Your Area",
    outbreakIncreasing: "Cases Increasing",
    outbreakSymptoms: "Symptoms",
    outbreakPrecautions: "Recommended Precautions",
    outbreakWhenUrgent: "When to Seek Urgent Care",
    outbreakPrecautionHygiene: "Maintain hand hygiene",
    outbreakPrecautionDistance: "Avoid close contact with symptomatic people",
    outbreakPrecautionHydrate: "Stay hydrated and rest",
    outbreakPrecautionMask: "Wear a mask in crowded or poorly ventilated places",
    outbreakPrecautionCare: "Seek medical care if symptoms are severe or worsening",
    outbreakUrgentBreathing: "Difficulty breathing",
    outbreakUrgentConfusion: "Confusion",
    outbreakUrgentWeakness: "Severe weakness",
    outbreakUrgentFever: "Persistent high fever",
    outbreakViewPrecautions: "View Precautions",
    outbreakNearbyFacilities: "Nearby Healthcare Facilities",
    outbreakCasesReported: "cases reported in your area",
    outbreakTrendUp: "Trending Up",
    outbreakTrendStable: "Stable",
    outbreakSeverityHigh: "High Alert",
    outbreakSeverityModerate: "Moderate Alert",
    outbreakSeverityLow: "Low Alert",
    outbreakArea: "Area",
    outbreakVillage: "Village",
    outbreakDistrict: "District",
    outbreakUpdated: "Last updated",
    outbreakAlertSource: "Based on aggregated local health reports",
    // ASHA
    outbreakAshaTitle: "Area Disease Trends",
    outbreakAshaVillages: "Villages with Increased Cases",
    outbreakAshaFollowUp: "Patients Requiring Follow-up",
    outbreakAshaAwareness: "Awareness Material for Home Visits",
    outbreakAshaPreventive: "Suggested Preventive Actions",
    outbreakAshaVisitHome: "Visit homes with reported cases",
    outbreakAshaDistribute: "Distribute awareness pamphlets",
    outbreakAshaEducate: "Educate families on preventive measures",
    outbreakAshaReport: "Report unusual patterns to CHO",
    // CHO / Doctor
    outbreakChoTitle: "Local Disease Trends",
    outbreakChoCases: "Case Trends",
    outbreakChoSymptoms: "Symptom Patterns",
    outbreakChoFacility: "Facility Visit Trends",
    outbreakChoHighRisk: "High-Risk Patients",
    outbreakChoTotalCases: "Total Cases This Week",
    outbreakChoNewToday: "New Cases Today",
    outbreakChoRecovered: "Recovered",
    outbreakChoActive: "Active Cases",
    outbreakChoReferred: "Referred",
    // Health Department
    outbreakDeptTitle: "Area Disease Surveillance",
    outbreakDeptMap: "Area-wise Trend Map",
    outbreakDeptPatterns: "Disease Patterns",
    outbreakDeptFacility: "Facility-wise Case Trends",
    outbreakDeptResources: "Resource & Medicine Requirements",
    outbreakDeptIntervention: "Early Intervention Planning",
    outbreakDeptRising: "Rising",
    outbreakDeptDeclining: "Declining",
    outbreakDeptStable: "Stable",
    outbreakDeptMedicineStock: "Medicine Stock Status",
    outbreakDeptBedAvailability: "Bed Availability",
    outbreakDeptStaffOnDuty: "Staff On Duty",
    aajiSub: "Health tips & wisdom from Aaji Cha Batwa",
    mythsSub: "Superstitious beliefs — the medical reality",
    aajiV1: "Aaji Cha Batwa - Health Tips",
    aajiV2: "Aaji Cha Batwa - Nutrition Advice",
    aajiV3: "Aaji Cha Batwa - Home Remedies",
    aajiV4: "Aaji Cha Batwa - Wellness Tips",
    aajiV5: "Aaji Cha Batwa - Traditional Health",
    aajiV6: "Aaji Cha Batwa - Immunity Boosting",
    aajiV7: "Aaji Cha Batwa - Seasonal Health",
    aajiV8: "Aaji Cha Batwa - Daily Health Routines",
    aajiV9: "Aaji Cha Batwa - Diabetes Management Tips",
    aajiV10: "Aaji Cha Batwa - Blood Pressure Control",
    aajiV11: "Aaji Cha Batwa - Joint Pain Relief",
    aajiV12: "Aaji Cha Batwa - Digestion Health",
    aajiV13: "Aaji Cha Batwa - Child Health Care",
    aajiV14: "Aaji Cha Batwa - Pregnancy Health Tips",
    aajiV15: "Aaji Cha Batwa - Skin Care Remedies",
    aajiV16: "Aaji Cha Batwa - Stress & Anxiety Relief",
    mythNaginFit: "\"Nagin fit\" happens because of a snake curse or supernatural power",
    realityNaginFit: "Seizures are a medical condition involving abnormal electrical activity in the brain. They need proper medical evaluation and treatment.",
    mythPossession: "A person became sick because a spirit has entered them",
    realityPossession: "Changes in behaviour, confusion, fainting, seizures, or hallucinations can have medical or mental-health causes that need evaluation.",
    mythEvilEye: "Someone's evil eye caused the illness",
    realityEvilEye: "Symptoms should be assessed for their actual medical cause rather than assuming they are caused by the evil eye.",
    mythBlackMagic: "Black magic caused the disease",
    realityBlackMagic: "Persistent symptoms require medical assessment and appropriate treatment; black magic is not a medical diagnosis.",
    mythGodAnger: "The illness happened because God is angry",
    realityGodAnger: "Illness can have many medical, infectious, genetic, environmental, or lifestyle-related causes.",
    mythBrandingSeizure: "Branding/burning the body removes the disease or spirit",
    realityBrandingSeizure: "Burning can cause serious injury, infection and permanent scarring and does not treat the underlying illness.",
    mythTempleCure: "Taking the sick person to a temple/shrine is enough to cure the disease",
    realityTempleCure: "Spiritual practices may be personally meaningful, but they should not replace necessary medical care.",
    mythEpilepsySpirit: "Epilepsy means a spirit has entered the person",
    realityEpilepsySpirit: "Epilepsy is a neurological disorder that can cause recurrent seizures and can be medically treated.",
    mythMentalPossession: "Mental illness means the person is possessed or weak-minded",
    realityMentalPossession: "Mental-health conditions are real health conditions with multiple possible causes and can require professional treatment.",
    mythFullMoon: "A full moon causes people to become mentally ill or have seizures",
    realityFullMoon: "There is no reliable basis for treating the full moon as the cause of these conditions.",
    mythSnakeMantra: "Snakebite can be cured by a mantra or ritual",
    realitySnakeMantra: "Snakebite can be a medical emergency and requires urgent medical assessment and appropriate treatment.",
    mythDogRitual: "A dog bite can be treated by a religious ritual instead of a hospital",
    realityDogRitual: "A bite requires prompt wound care and medical assessment for rabies prevention.",
    mythAmuletCure: "Wearing a particular thread or amulet will cure a disease",
    realityAmuletCure: "An amulet does not treat the underlying medical cause of an illness. Proper diagnosis and treatment are needed.",
    mythNewbornEvilEye: "A newborn is sick because someone cast an evil eye",
    realityNewbornEvilEye: "Newborn symptoms can have serious medical causes and should be assessed promptly by a healthcare provider.",
    mythHerbalCureAll: "A sacred or herbal remedy can cure every illness",
    realityHerbalCureAll: "Some traditional practices may be harmless, but not every remedy is effective or safe, and some illnesses need medical treatment.",
    mythPrayerCures: "Praying alone will cure serious disease",
    realityPrayerCures: "Prayer can provide emotional and spiritual support, but serious illness still requires appropriate healthcare.",
    mythFaintingSpirit: "Someone who suddenly faints has been affected by a spirit",
    realityFaintingSpirit: "Fainting can result from dehydration, low blood pressure, low blood sugar, heart problems, and other medical causes.",
    mythBadBlood: "A person became sick because of bad blood or impurity",
    realityBadBlood: "Symptoms need to be evaluated based on their medical cause, not the idea of impure blood.",
    mythCurseIllness: "A particular person's curse caused the illness",
    realityCurseIllness: "Illness is not medically explained by another person's curse. Proper diagnosis and medical evaluation are important.",
    mythRitualRecurring: "A ritual alone can remove a recurring illness",
    realityRitualRecurring: "Repeated or worsening symptoms should prompt medical evaluation and follow-up, not reliance on ritual alone.",

    // Symptoms (Q1)
    symptomsList: [
      { label: "Headache & fever", zone: "yellow" },
      { label: "Cough and cold", zone: "yellow" },
      { label: "Stomach pain", zone: "yellow" },
      { label: "Chest pain & breathlessness", zone: "red" },
    ],

    // Questionnaire
    q1Title: "What is your main symptom?",
    q2Title: "How long have you had these symptoms?",
    q2Opts: ["Since today", "1–2 days", "3–7 days", "More than a week"],
    q3Title: "How would you describe your current condition?",
    q3Opts: ["Mild – manageable", "Moderate – uncomfortable", "Severe – distressing", "Getting worse quickly"],
    q4Title: "Do you have any of these symptoms?",
    q4Subtitle: "You can select more than one",
    q4Opts: ["Breathlessness", "Vomiting", "Dizziness", "High fever (>102°F)", "None of these"],
    q5Title: "Do any of these apply to you?",
    q5Opts: ["Pregnant", "Elderly (60+ years)", "Chronic illness (diabetes / BP / heart)", "None of these"],
    continueBtn: "Continue",
    questionProgress: "Question",
    ofText: "of",
    analysingText: "Analysing your answers…",

    // Zones
    zones: {
      yellow: {
        name: "YELLOW ZONE — Moderate",
        guidance: "Your symptoms need attention. Please consult a healthcare provider within 1–2 days and monitor your condition closely.",
      },
      orange: {
        name: "ORANGE ZONE — Serious",
        guidance: "Your symptoms are serious and need urgent attention. Please see a Medical Officer as soon as possible today.",
      },
      red: {
        name: "EMERGENCY",
        guidance: "Your symptoms may be a medical emergency. Please seek emergency care immediately.",
      },
    },

    // Risk Assessment
    riskAssessment: "Risk Assessment",
    riskLevel: "Risk Level",
    riskScoreLabel: "Risk Score",
    contributingFactors: "What's contributing to your risk",
    patientFactors: "Your personal factors",
    symptomSeverity: "Symptom severity",
    durationImpact: "Duration impact",
    overallRisk: "Overall risk",
    low: "Low",
    moderate: "Moderate",
    high: "High",
    critical: "Critical",
    whatThisMeans: "What this means for you",
    whatToWatch: "What to watch for",
    immediateActions: "What you should do now",
    selfCareTips: "Self-care steps",
    seekCareWhen: "When to seek care immediately",
    riskFactorsLabels: {
      chestPain: "Chest pain reported",
      breathlessness: "Difficulty breathing",
      severeCondition: "Severe symptoms reported",
      highFever: "High fever (>102°F)",
      chronicIllness: "Pre-existing chronic illness",
      elderly: "Age-related risk (60+)",
      pregnant: "Pregnancy complicates treatment",
    },
    durationLabels: {
      today: "Started today — monitor closely",
      fewDays: "Persisting 1–2 days — needs attention",
      week: "Ongoing 3–7 days — consult a doctor",
      longTerm: "Over a week — urgent consultation needed",
    },
    riskAdviceYellow: "Your symptoms need attention within 1–2 days. Monitor closely and visit a healthcare provider if you don't improve.",
    riskAdviceOrange: "Your symptoms are serious. Please consult a medical officer as soon as possible today. Do not delay.",
    riskAdviceRed: "This may be a medical emergency. Seek emergency care immediately. Do not wait.",
    // Immediate Actions
    actionRestHydrate: "Rest and stay hydrated",
    actionMonitorTemp: "Monitor your temperature regularly",
    actionRecordSymptoms: "Keep a record of your symptoms",
    actionNoSelfMed: "Do not self-medicate",
    actionVisitOfficer: "Visit a medical officer today",
    actionBringPrescriptions: "Bring any previous prescriptions",
    actionCallEmergency: "Call emergency services immediately (108)",
    actionDontWait: "Do not wait for symptoms to improve",
    actionGoHospital: "Go to the nearest hospital now",
    // ABHA Records
    abhaHealthSummary: "Health Summary",
    abhaLinkedFacilities: "Linked Facilities",
    abhaRecentRecords: "Recent Health Records",
    abhaContinueHome: "Continue to Home with Linked Records",
    abhaVerified: "VERIFIED",
    abhaBloodGroup: "Blood Group",
    abhaAllergies: "Allergies",
    abhaChronic: "Chronic Conditions",
    abhaMedications: "Current Medications",
    abhaLastVisit: "Last Visit",
    abhaRecords: "records",
    // Warning Signs
    warningSignsTitle: "Watch for these warning signs",
    warningSigns: [
      "High fever that doesn't come down",
      "Difficulty breathing",
      "Severe or worsening pain",
      "Confusion, fainting, or extreme weakness",
    ],
    aiDisclaimer: "This is AI-assisted guidance only, not a diagnosis, and does not book a consultation. If you'd like to speak with a doctor, open Consult Doctor from the home screen.",

    // Doctor Roles & Consult
    choRole: "Chief Health Officer (CHO)",
    moRole: "Medical Officer (MO)",
    choNote: "Chief Health Officer assigned for Yellow / Green zone cases",
    moNote: "Medical Officer assigned for Orange zone cases",
    recommendedDoctor: "Recommended doctor",
    aiRecommendations: "AI recommendations",
    recsList: [
      "Rest and stay hydrated",
      "Monitor your symptoms",
      "Follow up if symptoms worsen"
    ],
    recommendConsultMsg: "Based on AI analysis, we recommend consultation with the following doctor.",
    startConsultWith: "Start consultation with",
    aiUrgencyDisclaimer: "This is an AI-assisted urgency check, not a diagnosis. The doctor makes the final clinical decision.",
    
    // Queue & Call
    inQueue: "In Queue",
    patientsAhead: "patients ahead of you",
    estWaitTime: "estimated wait time",
    mins: "mins",
    available: "available",
    assignedDoctor: "Assigned doctor — routed by risk level",
    consultDetails: "Consultation details",
    symptomLabel: "Symptoms",
    prelimAnalysis: "Preliminary analysis",
    gettingReady: "Getting your doctor ready…",
    pleaseWaitQueue: "Please wait, you'll be connected automatically.",
    connectingToDoctor: "Connecting to Doctor",
    pleaseWaitConnect: "Please wait while we connect you…",
    startConsultationBtn: "Start Consultation",
    goodConnection: "Good connection",

    // Consultation Complete & Feedback
    consultComplete: "Consultation complete",
    consultCompleteMsg: "Your consultation has been completed.",
    diagnosis: "Diagnosis",
    diagnosisMsg: "General health check required — mild viral symptoms",
    prescribedMeds: "Prescribed medicines",
    downloadPrescription: "Prescription",
    prescriptionDownloaded: "Prescription downloaded successfully",
    prescriptionShared: "Prescription shared successfully",
    viewReferral: "View referral",
    rateConsultation: "Rate this consultation",
    doctorFeedback: "Doctor Feedback",
    rateTheDoctor: "Rate the doctor",
    overallRatingFor: "Overall rating for",
    commExplanation: "Communication and explanation",
    satisfactionTreatment: "Satisfaction with treatment",
    satOptions: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    additionalFeedback: "Additional feedback",
    recommendDoctorQuestion: "Would you recommend this doctor?",
    yes: "Yes",
    no: "No",
    shareExperience: "Share your experience",
    textareaPlaceholder: "Doctor's behaviour, treatment quality, or any suggestions…",
    ratingSummary: "Your rating summary",
    overall: "Overall",
    comm: "Communication",
    treatmentSat: "Treatment satisfaction",
    recommendText: "Recommend",
    submitFeedback: "Submit feedback",
    thankYou: "Thank you",
    feedbackAppreciated: "Your feedback helps us provide better healthcare services.",
    backToHome: "Back to home",
    checkAnother: "Check Another",
    emergencyHelpBtn: "Go to Emergency Help",

    // Health Records
    myHealthRecords: "My Health Records",
    consultations: "Consultations",
    prescriptions: "Prescriptions",
    referrals: "Referrals",
    diagnostics: "Diagnostic lab reports",
    referralStatus: "Referral status",
    pending: "Pending",
    completed: "Completed",
    referredBy: "Referred by",
    referredTo: "Referred to",
    specialist: "Specialist",
    reason: "Reason",
    date: "Date",
    timeline: "Timeline",
    referralCreated: "Referral created",
    hospitalVisit: "Hospital visit",
    treatmentCompleted: "Treatment completed",
    doctorAdviceNote: "Take medicine as per doctor advice.",
    download: "Download",
    share: "Share",
    nextStepsNote: "Next steps will appear here once the receiving facility responds.",

    // Medicines
    medicineAvailability: "Medicine Availability",
    searchMedicine: "Search medicine",
    inStock: "In stock",
    outOfStock: "Out of stock",
    stockUpdated: "Stock updated today, 10:30 AM",

    // Reminders
    medicineReminders: "Reminders",
    addMedication: "Add medication",
    medNameLabel: "Medicine name",
    descLabel: "Description",
    timeLabel: "Time",
    addBtn: "Add",
    cancelBtn: "Cancel",
    noRemindersMsg: "No reminders yet. Tap + to add a medicine reminder.",
    phMedName: "e.g. Paracetamol 500mg",
    phDesc: "e.g. After food, 3 days",
    phTime: "9:00 PM",

    // Emergency
    emergencyTitle: "Emergency Help",
    emergencyWarning: "If this is life-threatening, call an ambulance immediately.",
    callAmbulance: "Call Ambulance — 108",
    ashaWorker: "ASHA Worker - IVR Call",
    callHealthCentre: "Call healthcare centre",
    emergencyDisclaimer: "Emergency communication needs a working network connection. If you have no signal, go to the nearest healthcare facility right away.",

    // Emergency Call UI
    callConnecting: "Calling...",
    callConnected: "Connected",
    callEnded: "Call Ended",
    callDuration: "Duration",
    callBackToEmergency: "Back to Emergency",
    callEndCall: "End Call",
    callSpeaker: "Speaker",
    callMute: "Mute",
    callKeypad: "Keypad",
    call108Title: "108",
    call108Sub: "Ambulance Service",
    callAshaTitle: "SANNIDHYA Helpline",
    callHealthTitle: "Healthcare Centre",
    callConnectingTo: "Connecting to",
    callConnectedTo: "Connected to",
    callAshaWorker: "ASHA Worker",
    callCHO: "CHO",
    callEmergencyService: "Emergency Service",
    callHealthcareCentre: "Healthcare Centre",
    callIvrWelcome: "SANNIDHYA हेल्पलाइनमध्ये तुमचे स्वागत आहे. आशा कार्यकर्त्याशी जोडण्यासाठी एक दाबा. सीएचओशी जोडण्यासाठी दोन दाबा. आपत्कालीन मदतीसाठी तीन दाबा.",
    callConnectingAsha: "आपल्याला आशा कार्यकर्त्याशी जोडले जात आहे. कृपया थांबा.",
    callAshaConnected: "आपण आशा कार्यकर्त्याशी जोडले गेले आहात.",
    callConnectingCho: "आपल्याला समुदाय आरोग्य अधिकाऱ्याशी जोडले जात आहे. कृपया थांबा.",
    callChoConnected: "आपण समुदाय आरोग्य अधिकाऱ्याशी जोडले गेले आहात.",
    callInvalidOption: "कृपया योग्य पर्याय निवडा.",
    callAshaMenu1: "आरोग्य समस्येबाबत मदत",
    callAshaMenu2: "घरभेटीची विनंती",
    callAshaMenu3: "औषध किंवा उपचाराबाबत मदत",
    callAshaMenu0: "मुख्य मेनू",
    callAshaAssist1: "आपली आरोग्य समस्या नोंदवण्यासाठी कृपया आशा कार्यकर्त्याशी बोला.",
    callAshaAssist2: "घरभेटीची विनंती नोंदवली जात आहे.",
    callAshaAssist3: "औषध आणि उपचाराबाबत मदतीसाठी आशा कार्यकर्त्याशी जोडले जात आहे.",
    callChoMenu1: "डॉक्टरांशी संपर्क",
    callChoMenu2: "तपासणीची माहिती",
    callChoMenu3: "रेफरलची माहिती",
    callChoMenu0: "मुख्य मेनू",
    callChoAssist1: "डॉक्टरांशी संपर्क साधण्यासाठी विनंती नोंदवली जात आहे.",
    callChoAssist2: "आपल्या तपासणीची माहिती मिळवण्यासाठी कृपया प्रतीक्षा करा.",
    callChoAssist3: "आपल्या रेफरलची माहिती तपासली जात आहे.",
    callEmergencyMsg: "ही आपत्कालीन सेवा आहे. कृपया तातडीच्या मदतीसाठी १०८ वर कॉल करा किंवा जवळच्या आरोग्य केंद्रात जा.",
    callHomeVisitSubmitted: "Home Visit Request Submitted Successfully",
    callDoctorRequested: "Doctor Assistance Requested",
    callDiagnosticAssist: "Diagnostic Assistance",
    callReferralStatus: "Referral Status — Accepted",
    callAshaAssistActive: "ASHA Assistance Active",
    callVoiceUnavailable: "Marathi voice is unavailable on this device. Please use the on-screen IVR keypad.",
    callListenAgain: "Listen Again",

    // Profile
    myProfile: "My Profile",
    personalInfo: "Personal information",
    healthInfo: "Health information",
    settings: "Settings",
    helpSupport: "Help & support",
    logOut: "Log out",

    // Profile - Personal Data Labels
    profileName: "Name",
    profileDob: "Dob",
    profileAge: "Age",
    profileGender: "Gender",
    profileMobile: "Mobile",
    profileEmail: "Email",
    profileAbhaId: "Abha Id",
    profileBloodGroup: "Blood Group",
    profileAddress: "Address",
    profileEmergencyContact: "Emergency Contact",
    profileAadhaar: "Aadhaar",
    profileOccupation: "Occupation",
    profileMaritalStatus: "Marital Status",
    profileMale: "Male",
    profileFemale: "Female",
    profileOther: "Other",

    // Profile - Health Data Labels
    profileHeight: "Height",
    profileWeight: "Weight",
    profileBmi: "BMI",
    profileAllergies: "Allergies",
    profileChronicConditions: "Chronic Conditions",
    profileCurrentMedications: "Current Medications",
    profileLastVisit: "Last Visit",
    profileVaccinations: "Vaccinations",
    profileSmokingStatus: "Smoking Status",
    profileAlcoholStatus: "Alcohol Status",
    profileExerciseFrequency: "Exercise Frequency",
    profileInsurance: "Insurance",
    profileNoneReported: "None reported",
    profileNonSmoker: "Non-smoker",
    profileOccasional: "Occasional",
    profileActive: "Active",
    profileNotAvailable: "Not available",

    // Profile - Settings Labels
    profileLanguage: "Language",
    profileNotifications: "Notifications",
    profileEnabled: "Enabled",
    profileDarkMode: "Dark Mode",
    profileOff: "Off",
    profileTextSize: "Text Size",
    profileMedium: "Medium",
    profileTwoFactor: "Two-Factor Authentication",
    profileDataSharing: "Data Sharing",
    profileLimited: "Limited",
    profileAutoLock: "Auto-Lock",
    profileAfter5Min: "After 5 minutes",

    // Profile - Help Labels
    profileFaq: "FAQs",
    profileFaqDesc: "Frequently asked questions",
    profileContactSupport: "Contact Support",
    profileContactSupportDesc: "Call: 1800-XXX-XXXX (Toll Free)",
    profileReportProblem: "Report a Problem",
    profileReportProblemDesc: "Send feedback or report a bug",
    profilePrivacyPolicy: "Privacy Policy",
    profilePrivacyPolicyDesc: "How we protect your data",
    profileTermsOfService: "Terms of Service",
    profileTermsOfServiceDesc: "App usage terms and conditions",
    profileAppVersion: "App Version",
    profileAppVersionDesc: "v1.0.0 (Build 2026.09)",

    // Profile - Logout
    profileLogoutConfirm: "Log out?",
    profileLogoutMsg: "You will be returned to the role selection screen.",
    profileCancel: "Cancel",

    // Role Select
    selectRole: "Select your role",
    rolePatient: "Patient",
    rolePatientSub: "Book consultations and manage your health",
    roleAsha: "ASHA Worker / Supervisor",
    roleAshaSub: "Community health support and field care",
    roleDoctor: "Doctor",
    roleDoctorSub: "Healthcare providers and consultations",
    rolePharmacy: "Pharmacy",
    rolePharmacySub: "Medicines, availability and requests",
    roleDiagnostic: "Diagnostic Center",
    roleDiagnosticSub: "Tests, reports and diagnostics",

    // ABHA Login
    abhaLoginTitle: "ABHA Health ID Login",
    abhaLoginSub: "Ayushman Bharat Health Account — your national digital health ID",
    abhaNumberLabel: "ABHA Number (14-digit)",
    abhaNumberPlaceholder: "e.g., 1234-5678-9012",
    abhaAadhaarLabel: "Aadhaar Number (12-digit)",
    abhaAadhaarPlaceholder: "e.g., 1234 5678 9012",
    abhaOtpLabel: "Enter OTP sent to your Aadhaar-linked mobile",
    abhaDemoOtp: "Demo OTP: 123456",
    abhaLoginBtn: "Verify & Login with ABHA",
    abhaCreateBtn: "Create New ABHA ID",
    abhaCreateTitle: "Create Your ABHA ID",
    abhaCreateSub: "You need Aadhaar or Driving License to create ABHA",
    abhaCreateOption1: "Using Aadhaar Number",
    abhaCreateOption2: "Using Driving License",
    abhaCreateBtnText: "Generate ABHA ID",
    abhaVerifyMobile: "Verify Mobile Number",
    abhaMobileLabel: "Mobile Number",
    abhaMobilePlaceholder: "+91-XXXXXXXXXX",
    abhaLinkedRecords: "Your Linked Health Records",
    abhaRecordTypes: "All records linked to your ABHA ID across India",
    abhaRecordConsent: "By logging in, you consent to sharing your health records with this app for consultation and care purposes.",
    abhaWhatIs: "What is ABHA?",
    abhaWhatIsDesc: "ABHA (Ayushman Bharat Health Account) is a 14-digit unique health ID that links all your health records digitally across India. It allows seamless sharing of medical history, prescriptions, lab reports, and diagnoses between healthcare providers.",
    abhaBenefits: "Benefits of ABHA",
    abhaBenefit1: "Unified health records across all hospitals",
    abhaBenefit2: "Instant access to prescriptions & lab reports",
    abhaBenefit3: "Share records with any doctor in India",
    abhaBenefit4: "Track health history over time",
    abhaBenefit5: "Free & secure — Government of India initiative",

    // Doctor Role Select
    doctorRoleTitle: "Select your specific role",
    doctorRoleCHO: "Chief Health Officer",
    doctorRoleCHOSub: "Primary healthcare management",
    doctorRoleMO: "Medical Officer",
    doctorRoleMOSub: "Advanced medical consultations",
    doctorRoleCivil: "Civil Hospital Doctor",
    doctorRoleCivilSub: "Hospital-based consultations",
    doctorRoleEmergency: "Emergency Doctor",
    doctorRoleEmergencySub: "Emergency medical care",

    // Doctor Login
    doctorLoginTitle: "Login",
    doctorLoginSub: "Quick login with pre-filled credentials",
    choIdLabel: "CHO ID",
    choOtpLabel: "Enter OTP",
    doctorDemoOtp: "Demo OTP: 123456",
    doctorLoginBtn: "Login",
    doctorCredHint: "Sample credentials are pre-filled. Just click Login!",
    doctorAvailIds: "Available demo IDs:",
    doctorDemoIds: "CHO001",
    moIdLabel: "MO ID",
    moDemoIds: "MO002",
    moDashRole: "Medical Officer",
    moDashToday: "Today's Consultations",
    moDashQueue: "Your Queue",
    moDashWaiting: "Total Waiting",
    moDashPatientQueue: "Patient Queue",
    moDashPatientQueueSub: "Manage patient queue and start consultations",
    moDashPatientsWaiting: "patients waiting",
    moDashQuickConsult: "Quick Consultation",
    moDashQuickConsultSub: "Start next consultation immediately",
    moDashReady: "Ready to start",
    moDashRecent: "Recent Consultations",
    moDashNoRecent: "No consultations today",
    moQueueTitle: "Patient Queue",
    moQueueEstWait: "Est. Wait:",
    moQueueSince: "In queue since",
    moQueueStartConsult: "Start Consultation",
    moQueueTagEmergency: "Tag as Emergency",
    moRedirectTitle: "Redirect Patient to Specialist",
    moRedirectChoose: "Choose the appropriate care level for:",
    moRedirectCivil: "Redirect to Civil Hospital",
    moRedirectCivilDesc: "For complex cases requiring hospital facilities and advanced care",
    moRedirectCancel: "Cancel",

    // CHO Dashboard
    choDashGreeting: "Good morning",
    choDashRole: "Chief Health Officer",
    choStatusAvailable: "Available",
    choStatusBusy: "Busy",
    choStatusOffline: "Offline",
    choStatusDesc: "You are available for consultations",
    choTodayConsult: "Today's Consultations",
    choYourQueue: "Your Queue",
    choTotalWaiting: "Total Waiting",
    choPatientQueue: "Patient Queue",
    choPatientQueueDesc: "Manage patient queue and start consultations",
    choPatientsWaiting: "patients waiting",
    choQuickConsult: "Quick Consultation",
    choQuickConsultDesc: "Start next consultation immediately",
    choReadyToStart: "Ready to start",
    choRedirectionDemo: "Redirection Demo",
    choRedirectionDemoDesc: "View sample patient redirection notifications",
    choRedirectionSample: "Sample CHO → MO/Civil Hospital notifications",
    choRecentConsult: "Recent Consultations",
    choProfile: "Profile",

    // Patient Queue Screen
    pQueueTitle: "Patient Queue",
    pQueueOrangeCases: "Orange Cases",
    pQueueAvgWait: "Avg Wait Time",
    pQueueDoctorStatus: "Doctor Status",
    pQueueAvailable: "Available for Consultations",
    pQueueOnline: "ONLINE",
    pQueueReadyText: "Ready to accept new patients",
    pQueueAvgConsTime: "Average consultation: 15 minutes",
    pQueuePatientQueue: "Patient Queue",
    pQueueStartConsult: "Start Consultation",
    pQueueTagEmergency: "Tag as Emergency",
    pQueueEstWait: "Est. Wait:",
    pQueueInQueueSince: "In queue since:",
    pQueueQueueScope: "Your Queue Scope",
    pQueueAsCHO: "As a Chief Health Officer, you handle:",
    pQueueYellowCases: "Primary care cases",

    // Consultation Screen
    consultTitle: "Consultation",
    consultDuration: "Duration:",
    consultSaveDraft: "Save Draft",
    consultPatientInfo: "Patient Information",
    consultHistory: "History",
    consultVitals: "Vitals",
    consultExamination: "Examination",
    consultPrescription: "Prescription",
    consultPatientOverview: "Patient Overview",
    consultFirstReg: "First Registration:",
    consultTotalConsults: "Total Consultations:",
    consultLastVisit: "Last Visit:",
    consultFirstVisit: "First visit",
    consultEmergencyVisits: "Emergency Visits:",
    consultToday: "Today's Consultation",
    consultDate: "Date:",
    consultTime: "Time:",
    consultPriority: "Priority:",
    consultSymptoms: "Current Symptoms:",
    consultPrevious: "Previous Consultations",
    consultStartVideo: "Start Video Call",
    consultVoiceCall: "Voice Call",
    consultTextChat: "Text Chat",

    // Vitals
    vitalsTitle: "Vital Signs",
    vitalsBP: "Blood Pressure (mmHg)",
    vitalsHR: "Heart Rate (bpm)",
    vitalsTemp: "Temperature (°F)",
    vitalsWeight: "Weight (kg)",
    vitalsHeight: "Height (cm)",
    vitalsO2: "Oxygen Saturation (%)",

    // Examination
    examTitle: "Clinical Examination",
    examDiagnosis: "Diagnosis",
    examDiagnosisPlaceholder: "Enter primary diagnosis",
    examNotes: "Clinical Notes",
    examNotesPlaceholder: "Enter examination findings, treatment plan, follow-up instructions...",

    // Prescription
    rxTitle: "Prescription",
    rxAddMedicine: "Add Medicine",
    rxNoMeds: "No medicines prescribed yet",
    rxAddFirst: "Add First Medicine",
    rxMedName: "Medicine Name",
    rxDosage: "Dosage",
    rxFrequency: "Frequency",
    rxDuration: "Duration",
    rxInstructions: "Instructions",
    rxSelectMed: "Select or type medicine name",
    rxSelectFromList: "Select from available medicines",
    rxDelete: "Delete",

    // Video Consult
    videoTitle: "Video Consultation",
    videoGoodConn: "GOOD Connection",
    videoPatientFeed: "Patient Video Feed",
    videoYourFeed: "Your Video",
    videoQuickNotes: "Quick Notes",
    videoNotesPlaceholder: "Type quick notes during the call...",
    videoMute: "Mute",
    videoCamera: "Camera",
    videoChat: "Chat",
    videoEndCall: "End Call",
    videoRecord: "Record",

    // Redirect Modal
    redirectTitle: "Redirect Patient to Specialist",
    redirectChoose: "Choose the appropriate care level for:",
    redirectMO: "Redirect to Medical Officer",
    redirectMODesc: "For moderate cases requiring specialized care",
    redirectMOTime: "15-20 mins",
    redirectCivil: "Redirect to Civil Hospital",
    redirectCivilDesc: "For complex cases requiring hospital facilities",
    redirectCivilTime: "30-45 mins",
    redirectCancel: "Cancel",

    // Patient Login (existing)
    patientAuthTitle: "Patient Login",
    patientAuthSub: "Login with Patient ID or ABHA Health ID",
    patientIdAuthLabel: "Patient ID / Mobile Number",
    patientIdAuthPlaceholder: "e.g., P001 or 9876543210",
    patientRoleHint: "💡 Access AI symptom checker, teleconsultations, prescriptions & ABHA health records",
    patientCredHint: "Try ABHA login for full health record access!",
    patientAvailIds: "Demo ABHA ID: 12345678901234",
    patientDemoIds: "Or Patient ID: P001 (Ram Sharma)",

    // ASHA Login
    ashaLoginTitle: "Login",
    ashaLoginSub: "ASHA Worker / Supervisor",
    ashaIdLabel: "ASHA Worker ID / Supervisor ID",
    ashaIdPlaceholder: "e.g., MH-PUN-W-04-012 (Worker) or MH-PUN-S-04-012 (Supervisor)",
    otpLabel: "Enter OTP",
    demoOtp: "Demo OTP: 123456",
    ashaLoginBtn: "Login",
    ashaRoleHint: "Your appropriate dashboard will be shown automatically based on your role.",
    ashaCredHint: "Sample credentials are pre-filled. Just click Login!",
    ashaAvailIds: "Available demo IDs:",
    ashaWorkerIds: "Workers: MH-PUN-W-04-012, A002, A003 | Supervisor: MH-PUN-S-04-012",

    // Pharmacy Login
    pharmacyLoginTitle: "Login",
    pharmacyLoginSub: "Quick login with pre-filled credentials",
    pharmacyLicenseLabel: "Pharmacy License ID",
    pharmacyOtpLabel: "Enter OTP",
    pharmacyDemoOtp: "Demo OTP: 123456",
    pharmacyLoginBtn: "Login",
    pharmacyVerifiedNote: "Verified pharmacies can manage medicine availability and requests.",
    pharmacyCredHint: "Sample credentials are pre-filled. Just click Login!",
    pharmacyAvailIds: "Available demo credentials:",
    pharmacyDemoLicense: "MH-TZ4-567890",

    // Pharmacy Dashboard
    pharmacyDashTitle: "Pharmacy Dashboard",
    pharmacyDashName: "Nandgaon PHC Pharmacy",
    pharmacyDashLicense: "License: MH-TZ4-567890",
    pharmacyTotalMedicines: "Total Medicines",
    pharmacyInStock: "In Stock",
    pharmacyLowStock: "Low Stock",
    pharmacyOutOfStock: "Out of Stock",
    pharmacyInventory: "Medicine Inventory",
    pharmacySearchMedicine: "Search medicines...",
    pharmacyStockAll: "All",
    pharmacyStockIn: "In Stock",
    pharmacyStockLow: "Low",
    pharmacyStockOut: "Out",
    pharmacyRequests: "Prescription Requests",
    pharmacyRequestFrom: "From",
    pharmacyRequestPatient: "Patient",
    pharmacyRequestMeds: "Medicines",
    pharmacyRequestStatus: "Status",
    pharmacyReqPending: "Pending",
    pharmacyReqDispensed: "Dispensed",
    pharmacyReqReady: "Ready",
    pharmacyDispense: "Dispense",
    pharmacyMarkReady: "Mark Ready",
    pharmacyStockUpdate: "Update Stock",
    pharmacyStockAdded: "Stock updated",
    pharmacyAlerts: "Stock Alerts",
    pharmacyAlertLow: "Low stock — order soon",
    pharmacyAlertOut: "Out of stock — urgent reorder",
    pharmacySupply: "Supply Tracker",
    pharmacyLastOrder: "Last order",
    pharmacyNextOrder: "Next order",
    pharmacyOrderNow: "Order Now",
    pharmacyLogout: "Logout",
    pharmacyProfile: "Profile",
    pharmacyMedName: "Medicine",
    pharmacyMedCategory: "Category",
    pharmacyMedQty: "Qty",
    pharmacyMedExpiry: "Expiry",
    pharmacyMedAction: "Action",
    pharmacyCategoryAntibiotic: "Antibiotic",
    pharmacyCategoryAnalgesic: "Analgesic",
    pharmacyCategoryAntipyretic: "Antipyretic",
    pharmacyCategoryAntidiabetic: "Antidiabetic",
    pharmacyCategoryCardiac: "Cardiac",
    pharmacyCategoryRespiratory: "Respiratory",
    pharmacyCategoryGastro: "Gastro",
    pharmacyCategoryVitamin: "Vitamin",
    pharmacyReferralPending: "Referral Pending",
    pharmacyReferralReady: "Ready for Pickup",
    pharmacyReferralDispensed: "Dispensed",

    // Diagnostic Center Login
    diagnosticLoginTitle: "Login",
    diagnosticLoginSub: "Quick login with pre-filled credentials",
    diagnosticCeaLabel: "CEA Registration ID",
    diagnosticOtpLabel: "Enter OTP",
    diagnosticDemoOtp: "Demo OTP: 123456",
    diagnosticLoginBtn: "Login",
    diagnosticVerifiedNote: "Verified diagnostic centers can manage tests, reports and diagnostic services.",
    diagnosticCredHint: "Sample credentials are pre-filled. Just click Login!",
    diagnosticAvailIds: "Available demo credentials:",
    diagnosticDemoCea: "CEA-MH-2026-9874",
    diagnosticNablNote: "Note: - Not every diagnostic center will be NABL-accredited so sticking with CEA ID",

    // Diagnostic Dashboard
    diagDashTitle: "Diagnostic Center",
    diagDashName: "Nandgaon Diagnostic Lab",
    diagDashCea: "CEA: CEA-MH-2026-9874",
    diagTotalTests: "Total Tests",
    diagCompleted: "Completed",
    diagPending: "Pending",
    diagReportsReady: "Reports Ready",
    diagTestRequests: "Test Requests",
    diagSearchTests: "Search tests...",
    diagReqFrom: "From",
    diagReqPatient: "Patient",
    diagReqTest: "Test",
    diagReqStatus: "Status",
    diagReqPending: "Pending",
    diagReqInProgress: "In Progress",
    diagReqReady: "Report Ready",
    diagStartTest: "Start Test",
    diagMarkReady: "Mark Ready",
    diagAvailableTests: "Available Tests",
    diagTestCategory: "Category",
    diagTestPrice: "Price",
    diagTestTAT: "TAT",
    diagTestAction: "Action",
    diagCatBlood: "Blood Test",
    diagCatImaging: "Imaging",
    diagCatCardiac: "Cardiac",
    diagCatPathology: "Pathology",
    diagCatUrine: "Urine",
    diagReports: "Recent Reports",
    diagReportPatient: "Patient",
    diagReportTest: "Test",
    diagReportDate: "Date",
    diagReportStatus: "Status",
    diagReportView: "View",
    diagReportDownload: "Download",
    diagLogout: "Logout",
    diagProfile: "Profile",
    diagStatusPending: "Pending",
    diagStatusInProgress: "In Progress",
    diagStatusReady: "Ready",
    diagStatusCollected: "Collected",

    // ASHA Dashboard
    ashaDashTitle: "ASHA Dashboard",
    ashaWorkerName: "Priya Patel",
    totalPatients: "Total Patients",
    activeCases: "Active Cases",
    completedToday: "Completed Today",
    emergencyCases: "Emergency Cases",
    quickActions: "Quick Actions",
    viewPatientSurvey: "View Patient Survey",
    healthDrives: "Health Drives",
    registerNewPatient: "Register New Patient",
    helpPatientLogin: "Help Patient Login",
    patientServices: "Patient Services",
    aiSymptomChecker: "AI Symptom Checker",
    consultDoctor2: "Consult Doctor",
    pastConsultations: "Past Consultations",
    diseaseAnalytics: "Disease Analytics",
    myArea: "My Area",
    coverageArea: "Coverage Area",
    ashaWorkerId: "ASHA Worker ID",
    phoneNumber: "Phone Number",
    recentActivity: "Recent Activity",
    logout: "Logout",

    // ASHA New Screens
    healthSurveys: "Health Surveys",
    surveyLanguage: "Survey Language",
    searchPatients: "Search patients...",
    registerNewPatientTitle: "Register New Patient",
    personalInfoSec: "Personal Information",
    fullName: "Full Name *",
    enterFullName: "Enter patient's full name",
    age: "Age *",
    gender: "Gender *",
    selectGender: "Select",
    contactInfo: "Contact Information",
    phoneNumberLabel: "Phone Number *",
    addressLabel: "Address",
    addressPlaceholder: "Village, District",
    emergencyContactLabel: "Emergency Contact",
    healthInfoLabel: "Health Information",
    familySizeLabel: "Family Size",
    familySizePlaceholder: "e.g., 4",
    registerPatientBtn: "Register Patient",
    patientLoginTitle: "Patient Login",
    findPatient: "Find Patient",
    findPatientSub: "Enter the Patient ID to search and login",
    patientIdLabel: "Patient ID",
    patientIdPlaceholder: "Enter Patient ID (e.g., P001)",
    searchPatientBtn: "Search Patient",
    quickAccess: "Quick Access",
    back: "Back",
    patientRegisteredMsg: "Patient registered successfully!",
    callIvrInstructions: "Press 1 for ASHA · Press 2 for 108",
    surveySelected: "Selected:",
    surveyChecklistReady: "Survey checklist ready for home visit.",
    activityRegistered: "Patient registered",
    activityConsultDone: "Consultation completed",
    activityEmergencyRef: "Emergency case referred",
    hoursAgo: "hours ago",
    patientIdTab: "Patient ID",
    abhaHealthIdTab: "ABHA Health ID",
    loginBtn: "Login",
    orDivider: "— OR —",
    verifyOtpBtn: "Verify OTP & Access Records",
    backToLogin: "← Back",
    sampleCredHint: "Sample credentials are pre-filled. Just click Login!",
    ashaAssessment: "ASHA Assessment",
    ashaAssistMode: "ASHA Worker Assistance Mode",
    assistingPatient: "Assisting Patient:",
    changeBtn: "Change",
    aiSymptomCheckFor: "AI Symptom Check:",
    teleconsultFor: "Teleconsultation for",
    ashaHotline: "ASHA Assisted Hotline · Connecting Patient to Duty Doctor",
    connectToDoctor: "Connect to Doctor",
    medicalHistoryFor: "Medical History:",
    outbreakAlerts: "Outbreak Alerts",
    vaccinationRate: "Vaccination Rate",
    communityTrends: "Community Disease Trends",
    patientsReportedWeek: "patients reported this week",
    activeOutbreaks: "Active Outbreaks",
    seasonalViralFever: "Seasonal Viral Fever",
    denguePrecaution: "Dengue Precaution",
    malariaScreening: "Malaria Screening",
    highWarning: "High Warning",
    lowRisk: "Low Risk",
    moderateRisk: "Moderate",
    generalConsultation: "General consultation",
    defaultDoctor: "Doctor",
    generatedPatientId: "Generated Patient ID:",
    surveySymptoms: "Symptoms",
    surveyVitals: "Vitals",
    surveyConditions: "Medical Conditions",
    surveyMedications: "Current Medications",
    surveyNotes: "ASHA Notes",
    surveyLastVisit: "Last visit:",
    surveyLastSurvey: "Last survey:",
    surveyEmergency: "Emergency",
    surveyInProgress: "In Progress",
    surveyCompleted: "Completed",
  },

  मराठी: {
    appName: "सान्निध्य",
    tagline: "अंतर कितीही, सदैव सोबती.",
    hello: "नमस्कार,",
    patientName: "रमेश पाटील",
    patientId: "रुग्ण आयडी",
    howCanWeHelp: "आज आम्ही तुम्हाला कशी मदत करू शकतो?",

    // Home Tiles
    aiChecker: "AI लक्षण तपासणी",
    aiCheckerSub: "मार्गदर्शन आणि धोका तपासणी",
    consultDoctor: "डॉक्टरांचा सल्ला घ्या",
    consultDoctorSub: "डॉक्टरांशी बोला",
    healthRecords: "आरोग्य नोंदी",
    healthRecordsSub: "सल्ले आणि अहवाल",
    medicines: "औषधे",
    medicinesSub: "औषध उपलब्धता पहा",
    reminders: "रिमाइंडर्स",
    remindersSub: "औषधाचे अलार्म",
    emergency: "आपत्कालीन सेवा",
    emergencySub: "तातडीने मदत मिळवा",

    // Bottom Navigation
    navHome: "मुख्यपृष्ठ",
    navMyths: "भ्रम",
    navRecords: "नोंदी",
    navMedicines: "औषधे",
    navEmergency: "आपत्कालीन",
    navProfile: "प्रोफाइल",

    // Myth Busters
    mythBustersTitle: "भ्रम vs वास्तव",
    mythBustersSub: "सामान्य आरोग्य विश्वास — चला वास्तव आणि अफवा वेगळे करूया",
    commonBelief: "सामान्य विश्वास",
    sannidhyaExplains: "सान्निध्य स्पष्ट करतो",
    watchVideo: "व्हिडिओ पहा",
    searchVideos: "व्हिडिओ शोधा...",
    noResults: "कोणतेही परिणाम सापडले नाहीत",
    aajiTab: "आजीचं बटवा",
    mythsTab: "भ्रम vs वास्तव",
    outbreaksTab: "रोग प्रादुर्भाव",
    outbreaksSub: "तुमच्या भागातील रोग प्रादुर्भावाबद्दल माहिती राहा",
    outbreakHealthAlert: "आरोग्य सूचना – तुमचा भाग",
    outbreakIncreasing: "प्रकरणे वाढत आहेत",
    outbreakSymptoms: "लक्षणे",
    outbreakPrecautions: "शिफारस केलेल्या सावधानता",
    outbreakWhenUrgent: "तातडीने काळजी घ्यायचे केव्हा",
    outbreakPrecautionHygiene: "हातचांपी स्वच्छता राखा",
    outbreakPrecautionDistance: "लक्षणे असलेल्या व्यक्तींच्या जवळ जाऊ नका",
    outbreakPrecautionHydrate: "पाणी प्या आणि आराम करा",
    outbreakPrecautionMask: "गर्दी किंवा दुर्लक्षित वातावरणात मास्क लावा",
    outbreakPrecautionCare: "लक्षणे गंभीर असता किंवा वाढत असता तर वैद्यकीय मदत घ्या",
    outbreakUrgentBreathing: "श्वास घेण्यात अडचण",
    outbreakUrgentConfusion: "गोंधळ",
    outbreakUrgentWeakness: "गंभीर कमजोरी",
    outbreakUrgentFever: "सातत्याचा जास्त ताप",
    outbreakViewPrecautions: "सावधानता पहा",
    outbreakNearbyFacilities: "जवळच्या आरोग्य सेवा केंद्रे",
    outbreakCasesReported: "तुमच्या भागात प्रकरणे नोंदवली",
    outbreakTrendUp: "वाढत आहे",
    outbreakTrendStable: "स्थिर",
    outbreakSeverityHigh: "उच्च सूचना",
    outbreakSeverityModerate: "मध्यम सूचना",
    outbreakSeverityLow: "कमी सूचना",
    outbreakArea: "भाग",
    outbreakVillage: "गाव",
    outbreakDistrict: "जिल्हा",
    outbreakUpdated: "शेवटचा अपडेट",
    outbreakAlertSource: "स्थानिक आरोग्य अहवालांवर आधारित",
    outbreakAshaTitle: "भागातील रोग प्रवृत्ती",
    outbreakAshaVillages: "प्रकरणे वाढलेले गाव",
    outbreakAshaFollowUp: "पाठपुरावा आवश्यक असलेले रुग्ण",
    outbreakAshaAwareness: "घरी भेटीसाठी जागरूकता साहित्य",
    outbreakAshaPreventive: "सुचवलेल्या प्रतिबंधात्मक क्रिया",
    outbreakAshaVisitHome: "नोंदवलेल्या प्रकरणांसह घरी भेट द्या",
    outbreakAshaDistribute: "जागरूकता पाम्फ्लेट वितरित करा",
    outbreakAshaEducate: "कुटुंबांना प्रतिबंधात्मक उपायांबद्दल शिकवा",
    outbreakAshaReport: "असामान्य प्रवृत्ती CHO ला कळवा",
    outbreakChoTitle: "स्थानिक रोग प्रवृत्ती",
    outbreakChoCases: "प्रकरणांची प्रवृत्ती",
    outbreakChoSymptoms: "लक्षणांचे नमुने",
    outbreakChoFacility: "सुविधा भेटींची प्रवृत्ती",
    outbreakChoHighRisk: "उच्च धोका रुग्ण",
    outbreakChoTotalCases: "या आठवड्यातील एकूण प्रकरणे",
    outbreakChoNewToday: "आजची नवीन प्रकरणे",
    outbreakChoRecovered: "बरे झालेले",
    outbreakChoActive: "सक्रिय प्रकरणे",
    outbreakChoReferred: "शिफारस केलेले",
    outbreakDeptTitle: "भागातील रोग देखरेख",
    outbreakDeptMap: "भाग-प्रमाणे प्रवृत्ती नकाशा",
    outbreakDeptPatterns: "रोग प्रवृत्ती",
    outbreakDeptFacility: "सुविधा-प्रमाणे प्रकरणांची प्रवृत्ती",
    outbreakDeptResources: "संसाधने आणि औषध गरजा",
    outbreakDeptIntervention: "लवकर हस्तक्षेप नियोजन",
    outbreakDeptRising: "वाढत आहे",
    outbreakDeptDeclining: "घटत आहे",
    outbreakDeptStable: "स्थिर",
    outbreakDeptMedicineStock: "औषध स्टॉक स्थिती",
    outbreakDeptBedAvailability: "बेड उपलब्धता",
    outbreakDeptStaffOnDuty: "ड्युटीवरील स्टाफ",
    aajiSub: "आजीचं बटवातील आरोग्य टिपा आणि ज्ञान",
    mythsSub: "अंधश्रद्धा — वैद्यकीय वास्तव",
    aajiV1: "आजीचं बटवा - आरोग्य टिपा",
    aajiV2: "आजीचं बटवा - पोषण सल्ला",
    aajiV3: "आजीचं बटवा - घरगुती उपाय",
    aajiV4: "आजीचं बटवा - निरोगी टिपा",
    aajiV5: "आजीचं बटवा - पारंपरिक आरोग्य",
    aajiV6: "आजीचं बटवा - रोगप्रतिकारक शक्ती वाढवा",
    aajiV7: "आजीचं बटवा - हंगामी आरोग्य",
    aajiV8: "आजीचं बटवा - दैनिक आरोग्य दिनक्रम",
    aajiV9: "आजीचं बटवा - मधुमेह व्यवस्थापन",
    aajiV10: "आजीचं बटवा - रक्तदाब नियंत्रण",
    aajiV11: "आजीचं बटवा - सांधे दुखी उपाय",
    aajiV12: "आजीचं बटवा - पचन आरोग्य",
    aajiV13: "आजीचं बटवा - बाल आरोग्य काळजी",
    aajiV14: "आजीचं बटवा - गरोदर माता आरोग्य",
    aajiV15: "आजीचं बटवा - त्वचा काळजी उपाय",
    aajiV16: "आजीचं बटवा - तणाव आणि चिंता नियंत्रण",
    mythNaginFit: "नागिन फिट हे सर्प शापामुळे होते",
    realityNaginFit: "खेपणे ही मेंदूमधील असामान्य विद्युत क्रियांमुळे होणारी वैद्यकीय स्थिती आहे — परालौकिक नाही. याला योग्य वैद्यकीय मूल्यांकन गरजेचे आहे.",
    mythColdPneumonia: "थंड हवा थेट न्यूमोनिया करते",
    realityColdPneumonia: "न्यूमोनिया हे संसर्गामुळे (बॅक्टेरिया, व्हायरस) होते. थंड हवा थेट कारण नाही, जरी रोग प्रतिकारक शक्ती कमी करू शकते.",
    mythVaccines: "लसी रोग निरोधक करते तोच रोग होवो लागतो",
    realityVaccines: "लसी रोगप्रतिकारक शक्तीला शिकवते. ती खरा रोग जसा होतो तसा रोग निर्माण करत नाही.",
    mythBloodDonation: "रक्तदान केल्याने नेहमीसाठी कमजोरी होते",
    realityBloodDonation: "निरोगी दाते सामान्यतः दिलेले रक्त आठवड्यांत पुनर्भरण करतात. हे सुरक्षित आहे आणि शरीर नैसर्गिकपणे बरे होते.",
    mythDiabetesRice: "मधुमेह म्हणजे तुम्ही कधीही तांदूळ खाऊ शकत नाही",
    realityDiabetesRice: "आहार हा भाग, एकूण आहार आणि वैद्यकीय सल्ल्यावर अवलंबून असतो. तांदूळ योग्य मार्गदर्शनाखाली मर्यादित प्रमाणात खाऊ शकता.",
    mythEggsFever: "तापेला अंडी टाळणे आवश्यक आहे",
    realityEggsFever: "ताप हा आपोआप अंडी टाळण्याचा अर्थ नाही. पोषण हा व्यक्तीच्या स्थिती आणि सहनशीलतेवर अवलंबून असतो.",
    mythHomeRemedy: "प्रत्येक आजार घरगुती उपायांना बरा करता येतो",
    realityHomeRemedy: "काही घरगुती पद्धती आराम देऊ शकतात, पण गंभीर लक्षणांना योग्य वैद्यकीय मूल्यांकन आणि उपचार गरजेचे आहे.",
    mythBrandingSeizure: "दहन/ब्रँडिंग खेपणे बरे करू शकते",
    realityBrandingSeizure: "हे असुरक्षित आणि अप्रभावी आहे. खेपण्यांना योग्य प्राथमिक औषध, औषधोपचार आणि वैद्यकीय काळजी गरजेची आहे.",
    mythPossession: "एखाद्या व्यक्तीला आजार झाला कारण त्यामध्ये भूत प्रवेश केले आहे",
    realityPossession: "वर्तनातील बदल, गोंधळ, बेशुद्धपणा, खेपणे किंवा भ्रम यांना वैद्यकीय किंवा मानसिक आरोग्य कारणे असू शकतात ज्यांना मूल्यांकन गरजेचे आहे.",
    mythEvilEye: "एखाद्याच्या दृष्टीने (नजर) आजार झाला",
    realityEvilEye: "लक्षणांना त्यांचे वास्तविक वैद्यकीय कारण शोधावे लागते, नजर या आजाराचे कारण नाही असे मानण्यापेक्षा.",
    mythBlackMagic: "काळा जादूमुळे आजार झाला",
    realityBlackMagic: "सातत्याच्या लक्षणांना वैद्यकीय मूल्यांकन आणि योग्य उपचार गरजेचे आहे; काळा जादू हा वैद्यकीय निदान नाही.",
    mythGodAnger: "देवाचा संताप म्हणून आजार झाला",
    realityGodAnger: "आजाराला वैद्यकीय, संसर्गजन्य, आनुवंशिक, वातावरणीय किंवा जीवनशैली-संबंधित अनेक कारणे असू शकतात.",
    mythTempleCure: "आजारी व्यक्तीला मंदिर/देरूला नेल्याने आजार बरा होतो",
    realityTempleCure: "आध्यात्मिक साधना व्यक्तिगतरित्या म्हत्त्वाची असू शकते, पण ती आवश्यक वैद्यकीय देखभालीच्या जागी घेऊ नये.",
    mythEpilepsySpirit: "मिरगी म्हणजे एखाद्यामध्ये भूत प्रवेश केले आहे",
    realityEpilepsySpirit: "मिरगी ही एक न्यूरोलॉजिकल विकार आहे ज्यामुळे वारंवार खेपणे होऊ शकतात आणि तिला वैद्यकीय उपचारांना बरे करता येते.",
    mythMentalPossession: "मानसिक आजार म्हणजे व्यक्ती भूताने ग्रस्त आहे किंवा कमजोर आहे",
    realityMentalPossession: "मानसिक आरोग्य स्थिती ही वास्तविक आरोग्य स्थिती आहे ज्याला अनेक कारणे असू शकतात आणि व्यावसायिक उपचार गरजेचे असू शकतात.",
    mythFullMoon: "पौर्णिमेला मानसिक आजार किंवा खेपणे होतात",
    realityFullMoon: "या स्थितींचे कारण पौर्णिमा आहे असे माणण्यासाठी कोणताही विश्वसनीय आधार नाही.",
    mythSnakeMantra: "विषारी सर्पाने चावल्यास मंत्र किंवा विधीने बरे करता येते",
    realitySnakeMantra: "सर्पदंश ही वैद्यकीय आणीबाणी असू शकते आणि त्यासाठी तातडीने वैद्यकीय मूल्यांकन आणि योग्य उपचार गरजेचे आहेत.",
    mythDogRitual: "कुत्र्याने चावल्यास धार्मिक विधीने बरे करता येते, रुग्णालयात जाण्याची गरज नाही",
    realityDogRitual: "कुत्र्याने चावल्यास तातडीने जखमेची देखभाल आणि रेबीज प्रतिबंधासाठी वैद्यकीय मूल्यांकन गरजेचे आहे.",
    mythAmuletCure: "एखादा विशिष्ट धागा किंवा ताबीज घातल्यास आजार बरा होतो",
    realityAmuletCure: "ताबीज हा आजाराचे वास्तविक वैद्यकीय कारण बरे करत नाही. योग्य निदान आणि उपचार गरजेचे आहेत.",
    mythNewbornEvilEye: "नवजात बाळ बिघडले कारण कोणी नजर टाकली",
    realityNewbornEvilEye: "नवजात बाळाच्या लक्षणांना गंभीर वैद्यकीय कारणे असू शकतात आणि त्यांना लवकर वैद्यकीय मूल्यांकन गरजेचे आहे.",
    mythHerbalCureAll: "एखादा पवित्र किंवा जडीबुटी उपाय सर्व आजार बरा करू शकतो",
    realityHerbalCureAll: "काही पारंपरिक पद्धती आराम देऊ शकतात, पण प्रत्येक उपाय प्रभावी किंवा सुरक्षित नसतो, आणि काही आजारांना वैद्यकीय उपचार गरजेचे असतात.",
    mythPrayerCures: "केवळ प्रार्थनेने गंभीर आजार बरा होतो",
    realityPrayerCures: "प्रार्थना भावनिक/आध्यात्मिक आधार देऊ शकते, पण गंभीर आजाराला अजूनही योग्य आरोग्यसेवा गरजेची आहे.",
    mythFaintingSpirit: "एखादा अचानक बेशुद्द झाला म्हणजे भूताने प्रभावित केले",
    realityFaintingSpirit: "बेशुद्दपणा पाण्याची कमी, कमी रक्तदाब, कमी साखर, हृदयाच्या समस्या आणि इतर वैद्यकीय कारणांमुळे होऊ शकतो.",
    mythBadBlood: "एखादा व्यक्ती बिघडली कारण रक्त खराब आहे किंवा अशुद्ध आहे",
    realityBadBlood: "लक्षणांचे त्यांच्या वैद्यकीय कारणावर आधारित मूल्यांकन करावे लागते, अशुद्ध रक्त या संकल्पनेवर नाही.",
    mythCurseIllness: "एखाद्या विशिष्ट व्यक्तीच्या शापामुळे आजार झाला",
    realityCurseIllness: "आजार हा दुसऱ्या व्यक्तीच्या शापाने वैद्यकीयरित्या स्पष्ट होत नाही. योग्य निदान आणि वैद्यकीय मूल्यांकन महत्त्वाचे आहे.",
    mythRitualRecurring: "एखाद्या विधीने पुनरावृत्ती होणारा आजार दूर करता येतो",
    realityRitualRecurring: "पुनरावृत्ती होणारे किंवा वाढणारे लक्षणे वैद्यकीय मूल्यांकन आणि पालन-पूर्वीच्या करावी लागतात, केवळ विधीवर अवलंबून नाही.",

    // Symptoms (Q1)
    symptomsList: [
      { label: "डोकेदुखी आणि ताप", zone: "yellow" },
      { label: "खोकला आणि सर्दी", zone: "yellow" },
      { label: "पोटदुखी", zone: "yellow" },
      { label: "छातीत दुखणे आणि श्वास घेण्यास त्रास", zone: "red" },
    ],

    // Questionnaire
    q1Title: "तुम्हाला प्रामुख्याने काय त्रास होत आहे?",
    q2Title: "हा त्रास किती दिवसांपासून आहे?",
    q2Opts: ["आजपासून", "१-२ दिवस", "३-७ दिवस", "एका आठवड्यापेक्षा जास्त"],
    q3Title: "तुमची सध्याची स्थिती कशी आहे?",
    q3Opts: ["सौम्य - सहन होणारी", "मध्यम - अस्वस्थ करणारी", "तीव्र - त्रासदायक", "झपाट्याने बिघडणारी"],
    q4Title: "तुम्हाला यापैकी काही लक्षणे आहेत का?",
    q4Subtitle: "तुम्ही एकापेक्षा जास्त पर्याय निवडू शकता",
    q4Opts: ["श्वास घेण्यास त्रास", "उलट्या", "चक्कर येणे", "तीव्र ताप (>१०२°F)", "यांपैकी काहीही नाही"],
    q5Title: "यापैकी काही लागू होते का?",
    q5Opts: ["गरोदर माता", "ज्येष्ठ नागरिक (६०+ वर्षे)", "दीर्घकालीन आजार (डायबिटीज / बीपी / हृदयविकार)", "यांपैकी काहीही नाही"],
    continueBtn: "पुढे जा",
    questionProgress: "प्रश्न",
    ofText: "पैकी",
    analysingText: "तुमच्या उत्तरांचे विश्लेषण करत आहे…",

    // Zones
    zones: {
      yellow: {
        name: "पिवळा झोन — मध्यम",
        guidance: "तुमच्या लक्षणांकडे लक्ष देणे गरजेचे आहे. १-२ दिवसांत आरोग्य सेवा पुरवठादारांचा सल्ला घ्या आणि तुमची स्थिती जवळून निरीक्षण करा.",
      },
      orange: {
        name: "नारंगी झोन — गंभीर",
        guidance: "तुमची लक्षणे गंभीर आहेत. कृपया आजच लवकरात लवकर वैद्यकीय अधिकाऱ्यांचा (MO) सल्ला घ्या.",
      },
      red: {
        name: "आपत्कालीन",
        guidance: "ही वैद्यकीय आणीबाणी असू शकते. कृपया तातडीने आपत्कालीन वैद्यकीय मदत घ्या.",
      },
    },

    // Risk Assessment
    riskAssessment: "धोका मूल्यांकन",
    riskLevel: "धोका पातळी",
    riskScoreLabel: "धोका स्कोअर",
    contributingFactors: "तुमच्या धोक्याला कारणभूत घटक",
    patientFactors: "तुमचे वैयक्तिक घटक",
    symptomSeverity: "लक्षणांची तीव्रता",
    durationImpact: "कालावधीचा परिणाम",
    overallRisk: "एकूण धोका",
    low: "कमी",
    moderate: "मध्यम",
    high: "जास्त",
    critical: "अत्यंत गंभीर",
    whatThisMeans: "याचा तुमच्यावर काय अर्थ",
    whatToWatch: "काय लक्षात ठेवावे",
    immediateActions: "तुम्हाला आता काय करावे",
    selfCareTips: "स्वतः-काळजी उपाय",
    seekCareWhen: "कधी तातडीने मदत घ्यावी",
    riskFactorsLabels: {
      chestPain: "छातीत दुखणे",
      breathlessness: "श्वास घेण्यास त्रास",
      severeCondition: "गंभीर लक्षणे",
      highFever: "तीव्र ताप (>१०२°F)",
      chronicIllness: "दीर्घकालीन आजार",
      elderly: "वयामुळे धोका (६०+)",
      pregnant: "गरोदरपणा",
    },
    durationLabels: {
      today: "आजपासून — जवळून निरीक्षण करा",
      fewDays: "१-२ दिवस — लक्ष देणे गरजेचे",
      week: "३-७ दिवस — डॉक्टरांचा सल्ला घ्या",
      longTerm: "एका आठवड्यापेक्षा जास्त — तातडीने सल्ला गरजेचे",
    },
    riskAdviceYellow: "तुमच्या लक्षणांकडे १-२ दिवसांत लक्ष देणे गरजेचे आहे. जवळून निरीक्षण करा आणि सुधारणा न झाल्यास आरोग्य सेवा पुरवठादारांचा सल्ला घ्या.",
    riskAdviceOrange: "तुमची लक्षणे गंभीर आहेत. कृपया आजच वैद्यकीय अधिकाऱ्यांचा सल्ला घ्या. विलंब करू नका.",
    riskAdviceRed: "ही वैद्यकीय आणीबाणी असू शकते. तातडीने मदत घ्या. वाट पहू नका.",
    // Immediate Actions
    actionRestHydrate: "विश्रांती घ्या आणि भरपूर पाणी प्या",
    actionMonitorTemp: "तुमचा ताप नियमितपणे तपासा",
    actionRecordSymptoms: "तुमच्या लक्षणांची नोंद ठेवा",
    actionNoSelfMed: "स्वतः औषध घ्यू नका",
    actionVisitOfficer: "आज वैद्यकीय अधिकाऱ्यांचा भेट द्या",
    actionBringPrescriptions: "मागील प्रिस्क्रिप्शन आणा",
    actionCallEmergency: "तातडीने आपत्कालीन सेवा कॉल करा (108)",
    actionDontWait: "लक्षणे सुधरेपर्यंत वाट पहू नका",
    actionGoHospital: "आत्ताच जवळच्या रुग्णालयात जा",
    // ABHA Records
    abhaHealthSummary: "आरोग्य सारांश",
    abhaLinkedFacilities: "जोडलेली सुविधा",
    abhaRecentRecords: "अलीकडील आरोग्य नोंदी",
    abhaContinueHome: "जोडलेल्या नोंदींसह मुख्यपृष्ठावर जा",
    abhaVerified: "सत्यापित",
    abhaBloodGroup: "रक्त गट",
    abhaAllergies: "अॅलर्जी",
    abhaChronic: "दीर्घकालीन आजार",
    abhaMedications: "सध्याची औषधे",
    abhaLastVisit: "शेवटचा भेट",
    abhaRecords: "नोंदी",
    // Warning Signs
    warningSignsTitle: "या धोक्याच्या लक्षणांकडे लक्ष द्या",
    warningSigns: [
      "कमी न होणारा तीव्र ताप",
      "श्वास घेण्यास त्रास होणे",
      "अतिशय तीव्र किंवा वाढणारी वेदना",
      "भ्रम, चक्कर येणे किंवा प्रचंड अशक्तपणा",
    ],
    aiDisclaimer: "हे केवळ AI-सहाय्यित मार्गदर्शन आहे, हे वैद्यकीय निदान नाही आणि यामुळे अपॉइंटमेंट बुक होत नाही. डॉक्टरांशी बोलण्यासाठी मुख्यपृष्ठावरून 'डॉक्टरांचा सल्ला घ्या' निवडा.",

    // Doctor Roles & Consult
    choRole: "मुख्य आरोग्य अधिकारी (CHO)",
    moRole: "वैद्यकीय अधिकारी (MO)",
    choNote: "पिवळ्या / हिरव्या झोनसाठी मुख्य आरोग्य अधिकारी नियुक्त",
    moNote: "नारंगी झोनसाठी वैद्यकीय अधिकारी नियुक्त",
    recommendedDoctor: "सुचवलेले डॉक्टर",
    aiRecommendations: "AI शिफारसी",
    recsList: [
      "विश्रांती घ्या आणि भरपूर पाणी प्या",
      "तुमच्या लक्षणांवर लक्ष ठेवा",
      "त्रास वाढल्यास ताबडतोब डॉक्टरांशी संपर्क साधा"
    ],
    recommendConsultMsg: "AI विश्लेषणावर आधारित, आम्ही खालील डॉक्टरांचा सल्ला घेण्याची शिफारस करतो.",
    startConsultWith: "सल्ला सुरू करा -",
    aiUrgencyDisclaimer: "हे AI द्वारे केलेले प्राथमिक मूल्यांकन आहे, निदान नाही. अंतिम वैद्यकीय निर्णय डॉक्टर घेतात.",

    // Queue & Call
    inQueue: "प्रतिक्षा यादीत",
    patientsAhead: "रुग्ण तुमच्या पुढे आहेत",
    estWaitTime: "अंदाजे वेळ",
    mins: "मि",
    available: "उपलब्ध",
    assignedDoctor: "नियुक्त डॉक्टर — जोखीम पातळीनुसार",
    consultDetails: "सल्ल्याचा तपशील",
    symptomLabel: "लक्षणे",
    prelimAnalysis: "प्राथमिक विश्लेषण",
    gettingReady: "डॉक्टर जोडत आहे…",
    pleaseWaitQueue: "कृपया वाट पहा, आपोआप जोडले जाल.",
    connectingToDoctor: "डॉक्टरांशी जोडत आहे",
    pleaseWaitConnect: "कृपया वाट पहा, जोडणी होत आहे…",
    startConsultationBtn: "सल्ला सुरू करा",
    goodConnection: "उत्तम नेटवर्क",

    // Consultation Complete & Feedback
    consultComplete: "सल्ला पूर्ण झाला",
    consultCompleteMsg: "डॉक्टरांसोबतचा तुमचा सल्ला यशस्वीपणे पूर्ण झाला आहे.",
    diagnosis: "निदान",
    diagnosisMsg: "सामान्य आरोग्य तपासणी - सौम्य संसर्ग लक्षणे",
    prescribedMeds: "दिलेली औषधे",
    downloadPrescription: "प्रिस्क्रिप्शन",
    prescriptionDownloaded: "प्रिस्क्रिप्शन यशस्वीपणे डाउनलोड झाली",
    prescriptionShared: "प्रिस्क्रिप्शन यशस्वीपणे शेअर झाली",
    viewReferral: "संदर्भ (Referral) पहा",
    rateConsultation: "या सल्ल्याला रेटिंग द्या",
    doctorFeedback: "डॉक्टरांचा अभिप्राय",
    rateTheDoctor: "डॉक्टरांना रेटिंग द्या",
    overallRatingFor: "एकूण रेटिंग",
    commExplanation: "संवाद आणि मार्गदर्शन",
    satisfactionTreatment: "उपचाराबाबत समाधान",
    satOptions: ["खूप समाधानी", "समाधानी", "तटस्थ", "असमाधानी"],
    additionalFeedback: "अतिरिक्त अभिप्राय",
    recommendDoctorQuestion: "तुम्ही इतरांना या डॉक्टरांचा सल्ला सुचवाल का?",
    yes: "होय",
    no: "नाही",
    shareExperience: "तुमचा अनुभव सांगा",
    textareaPlaceholder: "डॉक्टरांचे वर्तन, उपचारांचा दर्जा किंवा काही सूचना…",
    ratingSummary: "तुमच्या रेटिंगचा सारांश",
    overall: "एकूण",
    comm: "संवाद",
    treatmentSat: "उपचार समाधान",
    recommendText: "सुचवाल का",
    submitFeedback: "अभिप्राय सबमिट करा",
    thankYou: "धन्यवाद",
    feedbackAppreciated: "तुमचा अभिप्राय आम्हाला अधिक उत्तम आरोग्य सेवा देण्यास मदत करतो.",
    backToHome: "मुख्यपृष्ठावर जा",
    checkAnother: "दुसरे तपासा",
    emergencyHelpBtn: "आपत्कालीन मदतीकडे जा",

    // Health Records
    myHealthRecords: "माझ्या आरोग्य नोंदी",
    consultations: "डॉक्टर सल्ले",
    prescriptions: "औषध पत्रके",
    referrals: "संदर्भ पत्र (Referrals)",
    diagnostics: "लॅब तपासणी अहवाल",
    referralStatus: "संदर्भ स्थिती",
    pending: "प्रलंबित",
    completed: "पूर्ण",
    referredBy: "संदर्भ देणारे डॉक्टर",
    referredTo: "संदर्भित रुग्णालय",
    specialist: "तज्ज्ञ",
    reason: "कारण",
    date: "दिनांक",
    timeline: "वेळापत्रक / टप्पे",
    referralCreated: "संदर्भ तयार केला",
    hospitalVisit: "रुग्णालय भेट",
    treatmentCompleted: "उपचार पूर्ण",
    doctorAdviceNote: "डॉक्टरांच्या सल्ल्यानुसार औषधे घ्या.",
    download: "डाउनलोड",
    share: "शेअर करा",
    nextStepsNote: "संबंधित रुग्णालयाकडून प्रतिसाद आल्यावर पुढील पायऱ्या येथे दिसतील.",

    // Medicines
    medicineAvailability: "औषध उपलब्धता",
    searchMedicine: "औषध शोधा",
    inStock: "उपलब्ध आहे",
    outOfStock: "शिल्लक नाही",
    stockUpdated: "साठा अपडेट: आज सकाळी १०:३०",

    // Reminders
    medicineReminders: "रिमाइंडर्स",
    addMedication: "औषधाची आठवण जोडा",
    medNameLabel: "औषधाचे नाव",
    descLabel: "तपशील / वेळ",
    timeLabel: "वेळ",
    addBtn: "जोडा",
    cancelBtn: "रद्द करा",
    noRemindersMsg: "अजून कोणतेही रिमाइंडर्स नाहीत. नवीन रिमाइंडर जोडण्यासाठी + वर टॅप करा.",
    phMedName: "उदा. पॅरासिटामॉल ५०० मिग्रॅ",
    phDesc: "उदा. जेवणानंतर, ३ दिवस",
    phTime: "रात्री ९:००",

    // Emergency
    emergencyTitle: "आपत्कालीन सेवा",
    emergencyWarning: "जीवघेणी आणीबाणी असल्यास, त्वरित ॲम्बुलन्सला फोन करा.",
    callAmbulance: "ॲम्बुलन्स कॉल करा — १०८",
    ashaWorker: "आशा सेविका - IVR कॉल",
    callHealthCentre: "आरोग्य केंद्राला कॉल करा",
    emergencyDisclaimer: "आपत्कालीन संपर्कासाठी नेटवर्क आवश्यक आहे. नेटवर्क नसल्यास जवळच्या आरोग्य केंद्रात त्वरित जा.",

    // Profile
    myProfile: "माझी प्रोफाइल",
    personalInfo: "वैयक्तिक माहिती",
    healthInfo: "आरोग्य माहिती",
    settings: "सेटिंग्ज",
    helpSupport: "मदत आणि सपोर्ट",
    logOut: "लॉग आउट",

    // Profile - Personal Data Labels
    profileName: "नाव",
    profileDob: "जन्मतारीख",
    profileAge: "वय",
    profileGender: "लिंग",
    profileMobile: "मोबाइल",
    profileEmail: "ईमेल",
    profileAbhaId: "ABHA आयडी",
    profileBloodGroup: "रक्त गट",
    profileAddress: "पत्ता",
    profileEmergencyContact: "आपत्कालीन संपर्क",
    profileAadhaar: "आधार",
    profileOccupation: "व्यवसाय",
    profileMaritalStatus: "वैवाहिक स्थिती",
    profileMale: "पुरुष",
    profileFemale: "स्त्री",
    profileOther: "इतर",

    // Profile - Health Data Labels
    profileHeight: "उंची",
    profileWeight: "वजन",
    profileBmi: "BMI",
    profileAllergies: "अॅलर्जी",
    profileChronicConditions: "दीर्घकालीन आजार",
    profileCurrentMedications: "सध्याची औषधे",
    profileLastVisit: "शेवटचा भेट",
    profileVaccinations: "लसीकरण",
    profileSmokingStatus: "धूम्रपान स्थिती",
    profileAlcoholStatus: "मद्यपान स्थिती",
    profileExerciseFrequency: "व्यायाम वारंवारता",
    profileInsurance: "विमा",
    profileNoneReported: "नोंदवलेले नाही",
    profileNonSmoker: "धूम्रपान न करणारे",
    profileOccasional: "कधी कधी",
    profileActive: "सक्रिय",
    profileNotAvailable: "उपलब्ध नाही",

    // Profile - Settings Labels
    profileLanguage: "भाषा",
    profileNotifications: "सूचना",
    profileEnabled: "सक्षम",
    profileDarkMode: "डार्क मोड",
    profileOff: "बंद",
    profileTextSize: "मजकूर आकार",
    profileMedium: "मध्यम",
    profileTwoFactor: "दोन-घटक प्रमाणीकरण",
    profileDataSharing: "डेटा शेअरिंग",
    profileLimited: "मर्यादित",
    profileAutoLock: "स्वयं-लॉक",
    profileAfter5Min: "५ मिनिटांनंतर",

    // Profile - Help Labels
    profileFaq: "वारंवार विचारले जाणारे प्रश्न",
    profileFaqDesc: "वारंवार विचारले जाणारे प्रश्न",
    profileContactSupport: "संपर्क सहाय्य",
    profileContactSupportDesc: "कॉल करा: 1800-XXX-XXXX (टोल फ्री)",
    profileReportProblem: "समस्या नोंदवा",
    profileReportProblemDesc: "अभिप्राय पाठवा किंवा बग नोंदवा",
    profilePrivacyPolicy: "गोपनीयता धोरण",
    profilePrivacyPolicyDesc: "आम्ही तुमचा डेटा कसा संरक्षित करतो",
    profileTermsOfService: "सेवा अटी",
    profileTermsOfServiceDesc: "अॅप वापर अटी आणि तरतूद",
    profileAppVersion: "अॅप आवृत्ती",
    profileAppVersionDesc: "v1.0.0 (Build 2026.09)",

    // Profile - Logout
    profileLogoutConfirm: "लॉग आउट करायचे?",
    profileLogoutMsg: "तुम्ही भूमिका निवड स्क्रीनवर परत जाल.",
    profileCancel: "रद्द करा",

    // Role Select
    selectRole: "आपली भूमिका निवडा",
    rolePatient: "रुग्ण",
    rolePatientSub: "सल्ले बुक करा आणि आरोग्य व्यवस्थापित करा",
    roleAsha: "आशा सेविका / पर्यवेक्षक",
    roleAshaSub: "सामुदायिक आरोग्य सहाय्य आणि फील्ड काळजी",
    roleDoctor: "डॉक्टर",
    roleDoctorSub: "आरोग्यसेवा पुरवठादार आणि सल्ले",
    rolePharmacy: "फार्मसी",
    rolePharmacySub: "औषधे, उपलब्धता आणि विनंत्या",
    roleDiagnostic: "निदान केंद्र",
    roleDiagnosticSub: "चाचण्या, अहवाल आणि निदान सेवा",

    // ABHA Login
    abhaLoginTitle: "ABHA आरोग्य आयडी लॉगिन",
    abhaLoginSub: "आयुष्मान भारत आरोग्य खाते — तुमचा राष्ट्रीय डिजिटल आरोग्य आयडी",
    abhaNumberLabel: "ABHA नंबर (१४-अंकी)",
    abhaNumberPlaceholder: "उदा., 1234-5678-9012",
    abhaAadhaarLabel: "आधार नंबर (१२-अंकी)",
    abhaAadhaarPlaceholder: "उदा., 1234 5678 9012",
    abhaOtpLabel: "आधारशी जोडलेल्या मोबाइलवर OTP प्रविष्ट करा",
    abhaDemoOtp: "डेमो OTP: 123456",
    abhaLoginBtn: "सत्यापित करा आणि ABHA ने लॉगिन करा",
    abhaCreateBtn: "नवीन ABHA आयडी तयार करा",
    abhaCreateTitle: "तुमची ABHA आयडी तयार करा",
    abhaCreateSub: "ABHA तयार करण्यासाठी आधार किंवा वाहनचालक परवाना आवश्यक आहे",
    abhaCreateOption1: "आधार नंबर वापरून",
    abhaCreateOption2: "वाहनचालक परवाना वापरून",
    abhaCreateBtnText: "ABHA आयडी तयार करा",
    abhaVerifyMobile: "मोबाइल नंबर सत्यापित करा",
    abhaMobileLabel: "मोबाइल नंबर",
    abhaMobilePlaceholder: "+91-XXXXXXXXXX",
    abhaLinkedRecords: "तुमच्या जोडलेल्या आरोग्य नोंदी",
    abhaRecordTypes: "भारतभर तुमच्या ABHA आयडीशी जोडलेल्या सर्व नोंदी",
    abhaRecordConsent: "लॉगिन करून, तुम्ही या अॅपमध्ये सल्ला आणि काळजीसाठी तुमच्या आरोग्य नोंदी शेअर करण्यास संमती देता.",
    abhaWhatIs: "ABHA म्हणजे काय?",
    abhaWhatIsDesc: "ABHA (आयुष्मान भारत आरोग्य खाते) हा १४-अंकी अद्वितीय आरोग्य आयडी आहे जो भारतभर तुमच्या सर्व आरोग्य नोंदी डिजिटली जोडतो.",
    abhaBenefits: "ABHA चे फायदे",
    abhaBenefit1: "सर्व रुग्णालयांमध्ये एकत्रित आरोग्य नोंदी",
    abhaBenefit2: "प्रिस्क्रिप्शन आणि लॅब अहवालांमध्ये त्वरित प्रवेश",
    abhaBenefit3: "भारतातील कोणत्याही डॉक्टरांशी नोंदी शेअर करा",
    abhaBenefit4: "कालावधीनुसार आरोग्य इतिहास ट्रॅक करा",
    abhaBenefit5: "मोफत आणि सुरक्षित — भारत सरकारची उपक्रम",

    // Doctor Role Select
    doctorRoleTitle: "तुमची विशिष्ट भूमिका निवडा",
    doctorRoleCHO: "मुख्य आरोग्य अधिकारी",
    doctorRoleCHOSub: "प्राथमिक आरोग्य व्यवस्थापन",
    doctorRoleMO: "वैद्यकीय अधिकारी",
    doctorRoleMOSub: "प्रगत वैद्यकीय सल्ले",
    doctorRoleCivil: "सिव्हिल रुग्णालय डॉक्टर",
    doctorRoleCivilSub: "रुग्णालय-आधारित सल्ले",
    doctorRoleEmergency: "आपत्कालीन डॉक्टर",
    doctorRoleEmergencySub: "आपत्कालीन वैद्यकीय देखभाल",

    // Doctor Login
    doctorLoginTitle: "लॉगिन",
    doctorLoginSub: "पूर्व-भरलेल्या क्रेडेन्शियलसह जलद लॉगिन",
    choIdLabel: "CHO आयडी",
    choOtpLabel: "OTP टाका",
    doctorDemoOtp: "डेमो OTP: 123456",
    doctorLoginBtn: "लॉगिन",
    doctorCredHint: "नमुना क्रेडेन्शियल आधीच भरलेले आहेत. फक्त लॉगिन वर क्लिक करा!",
    doctorAvailIds: "उपलब्ध डेमो आयडी:",
    doctorDemoIds: "CHO001",
    moIdLabel: "MO आयडी",
    moDemoIds: "MO002",
    moDashRole: "वैद्यकीय अधिकारी",
    moDashToday: "आजच्या सल्ला",
    moDashQueue: "तुमची वेळी",
    moDashWaiting: "एकूण वाट",
    moDashPatientQueue: "रुग्ण वेळी",
    moDashPatientQueueSub: "रुग्ण वेळी व्यवस्थापित करा आणि सल्ला सुरू करा",
    moDashPatientsWaiting: "रुग्ण वाटत आहेत",
    moDashQuickConsult: "जलद सल्ला",
    moDashQuickConsultSub: "पुढील सल्ला लगेच सुरू करा",
    moDashReady: "सुरू करण्यास तयार",
    moDashRecent: "अलीकडील सल्ला",
    moDashNoRecent: "आज सल्ला नाही",
    moQueueTitle: "रुग्ण वेळी",
    moQueueEstWait: "अंदाजे वाट:",
    moQueueSince: "वेळीत",
    moQueueStartConsult: "सल्ला सुरू करा",
    moQueueTagEmergency: "अत्यावश्यक टॅग करा",
    moRedirectTitle: "तज्ञाकडे रुग्ण पुनर्निर्देशित करा",
    moRedirectChoose: "योग्य देखभाल पातळी निवडा:",
    moRedirectCivil: "सिव्हिल रुग्णालयात पुनर्निर्देशित करा",
    moRedirectCivilDesc: "अत्याधुनिक सुविधांची गरज असलेल्या गंभीर प्रकरणांसाठी",
    moRedirectCancel: "रद्द करा",

    // CHO Dashboard
    choDashGreeting: "सप्रभात",
    choDashRole: "मुख्य आरोग्य अधिकारी",
    choStatusAvailable: "उपलब्ध",
    choStatusBusy: "व्यस्त",
    choStatusOffline: "ऑफलाइन",
    choStatusDesc: "तुम्ही सल्ल्यांसाठी उपलब्ध आहात",
    choTodayConsult: "आजचे सल्ले",
    choYourQueue: "तुमची यादी",
    choTotalWaiting: "एकूण प्रतीक्षा",
    choPatientQueue: "रुग्ण यादी",
    choPatientQueueDesc: "रुग्ण यादी व्यवस्थापित करा आणि सल्ले सुरू करा",
    choPatientsWaiting: "रुग्ण प्रतीक्षेत",
    choQuickConsult: "जलद सल्ला",
    choQuickConsultDesc: "तातडीने पुढील सल्ला सुरू करा",
    choReadyToStart: "सुरू करण्यासाठी तयार",
    choRedirectionDemo: "रीडायरेक्शन डेमो",
    choRedirectionDemoDesc: "नमुना रुग्ण रीडायरेक्शन सूचना पहा",
    choRedirectionSample: "नमुना CHO → MO/सिव्हिल रुग्णालय सूचना",
    choRecentConsult: "अलीकडील सल्ले",
    choProfile: "प्रोफाइल",

    // Patient Queue Screen
    pQueueTitle: "रुग्ण यादी",
    pQueueOrangeCases: "नारंगी प्रकरणे",
    pQueueAvgWait: "सरासरी प्रतीक्षा वेळ",
    pQueueDoctorStatus: "डॉक्टर स्थिती",
    pQueueAvailable: "सल्ल्यांसाठी उपलब्ध",
    pQueueOnline: "ऑनलाइन",
    pQueueReadyText: "नवीन रुग्ण स्वीकारण्यासाठी तयार",
    pQueueAvgConsTime: "सरासरी सल्ला वेळ: १५ मिनिटे",
    pQueuePatientQueue: "रुग्ण यादी",
    pQueueStartConsult: "सल्ला सुरू करा",
    pQueueTagEmergency: "आपत्कालीन टॅग करा",
    pQueueEstWait: "अंदाजे प्रतीक्षा:",
    pQueueInQueueSince: "यादीत कधीपासून:",
    pQueueQueueScope: "तुमची यादी व्याप्ती",
    pQueueAsCHO: "मुख्य आरोग्य अधिकारी म्हणून, तुम्ही हाताळता:",
    pQueueYellowCases: "प्राथमिक देखभाल प्रकरणे",

    // Consultation Screen
    consultTitle: "सल्ला",
    consultDuration: "कालावधी:",
    consultSaveDraft: "मसुदा जतन करा",
    consultPatientInfo: "रुग्ण माहिती",
    consultHistory: "इतिहास",
    consultVitals: "वाइटल्स",
    consultExamination: "तपासणी",
    consultPrescription: "प्रिस्क्रिप्शन",
    consultPatientOverview: "रुग्ण विहंगावलोकन",
    consultFirstReg: "पहिली नोंदणी:",
    consultTotalConsults: "एकूण सल्ले:",
    consultLastVisit: "शेवटचा भेट:",
    consultFirstVisit: "पहिला भेट",
    consultEmergencyVisits: "आपत्कालीन भेट:",
    consultToday: "आजचा सल्ला",
    consultDate: "दिनांक:",
    consultTime: "वेळ:",
    consultPriority: "प्राधान्य:",
    consultSymptoms: "सध्याची लक्षणे:",
    consultPrevious: "मागील सल्ले",
    consultStartVideo: "व्हिडिओ कॉल सुरू करा",
    consultVoiceCall: "व्हॉइस कॉल",
    consultTextChat: "टेक्स्ट चॅट",

    // Vitals
    vitalsTitle: "वाइटल साइन्स",
    vitalsBP: "रक्तदाब (mmHg)",
    vitalsHR: "हृदय दर (bpm)",
    vitalsTemp: "तापमान (°F)",
    vitalsWeight: "वजन (kg)",
    vitalsHeight: "उंची (cm)",
    vitalsO2: "ऑक्सिजन संतृप्तता (%)",

    // Examination
    examTitle: "नैदानिक तपासणी",
    examDiagnosis: "निदान",
    examDiagnosisPlaceholder: "प्राथमिक निदान प्रविष्ट करा",
    examNotes: "नैदानिक टिपा",
    examNotesPlaceholder: "तपासणी शोध, उपचार योजना, पालन-पूर्वीच्या सूचना प्रविष्ट करा...",

    // Prescription
    rxTitle: "प्रिस्क्रिप्शन",
    rxAddMedicine: "औषध जोडा",
    rxNoMeds: "अजून कोणतेही औषध लिहिलेले नाही",
    rxAddFirst: "पहिले औषध जोडा",
    rxMedName: "औषधाचे नाव",
    rxDosage: "डोस",
    rxFrequency: "वारंवारता",
    rxDuration: "कालावधी",
    rxInstructions: "सूचना",
    rxSelectMed: "औषध नाव निवडा किंवा टाइप करा",
    rxSelectFromList: "उपलब्ध औषधांमधून निवडा",
    rxDelete: "हटवा",

    // Video Consult
    videoTitle: "व्हिडिओ सल्ला",
    videoGoodConn: "चांगले कनेक्शन",
    videoPatientFeed: "रुग्ण व्हिडिओ फीड",
    videoYourFeed: "तुमचा व्हिडिओ",
    videoQuickNotes: "जलद टिपा",
    videoNotesPlaceholder: "कॉल दरम्यान जलद टिपा टाइप करा...",
    videoMute: "म्यूट",
    videoCamera: "कॅमेरा",
    videoChat: "चॅट",
    videoEndCall: "कॉल संपवा",
    videoRecord: "रेकॉर्ड",

    // Redirect Modal
    redirectTitle: "रुग्णाला तज्ज्ञाकडे पुनर्निर्देशित करा",
    redirectChoose: "यासाठी योग्य देखभाल पातळी निवडा:",
    redirectMO: "वैद्यकीय अधिकाऱ्याकडे पुनर्निर्देशित करा",
    redirectMODesc: "विशिष्ट देखभाल आवश्यक असलेल्या मध्यम प्रकरणांसाठी",
    redirectMOTime: "१५-२० मिनिटे",
    redirectCivil: "सिव्हिल रुग्णालयात पुनर्निर्देशित करा",
    redirectCivilDesc: "रुग्णालय सुविधा आवश्यक असलेल्या गंभीर प्रकरणांसाठी",
    redirectCivilTime: "३०-४५ मिनिटे",
    redirectCancel: "रद्द करा",

    // Patient Login
    patientAuthTitle: "रुग्ण लॉगिन",
    patientAuthSub: "रुग्ण आयडी किंवा ABHA आरोग्य आयडीने लॉगिन करा",
    patientIdAuthLabel: "रुग्ण आयडी / मोबाइल नंबर",
    patientIdAuthPlaceholder: "उदा., P001 किंवा 9876543210",
    patientRoleHint: "💡 AI लक्षण तपासणी, टेलिकन्सल्टेशन, प्रिस्क्रिप्शन आणि ABHA आरोग्य नोंदींमध्ये प्रवेश",
    patientCredHint: "संपूर्ण आरोग्य नोंदींसाठी ABHA लॉगिन वापरून पहा!",
    patientAvailIds: "डेमो ABHA आयडी: 12345678901234",
    patientDemoIds: "किंवा रुग्ण आयडी: P001 (रमेश पाटील)",

    // ASHA Login
    ashaLoginTitle: "लॉगिन",
    ashaLoginSub: "आशा सेविका / पर्यवेक्षक",
    ashaIdLabel: "आशा सेविका आयडी / पर्यवेक्षक आयडी",
    ashaIdPlaceholder: "उदा., MH-PUN-W-04-012 (सेविका) किंवा MH-PUN-S-04-012 (पर्यवेक्षक)",
    otpLabel: "OTP टाका",
    demoOtp: "डेमो OTP: 123456",
    ashaLoginBtn: "लॉगिन",
    ashaRoleHint: "तुमच्या भूमिकेनुसार योग्य डॅशबोर्ड आपोआप दिसेल.",
    ashaCredHint: "नमुना क्रेडेन्शियल आधीच भरलेले आहेत. फक्त लॉगिन वर क्लिक करा!",
    ashaAvailIds: "उपलब्ध डेमो आयडी:",
    ashaWorkerIds: "सेविका: MH-PUN-W-04-012, A002, A003 | पर्यवेक्षक: MH-PUN-S-04-012",

    // Pharmacy Login
    pharmacyLoginTitle: "लॉगिन",
    pharmacyLoginSub: "पूर्व-भरलेल्या क्रेडेन्शियलसह जलद लॉगिन",
    pharmacyLicenseLabel: "फार्मसी परवाना आयडी",
    pharmacyOtpLabel: "OTP टाका",
    pharmacyDemoOtp: "डेमो OTP: 123456",
    pharmacyLoginBtn: "लॉगिन",
    pharmacyVerifiedNote: "सत्यापित फार्मसी औषध उपलब्धता आणि विनंत्या व्यवस्थापित करू शकतात.",
    pharmacyCredHint: "नमुना क्रेडेन्शियल आधीच भरलेले आहेत. फक्त लॉगिन वर क्लिक करा!",
    pharmacyAvailIds: "उपलब्ध डेमो क्रेडेन्शियल:",
    pharmacyDemoLicense: "MH-TZ4-567890",

    // Pharmacy Dashboard
    pharmacyDashTitle: "फार्मसी डॅशबोर्ड",
    pharmacyDashName: "नांदगाव PHC फार्मसी",
    pharmacyDashLicense: "परवाना: MH-TZ4-567890",
    pharmacyTotalMedicines: "एकूण औषधे",
    pharmacyInStock: "स्टॉकमध्ये",
    pharmacyLowStock: "कमी स्टॉक",
    pharmacyOutOfStock: "स्टॉक नाही",
    pharmacyInventory: "औषध सूची",
    pharmacySearchMedicine: "औषधे शोधा...",
    pharmacyStockAll: "सर्व",
    pharmacyStockIn: "स्टॉक",
    pharmacyStockLow: "कमी",
    pharmacyStockOut: "नाही",
    pharmacyRequests: "प्रिस्क्रिप्शन विनंत्या",
    pharmacyRequestFrom: "कडून",
    pharmacyRequestPatient: "रुग्ण",
    pharmacyRequestMeds: "औषधे",
    pharmacyRequestStatus: "स्थिती",
    pharmacyReqPending: "प्रलंबित",
    pharmacyReqDispensed: "वितरित",
    pharmacyReqReady: "तयार",
    pharmacyDispense: "वितरित करा",
    pharmacyMarkReady: "तयार करा",
    pharmacyStockUpdate: "स्टू अपडेट",
    pharmacyStockAdded: "स्टू अपडेट झाला",
    pharmacyAlerts: "स्टू इशारे",
    pharmacyAlertLow: "कमी स्टू — लवकर ऑर्डर करा",
    pharmacyAlertOut: "स्टू नाही — तातडीने पुन्हा ऑर्डर करा",
    pharmacySupply: "पुरवठा ट्रॅकर",
    pharmacyLastOrder: "शेवटची ऑर्डर",
    pharmacyNextOrder: "पुढील ऑर्डर",
    pharmacyOrderNow: "आता ऑर्डर करा",
    pharmacyLogout: "लॉगआउट",
    pharmacyProfile: "प्रोफाइल",
    pharmacyMedName: "औषध",
    pharmacyMedCategory: "वर्ग",
    pharmacyMedQty: "प्रमाण",
    pharmacyMedExpiry: "कालबाह्य",
    pharmacyMedAction: "क्रिया",
    pharmacyCategoryAntibiotic: "अँटिबायोटिक",
    pharmacyCategoryAnalgesic: "अॅनल्जेसिक",
    pharmacyCategoryAntipyretic: "अँटिपायरेटिक",
    pharmacyCategoryAntidiabetic: "अँटिडायबेटिक",
    pharmacyCategoryCardiac: "कार्डिएक",
    pharmacyCategoryRespiratory: "श्वसन",
    pharmacyCategoryGastro: "गॅस्ट्रो",
    pharmacyCategoryVitamin: "व्हिटॅमिन",
    pharmacyReferralPending: "संदर्भ प्रलंबित",
    pharmacyReferralReady: "घेण्यासाठी तयार",
    pharmacyReferralDispensed: "वितरित",

    // Diagnostic Center Login
    diagnosticLoginTitle: "लॉगिन",
    diagnosticLoginSub: "पूर्व-भरलेल्या क्रेडेन्शियलसह जलद लॉगिन",
    diagnosticCeaLabel: "CEA नोंदणी आयडी",
    diagnosticOtpLabel: "OTP टाका",
    diagnosticDemoOtp: "डेमो OTP: 123456",
    diagnosticLoginBtn: "लॉगिन",
    diagnosticVerifiedNote: "सत्यापित निदान केंद्र चाचण्या, अहवाल आणि निदान सेवा व्यवस्थापित करू शकतात.",
    diagnosticCredHint: "नमुना क्रेडेन्शियल आधीच भरलेले आहेत. फक्त लॉगिन वर क्लिक करा!",
    diagnosticAvailIds: "उपलब्ध डेमो क्रेडेन्शियल:",
    diagnosticDemoCea: "CEA-MH-2026-9874",
    diagnosticNablNote: "टीप: - प्रत्येक निदान केंद्र NABL-मान्यताप्राप्त नसेल म्हणून CEA ID वापरले जाते",

    // Diagnostic Dashboard
    diagDashTitle: "निदान केंद्र",
    diagDashName: "नांदगाव निदान लॅब",
    diagDashCea: "CEA: CEA-MH-2026-9874",
    diagTotalTests: "एकूण चाचण्या",
    diagCompleted: "पूर्ण",
    diagPending: "प्रलंबित",
    diagReportsReady: "अहवाल तयार",
    diagTestRequests: "चाचणी विनंत्या",
    diagSearchTests: "चाचण्या शोधा...",
    diagReqFrom: "कडून",
    diagReqPatient: "रुग्ण",
    diagReqTest: "चाचणी",
    diagReqStatus: "स्थिती",
    diagReqPending: "प्रलंबित",
    diagReqInProgress: "चालू आहे",
    diagReqReady: "अहवाल तयार",
    diagStartTest: "चाचणी सुरू करा",
    diagMarkReady: "तयार करा",
    diagAvailableTests: "उपलब्ध चाचण्या",
    diagTestCategory: "वर्ग",
    diagTestPrice: "किंमत",
    diagTestTAT: "वेळ",
    diagTestAction: "क्रिया",
    diagCatBlood: "रक्त चाचणी",
    diagCatImaging: "इमेजिंग",
    diagCatCardiac: "कार्डिएक",
    diagCatPathology: "पॅथॉलॉजी",
    diagCatUrine: "मूत्र",
    diagReports: "अलीकडील अहवाल",
    diagReportPatient: "रुग्ण",
    diagReportTest: "चाचणी",
    diagReportDate: "दिनांक",
    diagReportStatus: "स्थिती",
    diagReportView: "पहा",
    diagReportDownload: "डाउनलोड",
    diagLogout: "लॉगआउट",
    diagProfile: "प्रोफाइल",
    diagStatusPending: "प्रलंबित",
    diagStatusInProgress: "चालू आहे",
    diagStatusReady: "तयार",
    diagStatusCollected: "घेतले",

    // ASHA Dashboard
    ashaDashTitle: "ASHA डॅशबोर्ड",
    ashaWorkerName: "प्रिया पटेल",
    totalPatients: "एकूण रुग्ण",
    activeCases: "सक्रिय प्रकरणे",
    completedToday: "आज पूर्ण",
    emergencyCases: "आपत्कालीन प्रकरणे",
    quickActions: "जलद क्रिया",
    viewPatientSurvey: "रुग्ण सर्वेक्षण पहा",
    healthDrives: "आरोग्य मोहिमा",
    registerNewPatient: "नवीन रुग्ण नोंदणी",
    helpPatientLogin: "रुग्णाला लॉगिन मदत",
    patientServices: "रुग्ण सेवा",
    aiSymptomChecker: "AI लक्षण तपासणी",
    consultDoctor2: "डॉक्टर सल्ला",
    pastConsultations: "मागील सल्ले",
    diseaseAnalytics: "रोग विश्लेषण",
    myArea: "माझे क्षेत्र",
    coverageArea: "कव्हरेज क्षेत्र",
    ashaWorkerId: "आशा सेविका आयडी",
    phoneNumber: "फोन नंबर",
    recentActivity: "अलीकडील क्रियाकलाप",
    logout: "लॉगआउट",

    // ASHA New Screens
    healthSurveys: "आरोग्य सर्वेक्षण",
    surveyLanguage: "सर्वेक्षण भाषा",
    searchPatients: "रुग्ण शोधा...",
    registerNewPatientTitle: "नवीन रुग्णाची नोंदणी",
    personalInfoSec: "वैयक्तिक माहिती",
    fullName: "पूर्ण नाव *",
    enterFullName: "रुग्णाचे पूर्ण नाव टाका",
    age: "वय *",
    gender: "लिंग *",
    selectGender: "निवडा",
    contactInfo: "संपर्क माहिती",
    phoneNumberLabel: "फोन नंबर *",
    addressLabel: "पत्ता",
    addressPlaceholder: "गाव, जिल्हा",
    emergencyContactLabel: "आपत्कालीन संपर्क",
    healthInfoLabel: "आरोग्य माहिती",
    familySizeLabel: "कुटुंबाचा आकार",
    familySizePlaceholder: "उदा. 4",
    registerPatientBtn: "रुग्ण नोंदणी करा",
    patientLoginTitle: "रुग्ण लॉगिन",
    findPatient: "रुग्ण शोधा",
    findPatientSub: "शोधण्यासाठी आणि लॉगिन करण्यासाठी रुग्ण आयडी टाका",
    patientIdLabel: "रुग्ण आयडी",
    patientIdPlaceholder: "रुग्ण आयडी टाका (उदा. P001)",
    searchPatientBtn: "रुग्ण शोधा",
    quickAccess: "क्विक ॲक्सेस",
    back: "मागे",
    patientRegisteredMsg: "रुग्णाची यशस्वी नोंदणी झाली!",
    callIvrInstructions: "१ दाबा — आशा कार्यकर्ता · २ दाबा — १०८",
    surveySelected: "निवडलेले:",
    surveyChecklistReady: "सर्वेक्षण यादी घरभेटीसाठी तयार आहे.",
    activityRegistered: "रुग्णाची नोंदणी झाली",
    activityConsultDone: "सल्ला पूर्ण झाला",
    activityEmergencyRef: "आपत्कालीन प्रकरण रेफर केले",
    hoursAgo: "तासांपूर्वी",
    patientIdTab: "रुग्ण आयडी",
    abhaHealthIdTab: "आभा आरोग्य आयडी",
    loginBtn: "लॉगिन",
    orDivider: "— किंवा —",
    verifyOtpBtn: "OTP पडताळा आणि रेकॉर्ड ऍक्सेस करा",
    backToLogin: "← मागे",
    sampleCredHint: "नमुना क्रेडेन्शियल पूर्व-भरलेले आहेत. फक्त लॉगिन दाबा!",
    ashaAssessment: "आशा मूल्यांकन",
    ashaAssistMode: "आशा कार्यकर्ता मदत मोड",
    assistingPatient: "रुग्णाला मदत करत आहे:",
    changeBtn: "बदला",
    aiSymptomCheckFor: "AI लक्षण तपासणी:",
    teleconsultFor: "दूरसंचालना:",
    ashaHotline: "आशा सहाय्य हेल्पलाइन · रुग्णाला डॉक्टरांशी जोडत आहे",
    connectToDoctor: "डॉक्टरांशी जोडा",
    medicalHistoryFor: "वैद्यकीय इतिहास:",
    outbreakAlerts: "प्रादुर्भाव सूचना",
    vaccinationRate: "लसीकरण दर",
    communityTrends: "समुदाय रोग ट्रेंड",
    patientsReportedWeek: "रुग्ण या आठवड्यात नोंदवले",
    activeOutbreaks: "सक्रिय प्रादुर्भाव",
    seasonalViralFever: "हंगामी व्हायरल ताप",
    denguePrecaution: "डेंग्यू प्रतिबंध",
    malariaScreening: "मलेरिया तपासणी",
    highWarning: "उच्च चेतावणी",
    lowRisk: "कमी धोका",
    moderateRisk: "मध्यम",
    generalConsultation: "सामान्य सल्ला",
    defaultDoctor: "डॉक्टर",
    generatedPatientId: "रुग्ण आयडी तयार:",
    surveySymptoms: "लक्षणे",
    surveyVitals: "महत्त्वाचे चिन्हे",
    surveyConditions: "वैद्यकीय स्थिती",
    surveyMedications: "सध्याच्या औषधोपचार",
    surveyNotes: "आशा टिप्पण्या",
    surveyLastVisit: "शेवटची भेट:",
    surveyLastSurvey: "शेवटचे सर्वेक्षण:",
    surveyEmergency: "आपत्कालीन",
    surveyInProgress: "चालू आहे",
    surveyCompleted: "पूर्ण",
  },

  हिंदी: {
    appName: "सान्निध्य",
    tagline: "दूरी कितनी भी हो, सदैव साथ।",
    hello: "नमस्ते,",
    patientName: "रमेश पटेल",
    patientId: "मरीज़ आईडी",
    howCanWeHelp: "आज हम आपकी क्या मदद कर सकते हैं?",

    // Home Tiles
    aiChecker: "AI लक्षण जांच",
    aiCheckerSub: "मार्गदर्शन और जोखिम जांच",
    consultDoctor: "डॉक्टर से सलाह लें",
    consultDoctorSub: "डॉक्टर से बात करें",
    healthRecords: "स्वास्थ्य रिकॉर्ड",
    healthRecordsSub: "परामर्श और रिपोर्ट",
    medicines: "दवाइयां",
    medicinesSub: "उपलब्धता जांचें",
    reminders: "रिमाइंडर",
    remindersSub: "दवा के अलार्म",
    emergency: "आपातकालीन सेवा",
    emergencySub: "तुरंत मदद पाएं",

    // Bottom Navigation
    navHome: "होम",
    navMyths: "भ्रम",
    navRecords: "रिकॉर्ड",
    navMedicines: "दवा",
    navEmergency: "आपातकालीन",
    navProfile: "प्रोफ़ाइल",

    // Myth Busters
    mythBustersTitle: "भ्रम बनाम वास्तविकता",
    mythBustersSub: "सामान्य स्वास्थ्य विश्वास — आइए तथ्य और कल्पना को अलग करें",
    commonBelief: "सामान्य विश्वास",
    sannidhyaExplains: "सान्निध्य समझाता है",
    watchVideo: "वीडियो देखें",
    searchYoutube: "YouTube पर खोजें",
    searchVideos: "वीडियो खोजें...",
    noResults: "कोई परिणाम नहीं मिला",
    aajiTab: "आजी का बटवा",
    mythsTab: "भ्रम बनाम वास्तविकता",
    outbreaksTab: "रोग प्रकोप",
    outbreaksSub: "अपने क्षेत्र में रोग प्रकोप के बारे में जानकारी रखें",
    outbreakHealthAlert: "स्वास्थ्य अलर्ट – आपका क्षेत्र",
    outbreakIncreasing: "मामले बढ़ रहे हैं",
    outbreakSymptoms: "लक्षण",
    outbreakPrecautions: "अनुशंसित सावधानियाँ",
    outbreakWhenUrgent: "अत्यावश्यक देखभाल कब लें",
    outbreakPrecautionHygiene: "हाथ की स्वच्छता बनाए रखें",
    outbreakPrecautionDistance: "लक्षण वाले लोगों से दूरी बनाए रखें",
    outbreakPrecautionHydrate: "हाइड्रेटेड रहें और आराम करें",
    outbreakPrecautionMask: "भीड़ या खराब हवादार जगहों पर मास्क पहनें",
    outbreakPrecautionCare: "यदि लक्षण गंभीर हैं या बिगड़ रहे हैं तो चिकित्सा सहायता लें",
    outbreakUrgentBreathing: "सांस लेने में कठिनाई",
    outbreakUrgentConfusion: "भ्रम",
    outbreakUrgentWeakness: "गंभीर कमजोरी",
    outbreakUrgentFever: "लगातार तेज बुखार",
    outbreakViewPrecautions: "सावधानियाँ देखें",
    outbreakNearbyFacilities: "निकटतम स्वास्थ्य सुविधाएँ",
    outbreakCasesReported: "आपके क्षेत्र में मामले दर्ज",
    outbreakTrendUp: "बढ़ रहा है",
    outbreakTrendStable: "स्थिर",
    outbreakSeverityHigh: "उच्च अलर्ट",
    outbreakSeverityModerate: "मध्यम अलर्ट",
    outbreakSeverityLow: "कम अलर्ट",
    outbreakArea: "क्षेत्र",
    outbreakVillage: "गाँव",
    outbreakDistrict: "जिला",
    outbreakUpdated: "अंतिम अपडेट",
    outbreakAlertSource: "स्थानीय स्वास्थ्य रिपोर्ट के आधार पर",
    outbreakAshaTitle: "क्षेत्रीय रोग प्रवृत्ति",
    outbreakAshaVillages: "बढ़ते मामलों वाले गाँव",
    outbreakAshaFollowUp: "अनुसरण की आवश्यकता वाले रोगी",
    outbreakAshaAwareness: "घरेलू दौरे के लिए जागरूकता सामग्री",
    outbreakAshaPreventive: "सुझाए गए निवारक उपाय",
    outbreakAshaVisitHome: "दर्ज मामलों वाले घरों का दौरा करें",
    outbreakAshaDistribute: "जागरूकता पर्चे वितरित करें",
    outbreakAshaEducate: "परिवारों को निवारक उपायों के बारे में शिक्षित करें",
    outbreakAshaReport: "असामान्य प्रवृत्तियों की CHO को रिपोर्ट करें",
    outbreakChoTitle: "स्थानीय रोग प्रवृत्ति",
    outbreakChoCases: "मामलों की प्रवृत्ति",
    outbreakChoSymptoms: "लक्षण पैटर्न",
    outbreakChoFacility: "सुविधा दौरों की प्रवृत्ति",
    outbreakChoHighRisk: "उच्च जोखिम वाले रोगी",
    outbreakChoTotalCases: "इस सप्ताह कुल मामले",
    outbreakChoNewToday: "आज नए मामले",
    outbreakChoRecovered: "ठीक हो गए",
    outbreakChoActive: "सक्रिय मामले",
    outbreakChoReferred: "रेफर किए गए",
    outbreakDeptTitle: "क्षेत्रीय रोग निगरानी",
    outbreakDeptMap: "क्षेत्र-वार प्रवृत्ति मानचित्र",
    outbreakDeptPatterns: "रोग पैटर्न",
    outbreakDeptFacility: "सुविधा-वार मामलों की प्रवृत्ति",
    outbreakDeptResources: "संसाधन और दवा आवश्यकताएँ",
    outbreakDeptIntervention: "शीघ्र हस्तक्षेप योजना",
    outbreakDeptRising: "बढ़ रहा है",
    outbreakDeptDeclining: "घट रहा है",
    outbreakDeptStable: "स्थिर",
    outbreakDeptMedicineStock: "दवा स्टॉक स्थिति",
    outbreakDeptBedAvailability: "बिस्तर उपलब्धता",
    outbreakDeptStaffOnDuty: "ड्यूटी पर कर्मचारी",
    aajiSub: "आजी के बटवा से स्वास्थ्य सुझाव और ज्ञान",
    mythsSub: "अंधविश्वास — चिकित्सीय वास्तविकता",
    aajiV1: "आजी का बटवा - स्वास्थ्य सुझाव",
    aajiV2: "आजी का बटवा - पोषण सलाह",
    aajiV3: "आजी का बटवा - घरेलू उपाय",
    aajiV4: "आजी का बटवा - कल्याण सुझाव",
    aajiV5: "आजी का बटवा - पारंपरिक स्वास्थ्य",
    aajiV6: "आजी का बटवा - प्रतिरक्षा बढ़ाएं",
    aajiV7: "आजी का बटवा - मौसमी स्वास्थ्य",
    aajiV8: "आजी का बटवा - दैनिक स्वास्थ्य दिनचर्या",
    aajiV9: "आजी का बटवा - मधुमेह प्रबंधन सुझाव",
    aajiV10: "आजी का बटवा - रक्तचाप नियंत्रण",
    aajiV11: "आजी का बटवा - जोड़ों के दर्द का उपाय",
    aajiV12: "आजी का बटवा - पाचन स्वास्थ्य",
    aajiV13: "आजी का बटवा - बच्चों की देखभाल",
    aajiV14: "आजी का बटवा - गर्भवती महिला स्वास्थ्य",
    aajiV15: "आजी का बटवा - त्वचा की देखभाल उपाय",
    aajiV16: "आजी का बटवा - तनाव और चिंता नियंत्रण",
    mythNaginFit: "नागिन फिट सांप के श्राप से होता है",
    realityNaginFit: "दौरा पड़ना मस्तिष्क में असामान्य विद्युत गतिविधि के कारण होने वाली एक चिकित्सा स्थिति है — अलौकिक नहीं। इसके लिए उचित चिकित्सा मूल्यांकन आवश्यक है।",
    mythColdPneumonia: "ठंडी हवा सीधे न्यूमोनिया करती है",
    realityColdPneumonia: "न्यूमोनिया संक्रमण (बैक्टीरिया, वायरस) से होता है। ठंडी हवा सीधे कारण नहीं है, हालांकि यह प्रतिरक्षा कम कर सकती है।",
    mythVaccines: "टीके वह बीमारी करते हैं जिससे बचाते हैं",
    realityVaccines: "टीके प्रतिरक्षा प्रणाली को संक्रमण से लड़ना सिखाते हैं। वे वास्तविक बीमारी जैसी बीमारी पैदा नहीं करते।",
    mythBloodDonation: "रक्तदान से हमेशा के लिए कमज़ोरी होती है",
    realityBloodDonation: "स्वस्थ दाता आम तौर पर दान किया गया रक्त हफ्तों में पुनर्भरण कर लेते हैं। यह सुरक्षित है और शरीर प्राकृतिक रूप से ठीक होता है।",
    mythDiabetesRice: "मधुमेह मतलब कभी चावल नहीं खा सकते",
    realityDiabetesRice: "आहार हिस्से के आकार, समग्र आहार और चिकित्सा सलाह पर निर्भर करता है। चावल उचित मार्गदर्शन में सीमित मात्रा में खाए जा सकते हैं।",
    mythEggsFever: "बुखार में अंडे से बचना चाहिए",
    realityEggsFever: "बुखार का मतलब अपने आप अंडे से बचना नहीं है। पोषण व्यक्ति की स्थिति और सहनशीलता पर निर्भर करता है।",
    mythHomeRemedy: "हर बीमारी घरेलू उपायों से ठीक हो सकती है",
    realityHomeRemedy: "कुछ घरेलू उपाय आराम दे सकते हैं, लेकिन गंभीर लक्षणों के लिए उचित चिकित्सा मूल्यांकन और उपचार आवश्यक है।",
    mythBrandingSeizure: "जलाना/ब्रांडिंग से दौरे ठीक हो सकते हैं",
    realityBrandingSeizure: "यह असुरक्षित और अप्रभावी है। दौरों के लिए उचित प्राथमिक चिकित्सा, दवा और चिकित्सा देखभाल आवश्यक है।",
    mythPossession: "किसी व्यक्ति को बीमारी इसलिए हुई क्योंकि उसमें भूत प्रवेश कर गया",
    realityPossession: "व्यवहार में बदलाव, भ्रम, बेहोशी, दौरे या भ्रम के चिकित्सा या मानसिक स्वास्थ्य कारण हो सकते हैं जिनका मूल्यांकन आवश्यक है।",
    mythEvilEye: "किसी की नजर से बीमारी हुई",
    realityEvilEye: "लक्षणों का उनके वास्तविक चिकित्सा कारण के आधार पर मूल्यांकन किया जाना चाहिए, न कि नजर को बीमारी का कारण मानना चाहिए।",
    mythBlackMagic: "काला जादू से बीमारी हुई",
    realityBlackMagic: "लगातार लक्षणों के लिए चिकित्सा मूल्यांकन और उचित उपचार आवश्यक है; काला जादू चिकित्सीय निदान नहीं है।",
    mythGodAnger: "भगवान के क्रोध से बीमारी हुई",
    realityGodAnger: "बीमारी के चिकित्सीय, संक्रामक, आनुवंशिक, पर्यावरणीय या जीवनशैली से संबंधित कई कारण हो सकते हैं।",
    mythTempleCure: "बीमार व्यक्ति को मंदिर/दरगाह ले जाने से बीमारी ठीक होती है",
    realityTempleCure: "आध्यात्मिक अभ्यास व्यक्तिगत रूप से महत्वपूर्ण हो सकते हैं, लेकिन उन्हें आवश्यक चिकित्सा देखभाल की जगह नहीं लेनी चाहिए।",
    mythEpilepsySpirit: "मिरगी का मतलब है कि व्यक्ति में भूत प्रवेश कर गया",
    realityEpilepsySpirit: "मिरगी एक न्यूरोलॉजिकल विकार है जिससे बार-बार दौरे पड़ सकते हैं और इसका चिकित्सीय उपचार संभव है।",
    mythMentalPossession: "मानसिक बीमारी का मतलब है कि व्यक्ति भूत से ग्रस्त है या कमज़ोर है",
    realityMentalPossession: "मानसिक स्वास्थ्य स्थितियाँ वास्तविक स्वास्थ्य स्थितियाँ हैं जिनके कई संभावित कारण हो सकते हैं और पेशेवर उपचार की आवश्यकता हो सकती है।",
    mythFullMoon: "पूर्णिमा से लोग मानसिक रूप से बीमार होते हैं या दौरे पड़ते हैं",
    realityFullMoon: "इन स्थितियों का कारण पूर्णिमा है ऐसा मानने का कोई विश्वसनीय आधार नहीं है।",
    mythSnakeMantra: "सांप के काटने पर मंत्र या अनुष्ठान से ठीक हो सकता है",
    realitySnakeMantra: "सांप का काटना एक चिकित्सीय आपातकाल हो सकता है और इसके लिए तत्काल चिकित्सा मूल्यांकन और उचित उपचार आवश्यक है।",
    mythDogRitual: "कुत्ते के काटने पर धार्मिक अनुष्ठान से ठीक हो सकता है, अस्पताल जाने की ज़रूरत नहीं",
    realityDogRitual: "काटने पर तुरंत घाव की देखभाल और रेबीज की रोकथाम के लिए चिकित्सा मूल्यांकन आवश्यक है।",
    mythAmuletCure: "कोई विशेष धागा या ताबीज पहनने से बीमारी ठीक होती है",
    realityAmuletCure: "ताबीज बीमारी के वास्तविक चिकित्सीय कारण का इलाज नहीं करता। उचित निदान और उपचार आवश्यक है।",
    mythNewbornEvilEye: "नवजात शिशु बिगड़ गया क्योंकि किसी ने नजर डाल दी",
    realityNewbornEvilEye: "नवजात शिशु के लक्षणों के गंभीर चिकित्सीय कारण हो सकते हैं और उनका शीघ्र चिकित्सा मूल्यांकन आवश्यक है।",
    mythHerbalCureAll: "कोई पवित्र या जड़ी-बूटी का उपाय हर बीमारी ठीक कर सकता है",
    realityHerbalCureAll: "कुछ पारंपरिक उपाय राहत दे सकते हैं, लेकिन हर उपाय प्रभावी या सुरक्षित नहीं होता, और कुछ बीमारियों के लिए चिकित्सा उपचार आवश्यक है।",
    mythPrayerCures: "केवल प्रार्थना से गंभीर बीमारी ठीक हो सकती है",
    realityPrayerCures: "प्रार्थना भावनात्मक/आध्यात्मिक सहारा दे सकती है, लेकिन गंभीर बीमारी के लिए अभी भी उचित स्वास्थ्य सेवा आवश्यक है।",
    mythFaintingSpirit: "अचानक बेहोश होने का मतलब है कि भूत ने प्रभावित किया",
    realityFaintingSpirit: "बेहोशी पानी की कमी, कम रक्तचाप, कम शर्करा, हृदय की समस्याओं और अन्य चिकित्सा कारणों से हो सकती है।",
    mythBadBlood: "व्यक्ति बीमार पड़ गया क्योंकि खून खराब या अशुद्ध है",
    realityBadBlood: "लक्षणों का उनके चिकित्सीय कारण के आधार पर मूल्यांकन किया जाना चाहिए, अशुद्ध खून की अवधारणा पर नहीं।",
    mythCurseIllness: "किसी विशेष व्यक्ति के श्राप से बीमारी हुई",
    realityCurseIllness: "बीमारी किसी अन्य व्यक्ति के श्राप से चिकित्सीय रूप से समझाई नहीं जा सकती। उचित निदान और चिकित्सा मूल्यांकन महत्वपूर्ण है।",
    mythRitualRecurring: "कोई अनुष्ठान अकेला बार-बार होने वाली बीमारी को दूर कर सकता है",
    realityRitualRecurring: "बार-बार या बिगड़ते लक्षणों के लिए चिकित्सा मूल्यांकन और अनुवर्ती कार्रवाई आवश्यक है, केवल अनुष्ठान पर निर्भर नहीं रहना चाहिए।",

    // Symptoms (Q1)
    symptomsList: [
      { label: "सिरदर्द और बुखार", zone: "yellow" },
      { label: "खांसी और जुकाम", zone: "yellow" },
      { label: "पेट दर्द", zone: "yellow" },
      { label: "छाती में दर्द और सांस लेने में तकलीफ", zone: "red" },
    ],

    // Questionnaire
    q1Title: "आपकी मुख्य समस्या क्या है?",
    q2Title: "आपको यह समस्या कितने समय से है?",
    q2Opts: ["आज से", "1–2 दिन", "3–7 दिन", "एक सप्ताह से अधिक"],
    q3Title: "आप अपनी वर्तमान स्थिति का वर्णन कैसे करेंगे?",
    q3Opts: ["हल्का - सहने योग्य", "मध्यम - असहज", "गंभीर - कष्टदायक", "तेज़ी से बिगड़ता हुआ"],
    q4Title: "क्या आपको इनमें से कोई लक्षण हैं?",
    q4Subtitle: "आप एक से अधिक विकल्प चुन सकते हैं",
    q4Opts: ["सांस फूलना", "उल्टी", "चक्कर आना", "तेज़ बुखार (>102°F)", "इनमें से कोई नहीं"],
    q5Title: "क्या इनमें से कोई स्थिति आप पर लागू होती है?",
    q5Opts: ["गर्भवती महिला", "बुज़ुर्ग (60+ वर्ष)", "पुराणी बीमारी (डायबिटीज / बीपी / हृदय रोग)", "इनमें से कोई नहीं"],
    continueBtn: "आगे बढ़ें",
    questionProgress: "प्रश्न",
    ofText: "का",
    analysingText: "आपके उत्तरों का विश्लेषण किया जा रहा है…",

    // Zones
    zones: {
      yellow: {
        name: "पीला ज़ोन — मध्यम",
        guidance: "आपके लक्षणों पर ध्यान देने की आवश्यकता है। 1-2 दिनों के भीतर स्वास्थ्य सेवा प्रदाता से परामर्श लें और अपनी स्थिति पर बारीकी से नज़र रखें।",
      },
      orange: {
        name: "नारंगी ज़ोन — गंभीर",
        guidance: "आपके लक्षण गंभीर हैं। कृपया आज ही जल्द से जल्द चिकित्सा अधिकारी (MO) से परामर्श लें।",
      },
      red: {
        name: "आपातकालीन",
        guidance: "यह एक मेडिकल इमरजेंसी हो सकती है। कृपया तुरंत आपातकालीन चिकित्सा सहायता प्राप्त करें।",
      },
    },

    // Risk Assessment
    riskAssessment: "जोखिम मूल्यांकन",
    riskLevel: "जोखिम स्तर",
    riskScoreLabel: "जोखिम स्कोर",
    contributingFactors: "आपके जोखिम के कारक",
    patientFactors: "आपके व्यक्तिगत कारक",
    symptomSeverity: "लक्षणों की गंभीरता",
    durationImpact: "समय का प्रभाव",
    overallRisk: "कुल जोखिम",
    low: "कम",
    moderate: "मध्यम",
    high: "अधिक",
    critical: "अत्यंत गंभीर",
    whatThisMeans: "इसका आपके लिए क्या मतलब है",
    whatToWatch: "किन चीजों पर ध्यान दें",
    immediateActions: "अभी आपको क्या करना चाहिए",
    selfCareTips: "स्व-देखभाल के उपाय",
    seekCareWhen: "कब तुरंत मदद लें",
    riskFactorsLabels: {
      chestPain: "छाती में दर्द",
      breathlessness: "सांस लेने में तकलीफ",
      severeCondition: "गंभीर लक्षण",
      highFever: "तेज़ बुखार (>102°F)",
      chronicIllness: "पुराणी बीमारी",
      elderly: "उम्र संबंधी जोखिम (60+)",
      pregnant: "गर्भावस्था",
    },
    durationLabels: {
      today: "आज से शुरू — बारीकी से निगरानी करें",
      fewDays: "1–2 दिन से — ध्यान देने की ज़रूरत",
      week: "3–7 दिन से — डॉक्टर से सलाह लें",
      longTerm: "एक सप्ताह से अधिक — तत्काल परामर्श आवश्यक",
    },
    riskAdviceYellow: "आपके लक्षणों पर 1-2 दिनों के भीतर ध्यान देने की आवश्यकता है। बारीकी से निगरानी करें और सुधार न होने पर स्वास्थ्य सेवा प्रदाता से मिलें।",
    riskAdviceOrange: "आपके लक्षण गंभीर हैं। कृपया आज ही जल्द से जल्द चिकित्सा अधिकारी से परामर्श लें। देरी न करें।",
    riskAdviceRed: "यह एक मेडिकल इमरजेंसी हो सकती है। तुरंत आपातकालीन सहायता प्राप्त करें। इंतज़ार न करें।",
    // Immediate Actions
    actionRestHydrate: "आराम करें और भरपूर पानी पीएं",
    actionMonitorTemp: "अपना तापमान नियमित रूप से जांचें",
    actionRecordSymptoms: "अपने लक्षणों का रिकॉर्ड रखें",
    actionNoSelfMed: "स्वयं दवा न लें",
    actionVisitOfficer: "आज ही चिकित्सा अधिकारी से मिलें",
    actionBringPrescriptions: "पिछली प्रिस्क्रिप्शन साथ लाएं",
    actionCallEmergency: "तुरंत आपातकालीन सेवा कॉल करें (108)",
    actionDontWait: "लक्षणों के सुधरने का इंतज़ार न करें",
    actionGoHospital: "अभी निकटतम अस्पताल जाएं",
    // ABHA Records
    abhaHealthSummary: "स्वास्थ्य सारांश",
    abhaLinkedFacilities: "जुड़ी हुई सुविधाएं",
    abhaRecentRecords: "हालिया स्वास्थ्य रिकॉर्ड",
    abhaContinueHome: "जुड़े रिकॉर्ड के साथ होम पर जाएं",
    abhaVerified: "सत्यापित",
    abhaBloodGroup: "रक्त समूह",
    abhaAllergies: "एलर्जी",
    abhaChronic: "पुराणी बीमारी",
    abhaMedications: "वर्तमान दवाइयां",
    abhaLastVisit: "अंतिम मुलाकात",
    abhaRecords: "रिकॉर्ड",
    // Warning Signs
    warningSignsTitle: "इन चेतावनी संकेतों पर ध्यान दें",
    warningSigns: [
      "तेज़ बुखार जो उतर न रहा हो",
      "सांस लेने में कठिनाई",
      "अत्यधिक या बढ़ता हुआ दर्द",
      "घबराहट, बेहोशी या बहुत ज्यादा कमजोरी",
    ],
    aiDisclaimer: "यह केवल AI-सहायक मार्गदर्शन है, कोई चिकित्सीय निदान नहीं है और यह अपॉइंटमेंट बुक नहीं करता है। डॉक्टर से बात करने के लिए मुख्य स्क्रीन से 'डॉक्टर से सलाह लें' खोलें।",

    // Doctor Roles & Consult
    choRole: "मुख्य स्वास्थ्य अधिकारी (CHO)",
    moRole: "चिकित्सा अधिकारी (MO)",
    choNote: "पीले / हरे ज़ोन के मामलों के लिए मुख्य स्वास्थ्य अधिकारी नियुक्त",
    moNote: "नारंगी ज़ोन के मामलों के लिए चिकित्सा अधिकारी नियुक्त",
    recommendedDoctor: "अनुशंसित डॉक्टर",
    aiRecommendations: "AI सिफारिशें",
    recsList: [
      "आराम करें और भरपूर पानी पीएं",
      "अपने लक्षणों पर नज़र रखें",
      "स्थिति बिगड़ने पर तुरंत डॉक्टर से संपर्क करें"
    ],
    recommendConsultMsg: "AI विश्लेषण के आधार पर, हम निम्नलिखित डॉक्टर से परामर्श की सलाह देते हैं।",
    startConsultWith: "परामर्श शुरू करें -",
    aiUrgencyDisclaimer: "यह एक AI-सहायक प्राथमिक मूल्यांकन है, निदान नहीं। अंतिम चिकित्सीय निर्णय डॉक्टर लेते हैं।",

    // Queue & Call
    inQueue: "कतार में",
    patientsAhead: "मरीज़ आपके आगे हैं",
    estWaitTime: "अनुमानित समय",
    mins: "मिनट",
    available: "उपलब्ध",
    assignedDoctor: "नियुक्त डॉक्टर — जोखिम स्तर के अनुसार",
    consultDetails: "परामर्श विवरण",
    symptomLabel: "लक्षण",
    prelimAnalysis: "प्राथमिक विश्लेषण",
    gettingReady: "डॉक्टर से जोड़ रहे हैं…",
    pleaseWaitQueue: "कृपया प्रतीक्षा करें, स्वचालित रूप से जुड़ जाएंगे।",
    connectingToDoctor: "डॉक्टर से जुड़ रहे हैं",
    pleaseWaitConnect: "कृपया प्रतीक्षा करें, कॉल जोड़ी जा रही है…",
    startConsultationBtn: "परामर्श शुरू करें",
    goodConnection: "उत्तम नेटवर्क",

    // Consultation Complete & Feedback
    consultComplete: "परामर्श पूर्ण हुआ",
    consultCompleteMsg: "डॉक्टर के साथ आपका परामर्श सफलतापूर्वक पूरा हो गया है।",
    diagnosis: "निदान",
    diagnosisMsg: "सामान्य स्वास्थ्य जांच - हल्के वायरल लक्षण",
    prescribedMeds: "दी गई दवाइयां",
    downloadPrescription: "प्रिस्क्रिप्शन",
    prescriptionDownloaded: "प्रिस्क्रिप्शन सफलतापूर्वक डाउनलोड हो गई",
    prescriptionShared: "प्रिस्क्रिप्शन सफलतापूर्वक शेअर हो गई",
    viewReferral: "रेफ़रल देखें",
    rateConsultation: "इस परामर्श को रेटिंग दें",
    doctorFeedback: "डॉक्टर फीडबैक",
    rateTheDoctor: "डॉक्टर को रेटिंग दें",
    overallRatingFor: "कुल रेटिंग",
    commExplanation: "संवाद और मार्गदर्शन",
    satisfactionTreatment: "इलाज से संतुष्टि",
    satOptions: ["अत्यंत संतुष्ट", "संतुष्ट", "तटस्थ", "असंतुष्ट"],
    additionalFeedback: "अतिरिक्त सुझाव",
    recommendDoctorQuestion: "क्या आप दूसरों को इस डॉक्टर की सलाह देंगे?",
    yes: "हां",
    no: "नहीं",
    shareExperience: "अपना अनुभव साझा करें",
    textareaPlaceholder: "डॉक्टर का व्यवहार, इलाज की गुणवत्ता या कोई सुझाव…",
    ratingSummary: "आपकी रेटिंग का सारांश",
    overall: "कुल",
    comm: "संवाद",
    treatmentSat: "इलाज की संतुष्टि",
    recommendText: "सलाह देंगे",
    submitFeedback: "फीडबैक जमा करें",
    thankYou: "धन्यवाद",
    feedbackAppreciated: "आपकी प्रतिक्रिया हमें बेहतर स्वास्थ्य सेवाएं प्रदान करने में मदद करती है।",
    backToHome: "मुख्य स्क्रीन पर जाएं",
    checkAnother: "दूसरा जांचें",
    emergencyHelpBtn: "आपातकालीन सहायता पर जाएं",

    // Health Records
    myHealthRecords: "मेरे स्वास्थ्य रिकॉर्ड",
    consultations: "डॉक्टर परामर्श",
    prescriptions: "दवा पर्ची",
    referrals: "रेफ़रल पत्र",
    diagnostics: "लैब रिपोर्ट",
    referralStatus: "रेफ़रल स्थिति",
    pending: "लंबित",
    completed: "पूर्ण",
    referredBy: "रेफ़र करने वाले डॉक्टर",
    referredTo: "रेफ़र किया गया अस्पताल",
    specialist: "विशेषज्ञ",
    reason: "कारण",
    date: "दिनांक",
    timeline: "समयरेखा / चरण",
    referralCreated: "रेफ़रल बनाया गया",
    hospitalVisit: "अस्पताल दौरा",
    treatmentCompleted: "इलाज पूरा हुआ",
    doctorAdviceNote: "डॉक्टर की सलाह के अनुसार दवाइयां लें।",
    download: "डाउनलोड",
    share: "शेयर करें",
    nextStepsNote: "अस्पताल से प्रतिक्रिया मिलने पर अगले चरण यहां दिखाई देंगे।",

    // Medicines
    medicineAvailability: "दवा उपलब्धता",
    searchMedicine: "दवा खोजें",
    inStock: "स्टॉक में उपलब्ध",
    outOfStock: "स्टॉक में नहीं है",
    stockUpdated: "स्टॉक अपडेट: आज सुबह 10:30",

    // Reminders
    medicineReminders: "रिमाइंडर",
    addMedication: "दवा का रिमाइंडर जोड़ें",
    medNameLabel: "दवा का नाम",
    descLabel: "विवरण / समय",
    timeLabel: "समय",
    addBtn: "जोड़ें",
    cancelBtn: "रद्द करें",
    noRemindersMsg: "अभी कोई रिमाइंडर नहीं है। नया रिमाइंडर जोड़ने के लिए + पर टैप करें।",
    phMedName: "जैसे पैरासिटामॉल 500mg",
    phDesc: "जैसे खाने के बाद, 3 दिन",
    phTime: "रात 9:00 बजे",

    // Emergency
    emergencyTitle: "आपातकालीन सेवा",
    emergencyWarning: "यदि यह जीवन के लिए ख़तरा है, तो तुरंत एम्बुलेंस को कॉल करें।",
    callAmbulance: "एम्बुलेंस कॉल करें — 108",
    ashaWorker: "आशा कार्यकर्ता - IVR कॉल",
    callHealthCentre: "स्वास्थ्य केंद्र को कॉल करें",
    emergencyDisclaimer: "आपातकालीन संचार के लिए नेटवर्क होना आवश्यक है। यदि नेटवर्क न हो, तो तुरंत निकटतम अस्पताल जाएं।",

    // Profile
    myProfile: "मेरी प्रोफ़ाइल",
    personalInfo: "व्यक्तिगत जानकारी",
    healthInfo: "स्वास्थ्य जानकारी",
    settings: "सेटिंग्स",
    helpSupport: "सहायता और सपोर्ट",
    logOut: "लॉग आउट",

    // Profile - Personal Data Labels
    profileName: "नाम",
    profileDob: "जन्म तिथि",
    profileAge: "आयु",
    profileGender: "लिंग",
    profileMobile: "मोबाइल",
    profileEmail: "ईमेल",
    profileAbhaId: "ABHA आईडी",
    profileBloodGroup: "रक्त समूह",
    profileAddress: "पता",
    profileEmergencyContact: "आपातकालीन संपर्क",
    profileAadhaar: "आधार",
    profileOccupation: "व्यवसाय",
    profileMaritalStatus: "वैवाहिक स्थिति",
    profileMale: "पुरुष",
    profileFemale: "महिला",
    profileOther: "अन्य",

    // Profile - Health Data Labels
    profileHeight: "ऊंचाई",
    profileWeight: "वज़न",
    profileBmi: "BMI",
    profileAllergies: "एलर्जी",
    profileChronicConditions: "दीर्घकालिक बीमारियाँ",
    profileCurrentMedications: "वर्तमान दवाइयाँ",
    profileLastVisit: "अंतिम मुलाकात",
    profileVaccinations: "टीकाकरण",
    profileSmokingStatus: "धूम्रपान स्थिति",
    profileAlcoholStatus: "शराब की स्थिति",
    profileExerciseFrequency: "व्यायाम आवृत्ति",
    profileInsurance: "बीमा",
    profileNoneReported: "कोई नहीं बताया",
    profileNonSmoker: "गैर-धूम्रपान करने वाला",
    profileOccasional: "कभी-कभी",
    profileActive: "सक्रिय",
    profileNotAvailable: "उपलब्ध नहीं",

    // Profile - Settings Labels
    profileLanguage: "भाषा",
    profileNotifications: "सूचनाएँ",
    profileEnabled: "सक्षम",
    profileDarkMode: "डार्क मोड",
    profileOff: "बंद",
    profileTextSize: "टेक्स्ट साइज़",
    profileMedium: "मध्यम",
    profileTwoFactor: "दो-कारक प्रमाणीकरण",
    profileDataSharing: "डेटा शेयरिंग",
    profileLimited: "सीमित",
    profileAutoLock: "ऑटो-लॉक",
    profileAfter5Min: "5 मिनट के बाद",

    // Profile - Help Labels
    profileFaq: "अक्सर पूछे जाने वाले प्रश्न",
    profileFaqDesc: "अक्सर पूछे जाने वाले प्रश्न",
    profileContactSupport: "सहायता से संपर्क करें",
    profileContactSupportDesc: "कॉल करें: 1800-XXX-XXXX (टोल फ्री)",
    profileReportProblem: "समस्या की रिपोर्ट करें",
    profileReportProblemDesc: "प्रतिक्रिया भेजें या बग रिपोर्ट करें",
    profilePrivacyPolicy: "गोपनीयता नीति",
    profilePrivacyPolicyDesc: "हम आपके डेटा की सुरक्षा कैसे करते हैं",
    profileTermsOfService: "सेवा की शर्तें",
    profileTermsOfServiceDesc: "ऐप उपयोग की शर्तें और नियम",
    profileAppVersion: "ऐप संस्करण",
    profileAppVersionDesc: "v1.0.0 (Build 2026.09)",

    // Profile - Logout
    profileLogoutConfirm: "लॉग आउट करें?",
    profileLogoutMsg: "आप भूमिका चयन स्क्रीन पर वापस जाएंगे।",
    profileCancel: "रद्द करें",

    // Role Select
    selectRole: "अपनी भूमिका चुनें",
    rolePatient: "मरीज़",
    rolePatientSub: "परामर्श बुक करें और स्वास्थ्य प्रबंधित करें",
    roleAsha: "आशा कार्यकर्ता / पर्यवेक्षक",
    roleAshaSub: "सामुदायिक स्वास्थ्य सहायता और फ़ील्ड देखभाल",
    roleDoctor: "डॉक्टर",
    roleDoctorSub: "स्वास्थ्य सेवा प्रदाता और परामर्श",
    rolePharmacy: "फ़ार्मेसी",
    rolePharmacySub: "दवाइयां, उपलब्धता और अनुरोध",
    roleDiagnostic: "निदान केंद्र",
    roleDiagnosticSub: "जांच, रिपोर्ट और निदान सेवाएं",

    // ABHA Login
    abhaLoginTitle: "ABHA स्वास्थ्य आईडी लॉगिन",
    abhaLoginSub: "आयुष्मान भारत स्वास्थ्य खाता — आपकी राष्ट्रीय डिजिटल स्वास्थ्य आईडी",
    abhaNumberLabel: "ABHA नंबर (14-अंक)",
    abhaNumberPlaceholder: "जैसे 1234-5678-9012",
    abhaAadhaarLabel: "आधार नंबर (12-अंक)",
    abhaAadhaarPlaceholder: "जैसे 1234 5678 9012",
    abhaOtpLabel: "आधार से जुड़े मोबाइल पर भेजा गया OTP दर्ज करें",
    abhaDemoOtp: "डेमो OTP: 123456",
    abhaLoginBtn: "सत्यापित करें और ABHA से लॉगिन करें",
    abhaCreateBtn: "नई ABHA आईडी बनाएं",
    abhaCreateTitle: "अपनी ABHA आईडी बनाएं",
    abhaCreateSub: "ABHA बनाने के लिए आधार या ड्राइविंग लाइसेंस ज़रूरी है",
    abhaCreateOption1: "आधार नंबर से",
    abhaCreateOption2: "ड्राइविंग लाइसेंस से",
    abhaCreateBtnText: "ABHA आईडी बनाएं",
    abhaVerifyMobile: "मोबाइल नंबर सत्यापित करें",
    abhaMobileLabel: "मोबाइल नंबर",
    abhaMobilePlaceholder: "+91-XXXXXXXXXX",
    abhaLinkedRecords: "आपके जुड़े हुए स्वास्थ्य रिकॉर्ड",
    abhaRecordTypes: "भारत भर में आपकी ABHA आईडी से जुड़े सभी रिकॉर्ड",
    abhaRecordConsent: "लॉगिन करके, आप इस ऐप में परामर्श और देखभाल के लिए अपने स्वास्थ्य रिकॉर्ड साझा करने की सहमति देते हैं।",
    abhaWhatIs: "ABHA क्या है?",
    abhaWhatIsDesc: "ABHA (आयुष्मान भारत स्वास्थ्य खाता) एक 14-अंकों की अद्वितीय स्वास्थ्य आईडी है जो भारत भर में आपके सभी स्वास्थ्य रिकॉर्ड को डिजिटल रूप से जोड़ती है।",
    abhaBenefits: "ABHA के फायदे",
    abhaBenefit1: "सभी अस्पतालों में एकीकृत स्वास्थ्य रिकॉर्ड",
    abhaBenefit2: "प्रिस्क्रिप्शन और लैब रिपोर्ट तक तुरंत पहुँच",
    abhaBenefit3: "भारत में किसी भी डॉक्टर के साथ रिकॉर्ड साझा करें",
    abhaBenefit4: "समय के साथ स्वास्थ्य इतिहास ट्रैक करें",
    abhaBenefit5: "मुफ़्त और सुरक्षित — भारत सरकार की पहल",

    // Doctor Role Select
    doctorRoleTitle: "अपनी विशिष्ट भूमिका चुनें",
    doctorRoleCHO: "मुख्य स्वास्थ्य अधिकारी",
    doctorRoleCHOSub: "प्राथमिक स्वास्थ्य प्रबंधन",
    doctorRoleMO: "चिकित्सा अधिकारी",
    doctorRoleMOSub: "उन्नत चिकित्सा परामर्श",
    doctorRoleCivil: "सिविल अस्पताल डॉक्टर",
    doctorRoleCivilSub: "अस्पताल-आधारित परामर्श",
    doctorRoleEmergency: "आपातकालीन डॉक्टर",
    doctorRoleEmergencySub: "आपातकालीन चिकित्सा देखभाल",

    // Doctor Login
    doctorLoginTitle: "लॉगिन",
    doctorLoginSub: "पूर्व-भरे क्रेडेंशियल के साथ त्वरित लॉगिन",
    choIdLabel: "CHO आईडी",
    choOtpLabel: "OTP दर्ज करें",
    doctorDemoOtp: "डेमो OTP: 123456",
    doctorLoginBtn: "लॉगिन",
    doctorCredHint: "नमूना क्रेडेंशियल पहले से भरे हुए हैं। बस लॉगिन पर क्लिक करें!",
    doctorAvailIds: "उपलब्ध डेमो आईडी:",
    doctorDemoIds: "CHO001",
    moIdLabel: "MO आईडी",
    moDemoIds: "MO002",
    moDashRole: "चिकित्सा अधिकारी",
    moDashToday: "आज की परामर्श",
    moDashQueue: "आपकी कतार",
    moDashWaiting: "कुल इंतज़ार",
    moDashPatientQueue: "मरीज़ कतार",
    moDashPatientQueueSub: "मरीज़ कतार प्रबंधित करें और परामर्श शुरू करें",
    moDashPatientsWaiting: "मरीज़ इंतज़ार कर रहे हैं",
    moDashQuickConsult: "त्वरित परामर्श",
    moDashQuickConsultSub: "अगला परामर्श तुरंत शुरू करें",
    moDashReady: "शुरू करने के लिए तैयार",
    moDashRecent: "हाल के परामर्श",
    moDashNoRecent: "आज कोई परामर्श नहीं",
    moQueueTitle: "मरीज़ कतार",
    moQueueEstWait: "अनुमानित प्रतीक्षा:",
    moQueueSince: "कतार में",
    moQueueStartConsult: "परामर्श शुरू करें",
    moQueueTagEmergency: "आपातकाल टैग करें",
    moRedirectTitle: "विशेषज्ञ को मरीज़ भेजें",
    moRedirectChoose: "उपयुक्त देखभाल स्तर चुनें:",
    moRedirectCivil: "सिविल अस्पताल में भेजें",
    moRedirectCivilDesc: "उन्नत सुविधाओं वाले जटिल मामलों के लिए",
    moRedirectCancel: "रद्द करें",

    // CHO Dashboard
    choDashGreeting: "सुप्रभात",
    choDashRole: "मुख्य स्वास्थ्य अधिकारी",
    choStatusAvailable: "उपलब्ध",
    choStatusBusy: "व्यस्त",
    choStatusOffline: "ऑफ़लाइन",
    choStatusDesc: "आप परामर्श के लिए उपलब्ध हैं",
    choTodayConsult: "आज के परामर्श",
    choYourQueue: "आपकी कतार",
    choTotalWaiting: "कुल प्रतीक्षा",
    choPatientQueue: "मरीज़ कतार",
    choPatientQueueDesc: "मरीज़ कतार प्रबंधित करें और परामर्श शुरू करें",
    choPatientsWaiting: "मरीज़ प्रतीक्षा में",
    choQuickConsult: "त्वरित परामर्श",
    choQuickConsultDesc: "तुरंत अगला परामर्श शुरू करें",
    choReadyToStart: "शुरू करने के लिए तैयार",
    choRedirectionDemo: "रीडायरेक्शन डेमो",
    choRedirectionDemoDesc: "नमूना मरीज़ रीडायरेक्शन सूचनाएं देखें",
    choRedirectionSample: "नमूना CHO → MO/सिविल अस्पताल सूचनाएं",
    choRecentConsult: "हालिया परामर्श",
    choProfile: "प्रोफ़ाइल",

    // Patient Queue Screen
    pQueueTitle: "मरीज़ कतार",
    pQueueOrangeCases: "नारंगी मामले",
    pQueueAvgWait: "औसत प्रतीक्षा समय",
    pQueueDoctorStatus: "डॉक्टर स्थिति",
    pQueueAvailable: "परामर्श के लिए उपलब्ध",
    pQueueOnline: "ऑनलाइन",
    pQueueReadyText: "नए मरीज़ स्वीकार करने के लिए तैयार",
    pQueueAvgConsTime: "औसत परामर्श समय: 15 मिनट",
    pQueuePatientQueue: "मरीज़ कतार",
    pQueueStartConsult: "परामर्श शुरू करें",
    pQueueTagEmergency: "आपातकालीन टैग करें",
    pQueueEstWait: "अनुमानित प्रतीक्षा:",
    pQueueInQueueSince: "कतार में कब से:",
    pQueueQueueScope: "आपकी कतार का दायरा",
    pQueueAsCHO: "मुख्य स्वास्थ्य अधिकारी के रूप में, आप संभालते हैं:",
    pQueueYellowCases: "प्राथमिक देखभाल मामले",

    // Consultation Screen
    consultTitle: "परामर्श",
    consultDuration: "अवधि:",
    consultSaveDraft: "ड्राफ्ट सहेजें",
    consultPatientInfo: "मरीज़ जानकारी",
    consultHistory: "इतिहास",
    consultVitals: "वाइटल्स",
    consultExamination: "जांच",
    consultPrescription: "प्रिस्क्रिप्शन",
    consultPatientOverview: "मरीज़ अवलोकन",
    consultFirstReg: "पहला पंजीकरण:",
    consultTotalConsults: "कुल परामर्श:",
    consultLastVisit: "अंतिम मुलाकात:",
    consultFirstVisit: "पहली मुलाकात",
    consultEmergencyVisits: "आपातकालीन मुलाकात:",
    consultToday: "आज का परामर्श",
    consultDate: "तिथि:",
    consultTime: "समय:",
    consultPriority: "प्राथमिकता:",
    consultSymptoms: "वर्तमान लक्षण:",
    consultPrevious: "पिछले परामर्श",
    consultStartVideo: "वीडियो कॉल शुरू करें",
    consultVoiceCall: "वॉइस कॉल",
    consultTextChat: "टेक्स्ट चैट",

    // Vitals
    vitalsTitle: "वाइटल साइन्स",
    vitalsBP: "रक्तचाप (mmHg)",
    vitalsHR: "हृदय गति (bpm)",
    vitalsTemp: "तापमान (°F)",
    vitalsWeight: "वजन (kg)",
    vitalsHeight: "ऊंचाई (cm)",
    vitalsO2: "ऑक्सीजन संतृप्ति (%)",

    // Examination
    examTitle: "नैदानिक जांच",
    examDiagnosis: "निदान",
    examDiagnosisPlaceholder: "प्राथमिक निदान दर्ज करें",
    examNotes: "नैदानिक नोट्स",
    examNotesPlaceholder: "जांच निष्कर्ष, उपचार योजना, अनुवर्ती निर्देश दर्ज करें...",

    // Prescription
    rxTitle: "प्रिस्क्रिप्शन",
    rxAddMedicine: "दवा जोड़ें",
    rxNoMeds: "अभी तक कोई दवा नहीं लिखी गई",
    rxAddFirst: "पहली दवा जोड़ें",
    rxMedName: "दवा का नाम",
    rxDosage: "खुराक",
    rxFrequency: "आवृत्ति",
    rxDuration: "अवधि",
    rxInstructions: "निर्देश",
    rxSelectMed: "दवा का नाम चुनें या टाइप करें",
    rxSelectFromList: "उपलब्ध दवाओं में से चुनें",
    rxDelete: "हटाएं",

    // Video Consult
    videoTitle: "वीडियो परामर्श",
    videoGoodConn: "अच्छा कनेक्शन",
    videoPatientFeed: "मरीज़ वीडियो फ़ीड",
    videoYourFeed: "आपका वीडियो",
    videoQuickNotes: "त्वरित नोट्स",
    videoNotesPlaceholder: "कॉल के दौरान त्वरित नोट्स टाइप करें...",
    videoMute: "म्यूट",
    videoCamera: "कैमरा",
    videoChat: "चैट",
    videoEndCall: "कॉल समाप्त करें",
    videoRecord: "रिकॉर्ड",

    // Redirect Modal
    redirectTitle: "मरीज़ को विशेषज्ञ के पास भेजें",
    redirectChoose: "इसके लिए उपयुक्त देखभाल स्तर चुनें:",
    redirectMO: "चिकित्सा अधिकारी को भेजें",
    redirectMODesc: "विशेष देखभाल वाले मध्यम मामलों के लिए",
    redirectMOTime: "15-20 मिनट",
    redirectCivil: "सिविल अस्पताल भेजें",
    redirectCivilDesc: "अस्पताल सुविधाओं वाले जटिल मामलों के लिए",
    redirectCivilTime: "30-45 मिनट",
    redirectCancel: "रद्द करें",

    // Patient Login
    patientAuthTitle: "मरीज़ लॉगिन",
    patientAuthSub: "मरीज़ आईडी या ABHA स्वास्थ्य आईडी से लॉगिन करें",
    patientIdAuthLabel: "मरीज़ आईडी / मोबाइल नंबर",
    patientIdAuthPlaceholder: "जैसे P001 या 9876543210",
    patientRoleHint: "💡 AI लक्षण जांच, टेलीकंसल्टेशन, प्रिस्क्रिप्शन और ABHA स्वास्थ्य रिकॉर्ड तक पहुँच",
    patientCredHint: "पूरे स्वास्थ्य रिकॉर्ड के लिए ABHA लॉगिन आज़माएं!",
    patientAvailIds: "डेमो ABHA आईडी: 12345678901234",
    patientDemoIds: "या मरीज़ आईडी: P001 (राम शर्मा)",

    // ASHA Login
    ashaLoginTitle: "लॉगिन",
    ashaLoginSub: "आशा कार्यकर्ता / पर्यवेक्षक",
    ashaIdLabel: "आशा कार्यकर्ता आईडी / पर्यवेक्षक आईडी",
    ashaIdPlaceholder: "जैसे MH-PUN-W-04-012 (कार्यकर्ता) या MH-PUN-S-04-012 (पर्यवेक्षक)",
    otpLabel: "OTP दर्ज करें",
    demoOtp: "डेमो OTP: 123456",
    ashaLoginBtn: "लॉगिन",
    ashaRoleHint: "आपकी भूमिका के अनुसार उपयुक्त डैशबोर्ड स्वचालित रूप से दिखाई देगा.",
    ashaCredHint: "नमूना क्रेडेंशियल पहले से भरे हुए हैं। बस लॉगिन पर क्लिक करें!",
    ashaAvailIds: "उपलब्ध डेमो आईडी:",
    ashaWorkerIds: "कार्यकर्ता: MH-PUN-W-04-012, A002, A003 | पर्यवेक्षक: MH-PUN-S-04-012",

    // Pharmacy Login
    pharmacyLoginTitle: "लॉगिन",
    pharmacyLoginSub: "पूर्व-भरे क्रेडेंशियल के साथ त्वरित लॉगिन",
    pharmacyLicenseLabel: "फ़ार्मेसी लाइसेंस आईडी",
    pharmacyOtpLabel: "OTP दर्ज करें",
    pharmacyDemoOtp: "डेमो OTP: 123456",
    pharmacyLoginBtn: "लॉगिन",
    pharmacyVerifiedNote: "सत्यापित फ़ार्मेसी दवा उपलब्धता और अनुरोध प्रबंधित कर सकती हैं.",
    pharmacyCredHint: "नमूना क्रेडेंशियल पहले से भरे हुए हैं। बस लॉगिन पर क्लिक करें!",
    pharmacyAvailIds: "उपलब्ध डेमो क्रेडेंशियल:",
    pharmacyDemoLicense: "MH-TZ4-567890",

    // Pharmacy Dashboard
    pharmacyDashTitle: "फ़ार्मेसी डैशबोर्ड",
    pharmacyDashName: "नांदगाँव PHC फ़ार्मेसी",
    pharmacyDashLicense: "लाइसेंस: MH-TZ4-567890",
    pharmacyTotalMedicines: "कुल दवाइयां",
    pharmacyInStock: "स्टॉक में",
    pharmacyLowStock: "कम स्टॉक",
    pharmacyOutOfStock: "स्टॉक में नहीं",
    pharmacyInventory: "दवा सूची",
    pharmacySearchMedicine: "दवाइयां खोजें...",
    pharmacyStockAll: "सभी",
    pharmacyStockIn: "स्टॉक",
    pharmacyStockLow: "कम",
    pharmacyStockOut: "नहीं",
    pharmacyRequests: "प्रिस्क्रिप्शन अनुरोध",
    pharmacyRequestFrom: "से",
    pharmacyRequestPatient: "मरीज़",
    pharmacyRequestMeds: "दवाइयां",
    pharmacyRequestStatus: "स्थिति",
    pharmacyReqPending: "लंबित",
    pharmacyReqDispensed: "वितरित",
    pharmacyReqReady: "तैयार",
    pharmacyDispense: "वितरित करें",
    pharmacyMarkReady: "तैयार करें",
    pharmacyStockUpdate: "स्टॉक अपडेट",
    pharmacyStockAdded: "स्टॉक अपडेट हो गया",
    pharmacyAlerts: "स्टॉक अलर्ट",
    pharmacyAlertLow: "कम स्टॉक — जल्दी ऑर्डर करें",
    pharmacyAlertOut: "स्टॉक में नहीं — तुरंत पुनः ऑर्डर करें",
    pharmacySupply: "supply ट्रैकर",
    pharmacyLastOrder: "अंतिम ऑर्डर",
    pharmacyNextOrder: "अगली ऑर्डर",
    pharmacyOrderNow: "अभी ऑर्डर करें",
    pharmacyLogout: "लॉगआउट",
    pharmacyProfile: "प्रोफ़ाइल",
    pharmacyMedName: "दवा",
    pharmacyMedCategory: "श्रेणी",
    pharmacyMedQty: "मात्रा",
    pharmacyMedExpiry: "समाप्ति",
    pharmacyMedAction: "कार्रवाई",
    pharmacyCategoryAntibiotic: "एंटीबायोटिक",
    pharmacyCategoryAnalgesic: "एनाल्जेसिक",
    pharmacyCategoryAntipyretic: "एंटीपायरेटिक",
    pharmacyCategoryAntidiabetic: "एंटीडायबेटिक",
    pharmacyCategoryCardiac: "कार्डिएक",
    pharmacyCategoryRespiratory: "श्वसन",
    pharmacyCategoryGastro: "गैस्ट्रो",
    pharmacyCategoryVitamin: "विटामिन",
    pharmacyReferralPending: "रेफ़रल लंबित",
    pharmacyReferralReady: "लेने के लिए तैयार",
    pharmacyReferralDispensed: "वितरित",

    // Diagnostic Center Login
    diagnosticLoginTitle: "लॉगिन",
    diagnosticLoginSub: "पूर्व-भरे क्रेडेंशियल के साथ त्वरित लॉगिन",
    diagnosticCeaLabel: "CEA पंजीकरण आईडी",
    diagnosticOtpLabel: "OTP दर्ज करें",
    diagnosticDemoOtp: "डेमो OTP: 123456",
    diagnosticLoginBtn: "लॉगिन",
    diagnosticVerifiedNote: "सत्यापित निदान केंद्र जांच, रिपोर्ट और निदान सेवाएं प्रबंधित कर सकते हैं.",
    diagnosticCredHint: "नमूना क्रेडेंशियल पहले से भरे हुए हैं। बस लॉगिन पर क्लिक करें!",
    diagnosticAvailIds: "उपलब्ध डेमो आईडी:",
    diagnosticDemoCea: "CEA-MH-2026-9874",
    diagnosticNablNote: "नोट: - हर निदान केंद्र NABL-मान्यताप्राप्त नहीं होगा इसलिए CEA ID का उपयोग किया जा रहा है",

    // Diagnostic Dashboard
    diagDashTitle: "निदान केंद्र",
    diagDashName: "नांदगाँव निदान लैब",
    diagDashCea: "CEA: CEA-MH-2026-9874",
    diagTotalTests: "कुल जांच",
    diagCompleted: "पूर्ण",
    diagPending: "लंबित",
    diagReportsReady: "रिपोर्ट तैयार",
    diagTestRequests: "जांच अनुरोध",
    diagSearchTests: "जांच खोजें...",
    diagReqFrom: "से",
    diagReqPatient: "मरीज़",
    diagReqTest: "जांच",
    diagReqStatus: "स्थिति",
    diagReqPending: "लंबित",
    diagReqInProgress: "जारी है",
    diagReqReady: "रिपोर्ट तैयार",
    diagStartTest: "जांच शुरू करें",
    diagMarkReady: "तैयार करें",
    diagAvailableTests: "उपलब्ध जांच",
    diagTestCategory: "श्रेणी",
    diagTestPrice: "कीमत",
    diagTestTAT: "समय",
    diagTestAction: "कार्रवाई",
    diagCatBlood: "रक्त जांच",
    diagCatImaging: "इमेजिंग",
    diagCatCardiac: "कार्डिएक",
    diagCatPathology: "पैथोलॉजी",
    diagCatUrine: "मूत्र",
    diagReports: "हालिया रिपोर्ट",
    diagReportPatient: "मरीज़",
    diagReportTest: "जांच",
    diagReportDate: "तिथि",
    diagReportStatus: "स्थिति",
    diagReportView: "देखें",
    diagReportDownload: "डाउनलोड",
    diagLogout: "लॉगआउट",
    diagProfile: "प्रोफ़ाइल",
    diagStatusPending: "लंबित",
    diagStatusInProgress: "जारी है",
    diagStatusReady: "तैयार",
    diagStatusCollected: "लिया गया",

    // ASHA Dashboard
    ashaDashTitle: "ASHA डैशबोर्ड",
    ashaWorkerName: "प्रिया पटेल",
    totalPatients: "कुल मरीज़",
    activeCases: "सक्रिय मामले",
    completedToday: "आज पूरे हुए",
    emergencyCases: "आपातकालीन मामले",
    quickActions: "त्वरित क्रियाएं",
    viewPatientSurvey: "मरीज़ सर्वेक्षण देखें",
    healthDrives: "स्वास्थ्य अभियान",
    registerNewPatient: "नया मरीज़ पंजीकरण",
    helpPatientLogin: "मरीज़ लॉगिन में मदद",
    patientServices: "मरीज़ सेवाएं",
    aiSymptomChecker: "AI लक्षण जांच",
    consultDoctor2: "डॉक्टर परामर्श",
    pastConsultations: "पिछले परामर्श",
    diseaseAnalytics: "रोग विश्लेषण",
    myArea: "मेरा क्षेत्र",
    coverageArea: "कवरेज क्षेत्र",
    ashaWorkerId: "आशा कार्यकर्ता आईडी",
    phoneNumber: "फ़ोन नंबर",
    recentActivity: "हालिया गतिविधि",
    logout: "लॉगआउट",

    // ASHA New Screens
    healthSurveys: "स्वास्थ्य सर्वेक्षण",
    surveyLanguage: "सर्वेक्षण भाषा",
    searchPatients: "मरीज़ खोजें...",
    registerNewPatientTitle: "नए मरीज का पंजीकरण",
    personalInfoSec: "व्यक्तिगत जानकारी",
    fullName: "पूरा नाम *",
    enterFullName: "मरीज़ का पूरा नाम दर्ज करें",
    age: "आयु *",
    gender: "लिंग *",
    selectGender: "चुनें",
    contactInfo: "संपर्क जानकारी",
    phoneNumberLabel: "फोन नंबर *",
    addressLabel: "पता",
    addressPlaceholder: "गांव, जिला",
    emergencyContactLabel: "आपातकालीन संपर्क",
    healthInfoLabel: "स्वास्थ्य जानकारी",
    familySizeLabel: "परिवार का आकार",
    familySizePlaceholder: "उदा. 4",
    registerPatientBtn: "मरीज़ पंजीकृत करें",
    patientLoginTitle: "मरीज़ लॉगिन",
    findPatient: "मरीज़ खोजें",
    findPatientSub: "खोजने और लॉगिन करने के लिए मरीज आईडी दर्ज करें",
    patientIdLabel: "मरीज़ आईडी",
    patientIdPlaceholder: "मरीज़ आईडी दर्ज करें (उदा. P001)",
    searchPatientBtn: "मरीज़ खोजें",
    quickAccess: "क्विक एक्सेस",
    back: "वापस",
    patientRegisteredMsg: "मरीज़ का सफल पंजीकरण हुआ!",
    callIvrInstructions: "१ दबाएं — आशा कार्यकर्ता · २ दबाएं — १०८",
    surveySelected: "चयनित:",
    surveyChecklistReady: "सर्वेक्षण सूची घर भेटी के लिए तैयार है।",
    activityRegistered: "मरीज़ पंजीकृत",
    activityConsultDone: "परामर्श पूर्ण",
    activityEmergencyRef: "आपातकालीन मामला रेफर किया",
    hoursAgo: "घंटे पहले",
    patientIdTab: "मरीज़ आईडी",
    abhaHealthIdTab: "आभा स्वास्थ्य आईडी",
    loginBtn: "लॉगिन",
    orDivider: "— या —",
    verifyOtpBtn: "OTP सत्यापित करें और रिकॉर्ड एक्सेस करें",
    backToLogin: "← वापस",
    sampleCredHint: "नमूना क्रेडेंशियल पहले से भरे हुए हैं। बस लॉगिन दबाएं!",
    ashaAssessment: "आशा मूल्यांकन",
    ashaAssistMode: "आशा कार्यकर्ता सहायता मोड",
    assistingPatient: "मरीज़ की सहायता कर रहे हैं:",
    changeBtn: "बदलें",
    aiSymptomCheckFor: "AI लक्षण जाँच:",
    teleconsultFor: "टेलीपरामर्श:",
    ashaHotline: "आशा सहायित हेल्पलाइन · मरीज़ को डॉक्टर से जोड़ रहे हैं",
    connectToDoctor: "डॉक्टर से जोड़ें",
    medicalHistoryFor: "चिकित्सा इतिहास:",
    outbreakAlerts: "प्रकोप अलर्ट",
    vaccinationRate: "टीकाकरण दर",
    communityTrends: "सामुदायिक रोग रुझान",
    patientsReportedWeek: "मरीज़ इस सप्ताह रिपोर्ट किए",
    activeOutbreaks: "सक्रिय प्रकोप",
    seasonalViralFever: "मौसमी वायरल बुखार",
    denguePrecaution: "डेंगू सावधानी",
    malariaScreening: "मलेरिया जाँच",
    highWarning: "उच्च चेतावनी",
    lowRisk: "कम जोखिम",
    moderateRisk: "मध्यम",
    generalConsultation: "सामान्य परामर्श",
    defaultDoctor: "डॉक्टर",
    generatedPatientId: "मरीज़ आईडी बनाई गई:",
    surveySymptoms: "लक्षण",
    surveyVitals: "महत्वपूर्ण संकेत",
    surveyConditions: "चिकित्सकीय स्थिति",
    surveyMedications: "वर्तमान दवाइयाँ",
    surveyNotes: "आशा नोट्स",
    surveyLastVisit: "अंतिम भेट:",
    surveyLastSurvey: "अंतिम सर्वेक्षण:",
    surveyEmergency: "आपातकालीन",
    surveyInProgress: "प्रगति में",
    surveyCompleted: "पूर्ण",
  }
};

const LANGS = ["English", "मराठी", "हिंदी"];

/* ---------------------------------------------------------
   MOCK DATA
--------------------------------------------------------- */
const PATIENT = { name: "रमेश पाटील", id: "P001", mobile: "9XXX XXXXXX" };

const ZONE_RANK = { yellow: 0, orange: 1, red: 2 };
const ZONE_ORDER = ["yellow", "orange", "red"];

const DOCTORS = {
  yellow: { name: "Dr. Shreeven Chavan", initial: "D" },
  orange: { name: "Dr. Smita Vagh", initial: "D" },
};

const RECORDS = {
  consultations: [
    { date: "2 Sep 2026", doctor: "Dr. Shreeven Chavan", note: "General health check — Yellow zone" },
    { date: "30 Aug 2026", doctor: "Dr. Smita Vagh", note: "Fever & cough — Orange zone" },
  ],
  prescriptions: [
    {
      doctor: "Dr. Amit Sharma", date: "31 Aug 2026",
      items: [
        { name: "Paracetamol 500mg", dose: "1 tablet — twice a day after food, 3 days" },
        { name: "ORS", dose: "1 sachet — twice a day after meal, 3 days" },
      ],
    },
  ],
  referrals: [
    {
      statusKey: "pending", refBy: "Dr. Shreeven Chavan", refTo: "PHC Nandgaon",
      specialist: "General Physician", reason: "Cough and cold", date: "2 Sep 2026",
      timelineKeys: [
        { labelKey: "referralCreated", date: "2 Sep 2026", done: true },
      ],
    },
    {
      statusKey: "completed", refBy: "Dr. Shreeven Chavan", refTo: "District Hospital",
      specialist: "Cardiology", reason: "Chest pain & breathlessness", date: "30 Aug 2026",
      timelineKeys: [
        { labelKey: "referralCreated", date: "30 Aug 2026", done: true },
        { labelKey: "hospitalVisit", date: "31 Aug 2026", done: true },
        { labelKey: "treatmentCompleted", date: "2 Sep 2026", done: true },
      ],
    },
    {
      statusKey: "completed", refBy: "Dr. Smita Vagh", refTo: "Civil Hospital Nashik",
      specialist: "Orthopedics", reason: "Knee joint pain", date: "18 Jul 2026",
      timelineKeys: [
        { labelKey: "referralCreated", date: "18 Jul 2026", done: true },
        { labelKey: "hospitalVisit", date: "20 Jul 2026", done: true },
        { labelKey: "treatmentCompleted", date: "25 Jul 2026", done: true },
      ],
    },
    {
      statusKey: "completed", refBy: "Dr. Shreeven Chavan", refTo: "PHC Nandgaon",
      specialist: "General Physician", reason: "Persistent cough", date: "5 Jun 2026",
      timelineKeys: [
        { labelKey: "referralCreated", date: "5 Jun 2026", done: true },
        { labelKey: "hospitalVisit", date: "7 Jun 2026", done: true },
        { labelKey: "treatmentCompleted", date: "10 Jun 2026", done: true },
      ],
    },
  ],
  diagnostics: [
    { name: "ECG", facility: "District Hospital", date: "31 Aug 2026", status: "Report available" },
  ],
};

const MEDICINES = [
  { name: "Paracetamol 500mg", stock: [
    { facility: "PHC Nandgaon", available: true },
    { facility: "CHC Nandgaon", available: true },
    { facility: "Rural Hospital", available: false },
  ]},
  { name: "ORS", stock: [
    { facility: "PHC Nandgaon", available: false },
    { facility: "CHC Nandgaon", available: true },
  ]},
  { name: "Zincovit Tablet", stock: [
    { facility: "PHC Nandgaon", available: true },
  ]},
];

/* ---------------------------------------------------------
   SANNIDHYA LOGO COMPONENT
--------------------------------------------------------- */
function SannidhyaLogo({ size = 44, style = {} }) {
  const [imgErr, setImgErr] = useState(false);

  if (!imgErr) {
    return (
      <img
        src="./sannidhya_logo.png"
        alt="Sannidhya Logo"
        onError={() => setImgErr(true)}
        style={{
          width: size, height: size, borderRadius: size * 0.24,
          objectFit: "cover", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", ...style
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.26,
      background: "linear-gradient(145deg, #0D6B56, #064035)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 3px 10px rgba(0,0,0,0.18)", overflow: "hidden",
      flexShrink: 0, ...style
    }}>
      <svg width={size * 0.85} height={size * 0.85} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="22" fill="#0E5E4A"/>
        <path d="M 22 66 C 15 48, 30 20, 68 20 C 82 20, 84 32, 65 35 C 40 38, 30 45, 30 54 C 30 60, 42 63, 76 56 C 82 55, 78 68, 62 68 C 45 68, 30 75, 22 66 Z" fill="#F7F5EE"/>
        <path d="M 78 34 C 85 52, 70 80, 32 80 C 18 80, 16 68, 35 65 C 60 62, 70 55, 70 46 C 70 40, 58 37, 24 44 C 18 45, 22 32, 38 32 C 55 32, 70 25, 78 34 Z" fill="#F7F5EE"/>
        <circle cx="50" cy="50" r="14" fill="#E8622A"/>
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------
   SMALL UI PRIMITIVES
--------------------------------------------------------- */
function TopBar({ title, onBack, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 18px", background: C.teal, color: "#fff",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 28 }}>
        {onBack && (
          <button onClick={onBack} style={iconBtnStyle(true)}>
            <ChevronLeft size={20} />
          </button>
        )}
        <span style={{ ...heading, fontSize: 17, fontWeight: 600 }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

function iconBtnStyle(onDark) {
  return {
    background: onDark ? "rgba(255,255,255,0.16)" : C.tealSoft,
    border: "none", borderRadius: 10, width: 34, height: 34,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: onDark ? "#fff" : C.teal, cursor: "pointer", flexShrink: 0,
  };
}

function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 16, padding: 16, cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, color = C.teal, style, icon, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        background: disabled ? C.border : color, color: disabled ? C.inkSoft : "#fff",
        border: "none", borderRadius: 12,
        padding: "14px 18px", fontSize: 15, fontWeight: 600, ...heading,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: "100%", cursor: disabled ? "default" : "pointer", ...style,
      }}
    >
      {icon}{children}
    </button>
  );
}

function ZoneBadge({ zone, t }) {
  const colorMap = { yellow: C.yellow, orange: C.orange, red: C.red };
  const softMap = { yellow: C.yellowSoft, orange: C.orangeSoft, red: C.redSoft };
  const name = t.zones[zone]?.name || zone.toUpperCase();
  return (
    <span style={{
      background: softMap[zone], color: colorMap[zone], fontWeight: 700, fontSize: 12,
      padding: "4px 10px", borderRadius: 999, ...heading,
    }}>
      {name}
    </span>
  );
}

function HomeTile({ icon, label, sub, onClick, accent = C.teal, accentSoft = C.tealSoft }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18,
        padding: "18px 14px", display: "flex", flexDirection: "column", gap: 10,
        alignItems: "flex-start", cursor: "pointer", textAlign: "left", width: "100%",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, background: accentSoft,
        display: "flex", alignItems: "center", justifyContent: "center", color: accent,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ ...heading, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{label}</div>
        {sub && <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );
}

const AAJI_VIDEOS = [
  { titleKey: "aajiV1", query: "Aaji Cha Batwa health tips marathi" },
  { titleKey: "aajiV2", query: "Aaji Cha Batwa nutrition marathi" },
  { titleKey: "aajiV3", query: "Aaji Cha Batwa home remedies marathi" },
  { titleKey: "aajiV4", query: "Aaji Cha Batwa wellness advice marathi" },
  { titleKey: "aajiV5", query: "Aaji Cha Batwa traditional health marathi" },
  { titleKey: "aajiV6", query: "Aaji Cha Batwa immunity marathi" },
  { titleKey: "aajiV7", query: "Aaji Cha Batwa seasonal health marathi" },
  { titleKey: "aajiV8", query: "Aaji Cha Batwa daily health routines marathi" },
  { titleKey: "aajiV9", query: "Aaji Cha Batwa diabetes management tips marathi" },
  { titleKey: "aajiV10", query: "Aaji Cha Batwa blood pressure control marathi" },
  { titleKey: "aajiV11", query: "Aaji Cha Batwa joint pain relief marathi" },
  { titleKey: "aajiV12", query: "Aaji Cha Batwa digestion health marathi" },
  { titleKey: "aajiV13", query: "Aaji Cha Batwa child health care marathi" },
  { titleKey: "aajiV14", query: "Aaji Cha Batwa pregnant women health tips marathi" },
  { titleKey: "aajiV15", query: "Aaji Cha Batwa skin care home remedies marathi" },
  { titleKey: "aajiV16", query: "Aaji Cha Batwa stress relief anxiety marathi" },
];

const SUPERSTITIOUS_MYTHS = [
  { mythKey: "mythNaginFit", realityKey: "realityNaginFit", emoji: "\u{1F40D}", query: "nagin fit seizure awareness marathi" },
  { mythKey: "mythPossession", realityKey: "realityPossession", emoji: "\u{1F47B}", query: "possession mental health awareness marathi" },
  { mythKey: "mythEvilEye", realityKey: "realityEvilEye", emoji: "\u{1F9FF}", query: "evil eye health reality marathi" },
  { mythKey: "mythBlackMagic", realityKey: "realityBlackMagic", emoji: "\u{1FA84}", query: "black magic health awareness" },
  { mythKey: "mythGodAnger", realityKey: "realityGodAnger", emoji: "\u{1F64F}", query: "god anger illness myth" },
  { mythKey: "mythBrandingSeizure", realityKey: "realityBrandingSeizure", emoji: "\u{1F525}", query: "branding seizure epilepsy myth marathi" },
  { mythKey: "mythTempleCure", realityKey: "realityTempleCure", emoji: "\u{1F6D5}", query: "temple shrine cure illness myth" },
  { mythKey: "mythEpilepsySpirit", realityKey: "realityEpilepsySpirit", emoji: "\u{1F9E0}", query: "epilepsy neurological disorder awareness" },
  { mythKey: "mythMentalPossession", realityKey: "realityMentalPossession", emoji: "\u{1F4A7}", query: "mental illness awareness marathi" },
  { mythKey: "mythFullMoon", realityKey: "realityFullMoon", emoji: "\u{1F315}", query: "full moon epilepsy myth" },
  { mythKey: "mythSnakeMantra", realityKey: "realitySnakeMantra", emoji: "\u{1F40D}", query: "snakebite medical emergency awareness" },
  { mythKey: "mythDogRitual", realityKey: "realityDogRitual", emoji: "\u{1F415}", query: "dog bite rabies prevention awareness" },
  { mythKey: "mythAmuletCure", realityKey: "realityAmuletCure", emoji: "\u{1F9FF}", query: "amulet thread cure illness myth" },
  { mythKey: "mythNewbornEvilEye", realityKey: "realityNewbornEvilEye", emoji: "\u{1F476}", query: "newborn evil eye health myth" },
  { mythKey: "mythHerbalCureAll", realityKey: "realityHerbalCureAll", emoji: "\u{1F33F}", query: "herbal remedy cure all illness myth" },
  { mythKey: "mythPrayerCures", realityKey: "realityPrayerCures", emoji: "\u{1F64F}", query: "prayer cure serious disease myth" },
  { mythKey: "mythFaintingSpirit", realityKey: "realityFaintingSpirit", emoji: "\u{1F635}", query: "fainting spirit cause myth reality" },
  { mythKey: "mythBadBlood", realityKey: "realityBadBlood", emoji: "\u{1FA78}", query: "bad blood impurity illness myth" },
  { mythKey: "mythCurseIllness", realityKey: "realityCurseIllness", emoji: "\u{1F9D9}", query: "curse caused illness myth reality" },
  { mythKey: "mythRitualRecurring", realityKey: "realityRitualRecurring", emoji: "\u{1F1FE}", query: "ritual recurring illness myth" },
];

function AajiChaBatwaScreen({ t, go }) {
  const [search, setSearch] = useState("");
  const filtered = AAJI_VIDEOS.filter(v => t[v.titleKey]?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={t.aajiTab} onBack={() => go("home")} />
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.inkSoft }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.searchVideos}
            style={{
              width: "100%", padding: "10px 12px 10px 36px", borderRadius: 12,
              border: `1.5px solid ${C.border}`, background: C.surface,
              ...body, fontSize: 13.5, color: C.ink, outline: "none",
            }}
          />
          {search && <X size={16} onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: C.inkSoft, cursor: "pointer" }} />}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 20px" }}>
        <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 12 }}>{t.aajiSub}</div>
        {filtered.length === 0 && <div style={{ ...body, fontSize: 13, color: C.inkSoft, textAlign: "center", marginTop: 30 }}>{t.noResults}</div>}
        {filtered.map((v, i) => (
          <Card key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10, background: "rgba(220,38,38,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}><Play size={20} color={C.red} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...heading, fontSize: 13.5, color: C.ink }}>{t[v.titleKey]}</div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginTop: 2 }}>YouTube</div>
              </div>
              <button
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`, "_blank")}
                style={{
                  padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${C.red}`,
                  background: "transparent", cursor: "pointer", ...heading, fontSize: 11.5, color: C.red,
                }}
              >{t.watchVideo}</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MythVsRealityScreen({ t, go }) {
  const [search, setSearch] = useState("");
  const filtered = SUPERSTITIOUS_MYTHS.filter(m =>
    t[m.mythKey]?.toLowerCase().includes(search.toLowerCase()) ||
    t[m.realityKey]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={t.mythsTab} onBack={() => go("home")} />
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.inkSoft }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.searchVideos}
            style={{
              width: "100%", padding: "10px 12px 10px 36px", borderRadius: 12,
              border: `1.5px solid ${C.border}`, background: C.surface,
              ...body, fontSize: 13.5, color: C.ink, outline: "none",
            }}
          />
          {search && <X size={16} onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: C.inkSoft, cursor: "pointer" }} />}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 20px" }}>
        <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 12 }}>{t.mythsSub}</div>
        {filtered.length === 0 && <div style={{ ...body, fontSize: 13, color: C.inkSoft, textAlign: "center", marginTop: 30 }}>{t.noResults}</div>}
        {filtered.map((m, i) => (
          <Card key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: C.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22,
              }}>{m.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...body, fontSize: 11, color: C.red, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{t.commonBelief}</div>
                <div style={{ ...heading, fontSize: 13.5, color: C.ink, marginTop: 2 }}>{t[m.mythKey]}</div>
              </div>
            </div>
            <div style={{
              marginTop: 10, padding: "10px 12px", borderRadius: 10,
              background: "rgba(0,150,136,0.06)", borderLeft: `3px solid ${C.teal}`,
            }}>
              <div style={{ ...body, fontSize: 11, color: C.teal, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{t.sannidhyaExplains}</div>
              <div style={{ ...body, fontSize: 12.5, color: C.ink, marginTop: 4, lineHeight: 1.5 }}>{t[m.realityKey]}</div>
            </div>
            <button
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(m.query)}`, "_blank")}
              style={{
                width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 10,
                border: `1.5px solid ${C.border}`, background: C.surface, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                color: C.red, ...heading, fontSize: 12.5,
              }}
            ><Play size={16} /> {t.watchVideo}</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

const OUTBREAK_DATA = [
  {
    id: 1,
    disease: "Viral Fever",
    area: "Nandgaon",
    village: "Nandgaon Village",
    district: "Pune",
    severity: "high",
    trend: "up",
    casesReported: 47,
    newToday: 8,
    symptoms: ["Fever", "Cough", "Cold", "Body ache", "Weakness"],
    precautionsKey: ["outbreakPrecautionHygiene", "outbreakPrecautionDistance", "outbreakPrecautionHydrate", "outbreakPrecautionMask", "outbreakPrecautionCare"],
    urgentSignsKey: ["outbreakUrgentBreathing", "outbreakUrgentConfusion", "outbreakUrgentWeakness", "outbreakUrgentFever"],
    updated: "2 hours ago",
  },
  {
    id: 2,
    disease: "Diarrhoeal Illness",
    area: "Ralegaon",
    village: "Ralegaon Sidhra",
    district: "Pune",
    severity: "moderate",
    trend: "stable",
    casesReported: 23,
    newToday: 3,
    symptoms: ["Loose motions", "Stomach cramps", "Dehydration", "Nausea"],
    precautionsKey: ["outbreakPrecautionHygiene", "outbreakPrecautionHydrate", "outbreakPrecautionCare"],
    urgentSignsKey: ["outbreakUrgentWeakness", "outbreakUrgentFever"],
    updated: "5 hours ago",
  },
  {
    id: 3,
    disease: "Respiratory Infection",
    area: "Wadgaon",
    village: "Wadgaon Sheri",
    district: "Pune",
    severity: "low",
    trend: "down",
    casesReported: 12,
    newToday: 1,
    symptoms: ["Cough", "Sore throat", "Mild fever", "Congestion"],
    precautionsKey: ["outbreakPrecautionHygiene", "outbreakPrecautionMask", "outbreakPrecautionHydrate"],
    urgentSignsKey: ["outbreakUrgentBreathing", "outbreakUrgentFever"],
    updated: "1 day ago",
  },
];

const FACILITIES = [
  { name: "Nandgaon PHC", distance: "2 km", type: "Primary Health Centre" },
  { name: "Rural Hospital Pune", distance: "12 km", type: "Community Health Centre" },
  { name: "Civil Hospital Pune", distance: "18 km", type: "District Hospital" },
];

const ASHA_VILLAGES = [
  { village: "Nandgaon", cases: 47, trend: "up", followUps: 12 },
  { village: "Ralegaon Sidhra", cases: 23, trend: "stable", followUps: 5 },
  { village: "Wadgaon Sheri", cases: 12, trend: "down", followUps: 2 },
];

const CHO_WEEKLY = [
  { day: "Mon", cases: 5 }, { day: "Tue", cases: 8 }, { day: "Wed", cases: 12 },
  { day: "Thu", cases: 9 }, { day: "Fri", cases: 15 }, { day: "Sat", cases: 11 }, { day: "Sun", cases: 7 },
];

const DEPT_AREAS = [
  { area: "Nandgaon", disease: "Viral Fever", cases: 47, trend: "rising", beds: 12, staff: 4 },
  { area: "Ralegaon", disease: "Diarrhoeal", cases: 23, trend: "stable", beds: 8, staff: 3 },
  { area: "Wadgaon", disease: "Respiratory", cases: 12, trend: "declining", beds: 15, staff: 5 },
  { area: "Hadapsar", disease: "Dengue suspected", cases: 6, trend: "rising", beds: 20, staff: 6 },
];

function OutbreaksScreen({ t, go, role }) {
  if (role === "asha") return <AshaOutbreaksScreen t={t} go={go} />;
  if (role === "cho" || role === "mo") return <ChoOutbreaksScreen t={t} go={go} />;
  if (role === "dept") return <DeptOutbreaksScreen t={t} go={go} />;
  return <PatientOutbreaksScreen t={t} go={go} />;
}

function PatientOutbreaksScreen({ t, go }) {
  const alert = OUTBREAK_DATA[0];
  const severityColor = { high: C.red, moderate: C.orange, low: C.yellow }[alert.severity];
  const severityLabel = { high: t.outbreakSeverityHigh, moderate: t.outbreakSeverityModerate, low: t.outbreakSeverityLow }[alert.severity];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={t.outbreaksTab} onBack={() => go("home")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 20px" }}>

        {/* Active Alert Card */}
        <div style={{
          background: `linear-gradient(135deg, ${severityColor}15, ${severityColor}08)`,
          border: `1.5px solid ${severityColor}40`, borderRadius: 14, padding: 14, marginBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%", background: severityColor,
              boxShadow: `0 0 8px ${severityColor}80`,
            }} />
            <span style={{ ...heading, fontSize: 11, color: severityColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{severityLabel}</span>
          </div>
          <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{t.outbreakHealthAlert}</div>
          <div style={{ ...heading, fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 6 }}>
            {alert.disease} — {t.outbreakIncreasing}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <MapPin size={13} color={C.inkSoft} />
            <span style={{ ...body, fontSize: 12, color: C.inkSoft }}>{alert.area}, {alert.district}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1, background: C.surface, borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: severityColor }}>{alert.casesReported}</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.outbreakCasesReported}</div>
            </div>
            <div style={{ flex: 1, background: C.surface, borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: C.teal }}>+{alert.newToday}</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>New Today</div>
            </div>
          </div>
          <div style={{ ...body, fontSize: 10, color: C.inkSoft, marginTop: 8 }}>{t.outbreakUpdated}: {alert.updated}</div>
        </div>

        {/* Symptoms */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakSymptoms}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {alert.symptoms.map((s, i) => (
              <span key={i} style={{ padding: "5px 10px", borderRadius: 8, background: C.orangeSoft, ...body, fontSize: 11.5, color: C.orange, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </Card>

        {/* Precautions */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakPrecautions}</div>
          {alert.precautionsKey.map((pk, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <CheckCircle size={14} color={C.teal} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ ...body, fontSize: 12, color: C.ink }}>{t[pk]}</span>
            </div>
          ))}
        </Card>

        {/* When to Seek Urgent Care */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <AlertTriangle size={15} color={C.red} />
            <span style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.red }}>{t.outbreakWhenUrgent}</span>
          </div>
          {alert.urgentSignsKey.map((uk, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, flexShrink: 0 }} />
              <span style={{ ...body, fontSize: 12, color: C.ink }}>{t[uk]}</span>
            </div>
          ))}
        </Card>

        {/* Nearby Facilities */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakNearbyFacilities}</div>
          {FACILITIES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Heart size={16} color={C.teal} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...heading, fontSize: 12.5, color: C.ink }}>{f.name}</div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{f.type} • {f.distance}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Source Note */}
        <div style={{ ...body, fontSize: 10, color: C.inkSoft, textAlign: "center" }}>{t.outbreakAlertSource}</div>
      </div>
    </div>
  );
}

function AshaOutbreaksScreen({ t, go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={t.outbreakAshaTitle} onBack={() => go("home")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 20px" }}>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, background: C.redSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.red }}>82</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>Total Cases</div>
          </div>
          <div style={{ flex: 1, background: C.orangeSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.orange }}>19</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>Follow-ups</div>
          </div>
          <div style={{ flex: 1, background: C.greenSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.green }}>3</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>Villages</div>
          </div>
        </div>

        {/* Villages with Increased Cases */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakAshaVillages}</div>
          {ASHA_VILLAGES.map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: v.trend === "up" ? C.redSoft : v.trend === "stable" ? C.orangeSoft : C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={16} color={v.trend === "up" ? C.red : v.trend === "stable" ? C.orange : C.green} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...heading, fontSize: 12.5, color: C.ink }}>{v.village}</div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{v.cases} cases • {v.followUps} follow-ups</div>
              </div>
              <span style={{
                padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                background: v.trend === "up" ? C.redSoft : v.trend === "stable" ? C.orangeSoft : C.greenSoft,
                color: v.trend === "up" ? C.red : v.trend === "stable" ? C.orange : C.green,
              }}>{v.trend === "up" ? t.outbreakTrendUp : v.trend === "stable" ? t.outbreakTrendStable : "Declining"}</span>
            </div>
          ))}
        </Card>

        {/* Follow-up Patients */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakAshaFollowUp}</div>
          {["Ramesh Patil – Fever 3 days", "Sita Bai – Diarrhoea 2 days", "Ganesh K – Cough 5 days"].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...heading, fontSize: 12, color: C.teal, fontWeight: 600 }}>{p[0]}</div>
              <div style={{ ...body, fontSize: 12, color: C.ink }}>{p}</div>
            </div>
          ))}
        </Card>

        {/* Preventive Actions */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakAshaPreventive}</div>
          {[t.outbreakAshaVisitHome, t.outbreakAshaDistribute, t.outbreakAshaEducate, t.outbreakAshaReport].map((action, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <CheckCircle size={14} color={C.teal} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ ...body, fontSize: 12, color: C.ink }}>{action}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function ChoOutbreaksScreen({ t, go }) {
  const maxCases = Math.max(...CHO_WEEKLY.map(d => d.cases));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={t.outbreakChoTitle} onBack={() => go("home")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 20px" }}>

        {/* Summary */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, background: C.tealSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.teal }}>82</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.outbreakChoTotalCases}</div>
          </div>
          <div style={{ flex: 1, background: C.orangeSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.orange }}>8</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.outbreakChoNewToday}</div>
          </div>
          <div style={{ flex: 1, background: C.greenSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.green }}>54</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.outbreakChoRecovered}</div>
          </div>
        </div>

        {/* Weekly Case Trend Chart */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>{t.outbreakChoCases}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {CHO_WEEKLY.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ ...body, fontSize: 9, color: C.inkSoft }}>{d.cases}</span>
                <div style={{
                  width: "100%", height: `${(d.cases / maxCases) * 50}px`, minHeight: 4,
                  borderRadius: 4, background: d.cases > 10 ? C.red : d.cases > 6 ? C.orange : C.teal,
                }} />
                <span style={{ ...body, fontSize: 9, color: C.inkSoft }}>{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Symptom Patterns */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakChoSymptoms}</div>
          {[{ name: "Fever", pct: 78 }, { name: "Cough", pct: 52 }, { name: "Body ache", pct: 41 }, { name: "Cold", pct: 35 }].map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ ...body, fontSize: 11.5, color: C.ink }}>{s.name}</span>
                <span style={{ ...body, fontSize: 11, color: C.inkSoft }}>{s.pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: C.bg }}>
                <div style={{ height: "100%", width: `${s.pct}%`, borderRadius: 3, background: s.pct > 60 ? C.red : s.pct > 40 ? C.orange : C.teal }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Facility Visit Trends */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakChoFacility}</div>
          {[{ name: "Nandgaon PHC", visits: 32, trend: "up" }, { name: "Rural Hospital", visits: 18, trend: "stable" }, { name: "Civil Hospital", visits: 7, trend: "down" }].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...heading, fontSize: 12.5, color: C.ink }}>{f.name}</div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{f.visits} visits this week</div>
              </div>
              <span style={{
                padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                background: f.trend === "up" ? C.redSoft : f.trend === "stable" ? C.orangeSoft : C.greenSoft,
                color: f.trend === "up" ? C.red : f.trend === "stable" ? C.orange : C.green,
              }}>{f.trend === "up" ? t.outbreakDeptRising : f.trend === "stable" ? t.outbreakDeptStable : t.outbreakDeptDeclining}</span>
            </div>
          ))}
        </Card>

        {/* High-Risk Patients */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakChoHighRisk}</div>
          {["Kamala Bai (68) – Fever + Breathlessness", "Suresh Patil (72) – Chronic diabetic + Fever"].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, flexShrink: 0 }} />
              <span style={{ ...body, fontSize: 12, color: C.ink }}>{p}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function DeptOutbreaksScreen({ t, go }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={t.outbreakDeptTitle} onBack={() => go("home")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 20px" }}>

        {/* Summary */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, background: C.tealSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.teal }}>88</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>Total Cases</div>
          </div>
          <div style={{ flex: 1, background: C.redSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.red }}>2</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>Rising Areas</div>
          </div>
          <div style={{ flex: 1, background: C.greenSoft, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ ...heading, fontSize: 20, fontWeight: 700, color: C.green }}>55</div>
            <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>Recovered</div>
          </div>
        </div>

        {/* Area-wise Trend Map */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakDeptMap}</div>
          {DEPT_AREAS.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: a.trend === "rising" ? C.redSoft : a.trend === "stable" ? C.orangeSoft : C.greenSoft,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <MapPin size={18} color={a.trend === "rising" ? C.red : a.trend === "stable" ? C.orange : C.green} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...heading, fontSize: 12.5, color: C.ink }}>{a.area}</div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{a.disease} • {a.cases} cases</div>
              </div>
              <span style={{
                padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                background: a.trend === "rising" ? C.redSoft : a.trend === "stable" ? C.orangeSoft : C.greenSoft,
                color: a.trend === "rising" ? C.red : a.trend === "stable" ? C.orange : C.green,
              }}>{a.trend === "rising" ? t.outbreakDeptRising : a.trend === "stable" ? t.outbreakDeptStable : t.outbreakDeptDeclining}</span>
            </div>
          ))}
        </Card>

        {/* Resource & Medicine Requirements */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakDeptResources}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: C.greenSoft, borderRadius: 10, padding: "10px", textAlign: "center" }}>
              <Package size={18} color={C.green} style={{ marginBottom: 4 }} />
              <div style={{ ...heading, fontSize: 12, color: C.green }}>Adequate</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.outbreakDeptMedicineStock}</div>
            </div>
            <div style={{ flex: 1, background: C.orangeSoft, borderRadius: 10, padding: "10px", textAlign: "center" }}>
              <Activity size={18} color={C.orange} style={{ marginBottom: 4 }} />
              <div style={{ ...heading, fontSize: 12, color: C.orange }}>55 / 80</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.outbreakDeptBedAvailability}</div>
            </div>
            <div style={{ flex: 1, background: C.tealSoft, borderRadius: 10, padding: "10px", textAlign: "center" }}>
              <UserCheck size={18} color={C.teal} style={{ marginBottom: 4 }} />
              <div style={{ ...heading, fontSize: 12, color: C.teal }}>18</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.outbreakDeptStaffOnDuty}</div>
            </div>
          </div>
        </Card>

        {/* Disease Patterns */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakDeptPatterns}</div>
          {[{ disease: "Viral Fever", cases: 47, trend: "rising" }, { disease: "Diarrhoeal Illness", cases: 23, trend: "stable" }, { disease: "Respiratory Infection", cases: 12, trend: "declining" }, { disease: "Dengue (suspected)", cases: 6, trend: "rising" }].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...heading, fontSize: 12.5, color: C.ink }}>{d.disease}</div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{d.cases} cases</div>
              </div>
              <span style={{
                padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                background: d.trend === "rising" ? C.redSoft : d.trend === "stable" ? C.orangeSoft : C.greenSoft,
                color: d.trend === "rising" ? C.red : d.trend === "stable" ? C.orange : C.green,
              }}>{d.trend === "rising" ? t.outbreakDeptRising : d.trend === "stable" ? t.outbreakDeptStable : t.outbreakDeptDeclining}</span>
            </div>
          ))}
        </Card>

        {/* Early Intervention */}
        <Card style={{ marginBottom: 10 }}>
          <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{t.outbreakDeptIntervention}</div>
          {["Deploy additional ASHA workers to Nandgaon", "Stock paracetamol and ORS at Nandgaon PHC", "Issue public advisory for hand hygiene", "Monitor dengue suspected cases closely"].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <CheckCircle size={14} color={C.teal} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ ...body, fontSize: 12, color: C.ink }}>{a}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function BottomNav({ active, setScreen, t }) {
  const items = [
    { key: "home", label: t.navHome, icon: Home },
    { key: "records", label: t.navRecords, icon: ClipboardList },
    { key: "medicines", label: t.navMedicines, icon: Pill },
    { key: "emergency", label: t.navEmergency, icon: Ambulance },
    { key: "profile", label: t.navProfile, icon: User },
  ];
  return (
    <div style={{
      display: "flex", justifyContent: "space-around", alignItems: "center",
      background: C.surface, borderTop: `1px solid ${C.border}`,
      padding: "9px 4px 12px", position: "sticky", bottom: 0,
    }}>
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        const isEmergency = key === "emergency";
        return (
          <button key={key} onClick={() => setScreen(key)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: isEmergency ? C.red : isActive ? C.teal : C.inkSoft,
            flex: 1,
          }}>
            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            <span style={{ ...body, fontSize: 10.5, fontWeight: isActive ? 700 : 500 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   RISK ENGINE
--------------------------------------------------------- */
function computeZone(answers) {
  const riskFactors = [];
  let rank = ZONE_RANK[answers.symptom.zone] || 0;

  if (answers.symptom.zone === "red") {
    riskFactors.push({ label: "chestPain", severity: "high" });
    return { zone: "red", riskFactors, riskScore: 9 };
  }
  if (answers.additional.includes("Breathlessness") || answers.additional.includes("श्वास घेण्यास त्रास") || answers.additional.includes("सांस फूलना")) {
    riskFactors.push({ label: "breathlessness", severity: "high" });
    return { zone: "red", riskFactors, riskScore: 9 };
  }

  const cond = answers.condition || "";
  const isSevere = cond.includes("Severe") || cond.includes("तीव्र") || cond.includes("गंभीर") || cond.includes("worse") || cond.includes("बिघडणारी");
  if (isSevere) { rank += 1; riskFactors.push({ label: "severeCondition", severity: "high" }); }

  const hasHighFever = answers.additional.some(a => a.includes("102") || a.includes("ताप") || a.includes("fever"));
  if (hasHighFever) { rank += 1; riskFactors.push({ label: "highFever", severity: "medium" }); }

  const hasChronicIllness = answers.riskFactors.some((r) => r.includes("Chronic") || r.includes("दीर्घकालीन") || r.includes("पुराणी"));
  const isElderly = answers.riskFactors.some((r) => r.includes("Elderly") || r.includes("ज्येष्ठ") || r.includes("बुज़ुर्ग"));
  const isPregnant = answers.riskFactors.some((r) => r.includes("Pregnant") || r.includes("गरोदर") || r.includes("गर्भवती"));

  if (hasChronicIllness) riskFactors.push({ label: "chronicIllness", severity: "high" });
  if (isElderly) riskFactors.push({ label: "elderly", severity: "medium" });
  if (isPregnant) riskFactors.push({ label: "pregnant", severity: "high" });

  if (answers.riskFactors.some((r) => !r.includes("None") && !r.includes("काहीही नाही") && !r.includes("कोई नहीं"))) rank += 1;

  rank = Math.max(0, Math.min(rank, 2));
  const riskScore = Math.min(10, Math.max(1, rank * 3 + riskFactors.length));
  return { zone: ZONE_ORDER[rank], riskFactors, riskScore };
}

/* ---------------------------------------------------------
   CHAT-BASED SYMPTOM QUESTIONNAIRE
--------------------------------------------------------- */
function speakText(text, lang) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (lang === "मराठी") u.lang = "mr-IN";
  else if (lang === "हिंदी") u.lang = "hi-IN";
  else u.lang = "en-IN";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

function ChatBubble({ msg, onOptionClick, selectedOptions, lang }) {
  const isAi = msg.type === "ai";
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 4,
      alignItems: isAi ? "flex-start" : "flex-end",
      marginBottom: 10,
    }}>
      {isAi && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, marginLeft: 2 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", background: C.teal,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <Bot size={14} />
          </div>
          <span style={{ ...body, fontSize: 11, color: C.inkSoft, fontWeight: 500 }}>AI Assistant</span>
        </div>
      )}
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 6,
        flexDirection: isAi ? "row" : "row-reverse",
        maxWidth: "88%",
      }}>
        <div style={{
          background: isAi ? C.surface : C.teal,
          border: isAi ? `1px solid ${C.border}` : "none",
          borderRadius: isAi ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
          padding: "10px 14px",
          ...body, fontSize: 13, lineHeight: 1.6,
          color: isAi ? C.ink : "#fff",
        }}>
          {msg.text}
        </div>
      </div>
      {isAi && msg.options && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 7,
          marginTop: 6, marginLeft: 32,
        }}>
          {msg.options.map((opt) => {
            const active = msg.multi && (selectedOptions || []).includes(opt);
            return (
              <button key={opt} onClick={() => onOptionClick(opt)} style={{
                background: active ? C.tealSoft : C.surface,
                border: `1.5px solid ${active ? C.teal : C.border}`,
                borderRadius: 20, padding: "8px 15px",
                ...body, fontSize: 12, color: active ? C.tealDark : C.ink,
                fontWeight: active ? 600 : 400,
                cursor: "pointer", whiteSpace: "nowrap",
              }}>
                {opt}{active ? " ✓" : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SymptomQuestionnaire({ onBack, onFinish, intro, t, lang }) {
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("init");
  const [answers, setAnswers] = useState({ symptom: null, duration: null, condition: null, additional: [], riskFactors: [] });
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const questionNumber = { q1: 1, q2: 2, q3: 3, q4: 4, q5: 5 }[phase] || 5;

  useEffect(() => {
    const msgs = [];
    if (intro) msgs.push({ id: 1, type: "ai", text: intro });
    msgs.push({ id: 2, type: "ai", text: t.q1Title });
    setMessages(msgs);
    setPhase("q1");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (phase === "analysing") {
      const timer = setTimeout(() => {
        const zoneResult = computeZone(answers);
        onFinish(zoneResult.zone, answers, zoneResult);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const addAiMessage = useCallback((text, options, multi) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), type: "ai", text, options, multi }]);
  }, []);

  const addUserMessage = useCallback((text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), type: "user", text }]);
  }, []);

  const handleOptionSelect = useCallback((option) => {
    addUserMessage(option);

    if (phase === "q1") {
      const chip = t.symptomsList.find(s => s.label === option);
      const symptom = chip || { label: option, zone: "yellow" };
      setAnswers(a => ({ ...a, symptom }));
      if (symptom.zone === "red") {
        setTimeout(() => { addAiMessage(t.analysingText); setPhase("analysing"); }, 300);
        return;
      }
      setTimeout(() => { addAiMessage(t.q2Title, t.q2Opts); setPhase("q2"); }, 400);
    } else if (phase === "q2") {
      setAnswers(a => ({ ...a, duration: option }));
      setTimeout(() => { addAiMessage(t.q3Title, t.q3Opts); setPhase("q3"); }, 400);
    } else if (phase === "q3") {
      setAnswers(a => ({ ...a, condition: option }));
      setTimeout(() => { addAiMessage(t.q4Title, t.q4Opts); setPhase("q4"); }, 400);
    } else if (phase === "q4") {
      setAnswers(a => ({ ...a, additional: [option] }));
      setTimeout(() => { addAiMessage(t.q5Title, t.q5Opts); setPhase("q5"); }, 400);
    } else if (phase === "q5") {
      setAnswers(a => ({ ...a, riskFactors: [option] }));
      setTimeout(() => { addAiMessage(t.analysingText); setPhase("analysing"); }, 400);
    }
  }, [phase, t, addUserMessage, addAiMessage]);

  const handleTextSubmit = useCallback(() => {
    if (!inputText.trim()) return;
    handleOptionSelect(inputText.trim());
    setInputText("");
  }, [inputText, handleOptionSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  }, [handleTextSubmit]);

  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev) => { setInputText(ev.results[0][0].transcript); setIsRecording(false); };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    setIsRecording(true);
    rec.start();
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addUserMessage("Image uploaded — skin disease analysis");
    setTimeout(() => {
      addAiMessage("I can see the image. I've noted this for your symptom assessment. Please also describe any symptoms you're experiencing, such as itching, pain, duration, or spread.");
    }, 800);
    e.target.value = "";
  }, [addUserMessage, addAiMessage]);

  if (phase === "analysing") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", border: `4px solid ${C.tealSoft}`,
          borderTopColor: C.teal, animation: "spin 0.9s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ ...body, fontSize: 13.5, color: C.inkSoft }}>{t.analysingText}</div>
      </div>
    );
  }

  const showExamples = phase === "q1" && messages.length <= (intro ? 2 : 1);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Progress bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>
          {t.questionProgress} {questionNumber} / 5
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              width: 20, height: 4, borderRadius: 999,
              background: i <= questionNumber ? C.teal : C.border,
            }} />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            msg={msg}
            onOptionClick={handleOptionSelect}
            selectedOptions={[]}
            lang={lang}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Example chips for Q1 */}
      {showExamples && (
        <div style={{ padding: "0 16px 8px", flexShrink: 0 }}>
          <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginBottom: 6 }}>Examples:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {t.symptomsList.map(s => (
              <button key={s.label} onClick={() => handleOptionSelect(s.label)} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 16, padding: "6px 12px",
                ...body, fontSize: 11.5, color: C.ink, cursor: "pointer",
              }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px 14px", borderTop: `1px solid ${C.border}`,
        background: C.surface, flexShrink: 0,
      }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 6,
          background: C.bg, borderRadius: 24, padding: "8px 14px",
          border: `1px solid ${C.border}`,
        }}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={phase === "q1" ? "Describe your symptoms..." : "Your answer..."}
            style={{
              flex: 1, border: "none", background: "none", outline: "none",
              ...body, fontSize: 13, color: C.ink,
            }}
          />
          <button onClick={startVoice} style={{
            background: "none", border: "none", cursor: "pointer",
            color: isRecording ? C.red : C.inkSoft, padding: 2,
          }}>
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        <button onClick={() => fileInputRef.current?.click()} style={{
          width: 38, height: 38, borderRadius: "50%", border: `1.5px solid ${C.border}`,
          background: C.surface, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: C.inkSoft, flexShrink: 0,
        }}>
          <Camera size={18} />
        </button>
        <button onClick={handleTextSubmit} style={{
          width: 38, height: 38, borderRadius: "50%", background: C.teal,
          border: "none", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#fff", flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   HOME SCREEN
--------------------------------------------------------- */
function HomeScreen({ go, isAshaAssisted, lang, setLang, t }) {
  const [langOpen, setLangOpen] = useState(false);
  return (
    <div>
      {isAshaAssisted && (
        <div style={{
          background: "#F3F0FF", borderBottom: "1px solid #DDD6FE", padding: "10px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between", ...body, fontSize: 12, color: "#6D28D9", fontWeight: 600,
        }}>
          <span>👥 ASHA Mode: Logged in as Patient ({PATIENT.id})</span>
          <button onClick={() => go("asha_home")} style={{ background: "#7C3AED", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
            Return to ASHA Dashboard
          </button>
        </div>
      )}
      <div style={{ background: C.teal, padding: "18px 18px 22px", color: "#fff", position: "relative", borderRadius: "0 0 22px 22px" }}>
        {/* Top Header Row with Logo, Title & Language Selector */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SannidhyaLogo size={48} />
            <div>
              <div style={{ ...heading, fontSize: 20, fontWeight: 700, letterSpacing: 0.5, color: "#FFF" }}>
                {t.appName}
              </div>
              <div style={{ ...body, fontSize: 11.5, color: "rgba(255,255,255,0.9)", fontWeight: 500, marginTop: 1 }}>
                {t.tagline}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setLangOpen(!langOpen)} style={{
                background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 10,
                color: "#fff", padding: "7px 11px", display: "flex", alignItems: "center",
                gap: 6, fontSize: 12.5, cursor: "pointer", ...body, fontWeight: 600,
              }}>
                <Globe size={14} /> {lang} <ChevronDown size={13} />
              </button>
              {langOpen && (
                <div style={{
                  position: "absolute", right: 0, top: 38, background: "#fff", borderRadius: 10,
                  boxShadow: "0 8px 22px rgba(0,0,0,0.22)", overflow: "hidden", zIndex: 30, width: 130,
                }}>
                  {LANGS.map((l) => (
                    <div key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{
                      padding: "10px 14px", fontSize: 13.5, color: C.ink, cursor: "pointer", ...body,
                      background: l === lang ? C.tealSoft : "#fff", fontWeight: l === lang ? 600 : 400,
                    }}>{l}</div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Patient Greeting */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <span style={{ ...body, fontSize: 13, opacity: 0.85 }}>{t.hello} </span>
              <span style={{ ...heading, fontSize: 18, fontWeight: 600 }}>{t.patientName}</span>
            </div>
            <span style={{ ...body, fontSize: 11.5, opacity: 0.75 }}>{t.patientId}: {PATIENT.id}</span>
          </div>
          <div style={{ ...body, fontSize: 12.5, opacity: 0.9, marginTop: 4 }}>{t.howCanWeHelp}</div>
        </div>
      </div>

      {/* Auto-Scrolling News Ticker Tabs */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-wrap { overflow: hidden; }
        .ticker-content {
          display: flex; gap: 10; width: max-content;
          animation: tickerScroll 10s linear infinite;
        }
        .ticker-content:hover { animation-play-state: paused; }
      `}</style>
      <div style={{ padding: "14px 0 0" }}>
        <div className="ticker-wrap" style={{ padding: "0 16px" }}>
          <div className="ticker-content">
            {[...Array(2)].flatMap((_, copy) => [
              { key: "aaji", label: t.aajiTab, screen: "aaji" },
              { key: "myths", label: t.mythsTab, screen: "myths" },
              { key: "outbreaks", label: t.outbreaksTab, screen: "outbreaks" },
            ].map((item) => (
              <button
                key={`${copy}-${item.key}`}
                onClick={() => go(item.screen)}
                style={{
                  flex: "0 0 auto", display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`,
                  background: C.surface, cursor: "pointer", ...body, fontSize: 13,
                  color: C.ink, fontWeight: 600, whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {item.label}
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: C.red, color: "#fff", fontSize: 9, fontWeight: 700,
                  padding: "2px 6px", borderRadius: 6, letterSpacing: 0.3,
                }}>NEW</span>
              </button>
            )))}
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <HomeTile icon={<Bot size={22} />} label={t.aiChecker} sub={t.aiCheckerSub}
            onClick={() => go("triage")} accent={C.teal} accentSoft={C.tealSoft} />
          <HomeTile icon={<Stethoscope size={22} />} label={t.consultDoctor} sub={t.consultDoctorSub}
            onClick={() => go("consultQueue")} accent={C.saffron} accentSoft={C.saffronSoft} />
          <HomeTile icon={<FileText size={22} />} label={t.healthRecords} sub={t.healthRecordsSub}
            onClick={() => go("records")} accent={C.tealDark} accentSoft={C.tealSoft} />
          <HomeTile icon={<Pill size={22} />} label={t.medicines} sub={t.medicinesSub}
            onClick={() => go("medicines")} accent={C.orange} accentSoft={C.orangeSoft} />
          <HomeTile icon={<Bell size={22} />} label={t.reminders} sub={t.remindersSub}
            onClick={() => go("reminders")} accent={C.green} accentSoft={C.greenSoft} />
          <HomeTile icon={<Ambulance size={22} />} label={t.emergency} sub={t.emergencySub}
            onClick={() => go("emergency")} accent={C.red} accentSoft={C.redSoft} />
        </div>
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ---------------------------------------------------------
   AI SYMPTOM CHECKER
--------------------------------------------------------- */
function TriageScreen({ go, backDest, t, lang }) {
  const [result, setResult] = useState(null);

  if (result) {
    const zInfo = t.zones[result.zone] || t.zones.yellow;
    const zColor = { yellow: C.yellow, orange: C.orange, red: C.red }[result.zone] || C.yellow;
    const zSoft = { yellow: C.yellowSoft, orange: C.orangeSoft, red: C.redSoft }[result.zone] || C.yellowSoft;
    const riskLevelText = { yellow: t.moderate, orange: t.high, red: t.critical }[result.zone] || t.moderate;
    const riskAdvice = { yellow: t.riskAdviceYellow, orange: t.riskAdviceOrange, red: t.riskAdviceRed }[result.zone] || t.riskAdviceYellow;

    const getDurationKey = (dur) => {
      if (!dur) return "today";
      if (dur.includes("today") || dur.includes("आज")) return "today";
      if (dur.includes("1") || dur.includes("१")) return "fewDays";
      if (dur.includes("3") || dur.includes("३") || dur.includes("week") || dur.includes("आठवड")) return "week";
      return "longTerm";
    };
    const durationKey = getDurationKey(result.answers.duration);
    const durationText = t.durationLabels?.[durationKey] || "";

    const activeRiskFactors = (result.riskFactors || []).filter(
      (rf) => t.riskFactorsLabels?.[rf.label]
    );

    return (
      <div>
        <TopBar title={t.aiChecker} onBack={() => go(backDest || "home")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Header Card: Symptom + Zone */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
              <Bot size={18} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 14 }}>{t.aiChecker}</span>
            </div>
            <div style={{ ...heading, fontWeight: 700, fontSize: 17, marginTop: 8, color: C.ink }}>
              {result.answers.symptom.label}
            </div>

            {/* Zone Badge */}
            <div style={{ background: zSoft, borderRadius: 12, padding: 14, marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: zColor, flexShrink: 0 }} />
                <span style={{ ...heading, fontWeight: 700, fontSize: 13.5, color: zColor }}>{zInfo.name}</span>
              </div>
              <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.6 }}>{zInfo.guidance}</div>
            </div>
          </Card>

          {/* Risk Score Meter */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: zColor }}>
              <ShieldCheck size={18} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 14 }}>{t.riskAssessment}</span>
            </div>

            {/* Risk Score Bar */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.riskScoreLabel}</span>
                <span style={{ ...heading, fontWeight: 700, fontSize: 14, color: zColor }}>{result.riskScore || 3}/10</span>
              </div>
              <div style={{ width: "100%", height: 8, borderRadius: 999, background: C.border, overflow: "hidden" }}>
                <div style={{
                  width: `${(result.riskScore || 3) * 10}%`, height: "100%", borderRadius: 999,
                  background: `linear-gradient(90deg, ${C.green}, ${zColor})`,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>

            {/* Risk Level Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <span style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.riskLevel}:</span>
              <span style={{
                background: zSoft, color: zColor, fontWeight: 700, fontSize: 12,
                padding: "4px 12px", borderRadius: 999, ...heading,
              }}>
                {riskLevelText}
              </span>
            </div>
          </Card>

          {/* Contributing Factors */}
          {activeRiskFactors.length > 0 && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.orange }}>
                <AlertTriangle size={17} />
                <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.contributingFactors}</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {activeRiskFactors.map((rf) => {
                  const sevColor = rf.severity === "high" ? C.red : C.orange;
                  const sevBg = rf.severity === "high" ? C.redSoft : C.orangeSoft;
                  return (
                    <div key={rf.label} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: sevBg, borderRadius: 10, padding: "10px 12px",
                    }}>
                      <span style={{ ...body, fontSize: 13, color: C.ink, fontWeight: 500 }}>
                        {t.riskFactorsLabels[rf.label]}
                      </span>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, color: sevColor,
                        background: "#fff", padding: "2px 8px", borderRadius: 999, ...heading,
                      }}>
                        {rf.severity === "high" ? t.high : t.moderate}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Symptom Duration */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
              <Clock size={17} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.durationImpact}</span>
            </div>
            <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.6 }}>
              <strong>{result.answers.duration || t.q2Opts[0]}:</strong> {durationText}
            </div>
          </Card>

          {/* What This Means */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
              <Activity size={17} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.whatThisMeans}</span>
            </div>
            <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.7 }}>
              {riskAdvice}
            </div>
          </Card>

          {/* Immediate Actions */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
              <CheckCircle size={17} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.immediateActions}</span>
            </div>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, ...body, fontSize: 13, color: C.ink, lineHeight: 1.8 }}>
              {result.zone === "yellow" && (
                <>
                  <li>{t.actionRestHydrate}</li>
                  <li>{t.actionMonitorTemp}</li>
                  <li>{t.actionRecordSymptoms}</li>
                </>
              )}
              {result.zone === "orange" && (
                <>
                  <li>{t.actionNoSelfMed}</li>
                  <li>{t.actionVisitOfficer}</li>
                  <li>{t.actionBringPrescriptions}</li>
                </>
              )}
              {result.zone === "red" && (
                <>
                  <li>{t.actionCallEmergency}</li>
                  <li>{t.actionDontWait}</li>
                  <li>{t.actionGoHospital}</li>
                </>
              )}
            </ul>
          </Card>

          {/* Warning Signs */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.orange }}>
              <AlertTriangle size={17} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.warningSignsTitle}</span>
            </div>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, ...body, fontSize: 13, color: C.ink, lineHeight: 1.8 }}>
              {t.warningSigns.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </Card>

          {/* AI Disclaimer */}
          <div style={{
            background: C.bg, border: `1px dashed ${C.border}`, borderRadius: 12,
            padding: 12, ...body, fontSize: 12, color: C.inkSoft, lineHeight: 1.7,
          }}>
            {t.aiDisclaimer}
          </div>

          {/* Emergency Button for Red Zone */}
          {result.zone === "red" && (
            <PrimaryButton color={C.red} icon={<Ambulance size={18} />} onClick={() => go("emergency", null, backDest)}>
              {t.emergencyHelpBtn}
            </PrimaryButton>
          )}

          {/* Back Button */}
          <PrimaryButton color={C.ink} onClick={() => go(backDest || "home")}>
            {backDest === "asha_home" ? "Back to ASHA Dashboard" : t.backToHome}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar title={t.aiChecker} onBack={() => go(backDest || "home")} />
      <SymptomQuestionnaire
        t={t}
        lang={lang}
        intro={t.aiDisclaimer}
        onFinish={(zone, answers, zoneResult) => setResult({ zone, answers, ...zoneResult })}
      />
    </div>
  );
}

/* ---------------------------------------------------------
   CONSULT DOCTOR
--------------------------------------------------------- */
function ConsultScreen({ go, backDest, t, lang }) {
  const [step, setStep] = useState("triage");
  const [zone, setZone] = useState("yellow");
  const [answers, setAnswers] = useState(null);
  const [queueLeft, setQueueLeft] = useState(3);
  const [waitLeft, setWaitLeft] = useState(15);
  const [rating, setRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [satisfaction, setSatisfaction] = useState(t.satOptions[0]);
  const [recommend, setRecommend] = useState(t.yes);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const doctor = DOCTORS[zone] || DOCTORS.yellow;
  const doctorRole = zone === "orange" ? t.moRole : t.choRole;
  const doctorNote = zone === "orange" ? t.moNote : t.choNote;
  const zInfo = t.zones[zone] || t.zones.yellow;
  const zColor = { yellow: C.yellow, orange: C.orange, red: C.red }[zone] || C.yellow;
  const zSoft = { yellow: C.yellowSoft, orange: C.orangeSoft, red: C.redSoft }[zone] || C.yellowSoft;

  const handleFinishTriage = (finalZone, finalAnswers, zoneResult) => {
    setAnswers(finalAnswers);
    if (finalZone === "red") { go("emergency", null, backDest); return; }
    setZone(finalZone);
    setStep("analysis");
  };

  const startQueue = () => {
    setQueueLeft(3);
    setWaitLeft(15);
    setStep("queue");
  };

  useEffect(() => {
    if (step !== "queue") return;
    const timer = setInterval(() => {
      setQueueLeft((q) => Math.max(0, q - 1));
      setWaitLeft((w) => Math.max(0, w - 5));
    }, 1100);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step === "queue" && queueLeft === 0 && waitLeft === 0) {
      const timer = setTimeout(() => setStep("ready"), 900);
      return () => clearTimeout(timer);
    }
  }, [step, queueLeft, waitLeft]);

  if (step === "triage") {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={t.consultDoctor} onBack={() => go(backDest || "home")} />
        <SymptomQuestionnaire
          t={t}
          lang={lang}
          intro={t.aiDisclaimer}
          onFinish={handleFinishTriage}
        />
      </div>
    );
  }

  if (step === "analysis") {
    return (
      <div>
        <TopBar title={t.consultDoctor} onBack={() => go(backDest || "home")} />
        <div style={{ padding: 16 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
              <Bot size={18} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 14 }}>{t.prelimAnalysis}</span>
            </div>
            <div style={{ ...heading, fontWeight: 700, fontSize: 17, marginTop: 8, color: C.ink }}>
              {answers?.symptom?.label}
            </div>

            <div style={{ background: zSoft, borderRadius: 12, padding: 14, marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: zColor, flexShrink: 0 }} />
                <span style={{ ...heading, fontWeight: 700, fontSize: 13.5, color: zColor }}>{zInfo.name}</span>
              </div>
              <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.6 }}>{zInfo.guidance}</div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginBottom: 6 }}>{t.recommendedDoctor}</div>
              <div style={{
                background: C.tealSoft, borderRadius: 12, padding: 12,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <Stethoscope size={18} color={C.teal} />
                <div>
                  <div style={{ ...heading, fontWeight: 600, fontSize: 13.5, color: C.tealDark }}>{doctorRole}</div>
                  <div style={{ ...body, fontSize: 11.5, color: C.inkSoft }}>{doctorNote}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginBottom: 6 }}>{t.aiRecommendations}</div>
              <ul style={{ margin: 0, paddingLeft: 18, ...body, fontSize: 13, color: C.ink, lineHeight: 1.7 }}>
                {t.recsList.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>

            <div style={{ ...body, fontSize: 12.5, color: C.ink, marginTop: 16 }}>
              {t.recommendConsultMsg}
            </div>

            <div style={{ marginTop: 12 }}>
              <PrimaryButton onClick={startQueue} color={zone === "orange" ? C.orange : C.teal}>
                {t.startConsultWith} {doctorRole}
              </PrimaryButton>
            </div>
          </Card>
          <div style={{ ...body, fontSize: 11, color: C.inkSoft, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
            {t.aiUrgencyDisclaimer}
          </div>
        </div>
      </div>
    );
  }

  if (step === "queue") {
    return (
      <div>
        <TopBar title={t.consultDoctor} onBack={() => go("home")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ textAlign: "center" }}>
            <Clock size={20} color={C.inkSoft} style={{ margin: "0 auto" }} />
            <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginTop: 8 }}>{t.inQueue}</div>
            <div style={{ ...heading, fontSize: 40, fontWeight: 700, color: C.ink, marginTop: 4 }}>{queueLeft}</div>
            <div style={{ ...body, fontSize: 12.5, color: C.inkSoft }}>{t.patientsAhead}</div>
            <div style={{ ...heading, fontSize: 22, fontWeight: 600, color: C.ink, marginTop: 14 }}>{waitLeft} {t.mins}</div>
            <div style={{ ...body, fontSize: 12.5, color: C.inkSoft }}>{t.estWaitTime}</div>
            <div style={{ marginTop: 12 }}><ZoneBadge zone={zone} t={t} /></div>
          </Card>

          <Card>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 8 }}>{t.assignedDoctor}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", background: C.tealSoft,
                display: "flex", alignItems: "center", justifyContent: "center", color: C.teal,
              }}><User size={22} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ ...heading, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{doctor.name}</div>
                <div style={{ ...body, fontSize: 12.5, color: C.inkSoft }}>{doctorRole}</div>
              </div>
              <span style={{ ...body, fontSize: 11, color: C.green, background: C.greenSoft, padding: "3px 9px", borderRadius: 999, fontWeight: 600, whiteSpace: "nowrap" }}>
                {t.available}
              </span>
            </div>
          </Card>

          <Card>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 8 }}>{t.consultDetails}</div>
            <div style={{ ...body, fontSize: 13, color: C.ink }}>
              <strong>{t.symptomLabel}:</strong> {answers?.symptom?.label}
            </div>
            <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 4 }}>
              <strong>{t.prelimAnalysis}:</strong> {zInfo.name}
            </div>
          </Card>

          <div style={{ ...body, fontSize: 12, color: C.inkSoft, textAlign: "center" }}>
            {queueLeft === 0 && waitLeft === 0 ? t.gettingReady : t.pleaseWaitQueue}
          </div>
        </div>
      </div>
    );
  }

  if (step === "ready") {
    return (
      <div>
        <TopBar title={t.consultDoctor} onBack={() => go("home")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...heading, fontWeight: 600, fontSize: 15, color: C.ink, textAlign: "center", marginTop: 8 }}>
            {t.startConsultWith} {doctorRole}
          </div>
          <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "28px 16px" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: C.tealSoft,
              display: "flex", alignItems: "center", justifyContent: "center", color: C.teal,
            }}>
              <Video size={28} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontWeight: 600, fontSize: 15, color: C.ink }}>{t.connectingToDoctor}</div>
              <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>{t.pleaseWaitConnect}</div>
            </div>
          </Card>
          <PrimaryButton onClick={() => setStep("call")}>{t.startConsultationBtn}</PrimaryButton>
        </div>
      </div>
    );
  }

  if (step === "call") {
    return <FullScreenCall doctor={doctor} doctorRole={doctorRole} t={t} onEnd={() => setStep("complete")} />;
  }

  if (step === "complete") {
    const rx = RECORDS.prescriptions[0];
    return (
      <div>
        <TopBar title={t.consultDoctor} onBack={() => go("home")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ textAlign: "center", background: C.greenSoft, border: "none" }}>
            <Check size={26} color={C.green} style={{ margin: "0 auto" }} />
            <div style={{ ...heading, fontWeight: 600, fontSize: 15, color: C.ink, marginTop: 8 }}>
              {t.consultComplete}
            </div>
            <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>
              {t.consultCompleteMsg} ({doctor.name})
            </div>
          </Card>

          <Card>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 6 }}>{t.diagnosis}</div>
            <div style={{ ...body, fontSize: 13.5, color: C.ink }}>{t.diagnosisMsg}</div>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft, margin: "14px 0 8px" }}>{t.prescribedMeds}</div>
            {rx.items.map((it) => (
              <div key={it.name} style={{ padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
                <div style={{ ...heading, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{it.name}</div>
                <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{it.dose}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => showToast(t.prescriptionDownloaded)} style={secondaryBtn}><Download size={14} /> {t.downloadPrescription}</button>
              <button onClick={() => go("freshReferral", { doctor, symptom: answers?.symptom?.label })} style={secondaryBtn}>
                <FileText size={14} /> {t.viewReferral}
              </button>
            </div>
          </Card>

          <PrimaryButton onClick={() => setStep("feedback1")}>{t.rateConsultation}</PrimaryButton>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
            background: C.teal, color: "#fff", padding: "12px 24px", borderRadius: 12,
            ...heading, fontSize: 13, fontWeight: 600, zIndex: 9999,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <CheckCircle size={16} /> {toast}
          </div>
        )}
      </div>
    );
  }

  if (step === "feedback1") {
    return (
      <div>
        <TopBar title={t.doctorFeedback} onBack={() => setStep("complete")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
              <Star size={17} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 14 }}>{t.rateTheDoctor}</span>
            </div>
            <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, margin: "10px 0 6px" }}>
              {t.overallRatingFor} {doctor.name}
            </div>
            <StarRow value={rating} onChange={setRating} color={C.saffron} />
            <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, margin: "16px 0 6px" }}>
              {t.commExplanation}
            </div>
            <StarRow value={commRating} onChange={setCommRating} color={C.teal} />
            <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, margin: "16px 0 8px" }}>
              {t.satisfactionTreatment}
            </div>
            {t.satOptions.map((opt) => (
              <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
                <input type="radio" checked={satisfaction === opt} onChange={() => setSatisfaction(opt)} />
                <span style={{ ...body, fontSize: 13, color: C.ink }}>{opt}</span>
              </label>
            ))}
          </Card>
          <PrimaryButton onClick={() => setStep("feedback2")}>{t.continueBtn}</PrimaryButton>
        </div>
      </div>
    );
  }

  if (step === "feedback2") {
    return (
      <div>
        <TopBar title={t.doctorFeedback} onBack={() => setStep("feedback1")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
              <Check size={17} />
              <span style={{ ...heading, fontWeight: 600, fontSize: 14 }}>{t.additionalFeedback}</span>
            </div>
            <div style={{ ...body, fontSize: 13, color: C.ink, margin: "14px 0 8px" }}>{t.recommendDoctorQuestion}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setRecommend(t.yes)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: recommend === t.yes ? C.green : "#fff", color: recommend === t.yes ? "#fff" : C.ink,
                border: `1px solid ${recommend === t.yes ? C.green : C.border}`, borderRadius: 10, padding: "10px 0",
                fontSize: 13, ...body, cursor: "pointer",
              }}><Check size={14} /> {t.yes}</button>
              <button onClick={() => setRecommend(t.no)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: recommend === t.no ? C.red : "#fff", color: recommend === t.no ? "#fff" : C.ink,
                border: `1px solid ${recommend === t.no ? C.red : C.border}`, borderRadius: 10, padding: "10px 0",
                fontSize: 13, ...body, cursor: "pointer",
              }}><AlertTriangle size={14} /> {t.no}</button>
            </div>
            <div style={{ ...body, fontSize: 13, color: C.ink, margin: "16px 0 8px" }}>{t.shareExperience}</div>
            <textarea placeholder={t.textareaPlaceholder} rows={3} style={{
              width: "100%", border: `1px solid ${C.border}`, borderRadius: 10, padding: 10,
              fontSize: 13, ...body, resize: "none", boxSizing: "border-box",
            }} />
            <div style={{ background: C.tealSoft, borderRadius: 10, padding: 12, marginTop: 14, fontSize: 12.5, ...body, color: C.ink, lineHeight: 1.8 }}>
              <strong>{t.ratingSummary}</strong><br />
              {t.overall}: {rating}/5 · {t.comm}: {commRating}/5<br />
              {t.treatmentSat}: {satisfaction} · {t.recommendText}: {recommend}
            </div>
          </Card>
          <PrimaryButton onClick={() => setStep("done")}>{t.submitFeedback}</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={t.doctorFeedback} onBack={() => go("home")} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 14, padding: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={30} color={C.green} />
        </div>
        <div style={{ ...heading, fontWeight: 600, fontSize: 16, color: C.ink }}>{t.thankYou}</div>
        <div style={{ ...body, fontSize: 13, color: C.inkSoft, textAlign: "center", maxWidth: 240 }}>
          {t.feedbackAppreciated}
        </div>
        <PrimaryButton style={{ marginTop: 10, width: 200 }} onClick={() => go("home")}>{t.backToHome}</PrimaryButton>
      </div>
    </div>
  );
}

function StarRow({ value, onChange, color }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={24} onClick={() => onChange(n)} fill={n <= value ? color : "none"}
          color={n <= value ? color : C.border} style={{ cursor: "pointer" }} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   FULL-SCREEN CALL
--------------------------------------------------------- */
function FullScreenCall({ doctor, doctorRole, t, onEnd }) {
  const [seconds, setSeconds] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: "doctor", text: `Hello! I am ${doctor.name}. How can I help you today?`, time: "10:30 AM" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setChatMessages([...chatMessages, { id: Date.now(), from: "patient", text: chatInput.trim(), time: timeStr }]);
    setChatInput("");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 1000,
      background: "#150F27", display: "flex", flexDirection: "column",
    }}>
      <div style={{
        padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "#fff", background: "rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: "#4ADE80" }} />
          <span style={{ ...body, fontSize: 12.5 }}>{mm}:{ss} · {t.goodConnection}</span>
        </div>
        <Maximize2 size={16} style={{ opacity: 0.7 }} />
      </div>

      <div style={{
        flex: 1, background: "linear-gradient(160deg,#4C3B8F,#150F27)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 18, right: 18, width: 88, height: 118, borderRadius: 14,
          background: "linear-gradient(160deg,#3F8F5F,#0B6B58)", display: "flex",
          alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}>
          {camOn ? <Camera size={22} /> : <VideoOff size={22} />}
        </div>

        <div style={{
          width: 120, height: 120, borderRadius: "50%", background: C.teal, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, ...heading,
        }}>{doctor.initial}</div>
        <div style={{ ...heading, color: "#fff", fontWeight: 600, fontSize: 19 }}>{doctor.name}</div>
        <div style={{ ...body, color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{doctorRole}</div>
      </div>

      {chatOpen && (
        <div style={{
          position: "absolute", right: 0, bottom: 0, left: 0, top: 0,
          background: "#ECE5DD", display: "flex", flexDirection: "column", zIndex: 10,
        }}>
          {/* Chat Header */}
          <div style={{ background: "#075E54", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
              <ChevronLeft size={20} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", ...heading, fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {doctor.initial}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...heading, fontWeight: 600, fontSize: 14, color: "#fff" }}>{doctor.name}</div>
              <div style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>online</div>
            </div>
            <Volume2 size={18} color="rgba(255,255,255,0.8)" style={{ cursor: "pointer" }} />
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {chatMessages.map((msg) => {
              const isDoc = msg.from === "doctor";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isDoc ? "flex-start" : "flex-end" }}>
                  <div style={{
                    maxWidth: "78%", borderRadius: 10, padding: "8px 10px",
                    background: isDoc ? "#FFFFFF" : "#DCF8C6",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                  }}>
                    <div style={{ ...body, fontSize: 13.5, color: "#303030", lineHeight: 1.45 }}>{msg.text}</div>
                    <div style={{ ...body, fontSize: 10, color: "#999", textAlign: "right", marginTop: 3 }}>{msg.time} {isDoc ? "" : "✓✓"}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div style={{ background: "#F0F0F0", padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </button>
            <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Camera size={20} />
            </button>
            <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Type a message"
              style={{
                flex: 1, border: "none", borderRadius: 20, padding: "10px 14px",
                fontSize: 14, ...body, outline: "none", background: "#fff",
              }}
            />
            <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Mic size={20} />
            </button>
            <button onClick={sendMessage} style={{
              width: 40, height: 40, borderRadius: "50%", background: "#075E54",
              border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: "20px 16px 34px", display: "flex", justifyContent: "center", gap: 16, background: "#1F2937" }}>
        <button onClick={() => setMicOn(!micOn)} style={callBtn(micOn ? "rgba(255,255,255,0.14)" : C.red)}>
          {micOn ? <Mic size={19} /> : <MicOff size={19} />}
        </button>
        <button onClick={() => setCamOn(!camOn)} style={callBtn(camOn ? "rgba(255,255,255,0.14)" : C.red)}>
          {camOn ? <Video size={19} /> : <VideoOff size={19} />}
        </button>
        <button onClick={() => setChatOpen(!chatOpen)} style={callBtn(chatOpen ? C.teal : "rgba(255,255,255,0.14)")}>
          <MessageCircle size={19} />
        </button>
        <button style={callBtn("rgba(255,255,255,0.14)")}>
          <Volume2 size={19} />
        </button>
        <button onClick={onEnd} style={callBtn(C.red)}>
          <PhoneOff size={19} />
        </button>
      </div>
    </div>
  );
}

function callBtn(bg) {
  return {
    width: 50, height: 50, borderRadius: "50%", background: bg,
    border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  };
}

/* ---------------------------------------------------------
   HEALTH RECORDS
--------------------------------------------------------- */
function RecordsScreen({ go, backDest, detail, t }) {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  if (detail === "prescriptions") {
    const rx = RECORDS.prescriptions[0];
    return (
      <div>
        <TopBar title={t.prescriptions} onBack={() => go("records")} />
        <div style={{ padding: 16 }}>
          <Card>
            <div style={{ ...heading, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{rx.doctor}</div>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 10 }}>{rx.date}</div>
            {rx.items.map((it) => (
              <div key={it.name} style={{ background: C.tealSoft, borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ ...heading, fontWeight: 600, fontSize: 13.5, color: C.tealDark }}>{it.name}</div>
                <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{it.dose}</div>
              </div>
            ))}
            <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 6 }}>{t.doctorAdviceNote}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => showToast(t.prescriptionDownloaded)} style={secondaryBtn}><Download size={14} /> {t.download}</button>
              <button onClick={() => showToast(t.prescriptionShared)} style={secondaryBtn}><Share2 size={14} /> {t.share}</button>
            </div>
          </Card>
        </div>
        {toast && (
          <div style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
            background: C.teal, color: "#fff", padding: "12px 24px", borderRadius: 12,
            ...heading, fontSize: 13, fontWeight: 600, zIndex: 9999,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <CheckCircle size={16} /> {toast}
          </div>
        )}
      </div>
    );
  }

  if (detail === "referrals") {
    return (
      <div>
        <TopBar title={t.referrals} onBack={() => go("records")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          {RECORDS.referrals.map((r, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ ...heading, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{t.referralStatus}</span>
                <span style={{
                  background: r.statusKey === "completed" ? C.greenSoft : C.yellowSoft,
                  color: r.statusKey === "completed" ? C.green : C.yellow,
                  fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                }}>{r.statusKey === "completed" ? t.completed : t.pending}</span>
              </div>
              <div style={{ marginTop: 14, ...body, fontSize: 13, color: C.ink, lineHeight: 2 }}>
                <Row label={t.referredBy} value={r.refBy} />
                <Row label={t.referredTo} value={r.refTo} />
                <Row label={t.specialist} value={r.specialist} />
                <Row label={t.reason} value={r.reason} />
                <Row label={t.date} value={r.date} />
              </div>
              <Card style={{ marginTop: 14, border: "none", boxShadow: "none", padding: 0 }}>
                <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 10 }}>{t.timeline}</div>
                {r.timelineKeys.map((tk, i2) => (
                  <div key={tk.labelKey} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", background: C.green, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}><Check size={12} /></div>
                      {i2 < r.timelineKeys.length - 1 && <div style={{ width: 2, height: 30, background: C.border }} />}
                    </div>
                    <div style={{ paddingBottom: 14 }}>
                      <div style={{ ...heading, fontWeight: 600, fontSize: 13, color: C.ink }}>{t[tk.labelKey]}</div>
                      <div style={{ ...body, fontSize: 11.5, color: C.inkSoft }}>{tk.date}</div>
                    </div>
                  </div>
                ))}
              </Card>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (detail === "consultations") {
    return (
      <div>
        <TopBar title={t.consultations} onBack={() => go("records")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {RECORDS.consultations.map((c, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ ...heading, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{c.doctor}</span>
                <span style={{ ...body, fontSize: 11.5, color: C.inkSoft }}>{c.date}</span>
              </div>
              <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>{c.note}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (detail === "diagnostics") {
    return (
      <div>
        <TopBar title={t.diagnostics} onBack={() => go("records")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {RECORDS.diagnostics.map((d, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ ...heading, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{d.name}</span>
                <span style={{ background: C.greenSoft, color: C.green, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>{d.status}</span>
              </div>
              <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginTop: 4 }}>{d.facility} · {d.date}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={t.myHealthRecords} onBack={() => go(backDest || "home")} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { key: "consultations", label: t.consultations, icon: Stethoscope },
          { key: "prescriptions", label: t.prescriptions, icon: FileText },
          { key: "referrals", label: t.referrals, icon: Activity },
          { key: "diagnostics", label: t.diagnostics, icon: ClipboardList },
        ].map(({ key, label, icon: Icon }) => (
          <Card key={key} onClick={() => go("recordDetail", key)} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.tealSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal }}>
              <Icon size={18} />
            </div>
            <span style={{ flex: 1, ...heading, fontWeight: 600, fontSize: 14, color: C.ink }}>{label}</span>
            <ChevronRight size={17} color={C.inkSoft} />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* Fresh referral shown right after a call ends */
function FreshReferralScreen({ go, meta, t }) {
  const today = "2 Sep 2026";
  return (
    <div>
      <TopBar title={t.referrals} onBack={() => go("home")} />
      <div style={{ padding: 16 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...heading, fontWeight: 600, fontSize: 14.5, color: C.ink }}>{t.referralStatus}</span>
            <span style={{ background: C.yellowSoft, color: C.yellow, fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{t.pending}</span>
          </div>
          <div style={{ marginTop: 14, ...body, fontSize: 13, color: C.ink, lineHeight: 2 }}>
            <Row label={t.referredBy} value={meta?.doctor?.name || t.defaultDoctor} />
            <Row label={t.referredTo} value="PHC Nandgaon" />
            <Row label={t.reason} value={meta?.symptom || t.generalConsultation} />
            <Row label={t.date} value={today} />
          </div>
        </Card>
        <Card style={{ marginTop: 14 }}>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 10 }}>{t.timeline}</div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: C.green, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}><Check size={12} /></div>
            </div>
            <div>
              <div style={{ ...heading, fontWeight: 600, fontSize: 13, color: C.ink }}>{t.referralCreated}</div>
              <div style={{ ...body, fontSize: 11.5, color: C.inkSoft }}>{today}</div>
            </div>
          </div>
          <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 12 }}>
            {t.nextStepsNote}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
      <span style={{ color: C.inkSoft }}>{label}</span>
      <span style={{ fontWeight: 600, color: C.ink, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

const secondaryBtn = {
  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  border: `1px solid ${C.border}`, background: "#fff", borderRadius: 10, padding: "10px 0",
  fontSize: 12.5, color: C.ink, ...body, cursor: "pointer",
};

/* ---------------------------------------------------------
   MEDICINES
--------------------------------------------------------- */
function MedicinesScreen({ go, backDest, t }) {
  const [q, setQ] = useState("");
  const filtered = MEDICINES.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <TopBar title={t.medicineAvailability} onBack={() => go(backDest || "home")} />
      <div style={{ padding: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, background: C.surface,
          border: `1px solid ${C.border}`, borderRadius: 999, padding: "10px 14px", marginBottom: 14,
        }}>
          <Search size={16} color={C.inkSoft} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchMedicine}
            style={{ border: "none", outline: "none", flex: 1, fontSize: 13.5, ...body }} />
        </div>
        {filtered.map((m) => (
          <Card key={m.name} style={{ marginBottom: 10 }}>
            <div style={{ ...heading, fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 8 }}>{m.name}</div>
            {m.stock.map((s) => (
              <div key={s.facility} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: `1px solid ${C.border}` }}>
                <span style={{ ...body, fontSize: 12.5, color: C.ink }}>{s.facility}</span>
                <span style={{ ...body, fontSize: 11.5, fontWeight: 700, color: s.available ? C.green : C.red }}>
                  {s.available ? `● ${t.inStock}` : `● ${t.outOfStock}`}
                </span>
              </div>
            ))}
          </Card>
        ))}
        <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, textAlign: "center", marginTop: 10 }}>
          {t.stockUpdated}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   REMINDERS
--------------------------------------------------------- */
function RemindersScreen({ go, t }) {
  const [reminders, setReminders] = useState([
    { name: "Paracetamol 500mg", desc: "After food", time: "9:00 PM", enabled: true },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");

  const add = () => {
    if (!name.trim()) return;
    setReminders([...reminders, { name, desc, time: time || "9:00 PM", enabled: true }]);
    setName(""); setDesc(""); setTime(""); setShowForm(false);
  };

  return (
    <div>
      <TopBar title={t.medicineReminders} onBack={() => go("home")}
        right={<button onClick={() => setShowForm(true)} style={iconBtnStyle(true)}><Plus size={18} /></button>} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {reminders.map((r, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.saffronSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.saffron }}>
              <Bell size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...heading, fontWeight: 600, fontSize: 13.5, color: C.ink }}>{r.name}</div>
              <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{r.desc || "—"} · {r.time}</div>
            </div>
            <input type="checkbox" checked={r.enabled} onChange={() => {
              const copy = [...reminders]; copy[i].enabled = !copy[i].enabled; setReminders(copy);
            }} />
          </Card>
        ))}
        {reminders.length === 0 && (
          <div style={{ ...body, fontSize: 13, color: C.inkSoft, textAlign: "center", marginTop: 40 }}>
            {t.noRemindersMsg}
          </div>
        )}
      </div>

      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(22,48,42,0.45)", display: "flex",
          alignItems: "flex-end", zIndex: 30,
        }} onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fff", width: "100%", borderRadius: "20px 20px 0 0", padding: 20,
            maxWidth: 480, margin: "0 auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ ...heading, fontWeight: 600, fontSize: 16, color: C.ink }}>{t.addMedication}</span>
              <button onClick={() => setShowForm(false)} style={iconBtnStyle(false)}><X size={16} /></button>
            </div>
            <Field label={t.medNameLabel} value={name} onChange={setName} placeholder={t.phMedName} />
            <Field label={t.descLabel} value={desc} onChange={setDesc} placeholder={t.phDesc} />
            <Field label={t.timeLabel} value={time} onChange={setTime} placeholder={t.phTime} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowForm(false)} style={{ ...secondaryBtn, padding: "12px 0" }}>{t.cancelBtn}</button>
              <div style={{ flex: 1 }}><PrimaryButton onClick={add}>{t.addBtn}</PrimaryButton></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
        width: "100%", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px",
        fontSize: 13.5, ...body, boxSizing: "border-box", outline: "none",
      }} />
    </div>
  );
}

/* ---------------------------------------------------------
   PHONE CALL SCREEN — Audio-file-based IVR
--------------------------------------------------------- */
function PhoneCallScreen({ t, go, callType, onBack }) {
  const [state, setState] = useState("CALLING");
  const [timer, setTimer] = useState(0);
  const [ivrStatus, setIvrStatus] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [optionsReady, setOptionsReady] = useState(false);
  const stateRef = useRef("CALLING");
  const timerRef = useRef(null);
  const connectTimeoutRef = useRef(null);
  const audioLockRef = useRef(false);

  const callConfigMap = {
    ambulance: { title: t.call108Title, sub: t.call108Sub, number: "108", color: C.red, icon: Ambulance },
    asha: { title: t.callAshaTitle, sub: t.callAshaWorker, number: "", color: C.saffron, icon: User },
    healthcare: { title: t.callHealthTitle, sub: t.callHealthcareCentre, number: "", color: C.teal, icon: PhoneCall },
  };
  const cfg = callConfigMap[callType] || callConfigMap.ambulance;

  useEffect(() => { stateRef.current = state; }, [state]);

  const clearAllTimers = () => {
    clearTimeout(connectTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - start) / 1000));
    }, 500);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const endCall = () => {
    stopCurrentAudio();
    clearAllTimers();
    audioLockRef.current = false;
    setState("CALL_ENDED");
  };

  const goBack = () => {
    stopCurrentAudio();
    clearAllTimers();
    audioLockRef.current = false;
    onBack();
  };

  // --- ASHA IVR: Play Voice 1, then enable options ---
  useEffect(() => {
    if (callType !== "asha") return;

    connectTimeoutRef.current = setTimeout(() => {
      setState("CONNECTED");
      startTimer();
      setAudioPlaying(true);
      audioLockRef.current = true;

      playVoice("welcome").then(() => {
        setAudioPlaying(false);
        setOptionsReady(true);
        audioLockRef.current = false;
        setState("IVR_MAIN_MENU");
      });
    }, CONNECTION_DELAY);

    return () => { clearAllTimers(); stopCurrentAudio(); audioLockRef.current = false; };
  }, []);

  // --- 108 / Healthcare: simple connected screen ---
  useEffect(() => {
    if (callType === "asha") return;

    connectTimeoutRef.current = setTimeout(() => {
      setState("CONNECTED");
      startTimer();
    }, CONNECTION_DELAY);

    return () => { clearAllTimers(); stopCurrentAudio(); };
  }, []);

  // --- Handle IVR keypress ---
  const handleIvrInput = (key) => {
    if (audioLockRef.current) return;
    const currentState = stateRef.current;
    if (currentState !== "IVR_MAIN_MENU") return;

    if (key === "1") {
      audioLockRef.current = true;
      setAudioPlaying(true);
      setOptionsReady(false);
      setState("CONNECTING_ASHA");
      stopCurrentAudio();

      playVoice("asha").then(() => {
        setAudioPlaying(false);
        audioLockRef.current = false;
        setIvrStatus(t.callAshaAssistActive);
        setState("ASHA_CONNECTED");
      });
    } else if (key === "2") {
      audioLockRef.current = true;
      setAudioPlaying(true);
      setOptionsReady(false);
      setState("CONNECTING_CHO");
      stopCurrentAudio();

      playVoice("emergency").then(() => {
        setAudioPlaying(false);
        audioLockRef.current = false;
        setState("EMERGENCY_CONNECTED");
      });
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (audioLockRef.current) return;
      const st = stateRef.current;
      if (st === "IVR_MAIN_MENU" && (e.key === "1" || e.key === "2")) {
        handleIvrInput(e.key);
      }
      if (e.key === "Escape") endCall();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const isIvrActive = state === "IVR_MAIN_MENU" && optionsReady;

  // ---- CALL ENDED ----
  if (state === "CALL_ENDED") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#1a1a2e", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "system-ui, sans-serif", padding: 24,
      }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <PhoneOff size={28} color="#fff" />
        </div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{t.callEnded}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 6 }}>{t.callDuration}: {formatTime(timer)}</div>
        {ivrStatus && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 20, textAlign: "center" }}>{ivrStatus}</div>}
        <button onClick={goBack} style={{
          padding: "14px 36px", borderRadius: 14, background: C.teal, color: "#fff",
          border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>{t.callBackToEmergency}</button>
      </div>
    );
  }

  // ---- ASHA CONNECTED (after Voice 2 finishes) ----
  if (state === "ASHA_CONNECTED") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#1a1a2e", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "system-ui, sans-serif", padding: 24,
      }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.saffron}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <User size={30} color={C.saffron} />
        </div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{t.callAshaWorker}</div>
        <div style={{ color: C.saffron, fontSize: 13, marginTop: 6 }}>🟢 {t.callConnected}</div>
        <div style={{ color: "#fff", fontSize: 32, fontWeight: 300, marginTop: 16, letterSpacing: 2 }}>{formatTime(timer)}</div>
        {ivrStatus && <div style={{ color: "#8FE6A0", fontSize: 12, marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(63,143,95,0.15)", border: "1px solid rgba(63,143,95,0.3)" }}>{ivrStatus}</div>}
        <button onClick={endCall} style={{
          marginTop: 30, width: "100%", maxWidth: 300, padding: "16px", borderRadius: 14, background: C.red,
          color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <PhoneOff size={18} /> {t.callEndCall}
        </button>
      </div>
    );
  }

  // ---- EMERGENCY CONNECTED (after Voice 3 finishes) ----
  if (state === "EMERGENCY_CONNECTED") {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#1a1a2e", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "system-ui, sans-serif", padding: 24,
      }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.red}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <Ambulance size={30} color={C.red} />
        </div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{t.call108Title}</div>
        <div style={{ color: C.red, fontSize: 13, marginTop: 6 }}>🟢 {t.callConnected}</div>
        <div style={{ color: "#fff", fontSize: 32, fontWeight: 300, marginTop: 16, letterSpacing: 2 }}>{formatTime(timer)}</div>
        <button onClick={endCall} style={{
          marginTop: 30, width: "100%", maxWidth: 300, padding: "16px", borderRadius: 14, background: C.red,
          color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <PhoneOff size={18} /> {t.callEndCall}
        </button>
      </div>
    );
  }

  // ---- ACTIVE CALL (IVR or waiting) ----
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#1a1a2e", zIndex: 9999,
      display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif",
      overflow: "hidden",
    }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "50px 24px 0", textAlign: "center", flexShrink: 0 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${cfg.color}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <cfg.icon size={30} color={cfg.color} />
          </div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{cfg.title}</div>
          {cfg.number && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 }}>{cfg.number}</div>}
          <div style={{ color: cfg.color, fontSize: 13, marginTop: 8, fontWeight: 500 }}>
            {state === "CALLING" && t.callConnecting}
            {state === "CONNECTED" && t.callConnected}
            {state === "IVR_MAIN_MENU" && t.callConnected}
            {state === "CONNECTING_ASHA" && `${t.callAshaWorker}...`}
            {state === "CONNECTING_CHO" && `${t.call108Title}...`}
          </div>
          {state !== "CALLING" && (
            <div style={{ color: "#fff", fontSize: 32, fontWeight: 300, marginTop: 12, letterSpacing: 2 }}>{formatTime(timer)}</div>
          )}
        </div>

        {/* Phone dial pad — shown after Voice 1 finishes */}
        {isIvrActive && !audioPlaying && (
          <div style={{ padding: "12px 24px", flexShrink: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 300, margin: "0 auto" }}>
              {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
                <button key={k} onClick={() => handleIvrInput(k)} disabled={audioLockRef.current} style={{
                  aspectRatio: "1", borderRadius: "50%", width: "100%", maxWidth: 72,
                  margin: "0 auto",
                  background: "rgba(255,255,255,0.08)", border: "none",
                  color: "#fff", fontSize: 22, fontWeight: 400,
                  cursor: audioLockRef.current ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: audioLockRef.current ? 0.4 : 1,
                  transition: "opacity 0.15s",
                }}>
                  {k}
                </button>
              ))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textAlign: "center", marginTop: 14 }}>
              {t.callIvrInstructions}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div style={{ flexShrink: 0, padding: "12px 24px 24px", background: "#1a1a2e" }}>
        <button onClick={endCall} style={{
          width: "100%", padding: "16px", borderRadius: 14, background: C.red,
          color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <PhoneOff size={18} /> {t.callEndCall}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   EMERGENCY
--------------------------------------------------------- */
function EmergencyScreen({ go, backDest, t }) {
  const [callScreen, setCallScreen] = useState(null);

  if (callScreen) {
    return <PhoneCallScreen t={t} go={go} callType={callScreen} onBack={() => setCallScreen(null)} />;
  }

  return (
    <div>
      <TopBar title={t.emergencyTitle} onBack={() => go(backDest || "home")} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ background: C.redSoft, border: "none", textAlign: "center" }}>
          <AlertTriangle size={26} color={C.red} style={{ margin: "0 auto" }} />
          <div style={{ ...heading, fontWeight: 600, fontSize: 14.5, color: C.red, marginTop: 8 }}>
            {t.emergencyWarning}
          </div>
        </Card>

        <button onClick={() => setCallScreen("ambulance")} style={emergencyBtn(C.red)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Ambulance size={22} /> <span>{t.callAmbulance}</span>
          </div>
          <ChevronRight size={18} />
        </button>

        <button onClick={() => setCallScreen("asha")} style={emergencyBtn(C.saffron)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <User size={22} /> <span>{t.ashaWorker}</span>
          </div>
          <ChevronRight size={18} />
        </button>

        <button onClick={() => setCallScreen("healthcare")} style={emergencyBtn(C.teal)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <PhoneCall size={22} /> <span>{t.callHealthCentre}</span>
          </div>
          <ChevronRight size={18} />
        </button>

        <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, textAlign: "center", marginTop: 6, lineHeight: 1.7 }}>
          {t.emergencyDisclaimer}
        </div>
      </div>
    </div>
  );
}

function emergencyBtn(color) {
  return {
    background: "#fff", border: `1.5px solid ${color}33`, borderRadius: 14, padding: "16px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
    color, ...heading, fontWeight: 600, fontSize: 14.5, width: "100%",
  };
}

/* ---------------------------------------------------------
   PROFILE
--------------------------------------------------------- */
function ProfileScreen({ go, lang, setLang, t, isAshaAssisted }) {
  const [section, setSection] = useState("main");

  const personalData = [
    { label: t.profileName, value: "रमेश पाटील / Ramesh Patil" },
    { label: t.profileDob, value: "15/06/1978" },
    { label: t.profileAge, value: lang === "English" ? "48 years" : lang === "मराठी" ? "४८ वर्षे" : "48 वर्ष" },
    { label: t.profileGender, value: t.profileMale },
    { label: t.profileMobile, value: "+91-9876543210" },
    { label: t.profileEmail, value: "ramesh.patil@email.com" },
    { label: t.profileAbhaId, value: "1234-5678-9012-3456" },
    { label: t.profileBloodGroup, value: "B+" },
    { label: t.profileAddress, value: "12, Gandhi Nagar, Nandgaon, Nashik, Maharashtra - 422105" },
    { label: t.profileEmergencyContact, value: "Sunita Patil — +91-9876543211" },
    { label: t.profileAadhaar, value: "XXXX-XXXX-3456" },
    { label: t.profileOccupation, value: lang === "English" ? "Farmer" : lang === "मराठी" ? "शेतकरी" : "किसान" },
    { label: t.profileMaritalStatus, value: lang === "English" ? "Married" : lang === "मराठी" ? "विवाहित" : "विवाहित" },
  ];

  const healthData = [
    { label: t.profileBloodGroup, value: "B+" },
    { label: t.profileHeight, value: "5'8\" (173 cm)" },
    { label: t.profileWeight, value: "72 kg" },
    { label: t.profileBmi, value: "24.2 (" + (lang === "English" ? "Normal" : lang === "मराठी" ? "सामान्य" : "सामान्य") + ")" },
    { label: t.profileAllergies, value: t.profileNoneReported },
    { label: t.profileChronicConditions, value: lang === "English" ? "Mild Hypertension (controlled)" : lang === "मराठी" ? "हलका उच्च रक्तदाब (नियंत्रित)" : "हल्का उच्च रक्तचाप (नियंत्रित)" },
    { label: t.profileCurrentMedications, value: "Amlodipine 5mg (daily)" },
    { label: t.profileLastVisit, value: lang === "English" ? "2 Sep 2026 — PHC Nandgaon" : lang === "मराठी" ? "२ सप्टंबर २०२६ — PHC नांदगाव" : "2 सितंबर 2026 — PHC नांदगांव" },
    { label: t.profileVaccinations, value: "COVID-19 Booster (Jul 2026), Tetanus (Mar 2025)" },
    { label: t.profileSmokingStatus, value: t.profileNonSmoker },
    { label: t.profileAlcoholStatus, value: t.profileOccasional },
    { label: t.profileExerciseFrequency, value: lang === "English" ? "3–4 times/week" : lang === "मराठी" ? "आठवड्याला ३-४ वेळा" : "सप्ताह में 3-4 बार" },
    { label: t.profileInsurance, value: lang === "English" ? "Maharashtra Health Insurance — " + t.profileActive : lang === "मराठी" ? "महाराष्ट्र आरोग्य विमा — " + t.profileActive : "महाराष्ट्र स्वास्थ्य बीमा — " + t.profileActive },
  ];

  const settingsData = [
    { label: t.profileLanguage, value: lang, action: () => {} },
    { label: t.profileNotifications, value: t.profileEnabled, action: () => {} },
    { label: t.profileDarkMode, value: t.profileOff, action: () => {} },
    { label: t.profileTextSize, value: t.profileMedium, action: () => {} },
    { label: t.profileTwoFactor, value: t.profileEnabled, action: () => {} },
    { label: t.profileDataSharing, value: t.profileLimited, action: () => {} },
    { label: t.profileAutoLock, value: t.profileAfter5Min, action: () => {} },
  ];

  const helpData = [
    { label: t.profileFaq, desc: t.profileFaqDesc },
    { label: t.profileContactSupport, desc: t.profileContactSupportDesc },
    { label: t.profileReportProblem, desc: t.profileReportProblemDesc },
    { label: t.profilePrivacyPolicy, desc: t.profilePrivacyPolicyDesc },
    { label: t.profileTermsOfService, desc: t.profileTermsOfServiceDesc },
    { label: t.profileAppVersion, desc: t.profileAppVersionDesc },
  ];

  const [logoutConfirm, setLogoutConfirm] = useState(false);

  if (section === "personal") {
    return (
      <div>
        <TopBar title={t.personalInfo} onBack={() => setSection("main")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {personalData.map((item) => (
            <div key={item.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginBottom: 4 }}>{item.label}</div>
              <div style={{ ...body, fontSize: 14, color: C.ink, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "health") {
    return (
      <div>
        <TopBar title={t.healthInfo} onBack={() => setSection("main")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {healthData.map((item) => (
            <div key={item.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginBottom: 4 }}>{item.label}</div>
              <div style={{ ...body, fontSize: 14, color: C.ink, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "settings") {
    return (
      <div>
        <TopBar title={t.settings} onBack={() => setSection("main")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {settingsData.map((s) => (
            <div key={s.label} onClick={s.action} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <span style={{ ...body, fontSize: 14, color: C.ink }}>{s.label}</span>
              <span style={{ ...body, fontSize: 13, color: C.inkSoft }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "help") {
    return (
      <div>
        <TopBar title={t.helpSupport} onBack={() => setSection("main")} />
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {helpData.map((h) => (
            <div key={h.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <div style={{ ...body, fontSize: 14, color: C.ink, fontWeight: 600 }}>{h.label}</div>
              <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{h.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === "logout") {
    return (
      <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", width: "100%", maxWidth: 340, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.redSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <LogOut size={26} color={C.red} />
          </div>
          <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{t.profileLogoutConfirm}</div>
          <div style={{ ...body, fontSize: 13, color: C.inkSoft, marginBottom: 22 }}>{t.profileLogoutMsg}</div>
          <button onClick={() => go(isAshaAssisted ? "asha_home" : "role_select")} style={{ width: "100%", background: C.red, color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, ...heading, cursor: "pointer", marginBottom: 10 }}>
            {t.logOut}
          </button>
          <button onClick={() => setSection("main")} style={{ width: "100%", background: "transparent", color: C.inkSoft, border: "none", padding: "12px 0", fontSize: 13, fontWeight: 600, ...body, cursor: "pointer" }}>
            {t.profileCancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title={t.myProfile} onBack={() => go("home")} />
      <div style={{ padding: 16 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "26px 16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 14 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: C.tealSoft, color: C.teal,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
          }}><User size={32} /></div>
          <div style={{ ...heading, fontWeight: 600, fontSize: 17, color: C.ink }}>{personalData[0].value}</div>
          <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{personalData[4].value}</div>
          <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>ID: {PATIENT.id}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: t.personalInfo, icon: User, key: "personal" },
            { label: t.healthInfo, icon: Heart, key: "health" },
            { label: t.settings, icon: ShieldCheck, key: "settings" },
            { label: t.helpSupport, icon: MessageCircle, key: "help" },
          ].map(({ label, icon: Icon, key }) => (
            <div key={key} onClick={() => setSection(key)} style={{ background: "#fff", borderRadius: 12, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer" }}>
              <Icon size={18} color={C.teal} />
              <span style={{ flex: 1, ...body, fontSize: 13.5, color: C.ink }}>{label}</span>
              <ChevronRight size={16} color={C.inkSoft} />
            </div>
          ))}
          <div onClick={() => setSection("logout")} style={{ background: "#fff", borderRadius: 12, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer" }}>
            <X size={18} color={C.red} />
            <span style={{ flex: 1, ...body, fontSize: 13.5, color: C.red, fontWeight: 600 }}>{t.logOut}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ROLE SELECT SCREEN
--------------------------------------------------------- */
function RoleSelectScreen({ go, lang, setLang, t }) {
  const [langOpen, setLangOpen] = useState(false);

  const roles = [
    {
      key: "patient",
      label: t.rolePatient,
      sub: t.rolePatientSub,
      icon: <User size={28} color="#0B6B58" />,
      dest: "patient_login",
    },
    {
      key: "asha",
      label: t.roleAsha,
      sub: t.roleAshaSub,
      icon: <UserPlus size={28} color="#0B6B58" />,
      dest: "asha_login",
    },
    {
      key: "doctor",
      label: t.roleDoctor,
      sub: t.roleDoctorSub,
      icon: <Stethoscope size={28} color="#0B6B58" />,
      dest: "doctor_role_select",
    },
    {
      key: "pharmacy",
      label: t.rolePharmacy,
      sub: t.rolePharmacySub,
      icon: <Pill size={28} color="#0B6B58" />,
      dest: "pharmacy_login",
    },
    {
      key: "diagnostic",
      label: t.roleDiagnostic,
      sub: t.roleDiagnosticSub,
      icon: <FileText size={28} color="#0B6B58" />,
      dest: "diagnostic_login",
    },
  ];

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Language picker top-right */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 18px 0", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
            color: "#374151", padding: "7px 11px", display: "flex", alignItems: "center",
            gap: 6, fontSize: 12.5, cursor: "pointer", ...body, fontWeight: 600,
          }}>
            <Globe size={14} /> {lang} <ChevronDown size={13} />
          </button>
          {langOpen && (
            <div style={{
              position: "absolute", right: 0, top: 38, background: "#fff", borderRadius: 10,
              boxShadow: "0 8px 22px rgba(0,0,0,0.18)", overflow: "hidden", zIndex: 30, width: 130,
            }}>
              {LANGS.map((l) => (
                <div key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{
                  padding: "10px 14px", fontSize: 13.5, color: C.ink, cursor: "pointer", ...body,
                  background: l === lang ? C.tealSoft : "#fff", fontWeight: l === lang ? 600 : 400,
                }}>{l}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "16px 24px 8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SannidhyaLogo size={64} style={{ marginBottom: 8 }} />
        <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: 1 }}>{t.appName}</div>
        <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, marginTop: 4, textAlign: "center" }}>{t.tagline}</div>
      </div>

      <div style={{ padding: "20px 20px 8px", textAlign: "center" }}>
        <div style={{ ...body, fontSize: 13, color: C.inkSoft }}>Choose how you want to continue</div>
      </div>

      <div style={{ padding: "8px 20px 24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => go(r.dest)}
            style={{
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: "20px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              textAlign: "left",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.2s, transform 0.15s",
              width: "100%",
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "#E4F1EC",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {r.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...heading, fontWeight: 700, fontSize: 16, color: "#111827" }}>{r.label}</div>
              <div style={{ ...body, fontSize: 13, color: C.inkSoft, marginTop: 3 }}>{r.sub}</div>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 20px 18px", textAlign: "center", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>
          Secure · HIPAA Compliant · Maharashtra Government
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ASHA LOGIN SCREEN
--------------------------------------------------------- */
function AshaLoginScreen({ go, lang, setLang, t }) {
  const [workerId, setWorkerId] = useState("MH-PUN-W-04-012");
  const [otp, setOtp] = useState("123456");

  const handleLogin = () => {
    const id = workerId.toUpperCase();
    if (id.includes("-W-") || id.startsWith("W")) {
      go("asha_home");
    } else if (id.includes("-S-") || id.startsWith("S") || id.startsWith("AS")) {
      go("asha_home");
    } else {
      go("asha_home");
    }
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Back button */}
      <div style={{ padding: "16px 18px 0" }}>
        <button
          onClick={() => go("role_select")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", color: "#374151",
          }}
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Login Card */}
      <div style={{ padding: "10px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "#fff", borderRadius: 20,
          padding: "28px 22px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          {/* Sannidhya Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <SannidhyaLogo size={64} style={{ marginBottom: 6 }} />
          </div>

          <div style={{ ...heading, fontWeight: 700, fontSize: 20, color: "#111827", textAlign: "center", marginBottom: 4 }}>
            {t.ashaLoginTitle}
          </div>
          <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, textAlign: "center", marginBottom: 20 }}>
            {t.ashaLoginSub}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {t.ashaIdLabel}
            </div>
            <input
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px",
                fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center",
              }}
            />
            <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 4, textAlign: "center" }}>
              {t.ashaIdPlaceholder}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {t.otpLabel}
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px",
                fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center", letterSpacing: 4,
              }}
            />
            <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 4, textAlign: "center" }}>
              {t.demoOtp}
            </div>
          </div>

          {/* Role Hint */}
          <div style={{
            background: "#FEF9C3", border: "1px solid #FDE68A", borderRadius: 10,
            padding: "10px 14px", ...body, fontSize: 12.5, color: "#92400E", marginBottom: 16, lineHeight: 1.5,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>👆</span>
            {t.ashaRoleHint}
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: "100%", background: "#0B6B58", color: "#fff", border: "none",
              borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700,
              ...heading, cursor: "pointer",
            }}
          >
            {t.ashaLoginBtn}
          </button>
        </div>

        {/* Hints below card */}
        <div style={{ padding: "18px 10px", textAlign: "center" }}>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 4 }}>{t.ashaCredHint}</div>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.ashaAvailIds}</div>
          <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{t.ashaWorkerIds}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ASHA DASHBOARD SCREEN
--------------------------------------------------------- */
function AshaDashboardScreen({ go, lang, setLang, t }) {
  const [langOpen, setLangOpen] = useState(false);

  const stats = [
    { label: t.totalPatients, value: 12, icon: <Users size={22} color="#7C3AED" />, iconBg: "#F3F0FF" },
    { label: t.activeCases, value: 7, icon: <Activity size={22} color="#16A34A" />, iconBg: "#F0FDF4" },
    { label: t.completedToday, value: 0, icon: <Bell size={22} color="#7C3AED" />, iconBg: "#F3F0FF" },
    { label: t.emergencyCases, value: 2, icon: <AlertTriangle size={22} color="#DC2626" />, iconBg: "#FEF2F2" },
  ];

  const quickActions = [
    { label: t.viewPatientSurvey, icon: <Eye size={18} />, bg: "#7C3AED", dest: "health_surveys" },
    { label: t.registerNewPatient, icon: <UserPlus size={18} />, bg: "#16A34A", dest: "register_patient" },
    { label: t.helpPatientLogin, icon: <LogIn size={18} />, bg: "#A21CAF", dest: "patient_login" },
  ];

  const services = [
    { label: t.aiSymptomChecker, icon: <Bot size={20} />, iconColor: "#7C3AED", border: "#E5E7EB", type: "triage" },
    { label: t.emergency, icon: <AlertTriangle size={20} />, iconColor: "#DC2626", border: "#FCA5A5", type: "emergency" },
    { label: t.pastConsultations, icon: <FileText size={20} />, iconColor: "#7C3AED", border: "#E5E7EB", type: "records" },
    { label: t.diseaseAnalytics, icon: <BarChart2 size={20} />, iconColor: "#DC2626", border: "#FCA5A5", type: "disease_analytics" },
  ];

  const recentActivity = [
    { text: t.activityRegistered, sub: `${lang === "English" ? "Ram Sharma" : "राम शर्मा"} • ${t.hoursAgo}`, color: "#16A34A" },
    { text: t.activityConsultDone, sub: `${lang === "English" ? "Sita Devi" : "सीता देवी"} • ${t.hoursAgo}`, color: "#7C3AED" },
    { text: t.activityEmergencyRef, sub: `${lang === "English" ? "Mohan Gupta" : "मोहन गुप्ता"} • ${t.hoursAgo}`, color: "#EA580C" },
  ];

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Custom Top Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "14px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ ...heading, fontSize: 16, fontWeight: 700, color: "#111827" }}>{t.ashaDashTitle}</div>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 1 }}>{t.ashaWorkerName}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Language */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 10,
                color: "#374151", padding: "6px 10px", display: "flex", alignItems: "center",
                gap: 5, fontSize: 12, cursor: "pointer", fontWeight: 600, ...body,
              }}
            >
              <Globe size={13} color="#7C3AED" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                <span>{lang}</span>
                <span style={{ fontSize: 9.5, color: C.inkSoft, fontWeight: 400 }}>{lang}</span>
              </div>
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <div style={{
                position: "absolute", right: 0, top: 38, background: "#fff", borderRadius: 10,
                boxShadow: "0 8px 22px rgba(0,0,0,0.15)", overflow: "hidden", zIndex: 30, width: 130,
              }}>
                {LANGS.map((l) => (
                  <div key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{
                    padding: "10px 14px", fontSize: 13.5, color: "#374151", cursor: "pointer", ...body,
                    background: l === lang ? "#F3F0FF" : "#fff", fontWeight: l === lang ? 600 : 400,
                  }}>{l}</div>
                ))}
              </div>
            )}
          </div>
          {/* Profile */}
          <button
            onClick={() => go("asha_profile")}
            style={{
              background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10,
              padding: "6px 11px", display: "flex", alignItems: "center", gap: 5,
              ...body, fontSize: 12.5, color: "#16A34A", fontWeight: 700, cursor: "pointer",
            }}
          >
            <User size={14} color="#16A34A" />
            <span>{t.myProfile}</span>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 16,
              padding: "18px 14px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: s.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {s.icon}
              </div>
              <div style={{ ...heading, fontSize: 26, fontWeight: 700, color: "#111827" }}>{s.value}</div>
              <div style={{ ...body, fontSize: 12, color: C.inkSoft, textAlign: "center" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 12 }}>
            {t.quickActions}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => go(a.dest, null, "asha_home", a.dest === "patient_login" ? true : undefined)}
                style={{
                  background: a.bg, color: "#fff", border: "none",
                  borderRadius: 12, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                  cursor: "pointer", textAlign: "left",
                  ...body, fontSize: 14, fontWeight: 700,
                }}
              >
                {a.icon}
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Services */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 12 }}>
            {t.patientServices}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {services.map((s) => (
              <div
                key={s.label}
                onClick={() => go("asha_patient_service", s.type)}
                style={{
                  border: `1.5px solid ${s.border}`,
                  borderRadius: 12, padding: "16px 12px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  cursor: "pointer", background: "#fff",
                }}
              >
                <div style={{ color: s.iconColor }}>{s.icon}</div>
                <div style={{ ...body, fontSize: 12.5, color: "#374151", textAlign: "center", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* My Area */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <MapPin size={16} color="#7C3AED" />
            <div style={{ ...heading, fontWeight: 700, fontSize: 15, color: "#111827" }}>{t.myArea}</div>
          </div>
          {[
            { label: t.coverageArea, value: "Village Block 1" },
            { label: t.ashaWorkerId, value: "A001" },
            { label: t.phoneNumber, value: "+91-9876543212" },
          ].map((row) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "7px 0", borderBottom: "1px solid #F3F4F6",
            }}>
              <span style={{ ...body, fontSize: 13, color: C.inkSoft }}>{row.label}</span>
              <span style={{ ...body, fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <TrendingUp size={16} color="#16A34A" />
            <div style={{ ...heading, fontWeight: 700, fontSize: 15, color: "#111827" }}>{t.recentActivity}</div>
          </div>
          {recentActivity.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "10px 12px", borderRadius: 10, marginBottom: 6,
              background: "#F9FAFB",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: item.color, flexShrink: 0, marginTop: 4,
              }} />
              <div>
                <div style={{ ...body, fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{item.text}</div>
                <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ASHA PROFILE SCREEN
--------------------------------------------------------- */
function AshaProfileScreen({ go, lang, setLang, t }) {
  const [langOpen, setLangOpen] = useState(false);

  const profileData = {
    name: lang === "मराठी" ? "प्रिया पटेल" : lang === "हिंदी" ? "प्रिया पटेल" : "Priya Patel",
    id: "A001",
    phone: "+91-9876543210",
    area: lang === "मराठी" ? "वार्ड १२, तालुका हवेली" : lang === "हिंदी" ? "वार्ड १२, तहसील हवेली" : "Ward 12, Haveli Taluka",
    supervisor: lang === "मराठी" ? "डॉ. राजेश शर्मा" : lang === "हिंदी" ? "डॉ. राजेश शर्मा" : "Dr. Rajesh Sharma",
    experience: lang === "मराठी" ? "५ वर्षे" : lang === "हिंदी" ? "५ वर्ष" : "5 years",
    patientsCovered: 156,
    householdsCovered: 42,
    certifications: [
      lang === "मराठी" ? "आशा प्रशिक्षण - २०२१" : lang === "हिंदी" ? "आशा प्रशिक्षण - २०२१" : "ASHA Training - 2021",
      lang === "मराठी" ? "प्राथमिक उपचार प्रमाणपत्र" : lang === "हिंदी" ? "प्राथमिक उपचार प्रमाणपत्र" : "First Aid Certification",
      lang === "मराठी" ? "मातृ आरोग्य प्रशिक्षण" : lang === "हिंदी" ? "मातृ स्वास्थ्य प्रशिक्षण" : "Maternal Health Training",
    ],
    monthlyStats: {
      visits: 28,
      referrals: 5,
      vaccinations: 12,
    },
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => go("asha_home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#7C3AED" }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: "#111827" }}>{t.myProfile}</div>
        <div style={{ width: 22 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Profile Header */}
        <div style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
          borderRadius: 18, padding: "24px 18px", textAlign: "center", color: "#fff",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
          }}>
            <User size={36} color="#fff" />
          </div>
          <div style={{ ...heading, fontSize: 20, fontWeight: 700 }}>{profileData.name}</div>
          <div style={{ ...body, fontSize: 13, opacity: 0.85, marginTop: 4 }}>ASHA Worker · {profileData.id}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.patientsCovered}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "रुग्ण" : lang === "हिंदी" ? "मरीज़" : "Patients"}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.householdsCovered}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "घरे" : lang === "हिंदी" ? "घर" : "Households"}</div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>{lang === "मराठी" ? "माहिती" : lang === "हिंदी" ? "जानकारी" : "Information"}</div>
          {[
            { label: lang === "मराठी" ? "फोन" : lang === "हिंदी" ? "फ़ोन" : "Phone", value: profileData.phone },
            { label: lang === "मराठी" ? "क्षेत्र" : lang === "हिंदी" ? "क्षेत्र" : "Area", value: profileData.area },
            { label: lang === "मराठी" ? "पर्यवेक्षक" : lang === "हिंदी" ? "पर्यवेक्षक" : "Supervisor", value: profileData.supervisor },
            { label: lang === "मराठी" ? "अनुभव" : lang === "हिंदी" ? "अनुभव" : "Experience", value: profileData.experience },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ ...body, fontSize: 13, color: "#6B7280" }}>{item.label}</span>
              <span style={{ ...body, fontSize: 13, color: "#111827", fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Monthly Stats */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>
            {lang === "मराठी" ? "मासिक तपशील" : lang === "हिंदी" ? "मासिक विवरण" : "Monthly Stats"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: lang === "मराठी" ? "भेटी" : lang === "हिंदी" ? "भेंट" : "Visits", value: profileData.monthlyStats.visits, color: "#7C3AED" },
              { label: lang === "मराठी" ? "रेफरल" : lang === "हिंदी" ? "रेफरल" : "Referrals", value: profileData.monthlyStats.referrals, color: "#DC2626" },
              { label: lang === "मराठी" ? "लसीकरण" : lang === "हिंदी" ? "टीकाकरण" : "Vaccinations", value: profileData.monthlyStats.vaccinations, color: "#16A34A" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 12, padding: "14px 10px", textAlign: "center", border: "1px solid #F3F4F6" }}>
                <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ ...body, fontSize: 11, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>
            {lang === "मराठी" ? "प्रमाणपत्रे" : lang === "हिंदी" ? "प्रमाणपत्र" : "Certifications"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {profileData.certifications.map((c, i) => (
              <div key={i} style={{ background: "#F0FDF4", borderRadius: 8, padding: "8px 12px", ...body, fontSize: 13, color: "#166534", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={14} color="#16A34A" /> {c}
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => go("role_select")}
          style={{
            width: "100%", background: "#FEF2F2", color: "#DC2626",
            border: "1px solid #FCA5A5", borderRadius: 12, padding: "14px 0",
            ...heading, fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <LogOut size={16} color="#DC2626" /> {t.logout}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   HEALTH SURVEYS SCREEN (Image 1)
--------------------------------------------------------- */
function HealthSurveysScreen({ go, lang, setLang, t }) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    { id: "P001", name: { en: "Ram Sharma", mr: "राम शर्मा", hi: "राम शर्मा" }, age: "45 yrs", gender: "Male", phone: "+91-9876543210",
      zone: "green", zoneLabel: "Low Risk", lastVisit: "Sept 5, 2026",
      symptoms: "Mild cough, occasional headache",
      vitals: { bp: "126/82", temp: "98.4°F", pulse: "78/min", spo2: "97%" },
      conditions: ["Hypertension (controlled)"],
      medications: ["Amlodipine 5mg (daily)"],
      surveyStatus: "Completed", surveyDate: "Sept 5, 2026",
      notes: "Patient reports improved symptoms. BP controlled. Follow-up in 2 weeks.",
    },
    { id: "P002", name: { en: "Sita Devi", mr: "सीता देवी", hi: "सीता देवी" }, age: "32 yrs", gender: "Female", phone: "+91-9876543211",
      zone: "yellow", zoneLabel: "Moderate Risk", lastVisit: "Sept 8, 2026",
      symptoms: "Fever (3 days), body ache, fatigue",
      vitals: { bp: "118/76", temp: "100.2°F", pulse: "92/min", spo2: "96%" },
      conditions: ["Anemia (mild)"],
      medications: ["Iron supplement (daily)", "Paracetamol 500mg (as needed)"],
      surveyStatus: "In Progress", surveyDate: "Sept 10, 2026",
      notes: "Possible viral fever. Blood test recommended. Rest advised.",
    },
    { id: "P003", name: { en: "Mohan Gupta", mr: "मोहन गुप्ता", hi: "मोहन गुप्ता" }, age: "55 yrs", gender: "Male", phone: "+91-9876543212",
      zone: "red", zoneLabel: "High Risk", lastVisit: "Sept 9, 2026",
      symptoms: "Severe chest pain, breathlessness, sweating",
      vitals: { bp: "158/96", temp: "99.1°F", pulse: "110/min", spo2: "91%" },
      conditions: ["Type 2 Diabetes", "Ischemic Heart Disease"],
      medications: ["Metformin 500mg (2x daily)", "Aspirin 75mg (daily)", "Atorvastatin 10mg (night)"],
      surveyStatus: "Emergency", surveyDate: "Sept 9, 2026",
      notes: "Urgent referral to Civil Hospital recommended. ECG required immediately.",
    },
    { id: "P004", name: { en: "Priya Sharma", mr: "प्रिया शर्मा", hi: "प्रिया शर्मा" }, age: "28 yrs", gender: "Female", phone: "+91-9876543213",
      zone: "green", zoneLabel: "Low Risk", lastVisit: "Sept 3, 2026",
      symptoms: "Mild cold, runny nose",
      vitals: { bp: "110/70", temp: "98.6°F", pulse: "72/min", spo2: "99%" },
      conditions: [],
      medications: [],
      surveyStatus: "Completed", surveyDate: "Sept 3, 2026",
      notes: "Common cold. No medication required. Monitor for 2 days.",
    },
  ];

  const getName = (p) => typeof p.name === "object" ? (p.name[lang === "English" ? "en" : lang === "मराठी" ? "mr" : "hi"] || p.name.en) : p.name;

  const filtered = patients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const zoneColors = { green: { bg: "#DCFCE7", border: "#86EFAC", text: "#16A34A" }, yellow: { bg: "#FEF9C3", border: "#FDE047", text: "#CA8A04" }, red: { bg: "#FEE2E2", border: "#FCA5A5", text: "#DC2626" } };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => selectedPatient ? setSelectedPatient(null) : go("asha_home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#0B6B58" }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: "#0B6B58" }}>
          {selectedPatient ? t.surveySelected + " " + selectedPatient.id : (t.healthSurveys || "Health Surveys")}
        </div>
        <div style={{ width: 22 }} />
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, padding: "16px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Patient List View */}
        {!selectedPatient && (
          <>
            <div style={{
              background: "#F3F4F6", borderRadius: 12, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Search size={18} color="#9CA3AF" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPatients || "Search patients..."}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  fontSize: 14, color: "#111827", width: "100%", ...body,
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((patient) => {
                const zc = zoneColors[patient.zone];
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    style={{
                      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
                      padding: "16px 16px", display: "flex", alignItems: "center", gap: 14,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: "50%",
                      background: zc.bg, display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <User size={22} color={zc.text} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...heading, fontWeight: 700, fontSize: 16, color: "#0B6B58" }}>
                        {getName(patient)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{
                          background: "#F3F4F6", color: "#374151",
                          borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700, ...body,
                        }}>
                          {patient.id}
                        </span>
                        <span style={{ ...body, fontSize: 13, color: "#6B7280" }}>{patient.age}</span>
                        <span style={{ background: zc.bg, color: zc.text, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, ...body }}>
                          {patient.zoneLabel}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#9CA3AF" />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Patient Survey Detail */}
        {selectedPatient && (() => {
          const p = selectedPatient;
          const zc = zoneColors[p.zone];
          return (
            <>
              {/* Patient Header Card */}
              <div style={{
                background: "#fff", borderRadius: 16, padding: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: zc.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <User size={26} color={zc.text} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...heading, fontWeight: 700, fontSize: 17, color: "#0B6B58" }}>{getName(p)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                    <span style={{ background: "#F3F4F6", color: "#374151", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700, ...body }}>{p.id}</span>
                    <span style={{ ...body, fontSize: 12, color: "#6B7280" }}>{p.age} · {p.gender}</span>
                  </div>
                </div>
                <span style={{ background: zc.bg, color: zc.text, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, ...body }}>{p.zoneLabel}</span>
              </div>

              {/* Survey Status */}
              <div style={{
                background: p.surveyStatus === "Emergency" ? "#FEF2F2" : p.surveyStatus === "In Progress" ? "#FFFBEB" : "#ECFDF5",
                border: `1px solid ${p.surveyStatus === "Emergency" ? "#FCA5A5" : p.surveyStatus === "In Progress" ? "#FDE047" : "#A7F3D0"}`,
                borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ ...heading, fontWeight: 700, fontSize: 13, color: p.surveyStatus === "Emergency" ? "#DC2626" : p.surveyStatus === "In Progress" ? "#CA8A04" : "#059669" }}>
                    {p.surveyStatus === "Emergency" ? "🚨 " : p.surveyStatus === "In Progress" ? "⏳ " : "✅ "}{p.surveyStatus === "Emergency" ? t.surveyEmergency : p.surveyStatus === "In Progress" ? t.surveyInProgress : t.surveyCompleted}
                  </div>
                  <div style={{ ...body, fontSize: 11, color: "#6B7280", marginTop: 2 }}>{t.surveyLastSurvey} {p.surveyDate}</div>
                </div>
                <div style={{ ...body, fontSize: 11, color: "#6B7280" }}>{t.surveyLastVisit} {p.lastVisit}</div>
              </div>

              {/* Symptoms */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>{t.surveySymptoms}</div>
                <div style={{ ...body, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{p.symptoms}</div>
              </div>

              {/* Vitals */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>{t.surveyVitals}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {Object.entries(p.vitals).map(([key, val]) => (
                    <div key={key} style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 12px", border: "1px solid #F3F4F6" }}>
                      <div style={{ ...body, fontSize: 11, color: "#6B7280", textTransform: "uppercase" }}>{key === "spo2" ? "SpO₂" : key === "bp" ? "BP" : key === "temp" ? "Temp" : key === "pulse" ? "Pulse" : key}</div>
                      <div style={{ ...heading, fontWeight: 700, fontSize: 15, color: "#111827", marginTop: 2 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Conditions */}
              {p.conditions.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>{t.surveyConditions}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.conditions.map((c, i) => (
                      <div key={i} style={{ background: "#FEF2F2", borderRadius: 8, padding: "8px 12px", ...body, fontSize: 13, color: "#991B1B", border: "1px solid #FECACA" }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {p.medications.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>{t.surveyMedications}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.medications.map((m, i) => (
                      <div key={i} style={{ background: "#EFF6FF", borderRadius: 8, padding: "8px 12px", ...body, fontSize: 13, color: "#1E40AF", border: "1px solid #BFDBFE" }}>
                        💊 {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ASHA Notes */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>{t.surveyNotes}</div>
                <div style={{ ...body, fontSize: 13, color: "#374151", lineHeight: 1.6, fontStyle: "italic" }}>
                  "{p.notes}"
                </div>
              </div>

            </>
          );
        })()}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   REGISTER NEW PATIENT SCREEN (Image 2)
--------------------------------------------------------- */
function RegisterPatientScreen({ go, lang, setLang, t }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emergency, setEmergency] = useState("");
  const [familySize, setFamilySize] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      go("health_surveys");
    }, 1500);
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => go("asha_home")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4, color: "#7C3AED", fontWeight: 600, fontSize: 15, ...body,
          }}
        >
          <ChevronLeft size={20} color="#7C3AED" />
          <span>{t.back || "Back"}</span>
        </button>
        <div style={{ ...heading, fontSize: 17, fontWeight: 700, color: "#111827" }}>
          {t.registerNewPatientTitle || "Register New Patient"}
        </div>
        <div style={{ width: 50 }} />
      </div>

      {/* Body Scroll */}
      <div style={{ flex: 1, padding: "16px 16px", overflowY: "auto" }}>
        {submitted ? (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "36px 20px", textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={36} color="#16A34A" />
            </div>
            <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: "#111827" }}>
              {t.patientRegisteredMsg || "Patient Registered Successfully!"}
            </div>
            <div style={{ ...body, fontSize: 13, color: C.inkSoft }}>
              {t.generatedPatientId} <strong>P005</strong>
            </div>
          </div>
        ) : (
          <div style={{
            background: "#fff", borderRadius: 20, padding: "22px 18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6",
          }}>
            {/* Section 1: Personal Information */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <User size={20} color="#7C3AED" />
              <div style={{ ...heading, fontWeight: 700, fontSize: 17, color: "#111827" }}>
                {t.personalInfoSec || t.personalInfo || "Personal Information"}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {t.fullName || "Full Name *"}
              </div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.enterFullName || "Enter patient's full name"}
                style={{
                  width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                  borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#111827", outline: "none", ...body,
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {t.age || "Age *"}
                </div>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                    borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#111827", outline: "none", ...body,
                  }}
                />
              </div>
              <div>
                <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {t.gender || "Gender *"}
                </div>
                <div style={{ position: "relative" }}>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                      borderRadius: 10, padding: "12px 30px 12px 14px", fontSize: 14, color: gender ? "#111827" : "#9CA3AF",
                      appearance: "none", outline: "none", ...body, cursor: "pointer",
                    }}
                  >
                    <option value="">{t.selectGender || "Select"}</option>
                    <option value="Male">{t.profileMale}</option>
                    <option value="Female">{t.profileFemale}</option>
                    <option value="Other">{t.profileOther}</option>
                  </select>
                  <ChevronDown size={16} color="#9CA3AF" style={{ position: "absolute", right: 10, top: 14, pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, marginTop: 10 }}>
              <PhoneCall size={20} color="#16A34A" />
              <div style={{ ...heading, fontWeight: 700, fontSize: 17, color: "#111827" }}>
                {t.contactInfo || "Contact Information"}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {t.phoneNumberLabel || "Phone Number *"}
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-XXXXXXXXXX"
                style={{
                  width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                  borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#111827", outline: "none", ...body,
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {t.addressLabel || "Address"}
              </div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.addressPlaceholder || "Village, District"}
                style={{
                  width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                  borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#111827", outline: "none", ...body,
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {t.emergencyContactLabel || "Emergency Contact"}
              </div>
              <input
                value={emergency}
                onChange={(e) => setEmergency(e.target.value)}
                placeholder="+91-XXXXXXXXXX"
                style={{
                  width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                  borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#111827", outline: "none", ...body,
                }}
              />
            </div>

            {/* Section 3: Health Information */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, marginTop: 10 }}>
              <Heart size={20} color="#DC2626" />
              <div style={{ ...heading, fontWeight: 700, fontSize: 17, color: "#111827" }}>
                {t.healthInfoLabel || "Health Information"}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {t.familySizeLabel || "Family Size"}
              </div>
              <input
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                placeholder={t.familySizePlaceholder || "e.g., 4"}
                style={{
                  width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                  borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#111827", outline: "none", ...body,
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: "100%", background: "#16A34A", color: "#fff", border: "none",
                borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700, ...heading, cursor: "pointer",
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)",
              }}
            >
              {t.registerPatientBtn || "Register Patient"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PATIENT LOGIN SCREEN — ABHA + Patient ID
--------------------------------------------------------- */
function PatientLoginScreen({ go, backDest, lang, setLang, t }) {
  const [loginMode, setLoginMode] = useState("patient"); // "abha" or "patient"
  const [abhaStep, setAbhaStep] = useState("enter"); // "enter" | "otp" | "records"
  const [abhaNumber, setAbhaNumber] = useState("12345678901234");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("123456");
  const [patientId, setPatientId] = useState("P001");
  const [patientOtp, setPatientOtp] = useState("123456");
  const [abhaLinkedData, setAbhaLinkedData] = useState(null);
  const [langOpen, setLangOpen] = useState(false);

  const MOCK_ABHA_RECORDS = {
    abhaId: "1234-5678-9012-3456",
    name: "रमेश पाटील",
    dob: "15/06/1978",
    gender: "Male",
    mobile: "+91-9876543210",
    linkedFacilities: [
      { name: "PHC Nandgaon", records: 3 },
      { name: "District Hospital, Nashik", records: 7 },
      { name: "AIIMS Mumbai", records: 2 },
    ],
    recentRecords: [
      { type: "Prescription", date: "2 Sep 2026", doctor: "Dr. Shreeven Chavan", facility: "PHC Nandgaon", desc: "Paracetamol 500mg — 3 days" },
      { type: "Lab Report", date: "31 Aug 2026", doctor: "Dr. Smita Vagh", facility: "District Hospital", desc: "Complete Blood Count — Normal" },
      { type: "Referral", date: "30 Aug 2026", doctor: "Dr. Amit Sharma", facility: "PHC Nandgaon", desc: "Cardiology — Completed" },
      { type: "Vaccination", date: "15 Jul 2026", doctor: "Dr. Priya Desai", facility: "PHC Nandgaon", desc: "COVID-19 Booster Dose" },
      { type: "Diagnosis", date: "10 Jun 2026", doctor: "Dr. Shreeven Chavan", facility: "PHC Nandgaon", desc: "Seasonal Viral Fever — Recovered" },
    ],
    healthSummary: {
      bloodGroup: "B+",
      allergies: "None reported",
      chronicConditions: "Mild Hypertension (controlled)",
      medications: "Amlodipine 5mg (daily)",
      lastVisit: "2 Sep 2026",
    },
  };

  const handleAbhaVerify = () => {
    setAbhaStep("otp");
  };

  const handleAbhaOtpVerify = () => {
    setAbhaLinkedData(MOCK_ABHA_RECORDS);
    setAbhaStep("records");
  };

  const handleAbhaLogin = () => {
    setAbhaLinkedData(MOCK_ABHA_RECORDS);
    setAbhaStep("records");
  };

  const handlePatientLogin = () => {
    go("home");
  };

  // ABHA Records View
  if (abhaStep === "records" && abhaLinkedData) {
    return (
      <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "#fff", borderBottom: "1px solid #E5E7EB",
          padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button onClick={() => { setAbhaStep("enter"); setAbhaLinkedData(null); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#0B6B58", fontWeight: 600, fontSize: 15, ...body }}>
            <ChevronLeft size={20} color="#0B6B58" />
          </button>
          <div style={{ ...heading, fontSize: 16, fontWeight: 700, color: "#111827", textAlign: "center" }}>
            {t.abhaLinkedRecords || "Linked Health Records"}
          </div>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, padding: "14px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ABHA ID Card */}
          <div style={{
            background: "linear-gradient(135deg, #0B6B58, #084F41)", borderRadius: 18, padding: "20px 18px",
            color: "#fff", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ ...body, fontSize: 11, opacity: 0.8, marginBottom: 4 }}>ABHA Health ID</div>
                <div style={{ ...heading, fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>{abhaLinkedData.abhaId}</div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px",
                fontSize: 10, fontWeight: 700, ...body,
              }}>
                {t.abhaVerified}
              </div>
            </div>
            <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 12 }}>
              <div style={{ ...heading, fontSize: 15, fontWeight: 600 }}>{abhaLinkedData.name}</div>
              <div style={{ ...body, fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                {abhaLinkedData.gender} · DOB: {abhaLinkedData.dob}
              </div>
              <div style={{ ...body, fontSize: 12, opacity: 0.8 }}>{abhaLinkedData.mobile}</div>
            </div>
          </div>

          {/* Health Summary */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Heart size={17} color="#DC2626" />
              <span style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827" }}>{t.abhaHealthSummary}</span>
            </div>
            {[
              { label: t.abhaBloodGroup, value: abhaLinkedData.healthSummary.bloodGroup },
              { label: t.abhaAllergies, value: abhaLinkedData.healthSummary.allergies },
              { label: t.abhaChronic, value: abhaLinkedData.healthSummary.chronicConditions },
              { label: t.abhaMedications, value: abhaLinkedData.healthSummary.medications },
              { label: t.abhaLastVisit, value: abhaLinkedData.healthSummary.lastVisit },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ ...body, fontSize: 12.5, color: "#6B7280" }}>{row.label}</span>
                <span style={{ ...body, fontSize: 12.5, fontWeight: 600, color: "#111827", textAlign: "right", maxWidth: "55%" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Linked Facilities */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Stethoscope size={17} color="#0B6B58" />
              <span style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827" }}>{t.abhaLinkedFacilities} ({abhaLinkedData.linkedFacilities.length})</span>
            </div>
            {abhaLinkedData.linkedFacilities.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                <div>
                  <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: "#111827" }}>{f.name}</div>
                  <div style={{ ...body, fontSize: 11, color: "#6B7280" }}>{f.records} {t.abhaRecords}</div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>
            ))}
          </div>

          {/* Recent Records */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FileText size={17} color="#7C3AED" />
              <span style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827" }}>{t.abhaRecentRecords}</span>
            </div>
            {abhaLinkedData.recentRecords.map((r, i) => {
              const typeColors = { Prescription: { bg: "#E4F1EC", color: "#084F41" }, "Lab Report": { bg: "#F3F0FF", color: "#7C3AED" }, Referral: { bg: "#FBF0DD", color: "#92400E" }, Vaccination: { bg: "#DCFCE7", color: "#166534" }, Diagnosis: { bg: "#FEE2E2", color: "#991B1B" } };
              const tc = typeColors[r.type] || typeColors.Prescription;
              return (
                <div key={i} style={{ padding: "10px 0", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ background: tc.bg, color: tc.color, fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6, ...body }}>{r.type}</span>
                    <span style={{ ...body, fontSize: 11, color: "#9CA3AF" }}>{r.date}</span>
                  </div>
                  <div style={{ ...heading, fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 4 }}>{r.desc}</div>
                  <div style={{ ...body, fontSize: 11.5, color: "#6B7280", marginTop: 2 }}>{r.doctor} · {r.facility}</div>
                </div>
              );
            })}
          </div>

          {/* Consent */}
          <div style={{
            background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12,
            padding: "12px 14px", ...body, fontSize: 11.5, color: "#065F46", lineHeight: 1.6,
          }}>
            {t.abhaRecordConsent}
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => go("home")}
            style={{
              width: "100%", background: "#0B6B58", color: "#fff", border: "none",
              borderRadius: 12, padding: "15px 0", fontSize: 15, fontWeight: 700,
              ...heading, cursor: "pointer",
            }}
          >
            {t.abhaContinueHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Language picker top-right */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 18px 0", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
            color: "#374151", padding: "7px 11px", display: "flex", alignItems: "center",
            gap: 6, fontSize: 12.5, cursor: "pointer", ...body, fontWeight: 600,
          }}>
            <Globe size={14} /> {lang} <ChevronDown size={13} />
          </button>
          {langOpen && (
            <div style={{
              position: "absolute", right: 0, top: 38, background: "#fff", borderRadius: 10,
              boxShadow: "0 8px 22px rgba(0,0,0,0.18)", overflow: "hidden", zIndex: 30, width: 130,
            }}>
              {LANGS.map((l) => (
                <div key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{
                  padding: "10px 14px", fontSize: 13.5, color: C.ink, cursor: "pointer", ...body,
                  background: l === lang ? C.tealSoft : "#fff", fontWeight: l === lang ? 600 : 400,
                }}>{l}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back button */}
      <div style={{ padding: "8px 18px 0" }}>
        <button onClick={() => go("role_select")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151" }}>
          <ChevronLeft size={22} />
        </button>
      </div>

      <div style={{ padding: "10px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>

          {/* Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
            <SannidhyaLogo size={64} style={{ marginBottom: 6 }} />
          </div>

          <div style={{ ...heading, fontWeight: 700, fontSize: 20, color: "#111827", textAlign: "center", marginBottom: 4 }}>
            {t.patientAuthTitle || "Login"}
          </div>
          <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, textAlign: "center", marginBottom: 18 }}>
            {t.patientAuthSub || "Quick login with pre-filled credentials"}
          </div>

          {/* Tab Switcher */}
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 18 }}>
            <button
              onClick={() => setLoginMode("patient")}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
                ...heading, fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                background: loginMode === "patient" ? "#0B6B58" : "transparent",
                color: loginMode === "patient" ? "#fff" : "#6B7280",
              }}
            >
              {t.patientIdTab}
            </button>
            <button
              onClick={() => setLoginMode("abha")}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
                ...heading, fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                background: loginMode === "abha" ? "#0B6B58" : "transparent",
                color: loginMode === "abha" ? "#fff" : "#6B7280",
              }}
            >
              {t.abhaHealthIdTab}
            </button>
          </div>

          {/* Patient ID Login Mode */}
          {loginMode === "patient" && (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {t.patientIdLabel}
                </div>
                <input
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                    borderRadius: 10, padding: "12px 14px", fontSize: 15, ...body, outline: "none",
                    color: "#111827", textAlign: "center",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {t.otpLabel}
                </div>
                <input
                  value={patientOtp}
                  onChange={(e) => setPatientOtp(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                    borderRadius: 10, padding: "12px 14px", fontSize: 15, ...body, outline: "none",
                    color: "#111827", textAlign: "center", letterSpacing: 4,
                  }}
                />
                <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 4, textAlign: "center" }}>
                  {t.demoOtp}
                </div>
              </div>

              <button
                onClick={handlePatientLogin}
                style={{
                  width: "100%", background: "#0B6B58", color: "#fff", border: "none",
                  borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700,
                  ...heading, cursor: "pointer",
                }}
              >
                {t.loginBtn}
              </button>
            </>
          )}

          {/* ABHA Login Mode */}
          {loginMode === "abha" && abhaStep === "enter" && (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {t.abhaNumberLabel}
                </div>
                <input
                  value={abhaNumber}
                  onChange={(e) => setAbhaNumber(e.target.value)}
                  placeholder={t.abhaNumberPlaceholder}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                    borderRadius: 10, padding: "12px 14px", fontSize: 15, ...body, outline: "none",
                    color: "#111827", textAlign: "center", letterSpacing: 2,
                  }}
                />
              </div>

              <div style={{ textAlign: "center", ...body, fontSize: 12, color: C.inkSoft, marginBottom: 14 }}>{t.orDivider}</div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  {t.abhaAadhaarLabel}
                </div>
                <input
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder={t.abhaAadhaarPlaceholder}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                    borderRadius: 10, padding: "12px 14px", fontSize: 15, ...body, outline: "none",
                    color: "#111827", textAlign: "center", letterSpacing: 2,
                  }}
                />
              </div>

              {/* What is ABHA */}
              <div style={{
                background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 12,
                padding: "12px 14px", marginBottom: 14,
              }}>
                <div style={{ ...heading, fontWeight: 700, fontSize: 12.5, color: "#0369A1", marginBottom: 6 }}>{t.abhaWhatIs}</div>
                <div style={{ ...body, fontSize: 11.5, color: "#0C4A6E", lineHeight: 1.6 }}>{t.abhaWhatIsDesc}</div>
              </div>

              <button
                onClick={handleAbhaVerify}
                style={{
                  width: "100%", background: "#0B6B58", color: "#fff", border: "none",
                  borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700,
                  ...heading, cursor: "pointer", marginBottom: 10,
                }}
              >
                {t.abhaLoginBtn}
              </button>

              <div style={{ textAlign: "center" }}>
                <span style={{ ...body, fontSize: 12, color: "#7C3AED", cursor: "pointer", fontWeight: 600 }}>
                  {t.abhaCreateBtn} →
                </span>
              </div>
            </>
          )}

          {/* ABHA OTP Verification */}
          {loginMode === "abha" && abhaStep === "otp" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E4F1EC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <ShieldCheck size={26} color="#0B6B58" />
                </div>
                <div style={{ ...heading, fontWeight: 700, fontSize: 16, color: "#111827" }}>{t.abhaVerifyMobile}</div>
                <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 4 }}>
                  OTP sent to Aadhaar-linked mobile ending ****{abhaNumber.slice(-4) || "3210"}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                    borderRadius: 10, padding: "14px", fontSize: 18, ...body, outline: "none",
                    color: "#111827", textAlign: "center", letterSpacing: 6,
                  }}
                />
                <div style={{ ...body, fontSize: 11.5, color: "#7C3AED", marginTop: 6, textAlign: "center", fontWeight: 600 }}>
                  {t.abhaDemoOtp}
                </div>
              </div>

              <button
                onClick={handleAbhaOtpVerify}
                style={{
                  width: "100%", background: "#0B6B58", color: "#fff", border: "none",
                  borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700,
                  ...heading, cursor: "pointer",
                }}
              >
                {t.verifyOtpBtn}
              </button>

              <button
                onClick={() => setAbhaStep("enter")}
                style={{
                  width: "100%", background: "transparent", color: "#6B7280", border: "none",
                  padding: "12px 0", fontSize: 13, fontWeight: 600, ...body, cursor: "pointer", marginTop: 4,
                }}
              >
                {t.backToLogin}
              </button>
            </>
          )}
        </div>

        {/* Hints below card */}
        <div style={{ padding: "18px 10px", textAlign: "center" }}>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 4 }}>{t.sampleCredHint}</div>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>Available demo IDs:</div>
          <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>P001, P002, P003, P004, P005, P006, P007, P008, P010, P011, P012, P013</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DOCTOR ROLE SELECT SCREEN
--------------------------------------------------------- */
function DoctorRoleSelectScreen({ go, lang, setLang, t }) {
  const roles = [
    { key: "cho", label: t.doctorRoleCHO, sub: t.doctorRoleCHOSub, dest: "doctor_login", roleType: "cho" },
    { key: "mo", label: t.doctorRoleMO, sub: t.doctorRoleMOSub, dest: "doctor_login", roleType: "mo" },
    { key: "civil", label: t.doctorRoleCivil, sub: t.doctorRoleCivilSub, dest: "doctor_login", roleType: "civil" },
    { key: "emergency", label: t.doctorRoleEmergency, sub: t.doctorRoleEmergencySub, dest: "doctor_login", roleType: "emergency" },
  ];

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px 0" }}>
        <button onClick={() => go("role_select")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151", padding: 0 }}>
          <ChevronLeft size={22} />
        </button>
      </div>

      <div style={{ padding: "8px 20px 6px", textAlign: "center" }}>
        <SannidhyaLogo size={44} style={{ marginBottom: 4 }} />
        <div style={{ ...heading, fontSize: 16, fontWeight: 700, color: C.ink }}>{t.appName}</div>
        <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{t.doctorRoleTitle}</div>
      </div>

      <div style={{ padding: "10px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => go(r.dest, { roleType: r.roleType })}
            style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14,
              padding: "18px 16px", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, cursor: "pointer", textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)", width: "100%",
            }}
          >
            <div style={{ ...heading, fontWeight: 700, fontSize: 15, color: "#111827" }}>{r.label}</div>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{r.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DOCTOR LOGIN SCREEN
--------------------------------------------------------- */
function DoctorLoginScreen({ go, lang, setLang, t, roleType }) {
  const isMo = roleType === "mo";
  const [choId, setChoId] = useState(isMo ? "MO002" : "CHO001");
  const [otp, setOtp] = useState("123456");

  const handleLogin = () => {
    if (isMo) {
      go("mo_dashboard", { roleType });
    } else {
      go("cho_dashboard", { roleType });
    }
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 18px 0" }}>
        <button onClick={() => go("doctor_role_select")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151" }}>
          <ChevronLeft size={22} />
        </button>
      </div>

      <div style={{ padding: "10px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <SannidhyaLogo size={64} style={{ marginBottom: 6 }} />
          </div>

          <div style={{ ...heading, fontWeight: 700, fontSize: 20, color: "#111827", textAlign: "center", marginBottom: 4 }}>
            {t.doctorLoginTitle}
          </div>
          <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, textAlign: "center", marginBottom: 20 }}>
            {t.doctorLoginSub}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {isMo ? t.moIdLabel : t.choIdLabel}
            </div>
            <input
              value={choId}
              onChange={(e) => setChoId(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px", fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {t.choOtpLabel}
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px", fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center", letterSpacing: 4,
              }}
            />
            <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 4, textAlign: "center" }}>
              {t.doctorDemoOtp}
            </div>
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: "100%", background: "#111827", color: "#fff", border: "none",
              borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700,
              ...heading, cursor: "pointer",
            }}
          >
            {t.doctorLoginBtn}
          </button>
        </div>

        <div style={{ padding: "18px 10px", textAlign: "center" }}>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 4 }}>{t.doctorCredHint}</div>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.doctorAvailIds}</div>
          <div style={{ ...body, fontSize: 11.5, color: C.ink, fontWeight: 600, marginTop: 2 }}>{isMo ? t.moDemoIds : t.doctorDemoIds}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MO MOCK DATA
--------------------------------------------------------- */
const MO_MOCK_QUEUE = [
  { id: "P012", name: "सुरेश पाटिल", nameEn: "Suresh Patil", zone: "orange", age: 58, gender: "male", symptoms: ["severe headache", "blurred vision", "high BP"], wait: "15 minutes", since: "2:50:00 pm", initial: "सप" },
  { id: "P015", name: "कमला देवी", nameEn: "Kamla Devi", zone: "orange", age: 45, gender: "female", symptoms: ["abdominal pain", "fever", "weakness"], wait: "30 minutes", since: "3:10:00 pm", initial: "कद" },
];

/* ---------------------------------------------------------
   DOCTOR PROFILE SCREEN (CHO / MO)
--------------------------------------------------------- */
function DoctorProfileScreen({ go, lang, setLang, t, doctorType }) {
  const isCho = doctorType === "cho";
  const profileData = isCho ? {
    name: lang === "मराठी" ? "डॉ. श्रीवन चावण" : lang === "हिंदी" ? "डॉ. श्रीवन चावण" : "Dr. Shreeven Chavan",
    id: "CHO001",
    role: lang === "मराठी" ? "सामुदायिक स्वास्थ्य अधिकारी" : lang === "हिंदी" ? "सामुदायिक स्वास्थ्य अधिकारी" : "Community Health Officer",
    phone: "+91-9876543210",
    email: "shreeven.chavan@sannidhya.gov.in",
    qualification: lang === "मराठी" ? "MBBS, MD (सामान्य वैद्यक)" : lang === "हिंदी" ? "MBBS, MD (सामान्य वैद्यक)" : "MBBS, MD (General Medicine)",
    experience: lang === "मराठी" ? "१० वर्षे" : lang === "हिंदी" ? "१० वर्ष" : "10 years",
    hospital: lang === "मराठी" ? "सिव्हिल रुग्णालय, नाशिक" : lang === "हिंदी" ? "सिविल अस्पताल, नाशिक" : "Civil Hospital, Nashik",
    stats: { consultations: 2150, referrals: 134, surgeries: 12 },
    gradient: "linear-gradient(135deg, #0B6B58, #0891B2)",
    initials: "Dशच",
  } : {
    name: lang === "मराठी" ? "डॉ. प्रिया देशमुख" : lang === "हिंदी" ? "डॉ. प्रिया देशमुख" : "Dr. Priya Deshmukh",
    id: "MO002",
    role: lang === "मराठी" ? "वैद्यकीय अधिकारी" : lang === "हिंदी" ? "चिकित्सा अधिकारी" : "Medical Officer",
    phone: "+91-9876543255",
    email: "priya.deshmukh@sannidhya.gov.in",
    qualification: lang === "मराठी" ? "MBBS, MD (स्त्री रोग)" : lang === "हिंदी" ? "MBBS, MD (स्त्री रोग)" : "MBBS, MD (Obstetrics & Gynecology)",
    experience: lang === "मराठी" ? "१५ वर्षे" : lang === "हिंदी" ? "१५ वर्ष" : "15 years",
    hospital: lang === "मराठी" ? "सिविल हॉस्पिटल, पुणे" : lang === "हिंदी" ? "सिविल अस्पताल, पुणे" : "Civil Hospital, Pune",
    stats: { consultations: 4820, referrals: 312, surgeries: 78 },
    gradient: "linear-gradient(135deg, #DC2626, #F97316)",
    initials: "Dपद",
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => go(isCho ? "cho_dashboard" : "mo_dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151" }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: "#111827" }}>{t.myProfile}</div>
        <div style={{ width: 22 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Profile Header */}
        <div style={{ background: profileData.gradient, borderRadius: 18, padding: "24px 18px", textAlign: "center", color: "#fff" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", ...heading, fontSize: 20, fontWeight: 700 }}>
            {profileData.initials}
          </div>
          <div style={{ ...heading, fontSize: 20, fontWeight: 700 }}>{profileData.name}</div>
          <div style={{ ...body, fontSize: 13, opacity: 0.85, marginTop: 4 }}>{profileData.role} · {profileData.id}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.stats.consultations}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "परामर्श" : lang === "हिंदी" ? "परामर्श" : "Consultations"}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.stats.referrals}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "रेफरल" : lang === "हिंदी" ? "रेफरल" : "Referrals"}</div>
            </div>
            {!isCho && (
              <>
                <div style={{ width: 1, background: "rgba(255,255,255,0.3)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.stats.surgeries}</div>
                  <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "शस्त्रक्रिया" : lang === "हिंदी" ? "सर्जरी" : "Surgeries"}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>{lang === "मराठी" ? "माहिती" : lang === "हिंदी" ? "जानकारी" : "Information"}</div>
          {[
            { label: lang === "मराठी" ? "फोन" : lang === "हिंदी" ? "फ़ोन" : "Phone", value: profileData.phone },
            { label: "Email", value: profileData.email },
            { label: lang === "मराठी" ? "शैक्षणिक पात्रता" : lang === "हिंदी" ? "शैक्षिक योग्यता" : "Qualification", value: profileData.qualification },
            { label: lang === "मराठी" ? "अनुभव" : lang === "हिंदी" ? "अनुभव" : "Experience", value: profileData.experience },
            { label: lang === "मराठी" ? "हॉस्पिटल" : lang === "हिंदी" ? "अस्पताल" : "Hospital", value: profileData.hospital },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ ...body, fontSize: 13, color: "#6B7280" }}>{item.label}</span>
              <span style={{ ...body, fontSize: 13, color: "#111827", fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={() => go("role_select")} style={{ width: "100%", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: 12, padding: "14px 0", ...heading, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <LogOut size={16} color="#DC2626" /> {t.logout}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MO DASHBOARD SCREEN
--------------------------------------------------------- */
function MoDashboardScreen({ go, lang, setLang, t }) {
  const [statusAvailable, setStatusAvailable] = useState(true);

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #2563EB, #10B981)",
        padding: "16px", color: "#fff", borderRadius: "0 0 20px 20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              ...heading, fontSize: 16, fontWeight: 700,
            }}>
              Dपद
            </div>
            <div>
              <div style={{ ...heading, fontSize: 16, fontWeight: 700 }}>Dr. प्रिया देशमुख</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.85 }}>{t.moDashRole}</div>
              <div style={{ ...body, fontSize: 10, opacity: 0.65 }}>MO002</div>
            </div>
          </div>
          <button onClick={() => go("doctor_profile", { type: "mo" })} style={{
            background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8,
            padding: "6px 10px", color: "#fff", display: "flex", alignItems: "center",
            gap: 4, fontSize: 11, cursor: "pointer", ...body,
          }}>
            <User size={13} /> {t.myProfile}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
        {/* Status */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: 12,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827" }}>Status</div>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>
              {statusAvailable ? "You are available for consultations" : "You are busy"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...body, fontSize: 12, color: "#16A34A", fontWeight: 600 }}>{t.choStatusAvailable}</span>
            <div
              onClick={() => setStatusAvailable(!statusAvailable)}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                background: statusAvailable ? "#111827" : "#D1D5DB",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 2, left: statusAvailable ? 22 : 2,
                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { icon: <Calendar size={22} color="#2563EB" />, num: 0, label: t.moDashToday },
            { icon: <Clock size={22} color="#F97316" />, num: 2, label: t.moDashQueue },
            { icon: <Users size={22} color="#10B981" />, num: 8, label: t.moDashWaiting },
          ].map((s, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 12, padding: "14px 10px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "center",
            }}>
              <div style={{ marginBottom: 6 }}>{s.icon}</div>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: "#111827" }}>{s.num}</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <button onClick={() => go("mo_patient_queue")} style={{
            background: "#fff", borderRadius: 12, padding: "14px", border: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "left", cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Users size={16} color="#111827" />
              <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.moDashPatientQueue}</span>
            </div>
            <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginBottom: 6 }}>{t.moDashPatientQueueSub}</div>
            <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>2 {t.moDashPatientsWaiting}</div>
          </button>

          <button style={{
            background: "#fff", borderRadius: 12, padding: "14px", border: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)", textAlign: "left", cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Stethoscope size={16} color="#111827" />
              <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.moDashQuickConsult}</span>
            </div>
            <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginBottom: 6 }}>{t.moDashQuickConsultSub}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.moDashReady}</span>
              <CheckCircle size={14} color="#10B981" />
            </div>
          </button>
        </div>

        {/* Recent Consultations */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>{t.moDashRecent}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { icon: "🩺", title: lang === "मराठी" ? "परामर्श दिला" : lang === "हिंदी" ? "परामर्श दिया" : "Consultation given", patient: "सुरेश पाटिल (P012)", time: lang === "मराठी" ? "आज, ११:०० AM" : lang === "हिंदी" ? "आज, 11:00 AM" : "Today, 11:00 AM", color: "#065F46" },
              { icon: "📋", title: lang === "मराठी" ? "प्रिस्क्रिप्शन लिहिले" : lang === "हिंदी" ? "प्रिस्क्रिप्शन लिखा" : "Prescription written", patient: "कमला देवी (P015)", time: lang === "मराठी" ? "आज, १०:१५ AM" : lang === "हिंदी" ? "आज, 10:15 AM" : "Today, 10:15 AM", color: "#1D4ED8" },
              { icon: "🔄", title: lang === "मराठी" ? "रेफरल पाठवले" : lang === "हिंदी" ? "रेफरल भेजा" : "Referral sent", patient: "रामदास जाधव (P018)", time: lang === "मराठी" ? "काल, ५:३० PM" : lang === "हिंदी" ? "कल, 5:30 PM" : "Yesterday, 5:30 PM", color: "#DC2626" },
              { icon: "✅", title: lang === "मराठी" ? "सर्वेक्षण पूर्ण" : lang === "हिंदी" ? "सर्वेक्षण पूर्ण" : "Survey completed", patient: "सरिता भोसले (P020)", time: lang === "मराठी" ? "काल, ३:०० PM" : lang === "हिंदी" ? "कल, 3:00 PM" : "Yesterday, 3:00 PM", color: "#16A34A" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...heading, fontSize: 12, fontWeight: 600, color: "#111827" }}>{a.title}</div>
                  <div style={{ ...body, fontSize: 11, color: "#6B7280", marginTop: 2 }}>{a.patient}</div>
                </div>
                <div style={{ ...body, fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MO PATIENT QUEUE SCREEN
--------------------------------------------------------- */
function MoPatientQueueScreen({ go, lang, setLang, t }) {
  const [patients, setPatients] = useState(MO_MOCK_QUEUE);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const startConsult = (p) => {
    go("mo_consultation", { patient: p });
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => go("mo_dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151", padding: 0 }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Stethoscope size={16} color="#111827" />
            <span style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827" }}>{t.moQueueTitle}</span>
          </div>
          <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{patients.length} patients</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {patients.map((p, i) => (
          <div key={p.id} style={{
            background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10,
            padding: "12px", marginBottom: 10,
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 50 }}>
                <span style={{ ...heading, fontSize: 14, fontWeight: 700, color: C.teal }}>#{String(i + 1).padStart(2, "0")}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: "#DBEAFE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  ...heading, fontSize: 11, fontWeight: 700, color: "#2563EB", marginTop: 4,
                }}>
                  {p.initial}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ ...heading, fontSize: 14, fontWeight: 700, color: "#111827" }}>{p.name}</span>
                  <span style={{ background: "#F97316", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, ...heading }}>ORANGE</span>
                </div>
                <div style={{ ...body, fontSize: 11, color: "#374151", marginBottom: 2 }}>Patient ID: {p.id}</div>
                <div style={{ ...body, fontSize: 11, color: "#374151", marginBottom: 2 }}>Age: {p.age}, Gender: {p.gender}</div>
                <div style={{ ...body, fontSize: 11, color: "#374151", marginBottom: 4 }}>Symptoms: {p.symptoms.join(", ")}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                  <Clock size={12} color="#6B7280" />
                  <span style={{ ...body, fontSize: 11, color: "#6B7280" }}>{t.moQueueEstWait} {p.wait}</span>
                </div>
                <div style={{ ...body, fontSize: 10, color: "#9CA3AF" }}>{t.moQueueSince}: {p.since}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => startConsult(p)} style={{
                flex: 1, background: "#111827", color: "#fff", border: "none",
                borderRadius: 7, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", ...heading,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                <Stethoscope size={13} /> {t.moQueueStartConsult}
              </button>
              <button onClick={() => showToast("Patient tagged as emergency successfully!")} style={{
                flex: 1, background: "#DC2626", color: "#fff", border: "none",
                borderRadius: 7, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", ...heading,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                <AlertTriangle size={13} /> {t.moQueueTagEmergency}
              </button>
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#DC2626", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", ...heading }}>
          <AlertTriangle size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   MO CONSULTATION SCREEN
--------------------------------------------------------- */
function MoConsultationScreen({ go, lang, setLang, t, patient }) {
  const [activeTab, setActiveTab] = useState("history");
  const [showRedirect, setShowRedirect] = useState(false);
  const [duration, setDuration] = useState(5);
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [vitals, setVitals] = useState({ bp: "120/80", hr: "72", temp: "98.6", weight: "70", height: "170", o2: "98" });
  const [commMode, setCommMode] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [callTimer, setCallTimer] = useState(0);
  const [toast, setToast] = useState(null);
  const chatEndRef = useRef(null);

  const p = patient || MO_MOCK_QUEUE[0];

  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (commMode === "voice") {
      const timer = setInterval(() => setCallTimer(s => s + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [commMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  const updateMedicine = (i, f, v) => { const u = [...medicines]; u[i][f] = v; setMedicines(u); };
  const removeMedicine = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));

  const fmtDur = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const handleRedirectCivil = () => { setShowRedirect(false); showToast("Patient redirected to Civil Hospital successfully!"); };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: "doctor", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: "patient", text: "Doctor, I understand. Thank you." }]);
    }, 1500);
  };

  if (commMode === "voice") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#1a1a2e", zIndex: 9999, display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E4F1EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...heading, fontSize: 24, fontWeight: 700, color: C.teal }}>{p.initial}</span>
          </div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{p.name}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{p.id} • {p.age}y • {p.gender}</div>
          <div style={{ color: "#4ADE80", fontSize: 13, marginTop: 4 }}>🟢 {fmtDur(callTimer)}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Volume2 size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Speaker</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MicOff size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Mute</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 24px 24px" }}>
          <button onClick={() => { setCommMode(null); setCallTimer(0); }} style={{
            width: "100%", padding: "16px", borderRadius: 14, background: "#DC2626",
            color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <PhoneOff size={18} /> End Call
          </button>
        </div>
      </div>
    );
  }

  if (commMode === "chat") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#F8FAFC", zIndex: 9999, display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setCommMode(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151" }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E4F1EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...heading, fontSize: 12, fontWeight: 700, color: C.teal }}>{p.initial}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...heading, fontSize: 14, fontWeight: 700, color: "#111827" }}>{p.name}</div>
            <div style={{ ...body, fontSize: 10, color: "#16A34A" }}>Online</div>
          </div>
          <MessageCircle size={18} color="#6B7280" />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {chatMessages.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <MessageCircle size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
              <div style={{ ...body, fontSize: 13, color: C.inkSoft }}>Start chatting with {p.name}</div>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.from === "doctor" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%", padding: "10px 14px", borderRadius: 14,
                background: msg.from === "doctor" ? "#0B6B58" : "#fff",
                color: msg.from === "doctor" ? "#fff" : "#111827",
                border: msg.from === "doctor" ? "none" : "1px solid #E5E7EB",
                fontSize: 13, ...body, lineHeight: 1.5,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, background: "#F3F4F6", border: "none", borderRadius: 20, padding: "10px 14px", fontSize: 13, ...body, outline: "none" }}
          />
          <button onClick={sendChatMessage} style={{
            width: 40, height: 40, borderRadius: "50%", background: "#0B6B58",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" /></svg>
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "history", label: t.consultHistory },
    { key: "vitals", label: t.consultVitals },
    { key: "exam", label: t.consultExamination },
    { key: "rx", label: t.consultPrescription },
  ];

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => go("mo_patient_queue")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151", padding: 0 }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827" }}>{t.consultTitle}</div>
          <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.consultDuration} {fmtDur(duration)}</div>
        </div>
        <button onClick={() => setShowRedirect(true)} style={{
          background: "#0B6B58", color: "#fff", border: "none", borderRadius: 7,
          padding: "6px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer", ...heading,
        }}>
          Redirect
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {/* Patient Card */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "12px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#E4F1EC",
              display: "flex", alignItems: "center", justifyContent: "center",
              ...heading, fontSize: 12, fontWeight: 700, color: C.teal, flexShrink: 0,
            }}>
              {p.initial}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{p.name}</span>
                <span style={{ background: "#F97316", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, ...heading }}>ORANGE</span>
              </div>
              <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{p.id} • {p.age}y • {p.gender}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
            {p.symptoms.map((s, i) => (
              <span key={i} style={{ background: "#F3F4F6", borderRadius: 5, padding: "2px 7px", fontSize: 10, ...body, color: "#374151" }}>{s}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={() => go("cho_video_consult", { patient: p })} style={{ flex: 1, background: "#2563EB", color: "#fff", border: "none", borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
              <Video size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Video
            </button>
            <button onClick={() => setCommMode("voice")} style={{ flex: 1, background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
              <PhoneCall size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Voice
            </button>
            <button onClick={() => setCommMode("chat")} style={{ flex: 1, background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
              <MessageCircle size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Chat
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 3, marginBottom: 10 }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer",
              ...heading, fontSize: 11, fontWeight: 600,
              background: activeTab === tab.key ? "#fff" : "transparent",
              color: activeTab === tab.key ? "#111827" : "#6B7280",
              boxShadow: activeTab === tab.key ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "history" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>{t.consultPatientOverview}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { l: t.consultFirstReg, v: "March 15, 2024" },
                { l: t.consultTotalConsults, v: "1" },
                { l: t.consultLastVisit, v: t.consultFirstVisit },
                { l: t.consultEmergencyVisits, v: "0" },
              ].map((r) => (
                <div key={r.l}>
                  <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{r.l}</div>
                  <div style={{ ...heading, fontSize: 12, fontWeight: 600, color: "#111827" }}>{r.v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, padding: "10px", marginTop: 12 }}>
              <div style={{ ...heading, fontWeight: 700, fontSize: 12, color: "#0369A1", marginBottom: 6 }}>{t.consultToday}</div>
              <div style={{ ...body, fontSize: 11, color: "#0C4A6E" }}>9/9/2026 • {t.consultDuration} {fmtDur(duration)} • ORANGE</div>
            </div>
          </div>
        )}

        {activeTab === "vitals" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>{t.vitalsTitle}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { key: "bp", label: t.vitalsBP },
                { key: "hr", label: t.vitalsHR },
                { key: "temp", label: t.vitalsTemp },
                { key: "weight", label: t.vitalsWeight },
                { key: "height", label: t.vitalsHeight },
                { key: "o2", label: t.vitalsO2 },
              ].map((v) => (
                <div key={v.key}>
                  <div style={{ ...body, fontSize: 10, color: C.inkSoft, marginBottom: 3 }}>{v.label}</div>
                  <input value={vitals[v.key]} onChange={(e) => setVitals({ ...vitals, [v.key]: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, ...body, outline: "none", color: "#111827" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "exam" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>{t.examTitle}</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ ...body, fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{t.examDiagnosis}</div>
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder={t.examDiagnosisPlaceholder}
                style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, ...body, outline: "none" }} />
            </div>
            <div>
              <div style={{ ...body, fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{t.examNotes}</div>
              <textarea value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} placeholder={t.examNotesPlaceholder} rows={4}
                style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, ...body, outline: "none", resize: "vertical" }} />
            </div>
          </div>
        )}

        {activeTab === "rx" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.rxTitle}</span>
              <button onClick={addMedicine} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
                + {t.rxAddMedicine}
              </button>
            </div>
            {medicines.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <FileText size={32} color="#D1D5DB" style={{ margin: "0 auto 8px" }} />
                <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 10 }}>{t.rxNoMeds}</div>
                <button onClick={addMedicine} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", ...heading }}>
                  {t.rxAddFirst}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {medicines.map((med, i) => (
                  <div key={i} style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ ...heading, fontWeight: 600, fontSize: 12 }}>Medicine {i + 1}</span>
                      <button onClick={() => removeMedicine(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}><X size={14} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxMedName}</div>
                        <input value={med.name} onChange={(e) => updateMedicine(i, "name", e.target.value)} placeholder={t.rxSelectMed}
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxDosage}</div>
                        <input value={med.dosage} onChange={(e) => updateMedicine(i, "dosage", e.target.value)} placeholder="500mg"
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxFrequency}</div>
                        <input value={med.frequency} onChange={(e) => updateMedicine(i, "frequency", e.target.value)} placeholder="Twice daily"
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxDuration}</div>
                        <input value={med.duration} onChange={(e) => updateMedicine(i, "duration", e.target.value)} placeholder="7 days"
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxInstructions}</div>
                      <input value={med.instructions} onChange={(e) => updateMedicine(i, "instructions", e.target.value)} placeholder="Take after meals"
                        style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Redirect Modal - Only Civil Hospital */}
      {showRedirect && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px", maxWidth: 360, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={18} color="#2563EB" />
                <span style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827" }}>{t.moRedirectTitle}</span>
              </div>
              <button onClick={() => setShowRedirect(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color="#6B7280" /></button>
            </div>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.moRedirectChoose}</div>
              <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginTop: 3 }}>{p.name} ({p.id})</div>
              <span style={{ background: "#FED7AA", color: "#9A3412", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, ...heading, marginTop: 4, display: "inline-block" }}>Current Priority: ORANGE</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <button onClick={handleRedirectCivil} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316" }} />
                  <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.moRedirectCivil}</span>
                </div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginLeft: 16 }}>{t.moRedirectCivilDesc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 16, marginTop: 6 }}>
                  <span style={{ ...body, fontSize: 11, color: C.inkSoft }}>Dr. अनिल जोशी</span>
                  <span style={{ ...body, fontSize: 11, color: C.inkSoft }}>30-45 mins</span>
                </div>
              </button>
            </div>
            <button onClick={() => setShowRedirect(false)} style={{ width: "100%", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", ...heading }}>
              {t.moRedirectCancel}
            </button>
          </div>
        </div>
      )}
      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#065F46", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", ...heading }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   CHO DASHBOARD SCREEN
--------------------------------------------------------- */
const MOCK_QUEUE = [
  { id: "P003", name: "मोहन गुप्ता", nameEn: "Mohan Gupta", zone: "yellow", age: 55, gender: "male", symptoms: ["cold", "cough", "sore throat"], wait: "15 minutes", since: "3:00:00 pm", initial: "मग" },
  { id: "P002", name: "सीता देवी", nameEn: "Sita Devi", zone: "yellow", age: 32, gender: "female", symptoms: ["mild fever", "runny nose"], wait: "45 minutes", since: "3:45:00 pm", initial: "सद" },
  { id: "P007", name: "अनिल शर्मा", nameEn: "Anil Sharma", zone: "yellow", age: 40, gender: "male", symptoms: ["minor headache", "mild fatigue"], wait: "60 minutes", since: "4:00:00 pm", initial: "अश" },
];

function ChoDashboardScreen({ go, lang, setLang, t, roleType }) {
  const [statusAvailable, setStatusAvailable] = useState(true);

  const recentActivities = [
    { icon: "🩺", title: lang === "मराठी" ? "परामर्श दिला" : lang === "हिंदी" ? "परामर्श दिया" : "Consultation given", patient: "मोहन गुप्ता (P003)", time: lang === "मराठी" ? "आज, १०:३० AM" : lang === "हिंदी" ? "आज, 10:30 AM" : "Today, 10:30 AM", color: "#065F46" },
    { icon: "📋", title: lang === "मराठी" ? "प्रिस्क्रिप्शन लिहिले" : lang === "हिंदी" ? "प्रिस्क्रिप्शन लिखा" : "Prescription written", patient: "सीता देवी (P002)", time: lang === "मराठी" ? "आज, ९:४५ AM" : lang === "हिंदी" ? "आज, 9:45 AM" : "Today, 9:45 AM", color: "#1D4ED8" },
    { icon: "🔄", title: lang === "मराठी" ? "रेफरल पाठवले" : lang === "हिंदी" ? "रेफरल भेजा" : "Referral sent", patient: "अनिल शर्मा (P007)", time: lang === "मराठी" ? "काल, ४:१५ PM" : lang === "हिंदी" ? "कल, 4:15 PM" : "Yesterday, 4:15 PM", color: "#DC2626" },
    { icon: "✅", title: lang === "मराठी" ? "सर्वेक्षण पूर्ण" : lang === "हिंदी" ? "सर्वेक्षण पूर्ण" : "Survey completed", patient: "रमा देवी (P005)", time: lang === "मराठी" ? "काल, २:०० PM" : lang === "हिंदी" ? "कल, 2:00 PM" : "Yesterday, 2:00 PM", color: "#16A34A" },
    { icon: "📞", title: lang === "मराठी" ? "फोन परामर्श" : lang === "हिंदी" ? "फ़ोन परामर्श" : "Phone consultation", patient: "गीता बाई (P011)", time: lang === "मराठी" ? "२ दिवस पूर्व" : lang === "हिंदी" ? "२ दिन पहले" : "2 days ago", color: "#7C3AED" },
  ];

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0B6B58, #0891B2)",
        padding: "16px", color: "#fff",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              ...heading, fontSize: 16, fontWeight: 700,
            }}>
              Dशच
            </div>
            <div>
              <div style={{ ...heading, fontSize: 16, fontWeight: 700 }}>Dr. श्रीवन चावण</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.85 }}>{t.choDashRole}</div>
              <div style={{ ...body, fontSize: 10, opacity: 0.65 }}>CHO001</div>
            </div>
          </div>
          <button onClick={() => go("doctor_profile", { type: "cho" })} style={{
            background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8,
            padding: "6px 10px", color: "#fff", display: "flex", alignItems: "center",
            gap: 4, fontSize: 11, cursor: "pointer", ...body,
          }}>
            <User size={13} /> {t.myProfile}
          </button>
        </div>
      </div>

      <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 12, flex: 1, overflowY: "auto" }}>
        {/* Status */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827" }}>Status</div>
              <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.choStatusDesc}</div>
            </div>
            <button
              onClick={() => setStatusAvailable(!statusAvailable)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: "none",
                background: statusAvailable ? "#0B6B58" : "#D1D5DB",
                cursor: "pointer", position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 2, left: statusAvailable ? 22 : 2,
                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: <Calendar size={18} color="#0B6B58" />, num: 0, label: t.choTodayConsult },
            { icon: <Clock size={18} color="#EA580C" />, num: 4, label: t.choYourQueue },
            { icon: <Users size={18} color="#16A34A" />, num: 9, label: t.choTotalWaiting },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "10px 6px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom: 4 }}>{s.icon}</div>
              <div style={{ ...heading, fontWeight: 700, fontSize: 18, color: "#111827" }}>{s.num}</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft, marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <button onClick={() => go("cho_patient_queue")} style={{
          background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
          padding: "14px", textAlign: "left", cursor: "pointer", width: "100%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Users size={15} color="#111827" />
            <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.choPatientQueue}</span>
          </div>
          <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>4 {t.choPatientsWaiting}</div>
        </button>

        <button onClick={() => go("cho_consultation")} style={{
          background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
          padding: "14px", textAlign: "left", cursor: "pointer", width: "100%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Activity size={15} color="#111827" />
            <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.choQuickConsult}</span>
          </div>
          <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.choQuickConsultDesc}</div>
        </button>

        {/* Recent Activities */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>{t.recentActivity}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < recentActivities.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...heading, fontSize: 12, fontWeight: 600, color: "#111827" }}>{a.title}</div>
                  <div style={{ ...body, fontSize: 11, color: "#6B7280", marginTop: 2 }}>{a.patient}</div>
                </div>
                <div style={{ ...body, fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={() => go("role_select")} style={{
          background: "none", border: "1px solid #E2E8F0", borderRadius: 10,
          padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          ...heading, color: "#374151", textAlign: "center", marginTop: 8,
        }}>
          {t.logOut || "Logout"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CHO PATIENT QUEUE SCREEN
--------------------------------------------------------- */
function ChoPatientQueueScreen({ go, lang, setLang, t }) {
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <button onClick={() => go("cho_dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151", padding: 0 }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827" }}>{t.pQueueTitle}</div>
      </div>

      <div style={{ flex: 1, padding: "12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: <Users size={18} color="#0B6B58" />, num: 4, label: t.choYourQueue },
            { icon: <AlertTriangle size={18} color="#EA580C" />, num: 5, label: t.pQueueOrangeCases },
            { icon: <Clock size={18} color="#EA580C" />, num: "39m", label: t.pQueueAvgWait },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "10px 6px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom: 4 }}>{s.icon}</div>
              <div style={{ ...heading, fontWeight: 700, fontSize: 18, color: "#111827" }}>{s.num}</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Doctor Status */}
        <div style={{
          background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "12px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
                <span style={{ ...body, fontSize: 12, fontWeight: 600, color: "#065F46" }}>{t.pQueueAvailable}</span>
              </div>
              <div style={{ ...body, fontSize: 10, color: "#065F46", marginTop: 2, opacity: 0.8 }}>
                {t.pQueueReadyText} • {t.pQueueAvgConsTime}
              </div>
            </div>
            <span style={{
              background: "#16A34A", color: "#fff", fontSize: 9, fontWeight: 700,
              padding: "3px 8px", borderRadius: 5, ...heading,
            }}>
              {t.pQueueOnline}
            </span>
          </div>
        </div>

        {/* Patient Queue */}
        {MOCK_QUEUE.map((p, i) => (
          <div key={p.id} style={{
            background: "#fff", borderRadius: 10, padding: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ ...body, fontSize: 12, color: C.inkSoft, fontWeight: 600, minWidth: 24 }}>#{i + 1}</div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: "#E4F1EC",
                display: "flex", alignItems: "center", justifyContent: "center",
                ...heading, fontSize: 11, fontWeight: 700, color: C.teal, flexShrink: 0,
              }}>
                {p.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{p.name}</span>
                  <span style={{
                    background: "#FEF9C3", color: "#92400E", fontSize: 9, fontWeight: 700,
                    padding: "2px 6px", borderRadius: 4, ...heading,
                  }}>
                    {p.zone.toUpperCase()}
                  </span>
                </div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginTop: 2 }}>{p.id} • Age: {p.age} • {p.gender}</div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>Symptoms: {p.symptoms.join(", ")}</div>
                <div style={{ ...body, fontSize: 10, color: C.inkSoft, marginTop: 3 }}>
                  <Clock size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />
                  Est. Wait: {p.wait}
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button onClick={() => go("cho_consultation", { patient: p })} style={{
                    flex: 1, background: "#111827", color: "#fff", border: "none",
                    borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600,
                    cursor: "pointer", ...heading,
                  }}>
                    Start Consultation
                  </button>
                  <button onClick={() => showToast("Patient tagged as emergency successfully!")} style={{
                    flex: 1, background: "#DC2626", color: "#fff", border: "none",
                    borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600,
                    cursor: "pointer", ...heading,
                  }}>
                    Tag Emergency
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#DC2626", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", ...heading }}>
          <AlertTriangle size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   CHO CONSULTATION SCREEN
--------------------------------------------------------- */
function ChoConsultationScreen({ go, lang, setLang, t, patient }) {
  const [activeTab, setActiveTab] = useState("history");
  const [showRedirect, setShowRedirect] = useState(false);
  const [duration, setDuration] = useState(11);
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [vitals, setVitals] = useState({ bp: "120/80", hr: "72", temp: "98.6", weight: "70", height: "170", o2: "98" });
  const [commMode, setCommMode] = useState(null); // null | "voice" | "chat"
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [callTimer, setCallTimer] = useState(0);
  const [toast, setToast] = useState(null);
  const chatEndRef = useRef(null);

  const p = patient || MOCK_QUEUE[0];

  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (commMode === "voice") {
      const timer = setInterval(() => setCallTimer(s => s + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [commMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  const updateMedicine = (i, f, v) => { const u = [...medicines]; u[i][f] = v; setMedicines(u); };
  const removeMedicine = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));

  const fmtDur = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const handleRedirectMO = () => { setShowRedirect(false); showToast("Patient redirected to Medical Officer successfully!"); };
  const handleRedirectCivil = () => { setShowRedirect(false); showToast("Patient redirected to Civil Hospital successfully!"); };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: "doctor", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: "patient", text: "Doctor, I understand. Thank you." }]);
    }, 1500);
  };

  // Voice Call Screen
  if (commMode === "voice") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#1a1a2e", zIndex: 9999, display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E4F1EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...heading, fontSize: 24, fontWeight: 700, color: C.teal }}>{p.initial}</span>
          </div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{p.name}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{p.id} • {p.age}y • {p.gender}</div>
          <div style={{ color: "#4ADE80", fontSize: 13, marginTop: 4 }}>🟢 {fmtDur(callTimer)}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Volume2 size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Speaker</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MicOff size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Mute</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 24px 24px" }}>
          <button onClick={() => setCommMode(null)} style={{
            width: "100%", padding: "16px", borderRadius: 14, background: "#DC2626",
            color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <PhoneOff size={18} /> End Call
          </button>
        </div>
      </div>
    );
  }

  // Chat Screen
  if (commMode === "chat") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#F8FAFC", zIndex: 9999, display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setCommMode(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151" }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E4F1EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...heading, fontSize: 12, fontWeight: 700, color: C.teal }}>{p.initial}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...heading, fontSize: 14, fontWeight: 700, color: "#111827" }}>{p.name}</div>
            <div style={{ ...body, fontSize: 10, color: "#16A34A" }}>Online</div>
          </div>
          <MessageCircle size={18} color="#6B7280" />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {chatMessages.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <MessageCircle size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
              <div style={{ ...body, fontSize: 13, color: C.inkSoft }}>Start chatting with {p.name}</div>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.from === "doctor" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "75%", padding: "10px 14px", borderRadius: 14,
                background: msg.from === "doctor" ? "#0B6B58" : "#fff",
                color: msg.from === "doctor" ? "#fff" : "#111827",
                border: msg.from === "doctor" ? "none" : "1px solid #E5E7EB",
                fontSize: 13, ...body, lineHeight: 1.5,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, background: "#F3F4F6", border: "none", borderRadius: 20, padding: "10px 14px", fontSize: 13, ...body, outline: "none" }}
          />
          <button onClick={sendChatMessage} style={{
            width: 40, height: 40, borderRadius: "50%", background: "#0B6B58",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" /></svg>
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "history", label: t.consultHistory },
    { key: "vitals", label: t.consultVitals },
    { key: "exam", label: t.consultExamination },
    { key: "rx", label: t.consultPrescription },
  ];

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => go("cho_patient_queue")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#374151", padding: 0 }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827" }}>{t.consultTitle}</div>
          <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{t.consultDuration} {fmtDur(duration)}</div>
        </div>
        <button onClick={() => setShowRedirect(true)} style={{
          background: "#0B6B58", color: "#fff", border: "none", borderRadius: 7,
          padding: "6px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer", ...heading,
        }}>
          Redirect
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
        {/* Patient Card */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "12px", marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#E4F1EC",
              display: "flex", alignItems: "center", justifyContent: "center",
              ...heading, fontSize: 12, fontWeight: 700, color: C.teal, flexShrink: 0,
            }}>
              {p.initial}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{p.name}</span>
                <span style={{ background: "#FEF9C3", color: "#92400E", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, ...heading }}>{p.zone.toUpperCase()}</span>
              </div>
              <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{p.id} • {p.age}y • {p.gender}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
            {p.symptoms.map((s, i) => (
              <span key={i} style={{ background: "#F3F4F6", borderRadius: 5, padding: "2px 7px", fontSize: 10, ...body, color: "#374151" }}>{s}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={() => go("cho_video_consult", { patient: p })} style={{ flex: 1, background: "#2563EB", color: "#fff", border: "none", borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
              <Video size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Video
            </button>
            <button onClick={() => setCommMode("voice")} style={{ flex: 1, background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
              <PhoneCall size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Voice
            </button>
            <button onClick={() => setCommMode("chat")} style={{ flex: 1, background: "#fff", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 7, padding: "8px 0", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
              <MessageCircle size={12} style={{ verticalAlign: "middle", marginRight: 4 }} /> Chat
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 3, marginBottom: 10 }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer",
              ...heading, fontSize: 11, fontWeight: 600,
              background: activeTab === tab.key ? "#fff" : "transparent",
              color: activeTab === tab.key ? "#111827" : "#6B7280",
              boxShadow: activeTab === tab.key ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "history" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>{t.consultPatientOverview}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { l: t.consultFirstReg, v: "March 15, 2024" },
                { l: t.consultTotalConsults, v: "1" },
                { l: t.consultLastVisit, v: t.consultFirstVisit },
                { l: t.consultEmergencyVisits, v: "0" },
              ].map((r) => (
                <div key={r.l}>
                  <div style={{ ...body, fontSize: 10, color: C.inkSoft }}>{r.l}</div>
                  <div style={{ ...heading, fontSize: 12, fontWeight: 600, color: "#111827" }}>{r.v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, padding: "10px", marginTop: 12 }}>
              <div style={{ ...heading, fontWeight: 700, fontSize: 12, color: "#0369A1", marginBottom: 6 }}>{t.consultToday}</div>
              <div style={{ ...body, fontSize: 11, color: "#0C4A6E" }}>9/9/2026 • {t.consultDuration} {fmtDur(duration)} • {p.zone.toUpperCase()}</div>
            </div>
          </div>
        )}

        {activeTab === "vitals" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>{t.vitalsTitle}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { key: "bp", label: t.vitalsBP },
                { key: "hr", label: t.vitalsHR },
                { key: "temp", label: t.vitalsTemp },
                { key: "weight", label: t.vitalsWeight },
                { key: "height", label: t.vitalsHeight },
                { key: "o2", label: t.vitalsO2 },
              ].map((v) => (
                <div key={v.key}>
                  <div style={{ ...body, fontSize: 10, color: C.inkSoft, marginBottom: 3 }}>{v.label}</div>
                  <input value={vitals[v.key]} onChange={(e) => setVitals({ ...vitals, [v.key]: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, ...body, outline: "none", color: "#111827" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "exam" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>{t.examTitle}</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ ...body, fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{t.examDiagnosis}</div>
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder={t.examDiagnosisPlaceholder}
                style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, ...body, outline: "none" }} />
            </div>
            <div>
              <div style={{ ...body, fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{t.examNotes}</div>
              <textarea value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} placeholder={t.examNotesPlaceholder} rows={4}
                style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, ...body, outline: "none", resize: "vertical" }} />
            </div>
          </div>
        )}

        {activeTab === "rx" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.rxTitle}</span>
              <button onClick={addMedicine} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", ...heading }}>
                + {t.rxAddMedicine}
              </button>
            </div>
            {medicines.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <FileText size={32} color="#D1D5DB" style={{ margin: "0 auto 8px" }} />
                <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 10 }}>{t.rxNoMeds}</div>
                <button onClick={addMedicine} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", ...heading }}>
                  {t.rxAddFirst}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {medicines.map((med, i) => (
                  <div key={i} style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ ...heading, fontWeight: 600, fontSize: 12 }}>Medicine {i + 1}</span>
                      <button onClick={() => removeMedicine(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626" }}><X size={14} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxMedName}</div>
                        <input value={med.name} onChange={(e) => updateMedicine(i, "name", e.target.value)} placeholder={t.rxSelectMed}
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxDosage}</div>
                        <input value={med.dosage} onChange={(e) => updateMedicine(i, "dosage", e.target.value)} placeholder="500mg"
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxFrequency}</div>
                        <input value={med.frequency} onChange={(e) => updateMedicine(i, "frequency", e.target.value)} placeholder="Twice daily"
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                      <div>
                        <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxDuration}</div>
                        <input value={med.duration} onChange={(e) => updateMedicine(i, "duration", e.target.value)} placeholder="7 days"
                          style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                      </div>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <div style={{ ...body, fontSize: 9, color: C.inkSoft }}>{t.rxInstructions}</div>
                      <input value={med.instructions} onChange={(e) => updateMedicine(i, "instructions", e.target.value)} placeholder="Take after meals"
                        style={{ width: "100%", boxSizing: "border-box", background: "#F3F4F6", border: "none", borderRadius: 5, padding: "6px 8px", fontSize: 11, ...body, outline: "none" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Redirect Modal */}
      {showRedirect && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px", maxWidth: 360, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827" }}>{t.redirectTitle}</span>
              <button onClick={() => setShowRedirect(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color="#6B7280" /></button>
            </div>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.redirectChoose}</div>
              <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginTop: 3 }}>{p.name} ({p.id})</div>
              <span style={{ background: "#FEF9C3", color: "#92400E", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, ...heading, marginTop: 4, display: "inline-block" }}>{p.zone.toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              <button onClick={handleRedirectMO} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px", textAlign: "left", cursor: "pointer", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8A23A" }} />
                  <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.redirectMO}</span>
                </div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginLeft: 13 }}>Dr. प्रिया देशमुख • {t.redirectMOTime}</div>
              </button>
              <button onClick={handleRedirectCivil} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px", textAlign: "left", cursor: "pointer", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EA580C" }} />
                  <span style={{ ...heading, fontWeight: 700, fontSize: 13, color: "#111827" }}>{t.redirectCivil}</span>
                </div>
                <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginLeft: 13 }}>Dr. विक्रम पाटिल • {t.redirectCivilTime}</div>
              </button>
            </div>
            <button onClick={() => setShowRedirect(false)} style={{ width: "100%", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", ...heading }}>
              {t.redirectCancel}
            </button>
          </div>
        </div>
      )}
      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#065F46", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", ...heading }}>
          <CheckCircle size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   CHO VIDEO CONSULTATION SCREEN
--------------------------------------------------------- */
function ChoVideoConsultScreen({ go, lang, setLang, t, patient, doctorType }) {
  const [duration, setDuration] = useState(9);
  const [notes, setNotes] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: "patient", text: "Hello Doctor, I have chest pain and difficulty breathing.", time: "10:32 AM" },
    { id: 2, from: "doctor", text: "I understand. Please stay calm. When did this pain start? Is it sharp or dull?", time: "10:33 AM" },
    { id: 3, from: "patient", text: "Started about 20 minutes ago. The pain is sharp and feels like pressure.", time: "10:34 AM" },
    { id: 4, from: "doctor", text: "⚠ This could be serious. Please sit down immediately and try to breathe deeply. I want to see you on video call right away.", time: "10:35 AM" },
  ]);

  const p = patient || MOCK_QUEUE[0];

  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmtDur = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setChatMessages([...chatMessages, { id: Date.now(), from: "doctor", text: chatInput.trim(), time: timeStr }]);
    setChatInput("");
  };

  if (showChat) {
    return (
      <div style={{ background: "#ECE5DD", minHeight: "100%", display: "flex", flexDirection: "column" }}>
        {/* Chat Header */}
        <div style={{ background: "#075E54", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setShowChat(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", ...heading, fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {p.initial}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...heading, fontWeight: 600, fontSize: 14, color: "#fff" }}>{p.name}</div>
            <div style={{ ...body, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>online</div>
          </div>
          <PhoneCall size={18} color="rgba(255,255,255,0.8)" style={{ cursor: "pointer" }} />
          <Video size={18} color="rgba(255,255,255,0.8)" style={{ cursor: "pointer" }} />
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          {chatMessages.map((msg) => {
            const isPatient = msg.from === "patient";
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: isPatient ? "flex-start" : "flex-end" }}>
                <div style={{
                  maxWidth: "78%", borderRadius: 10, padding: "8px 10px",
                  background: isPatient ? "#FFFFFF" : "#DCF8C6",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                }}>
                  <div style={{ ...body, fontSize: 13.5, color: "#303030", lineHeight: 1.45 }}>{msg.text}</div>
                  <div style={{ ...body, fontSize: 10, color: "#999", textAlign: "right", marginTop: 3 }}>{msg.time} {isPatient ? "" : "✓✓"}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <div style={{ background: "#F0F0F0", padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </button>
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Camera size={20} />
          </button>
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Type a message"
            style={{
              flex: 1, border: "none", borderRadius: 20, padding: "10px 14px",
              fontSize: 14, ...body, outline: "none", background: "#fff",
            }}
          />
          <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", color: "#8696A0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Mic size={20} />
          </button>
          <button onClick={sendMessage} style={{
            width: 40, height: 40, borderRadius: "50%", background: "#075E54",
            border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#111827", minHeight: "100%", display: "flex", flexDirection: "column", color: "#fff" }}>
      {/* Main Video Area */}
      <div style={{ flex: 1, position: "relative", background: "linear-gradient(135deg, #1E3A5F, #2D1B69)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Top bar overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%" }}>
          <button onClick={() => go("cho_consultation", { patient: p })} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, ...heading, fontSize: 11 }}>
            <ChevronLeft size={14} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444" }} />
            <span style={{ ...heading, fontSize: 12, fontWeight: 600 }}>{fmtDur(duration)}</span>
          </div>
          <span style={{ ...body, fontSize: 10, color: "#4ADE80", fontWeight: 600 }}>{t.videoGoodConn}</span>
        </div>

        {/* Patient Info Overlay */}
        <div style={{
          position: "absolute", top: 44, left: 14, background: "rgba(0,0,0,0.6)",
          borderRadius: 8, padding: "8px 12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A" }} />
            <span style={{ ...heading, fontSize: 12, fontWeight: 600 }}>{p.name}</span>
          </div>
          <div style={{ ...body, fontSize: 10, opacity: 0.8, marginTop: 2 }}>{p.age}y • {p.gender === "male" ? "M" : "F"} • {p.zone.toUpperCase()}</div>
        </div>

        {/* Patient Avatar */}
        <div style={{
          width: 100, height: 100, borderRadius: "50%", background: "#3B82F6",
          display: "flex", alignItems: "center", justifyContent: "center",
          ...heading, fontSize: 32, fontWeight: 700,
        }}>
          {p.initial}
        </div>
        <div style={{ ...heading, fontSize: 16, fontWeight: 600, marginTop: 8 }}>{p.name}</div>
        <div style={{ ...body, fontSize: 11, opacity: 0.7, marginTop: 2 }}>{p.id}</div>

        {/* Doctor PiP */}
        <div style={{
          position: "absolute", bottom: 14, right: 14, width: 110, height: 80,
          borderRadius: 10, background: "linear-gradient(135deg, #0B6B58, #0891B2)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.3)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            ...heading, fontSize: 12, fontWeight: 700,
          }}>
            Dश
          </div>
          <div style={{ ...heading, fontSize: 10, fontWeight: 600, marginTop: 2 }}>Dr. श्रीवन</div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{ padding: "10px 16px", display: "flex", justifyContent: "center", gap: 10, background: "#1F2937" }}>
        {[
          { icon: <Mic size={18} />, active: !isMuted, onClick: () => setIsMuted(!isMuted) },
          { icon: <Camera size={18} />, active: isCameraOn, onClick: () => setIsCameraOn(!isCameraOn) },
          { icon: <MessageCircle size={18} />, active: true, onClick: () => setShowChat(true) },
          { icon: <PhoneOff size={18} />, danger: true, onClick: () => go(doctorType === "mo" ? "mo_dashboard" : "cho_dashboard") },
          { icon: <Video size={18} />, active: true, onClick: () => {} },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            style={{
              width: 44, height: 44, borderRadius: "50%", border: "none",
              background: btn.danger ? "#DC2626" : btn.active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>

    </div>
  );
}

/* ---------------------------------------------------------
   PHARMACY LOGIN SCREEN
--------------------------------------------------------- */
function PharmacyLoginScreen({ go, lang, setLang, t }) {
  const [licenseId, setLicenseId] = useState("MH-TZ4-567890");
  const [otp, setOtp] = useState("123456");

  const handleLogin = () => {
    go("pharmacy_dashboard");
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Back button */}
      <div style={{ padding: "16px 18px 0" }}>
        <button
          onClick={() => go("role_select")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", color: "#374151",
          }}
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Login Card */}
      <div style={{ padding: "10px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "#fff", borderRadius: 20,
          padding: "28px 22px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          {/* Sannidhya Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <SannidhyaLogo size={64} style={{ marginBottom: 6 }} />
          </div>

          <div style={{ ...heading, fontWeight: 700, fontSize: 20, color: "#111827", textAlign: "center", marginBottom: 4 }}>
            {t.pharmacyLoginTitle}
          </div>
          <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, textAlign: "center", marginBottom: 20 }}>
            {t.pharmacyLoginSub}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {t.pharmacyLicenseLabel}
            </div>
            <input
              value={licenseId}
              onChange={(e) => setLicenseId(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px",
                fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {t.pharmacyOtpLabel}
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px",
                fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center", letterSpacing: 4,
              }}
            />
            <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 4, textAlign: "center" }}>
              {t.pharmacyDemoOtp}
            </div>
          </div>

          {/* Verified Note */}
          <div style={{
            background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10,
            padding: "10px 14px", ...body, fontSize: 12.5, color: "#065F46", marginBottom: 16, lineHeight: 1.5,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>➕</span>
            {t.pharmacyVerifiedNote}
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: "100%", background: "#0B6B58", color: "#fff", border: "none",
              borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700,
              ...heading, cursor: "pointer",
            }}
          >
            {t.pharmacyLoginBtn}
          </button>
        </div>

        {/* Hints below card */}
        <div style={{ padding: "18px 10px", textAlign: "center" }}>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 4 }}>{t.pharmacyCredHint}</div>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.pharmacyAvailIds}</div>
          <div style={{ ...body, fontSize: 11.5, color: C.ink, fontWeight: 600, marginTop: 2 }}>{t.pharmacyDemoLicense}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DIAGNOSTIC CENTER LOGIN SCREEN
--------------------------------------------------------- */
function DiagnosticCenterLoginScreen({ go, lang, setLang, t }) {
  const [ceaId, setCeaId] = useState("CEA-MH-2026-9874");
  const [otp, setOtp] = useState("123456");

  const handleLogin = () => {
    go("diagnostic_dashboard");
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Back button */}
      <div style={{ padding: "16px 18px 0" }}>
        <button
          onClick={() => go("role_select")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", color: "#374151",
          }}
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Login Card */}
      <div style={{ padding: "10px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "#fff", borderRadius: 20,
          padding: "28px 22px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          {/* Sannidhya Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <SannidhyaLogo size={64} style={{ marginBottom: 6 }} />
          </div>

          <div style={{ ...heading, fontWeight: 700, fontSize: 20, color: "#111827", textAlign: "center", marginBottom: 4 }}>
            {t.diagnosticLoginTitle}
          </div>
          <div style={{ ...body, fontSize: 12.5, color: C.inkSoft, textAlign: "center", marginBottom: 20 }}>
            {t.diagnosticLoginSub}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {t.diagnosticCeaLabel}
            </div>
            <input
              value={ceaId}
              onChange={(e) => setCeaId(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px",
                fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {t.diagnosticOtpLabel}
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "12px 14px",
                fontSize: 15, ...body, outline: "none",
                color: "#111827", textAlign: "center", letterSpacing: 4,
              }}
            />
            <div style={{ ...body, fontSize: 11.5, color: C.inkSoft, marginTop: 4, textAlign: "center" }}>
              {t.diagnosticDemoOtp}
            </div>
          </div>

          {/* Verified Note */}
          <div style={{
            background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10,
            padding: "10px 14px", ...body, fontSize: 12.5, color: "#065F46", marginBottom: 16, lineHeight: 1.5,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>➕</span>
            {t.diagnosticVerifiedNote}
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: "100%", background: "#0B6B58", color: "#fff", border: "none",
              borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700,
              ...heading, cursor: "pointer",
            }}
          >
            {t.diagnosticLoginBtn}
          </button>
        </div>

        {/* Hints below card */}
        <div style={{ padding: "18px 10px", textAlign: "center" }}>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginBottom: 4 }}>{t.diagnosticCredHint}</div>
          <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.diagnosticAvailIds}</div>
          <div style={{ ...body, fontSize: 11.5, color: C.ink, fontWeight: 600, marginTop: 2 }}>{t.diagnosticDemoCea}</div>
          <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginTop: 6 }}>{t.diagnosticNablNote}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DISEASE ANALYTICS SCREEN
--------------------------------------------------------- */
function DiseaseAnalyticsScreen({ go, backDest, lang, setLang, t }) {
  const alerts = [
    { disease: t.seasonalViralFever, count: 7, risk: t.moderateRisk, color: "#E8A23A", bg: "#FBF0DD" },
    { disease: t.denguePrecaution, count: 4, risk: t.highWarning, color: "#DC2626", bg: "#FEF2F2" },
    { disease: t.malariaScreening, count: 1, risk: t.lowRisk, color: "#16A34A", bg: "#DCFCE7" },
  ];

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => go(backDest || "asha_home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#DC2626", fontWeight: 600, fontSize: 15, ...body }}>
          <ChevronLeft size={20} color="#DC2626" />
          <span>{t.back || "Back"}</span>
        </button>
        <div style={{ ...heading, fontSize: 17, fontWeight: 700, color: "#111827" }}>
          {t.diseaseAnalytics || "Disease Analytics"}
        </div>
        <div style={{ width: 50 }} />
      </div>

      <div style={{ flex: 1, padding: "16px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Overview Stats */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ borderRight: "1px solid #F3F4F6", paddingRight: 10 }}>
            <div style={{ ...heading, fontSize: 24, fontWeight: 700, color: "#DC2626" }}>2 {t.activeOutbreaks}</div>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{t.outbreakAlerts}</div>
          </div>
          <div>
            <div style={{ ...heading, fontSize: 24, fontWeight: 700, color: "#0B6B58" }}>88%</div>
            <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{t.vaccinationRate}</div>
          </div>
        </div>

        {/* Alerts List */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart2 size={18} color="#DC2626" />
            <span>{t.communityTrends}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ background: a.bg, borderRadius: 12, padding: "14px 14px", border: `1px solid ${a.color}40`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ ...heading, fontWeight: 700, fontSize: 14.5, color: "#111827" }}>{a.disease}</div>
                  <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{a.count} {t.patientsReportedWeek}</div>
                </div>
                <span style={{ background: "#fff", color: a.color, fontSize: 11.5, fontWeight: 700, padding: "4px 8px", borderRadius: 6, ...body }}>{a.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ASHA TRIAGE RESULT — Full Detailed Risk Assessment
--------------------------------------------------------- */
function AshaTriageResult({ result, patient, go, t, onBack }) {
  const zInfo = t.zones[result.zone] || t.zones.yellow;
  const zColor = { yellow: C.yellow, orange: C.orange, red: C.red }[result.zone] || C.yellow;
  const zSoft = { yellow: C.yellowSoft, orange: C.orangeSoft, red: C.redSoft }[result.zone] || C.yellowSoft;
  const riskLevelText = { yellow: t.moderate, orange: t.high, red: t.critical }[result.zone] || t.moderate;
  const riskAdvice = { yellow: t.riskAdviceYellow, orange: t.riskAdviceOrange, red: t.riskAdviceRed }[result.zone] || t.riskAdviceYellow;

  const getDurationKey = (dur) => {
    if (!dur) return "today";
    if (dur.includes("today") || dur.includes("आज")) return "today";
    if (dur.includes("1") || dur.includes("१")) return "fewDays";
    if (dur.includes("3") || dur.includes("३") || dur.includes("week") || dur.includes("आठवड")) return "week";
    return "longTerm";
  };
  const durationKey = getDurationKey(result.answers.duration);
  const durationText = t.durationLabels?.[durationKey] || "";

  const activeRiskFactors = (result.riskFactors || []).filter(
    (rf) => t.riskFactorsLabels?.[rf.label]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Patient Header */}
      <div style={{
        background: "#7C3AED", borderRadius: 16, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12, color: "#fff",
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <User size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 15 }}>{patient.name}</div>
          <div style={{ ...body, fontSize: 12, opacity: 0.85 }}>{patient.id} · {patient.age}</div>
        </div>
        <span style={{
          background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px",
          fontSize: 11, fontWeight: 700, ...body,
        }}>
          {t.ashaAssessment}
        </span>
      </div>

      {/* Symptom + Zone Card */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
          <Bot size={18} />
          <span style={{ ...heading, fontWeight: 600, fontSize: 14 }}>{t.aiChecker}</span>
        </div>
        <div style={{ ...heading, fontWeight: 700, fontSize: 17, marginTop: 8, color: C.ink }}>
          {result.answers.symptom.label}
        </div>

        {/* Zone Badge */}
        <div style={{ background: zSoft, borderRadius: 12, padding: 14, marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: zColor, flexShrink: 0 }} />
            <span style={{ ...heading, fontWeight: 700, fontSize: 13.5, color: zColor }}>{zInfo.name}</span>
          </div>
          <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.6 }}>{zInfo.guidance}</div>
        </div>
      </div>

      {/* Risk Score Meter */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: zColor }}>
          <ShieldCheck size={18} />
          <span style={{ ...heading, fontWeight: 600, fontSize: 14 }}>{t.riskAssessment}</span>
        </div>

        {/* Risk Score Bar */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.riskScoreLabel}</span>
            <span style={{ ...heading, fontWeight: 700, fontSize: 14, color: zColor }}>{result.riskScore || 3}/10</span>
          </div>
          <div style={{ width: "100%", height: 8, borderRadius: 999, background: C.border, overflow: "hidden" }}>
            <div style={{
              width: `${(result.riskScore || 3) * 10}%`, height: "100%", borderRadius: 999,
              background: `linear-gradient(90deg, ${C.green}, ${zColor})`,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        {/* Risk Level Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ ...body, fontSize: 12, color: C.inkSoft }}>{t.riskLevel}:</span>
          <span style={{
            background: zSoft, color: zColor, fontWeight: 700, fontSize: 12,
            padding: "4px 12px", borderRadius: 999, ...heading,
          }}>
            {riskLevelText}
          </span>
        </div>
      </div>

      {/* Contributing Factors */}
      {activeRiskFactors.length > 0 && (
        <div style={{
          background: "#fff", borderRadius: 18, padding: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.orange }}>
            <AlertTriangle size={17} />
            <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.contributingFactors}</span>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {activeRiskFactors.map((rf) => {
              const sevColor = rf.severity === "high" ? C.red : C.orange;
              const sevBg = rf.severity === "high" ? C.redSoft : C.orangeSoft;
              return (
                <div key={rf.label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: sevBg, borderRadius: 10, padding: "10px 12px",
                }}>
                  <span style={{ ...body, fontSize: 13, color: C.ink, fontWeight: 500 }}>
                    {t.riskFactorsLabels[rf.label]}
                  </span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: sevColor,
                    background: "#fff", padding: "2px 8px", borderRadius: 999, ...heading,
                  }}>
                    {rf.severity === "high" ? t.high : t.moderate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Symptom Duration */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
          <Clock size={17} />
          <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.durationImpact}</span>
        </div>
        <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.6 }}>
          <strong>{result.answers.duration || t.q2Opts[0]}:</strong> {durationText}
        </div>
      </div>

      {/* What This Means */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
          <Activity size={17} />
          <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.whatThisMeans}</span>
        </div>
        <div style={{ ...body, fontSize: 13, color: C.ink, marginTop: 8, lineHeight: 1.7 }}>
          {riskAdvice}
        </div>
      </div>

      {/* Immediate Actions */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.teal }}>
          <CheckCircle size={17} />
          <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.immediateActions}</span>
        </div>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, ...body, fontSize: 13, color: C.ink, lineHeight: 1.8 }}>
          {result.zone === "yellow" && (
            <>
              <li>{t.actionRestHydrate}</li>
              <li>{t.actionMonitorTemp}</li>
              <li>{t.actionRecordSymptoms}</li>
            </>
          )}
          {result.zone === "orange" && (
            <>
              <li>{t.actionNoSelfMed}</li>
              <li>{t.actionVisitOfficer}</li>
              <li>{t.actionBringPrescriptions}</li>
            </>
          )}
          {result.zone === "red" && (
            <>
              <li>{t.actionCallEmergency}</li>
              <li>{t.actionDontWait}</li>
              <li>{t.actionGoHospital}</li>
            </>
          )}
        </ul>
      </div>

      {/* Warning Signs */}
      <div style={{
        background: "#fff", borderRadius: 18, padding: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.orange }}>
          <AlertTriangle size={17} />
          <span style={{ ...heading, fontWeight: 600, fontSize: 13.5 }}>{t.warningSignsTitle}</span>
        </div>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18, ...body, fontSize: 13, color: C.ink, lineHeight: 1.8 }}>
          {t.warningSigns.map((w) => <li key={w}>{w}</li>)}
        </ul>
      </div>

      {/* AI Disclaimer */}
      <div style={{
        background: C.bg, border: `1px dashed ${C.border}`, borderRadius: 12,
        padding: 12, ...body, fontSize: 12, color: C.inkSoft, lineHeight: 1.7,
      }}>
        {t.aiDisclaimer}
      </div>

      {/* Emergency Button for Red Zone */}
      {result.zone === "red" && (
        <button
          onClick={() => go("asha_patient_service", "emergency")}
          style={{
            width: "100%", background: C.red, color: "#fff", border: "none",
            borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700,
            ...heading, cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
          }}
        >
          <Ambulance size={18} /> {t.emergencyHelpBtn}
        </button>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1, background: "#fff", border: `1.5px solid ${C.border}`, borderRadius: 12,
            padding: "13px 0", fontSize: 13, fontWeight: 600, color: C.ink, ...heading, cursor: "pointer",
          }}
        >
          {t.checkAnother || "Check Another"}
        </button>
        <button
          onClick={() => go("asha_home")}
          style={{
            flex: 1, background: C.teal, border: "none", borderRadius: 12,
            padding: "13px 0", fontSize: 13, fontWeight: 600, color: "#fff", ...heading, cursor: "pointer",
          }}
        >
          {t.backToHome}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ASHA PATIENT SERVICE ASSIST SCREEN
   (Keeps ASHA inside the ASHA Worker UI theme when assisting patients)
--------------------------------------------------------- */
function AshaPatientAssistScreen({ go, serviceType, lang, setLang, t }) {
  const [selectedPatient, setSelectedPatient] = useState({ name: "राम शर्मा", id: "P001", age: "45 yrs" });
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [triageResult, setTriageResult] = useState(null);

  const patientsList = [
    { name: "राम शर्मा", id: "P001", age: "45 yrs" },
    { name: "सीता देवी", id: "P002", age: "32 yrs" },
    { name: "मोहन गुप्ता", id: "P003", age: "55 yrs" },
    { name: "प्रिया शर्मा", id: "P004", age: "28 yrs" },
  ];

  const serviceTitles = {
    triage: t.aiSymptomChecker || "AI Symptom Assessment",
    consultQueue: t.consultDoctor2 || "Doctor Teleconsultation",
    records: t.pastConsultations || "Patient Health Records",
    disease_analytics: t.diseaseAnalytics || "Disease Analytics & Alerts",
    emergency: t.emergency || "Emergency Assistance",
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* ASHA Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => go("asha_home")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#7C3AED", fontWeight: 600, fontSize: 15, ...body }}
        >
          <ChevronLeft size={20} color="#7C3AED" />
          <span>{t.back || "Back"}</span>
        </button>
        <div>
          <div style={{ ...heading, fontSize: 16, fontWeight: 700, color: "#111827", textAlign: "center" }}>
            {serviceTitles[serviceType] || "Patient Assistance"}
          </div>
          <div style={{ ...body, fontSize: 11, color: "#7C3AED", textAlign: "center", fontWeight: 600 }}>
            {t.ashaAssistMode}
          </div>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Patient Selector Card */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "12px 14px",
          border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F3F0FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={19} color="#7C3AED" />
            </div>
            <div>
              <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.assistingPatient}</div>
              <div style={{ ...heading, fontSize: 14.5, fontWeight: 700, color: "#111827" }}>
                {selectedPatient.name} ({selectedPatient.id})
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPatientPicker(!showPatientPicker)}
            style={{
              background: "#F3F0FF", border: "none", borderRadius: 8,
              padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#7C3AED",
              cursor: "pointer", ...body,
            }}
          >
            {t.changeBtn}
          </button>
        </div>

        {/* Patient Dropdown */}
        {showPatientPicker && (
          <div style={{ background: "#fff", borderRadius: 14, marginTop: 8, padding: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            {patientsList.map((p) => (
              <div
                key={p.id}
                onClick={() => { setSelectedPatient(p); setShowPatientPicker(false); }}
                style={{
                  padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                  background: p.id === selectedPatient.id ? "#F3F0FF" : "transparent",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span style={{ ...body, fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.name}</span>
                <span style={{ ...body, fontSize: 12, color: C.inkSoft }}>{p.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Service Content Container */}
      <div style={{ flex: 1, padding: "14px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {serviceType === "triage" && !triageResult && (
          <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", color: "#7C3AED", borderBottom: "1px solid #E2E8F0" }}>
              <Bot size={20} />
              <div style={{ ...heading, fontWeight: 700, fontSize: 16 }}>{t.aiSymptomCheckFor} {selectedPatient.name}</div>
            </div>
            <SymptomQuestionnaire
              t={t}
              lang={lang}
              intro={`Running symptom check for ${selectedPatient.name} (${selectedPatient.id}).`}
              onFinish={(zone, answers, zoneResult) => {
                setTriageResult({ zone, answers, ...zoneResult });
              }}
            />
          </div>
        )}

        {serviceType === "triage" && triageResult && (
          <AshaTriageResult
            result={triageResult}
            patient={selectedPatient}
            go={go}
            t={t}
            onBack={() => setTriageResult(null)}
          />
        )}

        {serviceType === "consultQueue" && (
          <div style={{ background: "#fff", borderRadius: 18, padding: 20, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#CCFBF1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Stethoscope size={30} color="#0D9488" />
            </div>
            <div style={{ ...heading, fontWeight: 700, fontSize: 18, color: "#111827", marginBottom: 4 }}>
              {t.teleconsultFor} {selectedPatient.name}
            </div>
            <div style={{ ...body, fontSize: 13, color: C.inkSoft, marginBottom: 20 }}>
              {t.ashaHotline}
            </div>
            <button
              onClick={() => go("consultQueue", null, "asha_home")}
              style={{
                width: "100%", background: "#0D9488", color: "#fff", border: "none",
                borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, ...heading, cursor: "pointer",
              }}
            >
              {t.connectToDoctor} {selectedPatient.name}
            </button>
          </div>
        )}

        {serviceType === "records" && (
          <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ ...heading, fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 12 }}>
              {t.medicalHistoryFor} {selectedPatient.name} ({selectedPatient.id})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 14, border: "1px solid #F3F4F6" }}>
                <div style={{ ...heading, fontWeight: 600, fontSize: 14, color: "#111827" }}>{t.generalConsultation} — Mild Viral Fever</div>
                <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>Dr. Shreeven Chavan • Sept 2, 2026</div>
                <div style={{ background: "#E4F1EC", borderRadius: 8, padding: "8px 10px", marginTop: 8, ...body, fontSize: 12, color: "#084F41" }}>
                  Prescription: Paracetamol 500mg (2x daily) + ORS sachets
                </div>
              </div>
            </div>
          </div>
        )}

        {serviceType === "disease_analytics" && (
          <DiseaseAnalyticsScreen go={go} backDest="asha_home" lang={lang} setLang={setLang} t={t} />
        )}

        {serviceType === "emergency" && (
          <EmergencyScreen go={go} backDest="asha_home" t={t} />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PHARMACY DASHBOARD
--------------------------------------------------------- */
function PharmacyDashboard({ go, lang, setLang, t }) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const medicines = [
    { id: 1, name: "Paracetamol 500mg", category: "Antipyretic", qty: 450, expiry: "Mar 2027", stock: "in" },
    { id: 2, name: "Amoxicillin 250mg", category: "Antibiotic", qty: 120, expiry: "Jun 2027", stock: "in" },
    { id: 3, name: "Metformin 500mg", category: "Antidiabetic", qty: 15, expiry: "Sep 2026", stock: "low" },
    { id: 4, name: "Amlodipine 5mg", category: "Cardiac", qty: 0, expiry: "Feb 2027", stock: "out" },
    { id: 5, name: "Cetirizine 10mg", category: "Respiratory", qty: 200, expiry: "Dec 2026", stock: "in" },
    { id: 6, name: "Omeprazole 20mg", category: "Gastro", qty: 8, expiry: "Nov 2026", stock: "low" },
    { id: 7, name: "Ibuprofen 400mg", category: "Analgesic", qty: 300, expiry: "Aug 2027", stock: "in" },
    { id: 8, name: "Vitamin D3", category: "Vitamin", qty: 90, expiry: "Apr 2027", stock: "in" },
    { id: 9, name: "Salbutamol Inhaler", category: "Respiratory", qty: 0, expiry: "Jan 2027", stock: "out" },
    { id: 10, name: "ORS Sachets", category: "Gastro", qty: 500, expiry: "Jun 2027", stock: "in" },
  ];

  const requests = [
    { id: 1, patient: "Ramesh Patil (P001)", from: "Dr. Sharma", meds: ["Paracetamol 500mg", "ORS Sachets"], status: "pending" },
    { id: 2, patient: "Sita Devi (P005)", from: "Dr. Mehta", meds: ["Metformin 500mg", "Amlodipine 5mg"], status: "ready" },
    { id: 3, patient: "Ganesh Kute (P012)", from: "CHO Patil", meds: ["Amoxicillin 250mg"], status: "dispensed" },
    { id: 4, patient: "Lakshmi Bai (P008)", from: "Dr. Sharma", meds: ["Cetirizine 10mg", "Paracetamol 500mg"], status: "pending" },
  ];

  const filteredMeds = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = stockFilter === "all" || m.stock === stockFilter;
    return matchSearch && matchFilter;
  });

  const stockCounts = {
    all: medicines.length,
    in: medicines.filter(m => m.stock === "in").length,
    low: medicines.filter(m => m.stock === "low").length,
    out: medicines.filter(m => m.stock === "out").length,
  };

  const stockColor = { in: C.green, low: C.yellow, out: C.red };
  const stockBg = { in: C.greenSoft, low: C.yellowSoft, out: C.redSoft };
  const stockLabel = { in: t.pharmacyInStock, low: t.pharmacyLowStock, out: t.pharmacyOutOfStock };
  const reqStatusColor = { pending: C.saffron, ready: C.teal, dispensed: C.green };
  const reqStatusBg = { pending: C.saffronSoft, ready: C.tealSoft, dispensed: C.greenSoft };
  const reqStatusLabel = { pending: t.pharmacyReqPending, ready: t.pharmacyReqReady, dispensed: t.pharmacyReqDispensed };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: C.teal, padding: "16px 18px 14px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div>
            <div style={{ ...heading, fontSize: 18, fontWeight: 700 }}>{t.pharmacyDashTitle}</div>
            <div style={{ ...body, fontSize: 12, opacity: 0.85 }}>{t.pharmacyDashName}</div>
          </div>
          <button
            onClick={() => go("pharmacy_profile")}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", ...body }}
          >
            {t.pharmacyProfile}
          </button>
        </div>
        <div style={{ ...body, fontSize: 11, opacity: 0.7 }}>{t.pharmacyDashLicense}</div>
      </div>

      {/* Stats */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: t.pharmacyTotalMedicines, value: medicines.length, color: C.ink },
            { label: t.pharmacyInStock, value: stockCounts.in, color: C.green },
            { label: t.pharmacyLowStock, value: stockCounts.low, color: C.yellow },
            { label: t.pharmacyOutOfStock, value: stockCounts.out, color: C.red },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "14px 16px 0", display: "flex", gap: 8 }}>
        {[
          { key: "inventory", label: t.pharmacyInventory },
          { key: "requests", label: t.pharmacyRequests },
          { key: "alerts", label: t.pharmacyAlerts },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
              cursor: "pointer", ...heading,
              background: activeTab === tab.key ? C.teal : "#fff",
              color: activeTab === tab.key ? "#fff" : C.inkSoft,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "14px 16px", overflowY: "auto" }}>
        {activeTab === "inventory" && (
          <>
            {/* Search */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <Search size={18} color={C.inkSoft} />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t.pharmacySearchMedicine}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, ...body, background: "transparent" }}
              />
            </div>

            {/* Filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {["all", "in", "low", "out"].map(f => (
                <button
                  key={f}
                  onClick={() => setStockFilter(f)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", ...body,
                    background: stockFilter === f ? C.teal : "#F3F4F6",
                    color: stockFilter === f ? "#fff" : C.inkSoft,
                  }}
                >
                  {f === "all" ? t.pharmacyStockAll : f === "in" ? t.pharmacyStockIn : f === "low" ? t.pharmacyStockLow : t.pharmacyStockOut} ({stockCounts[f]})
                </button>
              ))}
            </div>

            {/* Medicine List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredMeds.map(med => (
                <div key={med.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderLeft: `4px solid ${stockColor[med.stock]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ ...heading, fontSize: 14.5, fontWeight: 700, color: "#111827" }}>{med.name}</div>
                      <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{t.pharmacyMedCategory}: {med.category}</div>
                    </div>
                    <span style={{ background: stockBg[med.stock], color: stockColor[med.stock], fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, ...body }}>
                      {stockLabel[med.stock]}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>
                      {t.pharmacyMedQty}: <span style={{ fontWeight: 700, color: "#111827" }}>{med.qty}</span> | {t.pharmacyMedExpiry}: <span style={{ fontWeight: 600, color: "#111827" }}>{med.expiry}</span>
                    </div>
                    {med.stock !== "out" ? (
                      <button style={{ background: C.tealSoft, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: C.teal, cursor: "pointer", ...body }}>
                        {t.pharmacyStockUpdate}
                      </button>
                    ) : (
                      <button style={{ background: C.redSoft, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: C.red, cursor: "pointer", ...body }}>
                        {t.pharmacyOrderNow}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "requests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {requests.map(req => (
              <div key={req.id} style={{ background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ ...heading, fontSize: 14, fontWeight: 700, color: "#111827" }}>{req.patient}</div>
                    <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{t.pharmacyRequestFrom}: {req.from}</div>
                  </div>
                  <span style={{ background: reqStatusBg[req.status], color: reqStatusColor[req.status], fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, ...body }}>
                    {reqStatusLabel[req.status]}
                  </span>
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft, marginBottom: 4 }}>{t.pharmacyRequestMeds}:</div>
                  {req.meds.map((med, i) => (
                    <div key={i} style={{ ...body, fontSize: 13, color: "#111827", fontWeight: 600 }}>• {med}</div>
                  ))}
                </div>
                {req.status === "pending" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => {}} style={{ flex: 1, background: C.teal, border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", ...body }}>
                      {t.pharmacyDispense}
                    </button>
                    <button onClick={() => {}} style={{ flex: 1, background: C.saffronSoft, border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 700, color: C.saffron, cursor: "pointer", ...body }}>
                      {t.pharmacyMarkReady}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "alerts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Supply Tracker */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Package size={18} color={C.teal} />
                {t.pharmacySupply}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.pharmacyLastOrder}</div>
                  <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#111827" }}>28 Aug 2026</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.pharmacyNextOrder}</div>
                  <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#111827" }}>15 Sep 2026</div>
                </div>
              </div>
              <button style={{ width: "100%", background: C.teal, border: "none", borderRadius: 10, padding: "11px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", ...heading }}>
                {t.pharmacyOrderNow}
              </button>
            </div>

            {/* Stock Alerts */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={18} color={C.red} />
                {t.pharmacyAlerts}
              </div>
              {medicines.filter(m => m.stock === "low" || m.stock === "out").map(med => (
                <div key={med.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <div>
                    <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#111827" }}>{med.name}</div>
                    <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>
                      {med.stock === "out" ? t.pharmacyAlertOut : t.pharmacyAlertLow}
                    </div>
                  </div>
                  <span style={{ background: stockBg[med.stock], color: stockColor[med.stock], fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, ...body }}>
                    {med.qty === 0 ? `0 ${t.pharmacyMedQty}` : `${med.qty} ${t.pharmacyMedQty}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Referral Medicines */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} color={C.saffron} />
                {t.pharmacyRequests}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: C.saffronSoft, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: C.saffron }}>2</div>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.pharmacyReferralPending}</div>
                </div>
                <div style={{ flex: 1, background: C.tealSoft, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: C.teal }}>1</div>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.pharmacyReferralReady}</div>
                </div>
                <div style={{ flex: 1, background: C.greenSoft, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: C.green }}>1</div>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.pharmacyReferralDispensed}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DIAGNOSTIC CENTER DASHBOARD
--------------------------------------------------------- */
function DiagnosticDashboard({ go, lang, setLang, t }) {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");

  const testRequests = [
    { id: 1, patient: "Ramesh Patil (P001)", from: "Dr. Sharma", test: "Complete Blood Count (CBC)", status: "pending", date: "05 Sep" },
    { id: 2, patient: "Sita Devi (P005)", from: "Dr. Mehta", test: "ECG", status: "in_progress", date: "05 Sep" },
    { id: 3, patient: "Ganesh Kute (P012)", from: "CHO Patil", test: "Blood Sugar (Fasting)", status: "ready", date: "04 Sep" },
    { id: 4, patient: "Lakshmi Bai (P008)", from: "Dr. Sharma", test: "Chest X-Ray", status: "pending", date: "05 Sep" },
    { id: 5, patient: "Anita Jadhav (P015)", from: "Dr. Mehta", test: "Thyroid Profile", status: "ready", date: "04 Sep" },
  ];

  const availableTests = [
    { id: 1, name: "Complete Blood Count (CBC)", category: "Blood Test", price: "₹250", tat: "2 hrs" },
    { id: 2, name: "Blood Sugar (Fasting)", category: "Blood Test", price: "₹80", tat: "1 hr" },
    { id: 3, name: "Lipid Profile", category: "Blood Test", price: "₹400", tat: "3 hrs" },
    { id: 4, name: "ECG", category: "Cardiac", price: "₹200", tat: "30 min" },
    { id: 5, name: "Chest X-Ray", category: "Imaging", price: "₹500", tat: "1 hr" },
    { id: 6, name: "Thyroid Profile", category: "Blood Test", price: "₹350", tat: "4 hrs" },
    { id: 7, name: "Urine Routine", category: "Urine", price: "₹120", tat: "1 hr" },
    { id: 8, name: "Liver Function Test", category: "Blood Test", price: "₹450", tat: "4 hrs" },
    { id: 9, name: "Kidney Function Test", category: "Blood Test", price: "₹400", tat: "4 hrs" },
    { id: 10, name: "Blood Pressure Monitoring", category: "Cardiac", price: "₹50", tat: "15 min" },
  ];

  const recentReports = [
    { patient: "Ganesh Kute (P012)", test: "Blood Sugar", date: "04 Sep", status: "collected" },
    { patient: "Anita Jadhav (P015)", test: "Thyroid Profile", date: "04 Sep", status: "ready" },
    { patient: "Ram Sharma (P001)", test: "ECG", date: "03 Sep", status: "collected" },
  ];

  const filteredTests = availableTests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reqStatusColor = { pending: C.saffron, in_progress: "#3B82F6", ready: C.green };
  const reqStatusBg = { pending: C.saffronSoft, in_progress: "#EFF6FF", ready: C.greenSoft };
  const reqStatusLabel = { pending: t.diagReqPending, in_progress: t.diagReqInProgress, ready: t.diagReqReady };
  const reportStatusColor = { collected: C.green, ready: C.teal };
  const reportStatusBg = { collected: C.greenSoft, ready: C.tealSoft };
  const reportStatusLabel = { collected: t.diagStatusCollected, ready: t.diagStatusReady };

  const catColor = { "Blood Test": C.red, "Cardiac": "#EC4899", "Imaging": "#8B5CF6", "Pathology": C.orange, "Urine": "#06B6D4" };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#4F46E5", padding: "16px 18px 14px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div>
            <div style={{ ...heading, fontSize: 18, fontWeight: 700 }}>{t.diagDashTitle}</div>
            <div style={{ ...body, fontSize: 12, opacity: 0.85 }}>{t.diagDashName}</div>
          </div>
          <button
            onClick={() => go("diagnostic_profile")}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", ...body }}
          >
            {t.diagProfile}
          </button>
        </div>
        <div style={{ ...body, fontSize: 11, opacity: 0.7 }}>{t.diagDashCea}</div>
      </div>

      {/* Stats */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: t.diagTotalTests, value: testRequests.length, color: C.ink },
            { label: t.diagCompleted, value: recentReports.length, color: C.green },
            { label: t.diagPending, value: testRequests.filter(r => r.status === "pending").length, color: C.saffron },
            { label: t.diagReportsReady, value: testRequests.filter(r => r.status === "ready").length, color: "#4F46E5" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ ...body, fontSize: 10, color: C.inkSoft, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "14px 16px 0", display: "flex", gap: 8 }}>
        {[
          { key: "requests", label: t.diagTestRequests },
          { key: "tests", label: t.diagAvailableTests },
          { key: "reports", label: t.diagReports },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
              cursor: "pointer", ...heading,
              background: activeTab === tab.key ? "#4F46E5" : "#fff",
              color: activeTab === tab.key ? "#fff" : C.inkSoft,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "14px 16px", overflowY: "auto" }}>
        {activeTab === "requests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {testRequests.map(req => (
              <div key={req.id} style={{ background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderLeft: `4px solid ${reqStatusColor[req.status]}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ ...heading, fontSize: 14, fontWeight: 700, color: "#111827" }}>{req.patient}</div>
                    <div style={{ ...body, fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{t.diagReqFrom}: {req.from} • {req.date}</div>
                  </div>
                  <span style={{ background: reqStatusBg[req.status], color: reqStatusColor[req.status], fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, ...body }}>
                    {reqStatusLabel[req.status]}
                  </span>
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
                  <div style={{ ...body, fontSize: 13, color: "#111827", fontWeight: 600 }}>🧪 {req.test}</div>
                </div>
                {req.status === "pending" && (
                  <button onClick={() => {}} style={{ width: "100%", background: "#4F46E5", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", ...body }}>
                    {t.diagStartTest}
                  </button>
                )}
                {req.status === "in_progress" && (
                  <button onClick={() => {}} style={{ width: "100%", background: C.green, border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", ...body }}>
                    {t.diagMarkReady}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "tests" && (
          <>
            {/* Search */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <Search size={18} color={C.inkSoft} />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t.diagSearchTests}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, ...body, background: "transparent" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredTests.map(test => (
                <div key={test.id} style={{ background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...heading, fontSize: 14, fontWeight: 700, color: "#111827" }}>{test.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ background: catColor[test.category] + "20", color: catColor[test.category], fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, ...body }}>
                        {test.category}
                      </span>
                      <span style={{ ...body, fontSize: 12, color: C.inkSoft }}>TAT: {test.tat}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827" }}>{test.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "reports" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Quick Stats */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Report Summary</div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: C.greenSoft, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: C.green }}>{recentReports.filter(r => r.status === "collected").length}</div>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.diagStatusCollected}</div>
                </div>
                <div style={{ flex: 1, background: C.tealSoft, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ ...heading, fontSize: 22, fontWeight: 700, color: C.teal }}>{recentReports.filter(r => r.status === "ready").length}</div>
                  <div style={{ ...body, fontSize: 11, color: C.inkSoft }}>{t.diagStatusReady}</div>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ ...heading, fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Recent Reports</div>
              {recentReports.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < recentReports.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...body, fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.patient}</div>
                    <div style={{ ...body, fontSize: 12, color: C.inkSoft }}>{r.test} • {r.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ background: reportStatusBg[r.status], color: reportStatusColor[r.status], fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, ...body }}>
                      {reportStatusLabel[r.status]}
                    </span>
                    <button style={{ background: C.tealSoft, border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: C.teal, cursor: "pointer", ...body }}>
                      {t.diagReportView}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PHARMACY PROFILE SCREEN
--------------------------------------------------------- */
function PharmacyProfileScreen({ go, lang, setLang, t }) {
  const profileData = {
    name: lang === "मराठी" ? "सुरेश पाटिल" : lang === "हिंदी" ? "सुरेश पाटिल" : "Suresh Patil",
    id: "PH-001",
    phone: "+91-9876543220",
    email: "suresh.patil@nandgaonpharmacy.gov.in",
    license: "MH-TZ4-567890",
    pharmacyName: lang === "मराठी" ? "नांदगाव PHC फार्मसी" : lang === "हिंदी" ? "नांदगाँव PHC फ़ार्मेसी" : "Nandgaon PHC Pharmacy",
    experience: lang === "मराठी" ? "७ वर्षे" : lang === "हिंदी" ? "७ वर्ष" : "7 years",
    address: lang === "मराठी" ? "नांदगाव, तालुका हवेली, नाशिक" : lang === "हिंदी" ? "नांदगाँव, तहसील हवेली, नाशिक" : "Nandgaon, Haveli Taluka, Nashik",
    totalMedicines: 245,
    monthlyDispensed: 1820,
    certifications: [
      lang === "मराठी" ? "फार्मेसी कौन्सिल परवाना - २०१९" : lang === "हिंदी" ? "फ़ार्मेसी काउंसिल लाइसेंस - २०१९" : "Pharmacy Council License - 2019",
      lang === "मराठी" ? "औषध वितरण प्रशिक्षण" : lang === "हिंदी" ? "दवा वितरण प्रशिक्षण" : "Medicine Distribution Training",
      lang === "मराठी" ? "शीत श्रृंखला व्यवस्थापन" : lang === "हिंदी" ? "कोल्ड चेन प्रबंधन" : "Cold Chain Management",
    ],
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => go("pharmacy_dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#0B6B58" }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: "#111827" }}>{t.myProfile}</div>
        <div style={{ width: 22 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Profile Header */}
        <div style={{ background: "linear-gradient(135deg, #0B6B58 0%, #0891B2 100%)", borderRadius: 18, padding: "24px 18px", textAlign: "center", color: "#fff" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <User size={36} color="#fff" />
          </div>
          <div style={{ ...heading, fontSize: 20, fontWeight: 700 }}>{profileData.name}</div>
          <div style={{ ...body, fontSize: 13, opacity: 0.85, marginTop: 4 }}>Pharmacist · {profileData.id}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.totalMedicines}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "औषधे" : lang === "हिंदी" ? "दवाइयाँ" : "Medicines"}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.monthlyDispensed}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "मासिक वितरित" : lang === "हिंदी" ? "मासिक वितरित" : "Monthly Dispensed"}</div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>{lang === "मराठी" ? "माहिती" : lang === "हिंदी" ? "जानकारी" : "Information"}</div>
          {[
            { label: lang === "मराठी" ? "फोन" : lang === "हिंदी" ? "फ़ोन" : "Phone", value: profileData.phone },
            { label: lang === "मराठी" ? "ईमेल" : lang === "हिंदी" ? "ईमेल" : "Email", value: profileData.email },
            { label: lang === "मराठी" ? "परवाना" : lang === "हिंदी" ? "लाइसेंस" : "License", value: profileData.license },
            { label: lang === "मराठी" ? "फार्मसी" : lang === "हिंदी" ? "फ़ार्मेसी" : "Pharmacy", value: profileData.pharmacyName },
            { label: lang === "मराठी" ? "अनुभव" : lang === "हिंदी" ? "अनुभव" : "Experience", value: profileData.experience },
            { label: lang === "मराठी" ? "पत्ता" : lang === "हिंदी" ? "पता" : "Address", value: profileData.address },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ ...body, fontSize: 13, color: "#6B7280" }}>{item.label}</span>
              <span style={{ ...body, fontSize: 13, color: "#111827", fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>
            {lang === "मराठी" ? "प्रमाणपत्रे" : lang === "हिंदी" ? "प्रमाणपत्र" : "Certifications"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {profileData.certifications.map((c, i) => (
              <div key={i} style={{ background: "#F0FDF4", borderRadius: 8, padding: "8px 12px", ...body, fontSize: 13, color: "#166534", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={14} color="#16A34A" /> {c}
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => go("role_select")}
          style={{
            width: "100%", background: "#FEF2F2", color: "#DC2626",
            border: "1px solid #FCA5A5", borderRadius: 12, padding: "14px 0",
            ...heading, fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <LogOut size={16} color="#DC2626" /> {t.logout}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DIAGNOSTIC PROFILE SCREEN
--------------------------------------------------------- */
function DiagnosticProfileScreen({ go, lang, setLang, t }) {
  const profileData = {
    name: lang === "मराठी" ? "अनिता जाधव" : lang === "हिंदी" ? "अनिता जाधव" : "Anita Jadhav",
    id: "DL-001",
    phone: "+91-9876543230",
    email: "anita.jadhav@nandgaonlab.gov.in",
    cea: "CEA-MH-2026-9874",
    labName: lang === "मराठी" ? "नांदगाव निदान लॅब" : lang === "हिंदी" ? "नांदगाँव निदान लैब" : "Nandgaon Diagnostic Lab",
    experience: lang === "मराठी" ? "१० वर्षे" : lang === "हिंदी" ? "१० वर्ष" : "10 years",
    address: lang === "मराठी" ? "नांदगाव, तालुका हवेली, नाशिक" : lang === "हिंदी" ? "नांदगाँव, तहसील हवेली, नाशिक" : "Nandgaon, Haveli Taluka, Nashik",
    totalTests: 15,
    monthlyTests: 420,
    certifications: [
      lang === "मराठी" ? "NABL प्रमाणन - २०२०" : lang === "हिंदी" ? "NABL प्रमाणन - २०२०" : "NABL Accreditation - 2020",
      lang === "मराठी" ? "CEA नोंदणी - २०२६" : lang === "हिंदी" ? "CEA पंजीकरण - २०२६" : "CEA Registration - 2026",
      lang === "मराठी" ? "प्रयोगशाळा व्यवस्थापन प्रशिक्षण" : lang === "हिंदी" ? "लैब प्रबंधन प्रशिक्षण" : "Lab Management Training",
    ],
  };

  return (
    <div style={{ background: "#EEF4FB", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => go("diagnostic_dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#4F46E5" }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ ...heading, fontSize: 18, fontWeight: 700, color: "#111827" }}>{t.myProfile}</div>
        <div style={{ width: 22 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Profile Header */}
        <div style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", borderRadius: 18, padding: "24px 18px", textAlign: "center", color: "#fff" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <User size={36} color="#fff" />
          </div>
          <div style={{ ...heading, fontSize: 20, fontWeight: 700 }}>{profileData.name}</div>
          <div style={{ ...body, fontSize: 13, opacity: 0.85, marginTop: 4 }}>Lab Technician · {profileData.id}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.totalTests}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "तपासण्या" : lang === "हिंदी" ? "टेस्ट" : "Tests"}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ ...heading, fontSize: 22, fontWeight: 700 }}>{profileData.monthlyTests}</div>
              <div style={{ ...body, fontSize: 11, opacity: 0.8 }}>{lang === "मराठी" ? "मासिक तपासण्या" : lang === "हिंदी" ? "मासिक टेस्ट" : "Monthly Tests"}</div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>{lang === "मराठी" ? "माहिती" : lang === "हिंदी" ? "जानकारी" : "Information"}</div>
          {[
            { label: lang === "मराठी" ? "फोन" : lang === "हिंदी" ? "फ़ोन" : "Phone", value: profileData.phone },
            { label: lang === "मराठी" ? "ईमेल" : lang === "हिंदी" ? "ईमेल" : "Email", value: profileData.email },
            { label: lang === "मराठी" ? "CEA आयडी" : lang === "हिंदी" ? "CEA आईडी" : "CEA ID", value: profileData.cea },
            { label: lang === "मराठी" ? "लॅब" : lang === "हिंदी" ? "लैब" : "Lab", value: profileData.labName },
            { label: lang === "मराठी" ? "अनुभव" : lang === "हिंदी" ? "अनुभव" : "Experience", value: profileData.experience },
            { label: lang === "मराठी" ? "पत्ता" : lang === "हिंदी" ? "पता" : "Address", value: profileData.address },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ ...body, fontSize: 13, color: "#6B7280" }}>{item.label}</span>
              <span style={{ ...body, fontSize: 13, color: "#111827", fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ ...heading, fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 10 }}>
            {lang === "मराठी" ? "प्रमाणपत्रे" : lang === "हिंदी" ? "प्रमाणपत्र" : "Certifications"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {profileData.certifications.map((c, i) => (
              <div key={i} style={{ background: "#EEF2FF", borderRadius: 8, padding: "8px 12px", ...body, fontSize: 13, color: "#3730A3", border: "1px solid #C7D2FE", display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={14} color="#4F46E5" /> {c}
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => go("role_select")}
          style={{
            width: "100%", background: "#FEF2F2", color: "#DC2626",
            border: "1px solid #FCA5A5", borderRadius: 12, padding: "14px 0",
            ...heading, fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <LogOut size={16} color="#DC2626" /> {t.logout}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   APP SHELL
--------------------------------------------------------- */
export default function App() {
  const [lang, setLang] = useState("English"); // Default to English
  const [screen, setScreen] = useState("role_select");
  const [recordDetail, setRecordDetail] = useState(null);
  const [freshReferralMeta, setFreshReferralMeta] = useState(null);
  const [backDest, setBackDest] = useState(null);
  const [ashaServiceType, setAshaServiceType] = useState("triage");
  const [isAshaAssisted, setIsAshaAssisted] = useState(false);
  const [doctorRoleType, setDoctorRoleType] = useState("cho");
  const [consultPatient, setConsultPatient] = useState(null);
  const [doctorProfileType, setDoctorProfileType] = useState("cho");

  const t = TRANSLATIONS[lang] || TRANSLATIONS["English"];

  const go = (dest, arg, customBack, ashaAssistedFlag) => {
    if (dest === "recordDetail") setRecordDetail(arg);
    if (dest === "freshReferral") setFreshReferralMeta(arg);
    if (dest === "asha_patient_service" && arg) setAshaServiceType(arg);
    if (dest === "doctor_login" && arg?.roleType) setDoctorRoleType(arg.roleType);
    if (dest === "cho_dashboard" && arg?.roleType) setDoctorRoleType(arg.roleType);
    if (dest === "cho_consultation" && arg?.patient) setConsultPatient(arg.patient);
    if (dest === "cho_video_consult" && arg?.patient) setConsultPatient(arg.patient);
    if (dest === "mo_consultation" && arg?.patient) setConsultPatient(arg.patient);
    if (dest === "myths" && arg?.initialTab) setMythsInitialTab(arg.initialTab);
    if (dest === "doctor_profile" && arg?.type) setDoctorProfileType(arg.type);
    if (ashaAssistedFlag !== undefined) setIsAshaAssisted(ashaAssistedFlag);
    if (dest === "role_select") setIsAshaAssisted(false);
    if (customBack !== undefined) {
      setBackDest(customBack);
    } else if (["home", "asha_home", "role_select"].includes(dest)) {
      setBackDest(null);
    }
    setScreen(dest);
  };

  const showBottomNav = ["home", "records", "medicines", "emergency", "profile"].includes(screen);

  // Screens that manage their own layout (no phone shell constraints needed for inner scroll)
  const isRoleScreen = ["role_select", "asha_login", "asha_home", "health_surveys", "register_patient", "patient_login", "pharmacy_login", "pharmacy_dashboard", "pharmacy_profile", "diagnostic_login", "diagnostic_dashboard", "diagnostic_profile", "doctor_role_select", "doctor_login", "cho_dashboard", "cho_patient_queue", "cho_consultation", "cho_video_consult", "mo_dashboard", "mo_patient_queue", "mo_consultation", "doctor_profile", "disease_analytics", "asha_patient_service"].includes(screen);

  return (
    <div style={{
      width: "100%",
      maxWidth: 414,
      height: "100vh",
      maxHeight: 844,
      background: isRoleScreen ? "#EEF4FB" : C.bg,
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, sans-serif",
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      overflow: "hidden",
      borderRadius: "min(20px, 4vw)",
      position: "relative",
    }}>
      <div style={{ flex: 1, overflowY: "auto", position: "relative", display: "flex", flexDirection: "column" }}>
        {screen === "role_select" && <RoleSelectScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "asha_login" && <AshaLoginScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "asha_home" && <AshaDashboardScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "asha_profile" && <AshaProfileScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "health_surveys" && <HealthSurveysScreen go={go} backDest={backDest} lang={lang} setLang={setLang} t={t} />}
        {screen === "register_patient" && <RegisterPatientScreen go={go} backDest={backDest} lang={lang} setLang={setLang} t={t} />}
        {screen === "patient_login" && <PatientLoginScreen go={go} backDest={backDest} lang={lang} setLang={setLang} t={t} />}
        {screen === "pharmacy_login" && <PharmacyLoginScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "pharmacy_dashboard" && <PharmacyDashboard go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "pharmacy_profile" && <PharmacyProfileScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "diagnostic_login" && <DiagnosticCenterLoginScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "diagnostic_dashboard" && <DiagnosticDashboard go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "diagnostic_profile" && <DiagnosticProfileScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "doctor_role_select" && <DoctorRoleSelectScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "doctor_login" && <DoctorLoginScreen go={go} lang={lang} setLang={setLang} t={t} roleType={doctorRoleType} />}
        {screen === "cho_dashboard" && <ChoDashboardScreen go={go} lang={lang} setLang={setLang} t={t} roleType={doctorRoleType} />}
        {screen === "cho_patient_queue" && <ChoPatientQueueScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "cho_consultation" && <ChoConsultationScreen go={go} lang={lang} setLang={setLang} t={t} patient={consultPatient} />}
        {screen === "cho_video_consult" && <ChoVideoConsultScreen go={go} lang={lang} setLang={setLang} t={t} patient={consultPatient} doctorType={doctorRoleType} />}
        {screen === "mo_dashboard" && <MoDashboardScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "mo_patient_queue" && <MoPatientQueueScreen go={go} lang={lang} setLang={setLang} t={t} />}
        {screen === "mo_consultation" && <MoConsultationScreen go={go} lang={lang} setLang={setLang} t={t} patient={consultPatient} />}
        {screen === "doctor_profile" && <DoctorProfileScreen go={go} lang={lang} setLang={setLang} t={t} doctorType={doctorProfileType} />}
        {screen === "disease_analytics" && <DiseaseAnalyticsScreen go={go} backDest={backDest} lang={lang} setLang={setLang} t={t} />}
        {screen === "asha_patient_service" && <AshaPatientAssistScreen go={go} serviceType={ashaServiceType} lang={lang} setLang={setLang} t={t} />}
        {screen === "home" && <HomeScreen go={go} isAshaAssisted={isAshaAssisted} lang={lang} setLang={setLang} t={t} />}
        {screen === "aaji" && <AajiChaBatwaScreen t={t} go={go} />}
        {screen === "myths" && <MythVsRealityScreen t={t} go={go} />}
        {screen === "outbreaks" && <OutbreaksScreen t={t} go={go} role="patient" />}
        {screen === "triage" && <TriageScreen go={go} backDest={backDest} t={t} lang={lang} />}
        {screen === "consultQueue" && <ConsultScreen go={go} backDest={backDest} t={t} lang={lang} />}
        {screen === "records" && <RecordsScreen go={go} backDest={backDest} t={t} />}
        {screen === "recordDetail" && <RecordsScreen go={go} backDest={backDest} detail={recordDetail} t={t} />}
        {screen === "freshReferral" && <FreshReferralScreen go={go} meta={freshReferralMeta} t={t} />}
        {screen === "medicines" && <MedicinesScreen go={go} backDest={backDest} t={t} />}
        {screen === "reminders" && <RemindersScreen go={go} backDest={backDest} t={t} />}
        {screen === "emergency" && <EmergencyScreen go={go} backDest={backDest} t={t} />}
        {screen === "profile" && <ProfileScreen go={go} lang={lang} setLang={setLang} t={t} isAshaAssisted={isAshaAssisted} />}
      </div>
      {showBottomNav && <BottomNav active={screen} setScreen={setScreen} t={t} />}
    </div>
  );
}
