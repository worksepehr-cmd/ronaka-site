import Link from "next/link";

const footerDict = {
  fa: {
    logoSub: "استودیو",
    eyebrow: "AI VISUAL STUDIO",
    desc: "استودیو روناکا برای برندهایی ساخته شده که تصویر، هویت و روایت بصری‌شان باید حرفه‌ای، مینیمال و متمایز دیده شود.",
    cta: "شروع همکاری",
    explore: "مسیرها",
    connect: "ارتباط",
    home: "خانه",
    projects: "گالری پروژه‌ها",
    services: "خدمات استودیو",
    contact: "تماس با ما",
    rights: "تمامی حقوق برای استودیو روناکا محفوظ است.",
    location: "مستقر در شیراز، فعال در سطح جهانی.",
  },
  en: {
    logoSub: "Studio",
    eyebrow: "AI VISUAL STUDIO",
    desc: "Ronaka Studio helps ambitious brands shape cinematic visuals, refined identities, and AI-powered content with a minimal luxury standard.",
    cta: "Start a Project",
    explore: "Explore",
    connect: "Connect",
    home: "Home",
    projects: "Selected Works",
    services: "Capabilities",
    contact: "Contact",
    rights: "All rights reserved by Ronaka Studio.",
    location: "Based in Shiraz, Working Worldwide.",
  },
  ar: {
    logoSub: "استوديو",
    eyebrow: "AI VISUAL STUDIO",
    desc: "يساعد استوديو روناکا العلامات الطموحة على بناء صور سينمائية، هويات راقية، ومحتوى مدعوم بالذكاء الاصطناعي بمعيار فاخر وبسيط.",
    cta: "ابدأ مشروعك",
    explore: "المسارات",
    connect: "تواصل",
    home: "الرئيسية",
    projects: "معرض الأعمال",
    services: "خدماتنا",
    contact: "اتصل بنا",
    rights: "جميع الحقوق محفوظة لاستوديو روناکا.",
    location: "مقرنا في شيراز، ونعمل عالمياً.",
  },
};

const internalLinks = [
  { href: "/", key: "home" },
  { href: "/#portfolio", key: "projects" },
  { href: "/services", key: "services" },
  { href: "/contact", key: "contact" },
] as const;

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Vimeo" },
] as const;

type Locale = keyof typeof footerDict;
type FooterTextKey = keyof (typeof footerDict)[Locale];

export default function Footer({ locale = "en" }: { locale?: string }) {
  const currentYear = new Date().getFullYear();
  const safeLocale = (locale in footerDict ? locale : "en") as Locale;
  const t = footerDict[safeLocale];
  const isRtl = safeLocale === "fa" || safeLocale === "ar";
  const contentFont = isRtl ? "font-fa" : "font-sans";

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className={`relative w-full overflow-hidden border-t border-white/[0.08] bg-[#07090D] ${contentFont}`}
    >
      {/* subtle luxury glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[42rem] -translate-x-1/2 rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className={`grid gap-12 md:grid-cols-[1.3fr_0.7fr_0.7fr] md:gap-10 ${isRtl ? "text-right" : "text-left"}`}>
          {/* brand */}
          <div className="flex max-w-xl flex-col items-start">
            <Link href="/" aria-label="Ronaka Studio home" className="group inline-flex items-center gap-3">
              <span className="font-en text-2xl font-bold tracking-[0.22em] text-white transition-opacity group-hover:opacity-80 md:text-3xl">
                RONAKA
              </span>
              <span className="h-5 w-px bg-white/15" />
              <span className="text-xs text-white/45 transition-colors group-hover:text-white/65">
                {t.logoSub}
              </span>
            </Link>

            <p className="mt-5 font-en text-[10px] font-medium uppercase tracking-[0.38em] text-white/30">
              {t.eyebrow}
            </p>

            <p className="mt-5 max-w-lg text-sm leading-8 text-white/52 md:text-[15px]">
              {t.desc}
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-medium text-white/85 transition-all hover:border-white/20 hover:bg-white/[0.075] hover:text-white"
            >
              {t.cta}
            </Link>
          </div>

          {/* navigation */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-white/35">
              {t.explore}
            </h3>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Footer navigation">
              {internalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/48 transition-colors hover:text-white"
                >
                  {t[item.key as FooterTextKey]}
                </Link>
              ))}
            </nav>
          </div>

          {/* socials */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-white/35">
              {t.connect}
            </h3>
            <div className="mt-5 flex flex-col gap-3 font-sans">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-white/48 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] pt-7 text-xs text-white/34 md:mt-16 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} — {t.rights}</p>
          <p>{t.location}</p>
        </div>
      </div>
    </footer>
  );
}
