"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { TrackingProvider } from "@/components/three/TrackingProvider";
import { TrackingOverlay } from "@/components/ui/TrackingOverlay";

const FaceBackground = dynamic(
  () => import("@/components/three/FaceBackground"),
  { ssr: false }
);

/**
 * Boundary client per l'intera pagina: monta lo sfondo 3D fisso e l'overlay
 * dei permessi/stato una sola volta, condividendo lo stato di tracking con
 * tutta la pagina tramite `TrackingProvider`.
 */
export function FaceExperience({ children }: { children: ReactNode }) {
  return (
    <TrackingProvider>
      <FaceBackground />
      <TrackingOverlay />
      <div className="relative z-10">{children}</div>
    </TrackingProvider>
  );
}
