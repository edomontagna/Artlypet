/**
 * Shared TypeScript types for Edge Function request/response contracts.
 * These types define the API contract between client and Edge Functions.
 */

// --- generate-portrait ---
export interface GeneratePortraitRequest {
  original_id: string;
  style_id: string;
  generation_type: "single" | "mix";
  original_id_2?: string;
}

export interface GeneratePortraitResponse {
  generation_id: string;
  status: "completed" | "failed";
  storage_path?: string;
  error?: string;
}

// --- check-generation-status ---
export interface CheckGenerationStatusRequest {
  id: string;
}

export interface CheckGenerationStatusResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  storage_path: string | null;
  error_message: string | null;
  is_hd_unlocked: boolean;
}

// --- create-checkout-session ---
export interface CreateCheckoutSessionRequest {
  package_id: "premium" | "starter" | "bundle" | "collection";
}

export interface CreateCheckoutSessionResponse {
  url: string;
}

// --- serve-image ---
export interface ServeImageRequest {
  generation_id: string;
}

export interface ServeImageResponse {
  mode: "hd" | "watermarked";
  url: string;
  watermark?: string;
  maxDisplaySize?: number;
}

// --- purchase-hd-image ---
export interface PurchaseHdImageRequest {
  generation_id: string;
}

export interface PurchaseHdImageResponse {
  url: string;
}

// --- get-share-data ---
export interface GetShareDataRequest {
  generation_id: string;
}

export interface GetShareDataResponse {
  imageUrl: string;
  styleName: string;
}

// --- create-print-order ---
export interface CreatePrintOrderRequest {
  generated_image_id: string;
}

export interface CreatePrintOrderResponse {
  url: string;
}

// --- delete-account ---
export interface DeleteAccountResponse {
  success: boolean;
}

// --- Common error response ---
export interface ErrorResponse {
  error: string;
}
