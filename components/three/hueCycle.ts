/**
 * Parametri condivisi del ciclo colore (HSL) usati sia dal volto che dalle
 * mani, cosi' tutti gli elementi della scena cambiano colore esattamente
 * nello stesso istante e restano perfettamente sincronizzati.
 */
export const HUE_CYCLE_SPEED = 0.05;
export const HUE_SATURATION = 0.85;
export const HUE_LIGHTNESS = 0.5;

/** Velocità del ciclo hue: 1 = un giro completo dell'arcobaleno ogni secondo. */
export function getHue(time: number): number {
  return (time * HUE_CYCLE_SPEED) % 1;
}
