import { cookies } from "next/headers";
import { DEFAULT_LOCALE, getDir, type Locale } from "@/lib/i18n/dictionary";
import { MotionCard } from "@/components/ui/MotionCard";
import Link from "next/link";

type ServiceItem = {
  id: string;
  title: string;
  enTitle: string;
  desc: string;
  colSpan?: string;
  rowSpan?: string;
};

type ServicesDict = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  items: ServiceItem[];
  floatingBtn: string;
};

async function getServicesDict(locale: Locale): Promise<ServicesDict> {
  try {
    const dict = await import(`@/content/services/services.${locale}.json`);
    return dict.default;
  } catch {
    const fallback = await import("@/content/services/services.en.json");
    return fallback.default;
  }
}

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? DEFAULT_LOCALE) as Locale;
  const dir = getDir(locale);
  const data = await getServicesDict(locale);

  const isRtl = locale === "fa" || locale === "ar";

  // فونت نمایشی فقط برای لوگو مناسب است، نه متن‌های UI.
  // در انگلیسی از font-sans استفاده شده تا کلمات به هم نچسبند.
  const contentFont = isRtl ? "font-fa" : "font-sans";
  const badgeTracking = isRtl ? "tracking-normal" : "uppercase tracking-[0.18em]";
  const heroTitleStyle = isRtl
    ? "font-fa font-semibold leading-[1.35] tracking-normal"
    : "font-sans font-semibold leading-[0.98] tracking-[-0.045em]";
  const cardTitleStyle = isRtl
    ? "font-fa font-semibold leading-[1.45] tracking-normal"
    : "font-sans font-medium leading-[1.08] tracking-[-0.035em]";
  const bodyStyle = isRtl
    ? "font-fa leading-loose tracking-normal"
    : "font-sans leading-relaxed tracking-normal";

  return (
    <div dir={dir} className={`min-h-screen bg-[#080A0F] pt-32 pb-28 ${contentFont}`}>
      {/* Hero */}
      <section className="relative mx-auto mb-20 flex max-w-7xl flex-col items-center px-6 text-center md:mb-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-brand-purple/20 blur-[120px]" />

        <div className="relative z-10 flex max-w-5xl flex-col items-center">
          <span
            className={`mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium text-brand-purple/90 backdrop-blur-md ${contentFont} ${badgeTracking}`}
          >
            {data.hero.badge}
          </span>

          <h1
            className={`mb-8 max-w-5xl text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl ${heroTitleStyle}`}
          >
            {data.hero.title}
          </h1>

          <p className={`max-w-3xl text-sm font-normal text-white/58 sm:text-base md:text-lg ${bodyStyle}`}>
            {data.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-4 auto-rows-[minmax(220px,auto)] md:grid-cols-3">
          {data.items.map((item) => (
            <MotionCard
              key={item.id}
              variant="glass"
              glow
              interactive
              className={`${item.colSpan ?? ""} ${item.rowSpan ?? ""} flex flex-col justify-end border border-white/[0.05] bg-white/[0.02] p-7 hover:bg-white/[0.04] sm:p-8`}
            >
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-white/30">
                  {item.enTitle}
                </span>

                <h3 className={`mb-2 text-2xl text-white sm:text-3xl ${cardTitleStyle}`}>
                  {item.title}
                </h3>

                <p className={`max-w-[36rem] text-sm font-normal text-white/50 ${bodyStyle}`}>
                  {item.desc}
                </p>
              </div>
            </MotionCard>
          ))}
        </div>
      </section>

      {/* Floating CTA */}
      <div className={`fixed bottom-6 z-[90] px-4 sm:bottom-8 sm:px-0 ${isRtl ? "left-0 sm:left-8" : "right-0 sm:right-8"} w-full sm:w-auto pointer-events-none`}>
        <Link
          href="/contact"
          className={`pointer-events-auto mx-auto flex w-full max-w-[22rem] items-center justify-center gap-3 rounded-full border border-white/10 bg-white px-6 py-4 text-[#0F1117] shadow-[0_10px_40px_rgba(255,255,255,0.16)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_50px_rgba(255,255,255,0.24)] sm:w-auto ${contentFont}`}
        >
          <span className="text-sm font-semibold">{data.floatingBtn}</span>
          <svg
            className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
