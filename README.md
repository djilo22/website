# عقار SaaS — منصة إدارة الوكالات العقارية

منصة SaaS متكاملة موجهة لوكالات العقارات في الجزائر، تسمح لهم بإنشاء مساحة خاصة لإدارة العقارات (بيع/كراء)، إضافة إعلانات، عرض التفاصيل، واستقبال العملاء.

## التقنيات المستخدمة

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (Auth + Database + Storage)
- **اللغة**: عربية (RTL)

## البدء السريع

### 1. تثبيت التبعيات

```bash
npm install
```

### 2. إعداد Supabase

1. أنشئ مشروع جديد على [supabase.com](https://supabase.com)
2. انسخ `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

3. أضف بيانات Supabase في `.env.local`
4. نفّذ ملف `supabase/schema.sql` في SQL Editor في Supabase

### 3. تشغيل التطبيق

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## هيكل المشروع

```
src/
├── app/                    # صفحات Next.js (App Router)
│   ├── auth/              # صفحات المصادقة
│   ├── dashboard/         # لوحة التحكم
│   │   ├── properties/    # إدارة العقارات
│   │   ├── subscription/  # الاشتراكات
│   │   └── settings/      # الإعدادات
│   └── properties/        # عرض العقارات العام
├── components/            # مكونات React
│   ├── ui/               # مكونات UI أساسية
│   ├── layout/           # تخطيط (Navbar, Footer, Sidebar)
│   ├── landing/          # مكونات الصفحة الرئيسية
│   └── dashboard/        # مكونات لوحة التحكم
├── lib/                   # أدوات ومساعدات
│   ├── supabase-client.ts
│   ├── supabase-server.ts
│   └── utils.ts
└── types/                 # أنواع TypeScript
supabase/
└── schema.sql            # مخطط قاعدة البيانات
```

## المميزات

- نظام مصادقة كامل (تسجيل/دخول/خروج)
- نظام multi-tenant (كل وكالة لها مساحة خاصة)
- لوحة تحكم لإدارة العقارات (إضافة/تعديل/حذف)
- رفع صور العقارات
- صفحات عرض عامة للعقارات
- نظام اشتراكات (mock)
- صفحة تسويقية احترافية
- تصميم متجاوب (RTL)
- Row Level Security (RLS) لعزل البيانات

## الخطط والأسعار

| الخطة | السعر | الإعلانات |
|-------|-------|-----------|
| مجاني | 0 د.ج | 5 |
| المبتدئ | 2,000 د.ج/شهر | 20 |
| المحترف | 5,000 د.ج/شهر | 100 |
| المؤسسات | 10,000 د.ج/شهر | غير محدود |
