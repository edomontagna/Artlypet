import { describe, it, expect, vi } from "vitest";
import { compressImage } from "./imageCompression";

const createFakeFile = (sizeBytes: number, name = "photo.png", type = "image/png"): File => {
  const buffer = new ArrayBuffer(sizeBytes);
  return new File([buffer], name, { type });
};

describe("compressImage", () => {
  it("returns the original file when size is under 1 MB", async () => {
    const smallFile = createFakeFile(500_000); // 500 KB
    const result = await compressImage(smallFile);
    expect(result).toBe(smallFile);
  });

  it("returns the original file when size equals exactly 1 MB", async () => {
    const exactFile = createFakeFile(1 * 1024 * 1024); // 1 MB exactly
    const result = await compressImage(exactFile);
    expect(result).toBe(exactFile);
  });

  it("returns a File object (not a plain Blob) for large files", async () => {
    // Mock createImageBitmap, canvas, and toBlob for jsdom (which lacks Canvas support)
    const fakeBitmap = { width: 4000, height: 3000, close: vi.fn() };
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(fakeBitmap));

    const fakeCtx = { drawImage: vi.fn() };
    const smallBlob = new Blob(["x".repeat(100)], { type: "image/jpeg" });
    const fakeCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(fakeCtx),
      toBlob: vi.fn((cb: (b: Blob | null) => void) => cb(smallBlob)),
    };
    vi.spyOn(document, "createElement").mockReturnValue(fakeCanvas as unknown as HTMLElement);

    const largeFile = createFakeFile(2 * 1024 * 1024, "big-photo.png"); // 2 MB
    const result = await compressImage(largeFile);

    expect(result).toBeInstanceOf(File);
    expect(result.name).toBe("big-photo.jpg"); // extension swapped to .jpg
    expect(result.type).toBe("image/jpeg");

    vi.restoreAllMocks();
  });

  it("returns original file when canvas getContext returns null", async () => {
    const fakeBitmap = { width: 4000, height: 3000, close: vi.fn() };
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(fakeBitmap));

    const fakeCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(null),
    };
    vi.spyOn(document, "createElement").mockReturnValue(fakeCanvas as unknown as HTMLElement);

    const largeFile = createFakeFile(2 * 1024 * 1024);
    const result = await compressImage(largeFile);

    expect(result).toBe(largeFile);
    expect(fakeBitmap.close).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
