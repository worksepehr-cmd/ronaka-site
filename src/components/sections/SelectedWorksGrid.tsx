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

export interface PortfolioItem {
  id: string;
  title: string;
  enTitle: string;
  layout: "vertical" | "horizontal";
  media: {
    localImage: string;
    onlineVideoUrl: string;
  };
}

export default function SelectedWorksGrid({ items, locale = "fa" }: { items: PortfolioItem[], locale?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const verticalItems = items.filter(item => item.layout === "vertical");
  const horizontalItem = items.find(item => item.layout === "horizontal");

  const isRtl = locale === "fa" || locale === "ar";
  const fontClass = isRtl ? "font-fa" : "font-en";

  useGSAP(() => {
    const cards = gsap.utils.toArray(".gsap-card");
    
    cards.forEach((card: any) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 100, rotateX: 10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`group/grid w-full ${fontClass}`}>
      
      {/* ردیف اول: ۳ کارت عمودی با نسبت ابعاد سینمایی موبایل (9:16) */}
      <div className="mb-6 grid grid-cols-1 gap-6 sm:mb-8 sm:gap-8 md:grid-cols-3">
        {verticalItems.map((item) => (
          <Link
            key={item.id}
            href={`/projects/${item.id}`}
            className="gsap-card mx-auto block w-full max-w-[360px] aspect-[9/16] transition-all duration-700 ease-out group-hover/grid:opacity-40 group-hover/grid:scale-[0.97] hover:!z-50 hover:!scale-100 hover:!opacity-100 md:max-w-none"
          >
            <TiltedCard
              imageSrc={item.media.localImage}
              altText={item.title}
              captionText=""
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.03}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="flex h-full w-full flex-col justify-end rounded-2xl bg-gradient-to-t from-[#090A0F]/90 via-[#090A0F]/20 to-transparent p-6 md:p-8">
                  <span className="mb-2 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#F3F4F6] backdrop-blur-md">
                    {item.enTitle}
                  </span>
                  <h3 className="font-nightbor text-2xl font-bold text-white md:text-3xl">
                    {item.title}
                  </h3>
                </div>
              }
            />
          </Link>
        ))}
      </div>

      {/* ردیف دوم: ۱ کارت افقی با نسبت ابعاد سینمایی واید (16:9) */}
      {horizontalItem && (
        <Link
          href={`/projects/${horizontalItem.id}`}
          className="gsap-card mx-auto block aspect-[16/9] w-full max-w-[360px] justify-self-center transition-all duration-700 ease-out group-hover/grid:opacity-40 group-hover/grid:scale-[0.97] hover:!z-50 hover:!scale-100 hover:!opacity-100 md:max-w-none"
        >
          <TiltedCard
            imageSrc={horizontalItem.media.localImage}
            altText={horizontalItem.title}
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
                  {horizontalItem.enTitle}
                </span>
                <h3 className="font-nightbor text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  {horizontalItem.title}
                </h3>
              </div>
            }
          />
        </Link>
      )}

    </div>
  );
}