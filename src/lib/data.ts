export const profile = {
  name: "Vivek Salwan",
  firstName: "Vivek",
  lastName: "Salwan",
  email: "viveksalwan25@gmail.com",
  phone: "+1 (905) 325-6089",
  github: "https://github.com/VivekSalwan2000",
  githubHandle: "VivekSalwan2000",
  linkedin: "https://www.linkedin.com/in/viveksalwan/",
  linkedinHandle: "in/viveksalwan",
  resumeHref: "/resume.pdf",
  eyebrow: "Software Engineer",
  heroAccent: "I like turning ideas into something real.",
};

export type VitalRow = {
  label: string;
  headline: string;
  detail?: string;
};

/**
 * A single systematic list combining education + achievements, one row per
 * fact — label on the left, headline + supporting detail on the right. Sits
 * under the About photo instead of two separately-styled cards.
 */
export const vitals: VitalRow[] = [
  {
    label: "Education",
    headline: "B.Sc. (Honours), Computer Science",
    detail: "Concentration in Software Engineering · Brock University · Jan 2021 — Oct 2025",
  },
  {
    label: "GPA",
    headline: "3.7",
    detail: "Dean's Honours List — 2021, 2022, 2024",
  },
  {
    label: "Scholarship",
    headline: "Joyce Family Foundation",
  },
  {
    label: "Ranked",
    headline: "#1 of 20 advisors",
    detail: "98% CSAT on a Fortune 100 support account",
  },
  {
    label: "Accessibility",
    headline: "20 government sites",
    detail: "Brought into WCAG compliance",
  },
];

export type ExperienceEntry = {
  numeral: string;
  role: string;
  company: string;
  location: string;
  period: string;
  context: string;
  points: string[];
  stat: { value: string; label: string };
  skills: string[];
};

export const experience: ExperienceEntry[] = [
  {
    numeral: "I",
    role: "Technical Support Advisor",
    company: "Concentrix Corporation",
    location: "Niagara Falls, ON",
    period: "Aug 2025 — Present",
    context: "FORTUNE 100 TECHNOLOGY CLIENT",
    points: [
      "Resolved 40 to 50 customer interactions daily for a Fortune 100 technology client, achieving 98% CSAT, 100% QA, and 8% escalation rate while ranking first among 20 advisors on a team ranked #1 across 12 site teams.",
      "Systematically identified recurring patterns across documented findings to engineering groups, prompting product fixes or troubleshooting guidance for future contacts.",
      "Trained 7 new hires and peers on troubleshooting workflows, documentation standards, and escalation procedures, enabling faster onboarding and independent resolution of complex issues.",
      "Managed 900+ cases requiring multi-step identity verification and payment data handling, maintaining 100% adherence and schedule compliance with zero security incidents.",
    ],
    stat: { value: "98%", label: "CSAT · RANKED #1 OF 20" },
    skills: ["Customer Support", "Escalation Management", "Training & Onboarding", "Identity Verification"],
  },
  {
    numeral: "II",
    role: "Data & Automation Analyst",
    company: "Ministry of Public and Business Service Delivery and Procurement (MPBSDP)",
    location: "St. Catharines, ON",
    period: "May 2024 — Aug 2024",
    context: "ITSM · SHAREPOINT · POWER BI",
    points: [
      "Coordinated 20 to 40 change records weekly (ITSM platform, SharePoint, Power BI), standardizing documentation and following up on approvals to contribute to an observed 10 to 20% improvement in approval cycle efficiency.",
      "Built a SharePoint site from scratch for a newly formed Problem Management team, embedding Power BI dashboards and timelines to enable 200 to 250 users to access project updates and incident status without direct outreach.",
      "Presented the SharePoint site to 300+ ministry staff and managers, translating site functionality into plain-language guidance for non-technical audiences and implementing automated email notifications on manager request.",
      "Facilitated 15 to 16 weekly CAB meetings, gathering updates from change owners, sequencing agenda items by priority, and presenting Power BI summaries to senior managers and technical leads to keep approvals on track.",
    ],
    stat: { value: "10-20%", label: "FASTER APPROVAL CYCLES" },
    skills: ["ITSM Change Management", "SharePoint", "Power BI", "CAB Facilitation"],
  },
  {
    numeral: "III",
    role: "Junior Technical Analyst",
    company: "Ontario Ministry of Transportation (MTO)",
    location: "St. Catharines, ON",
    period: "May 2022 — Dec 2022",
    context: "ITSM CHANGE MANAGEMENT · WCAG",
    points: [
      "Owned the ITSM change management process solo after one week of onboarding, processing 25 change requests per week from intake to deployment and enabling technical analysts to focus on higher-priority project delivery.",
      "Coordinated weekly CAB meetings as sole lead, preparing change packages (implementation plans, testing evidence, approval records) and briefing managers on changes, reducing team burden by an estimated 15 hours per week.",
      "Tested and redesigned 20 government websites against WCAG, generating per-site severity reports with recommendations and closing semantic HTML, keyboard navigation, and contrast failures.",
      "Generated exception reports for COTS applications and remediated front-end accessibility issues on the ministry's internal contract budget and invoicing system, translating WCAG compliance gaps into targeted code changes.",
    ],
    stat: { value: "20", label: "GOV SITES AUDITED FOR WCAG" },
    skills: ["ITSM Change Management", "WCAG Auditing", "Accessibility Remediation", "CAB Facilitation"],
  },
];

export type CaseStudyProject = {
  slug: string;
  name: string;
  status: string;
  tagline: string;
  image: string;
  problem: string;
  decision: string;
  result: string;
  stack: string[];
  repo: string;
};

export const projects: CaseStudyProject[] = [
  {
    slug: "villagewar",
    name: "VillageWar",
    image: "/projects/villagewar.webp",
    status: "Shipped · JDK 17/21 CI matrix",
    tagline: "Multithreaded JavaFX client-server strategy game",
    problem:
      "A multiplayer strategy game needs multiple clients to interact with shared game state without one slow connection blocking everyone else.",
    decision:
      "Built an authoritative TCP server with independent client handling, while keeping network I/O away from the JavaFX UI thread.",
    result:
      "A responsive multiplayer system with 28 JUnit 5 tests, automated JDK 17/21 CI, and separated networking, game logic, and presentation layers.",
    stack: ["Java 17", "JavaFX", "TCP", "Maven", "JUnit 5", "GitHub Actions"],
    repo: "VivekSalwan2000/Game-War-Advanced-OOPs",
  },
  {
    slug: "festify",
    name: "Festify",
    image: "/projects/festify.webp",
    status: "Shipped · Live web app · 29 tests",
    tagline: "Full-stack event discovery & ticketing platform",
    problem:
      "Event discovery, ticketing, organizer management, and check-in usually live across separate systems.",
    decision:
      "Built the entire flow around a shared Firebase backend, connecting authentication, Firestore, storage, ticketing, organizer dashboards, and QR verification.",
    result:
      "A full event platform supporting real-time organizer workflows, ticket validation, transactional emails, and AI-generated event posters, backed by 29 Jest tests across 6 suites.",
    stack: ["JavaScript", "Firebase", "Firestore", "Jest", "DALL·E", "GitHub Pages"],
    repo: "VivekSalwan2000/festify",
  },
  {
    slug: "newshub",
    name: "NewsHub",
    image: "/projects/newshub.webp",
    status: "Shipped · Android · Production-minded",
    tagline: "Native Android news reader with AI-assisted reading",
    problem:
      "A news reader has to juggle live network requests, changing screens, local bookmarks, and long-form content without slowing down the experience.",
    decision:
      "Built lifecycle-safe networking around Retrofit and a shared background executor, with Room handling local bookmarks and WebView handling in-app reading.",
    result:
      "A native Java app supporting live news across 13 languages, offline bookmarks, category/search flows, and optional AI-generated article summaries.",
    stack: ["Java", "Android", "Retrofit", "Room", "WebView", "Hugging Face"],
    repo: "VivekSalwan2000/NewsHub---Android-News-App",
  },
];

export type SecondaryProject = {
  name: string;
  detail: string;
  repo: string;
};

export const secondaryProjects: SecondaryProject[] = [
  {
    name: "Next-Word Prediction",
    detail:
      "RNN language model (TensorFlow/Keras) predicting the next word from a sliding-window token sequence.",
    repo: "VivekSalwan2000/RNN-Based-Next-Word-Prediction-Model",
  },
  {
    name: "Diabetes Prediction",
    detail:
      "Logistic regression built from scratch in NumPy — 76.5% accuracy vs. scikit-learn's 75.2% on the same split.",
    repo: "VivekSalwan2000/Logistic-Regression-Diabetes",
  },
];

export const disciplines = [
  "FULL-STACK DEVELOPMENT",
  "BACKEND SYSTEMS",
  "APPLIED MACHINE LEARNING",
  "JAVA & JAVAFX",
  "ANDROID · FIREBASE",
  "CI/CD · GITHUB ACTIONS",
  "WCAG ACCESSIBILITY",
];

export const inquiryTypes = ["Full-Time Role", "Co-op / Internship", "Contract Work", "Other"];

export const chapters = [
  { id: "top", index: "00", label: "Home" },
  { id: "about", index: "01", label: "About" },
  { id: "experience", index: "02", label: "Experience" },
  { id: "projects", index: "03", label: "Projects" },
  { id: "contact", index: "04", label: "Contact" },
];
