export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  program: "programming" | "coaching" | "both";
};

// Placeholder testimonials — swap in real athlete names, roles, and quotes
// whenever they're ready. Tag each with the program(s) it should appear on.
export const testimonials: Testimonial[] = [
  {
    name: "Rohan M.",
    role: "State-Level Cricketer",
    quote:
      "Living outside Gurugram meant I couldn't train with Hitesh in person, but the weekly programs kept me accountable. My bowling speed and recovery both improved within a couple of months.",
    program: "programming",
  },
  {
    name: "Ananya K.",
    role: "Club-Level Footballer",
    quote:
      "The video demonstrations made every exercise easy to follow correctly, even without a coach standing next to me. It felt like proper coaching, just on my own schedule.",
    program: "programming",
  },
  {
    name: "Vikram S.",
    role: "Age-Group Athlete",
    quote:
      "Having every session supervised made all the difference. Small corrections in real time fixed issues I didn't even know I had, and I've felt stronger and more explosive every week.",
    program: "coaching",
  },
  {
    name: "Priya D.",
    role: "Competitive Badminton Player",
    quote:
      "Hitesh adjusts every session around how I'm actually feeling that day, not just what's written on a plan. That kind of attention has kept me injury-free through a full season.",
    program: "coaching",
  },
  {
    name: "Arjun T.",
    role: "Amateur Marathon Runner",
    quote:
      "I switched between the remote program and in-person sessions depending on my travel, and both felt equally structured. Nothing about it ever felt like a random workout.",
    program: "both",
  },
  {
    name: "Meera J.",
    role: "State-Level Hockey Player",
    quote:
      "Six months in and my strength numbers keep climbing steadily. Clear progressions each week made it obvious the plan was actually built around my sport, not copy-pasted.",
    program: "programming",
  },
];
