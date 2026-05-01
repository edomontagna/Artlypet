import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CookieBanner, getConsent } from "./CookieBanner";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback || key,
  }),
}));

const mockStorage: Record<string, string> = {};
vi.mock("@/lib/storage", () => ({
  safeGetItem: (key: string) => mockStorage[key] || null,
  safeSetItem: (key: string, value: string) => { mockStorage[key] = value; },
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; className?: string }) =>
    <a href={to} {...props}>{children}</a>,
}));

// Pass-through framer-motion: render motion.X as <X> and AnimatePresence as fragment.
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_t, prop) =>
        ({ children, ...rest }: { children?: React.ReactNode; [k: string]: unknown }) => {
          // Drop framer-only props that React would flag.
          const cleanRest = { ...rest } as Record<string, unknown>;
          delete cleanRest.initial;
          delete cleanRest.animate;
          delete cleanRest.exit;
          delete cleanRest.transition;
          delete cleanRest.whileHover;
          delete cleanRest.whileTap;
          const Tag = (typeof prop === "string" ? prop : "div") as keyof JSX.IntrinsicElements;
          return <Tag {...(cleanRest as React.HTMLAttributes<HTMLElement>)}>{children}</Tag>;
        },
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("CookieBanner", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
  });

  it("renders when no consent stored", () => {
    render(<CookieBanner />);
    expect(screen.getByText(/Usiamo cookie/i)).toBeInTheDocument();
  });

  it("does not render when consent exists", () => {
    mockStorage["artlypet-cookie-consent"] = JSON.stringify({ essential: true, analytics: false, marketing: false });
    render(<CookieBanner />);
    expect(screen.queryByText(/Usiamo cookie/i)).not.toBeInTheDocument();
  });

  it("Accetta sets all consent to true", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Accetta"));
    const stored = JSON.parse(mockStorage["artlypet-cookie-consent"]);
    expect(stored).toEqual({ essential: true, analytics: true, marketing: true });
  });

  it("close (X) stores essential-only consent (GDPR-safe dismiss)", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByLabelText("Chiudi"));
    const stored = JSON.parse(mockStorage["artlypet-cookie-consent"]);
    expect(stored).toEqual({ essential: true, analytics: false, marketing: false });
  });

  it("Personalizza opens granular preferences with analytics/marketing defaulted false (GDPR)", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Personalizza"));
    const analyticsCheckbox = screen.getByRole("checkbox", { name: /analytics/i });
    const marketingCheckbox = screen.getByRole("checkbox", { name: /marketing/i });
    expect(analyticsCheckbox).not.toBeChecked();
    expect(marketingCheckbox).not.toBeChecked();
  });

  it("Salva preferenze with defaults saves analytics=false, marketing=false", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Personalizza"));
    fireEvent.click(screen.getByText("Salva preferenze"));
    const stored = JSON.parse(mockStorage["artlypet-cookie-consent"]);
    expect(stored).toEqual({ essential: true, analytics: false, marketing: false });
  });
});

describe("getConsent", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  it("returns null when no consent", () => {
    expect(getConsent()).toBeNull();
  });

  it("handles backward compat: 'accepted'", () => {
    mockStorage["artlypet-cookie-consent"] = "accepted";
    expect(getConsent()).toEqual({ essential: true, analytics: true, marketing: true });
  });

  it("handles backward compat: 'declined'", () => {
    mockStorage["artlypet-cookie-consent"] = "declined";
    expect(getConsent()).toEqual({ essential: true, analytics: false, marketing: false });
  });

  it("parses valid JSON consent", () => {
    mockStorage["artlypet-cookie-consent"] = JSON.stringify({ essential: true, analytics: true, marketing: false });
    expect(getConsent()).toEqual({ essential: true, analytics: true, marketing: false });
  });
});
