export interface Agency {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  agency_id: string;
  title: string;
  description: string;
  type: "sale" | "rent";
  property_type: "apartment" | "house" | "villa" | "land" | "commercial" | "other";
  price: number;
  city: string;
  address: string;
  area: number;
  rooms: number;
  bathrooms: number;
  images: string[];
  features: string[];
  status: "active" | "sold" | "rented" | "draft";
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  agency_id: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  status: "active" | "expired" | "cancelled";
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  agency_id: string | null;
  role: "owner" | "agent" | "admin";
  created_at: string;
}

export type PlanFeatures = {
  name: string;
  price: number;
  properties_limit: number;
  images_per_property: number;
  features: string[];
};

export const PLANS: Record<string, PlanFeatures> = {
  free: {
    name: "مجاني",
    price: 0,
    properties_limit: 5,
    images_per_property: 3,
    features: ["5 إعلانات", "3 صور لكل إعلان", "لوحة تحكم أساسية"],
  },
  starter: {
    name: "المبتدئ",
    price: 2000,
    properties_limit: 20,
    images_per_property: 10,
    features: ["20 إعلان", "10 صور لكل إعلان", "لوحة تحكم متقدمة", "دعم بالبريد"],
  },
  pro: {
    name: "المحترف",
    price: 5000,
    properties_limit: 100,
    images_per_property: 20,
    features: ["100 إعلان", "20 صور لكل إعلان", "لوحة تحكم كاملة", "دعم أولوي", "تحليلات"],
  },
  enterprise: {
    name: "المؤسسات",
    price: 10000,
    properties_limit: -1,
    images_per_property: 50,
    features: ["إعلانات غير محدودة", "50 صور لكل إعلان", "كل المميزات", "دعم مخصص", "API"],
  },
};
