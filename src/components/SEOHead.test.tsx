import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { SEOHead } from "./SEOHead";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

afterEach(() => {
  cleanup();
  // Reset document state
  document.title = "";
  document.querySelectorAll('meta[name="description"]').forEach((el) => el.remove());
  document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  document.querySelectorAll('meta[property^="og:"]').forEach((el) => el.remove());
  document.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove());
});

describe("SEOHead", () => {
  it("sets document.title correctly", () => {
    render(
      <SEOHead
        title="My Test Title"
        description="Test description"
        canonical="/test"
      />
    );
    expect(document.title).toBe("My Test Title");
  });

  it("creates a meta description tag with the correct content", () => {
    render(
      <SEOHead
        title="Title"
        description="A great description"
        canonical="/page"
      />
    );
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute("content")).toBe("A great description");
  });

  it("creates a canonical link tag", () => {
    render(
      <SEOHead
        title="Title"
        description="Desc"
        canonical="/about"
      />
    );
    const link = document.querySelector('link[rel="canonical"]');
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("https://artlypet.com/about");
  });

  it("sets Open Graph meta tags", () => {
    render(
      <SEOHead
        title="OG Title"
        description="OG Desc"
        canonical="/og-page"
        ogType="article"
      />
    );
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toBe("OG Title");

    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute("content")).toBe("article");
  });

  it("restores default title on unmount", () => {
    const { unmount } = render(
      <SEOHead
        title="Temporary Title"
        description="Temp"
        canonical="/temp"
      />
    );
    expect(document.title).toBe("Temporary Title");

    unmount();
    expect(document.title).toBe("Artlypet — AI Pet Portraits");
  });

  it("handles full URL canonical correctly", () => {
    render(
      <SEOHead
        title="Title"
        description="Desc"
        canonical="https://artlypet.com/custom"
      />
    );
    const link = document.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute("href")).toBe("https://artlypet.com/custom");
  });
});
