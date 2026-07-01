// src/components/ui/MotionCard.tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type MotionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "glass" | "surface";
  interactive?: boolean;
  glow?: boolean;
};

export function MotionCard({
  className,
  variant = "glass",
  interactive = true,
  glow = false,
  ...props
}: MotionCardProps) {
  const base =
    "relative rounded-2xl overflow-hidden " +
    (variant === "glass"
      ? "glass-panel shadow-soft"
      : "surface-1 shadow-soft");

  const hover =
    interactive
      ? "group motion-base transition-[transform,box-shadow,filter] hover:-translate-y-2 hover:shadow-hover"
      : "";

  const glowLayer =
    glow && interactive
      ? "before:absolute before:inset-0 before:opacity-0 before:pointer-events-none " +
        "before:transition-opacity before:motion-base " +
        "before:bg-[radial-gradient(600px_circle_at_var(--mx,50%)_var(--my,30%),rgba(255,255,255,0.10),transparent_55%)] " +
        "group-hover:before:opacity-100"
      : "";

  return (
    <div
      className={cn(base, hover, glowLayer, className)}
      onMouseMove={(e) => {
        if (!glow) return;
        const el = e.currentTarget as HTMLDivElement;
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", `${mx}%`);
        el.style.setProperty("--my", `${my}%`);
      }}
      {...props}
    />
  );
}