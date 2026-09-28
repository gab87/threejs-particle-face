"use client";

import type { ReactNode } from "react";
import { useTrackingContext } from "@/components/three/TrackingProvider";

/**
 * Contenitore fisso e non invasivo: non blocca mai i click sul resto della
 * pagina (solo la card al suo interno è cliccabile), cosi' l'utente può
 * sempre scorrere e navigare il sito anche prima di attivare la fotocamera.
 */
function FloatingCard({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-30 flex justify-center px-6">
      <div className="pointer-events-auto max-w-sm rounded-2xl border border-black/5 bg-white/90 p-6 text-center shadow-lg backdrop-blur-[1px]">
        {children}
      </div>
    </div>
  );
}

export function TrackingOverlay() {
  const { status, faceDetected, handsDetected, start } = useTrackingContext();

  if (status === "tracking") {
    if (faceDetected || handsDetected) return null;
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
        <span className="rounded-full bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
          Nessun volto o mano rilevati — posizionati davanti alla fotocamera
        </span>
      </div>
    );
  }

  if (status === "loading-model" || status === "requesting-camera") {
    return (
      <FloatingCard>
        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
        <p className="text-sm text-slate-700">
          {status === "loading-model"
            ? "Caricamento dei modelli di tracking…"
            : "Richiesta accesso alla fotocamera…"}
        </p>
      </FloatingCard>
    );
  }

  if (status === "denied") {
    return (
      <FloatingCard>
        <p className="text-sm text-red-600">
          Accesso alla fotocamera negato. Per vedere l&apos;effetto 3D,
          consenti l&apos;accesso alla webcam nelle impostazioni del browser e
          riprova.
        </p>
        <button
          onClick={start}
          className="mt-4 rounded-full border border-cyan-600 px-5 py-2 text-sm text-cyan-700 transition hover:bg-cyan-600 hover:text-white"
        >
          Riprova
        </button>
      </FloatingCard>
    );
  }

  if (status === "unsupported") {
    return (
      <FloatingCard>
        <p className="text-sm text-amber-700">
          Il tuo browser non supporta l&apos;accesso alla fotocamera
          necessario per questa esperienza 3D.
        </p>
      </FloatingCard>
    );
  }

  if (status === "error") {
    return (
      <FloatingCard>
        <p className="text-sm text-red-600">
          Si è verificato un errore durante l&apos;inizializzazione del
          tracking.
        </p>
        <button
          onClick={start}
          className="mt-4 rounded-full border border-cyan-600 px-5 py-2 text-sm text-cyan-700 transition hover:bg-cyan-600 hover:text-white"
        >
          Riprova
        </button>
      </FloatingCard>
    );
  }

  // idle
  return (
    <FloatingCard>
      <p className="text-sm text-slate-700">
        Attiva la fotocamera per trasformare il tuo volto e le tue mani in un
        wireframe di particelle in tempo reale. L&apos;elaborazione avviene
        interamente sul tuo dispositivo: nessuna immagine viene salvata o
        inviata altrove.
      </p>
      <button
        onClick={start}
        className="mt-4 rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500"
      >
        Attiva la fotocamera
      </button>
    </FloatingCard>
  );
}
