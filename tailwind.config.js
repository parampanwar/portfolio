/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: { xs: ["13px", "1.6"], sm: ["18px", "1.6"] },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        signal: "rgb(var(--ink) / <alpha-value>)",
        void: "rgb(var(--background) / <alpha-value>)",
        "surface-2": "rgb(var(--surface) / <alpha-value>)",
        "surface-3": "rgb(var(--surface) / <alpha-value>)",
        rim: "rgb(var(--border) / <alpha-value>)",
        "rim-2": "rgb(var(--muted) / <alpha-value>)",
        "text-primary": "rgb(var(--ink) / <alpha-value>)",
        "text-secondary": "rgb(var(--muted) / <alpha-value>)",
        "text-muted": "rgb(var(--muted) / <alpha-value>)",
      },
      maxWidth: { editorial: "1440px" },
      transitionTimingFunction: { editorial: "cubic-bezier(0.22,1,0.36,1)" },
    },
  },
  plugins: [],
};
