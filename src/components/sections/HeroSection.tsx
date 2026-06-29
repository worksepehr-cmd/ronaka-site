import { cookies } from "next/headers";
import { DEFAULT_LOCALE, getDir, type Locale } from "@/lib/i18n/dictionary";
import { getHomeDict } from "@/lib/i18n/dictionary";
import HeroCinematicClient from "./HeroCinematicClient";

export default async function HeroSection() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? DEFAULT_LOCALE) as Locale;
  
  // لود کردن دیتای ترجمه در سمت سرور
  const dict = await getHomeDict(locale);
  const dir = getDir(locale);

  // ارسال دیتا به کلاینت کامپوننت برای اجرای انیمیشن‌های GSAP
  return <HeroCinematicClient />;
}