import { cookies } from "next/headers";
import { DEFAULT_LOCALE, getDir, type Locale } from "@/lib/i18n/dictionary";

// دیکشنری محلی قابلیت‌ها
const dict = {
  fa: {
    title: "قابلیت‌های استودیو",
    items: [
      { title: "استراتژی هوش مصنوعی و اتوماسیون", desc: "طراحی جریان‌های کاری و سیستم‌های هوشمند." },
      { title: "سیستم‌های دیزاین", desc: "ساخت اکوسیستم‌های بصری مقیاس‌پذیر و یکپارچه." },
      { title: "تجربه محصول", desc: "خلق رابط‌های کاربری با بالاترین سطح عملکرد." }
    ]
  },
  en: {
    title: "Capabilities",
    items: [
      { title: "AI Strategy & Automation", desc: "Designing intelligent workflows and systems." },
      { title: "Design Systems", desc: "Building scalable visual ecosystems." },
      { title: "Product Experience", desc: "Creating interfaces that perform." }
    ]
  },
  ar: {
    title: "قدرات الاستوديو",
    items: [
      { title: "استراتيجية الذكاء الاصطناعي والأتمتة", desc: "تصميم مسارات عمل وأنظمة ذكية." },
      { title: "أنظمة التصميم", desc: "بناء أنظمة بيئية بصرية قابلة للتطوير." },
      { title: "تجربة المنتج", desc: "خلق واجهات مستخدم بأعلى مستويات الأداء." }
    ]
  }
};

export default async function CapabilitiesSection() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? DEFAULT_LOCALE) as Locale;
  const dir = getDir(locale);
  const content = dict[locale] || dict.fa;

  return (
    <section dir={dir} className="w-full max-w-[1320px] mx-auto px-6 md:px-8 py-16 md:py-32 space-y-12 md:space-y-16">
      <h2 className="text-3xl font-semibold text-center md:text-start">{content.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
        {content.items.map((item, index) => (
          <div key={index} className="space-y-4 text-center md:text-start">
            <h3 className="text-xl">{item.title}</h3>
            <p className="text-sm text-[#94A3B8]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}