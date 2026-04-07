import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreateSignedUrl = vi.fn();
const mockUpload = vi.fn();
const mockInsert = vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn().mockResolvedValue({ data: { id: "rec-1" }, error: null }) }) });
const mockFromStorage = vi.fn().mockReturnValue({
  createSignedUrl: mockCreateSignedUrl,
  upload: mockUpload,
  getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/img.png" } }),
});
const mockFromDb = vi.fn().mockReturnValue({ insert: mockInsert });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: { from: (...args: unknown[]) => mockFromStorage(...args) },
    from: (...args: unknown[]) => mockFromDb(...args),
  },
}));

import { getSignedUrl, getImageUrl } from "./storage";

describe("getSignedUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns signed URL on success", async () => {
    mockCreateSignedUrl.mockResolvedValue({ data: { signedUrl: "https://signed.url/img" }, error: null });
    const url = await getSignedUrl("bucket", "path/img.png");
    expect(url).toBe("https://signed.url/img");
    expect(mockCreateSignedUrl).toHaveBeenCalledWith("path/img.png", 3600);
  });

  it("caches subsequent calls with same args", async () => {
    mockCreateSignedUrl.mockResolvedValue({ data: { signedUrl: "https://signed.url/cached" }, error: null });
    const url1 = await getSignedUrl("bucket", "path/cached.png");
    const url2 = await getSignedUrl("bucket", "path/cached.png");
    expect(url1).toBe(url2);
    expect(mockCreateSignedUrl).toHaveBeenCalledTimes(1);
  });

  it("throws on error", async () => {
    mockCreateSignedUrl.mockResolvedValue({ data: null, error: { message: "Not found" } });
    await expect(getSignedUrl("bucket", "missing.png")).rejects.toEqual({ message: "Not found" });
  });
});

describe("getImageUrl", () => {
  it("returns public URL", () => {
    const url = getImageUrl("bucket", "path/img.png");
    expect(url).toBe("https://example.com/img.png");
  });
});
