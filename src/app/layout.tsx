import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

// ایمپورت کامپوننت‌های موشن
import LanguageGate from "@/components/ui/LanguageGate";
import PageReveal from "@/components/ui/PageReveal";

// لود فونت‌ها با آدرس‌های دقیق
const nightbor = localFont({
  src: "../fonts/en/Nightbor.woff2",
  variable: "--font-nightbor",
  display: "swap",
});

const doran = localFont({
  src: "../fonts/fa-ar/DoranNoEn-Bold.woff2",
  variable: "--font-doran",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ronaka Studio",
  description: "Premium Creative Studio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const isRtl = locale === "fa" || locale === "ar";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <body
        className={`bg-[#0F1117] text-[#ededed] antialiased ${nightbor.variable} ${doran.variable} ${isRtl ? 'font-fa' : 'font-en'}`}
      >
        
        {/* ۱. دروازه ورود سینمایی (بالاترین لایه) */}
        <LanguageGate />
        
        {/* ۲. محتوای سایت (رپر PageReveal وظیفه نمایان کردن نرم سایت را دارد) */}
        <PageReveal>
          {/* تگ main از اینجا حذف شد چون در page.tsx وجود دارد */}
          {children}
        </PageReveal>
        
      </body>
    </html>
  );
}