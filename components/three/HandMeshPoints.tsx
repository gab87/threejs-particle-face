"use client";

import { useFrame } from "@react-three/fiber";
import { HandLandmarker, type HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getHue, HUE_SATURATION, HUE_LIGHTNESS } from "@/components/three/hueCycle";
import { SCALE } from "@/components/three/FaceMeshPoints";

const LANDMARK_COUNT = 21;

/** Connessioni dello scheletro della mano (indici landmark), da MediaPipe. */
const HAND_CONNECTIONS = HandLandmarker.HAND_CONNECTIONS;

type Buffers = {
  working: Float32Array;
  points: Float32Array;
  line: Float32Array;
};

type SingleHandProps = {
  latestResultRef: React.RefObject<HandLandmarkerResult | null>;
  handIndex: number;
};

/**
 * Wireframe a particelle per una singola mano (slot 0 o 1). A differenza del
 * volto, non ha una forma "idle" di fallback: quando la mano non è
 * rilevata, sfuma semplicemente a opacità 0.
 */
function SingleHand({ latestResultRef, handIndex }: SingleHandProps) {
  const pointsGeometryRef = useRef<THREE.BufferGeometry>(null);
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial>(null);
  const linesMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  const buffersRef = useRef<Buffers | null>(null);

  useEffect(() => {
    const buffers: Buffers = {
      working: new Float32Array(LANDMARK_COUNT * 3),
      // I 21 landmark reali + un punto intermedio per ogni segmento dello
      // scheletro, per raddoppiare la densità di particelle visibili senza
      // alterare la geometria delle linee.
      points: new Float32Array(
        (LANDMARK_COUNT + HAND_CONNECTIONS.length) * 3
      ),
      line: new Float32Array(HAND_CONNECTIONS.length * 2 * 3),
    };
    buffersRef.current = buffers;

    pointsGeometryRef.current?.setAttribute(
      "position",
      new THREE.BufferAttribute(buffers.points, 3)
    );
    lineGeometryRef.current?.setAttribute(
      "position",
      new THREE.BufferAttribute(buffers.line, 3)
    );
  }, []);

  useFrame((state) => {
    const buffers = buffersRef.current;
    if (!buffers) return;

    const { working, points, line } = buffers;
    const time = state.clock.getElapsedTime();
    const landmarks = latestResultRef.current?.landmarks?.[handIndex];
    const isVisible = Boolean(landmarks && landmarks.length > 0);

    if (landmarks && landmarks.length > 0) {
      for (let i = 0; i < LANDMARK_COUNT; i++) {
        const lm = landmarks[i];
        if (!lm) continue;
        // Stessa convenzione di mapping del volto: effetto specchio su x,
        // stessa scala mondo per restare spazialmente coerenti.
        working[i * 3] = (0.5 - lm.x) * SCALE;
        working[i * 3 + 1] = (0.5 - lm.y) * SCALE;
        working[i * 3 + 2] = -lm.z * SCALE;
      }

      // I primi 21 punti sono i landmark reali...
      points.set(working.subarray(0, LANDMARK_COUNT * 3));

      for (let c = 0; c < HAND_CONNECTIONS.length; c++) {
        const { start, end } = HAND_CONNECTIONS[c];
        line[c * 6] = working[start * 3];
        line[c * 6 + 1] = working[start * 3 + 1];
        line[c * 6 + 2] = working[start * 3 + 2];
        line[c * 6 + 3] = working[end * 3];
        line[c * 6 + 4] = working[end * 3 + 1];
        line[c * 6 + 5] = working[end * 3 + 2];

        // ...e uno per segmento è un punto intermedio, per raddoppiare la
        // densità visiva delle particelle senza toccare le linee.
        const midOffset = (LANDMARK_COUNT + c) * 3;
        points[midOffset] = (working[start * 3] + working[end * 3]) / 2;
        points[midOffset + 1] =
          (working[start * 3 + 1] + working[end * 3 + 1]) / 2;
        points[midOffset + 2] =
          (working[start * 3 + 2] + working[end * 3 + 2]) / 2;
      }
    }

    const targetOpacity = isVisible ? 1 : 0;
    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.opacity = THREE.MathUtils.lerp(
        pointsMaterialRef.current.opacity,
        targetOpacity * 0.9,
        0.15
      );
    }
    if (linesMaterialRef.current) {
      linesMaterialRef.current.opacity = THREE.MathUtils.lerp(
        linesMaterialRef.current.opacity,
        targetOpacity * 0.55,
        0.15
      );
    }

    // Stesso hue del volto, per restare perfettamente sincronizzati.
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
    <group>
      <lineSegments>
        <bufferGeometry ref={lineGeometryRef} />
        <lineBasicMaterial
          ref={linesMaterialRef}
          linewidth={2}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      <points>
        <bufferGeometry ref={pointsGeometryRef} />
        <pointsMaterial
          ref={pointsMaterialRef}
          size={0.075}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

type Props = {
  latestResultRef: React.RefObject<HandLandmarkerResult | null>;
};

/** Renderizza fino a 2 mani, ciascuna indipendente, nella stessa scena del volto. */
export function HandMeshPoints({ latestResultRef }: Props) {
  return (
    <>
      <SingleHand latestResultRef={latestResultRef} handIndex={0} />
      <SingleHand latestResultRef={latestResultRef} handIndex={1} />
    </>
  );
}
