import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  HandLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { isMobileDevice } from "@/components/three/useIsMobile";

export type TrackingStatus =
  | "idle"
  | "loading-model"
  | "requesting-camera"
  | "tracking"
  | "denied"
  | "unsupported"
  | "error";

const WASM_BASE_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm";
const FACE_MODEL_ASSET_PATH =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const HAND_MODEL_ASSET_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/**
 * Su mobile il rilevamento (2 modelli ML) viene limitato a questa frequenza
 * per non saturare CPU/GPU e lasciare margine al render loop di Three.js. Il
 * rendering 3D resta comunque fluido interpolando l'ultimo risultato noto.
 * Su desktop non viene applicato alcun throttling (comportamento invariato).
 */
const MOBILE_DETECTION_INTERVAL_MS = 1000 / 18;

/**
 * Gestisce l'accesso alla webcam e il tracking di volto e mani con
 * MediaPipe (FaceLandmarker + HandLandmarker), condividendo lo stesso
 * permesso/stream video. Tutto il processing avviene lato client: nessun
 * frame video o dato biometrico viene mai inviato a un server.
 */
export function useMediaPipeTracking() {
  const [status, setStatus] = useState<TrackingStatus>("idle");
  const [faceDetected, setFaceDetected] = useState(false);
  const [handsDetected, setHandsDetected] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const lastDetectionTimeRef = useRef(0);
  const isMobileRef = useRef(false);
  const latestFaceResultRef = useRef<FaceLandmarkerResult | null>(null);
  const latestHandResultRef = useRef<HandLandmarkerResult | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    videoRef.current?.pause();
    videoRef.current = null;
    faceLandmarkerRef.current?.close();
    faceLandmarkerRef.current = null;
    handLandmarkerRef.current?.close();
    handLandmarkerRef.current = null;
    lastVideoTimeRef.current = -1;
    lastDetectionTimeRef.current = 0;
    latestFaceResultRef.current = null;
    latestHandResultRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    isMobileRef.current = isMobileDevice();

    try {
      setStatus("loading-model");
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE_PATH);
      [faceLandmarkerRef.current, handLandmarkerRef.current] =
        await Promise.all([
          FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: FACE_MODEL_ASSET_PATH,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          }),
          HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: HAND_MODEL_ASSET_PATH,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 2,
          }),
        ]);

      setStatus("requesting-camera");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;

      const video = document.createElement("video");
      video.playsInline = true;
      video.muted = true;
      video.srcObject = stream;
      await video.play();
      videoRef.current = video;

      setStatus("tracking");

      const loop = () => {
        const faceLandmarker = faceLandmarkerRef.current;
        const handLandmarker = handLandmarkerRef.current;
        const videoEl = videoRef.current;
        const timestamp = performance.now();
        const dueForMobileThrottle =
          !isMobileRef.current ||
          timestamp - lastDetectionTimeRef.current >=
            MOBILE_DETECTION_INTERVAL_MS;

        if (
          faceLandmarker &&
          handLandmarker &&
          videoEl &&
          videoEl.readyState >= 2 &&
          videoEl.currentTime !== lastVideoTimeRef.current &&
          dueForMobileThrottle
        ) {
          lastVideoTimeRef.current = videoEl.currentTime;
          lastDetectionTimeRef.current = timestamp;

          const faceResult = faceLandmarker.detectForVideo(
            videoEl,
            timestamp
          );
          latestFaceResultRef.current = faceResult;
          const hasFace = faceResult.faceLandmarks.length > 0;
          setFaceDetected((prev) => (prev !== hasFace ? hasFace : prev));

          const handResult = handLandmarker.detectForVideo(
            videoEl,
            timestamp
          );
          latestHandResultRef.current = handResult;
          const hasHands = handResult.landmarks.length > 0;
          setHandsDetected((prev) => (prev !== hasHands ? hasHands : prev));
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      console.error("Impossibile avviare il tracking:", err);
      if (
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
      ) {
        setStatus("denied");
      } else {
        setStatus("error");
      }
      stop();
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return {
    status,
    faceDetected,
    handsDetected,
    start,
    stop,
    latestFaceResultRef,
    latestHandResultRef,
  };
}
