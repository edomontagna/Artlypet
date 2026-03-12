export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    credits: 3,
    resolution: "hd" as const,
    maxResolution: "1080 × 1527",
    features: [
      "3 credits per month",
      "HD resolution (1080 × 1527)",
      "Watermarked preview",
      "Pets & Humans modes",
      "3 base styles",
    ],
  },
  creator: {
    name: "Creator",
    price: 19,
    credits: 15,
    resolution: "hd" as const,
    maxResolution: "1080 × 1527",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID || "",
    features: [
      "15 credits (one-time)",
      "HD resolution (1080 × 1527)",
      "No watermark",
      "All modes including Mix",
      "All 6+ art styles",
      "Print ordering available",
    ],
  },
  pro: {
    name: "Pro",
    price: 39,
    credits: 40,
    resolution: "4k" as const,
    maxResolution: "4K (3840 × 5427)",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    features: [
      "40 credits (one-time)",
      "4K Ultra HD resolution",
      "No watermark",
      "All modes including Mix",
      "All styles + Exclusives",
      "1 free print included",
      "Priority generation",
      "Priority email support",
    ],
  },
} as const;

export const STYLES = [
  { id: "watercolor", name: "Watercolor", description: "Soft, fluid colors with gentle brushstrokes.", tier: "free" as const },
  { id: "oil-painting", name: "Oil Painting", description: "Rich textures and deep colors for a classic look.", tier: "free" as const },
  { id: "renaissance", name: "Renaissance", description: "Noble and majestic portraits from the 16th century.", tier: "free" as const },
  { id: "pop-art", name: "Pop Art", description: "Vibrant, bold, and modern colors.", tier: "creator" as const },
  { id: "art-nouveau", name: "Art Nouveau", description: "Elegant curves and natural forms.", tier: "creator" as const },
  { id: "impressionist", name: "Impressionist", description: "Capturing the light and feeling of the moment.", tier: "creator" as const },
  { id: "baroque", name: "Baroque", description: "Dramatic lighting and rich, ornate detail.", tier: "pro" as const },
  { id: "ukiyo-e", name: "Ukiyo-e", description: "Traditional Japanese woodblock print style.", tier: "pro" as const },
  { id: "cyberpunk", name: "Cyberpunk", description: "Neon-lit futuristic portrait with glowing accents.", tier: "pro" as const },
  { id: "minimalist", name: "Minimalist Line Art", description: "Elegant single-line portrait, perfect for modern prints.", tier: "pro" as const },
] as const;

export const PRINT_SIZES = [
  { id: "20x30", name: "20 × 30 cm", price: 29, description: "Standard print" },
  { id: "30x40", name: "30 × 40 cm", price: 49, description: "Premium poster" },
  { id: "40x60", name: "40 × 60 cm", price: 89, description: "Canvas gallery" },
  { id: "50x70", name: "50 × 70 cm", price: 149, description: "Canvas XL + frame" },
] as const;

export const MODES = [
  { id: "pets" as const, title: "Pets", description: "Dogs, cats, birds, and more." },
  { id: "humans" as const, title: "Humans", description: "Yourself or a loved one." },
  { id: "mix" as const, title: "Mix", description: "You and your pet together." },
] as const;
