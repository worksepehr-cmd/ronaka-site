"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ComingSoon() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          filter: "blur(20px)",
          scale: 0.96,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 2,
          ease: "power3.out",
        }
      );

      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#090A0F]">
      
      {/* cinematic light */}
      <div
        ref={glowRef}
        className="absolute h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]"
      />

      {/* subtle noise layer */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_45%)]" />

      <h1
        ref={titleRef}
        className="relative z-10 font-nightbor text-5xl font-bold tracking-[0.25em] text-white sm:text-7xl md:text-8xl"
      >
        COMING SOON
      </h1>

    </main>
  );
}