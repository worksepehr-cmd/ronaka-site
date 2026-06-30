"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Orb from "./Orb";
import LightRays from "./LightRays";

const LOCALES = [
  { code: "fa", label: "فارسی", fontClass: "font-doran" },
  { code: "en", label: "ENGLISH", fontClass: "font-nightbor" },
  { code: "ar", label: "العربية", fontClass: "font-doran" },
];

export default function LanguageGate() {
  // به صورت پیش‌فرض true می‌گذاریم تا موقع لود اولیه صفحه پرش نداشته باشیم
  const [shouldHideGate, setShouldHideGate] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ۱. تشخیص عرض صفحه برای نمایش افکت موبایل یا دسکتاپ
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // ۲. هسته اصلی هوش UX: تشخیص رفرش یا سرچ جدید
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === "reload";
    const hasPassedGate = sessionStorage.getItem("gatePassed");

    if (isReload || hasPassedGate) {
      // اگر کاربر صفحه را رفرش کرده یا در این تب قبلاً بوده -> دروازه مخفی بماند
      setShouldHideGate(true);
    } else {
      // اگر کاربر دامنه را سرچ کرده یا تب جدید باز کرده -> دروازه ظاهر شود
      setShouldHideGate(false);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (shouldHideGate) return null;

  const handleSelect = (localeCode: string) => {
    setIsExiting(true);
    window.dispatchEvent(new Event("gate-exiting"));

    setTimeout(() => {
      // ۱. ذخیره در حافظه تب (برای اینکه با رفرش دوباره زبان نخواهد)
      sessionStorage.setItem("gatePassed", "true");

      // ۲. ذخیره زبان در کوکی ثابت (برای اینکه سرور همیشه زبان انتخابی را بداند)
      document.cookie = `locale=${localeCode}; path=/; max-age=${60 * 60 * 24 * 365}`;

      startTransition(() => {
        router.refresh();
      });
      setShouldHideGate(true);
    }, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F1117] transition-all duration-800 ease-in-out
        ${isExiting ? "scale-[3] opacity-0 blur-xl pointer-events-none" : "scale-100 opacity-100 blur-0"}
      `}
    >
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <div className="w-full h-full opacity-100">
            <LightRays
              raysOrigin="center"
              raysColor="#530097ff"
              raysSpeed={0.7}
              lightSpread={1.4}
              rayLength={3}
              followMouse={false}
              noiseAmount={0.17}
              distortion={.2}
              pulsating={false}
              fadeDistance={50.6}
              saturation={1.5}
            />
          </div>
        ) : (
          <Orb hoverIntensity={0.9} rotateOnHover={true} hue={320} forceHoverState={false} />
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-20 sm:gap-24">
        <div className="flex flex-col items-center gap-2">
          <span className="font-nightbor text-4xl sm:text-5xl font-bold tracking-[0.6em] text-white pl-[0.6em] text-center drop-shadow-lg">
            RONAKA
          </span>
          <h2 className="font-nightbor text-xs sm:text-sm font-medium tracking-[0.4em] text-white/50 pl-[0.4em] text-center uppercase">
            Select Your Region
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleSelect(locale.code)}
              disabled={isPending || isExiting}
              className="group relative flex flex-col items-center gap-3 px-8 py-4 sm:py-2 transition-transform duration-500 hover:scale-110 w-full sm:w-auto"
            >
              <span className={`${locale.fontClass} text-lg sm:text-xl font-light tracking-[0.15em] text-white/70 transition-colors duration-300 group-hover:text-white uppercase`}>
                {locale.label}
              </span>
              <span className="h-[1px] w-0 bg-brand-purple transition-all duration-500 ease-out group-hover:w-full"></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}