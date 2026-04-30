import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Body + UI default. Cabinet Grotesk replaces Inter (Inter is an "AI design tell").
        sans: ["'Cabinet Grotesk'", "system-ui", "-apple-system", "sans-serif"],
        // Editorial/marketing display only — opt-in via `font-serif` or `font-display`.
        serif: ["'Playfair Display'", "Georgia", "serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
        // Dashboard / numerical contexts.
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display": ["clamp(2.75rem, 5.5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["clamp(2rem, 3.8vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.015em", fontWeight: "700" }],
      },
      letterSpacing: {
        "tightest": "-0.04em",
      },
      colors: {
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          foreground: "hsl(var(--navy-foreground))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          foreground: "hsl(var(--cream-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "bento": "2.5rem",
        "bento-sm": "1.75rem",
      },
      boxShadow: {
        // Bento 2.0 diffusion: light, wide, low-opacity.
        "diffusion": "0 20px 40px -15px rgba(15, 23, 42, 0.06), 0 4px 12px -4px rgba(15, 23, 42, 0.04)",
        "diffusion-lg": "0 30px 60px -20px rgba(15, 23, 42, 0.10), 0 8px 24px -8px rgba(15, 23, 42, 0.06)",
        // Tinted gold (brand) — for emphasis without neon glow.
        "gold-tint": "0 16px 32px -12px hsl(42 78% 60% / 0.18), 0 4px 12px -4px hsl(42 78% 60% / 0.10)",
        // Inner refraction edge for liquid-glass surfaces.
        "refraction": "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.04)",
        // Spotlight border simulation (used with hover gradient).
        "spotlight": "0 0 0 1px rgba(15, 23, 42, 0.06), 0 12px 32px -8px rgba(15, 23, 42, 0.10)",
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
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "unveil": {
          "0%": { filter: "blur(20px)", opacity: "0", transform: "scale(0.95)" },
          "100%": { filter: "blur(0)", opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "upload-progress": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(200%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "breath": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        "skeleton-shimmer": {
          "0%": { backgroundPosition: "-150% 0" },
          "100%": { backgroundPosition: "250% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in": "scale-in 1s cubic-bezier(0.16,1,0.3,1) forwards",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "unveil": "unveil 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "upload-progress": "upload-progress 1.5s ease-in-out infinite",
        "marquee": "marquee 32s linear infinite",
        "breath": "breath 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "skeleton": "skeleton-shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;
