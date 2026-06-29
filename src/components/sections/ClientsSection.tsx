import fs from 'fs';
import path from 'path';
import LogoLoop from '@/components/ui/LogoLoop';
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionary";

// دیکشنری محلی برای این سکشن
const dict = {
  fa: { title: "برندهایی که به ما اعتماد کردند" },
  en: { title: "Brands that trusted us" },
  ar: { title: "العلامات التجارية التي وثقت بنا" }
};

export default async function ClientsSection() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? DEFAULT_LOCALE) as Locale;
  const text = dict[locale] || dict.fa;

  const logosDir = path.join(process.cwd(), 'public', 'clients');
  let clientLogos: any[] = [];

  try {
    const files = fs.readdirSync(logosDir);
    clientLogos = files
      .filter(file => file.endsWith('.png') || file.endsWith('.webp'))
      .map(file => ({
        id: file,
        src: `/clients/${file}`,
        alt: file.split('.')[0],
      }));
  } catch (error) {
    console.warn("Folder 'public/clients' not found or empty.");
  }

  if (clientLogos.length === 0) return null;

  return (
    <section dir="ltr" className="w-full bg-[#0F1117] py-24 overflow-x-clip">
      <div className="mx-auto w-full max-w-7xl px-4 flex flex-col items-center">
        
        <p className="font-doran text-[#F3F4F6]/50 text-sm md:text-base uppercase tracking-widest mb-10 text-center">
          {text.title}
        </p>

        <LogoLoop 
          logos={clientLogos}
          speed={50} 
          gap={40} 
          hoverSpeed={0} 
        />
      </div>
    </section>
  );
}