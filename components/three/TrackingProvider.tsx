"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { FaceLandmarkerResult, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { useMediaPipeTracking, type TrackingStatus } from "@/components/three/useMediaPipeTracking";

type TrackingContextValue = {
  status: TrackingStatus;
  faceDetected: boolean;
  handsDetected: boolean;
  start: () => void;
  stop: () => void;
  latestFaceResultRef: React.RefObject<FaceLandmarkerResult | null>;
  latestHandResultRef: React.RefObject<HandLandmarkerResult | null>;
};

const TrackingContext = createContext<TrackingContextValue | null>(null);

/**
 * Fornisce lo stato di tracking (webcam + MediaPipe FaceLandmarker e
 * HandLandmarker) a tutta la pagina, cosi' sia lo sfondo 3D fisso che
 * l'overlay dei permessi possono condividere lo stesso stato senza essere
 * annidati l'uno nell'altro.
 */
export function TrackingProvider({ children }: { children: ReactNode }) {
  const value = useMediaPipeTracking();

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTrackingContext() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error(
      "useTrackingContext deve essere usato dentro <TrackingProvider>"
    );
  }
  return context;
}
