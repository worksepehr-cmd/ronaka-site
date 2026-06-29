import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

// ایمپورت کامپوننت‌های موشن و لی‌آوت
import LanguageGate from "@/components/ui/LanguageGate";
import PageReveal from "@/components/ui/PageReveal";
import Header from "@/components/layout/Header"; // 👈 اضافه شد
import Footer from "@/components/layout/Footer"; // 👈 اضافه شد

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
  metadataBase: new URL('https://ronakastudio.ir'),
  title: "Ronaka Studio | Premium AI & Cinematic Media",
  description: "استودیوی خلاق روناکا؛ خلق تجربه‌های بصری سینمایی، هویت برند لوکس و تولید محتوای مبتنی بر هوش مصنوعی.",
  keywords: ["Ronaka Studio", "روناکا", "تولید محتوای سینمایی", "هوش مصنوعی", "هویت برند", "Cinematic Media", "AI Visual Production"],
  authors: [{ name: "Ronaka Studio" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://ronakastudio.ir",
    title: "Ronaka Studio | Premium Creative Studio",
    description: "استودیوی خلاق روناکا؛ خلق تجربه‌های بصری سینمایی، هویت برند لوکس و تولید محتوای مبتنی بر هوش مصنوعی.",
    siteName: "Ronaka Studio",
    images: [
      {
        url: "/images/og-poster.jpg", 
        width: 1200,
        height: 630,
        alt: "Ronaka Studio Cinematic Showreel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ronaka Studio | Premium AI & Cinematic Media",
    description: "استودیوی خلاق روناکا؛ خلق تجربه‌های بصری سینمایی، هویت برند لوکس و تولید محتوای مبتنی بر هوش مصنوعی.",
    images: ["/images/og-poster.jpg"],
  },
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
        <LanguageGate />
        
        <PageReveal>
        <Header locale={locale} />
          
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          
          {/* 👈 فوتر در پایین‌ترین قسمت محتوا قرار می‌گیرد */}
          <Footer locale={locale} />
        </PageReveal>
        
      </body>
    </html>
  );
}