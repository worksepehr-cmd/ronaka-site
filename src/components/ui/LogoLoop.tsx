"use client";

import { useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

export const LogoLoop = memo(({
  logos,
  speed = 40,
  gap = 40,
  hoverSpeed = 0,
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth = seqRef.current?.getBoundingClientRect().width ?? 0;
      if (sequenceWidth > 0) {
        setSeqWidth(sequenceWidth);
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM));
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [logos]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth === 0) return;

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const targetVelocity = isHovered ? hoverSpeed : speed;
      velocityRef.current += (targetVelocity - velocityRef.current) * (1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU));
      
      offsetRef.current = (offsetRef.current + velocityRef.current * deltaTime) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [seqWidth, isHovered, speed, hoverSpeed]);

  const logoLists = useMemo(() =>
    Array.from({ length: copyCount }, (_, copyIndex) => (
      <ul className="logoloop__list" key={`copy-${copyIndex}`} ref={copyIndex === 0 ? seqRef : undefined}>
        {logos.map((item: any, itemIndex: number) => (
          <li className="logoloop__item" key={`${copyIndex}-${itemIndex}`}>
            
            {/* 👈 رابط کاربری عکس‌ها مستقیماً اینجا قرار گرفت */}
            <div className="flex w-[100px] h-[100px] md:w-[140px] md:h-[140px] items-center justify-center p-4 cursor-pointer group">
              <img 
                src={item.src} 
                alt={item.alt} 
                className="max-w-full max-h-full object-contain grayscale opacity-40 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                draggable={false}
              />
            </div>

          </li>
        ))}
      </ul>
    )),
  [copyCount, logos]);

  return (
    <div 
      ref={containerRef} 
      className="logoloop logoloop--fade w-full overflow-hidden"
      style={{ '--logoloop-gap': `${gap}px` } as any}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="logoloop__track" ref={trackRef}>
        {logoLists}
      </div>
    </div>
  );
});

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;