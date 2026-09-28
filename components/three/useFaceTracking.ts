import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

export type FaceTrackingStatus =
  | "idle"
  | "loading-model"
  | "requesting-camera"
  | "tracking"
  | "denied"
  | "unsupported"
  | "error";

const WASM_BASE_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm";
const MODEL_ASSET_PATH =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

/**
 * Gestisce l'accesso alla webcam e il face tracking con MediaPipe FaceLandmarker.
 * Tutto il processing avviene lato client: nessun frame video o dato biometrico
 * viene mai inviato a un server.
 */
export function useFaceTracking() {
  const [status, setStatus] = useState<FaceTrackingStatus>("idle");
  const [faceDetected, setFaceDetected] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const latestResultRef = useRef<FaceLandmarkerResult | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    videoRef.current?.pause();
    videoRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    lastVideoTimeRef.current = -1;
    latestResultRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    try {
      setStatus("loading-model");
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE_PATH);
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_ASSET_PATH,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });

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
        const landmarker = landmarkerRef.current;
        const videoEl = videoRef.current;
        if (
          landmarker &&
          videoEl &&
          videoEl.readyState >= 2 &&
          videoEl.currentTime !== lastVideoTimeRef.current
        ) {
          lastVideoTimeRef.current = videoEl.currentTime;
          const result = landmarker.detectForVideo(videoEl, performance.now());
          latestResultRef.current = result;

          const hasFace = result.faceLandmarks.length > 0;
          setFaceDetected((prev) => (prev !== hasFace ? hasFace : prev));
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      console.error("Impossibile avviare il face tracking:", err);
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

  return { status, faceDetected, start, stop, latestResultRef };
}
