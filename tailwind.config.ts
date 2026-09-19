import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7f9",
          100: "#d9edf2",
          200: "#b3dbe5",
          300: "#8dc9d8",
          400: "#5a8492",
          500: "#4a7280",
          600: "#3d5f6b",
          700: "#2f4a54",
          800: "#23373f",
          900: "#1a2a30",
        },
        gold: {
          50: "#fdf8ef",
          100: "#fbf0d9",
          200: "#f6deb3",
          300: "#F1BE7E",
          400: "#e8a654",
          500: "#d4912f",
          600: "#b87a24",
          700: "#955f1c",
          800: "#7a4d1a",
          900: "#653f18",
        },
        cream: {
          50: "#FEFCF9",
          100: "#FDF9F2",
          200: "#FAF3E5",
          300: "#F5E9D4",
          400: "#E8D5B5",
        },
        dark: {
          700: "#2c3e42",
          800: "#1e2d31",
          900: "#152024",
        },
      },
      fontFamily: {
        display: ["var(--font-heading)", "serif"],
        heading: ["var(--font-body)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-left": "fadeLeft 0.8s ease-out forwards",
        "fade-right": "fadeRight 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        "slide-down": "slideDown 0.5s ease-out forwards",
        "marquee": "marquee 30s linear infinite",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
