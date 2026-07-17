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
        ivory: "#F4EFE6",
        parchment: "#E8DED0",
        soil: "#27221E",
        clay: "#A65F46",
        terracotta: "#C58267",
        sage: "#79816D",
        ochre: "#C9953D",
        indigo: "#31485A",
        sandstone: "#D4B99A",
        "warm-white": "#FCFAF6",
        "rose-earth": "#B98278",

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
          primary: "#A65F46", // clay
          "primary-hover": "#8F4E38",
          secondary: "#31485A", // indigo
          "secondary-hover": "#26394699",
        },
        border: {
          DEFAULT: "#D9CDBC",
        },
        state: {
          focus: "#C9953D", // ochre
          success: "#79816D", // sage
          warning: "#C9953D", // ochre
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
      transitionTimingFunction: {
        earth: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        water: "cubic-bezier(0.45, 0, 0.15, 1)",
        air: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
