"use client";

import { Canvas } from "@react-three/fiber";
import { FaceMeshPoints } from "@/components/three/FaceMeshPoints";
import { useFaceTrackingContext } from "@/components/three/FaceTrackingProvider";

/**
 * Sfondo 3D fisso a tutta viewport, sempre dietro al contenuto della pagina
 * (anche durante lo scroll). Non intercetta mai i click: l'unica UI
 * interattiva legata al tracking è `FaceTrackingOverlay`.
 */
export default function FaceBackground() {
  const { faceDetected, latestResultRef } = useFaceTrackingContext();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <FaceMeshPoints
          latestResultRef={latestResultRef}
          faceDetected={faceDetected}
        />
      </Canvas>
    </div>
  );
}
