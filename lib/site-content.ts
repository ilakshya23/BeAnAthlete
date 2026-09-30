import { programs, type Program } from "@/lib/programs";

export type HeroContent = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  videoUrl: string;
  posterUrl: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  text: string[];
  imageUrl: string;
  imageAlt: string;
  personName: string;
  credential: string;
  credentialLabel: string;
};

export type FeatureVideoContent = {
  videoUrl: string;
  posterUrl: string;
  title: string;
  subtitle: string;
};

export type ContactContent = {
  eyebrow: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  address: string;
};

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  featureVideo: FeatureVideoContent;
  programs: Program[];
  contact: ContactContent;
};

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: "Train Like An Athlete",
    titleLine1: "BE AN",
    titleLine2: "ATHLETE",
    videoUrl: "/videos/hero-bg.mp4",
    posterUrl: "/images/hero-poster.jpg",
  },
  about: {
    eyebrow: "About Us",
    title: "Know More\nAbout Us",
    text: [
      "Certified Strength and Conditioning Coach with over five years of experience designing and periodizing performance programs to enhance athletic ability, reduce injury risk, and develop lifelong movement skills. Specializes in strength training and conditioning for all sports, fitness assessment, mobility, rehabilitation, nutrition planning, youth athletic development, biomechanics, and specialised strength and conditioning programs for cricketers.",
      "Has worked with elite cricket athletes including Mohit Sharma, Sumit Kumar, Shivam Singh, Angkrish Raghuvanshi, and state-level cricketers, and serves as Strength and Conditioning Coach. Former professional cricketer with experience at BCCI/NCA Raw Talent, MRF Pace Foundation, and Ranji Trophy camps. He is a Certified Strength and Conditioning Specialist (CSCS) through the National Strength and Conditioning Association (NSCA), USA.",
    ],
    imageUrl: "/images/coach-profile.png",
    imageAlt: "Hitesh Sharma, Strength & Conditioning Coach",
    personName: "Hitesh Sharma",
    credential: "CSCS",
    credentialLabel: "Certified Strength and Conditioning Specialist",
  },
  featureVideo: {
    videoUrl: "/videos/feature.mp4",
    posterUrl: "/images/video-poster.jpg",
    title: "Inside the Program",
    subtitle: "A closer look at how sessions are built, coached, and progressed.",
  },
  programs,
  contact: {
    eyebrow: "Contact Me",
    title: "Get In Touch",
    description:
      "Have questions about training, coaching, or personalized fitness programs? Fill out the form and I will get back to you soon.",
    phone: "+91 92053 81201",
    email: "hiteshjangid1201@gmail.com",
    address: "331/12 Hans Enclave, near Rajeev Chowk, Gurugram, Haryana 122001",
  },
};

export function normalizeSiteContent(input: unknown): SiteContent {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid site content.");
  }

  const value = input as SiteContent;
  const requiredStrings = [
    value.hero?.eyebrow,
    value.hero?.titleLine1,
    value.hero?.titleLine2,
    value.hero?.videoUrl,
    value.about?.eyebrow,
    value.about?.title,
    value.about?.imageUrl,
    value.featureVideo?.videoUrl,
    value.featureVideo?.title,
    value.contact?.title,
    value.contact?.phone,
    value.contact?.email,
    value.contact?.address,
  ];

  if (requiredStrings.some((field) => typeof field !== "string")) {
    throw new Error("One or more required fields are missing.");
  }
  if (!Array.isArray(value.about.text) || !Array.isArray(value.programs)) {
    throw new Error("Invalid content lists.");
  }

  const ids = new Set<string>();
  const normalizedPrograms = value.programs.map((program, index) => {
    if (!program || typeof program !== "object") throw new Error("Invalid program.");
    const id = String(program.id || "").trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error(`Program ${index + 1} needs a valid URL slug.`);
    }
    if (ids.has(id)) throw new Error(`The program slug “${id}” is duplicated.`);
    ids.add(id);
    if (!String(program.title || "").trim()) {
      throw new Error(`Program ${index + 1} needs a title.`);
    }

    return {
      ...program,
      id,
      number: String(index + 1).padStart(2, "0"),
      href: `/programs/${id}`,
      secondaryImages: Array.isArray(program.secondaryImages)
        ? program.secondaryImages.filter(Boolean)
        : [],
      sections: Array.isArray(program.sections)
        ? program.sections.map((section, sectionIndex) => ({
            number: String(sectionIndex + 1),
            title: String(section.title || ""),
            items: Array.isArray(section.items)
              ? section.items.map(String).filter((item) => item.trim())
              : [],
          }))
        : [],
      highlightTerms: Array.isArray(program.highlightTerms)
        ? program.highlightTerms.map(String).filter((term) => term.trim())
        : [],
      paidDownload: Boolean(program.paidDownload),
    };
  });

  return {
    hero: { ...defaultSiteContent.hero, ...value.hero },
    about: {
      ...defaultSiteContent.about,
      ...value.about,
      text: value.about.text.map(String).filter((text) => text.trim()),
    },
    featureVideo: { ...defaultSiteContent.featureVideo, ...value.featureVideo },
    programs: normalizedPrograms,
    contact: { ...defaultSiteContent.contact, ...value.contact },
  };
}
