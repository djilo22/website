import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عقار SaaS — منصة إدارة الوكالات العقارية",
  description: "منصة متكاملة لإدارة الوكالات العقارية في الجزائر. أدِر عقاراتك، انشر إعلاناتك، واستقبل عملاءك.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-background text-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
