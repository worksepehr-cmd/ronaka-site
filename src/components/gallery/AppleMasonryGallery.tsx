"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  aspectRatio: string;
}

interface AppleMasonryGalleryProps {
  items: GalleryItem[];
  fontClass?: string;
  imageQuality?: number;
  priorityCount?: number;
}

const clampImageQuality = (quality: number) => Math.min(95, Math.max(1, quality));

const parseAspectRatio = (aspectRatio?: string) => {
  const [rawWidth, rawHeight] = aspectRatio?.split("/").map(Number) ?? [];
  const width = Number.isFinite(rawWidth) && rawWidth > 0 ? rawWidth : 4;
  const height = Number.isFinite(rawHeight) && rawHeight > 0 ? rawHeight : 5;

  return { width, height, css: `${width} / ${height}` };
};

const getResponsiveDimensions = (aspectRatio: string) => {
  const { width, height } = parseAspectRatio(aspectRatio);
  const baseWidth = 1200;

  return {
    width: baseWidth,
    height: Math.round((baseWidth * height) / width),
  };
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

export default function AppleMasonryGallery({
  items,
  fontClass = "",
  imageQuality = 86,
  priorityCount = 0,
}: AppleMasonryGalleryProps) {
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
          src={selectedItem.image}
          alt={selectedItem.title}
          width={getResponsiveDimensions(selectedItem.aspectRatio).width}
          height={getResponsiveDimensions(selectedItem.aspectRatio).height}
          quality={normalizedQuality}
          className="h-auto w-auto max-h-[calc(100dvh-9rem)] max-w-full rounded-2xl object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          sizes="100vw"
        />

        <p className="mt-4 max-w-[min(92vw,56rem)] rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-center text-sm font-medium tracking-[0.16em] text-white shadow-2xl backdrop-blur-md sm:mt-6 sm:px-8 sm:py-3 sm:text-base">
          {selectedItem.title}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={`group/gallery w-full columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 ${fontClass}`}>
        {items.map((item, index) => {
          const dimensions = getResponsiveDimensions(item.aspectRatio);
          const ratio = parseAspectRatio(item.aspectRatio);

          return (
            <button
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              key={item.id}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`View project: ${item.title}`}
              className="group/card relative mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-0 text-left outline-none transition duration-500 motion-safe:hover:scale-[1.015] motion-safe:hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0F] sm:rounded-[2rem] sm:group-hover/gallery:opacity-45 sm:hover:!opacity-100"
              style={{ aspectRatio: ratio.css }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={dimensions.width}
                height={dimensions.height}
                quality={normalizedQuality}
                priority={index < priorityCount}
                className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover/card:scale-105 motion-reduce:transition-none"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#090A0F]/90 via-transparent to-transparent p-4 opacity-100 transition-opacity duration-500 sm:p-6 sm:opacity-0 sm:group-hover/card:opacity-100">
                <span className="w-fit translate-y-0 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide text-white backdrop-blur-md transition-transform duration-500 ease-out sm:translate-y-4 sm:group-hover/card:translate-y-0 md:text-base">
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
