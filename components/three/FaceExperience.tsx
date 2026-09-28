"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { FaceTrackingProvider } from "@/components/three/FaceTrackingProvider";
import { FaceTrackingOverlay } from "@/components/ui/FaceTrackingOverlay";

const FaceBackground = dynamic(
  () => import("@/components/three/FaceBackground"),
  { ssr: false }
);

/**
 * Boundary client per l'intera pagina: monta lo sfondo 3D fisso e l'overlay
 * dei permessi/stato una sola volta, condividendo lo stato di tracking con
 * tutta la pagina tramite `FaceTrackingProvider`.
 */
export function FaceExperience({ children }: { children: ReactNode }) {
  return (
    <FaceTrackingProvider>
      <FaceBackground />
      <FaceTrackingOverlay />
      <div className="relative z-10">{children}</div>
    </FaceTrackingProvider>
  );
}
