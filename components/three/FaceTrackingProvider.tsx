"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useFaceTracking, type FaceTrackingStatus } from "@/components/three/useFaceTracking";

type FaceTrackingContextValue = {
  status: FaceTrackingStatus;
  faceDetected: boolean;
  start: () => void;
  stop: () => void;
  latestResultRef: React.RefObject<FaceLandmarkerResult | null>;
};

const FaceTrackingContext = createContext<FaceTrackingContextValue | null>(
  null
);

/**
 * Fornisce lo stato di face tracking (webcam + MediaPipe FaceLandmarker) a
 * tutta la pagina, cosi' sia lo sfondo 3D fisso che l'overlay dei permessi
 * possono condividere lo stesso stato senza essere annidati l'uno nell'altro.
 */
export function FaceTrackingProvider({ children }: { children: ReactNode }) {
  const value = useFaceTracking();

  return (
    <FaceTrackingContext.Provider value={value}>
      {children}
    </FaceTrackingContext.Provider>
  );
}

export function useFaceTrackingContext() {
  const context = useContext(FaceTrackingContext);
  if (!context) {
    throw new Error(
      "useFaceTrackingContext deve essere usato dentro <FaceTrackingProvider>"
    );
  }
  return context;
}
