export const MAX_IMAGES = 6;
export const MAX_FILE_MB = 5;
const MAX_DIMENSION = 1200;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export type ImagePickError = { file: string; reason: string };

/** Compress + resize an image file into a data URL that is safe to store locally. */
function compress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unsupported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unreadable image"));
    };
    img.src = url;
  });
}

/**
 * Validate + process files picked from the admin's device.
 * Enforces file type, per-file size and the total image count per product.
 */
export async function pickProductImages(
  files: FileList | File[],
  existingCount: number,
): Promise<{ images: string[]; errors: ImagePickError[] }> {
  const list = Array.from(files);
  const images: string[] = [];
  const errors: ImagePickError[] = [];
  let room = Math.max(0, MAX_IMAGES - existingCount);

  for (const file of list) {
    if (!ACCEPTED.includes(file.type)) {
      errors.push({ file: file.name, reason: "only JPG, PNG, WEBP or AVIF allowed" });
      continue;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      errors.push({ file: file.name, reason: `larger than ${MAX_FILE_MB}MB` });
      continue;
    }
    if (room === 0) {
      errors.push({ file: file.name, reason: `max ${MAX_IMAGES} images per product` });
      continue;
    }
    try {
      images.push(await compress(file));
      room -= 1;
    } catch {
      errors.push({ file: file.name, reason: "could not be processed" });
    }
  }

  return { images, errors };
}

/** Split a free-text variant field ("S, M, L") into a clean unique list. */
export const parseVariants = (raw: string): string[] =>
  Array.from(
    new Set(
      raw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  );
