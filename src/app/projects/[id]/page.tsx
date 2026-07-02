import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, getDir, type Locale } from "@/lib/i18n/dictionary";
import AppleMasonryGallery from "@/components/gallery/AppleMasonryGallery";
import CinematicVideoGallery from "@/components/gallery/CinematicVideoGallery";

async function getProjectCategoryData(id: string, locale: Locale) {
  try {
    const dict = await import(`@/content/projects/${id}.${locale}.json`);
    return dict.default;
  } catch (error) {
    return null;
  }
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectCategoryPage({ params }: ProjectPageProps) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? DEFAULT_LOCALE) as Locale;
  const dir = getDir(locale);

  const data = await getProjectCategoryData(id, locale);

  if (!data) {
    notFound();
  }

  const isRtl = locale === "fa" || locale === "ar";
  const fontClass = isRtl ? "font-fa" : "font-en";

  return (
    <main dir={dir} className="min-h-screen w-full bg-[#0F1117] px-4 py-32 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-7xl">
        
        <div className="mb-16 flex animate-fade-in flex-col items-start gap-4 md:mb-24">
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest text-brand-purple backdrop-blur-md sm:text-xs">
            {data.page.badge}
          </div>
          <h1 className="font-nightbor uppercase tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {data.page.title}
          </h1>
          <p className="max-w-3xl text-left text-base leading-relaxed text-[#9CA3AF] sm:text-lg md:text-xl">
            {data.page.subtitle}
          </p>
        </div>

        {/* 🧠 منطق هوشمند سوییچ بین گالری‌ها */}
        {id === "commercial-visuals" ? (
          <AppleMasonryGallery items={data.gallery} fontClass={fontClass} />
        ) : (
          <CinematicVideoGallery items={data.gallery} fontClass={fontClass} />
        )}

      </div>
    </main>
  );
}