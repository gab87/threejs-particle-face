import { useEffect, useState } from "react";

const MOBILE_MEDIA_QUERY = "(pointer: coarse)";

/**
 * Rileva se il dispositivo ha un input primario "coarse" (touch), tipico di
 * telefoni e tablet, indipendentemente da orientamento o larghezza finestra.
 * Va chiamata solo lato client (es. dentro un click handler o un effect).
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

/**
 * Versione reattiva di `isMobileDevice()` per l'uso nel render: parte da
 * `false` (safe per SSR) e si aggiorna dopo il mount, restando in sync se il
 * dispositivo cambia modalità (es. responsive mode dei DevTools).
 */
export function useIsMobile(): boolean {
  // Inizializzazione lazy: questo hook viene usato solo in componenti già
  // client-only (caricati con `ssr: false`), quindi al primo render `window`
  // è già disponibile e non serve un effect per il valore iniziale.
  const [isMobile, setIsMobile] = useState(isMobileDevice);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
