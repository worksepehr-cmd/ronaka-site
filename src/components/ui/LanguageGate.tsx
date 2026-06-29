"use client";

import { useEffect, useState, startTransition } from "react";
import Orb from "@/components/ui/Orb";
import { useRouter } from "next/navigation";

type Locale = "en" | "fa" | "ar";

const LOCALES: { key: Locale; label: string; sub: string; fontClass: string; glowColor: string }[] = [
  { key: "en", label: "ENGLISH", sub: "", fontClass: "font-en", glowColor: "bg-brand-blue shadow-[0_0_15px_rgba(37,99,235,0.6)]" },
  { key: "fa", label: "فارسی", sub: "", fontClass: "font-fa", glowColor: "bg-brand-purple shadow-[0_0_15px_rgba(124,58,237,0.6)]" },
  { key: "ar", label: "العربية", sub: "", fontClass: "font-fa", glowColor: "bg-brand-blue shadow-[0_0_15px_rgba(37,99,235,0.6)]" },
];

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name: string, value: string) {
  const isProd = process.env.NODE_ENV === "production";
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax${isProd ? "; Secure" : ""}`;
}

export default function LanguageGate() {
  const [hasLocaleCookie, setHasLocaleCookie] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookie = getCookie("locale");
    if (!cookie) {
      setHasLocaleCookie(false);
    }
  }, []);

  const handleSelect = (localeKey: string) => {
    setCookie("locale", localeKey);
    setIsExiting(true); 
    window.dispatchEvent(new Event("gate-exiting")); 

    startTransition(() => {
      router.refresh(); 
    });
    
    setTimeout(() => {
      setHasLocaleCookie(true); 
    }, 800);
  };

  if (hasLocaleCookie) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0F1117] transition-opacity duration-[800ms] ease-in ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div 
        className={`absolute inset-0 z-0 transition-all duration-[800ms] ease-in ${
          isExiting ? "scale-[3] opacity-0" : "scale-100 opacity-40"
        }`}
      >
        <Orb hue={320} hoverIntensity={0.9} backgroundColor="#1a1919ff" />
      </div>

      <div 
        className={`relative z-10 flex w-full flex-col items-center transition-all duration-[800ms] ease-in ${
          isExiting ? "scale-[2.5] opacity-0 blur-xl pointer-events-none" : "scale-100 opacity-100"
        }`}
      >
        <div className="font-en mb-3 text-center pl-[0.8em] text-3xl font-black tracking-[0.8em] text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] sm:text-4xl">
          RONAKA
        </div>

        <h2 className="mb-12 text-center pl-[0.3em] text-sm font-light tracking-[0.4em] text-white/50 sm:mb-20">
          SELECT YOUR REGION
        </h2>

        <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-10">
          {LOCALES.map((l) => (
            <button
              key={l.key}
              onClick={() => handleSelect(l.key)}
              className="group relative flex w-full flex-col items-center justify-center px-6 py-4 transition-all duration-500 sm:w-auto sm:px-8 sm:py-2"
            >
              <div className="absolute inset-0 scale-50 rounded-full bg-white/0 opacity-0 blur-md transition-all duration-500 group-hover:scale-150 group-hover:bg-white/15 group-hover:opacity-100" />
              
              <span className={`${l.fontClass} relative z-10 text-xl font-medium tracking-[0.1em] text-white/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-white`}>
                {l.label}
              </span>
              
              <span className="relative z-10 mt-2 text-[8px] tracking-[0.5em] text-white/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-white/60 sm:text-[10px]">
                {l.sub}
              </span>

              <div className="absolute bottom-0 left-1/2 h-[1px] w-0 max-w-[120px] -translate-x-1/2 transition-all duration-500 group-hover:w-full">
                <div className={`h-full w-full ${l.glowColor} opacity-70 blur-[1px]`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}