/**
 * Client-side image compression using the native Canvas API.
 * Reduces file size before upload to improve mobile experience.
 */

const SIZE_THRESHOLD = 1 * 1024 * 1024; // 1 MB

/**
 * Compress an image file by resizing and re-encoding as JPEG via a canvas.
 *
 * - Files already under 1 MB are returned unchanged.
 * - The image is scaled down (preserving aspect ratio) so neither dimension
 *   exceeds `maxWidth` / `maxHeight`.
 * - Re-encoded as JPEG at the given `quality` (0–1).
 */
export const compressImage = async (
  file: File,
  maxWidth = 2048,
  maxHeight = 2048,
  quality = 0.85,
): Promise<File> => {
  // Skip compression for small files
  if (file.size <= SIZE_THRESHOLD) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width: origW, height: origH } = bitmap;

  // Calculate target dimensions preserving aspect ratio
  let targetW = origW;
  let targetH = origH;

  if (origW > maxWidth || origH > maxHeight) {
    const ratio = Math.min(maxWidth / origW, maxHeight / origH);
    targetW = Math.round(origW * ratio);
    targetH = Math.round(origH * ratio);
  }

  // Draw to an OffscreenCanvas (works in Web Workers too, but fine on main thread)
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // Canvas not supported — return original file as fallback
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  // Encode as JPEG blob
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
      "image/jpeg",
      quality,
    );
  });

  // Derive file name — swap extension to .jpg
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const compressedFile = new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  // Only use the compressed version if it is actually smaller
  if (compressedFile.size >= file.size) {
    return file;
  }

  return compressedFile;
};
