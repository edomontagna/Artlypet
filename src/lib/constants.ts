// Credit costs per generation type
export const CREDIT_COST_SINGLE = 100;
export const CREDIT_COST_MIX = 150;
export const SIGNUP_CREDITS = 300;

// Pricing
export const HD_UNLOCK_PRICE = 4.90;
export const PREMIUM_PRICE = 15;
export const PREMIUM_CREDITS = 1500;
export const PRINT_PRICE_FREE = 79.90;
export const PRINT_PRICE_PREMIUM = 59.90;
export const BUSINESS_PRICE_MONTHLY = 200;

// Generation types
export type GenerationType = "single" | "mix";
export type PlanType = "free" | "premium" | "business";

export const getCreditCost = (type: GenerationType): number =>
  type === "mix" ? CREDIT_COST_MIX : CREDIT_COST_SINGLE;
