"use client";

import { useFrame } from "@react-three/fiber";
import { FaceLandmarker, type FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getHue, HUE_SATURATION, HUE_LIGHTNESS } from "@/components/three/hueCycle";

const PARTICLE_COUNT = 478;

/** Scala mondo condivisa con `HandMeshPoints`, cosi' volto e mani restano
 * spazialmente coerenti (provengono dallo stesso frame camera). */
export const SCALE = 11;

/** Connessioni della mesh facciale (indici landmark), fornite da MediaPipe. */
const TESSELATION = FaceLandmarker.FACE_LANDMARKS_TESSELATION;

/**
 * Genera una nuvola di punti "idle" a forma di volto stilizzato,
 * usata come fallback finché la webcam non è attiva o nessun volto è rilevato.
 */
function buildFallbackPositions(): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const goldenAngle = Math.PI * (1 + Math.sqrt(5));

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = i / (PARTICLE_COUNT - 1);
    const phi = Math.acos(1 - 2 * t);
    const theta = goldenAngle * i;

    const x = Math.sin(phi) * Math.cos(theta) * 0.62;
    const y = Math.sin(phi) * Math.sin(theta) * 0.85;
    const z = Math.cos(phi) * 0.55;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

type Buffers = {
  fallback: Float32Array;
  working: Float32Array;
  line: Float32Array;
};

type Props = {
  latestResultRef: React.RefObject<FaceLandmarkerResult | null>;
  faceDetected: boolean;
};

export function FaceMeshPoints({ latestResultRef, faceDetected }: Props) {
  const pointsGeometryRef = useRef<THREE.BufferGeometry>(null);
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial>(null);
  const linesMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Buffer tipizzati mutabili, allocati una sola volta dopo il mount e
  // aggiornati "in place" ad ogni frame dentro useFrame (mai durante il
  // render, per restare compatibili con le regole di immutabilità di React).
  const buffersRef = useRef<Buffers | null>(null);

  useEffect(() => {
    const buffers: Buffers = {
      fallback: buildFallbackPositions(),
      working: new Float32Array(PARTICLE_COUNT * 3),
      line: new Float32Array(TESSELATION.length * 2 * 3),
    };
    buffersRef.current = buffers;

    pointsGeometryRef.current?.setAttribute(
      "position",
      new THREE.BufferAttribute(buffers.working, 3)
    );
    lineGeometryRef.current?.setAttribute(
      "position",
      new THREE.BufferAttribute(buffers.line, 3)
    );
  }, []);

  useFrame((state) => {
    const buffers = buffersRef.current;
    if (!buffers) return;

    const { fallback, working, line } = buffers;
    const time = state.clock.getElapsedTime();
    const result = latestResultRef.current;
    const landmarks = result?.faceLandmarks?.[0];

    if (landmarks && landmarks.length > 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const lm = landmarks[i];
        if (!lm) continue;
        // Effetto specchio: flip orizzontale su x. y e z convertiti dallo
        // spazio immagine (origine in alto a sinistra, z verso la camera)
        // allo spazio Three.js (origine al centro, y verso l'alto).
        working[i * 3] = (0.5 - lm.x) * SCALE;
        working[i * 3 + 1] = (0.5 - lm.y) * SCALE;
        working[i * 3 + 2] = -lm.z * SCALE;
      }

      for (let c = 0; c < TESSELATION.length; c++) {
        const { start, end } = TESSELATION[c];
        line[c * 6] = working[start * 3];
        line[c * 6 + 1] = working[start * 3 + 1];
        line[c * 6 + 2] = working[start * 3 + 2];
        line[c * 6 + 3] = working[end * 3];
        line[c * 6 + 4] = working[end * 3 + 1];
        line[c * 6 + 5] = working[end * 3 + 2];
      }

      if (linesMaterialRef.current) {
        linesMaterialRef.current.opacity = THREE.MathUtils.lerp(
          linesMaterialRef.current.opacity,
          0.35,
          0.1
        );
      }
    } else {
      // Nessun volto rilevato: mostra una nuvola "idle" che respira e ruota
      // lentamente, cosi' la scena non resta mai vuota.
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const bx = fallback[i * 3];
        const by = fallback[i * 3 + 1];
        const bz = fallback[i * 3 + 2];
        const wobble = Math.sin(time * 0.6 + i * 0.15) * 0.03;

        working[i * 3] = bx * SCALE + wobble;
        working[i * 3 + 1] = by * SCALE + wobble;
        working[i * 3 + 2] = bz * SCALE + wobble;
      }

      if (linesMaterialRef.current) {
        linesMaterialRef.current.opacity = THREE.MathUtils.lerp(
          linesMaterialRef.current.opacity,
          0,
          0.1
        );
      }
    }

    if (groupRef.current) {
      const targetRotation = faceDetected ? 0 : time * 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }

    // Punti e linee ciclano insieme, in sincronia, su tutta la ruota degli hue.
    const hue = getHue(time);
    pointsMaterialRef.current?.color.setHSL(
      hue,
      HUE_SATURATION,
      HUE_LIGHTNESS
    );
    linesMaterialRef.current?.color.setHSL(hue, HUE_SATURATION, HUE_LIGHTNESS);

    if (pointsGeometryRef.current) {
      pointsGeometryRef.current.attributes.position.needsUpdate = true;
    }
    if (lineGeometryRef.current) {
      lineGeometryRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry ref={lineGeometryRef} />
        <lineBasicMaterial
          ref={linesMaterialRef}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <points>
        <bufferGeometry ref={pointsGeometryRef} />
        <pointsMaterial
          ref={pointsMaterialRef}
          size={0.065}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
