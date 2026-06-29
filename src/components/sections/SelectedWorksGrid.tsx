"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import TiltedCard from "@/components/ui/TiltedCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// دیکشنری محلی برای کارت سینمایی
const cinematicDict = {
  fa: {
    title: "پروژه‌های سینمایی و هوش مصنوعی",
    category: "Cinematic & AI Media"
  },
  en: {
    title: "Cinematic & AI Projects",
    category: "Cinematic & AI Media"
  },
  ar: {
    title: "المشاريع السينمائية والذكاء الاصطناعي",
    category: "الإنتاج السينمائي والذكاء الاصطناعي"
  }
};

// اضافه شدن اینترفیس دقیق برای تضمین سلامت داده‌ها
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
}

export default function SelectedWorksGrid({ items, locale = "fa" }: { items: PortfolioItem[], locale?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".gsap-card");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { y: 100, opacity: 0, rotateX: 5 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });

  const topCards = items.slice(0, 3);
  
  const t = cinematicDict[locale as keyof typeof cinematicDict] || cinematicDict.fa;

  // منطبق کردن کارت پیش‌فرض با اینترفیس
  const cinematicCard: PortfolioItem = items.length > 3 ? items[3] : {
    id: "cinematic-teaser-default",
    title: t.title,
    category: t.category,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", 
    link: "/portfolio/cinematic"
  };

  return (
    <div ref={containerRef} className="group/grid w-full overflow-x-clip">
      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col items-center gap-6 px-4 md:mt-12 md:gap-8 md:px-0">
        
        <div className="grid w-full grid-cols-1 place-items-center gap-6 md:grid-cols-3 md:gap-8">
          {topCards.map((project: PortfolioItem) => (
            <Link
              key={project.id}
              href={project.link || "#"}
              className="gsap-card mx-auto block aspect-[9/16] w-full max-w-[360px] justify-self-center transition-all duration-700 ease-out group-hover/grid:opacity-40 group-hover/grid:scale-[0.97] hover:!z-50 hover:!scale-100 hover:!opacity-100 md:max-w-none"
            >
              <TiltedCard
                imageSrc={project.image}
                altText={project.title}
                captionText=""
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={10}
                scaleOnHover={1.03}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div className="flex h-full w-full flex-col justify-end rounded-2xl bg-gradient-to-t from-[#090A0F] via-[#090A0F]/70 to-transparent p-5 md:p-8">
                    <span className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-[#F3F4F6] backdrop-blur-md md:mb-4 md:px-4 md:py-2 md:text-xs">
                      {project.category}
                    </span>

                    <h3 className="font-doran line-clamp-2 text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-2xl md:text-3xl">
                      {project.title}
                    </h3>
                  </div>
                }
              />
            </Link>
          ))}
        </div>

        <Link
          href={cinematicCard.link}
          className="gsap-card mx-auto block aspect-[16/9] w-full max-w-[360px] justify-self-center transition-all duration-700 ease-out group-hover/grid:opacity-40 group-hover/grid:scale-[0.97] hover:!z-50 hover:!scale-100 hover:!opacity-100 md:max-w-none"
        >
          <TiltedCard
            imageSrc={cinematicCard.image}
            altText={cinematicCard.title}
            captionText=""
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={5}
            scaleOnHover={1.02}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
              <div className="flex h-full w-full flex-col justify-end rounded-2xl bg-gradient-to-t from-[#090A0F] via-[#090A0F]/60 to-transparent p-5 md:p-10">
                <span className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-[#F3F4F6] backdrop-blur-md md:mb-4 md:px-4 md:py-2 md:text-xs">
                  {cinematicCard.category}
                </span>

                <h3 className="font-doran line-clamp-2 text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-2xl md:text-4xl">
                  {cinematicCard.title}
                </h3>
              </div>
            }
          />
        </Link>
      </div>
    </div>
  );
}