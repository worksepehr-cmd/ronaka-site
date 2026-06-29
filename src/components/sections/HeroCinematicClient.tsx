"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MEDIA } from "@/config/media"; // 👈 فراخوانی فایل مدیریت مدیا

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
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* 👈 ویدیوهای دسکتاپ (اتصال به فایل Config) */}
        <video
          ref={desktopVideoRef}
          className="absolute top-0 left-0 h-full w-full object-cover hidden md:block"
          muted
          playsInline
          preload="auto"
          poster={MEDIA.hero.desktop.poster}
        >
          <source src={MEDIA.hero.desktop.mp4} type="video/mp4" />
          <source src={MEDIA.hero.desktop.webm} type="video/webm" />
        </video>

        {/* 👈 ویدیوهای موبایل (اتصال به فایل Config) */}
        <video
          className="absolute top-0 left-0 h-full w-full object-cover block md:hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={MEDIA.hero.mobile.poster}
        >
          <source src={MEDIA.hero.mobile.mp4} type="video/mp4" />
          <source src={MEDIA.hero.mobile.webm} type="video/webm" />
        </video>

      </div>
    </div>
  );
}