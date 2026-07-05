export type ProgramSection = {
  number: string; // "1", "2", "3"...
  title: string;
  items: string[];
};

export type Program = {
  id: string;
  number: string; // display index, e.g. "01"
  title: string;
  subtitle: string;
  blurb: string;
  description: string;
  heroImage: string;
  secondaryImages: string[];
  sections: ProgramSection[];
  closingNote: string;
  href: string;
};

// Add new programs here as they become available.
// The grid and numbering update automatically — no layout changes needed
// when you grow this list from 2 up to 10 (or beyond).
export const programs: Program[] = [
  {
    id: "one-on-one-program",
    number: "01",
    title: "1-on-1 Athlete Programming",
    subtitle: "Train With Purpose and Structure",
    blurb:
      "This option helps athletes train with purpose and structure, ensuring steady progress without relying on random workouts.",
    description:
      "1-on-1 Programming is designed for athletes who want a structured and personalized training program but cannot attend in-person coaching sessions. This option allows athletes from anywhere in the world to follow a professional strength and conditioning program designed specifically for their sport and goals.",
    heroImage: "/images/program-sprint-drill.jpg",
    secondaryImages: ["/images/program-deadlift-single-leg.jpg"],
    sections: [
      {
        number: "1",
        title: "How the Process Works",
        items: [
          "Initial consultation and athlete assessment.",
          "Understanding the athlete's sport, position, goals, and training history.",
          "Evaluation of strengths, weaknesses, and potential limitations.",
        ],
      },
      {
        number: "2",
        title: "What Is Included",
        items: [
          "A fully individualized strength and conditioning program.",
          "Exercise demonstration videos and technique guidance.",
          "Clear sets, repetitions, loading recommendations, and progression guidelines.",
          "A structured weekly training schedule.",
          "Ongoing support where athletes can reach out anytime for questions or adjustments.",
        ],
      },
      {
        number: "3",
        title: "Benefits of 1-on-1 Programming",
        items: [
          "Personalized training plan based on sport demands.",
          "Structured and progressive workouts.",
          "Affordable alternative to personal training.",
          "Professional guidance from anywhere in the world.",
          "Better results than random workouts or social media programs.",
        ],
      },
    ],
    closingNote:
      "This option helps athletes train with purpose and structure, ensuring steady progress without relying on random workouts.",
    href: "/programs/one-on-one-program",
  },
  {
    id: "one-on-one-coaching",
    number: "02",
    title: "1-on-1 Personal Coaching",
    subtitle: "The Gold Standard for Athlete Development",
    blurb:
      "Because every session is supervised and customized, 1-on-1 Personal Coaching is considered the gold standard for athlete development.",
    description:
      "1-on-1 Personal Coaching is the most effective way for athletes to improve performance. In this format, every coaching session is directly supervised by Coach Hitesh Sharma. This ensures correct technique, proper training intensity, and continuous improvement in strength, power, speed, and overall athletic ability.",
    heroImage: "/images/program-coaching-spot.jpeg",
    secondaryImages: [
      "/images/program-lunge-couple.jpg",
      "/images/program-cone-drill.jpg",
    ],
    sections: [
      {
        number: "1",
        title: "What Is Included",
        items: [
          "Initial athlete assessment including movement quality, strength level, and sport demands.",
          "Fully supervised training sessions with real-time technique correction.",
          "Personalized strength, power, mobility, and conditioning coaching.",
          "Adjustments to sessions based on fatigue, practice load, or match schedule.",
        ],
      },
      {
        number: "2",
        title: "Benefits of 1-on-1 Personal Coaching",
        items: [
          "Maximum coaching attention.",
          "Higher training quality and safety.",
          "Immediate feedback and corrections.",
          "Faster strength and performance improvements.",
          "Strong accountability and motivation.",
          "Lower risk of injury.",
        ],
      },
      {
        number: "3",
        title: "Why It Works",
        items: [
          "Every session is supervised directly by Coach Hitesh Sharma.",
          "Coaching is adjusted in real time based on performance and recovery.",
          "Athletes receive personalized coaching for technique, intensity, and progress.",
          "This format delivers the highest level of structure, safety, and results.",
        ],
      },
    ],
    closingNote:
      "Because every session is supervised and customized, 1-on-1 Personal Coaching is considered the gold standard for athlete development.",
    href: "/programs/one-on-one-coaching",
  },
];
