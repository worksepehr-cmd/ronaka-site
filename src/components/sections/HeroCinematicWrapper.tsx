"use client";

import dynamic from "next/dynamic";

const HeroCinematicClient = dynamic(
  () => import("./HeroCinematicClient"),
  {
    ssr: false,
  }
);

export default function HeroCinematicWrapper() {
  return <HeroCinematicClient />;
}