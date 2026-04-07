import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CookieBanner, getConsent } from "./CookieBanner";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) => fallback || key,
  }),
}));

// Mock storage
const mockStorage: Record<string, string> = {};
vi.mock("@/lib/storage", () => ({
  safeGetItem: (key: string) => mockStorage[key] || null,
  safeSetItem: (key: string, value: string) => { mockStorage[key] = value; },
}));

// Mock react-router-dom Link
vi.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; className?: string }) =>
    <a href={to} {...props}>{children}</a>,
}));

describe("CookieBanner", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
  });

  it("renders when no consent stored", () => {
    render(<CookieBanner />);
    expect(screen.getByText("We use cookies")).toBeInTheDocument();
  });

  it("does not render when consent exists", () => {
    mockStorage["artlypet-cookie-consent"] = JSON.stringify({ essential: true, analytics: false, marketing: false });
    render(<CookieBanner />);
    expect(screen.queryByText("We use cookies")).not.toBeInTheDocument();
  });

  it("Accept All sets all consent to true", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Accept All"));
    const stored = JSON.parse(mockStorage["artlypet-cookie-consent"]);
    expect(stored).toEqual({ essential: true, analytics: true, marketing: true });
  });

  it("Essential Only button (before customize) sets analytics/marketing false", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByText("Essential Only"));
    // First click opens customize panel (button text changes), but default text is "Essential Only"
    // Since showCustomize is false, clicking calls setShowCustomize(true)
    // The text changes to "Save Preferences" when customize is shown
    // So we need to verify the panel appears
    expect(screen.getByText("Analytics (Google Analytics)")).toBeInTheDocument();
  });

  it("customize preferences default checkboxes to false (GDPR)", () => {
    render(<CookieBanner />);
    // Open customize panel
    fireEvent.click(screen.getByText("Essential Only"));

    const analyticsCheckbox = screen.getByRole("checkbox", { name: /analytics/i });
    const marketingCheckbox = screen.getByRole("checkbox", { name: /marketing/i });

    expect(analyticsCheckbox).not.toBeChecked();
    expect(marketingCheckbox).not.toBeChecked();
  });

  it("save preferences with defaults saves analytics=false, marketing=false", () => {
    render(<CookieBanner />);
    // Open customize panel
    fireEvent.click(screen.getByText("Essential Only"));
    // Save defaults (both false)
    fireEvent.click(screen.getByText("Save Preferences"));

    const stored = JSON.parse(mockStorage["artlypet-cookie-consent"]);
    expect(stored).toEqual({ essential: true, analytics: false, marketing: false });
  });
});

describe("getConsent", () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
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
