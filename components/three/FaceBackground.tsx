"use client";

import { Canvas } from "@react-three/fiber";
import { FaceMeshPoints } from "@/components/three/FaceMeshPoints";
import { HandMeshPoints } from "@/components/three/HandMeshPoints";
import { useTrackingContext } from "@/components/three/TrackingProvider";
import { useIsMobile } from "@/components/three/useIsMobile";

/**
 * Sfondo 3D fisso a tutta viewport, sempre dietro al contenuto della pagina
 * (anche durante lo scroll). Non intercetta mai i click: l'unica UI
 * interattiva legata al tracking è `TrackingOverlay`.
 */
export default function FaceBackground() {
  const { faceDetected, latestFaceResultRef, latestHandResultRef } =
    useTrackingContext();
  const isMobile = useIsMobile();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={isMobile ? 1 : [1, 2]}
        gl={{ antialias: !isMobile, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <FaceMeshPoints
          latestResultRef={latestFaceResultRef}
          faceDetected={faceDetected}
        />
        <HandMeshPoints latestResultRef={latestHandResultRef} />
      </Canvas>
    </div>
  );
}
