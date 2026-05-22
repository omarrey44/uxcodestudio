import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050508",
        ink: "#0a0a12",
        accent: {
          blue: "#4f6ef7",
          cyan: "#00d4ff",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        hero: ["var(--font-barlow)", "sans-serif"],
      },
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin 18s linear infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.6", filter: "blur(40px)" },
          "50%": { opacity: "1", filter: "blur(60px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(79,110,247,0.25), transparent 60%)",
        "aurora":
          "conic-gradient(from 180deg at 50% 50%, #4f6ef7 0deg, #00d4ff 120deg, #8b5cf6 240deg, #4f6ef7 360deg)",
      },
      fontSize: {
        display: ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em", fontWeight: "800" }],
        h2: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.25rem, 2vw, 1.75rem)", { lineHeight: "1.1" }],
      },
    },
  },
  plugins: [],
};
export default config;
