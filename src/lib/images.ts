import { removeBackground } from "@imgly/background-removal";
import { uploadImage } from "@/lib/storage";

export const MAX_IMAGES = 6;
export const MAX_FILE_MB = 5;
const MAX_DIMENSION = 1200;
// Background removal runs faster (and still looks fine for product photos)
// on a smaller input, since we resize the final result anyway.
const BG_REMOVAL_INPUT_DIMENSION = 576;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export type ImagePickError = { file: string; reason: string };

export type PickImagesOptions = {
  /** If true, runs client-side AI background removal and fills with bgColor. */
  removeBg?: boolean;
  /** CSS color used to fill the background when removeBg is true. Defaults to white. */
  bgColor?: string;
};

/** Resize + compress an image file into a Blob (JPEG). */
function resizeToBlob(file: File | Blob, maxDim: number, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
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
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unreadable image"));
    };
    img.src = url;
  });
}

/**
 * Runs AI background removal (fully client-side, via @imgly/background-removal)
 * then composites the cutout onto a solid-color background, returning a Blob.
 */
async function removeBackgroundToColorBlob(file: File, bgColor: string): Promise<Blob> {
  const resized = await resizeToBlob(file, BG_REMOVAL_INPUT_DIMENSION, 0.9);
  const cutoutBlob = await removeBackground(resized, {
    model: "isnet_quint8",
    device: "gpu", // falls back to cpu automatically if WebGPU isn't available
  });
  const url = URL.createObjectURL(cutoutBlob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unsupported"));
        return;
      }
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        0.9,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Background removal produced an unreadable image"));
    };
    img.src = url;
  });
}

/**
 * Resize + upload any image file to Supabase Storage, returning its public URL.
 * Used for banners and any other single-image upload.
 */
export async function compressAndUploadImage(
  file: File,
  maxDim = MAX_DIMENSION,
  folder = "banners",
): Promise<string> {
  const blob = await resizeToBlob(file, maxDim);
  return uploadImage(blob, folder);
}

/**
 * Validate + process files picked from the admin's device, uploading each to
 * Supabase Storage and returning their public URLs (not data URLs — this is
 * what keeps product fetches fast as the catalogue grows).
 * When options.removeBg is true, each image gets its background swapped for
 * options.bgColor (default white) using client-side AI segmentation.
 */
export async function pickProductImages(
  files: FileList | File[],
  existingCount: number,
  options?: PickImagesOptions,
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
      const blob = options?.removeBg
        ? await removeBackgroundToColorBlob(file, options.bgColor ?? "#ffffff")
        : await resizeToBlob(file, MAX_DIMENSION);
      const url = await uploadImage(blob, "products");
      images.push(url);
      room -= 1;
    } catch (err) {
      console.error("Image processing failed:", err);
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