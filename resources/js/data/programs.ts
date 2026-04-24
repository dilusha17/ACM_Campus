import ayurveda from "@/assets/programs/ayurveda.jpg";
import acupuncture from "@/assets/programs/acupuncture.jpg";
import naturopathy from "@/assets/programs/naturopathy.jpg";
import physiotherapy from "@/assets/programs/physiotherapy.jpg";
import labSciences from "@/assets/programs/lab-sciences.jpg";
import publicHealth from "@/assets/programs/public-health.jpg";
import complementary from "@/assets/programs/complementary.jpg";
import paramedical from "@/assets/programs/paramedical.jpg";
import tcm from "@/assets/programs/tcm.jpg";
import healthcareMgmt from "@/assets/programs/healthcare-mgmt.jpg";
import yoga from "@/assets/programs/yoga.jpg";
import herbal from "@/assets/programs/herbal.jpg";
import nutrition from "@/assets/programs/nutrition.jpg";
import firstAid from "@/assets/programs/first-aid.jpg";

export type ProgramLevel = "Degree" | "Diploma" | "Certificate";

export interface Program {
  slug: string;
  title: string;
  level: ProgramLevel;
  duration: string;
  short: string;
  overview: string;
  image: string;
  modules: string[];
  careers: string[];
  entry: string[];
}

export const programs: Program[] = [
  {
    slug: "bsc-acupuncture",
    title: "BSc (Hons) Acupuncture & Oriental Medicine",
    level: "Degree",
    duration: "4 years",
    short: "Traditional Chinese Medicine, acupuncture, herbal medicine and integrative patient care.",
    overview:
      "Develop deep clinical competence in acupuncture, Chinese herbal medicine and Tuina, supported by Western medical sciences. Includes 800+ supervised clinical hours.",
    image: acupuncture,
    modules: ["Channel Theory & Point Location", "Diagnosis in TCM", "Chinese Herbal Medicine", "Tuina & Qi Gong", "Western Medical Sciences", "Clinical Internship"],
    careers: ["Licensed Acupuncturist", "TCM Herbalist", "Pain Management Specialist", "Integrative Clinic Practitioner"],
    entry: ["A-Levels BBC (or equivalent)", "GCSE English & Maths grade 4/C+", "IELTS 6.0", "Interview & aptitude assessment"],
  },
  {
    slug: "bsc-ayurveda",
    title: "BSc (Hons) Ayurvedic Medicine",
    level: "Degree",
    duration: "4 years",
    short: "Comprehensive Ayurvedic principles, diagnostics, and clinical practice integrated with modern medical sciences.",
    overview:
      "An academically rigorous degree blending classical Ayurvedic theory with contemporary biomedical sciences. Students undertake clinical placements in the UK and internationally, building a robust foundation for evidence-informed integrative practice.",
    image: ayurveda,
    modules: ["Ayurvedic Anatomy & Physiology", "Diagnostic Methods (Nidana)", "Pharmacology (Dravyaguna)", "Panchakarma Therapy", "Clinical Practice", "Research Methods"],
    careers: ["Ayurvedic Practitioner", "Wellness Consultant", "Integrative Health Researcher", "Herbal Medicine Specialist"],
    entry: ["A-Levels (or equivalent) BBB including a science", "GCSE English & Maths grade 4/C+", "IELTS 6.0 (or equivalent)", "Personal statement & interview"],
  },
  {
    slug: "bsc-naturopathy",
    title: "BSc (Hons) Naturopathic Medicine",
    level: "Degree",
    duration: "4 years",
    short: "Natural healing modalities including nutrition, hydrotherapy, botanical medicine and holistic patient management.",
    overview:
      "A clinically focused programme grounded in naturopathic philosophy and modern evidence. Graduates emerge equipped to support patients through whole-person, preventative care.",
    image: naturopathy,
    modules: ["Naturopathic Philosophy", "Clinical Nutrition", "Botanical Medicine", "Hydrotherapy & Physical Medicine", "Pathophysiology", "Clinical Practice"],
    careers: ["Naturopathic Doctor", "Wellness Coach", "Functional Medicine Practitioner", "Public Health Educator"],
    entry: ["A-Levels BBB including Biology", "GCSE English & Maths grade 4/C+", "IELTS 6.0", "Interview"],
  },
  {
    slug: "bsc-physiotherapy",
    title: "BSc (Hons) Physiotherapy",
    level: "Degree",
    duration: "3 years",
    short: "Clinical physiotherapy across musculoskeletal, neurological and cardiopulmonary rehabilitation.",
    overview:
      "Accredited-style curriculum with extensive NHS-aligned placement experience. Develop the clinical reasoning and manual skills required for autonomous practice.",
    image: physiotherapy,
    modules: ["Anatomy & Biomechanics", "Musculoskeletal Therapy", "Neurological Rehabilitation", "Cardiopulmonary Care", "Evidence-Based Practice", "Clinical Placement"],
    careers: ["Chartered Physiotherapist", "Sports Therapist", "Rehabilitation Specialist", "Community Health Practitioner"],
    entry: ["A-Levels BBB including a science", "GCSE English, Maths & Science grade 4/C+", "IELTS 7.0", "Enhanced DBS check"],
  },
  {
    slug: "bsc-medical-laboratory",
    title: "BSc (Hons) Medical Laboratory Sciences",
    level: "Degree",
    duration: "3 years",
    short: "Clinical biochemistry, haematology, microbiology, histopathology and molecular diagnostics.",
    overview:
      "A laboratory-intensive degree preparing graduates for biomedical scientist roles. Includes professional training placements in NHS-style diagnostic laboratories.",
    image: labSciences,
    modules: ["Clinical Biochemistry", "Haematology & Transfusion", "Medical Microbiology", "Cellular Pathology", "Molecular Diagnostics", "Quality & Laboratory Management"],
    careers: ["Biomedical Scientist", "Clinical Researcher", "Diagnostic Laboratory Manager", "Public Health Analyst"],
    entry: ["A-Levels BBB including Biology or Chemistry", "GCSE English, Maths, Science grade 4/C+", "IELTS 6.5"],
  },
  {
    slug: "bsc-public-health",
    title: "BSc (Hons) Public Health",
    level: "Degree",
    duration: "3 years",
    short: "Epidemiology, health policy, community health and global health systems management.",
    overview:
      "Tackle population health challenges through data-driven, equity-focused study. Includes a community-based research project.",
    image: publicHealth,
    modules: ["Epidemiology", "Health Promotion", "Biostatistics", "Health Policy & Economics", "Global Health", "Research Project"],
    careers: ["Public Health Officer", "Health Policy Analyst", "Epidemiologist", "NGO Programme Manager"],
    entry: ["A-Levels BBC", "GCSE English & Maths grade 4/C+", "IELTS 6.5"],
  },
  {
    slug: "diploma-complementary-medicine",
    title: "Diploma in Complementary Medicine",
    level: "Diploma",
    duration: "2 years",
    short: "Foundation across multiple complementary systems including Ayurveda, Unani and naturopathy.",
    overview:
      "A practical, broad-based diploma giving learners exposure to the core complementary medicine systems and their clinical applications.",
    image: complementary,
    modules: ["Foundations of Complementary Medicine", "Anatomy & Physiology", "Introduction to Ayurveda & Unani", "Naturopathic Practice", "Clinical Skills", "Ethics & Safety"],
    careers: ["Complementary Therapist", "Wellness Centre Practitioner", "Pathway to BSc"],
    entry: ["Level 3 qualification (A-Levels or equivalent)", "IELTS 5.5+", "Personal statement"],
  },
  {
    slug: "diploma-paramedical",
    title: "Diploma in Paramedical Sciences",
    level: "Diploma",
    duration: "2 years",
    short: "Emergency medical services, diagnostic imaging and laboratory technology with clinical rotations.",
    overview:
      "Train for frontline allied health roles with a balanced curriculum of theory, simulation and supervised clinical exposure.",
    image: paramedical,
    modules: ["Emergency Care", "Diagnostic Imaging Basics", "Laboratory Technology", "Patient Communication", "Anatomy & Physiology", "Clinical Placement"],
    careers: ["Paramedical Technician", "Imaging Assistant", "Laboratory Technician"],
    entry: ["Level 3 qualification", "IELTS 5.5+", "Health screening"],
  },
  {
    slug: "diploma-tcm",
    title: "Diploma in Traditional Chinese Medicine",
    level: "Diploma",
    duration: "2 years",
    short: "Acupuncture, cupping, moxibustion and Chinese herbal medicine with clinical practicum.",
    overview:
      "A focused introduction to TCM practice for learners progressing toward licensed practitioner pathways.",
    image: tcm,
    modules: ["TCM Theory", "Acupuncture Techniques", "Cupping & Moxibustion", "Chinese Herbal Basics", "Clinical Observation"],
    careers: ["TCM Assistant Practitioner", "Wellness Therapist", "Pathway to BSc Acupuncture"],
    entry: ["Level 3 qualification", "IELTS 5.5+"],
  },
  {
    slug: "diploma-healthcare-management",
    title: "Diploma in Healthcare Management",
    level: "Diploma",
    duration: "18 months",
    short: "Management principles applied to healthcare: administration, quality assurance and informatics.",
    overview:
      "Equip yourself with the operational and strategic skills needed in modern healthcare organisations.",
    image: healthcareMgmt,
    modules: ["Healthcare Systems", "Operations & Quality", "Health Informatics", "Leadership", "Finance for Healthcare"],
    careers: ["Practice Manager", "Healthcare Coordinator", "Quality Officer"],
    entry: ["Level 3 qualification or equivalent experience", "IELTS 5.5+"],
  },
  {
    slug: "certificate-yoga-therapy",
    title: "Certificate in Yoga Therapy",
    level: "Certificate",
    duration: "6 months",
    short: "Therapeutic yoga for stress management, rehabilitation and chronic disease support.",
    overview:
      "A practical certificate combining classical yoga therapeutics with evidence-informed application.",
    image: yoga,
    modules: ["Yoga Philosophy", "Therapeutic Asana", "Pranayama & Meditation", "Teaching Methodology"],
    careers: ["Yoga Therapist", "Wellness Coach", "Studio Practitioner"],
    entry: ["Open to all learners aged 18+", "IELTS 5.0+"],
  },
  {
    slug: "certificate-herbal-medicine",
    title: "Certificate in Herbal Medicine",
    level: "Certificate",
    duration: "6 months",
    short: "Identification, preparation and clinical application of medicinal herbs.",
    overview:
      "Build practical herbal knowledge across Western, Ayurvedic and Chinese traditions, with safety and ethics at the core.",
    image: herbal,
    modules: ["Materia Medica", "Herbal Preparations", "Safety & Interactions", "Case Studies"],
    careers: ["Herbal Apothecary Assistant", "Wellness Educator"],
    entry: ["Open to all learners aged 18+", "IELTS 5.0+"],
  },
  {
    slug: "certificate-nutrition",
    title: "Certificate in Nutrition & Dietetics",
    level: "Certificate",
    duration: "6 months",
    short: "Clinical nutrition assessment, therapeutic diets and evidence-based counselling.",
    overview:
      "Practical nutritional skills for diverse populations, grounded in current scientific evidence.",
    image: nutrition,
    modules: ["Macronutrients & Micronutrients", "Nutritional Assessment", "Therapeutic Diets", "Counselling Skills"],
    careers: ["Nutrition Advisor", "Wellness Coach", "Health Educator"],
    entry: ["Open to all learners aged 18+", "IELTS 5.5+"],
  },
  {
    slug: "certificate-first-aid",
    title: "Certificate in First Aid & Emergency Care",
    level: "Certificate",
    duration: "3 months",
    short: "Essential emergency response, basic life support and pre-hospital care protocols.",
    overview:
      "Hands-on, scenario-based training in life-saving skills suitable for healthcare entrants and community responders.",
    image: firstAid,
    modules: ["Basic Life Support", "Wound Management", "Trauma Care", "Emergency Scenarios"],
    careers: ["First Responder", "Community Health Volunteer"],
    entry: ["Open to all learners aged 18+"],
  },
];

export const getProgramBySlug = (slug: string) => programs.find((p) => p.slug === slug);
