/** @type {import('tailwindcss').Config} */
//
// Editorial token system — shared vocabulary with the Style.ai app
// (see ../style-ai-frontend/src/theme/theme.ts, editorialColors + editorialType).
// Duplicated BY VALUE (not imported) so the sites stay decoupled; if tokens
// drift in the app, update here too.
//
// Anti-pattern audit: the prior config had ~50 Material-style tokens (plum,
// maroon, surface-container-highest, etc.). Deleted entirely — they were
// CSS-weight tax with no design payoff, and the visual identity now matches
// the app's paper + ink + stone + Fraunces aesthetic.

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./terms.html",
    "./privacy.html",
    "./how-she-works.html",
    "./the-looks.html",
    "./guides/**/*.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Canvas — ordered by frequency of use across the site.
        paper: "#F5F1EA",  // primary canvas; most sections sit on this
        ink:   "#0D0B0A",  // primary text + hero backdrop
        stone: "#A89B8A",  // hairlines, marginalia, secondary meta

        // Reserved accents — one per page at most.
        ember: "#A7412A",  // emphasis (verdict stamp tint only)
        clay:  "#C6B5A3",  // warm neutral for gradient washes
      },
      fontFamily: {
        // Fraunces — display + verdict stamps + editorial prose.
        // Italic is the voice carrier; use it wherever the stylist "speaks."
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        // IBM Plex Mono — eyebrows, meta lines, CTA labels, captions.
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        // System-UI — body paragraphs and long-form prose where Fraunces
        // would be overkill. Marketing copy, not a book.
        body: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      fontWeight: {
        // Fraunces + Plex Mono subset below — keep font-weights to what we
        // actually ship so Tailwind doesn't emit unused weight classes.
        regular: "400",
        medium: "500",
        semibold: "600",
      },
      letterSpacing: {
        // Mono caps eyebrow default — matches app's editorialType.label.
        editorial: "0.18em",
        wider: "0.22em",
      },
      fontSize: {
        // Editorial type scale. Mobile-first — these are the 390px baselines;
        // desktop scales via clamp() in style.css components.
        eyebrow: ["10px", { lineHeight: "1.2", letterSpacing: "0.18em" }],
        whisper: ["13px", { lineHeight: "1.4" }],
        caption: ["14px", { lineHeight: "1.5" }],
        verdict: ["40px", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        "verdict-lg": ["56px", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "verdict-xl": ["72px", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        // Warm grain tint overlay for full-bleed hero compositions. Paired
        // with a noise SVG in public/ to avoid a raster texture in the
        // critical CSS. 8% opacity keeps it tactile without busying the image.
        "ink-fade-bottom":
          "linear-gradient(to top, rgba(13, 11, 10, 0.88) 0%, rgba(13, 11, 10, 0.55) 45%, rgba(13, 11, 10, 0) 100%)",
        "ink-fade-top":
          "linear-gradient(to bottom, rgba(13, 11, 10, 0.45) 0%, rgba(13, 11, 10, 0) 55%)",
      },
      maxWidth: {
        // Editorial reading column — desktop content never exceeds this.
        editorial: "1100px",
        prose: "520px", // mobile-centered copy blocks
      },
    },
  },
  plugins: [],
};
