import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "clamp(1.4rem, 5vw, 3.5rem)",
      screens: {
        "2xl": "1080px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Jost'", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["clamp(2.8rem, 5.2vw, 5rem)", { lineHeight: "1.06", fontWeight: "300" }],
        "display-sm": ["clamp(2rem, 3.5vw, 3.2rem)", { lineHeight: "1.15", fontWeight: "300" }],
        "label": ["0.68rem", { letterSpacing: "0.22em", fontWeight: "600" }],
      },
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--accent)",
        background: "var(--bg)",
        foreground: "var(--text)",
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        destructive: {
          DEFAULT: "#c53030",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--surface2)",
          foreground: "var(--muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--bg)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          "2": "var(--surface2)",
        },
        sidebar: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
          primary: "var(--accent)",
          "primary-foreground": "#ffffff",
          accent: "var(--surface2)",
          "accent-foreground": "var(--text)",
          border: "var(--border)",
          ring: "var(--accent)",
        },
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-left": {
          "0%": { opacity: "0", transform: "translateX(-28px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-right": {
          "0%": { opacity: "0", transform: "translateX(28px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "bar-width": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "bar-height": {
          "0%": { height: "0%" },
          "100%": { height: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in": "fade-in 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-left": "fade-left 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-right": "fade-right 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "bar-width": "bar-width 0.55s cubic-bezier(0.22,1,0.36,1) forwards",
        "bar-height": "bar-height 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
