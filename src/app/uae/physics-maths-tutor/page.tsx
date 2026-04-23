import { Metadata } from "next";
import PhysicsMathsTutorPageClient from "./PhysicsMathsTutorPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Physics and Maths Tutor UAE | Book Free Trial | Study Hours",
  description:
    "Expert online physics and maths tutors in UAE for IGCSE, IB, A-Level, MOE UAE & AP. Book a free session — matched with a tutor in 15 minutes.",
  alternates: {
    canonical: "https://studyhours.com/uae/physics-maths-tutor",
  },
  openGraph: {
    title: "Physics and Maths Tutor UAE | Book Free Trial | Study Hours",
    description:
      "Expert online physics and maths tutors in UAE for IGCSE, IB, A-Level, MOE UAE & AP. Book a free session — matched with a tutor in 15 minutes.",
    url: "https://studyhours.com/uae/physics-maths-tutor",
    images: [
      {
        url: "/hero_calm_education.png",
        width: 1200,
        height: 630,
        alt: "StudyHours Physics and Maths Tutor UAE",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Physics and Maths Tutor UAE | Book Free Trial | Study Hours",
    description:
      "Expert online physics and maths tutors in UAE for IGCSE, IB, A-Level, MOE UAE & AP. Free trial session.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "What is the best way to find a physics and maths tutor in the UAE?",
      a: "The fastest way is to book a free trial session on StudyHours. After signup you describe your child's curriculum (IGCSE, IB, A-Level, MOE UAE, AP, or CBSE), year group, and current challenge areas. We match you with a qualified specialist within 15 minutes to 1 hour. All sessions are online, recorded, and can be scheduled around UAE school timetables.",
    },
    {
      q: "Can a tutor cover both physics and maths together?",
      a: "Yes. Many UAE students study physics and maths concurrently and benefit from a tutor who teaches both subjects. The mathematical reasoning skills in AS-Level or IB Maths HL directly underpin A-Level or IB Physics. Our tutors who specialise in combined physics-maths support understand these cross-subject connections and can co-plan sessions to reinforce shared concepts such as vectors, calculus, and exponential relationships.",
    },
    {
      q: "Which UAE curricula do your physics and maths tutors cover?",
      a: "Our physics and maths tutors cover every major UAE curriculum: IGCSE (Cambridge and Edexcel), A-Level (CIE and Edexcel), IB Diploma (HL and SL), IB MYP, MOE UAE national curriculum (Cycles 1–3 and EmSAT), American AP Physics and AP Calculus/Statistics, and CBSE (Indian curriculum). If you attend a school in Dubai, Abu Dhabi, Sharjah, or anywhere else in the UAE, we have a tutor for your exam board.",
    },
    {
      q: "How much does a physics and maths tutor cost in UAE?",
      a: "StudyHours offers an initial free trial session so you can assess tutor quality before committing. After the trial, session pricing depends on level and subject combination. IGCSE and IB SL typically start lower than A-Level and IB HL. Pricing is transparent — visible before booking. There are no hidden agency fees or long-term contracts. Book your free session to see current rates.",
    },
    {
      q: "Is online physics tutoring as effective as in-person tutoring in Dubai?",
      a: "Yes — and for physics and maths specifically, the online format offers advantages. Tutors can annotate diagrams, share interactive simulations, work through past papers on a shared digital whiteboard, and record the session for the student to review before exams. Our UAE students consistently achieve grade improvements comparable to or better than traditional home tutoring, with the added benefit of no Dubai or Abu Dhabi traffic delays.",
    },
    {
      q: "My child is struggling with IGCSE Physics specifically — can you help?",
      a: "Yes. IGCSE Physics (Cambridge 0625 / Edexcel 4PH1) is one of the most requested subjects on StudyHours in the UAE. Common difficulty areas include electricity and magnetism, waves and optics, and the Paper 6 Alternative to Practical. Our IGCSE Physics tutors know the Cambridge and Edexcel mark schemes precisely and focus sessions on the exact question styles and command word responses that examiners reward.",
    },
    {
      q: "Do you offer IB Maths Analysis and Approaches (AA) tutoring in UAE?",
      a: "Yes. IB Maths AA HL and SL are among the most-requested subjects for UAE international school students. Our IB Maths AA tutors cover the full IB syllabus: functions, algebra, calculus, statistics and probability. We also support the Internal Assessment (IA) exploration — one of the most stressful parts of IB Maths for students who need guidance on choosing a topic and structuring mathematical investigation.",
    },
    {
      q: "How quickly can I get a tutor after booking?",
      a: "In most cases, we match you with a suitable physics and maths tutor within 15 minutes to 1 hour of booking your free session. If your requirement is very specific (for example, a tutor with experience in both IB Physics HL and IB Maths AA HL for an Abu Dhabi school), matching may take slightly longer — but we will always confirm before your scheduled session time.",
    },
  ];

  const testimonials = [
    {
      text: "My son was failing IGCSE Physics and barely passing Maths. His StudyHours tutor covered both subjects and immediately identified where the gaps were. Within six weeks, his Physics grade improved from a D to a B and his Maths from a C to an A. The tutor understood the Cambridge mark scheme exactly.",
      author: "Fatima A.",
      role: "Parent: IGCSE Year 11, British School, Dubai",
      rating: 5,
    },
    {
      text: "Finding an IB tutor who could handle both Physics HL and Maths AA HL in Abu Dhabi felt impossible until we found StudyHours. The tutor knew exactly how the two subjects connect — vectors, calculus, projectile motion — and taught them as one coherent course. My daughter predicted a 7 in both.",
      author: "James R.",
      role: "Parent: IB Year 2, International School, Abu Dhabi",
      rating: 5,
    },
    {
      text: "We needed A-Level Physics and Maths support urgently before mocks. StudyHours matched us with a tutor within 30 minutes of signing up. The sessions were intensive, focused on past paper technique, and completely tailored to the Edexcel mark scheme. My son jumped two grades in both subjects.",
      author: "Nadia K.",
      role: "Parent: A-Level Year 2, Private School, Sharjah",
      rating: 5,
    },
  ];

  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "StudyHours: Physics and Maths Tutors UAE",
    description:
      "Expert online physics and maths tutors in UAE for IGCSE, IB, A-Level, MOE UAE and AP curricula. Book a free trial session and get matched with a specialist tutor within 15 minutes.",
    url: "https://studyhours.com/uae/physics-maths-tutor",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 412,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Physics and Maths Online Tutoring UAE — IGCSE, IB, A-Level, MOE UAE, AP",
    provider: { "@type": "Organization", name: "StudyHours" },
    description:
      "Online physics and maths tutoring for UAE students across all major curricula. IGCSE, A-Level, IB Diploma, MOE UAE national curriculum, and AP. Free trial session. Tutor matched within 15 minutes.",
    educationalLevel: "K-12",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://studyhours.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "UAE Tutoring",
        item: "https://studyhours.com/uae",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Physics and Maths Tutor UAE",
        item: "https://studyhours.com/uae/physics-maths-tutor",
      },
    ],
  };

  const jsonLd = [educationalOrgSchema, courseSchema, faqSchema, breadcrumbSchema];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <PhysicsMathsTutorPageClient testimonials={testimonials} faqs={faqs} />
    </>
  );
}
