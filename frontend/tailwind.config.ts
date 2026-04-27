import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        /* Obsidian Studio core */
        void:    "#070709",
        obsidian:"#0B0B0F",
        onyx:    "#111116",
        carbon:  "#1A1A22",
        ash:     "#252530",
        "ash-light": "#30303E",
        silver:  "#8A8A9A",
        mist:    "#C4C4D4",

        /* Accents */
        "neon-violet":  "#7C6FE0",
        "electric-blue":"#4A90E2",
        emerald:  "#10D67A",
        amber:    "#F5A623",
        ruby:     "#E0514A",

        /* Semantic aliases */
        background: "var(--background)",
        foreground: "var(--foreground)",
        border:     "var(--border)",
        input:      "var(--input)",
        ring:       "var(--ring)",
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        surface: {
          lowest:  "var(--surface-lowest)",
          low:     "var(--surface-low)",
          DEFAULT: "var(--surface)",
          high:    "var(--surface-high)",
          highest: "var(--surface-highest)",
          bright:  "var(--surface-bright)",
        },
        primary: {
          DEFAULT:                "var(--primary)",
          foreground:             "var(--primary-foreground)",
          container:              "var(--primary-container)",
          "container-foreground": "var(--primary-container-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          container:  "var(--secondary-container)",
          "container-foreground": "var(--secondary-container-foreground)",
        },
        tertiary: {
          DEFAULT:    "var(--tertiary)",
          foreground: "var(--tertiary-foreground)",
          container:  "var(--tertiary-container)",
          "container-foreground": "var(--tertiary-container-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--error)",
          foreground: "var(--error-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
      },

      fontFamily: {
        display:  ["Syne", "sans-serif"],
        headline: ["Manrope", "sans-serif"],
        body:     ["Inter", "sans-serif"],
        label:    ["Inter", "sans-serif"],
        sans:     ["Inter", "system-ui", "sans-serif"],
      },

      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      boxShadow: {
        glow:        "0 0 20px rgba(124,111,224,0.35), 0 0 60px rgba(124,111,224,0.1)",
        "glow-sm":   "0 0 10px rgba(124,111,224,0.3)",
        "glow-blue": "0 0 20px rgba(74,144,226,0.3)",
        "card":      "0 4px 24px rgba(0,0,0,0.4)",
        "card-lg":   "0 12px 48px rgba(0,0,0,0.6)",
        "inner-glow":"inset 0 0 20px rgba(124,111,224,0.08)",
      },

      backgroundImage: {
        aurora:        "linear-gradient(135deg, #7C6FE0 0%, #4A90E2 100%)",
        "aurora-dim":  "linear-gradient(135deg, rgba(124,111,224,0.15) 0%, rgba(74,144,226,0.15) 100%)",
        "radial-glow": "radial-gradient(ellipse at center, rgba(124,111,224,0.15) 0%, transparent 70%)",
      },

      animation: {
        "fade-in":        "fadeIn 0.4s ease-out",
        "slide-up":       "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "shimmer":        "shimmer-sweep 1.6s ease-in-out infinite",
        "float":          "float 6s ease-in-out infinite",
        "pulse-glow":     "pulseGlow 2s ease-in-out infinite",
        "spin-slow":      "spin 8s linear infinite",
        "waveform":       "waveformPulse 1.2s ease-in-out infinite alternate",
        "scan":           "scanLine 3s linear infinite",
      },

      keyframes: {
        fadeIn:       { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp:      { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float:        { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        pulseGlow:    { "0%, 100%": { boxShadow: "0 0 10px rgba(124,111,224,0.3)" }, "50%": { boxShadow: "0 0 30px rgba(124,111,224,0.6)" } },
        waveformPulse:{ "from": { transform: "scaleY(0.3)", opacity: "0.4" }, "to": { transform: "scaleY(1)", opacity: "1" } },
        scanLine:     { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100vh)" } },
      },
    },
  },
  plugins: [],
};

export default config;
