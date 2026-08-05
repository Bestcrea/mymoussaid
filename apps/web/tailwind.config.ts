import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf8f0",
          100: "#f9edd8",
          200: "#f2d7a8",
          300: "#e8b96e",
          400: "#dc9535",
          500: "#c47a1e",  // primary gold — Moroccan aesthetic
          600: "#a3611a",
          700: "#834b16",
          800: "#6a3b12",
          900: "#55300f",
        },
        neutral: {
          50:  "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
