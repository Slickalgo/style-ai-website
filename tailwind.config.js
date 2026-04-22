/** @type {import('tailwindcss').Config} */
//
// Ukti marketing site — design tokens mirror style-ai-frontend
// (src/theme/theme.ts, editorialColors) plus the final spec §8 + §9.
// CSS custom properties in style.css are the canonical source; this
// exposes them as Tailwind utilities so class names stay ergonomic.

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./how-it-works.html",
    "./press.html",
    "./privacy.html",
    "./terms.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F1EA",
        bone: "#E8E1D4",
        ink: "#0D0B0A",
        espresso: "#1A1512",
        stone: "#6B6460",
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
      },
      letterSpacing: {
        editorial: "0.12em",
        hero: "-0.02em",
      },
      maxWidth: {
        editorial: "1100px",
        prose: "34em",
      },
    },
  },
  plugins: [],
};
