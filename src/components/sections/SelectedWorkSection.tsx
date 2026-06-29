import { cookies } from "next/headers";
import { DEFAULT_LOCALE, getDir, type Locale } from "@/lib/i18n/dictionary";
import SelectedWorksGrid from "./SelectedWorksGrid";

async function getProjectsDict(locale: Locale) {
  try {
    const dict = await import(`@/content/portfolio/projects.${locale}.json`);
    return dict.default;
  } catch (error) {
    const fallback = await import(`@/content/portfolio/projects.en.json`);
    return fallback.default;
  }
}

export default async function SelectedWorkSection() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? DEFAULT_LOCALE) as Locale;
  const dir = getDir(locale);
  const data = await getProjectsDict(locale);

  return (
    <section id="portfolio" dir={dir} className="scroll-mt-32 w-full overflow-x-clip bg-[#0F1117] px-4 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        
        {/* هدر سکشن */}
        <div className="mb-16 flex flex-col items-start gap-4 md:mb-24">
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest text-brand-purple backdrop-blur-md sm:text-xs">
            {data.section.badge}
          </div>
          <h2 className="font-nightbor text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl uppercase">
            {data.section.title}
          </h2>
          <p className="max-w-2xl font-doran text-sm leading-relaxed text-white/60 sm:text-base md:text-lg mt-2">
            {data.section.subtitle}
          </p>
        </div>

        {/* فراخوانی گرید سه‌بعدی و پاس دادن دیتای JSON به آن */}
        <SelectedWorksGrid items={data.items} locale={locale} />
        
      </div>
    </section>
  );
}