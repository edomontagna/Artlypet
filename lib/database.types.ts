export type Subscription = "free" | "creator" | "pro";
export type Resolution = "hd" | "4k";
export type PortraitMode = "pets" | "humans" | "mix";
export type PortraitStatus = "pending" | "generating" | "completed" | "failed";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";
export type DiscountType = "percentage" | "fixed";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  credits: number;
  subscription: Subscription;
  resolution_max: Resolution;
  referral_code: string;
  referred_by: string | null;
  referral_credits_earned: number;
  credits_reset_at: string;
  created_at: string;
}

export interface Portrait {
  id: string;
  user_id: string;
  mode: PortraitMode;
  style: string;
  input_image_urls: string[];
  output_image_url: string | null;
  output_image_4k_url: string | null;
  resolution: Resolution;
  status: PortraitStatus;
  is_watermarked: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  stripe_session_id: string;
  type: "credits" | "print" | "subscription";
  amount_eur: number;
  credits_added: number;
  coupon_code: string | null;
  created_at: string;
}

export interface PrintOrder {
  id: string;
  user_id: string;
  portrait_id: string;
  provider_order_id: string | null;
  size: string;
  price_eur: number;
  shipping_address: Record<string, string>;
  status: OrderStatus;
  tracking_url: string | null;
  created_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  max_uses: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: "signed_up" | "converted";
  credits_awarded: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: { Row: User; Insert: Partial<User> & { email: string }; Update: Partial<User> };
      portraits: { Row: Portrait; Insert: Partial<Portrait> & { user_id: string }; Update: Partial<Portrait> };
      transactions: { Row: Transaction; Insert: Partial<Transaction> & { user_id: string }; Update: Partial<Transaction> };
      print_orders: { Row: PrintOrder; Insert: Partial<PrintOrder> & { user_id: string; portrait_id: string }; Update: Partial<PrintOrder> };
      discount_codes: { Row: DiscountCode; Insert: Partial<DiscountCode> & { code: string }; Update: Partial<DiscountCode> };
      referrals: { Row: Referral; Insert: Partial<Referral> & { referrer_id: string; referred_id: string }; Update: Partial<Referral> };
    };
  };
}
