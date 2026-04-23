import { Metadata } from "next";
import DubaiPageClient from "./DubaiPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Dubai Curriculum Tutors | IB, IGCSE, A-Level & American",
  description:
    "At study hours, find expert Dubai tutors online for IB, British, American, Indian  & UAE MOE curriculum. 1-on-1 support for IGCSE, A-Level, IB, AP, SAT & Emsat.",
  alternates: {
    canonical: "https://studyhours.com/uae/online-tutors-dubai",
  },
  openGraph: {
    title: "Dubai Curriculum Tutors | IB, IGCSE, A-Level & American",
    description:
      "At study hours, find expert Dubai tutors online for IB, British, American, Indian  & UAE MOE curriculum. 1-on-1 support for IGCSE, A-Level, IB, AP, SAT & Emsat.",
    url: "https://studyhours.com/uae/online-tutors-dubai",
    images: [
      {
         url: "/hero_calm_education.png",
         width: 1200,
         height: 630,
         alt: "StudyHours Online Tutors Dubai",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dubai Curriculum Tutors | IB, IGCSE, A-Level & American",
    description:
      "At study hours, find expert Dubai tutors online for IB, British, American, Indian  & UAE MOE curriculum. 1-on-1 support for IGCSE, A-Level, IB, AP, SAT & Emsat.",
    images: ["/hero_calm_education.png"],
  },
  authors: [{ name: "StudyHours Academic Team" }],
};

export default function Page() {
  const faqs = [
    {
      q: "Which curricula do Dubai schools follow?",
      a: "Dubai's KHDA-regulated private schools follow a wide range of curricula: British (IGCSE, GCSE, A-Level), IB Diploma Programme, MOE UAE National Curriculum, American, Indian (CBSE/ICSE), French, and German. StudyHours tutors are specialists in every major Dubai curriculum.",
    },
    {
      q: "What is KHDA and how does it affect tutoring in Dubai?",
      a: "KHDA (Knowledge and Human Development Authority) is the government body that regulates private schools in Dubai. Each KHDA-approved school follows a specific curriculum and assessment framework. Our tutors understand KHDA standards and the internal assessment styles of major KHDA-regulated schools.",
    },
    {
      q: "Are online tutors in Dubai as effective as in-person home tutors?",
      a: "Yes: and in many ways more so. Online sessions eliminate Dubai traffic delays, all sessions are recordable for revision, and students get access to subject specialists who know their exact exam board and school assessment style. Our 94% grade improvement rate applies equally to Dubai-based students.",
    },
    {
      q: "How much do online tutors cost in Dubai?",
      a: "StudyHours online tutoring is often more cost-effective than in-person home tutors in Dubai, with no travel surcharges or minimum-hour commitments. Pricing is subject and level-dependent. Book a free assessment session to discuss your child's specific needs and get a quote.",
    },
    {
      q: "Can StudyHours tutors help with GEMS school assessments?",
      a: "Yes. Our tutors are experienced with GEMS Wellington, GEMS World Academy, GEMS Modern Academy, GEMS American Academy, GEMS Founders School, and other GEMS network schools across Dubai. We understand each school's internal assessment formats and exam board alignments.",
    },
    {
      q: "Do you offer tutoring for MOE UAE curriculum in Dubai?",
      a: "Yes. We have tutors specialised in the UAE Ministry of Education national curriculum for both Arabic-medium and English-medium schools in Dubai. This includes all KHDA-regulated government and semi-government schools following the MoE syllabus, including subjects taught in Arabic such as Islamic Studies and Arabic Language.",
    },
    {
      q: "What subjects can I get online tutoring for in Dubai?",
      a: "We cover all subjects across all Dubai curricula: Mathematics, English Language and Literature, Sciences (Physics, Chemistry, Biology, Combined Science), Arabic, Islamic Studies, Economics, Business Studies, Computer Science, History, Geography, and more: across IGCSE, IB, A-Level, MOE UAE, American AP, and CBSE curricula.",
    },
    {
      q: "How quickly can I book an online tutor in Dubai?",
      a: "You can complete a free diagnostic assessment within 24 hours of signing up on StudyHours. After assessment, regular tutor-matched sessions can begin within 48 hours. We have tutors available across Gulf Standard Time (GST) including early morning, afternoon, and evening slots that fit Dubai school timetables.",
    },
  ];

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    name: "StudyHours: Online Tutors Dubai",
    description:
      "Premium online tutoring in Dubai for IGCSE, IB Diploma, A-Level, MOE UAE, American and Indian curricula. Serving students across Dubai Marina, JLT, Business Bay, Jumeirah, Dubai Hills, Arabian Ranches, Mirdif, and all Dubai areas.",
    url: "https://studyhours.com/uae/online-tutors-dubai",
    image: "https://studyhours.com/hero_calm_education.png",
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Sharjah" },
      { "@type": "City", name: "Ajman" },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.2048",
      longitude: "55.2708",
    },
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.9,
      reviewCount: 847,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Online Tutoring Dubai: IGCSE, IB, A-Level, MOE UAE & American Curriculum",
    provider: { "@type": "Organization", name: "StudyHours" },
    description:
      "Comprehensive 1-on-1 online tutoring for Dubai students across IGCSE, IB Diploma, A-Level, MOE UAE, American, and Indian CBSE/ICSE curricula. KHDA-aware tutors matched to your school's exact exam board.",
    educationalLevel: "K-12",
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
         "@type": "Answer",
         text: faq.a,
      },
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
         name: "Online Tutors Dubai",
         item: "https://studyhours.com/uae/online-tutors-dubai",
      },
    ],
  };

  const jsonLd = [localBusinessSchema, courseSchema, faqSchema, breadcrumbSchema];

  const dubaiTestimonials = [
    {
      text: "Our daughter attends Repton Dubai and was struggling with IGCSE Chemistry. Her StudyHours tutor understood the Cambridge specification exactly and her grade moved from a C to an A* within two terms. The tutor even knew the internal mock format Repton uses.",
      author: "Nadia K.",
      role: "Parent: Repton Dubai, IGCSE Year 11",
      rating: 5,
    },
    {
      text: "We were sceptical about online vs a home tutor in Dubai, but the no-traffic convenience and the fact that sessions are recorded changed everything. My son reviews session replays before his IB mock exams at GEMS World Academy. Absolutely worth it.",
      author: "James H.",
      role: "Parent: GEMS World Academy, IB Year 12",
      rating: 5,
    },
    {
      text: "Brilliant IB Maths Analysis and Approaches Higher Level tutor. Living in Business Bay meant finding a good home tutor was a nightmare: everyone wanted a travel allowance on top of the hourly rate. StudyHours solved that completely with same-day booking and evening slots.",
      author: "Priya S.",
      role: "IB Student: Business Bay, Dubai",
      rating: 5,
    },
  ];

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
      <DubaiPageClient testimonials={dubaiTestimonials} faqs={faqs} />
    </>
  );
}
