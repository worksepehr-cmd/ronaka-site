import HeroCinematicClient from "@/components/sections/HeroCinematicClient";
import SelectedWorkSection from "@/components/sections/SelectedWorkSection";
import ClientsSection from "@/components/sections/ClientsSection";
import CapabilitiesSection from "@/components/sections/CapabilitiesSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      
      {/* ۱. سکشن هیرو ویدیو */}
      <HeroCinematicClient />
      
      {/* ۲. سکشن پروژه‌های منتخب */}
      <SelectedWorkSection />
      
      {/* ۳. سکشن لوگوی مشتریان */}
      {/* @ts-expect-error Async Server Component */}
      <ClientsSection />
      
      {/* ۴. سکشن قابلیت‌ها */}
      <CapabilitiesSection />

    </main>
  );
}