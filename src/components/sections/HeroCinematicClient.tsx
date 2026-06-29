"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroCinematicClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const desktopVideo = desktopVideoRef.current;

      if (!container || !desktopVideo) return;

      let mm = gsap.matchMedia();

      // منطق اسکرول فقط برای دسکتاپ
      mm.add("(min-width: 768px)", () => {
        let cleanup: (() => void) | undefined;

        const setup = () => {
          const duration = desktopVideo.duration || 1;

          desktopVideo.pause();
          desktopVideo.currentTime = 0;

          let targetTime = 0;
          let smoothTime = 0;

          const scrollTrigger = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              targetTime = self.progress * duration;
            },
          });

          const render = () => {
            smoothTime += (targetTime - smoothTime) * 0.18;

            if (
              Math.abs(desktopVideo.currentTime - smoothTime) > 0.025 &&
              !Number.isNaN(smoothTime)
            ) {
              desktopVideo.currentTime = smoothTime;
            }
          };

          gsap.ticker.add(render);

          return () => {
            scrollTrigger.kill();
            gsap.ticker.remove(render);
          };
        };

        const onReady = () => {
          cleanup = setup();
          ScrollTrigger.refresh();
        };

        if (desktopVideo.readyState >= 2) {
          onReady();
        } else {
          desktopVideo.addEventListener("loadeddata", onReady, { once: true });
        }

        return () => {
          desktopVideo.removeEventListener("loadeddata", onReady);
          cleanup?.();
        };
      });

    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full h-[100vh] md:h-[300vh] bg-[#0F1117]">
      {/* با حذف شدن overflow-x-hidden از بادی، 
        حالا position: sticky با قدرت تمام کار می‌کنه 
      */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* ویدیوی دسکتاپ */}
        <video
          ref={desktopVideoRef}
          className="absolute top-0 left-0 h-full w-full object-cover hidden md:block"
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero-cinematic.mp4" type="video/mp4" />
          <source src="/videos/hero-cinematic.webm" type="video/webm" />
        </video>

        {/* ویدیوی موبایل */}
        <video
          className="absolute top-0 left-0 h-full w-full object-cover block md:hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/hero-mobile-poster.jpg"
        >
          <source src="/videos/hero-mobile.mp4" type="video/mp4" />
          <source src="/videos/hero-mobile.webm" type="video/webm" />
        </video>

      </div>
    </div>
  );
}