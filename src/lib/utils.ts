export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-DZ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price) + " د.ج";
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: "شقة",
    house: "منزل",
    villa: "فيلا",
    land: "أرض",
    commercial: "تجاري",
    other: "أخرى",
  };
  return labels[type] || type;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "نشط",
    sold: "مباع",
    rented: "مؤجر",
    draft: "مسودة",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    sold: "bg-red-100 text-red-800",
    rented: "bg-blue-100 text-blue-800",
    draft: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export const ALGERIAN_CITIES = [
  "الجزائر", "وهران", "قسنطينة", "عنابة", "باتنة",
  "بليدة", "سطيف", "سيدي بلعباس", "بسكرة", "تلمسان",
  "تيزي وزو", "بجاية", "الشلف", "الجلفة", "المسيلة",
  "مستغانم", "المدية", "تبسة", "سكيكدة", "برج بوعريريج",
  "بومرداس", "الأغواط", "خنشلة", "سوق أهراس", "تيبازة",
  "ميلة", "عين الدفلى", "النعامة", "عين تموشنت", "غرداية",
  "غليزان", "جيجل", "معسكر", "ورقلة", "أم البواقي",
  "البيض", "إليزي", "تندوف", "تيسمسيلت", "الوادي",
  "خميس مليانة", "أدرار", "تمنراست", "البويرة", "بوسعادة",
  "المغير", "المنيعة", "تقرت",
];
