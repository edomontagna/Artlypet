import { PricingPlan, PrintProduct } from '@/types';

export const FREE_CREDITS_PER_MONTH = 3;
export const REFERRAL_CREDITS_REWARD = 2;
export const MAX_FREE_RESOLUTION = '1080x1527' as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    credits: 3,
    maxResolution: '1080x1527',
    features: [
      '3 free creations per month',
      'HD resolution (1080×1527)',
      'All basic art styles',
      'Animals & Humans modes',
      'Digital download',
      'Watermark on free exports',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tier: 'starter',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    credits: 15,
    maxResolution: '1080x1527',
    features: [
      '15 creations per month',
      'HD resolution (1080×1527)',
      'All art styles',
      'All modes including Mix',
      'No watermark',
      'Priority support',
    ],
    stripePriceId: 'price_starter_monthly',
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    credits: 50,
    maxResolution: '2160x3054',
    popular: true,
    features: [
      '50 creations per month',
      '4K resolution (2160×3054)',
      'All art styles including Premium',
      'All modes including Mix',
      'No watermark',
      'Priority generation queue',
      'Commercial use license',
    ],
    stripePriceId: 'price_pro_monthly',
  },
  {
    id: 'premium',
    name: 'Premium',
    tier: 'premium',
    price: 39.99,
    currency: 'USD',
    interval: 'month',
    credits: 150,
    maxResolution: '2160x3054',
    features: [
      '150 creations per month',
      '4K resolution (2160×3054)',
      'All art styles including Premium',
      'All modes including Mix',
      'No watermark',
      'Fastest generation queue',
      'Commercial use license',
      '10% discount on prints',
      'Early access to new styles',
    ],
    stripePriceId: 'price_premium_monthly',
  },
];

export const PRINT_PRODUCTS: PrintProduct[] = [
  {
    id: 'poster',
    name: 'Art Poster',
    description: 'Museum-quality poster on premium matte paper',
    sizes: [
      { id: 'poster-a4', label: 'A4', dimensions: '21×29.7cm', price: 29.99, currency: 'USD' },
      { id: 'poster-a3', label: 'A3', dimensions: '29.7×42cm', price: 39.99, currency: 'USD' },
      { id: 'poster-a2', label: 'A2', dimensions: '42×59.4cm', price: 54.99, currency: 'USD' },
    ],
  },
  {
    id: 'canvas',
    name: 'Canvas Print',
    description: 'Gallery-wrapped canvas with archival inks',
    sizes: [
      { id: 'canvas-30', label: '30×40cm', dimensions: '30×40cm', price: 59.99, currency: 'USD' },
      { id: 'canvas-50', label: '50×70cm', dimensions: '50×70cm', price: 89.99, currency: 'USD' },
      { id: 'canvas-70', label: '70×100cm', dimensions: '70×100cm', price: 129.99, currency: 'USD' },
    ],
  },
  {
    id: 'framed',
    name: 'Framed Print',
    description: 'Archival print in premium wooden frame with museum glass',
    sizes: [
      { id: 'framed-a4', label: 'A4', dimensions: '21×29.7cm', price: 69.99, currency: 'USD' },
      { id: 'framed-a3', label: 'A3', dimensions: '29.7×42cm', price: 99.99, currency: 'USD' },
      { id: 'framed-a2', label: 'A2', dimensions: '42×59.4cm', price: 149.99, currency: 'USD' },
    ],
  },
];
