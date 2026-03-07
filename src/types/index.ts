export type ArtStyle = {
  id: string;
  name: string;
  slug: string;
  description: string;
  previewImage: string;
  category: 'classic' | 'modern' | 'experimental';
  premium: boolean;
};

export type GenerationMode = 'animals' | 'humans' | 'mix';

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ImageResolution = '1080x1527' | '2160x3054'; // HD vs 4K

export type Generation = {
  id: string;
  userId: string;
  mode: GenerationMode;
  style: string;
  status: GenerationStatus;
  originalImageUrl: string;
  originalImageUrl2?: string; // For mix mode
  resultImageUrl?: string;
  resolution: ImageResolution;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  credits: number;
  freeCreditsUsedThisMonth: number;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'none';
  stripeCustomerId?: string;
  referralCode: string;
  referredBy?: string;
  totalReferrals: number;
  createdAt: string;
};

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium';

export type PricingPlan = {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  credits: number;
  maxResolution: ImageResolution;
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
};

export type PrintProduct = {
  id: string;
  name: string;
  description: string;
  sizes: PrintSize[];
};

export type PrintSize = {
  id: string;
  label: string;
  dimensions: string;
  price: number;
  currency: string;
};

export type ReferralInfo = {
  code: string;
  link: string;
  totalReferrals: number;
  creditsEarned: number;
};

export type DiscountCode = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'credits';
  value: number;
  maxUses?: number;
  currentUses: number;
  expiresAt?: string;
  active: boolean;
};
