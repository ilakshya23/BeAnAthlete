import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",       // near-black background
        charcoal: "#141414",  // secondary panels
        bolt: "#F5C400",      // signature yellow
        boltdim: "#B89200",   // pressed / hover yellow
        chalk: "#F7F6F2",     // off-white
        steel: "#8a8a86",     // muted grey text on dark
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: ".35em",
      },
      backgroundImage: {
        "grain": "url('/grain.png')",
      },
    },
  },
  plugins: [],
};
export default config;
