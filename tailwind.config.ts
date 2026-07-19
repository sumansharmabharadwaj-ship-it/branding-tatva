import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base palette (from BRAND_STRATEGY / PROJECT_PLAN)
        // Deepened/richer versions of the original earthy accents — same
        // hues, pushed more saturated so they read as bolder rather than
        // washed out, especially at the low opacities used for tints and
        // watermark numerals throughout the site.
        ivory: "#F4EFE6",
        parchment: "#E8DED0",
        soil: "#27221E",
        clay: "#B85A34",
        terracotta: "#CD7A4C",
        sage: "#5C6B4A",
        ochre: "#C28A28",
        indigo: "#24394D",
        sandstone: "#D4B99A",
        "warm-white": "#FCFAF6",
        "rose-earth": "#AD6F5C",

        // Semantic tokens — components should reference these, not raw colors
        background: {
          DEFAULT: "#F4EFE6", // ivory
          alt: "#E8DED0", // parchment
          elevated: "#FCFAF6", // warm-white
        },
        foreground: {
          DEFAULT: "#27221E", // soil (primary text)
          secondary: "#5A5148", // muted soil (secondary text)
        },
        action: {
          primary: "#B85A34", // clay
          "primary-hover": "#9C4A29",
          secondary: "#24394D", // indigo
          "secondary-hover": "#1B2B3899",
        },
        border: {
          DEFAULT: "#D9CDBC",
        },
        state: {
          // Darkened from the base ochre (#C28A28, still used elsewhere)
          // specifically for focus rings — the base value only reaches
          // 2.63:1 against the cream background, below WCAG 1.4.11's 3:1
          // minimum for UI-indicator contrast. This clears 3:1 against
          // every section background on the site, light or dark.
          focus: "#A57522",
          success: "#5C6B4A", // sage
          warning: "#C28A28", // ochre
          error: "#B4432E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        // Responsive-friendly display scale (paired with clamp() in globals.css utilities)
        "display-xl": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1.08" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.15" }],
        "display-sm": ["clamp(1.375rem, 2vw, 1.875rem)", { lineHeight: "1.25" }],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.875rem",
      },
      boxShadow: {
        // Layered elevation — a tight "contact" shadow close to the surface
        // plus a soft, diffuse "ambient" one further out, mimicking how
        // light actually falls, instead of Tailwind's single flat default.
        // Tinted with the brand's soil color rather than pure black so it
        // reads warm at low opacity instead of grey.
        "elevation-sm": "0 1px 2px rgba(39,34,30,0.08), 0 2px 10px rgba(39,34,30,0.06)",
        "elevation-md": "0 2px 4px rgba(39,34,30,0.10), 0 10px 28px rgba(39,34,30,0.12)",
        "elevation-lg": "0 4px 10px rgba(39,34,30,0.14), 0 20px 48px rgba(39,34,30,0.16)",
      },
      transitionTimingFunction: {
        earth: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        air: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
