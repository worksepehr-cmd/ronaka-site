"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// دیکشنری متن‌های هدر
const navDict = {
  fa: { home: "خانه", projects: "گالری پروژه‌ها", services: "خدمات استودیو", cta: "شروع همکاری", logoSub: "استودیو" },
  en: { home: "Home", projects: "Selected Works", services: "Capabilities", cta: "Start a Project", logoSub: "Studio" },
  ar: { home: "الرئيسية", projects: "معرض الأعمال", services: "خدماتنا", cta: "ابدأ مشروعك", logoSub: "استوديو" }
};

export default function Header({ locale = "en" }: { locale?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const t = navDict[locale as keyof typeof navDict] || navDict.en;
  const isRtl = locale === "fa" || locale === "ar";
  const fontClass = isRtl ? "font-fa" : "font-en";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  // بستن منوی موبایل هنگام تغییر مسیر
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled || isMobileMenuOpen
            ? "bg-[#0F1117]/80 backdrop-blur-xl border-b border-white/10 shadow-soft" 
            : "bg-transparent"
        } py-4 md:py-5`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
          
          {/* لوگو */}
          <Link href="/" className="group flex items-center gap-2 z-50">
            <span className="font-en text-xl font-bold tracking-widest text-white transition-colors group-hover:text-gray-300">
              RONAKA
            </span>
            <span className="h-4 w-[1px] bg-white/30"></span>
            <span className={`text-xs text-gray-400 ${fontClass}`}>{t.logoSub}</span>
          </Link>

          {/* منوی دسکتاپ */}
          <nav className={`hidden items-center gap-10 md:flex ${fontClass}`}>
            <Link href="/" className={`text-sm tracking-wide transition-colors hover:text-white ${pathname === '/' ? 'text-white' : 'text-gray-400'}`}>
              {t.home}
            </Link>
            <Link href="/#portfolio" className="text-sm tracking-wide text-gray-400 transition-colors hover:text-white">
              {t.projects}
            </Link>
            <Link href="/services" className="text-sm tracking-wide text-gray-400 transition-colors hover:text-white">
              {t.services}
            </Link>
          </nav>

          {/* دکمه CTA (دسکتاپ) */}
          <div className="hidden md:block z-50">
            <Link 
              href="/contact"
              className={`relative overflow-hidden rounded-full border border-white/20 bg-white/5 px-7 py-2.5 text-sm text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] ${fontClass}`}
            >
              {t.cta}
            </Link>
          </div>

          {/* دکمه همبرگری موبایل */}
          <button 
            className="md:hidden z-50 flex flex-col items-end gap-1.5 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`block h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "w-6 translate-y-[8px] rotate-45" : "w-6"}`}></span>
            <span className={`block h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "w-0 opacity-0" : "w-5"}`}></span>
            <span className={`block h-[2px] bg-white transition-all duration-300 ${isMobileMenuOpen ? "w-6 -translate-y-[8px] -rotate-45" : "w-4"}`}></span>
          </button>

        </div>
      </header>

      {/* پرده منوی موبایل */}
      <div 
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0F1117]/95 backdrop-blur-2xl transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className={`flex flex-col items-center gap-8 ${fontClass}`}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-white">
            {t.home}
          </Link>
          <Link href="/#portfolio" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-gray-300 hover:text-white">
            {t.projects}
          </Link>
          <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl text-gray-300 hover:text-white">
            {t.services}
          </Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 rounded-full bg-white px-8 py-3 text-lg text-[#0F1117]">
            {t.cta}
          </Link>
        </nav>
      </div>
    </>
  );
}