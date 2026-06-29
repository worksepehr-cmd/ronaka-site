import Link from "next/link";

const footerDict = {
  fa: {
    desc: "خلق تجربه‌های بصری سینمایی، هویت برند لوکس و تولید محتوای مبتنی بر هوش مصنوعی در بالاترین سطح استاندارد.",
    rights: "تمامی حقوق برای استودیو روناکا محفوظ است.",
    location: "مستقر در شیراز، فعال در سطح جهانی."
  },
  en: {
    desc: "Crafting cinematic visual experiences, luxury brand identities, and AI-driven content at the highest standards.",
    rights: "All rights reserved by Ronaka Studio.",
    location: "Based in Shiraz, Working Worldwide."
  },
  ar: {
    desc: "صنع تجارب بصرية سينمائية، هويات علامات تجارية فاخرة، ومحتوى مدفوع بالذكاء الاصطناعي بأعلى المعايير.",
    rights: "جميع الحقوق محفوظة لاستوديو روناکا.",
    location: "مقرنا في شيراز، ونعمل عالمياً."
  }
};

export default function Footer({ locale = "en" }: { locale?: string }) {
  const currentYear = new Date().getFullYear();
  const t = footerDict[locale as keyof typeof footerDict] || footerDict.en;
  const isRtl = locale === "fa" || locale === "ar";
  const fontClass = isRtl ? "font-fa" : "font-en";

  return (
    <footer className="w-full border-t border-white/10 bg-[#0A0C10] py-16 text-center md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6">
        
        {/* نشان برند */}
        <div className="flex items-center gap-2">
          <span className="font-en text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">RONAKA</span>
        </div>
        
        {/* توضیحات */}
        <p className={`max-w-xl text-sm leading-relaxed text-gray-400 md:text-base ${fontClass}`}>
          {t.desc}
        </p>

        {/* شبکه‌های اجتماعی */}
        <div className="mt-4 flex gap-8 font-en text-sm tracking-wider">
          <Link href="#" className="text-gray-500 transition-colors hover:text-white">INSTAGRAM</Link>
          <Link href="#" className="text-gray-500 transition-colors hover:text-white">LINKEDIN</Link>
          <Link href="#" className="text-gray-500 transition-colors hover:text-white">VIMEO</Link>
        </div>

        {/* خط پایان و کپی‌رایت */}
        <div className={`mt-12 flex w-full flex-col items-center justify-between border-t border-white/5 pt-8 text-xs text-gray-500 md:flex-row ${fontClass}`}>
          <p>© {currentYear} {t.rights}</p>
          <p className="mt-4 md:mt-0">{t.location}</p>
        </div>

      </div>
    </footer>
  );
}