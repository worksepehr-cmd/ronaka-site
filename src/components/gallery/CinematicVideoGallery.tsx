"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface VideoGalleryItem {
  id: string;
  title: string;
  client: string;
  poster: string;
  instagramUrl?: string;
  layout: "horizontal" | "vertical";
}

interface CinematicVideoGalleryProps {
  items: VideoGalleryItem[];
  fontClass?: string;
  imageQuality?: number;
  priorityCount?: number;
  instagramLabel?: string;
}

const clampImageQuality = (quality: number) => Math.min(95, Math.max(1, quality));

const getCardImageSizes = (layout: VideoGalleryItem["layout"]) => {
  if (layout === "horizontal") {
    return "(max-width: 1024px) 100vw, 50vw";
  }

  return "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw";
};

const getFocusableElements = (container: HTMLElement | null) => {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => {
    const style = window.getComputedStyle(element);
    return !element.hasAttribute("disabled") && style.display !== "none" && style.visibility !== "hidden";
  });
};

export default function CinematicVideoGallery({
  items,
  fontClass = "",
  imageQuality = 86,
  priorityCount = 0,
  instagramLabel = "View on Instagram",
}: CinematicVideoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastOpenedIndex = useRef<number | null>(null);

  const selectedItem = selectedIndex === null ? null : items[selectedIndex];
  const normalizedQuality = clampImageQuality(imageQuality);

  const openLightbox = useCallback((index: number) => {
    lastOpenedIndex.current = index;
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    const triggerIndex = lastOpenedIndex.current;
    setSelectedIndex(null);

    window.requestAnimationFrame(() => {
      if (triggerIndex !== null) {
        triggerRefs.current[triggerIndex]?.focus({ preventScroll: true });
      }
    });
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || items.length === 0) return currentIndex;
      return (currentIndex + 1) % items.length;
    });
  }, [items.length]);

  const showPrev = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || items.length === 0) return currentIndex;
      return (currentIndex - 1 + items.length) % items.length;
    });
  }, [items.length]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= items.length) {
      setSelectedIndex(items.length > 0 ? items.length - 1 : null);
    }
  }, [items.length, selectedIndex]);

  useEffect(() => {
    if (!selectedItem) return;

    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus({ preventScroll: true });
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLightbox, selectedItem, showNext, showPrev]);

  if (items.length === 0) {
    return null;
  }

  const lightbox = selectedItem ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={selectedItem.title}
      className="fixed inset-0 z-[9999] h-dvh overflow-y-auto bg-[#090A0F]/95 backdrop-blur-2xl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeLightbox();
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={closeLightbox}
        aria-label="Close preview"
        className="fixed right-4 top-4 z-[10010] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
      >
        ×
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous project"
            className="fixed left-4 top-1/2 z-[10010] hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
          >
            ←
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next project"
            className="fixed right-4 top-1/2 z-[10010] hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
          >
            →
          </button>
        </>
      )}

      <div
        className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-4 py-20 sm:px-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
          <Image
            src={selectedItem.poster}
            alt={selectedItem.title}
            width={selectedItem.layout === "horizontal" ? 1920 : 1080}
            height={selectedItem.layout === "horizontal" ? 1080 : 1920}
            quality={normalizedQuality}
            className="h-auto w-auto max-h-[calc(100dvh-9rem)] max-w-full rounded-2xl object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
            sizes="100vw"
          />

        <p className="mt-4 max-w-[min(92vw,56rem)] rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-center text-sm font-medium tracking-[0.16em] text-white shadow-2xl backdrop-blur-md sm:mt-6 sm:px-8 sm:py-3 sm:text-base">
          {selectedItem.title}
        </p>
        {selectedItem.instagramUrl && (
         <a
    href={selectedItem.instagramUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
  >
   {instagramLabel}
  </a>
)}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={`grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 ${fontClass}`}>
        {items.map((item, index) => {
          const isHorizontal = item.layout === "horizontal";
          const hasInstagram = Boolean(item.instagramUrl);

          return (
            <button
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              key={item.id}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`${hasInstagram ? "View on Instagram" : "View project"}: ${item.title}`}
              className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left outline-none transition duration-500 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0F] sm:rounded-[1.5rem]
                ${isHorizontal ? "col-span-2 aspect-[16/9]" : "col-span-1 aspect-[9/16]"}
              `}
            >
              <Image
                src={item.poster}
                alt={item.title}
                fill
                quality={normalizedQuality}
                priority={index < priorityCount}
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                sizes={getCardImageSizes(item.layout)}
              />

              <span className="absolute inset-0 bg-gradient-to-t from-[#090A0F]/95 via-[#090A0F]/30 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20 sm:h-16 sm:w-16">
                  {hasInstagram ? (
                    <svg className="ml-0.5 h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
                    </svg>
                  )}
                </span>
              </span>

              <span className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 sm:p-6">
                <span className="mb-2 w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#E5E7EB] backdrop-blur-md">
                  {item.client}
                </span>
                <span className="line-clamp-2 text-base font-bold leading-tight text-white sm:text-xl md:text-2xl">
                  {item.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {isMounted && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  );
}
