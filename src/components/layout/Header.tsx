"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navDict = {
  fa: {
    home: "خانه",
    projects: "گالری پروژه‌ها",
    services: "خدمات استودیو",
    cta: "شروع همکاری",
    logoSub: "استودیو",
    langLabel: "زبان",
    menuOpen: "باز کردن منو",
    menuClose: "بستن منو",
    languageMenu: "انتخاب زبان",
  },
  en: {
    home: "Home",
    projects: "Selected Works",
    services: "Capabilities",
    cta: "Start a Project",
    logoSub: "Studio",
    langLabel: "Language",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    languageMenu: "Choose language",
  },
  ar: {
    home: "الرئيسية",
    projects: "معرض الأعمال",
    services: "خدماتنا",
    cta: "ابدأ مشروعك",
    logoSub: "استوديو",
    langLabel: "اللغة",
    menuOpen: "فتح القائمة",
    menuClose: "إغلاق القائمة",
    languageMenu: "اختيار اللغة",
  },
} as const;

type Locale = keyof typeof navDict;

const LOCALES: Array<{ code: Locale; label: string; shortLabel: string }> = [
  { code: "fa", label: "فارسی", shortLabel: "FA" },
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "ar", label: "العربية", shortLabel: "AR" },
];

function getSafeLocale(locale?: string): Locale {
  return locale && Object.prototype.hasOwnProperty.call(navDict, locale)
    ? (locale as Locale)
    : "en";
}

export default function Header({ locale = "en" }: { locale?: string }) {
  const currentLocale = getSafeLocale(locale);
  const t = navDict[currentLocale];
  const isRtl = currentLocale === "fa" || currentLocale === "ar";

  // مهم: فونت انگلیسی قبلی برای متن‌های منو سنگین/نمایشی بود و باعث توهمِ تو رفتن حروف می‌شد.
  // فونت نمایشی فقط برای لوگو بماند؛ متن‌های UI با فونت خوانا و سبک نمایش داده شوند.
  const uiFontClass = isRtl ? "font-fa" : "font-sans";
  const uiTextTone = isRtl ? "font-medium tracking-[-0.01em]" : "font-normal tracking-normal";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);

  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navItems = useMemo(
    () => [
      { href: "/", label: t.home, active: pathname === "/" },
      { href: "/#portfolio", label: t.projects, active: false },
      { href: "/services", label: t.services, active: pathname?.startsWith("/services") },
    ],
    [pathname, t.home, t.projects, t.services]
  );

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileLangOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isDesktopLangOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktopLangOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsDesktopLangOpen(false);
      closeMobileMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileMenu]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    if (isMobileMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  const changeLanguage = (newLocale: Locale) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "fa" || newLocale === "ar" ? "rtl" : "ltr";

    setIsDesktopLangOpen(false);
    closeMobileMenu();

    startTransition(() => {
      router.refresh();
    });
  };

  const desktopNavClass = (active: boolean) =>
    `relative rounded-full px-3.5 py-2 text-[13px] leading-none transition-all duration-300 ${uiTextTone} ${
      active
        ? "bg-white/[0.055] text-white"
        : "text-white/54 hover:bg-white/[0.04] hover:text-white/90"
    }`;

  const mobileNavClass = (active: boolean) =>
    `group relative flex min-h-[52px] w-full items-center justify-center rounded-2xl px-5 text-center text-[22px] leading-[1.45] transition-all duration-300 sm:text-[24px] ${uiTextTone} ${
      active
        ? "bg-white/[0.04] text-white ring-1 ring-white/[0.055]"
        : "text-white/58 hover:bg-white/[0.028] hover:text-white/90"
    }`;

  return (
    <>
      <header
        dir={isRtl ? "rtl" : "ltr"}
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "border-b border-white/[0.065] bg-[#080A0F]/78 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            dir="ltr"
            onClick={closeMobileMenu}
            className="group relative z-[70] flex min-w-0 items-center gap-2.5 rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-4 focus-visible:ring-offset-[#080A0F]"
            aria-label="RONAKA Studio"
          >
            <span className="font-en text-[17px] font-extrabold tracking-[0.16em] text-white sm:text-[19px]">
              RONAKA
            </span>
            <span className="h-4 w-px bg-white/18" aria-hidden="true" />
            <span className="font-sans text-[11px] font-normal tracking-normal text-white/42">
              {t.logoSub}
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className={`hidden items-center gap-1 rounded-full border border-white/[0.055] bg-white/[0.022] p-1 backdrop-blur-md md:flex ${uiFontClass}`}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={desktopNavClass(item.active)}
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-[70] hidden items-center gap-3 md:flex">
            <div ref={desktopDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsDesktopLangOpen((open) => !open)}
                disabled={isPending}
                aria-haspopup="menu"
                aria-expanded={isDesktopLangOpen}
                aria-label={t.languageMenu}
                className="group flex h-10 min-w-[74px] items-center justify-center gap-2 rounded-full border border-white/[0.075] bg-white/[0.038] px-3 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 transition-all duration-300 hover:border-white/14 hover:bg-white/[0.065] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:cursor-wait disabled:opacity-60"
              >
                <span>{currentLocale}</span>
                <svg
                  className={`h-3.5 w-3.5 text-white/40 transition-transform duration-300 ${
                    isDesktopLangOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDesktopLangOpen && (
                <div
                  role="menu"
                  className={`absolute top-full mt-3 w-36 overflow-hidden rounded-2xl border border-white/[0.075] bg-[#080A0F]/96 p-1.5 shadow-2xl backdrop-blur-2xl ${
                    isRtl ? "left-0" : "right-0"
                  }`}
                >
                  {LOCALES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      role="menuitem"
                      onClick={() => changeLanguage(item.code)}
                      disabled={isPending}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm leading-none transition-colors disabled:cursor-wait disabled:opacity-60 ${
                        currentLocale === item.code
                          ? "bg-white/[0.06] text-white"
                          : "text-white/52 hover:bg-white/[0.045] hover:text-white"
                      } ${item.code === "en" ? "font-sans font-normal" : "font-fa font-medium"}`}
                    >
                      <span>{item.label}</span>
                      <span className="font-sans text-[10px] font-semibold tracking-[0.16em] text-white/34">
                        {item.shortLabel}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`rounded-full border border-white/[0.075] bg-white/[0.045] px-5 py-2.5 text-[13px] leading-none text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.075] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${uiFontClass} ${uiTextTone}`}
            >
              {t.cta}
            </Link>
          </div>

          <button
            type="button"
            className="relative z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.075] bg-white/[0.025] text-white transition-all duration-300 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? t.menuClose : t.menuOpen}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">{isMobileMenuOpen ? t.menuClose : t.menuOpen}</span>
            <span
              aria-hidden="true"
              className={`absolute h-px rounded-full bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "w-5 rotate-45" : "w-5 -translate-y-1.5"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px rounded-full bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "w-0 opacity-0" : "w-4 opacity-70"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px rounded-full bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "w-5 -rotate-45" : "w-3.5 translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        dir={isRtl ? "rtl" : "ltr"}
        className={`fixed inset-0 z-[50] h-[100dvh] overflow-hidden bg-[#07090D]/97 backdrop-blur-2xl transition-all duration-500 ease-out md:hidden ${
          isMobileMenuOpen
            ? "visible opacity-100 pointer-events-auto"
            : "invisible opacity-0 pointer-events-none"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[46%] -translate-y-1/2 select-none text-center font-sans text-[18vw] font-semibold leading-none tracking-[-0.08em] text-white/[0.012]"
        >
          RONAKA
        </div>

        <div className="pointer-events-none absolute inset-x-5 top-[68px] h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <nav
          aria-label="Mobile navigation"
          className={`relative flex h-full flex-col items-center justify-center px-5 pt-[74px] ${uiFontClass}`}
        >
          <div className="w-full max-w-[310px] rounded-[28px] border border-white/[0.055] bg-white/[0.018] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-md">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                aria-current={item.active ? "page" : undefined}
                className={mobileNavClass(item.active)}
                style={{ transitionDelay: isMobileMenuOpen ? `${index * 45}ms` : "0ms" }}
              >
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className={`mt-6 w-full max-w-[310px] rounded-full border border-white/[0.09] bg-white/[0.045] px-6 py-3.5 text-center text-[15px] leading-none text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] transition-all duration-300 hover:bg-white/[0.075] hover:text-white ${uiTextTone}`}
          >
            {t.cta}
          </Link>

          <div className="mt-8 w-full max-w-[310px]">
            <button
              type="button"
              onClick={() => setIsMobileLangOpen((open) => !open)}
              disabled={isPending}
              aria-haspopup="menu"
              aria-expanded={isMobileLangOpen}
              aria-label={t.languageMenu}
              className={`flex h-12 w-full items-center justify-between rounded-2xl border border-white/[0.075] bg-white/[0.032] px-4 text-white/62 transition-all duration-300 hover:border-white/13 hover:bg-white/[0.055] hover:text-white disabled:cursor-wait disabled:opacity-60 ${uiTextTone}`}
            >
              <span className="text-[13px] leading-none">{t.langLabel}</span>
              <span className="flex items-center gap-2">
                <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-white/88">
                  {currentLocale.toUpperCase()}
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-white/38 transition-transform duration-300 ${
                    isMobileLangOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            <div
              role="menu"
              className={`mt-2 grid overflow-hidden rounded-2xl border border-white/[0.075] bg-white/[0.022] p-1 transition-all duration-300 ${
                isMobileLangOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                {LOCALES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    role="menuitem"
                    onClick={() => changeLanguage(item.code)}
                    disabled={isPending}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm leading-none transition-colors disabled:cursor-wait disabled:opacity-60 ${
                      currentLocale === item.code
                        ? "bg-white/[0.06] text-white"
                        : "text-white/52 hover:bg-white/[0.045] hover:text-white"
                    } ${item.code === "en" ? "font-sans font-normal" : "font-fa font-medium"}`}
                  >
                    <span>{item.label}</span>
                    <span className="font-sans text-[10px] font-semibold tracking-[0.16em] text-white/34">
                      {item.shortLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
