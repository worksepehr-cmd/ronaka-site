"use client";

import { useEffect, useState } from "react";

export default function PageReveal({ children }: { children: React.ReactNode }) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // بررسی می‌کنیم که آیا کاربر از قبل کوکی زبان را دارد یا نه
    const hasCookie = document.cookie.includes("locale=");
    
    if (hasCookie) {
      // اگر کاربر قبلاً زبان را انتخاب کرده، سایت با یک انیمیشن سریع و نرم لود می‌شود
      const timer = setTimeout(() => setIsRevealed(true), 100);
      return () => clearTimeout(timer);
    }

    // اگر کاربر بار اولش است، منتظر می‌مانیم تا روی دروازه کلیک کند
    const handleGateExit = () => {
      // دروازه ۸۰۰ میلی‌ثانیه طول می‌کشد تا محو شود.
      // ما ۳۰۰ میلی‌ثانیه بعد از کلیک، سایت را ظاهر می‌کنیم تا انیمیشن‌ها در هم تنیده شوند!
      setTimeout(() => setIsRevealed(true), 300);
    };

    window.addEventListener("gate-exiting", handleGateExit);
    return () => window.removeEventListener("gate-exiting", handleGateExit);
  }, []);

  return (
    <div
      // تنظیمات موشن: ۱.۲ ثانیه طول می‌کشد و با افکت سینمایی (cubic-bezier) اجرا می‌شود
      className={`transition-all duration-[1900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealed
          ? "translate-y-0 scale-100 opacity-100 blur-0" // حالت نهایی (ظاهر شده)
          : "translate-y-12 scale-95 opacity-0 blur-xl"  // حالت اولیه (مخفی، تار و کمی پایین‌تر)
      }`}
    >
      {children}
    </div>
  );
}