"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function LowPolyClouds() {
  const cloudsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(t * 0.04) * 4;
    }
  });

  return (
    <group ref={cloudsRef} position={[0, 0, 0]}>
      {/* Small, Cute Fluffy Low-Poly White Clouds in Sky View */}
      {[
        { x: -14, y: 11.5, z: -10, scale: 0.65 },
        { x: 10, y: 12.5, z: -20, scale: 0.7 },
        { x: -16, y: 11.0, z: -35, scale: 0.6 },
        { x: 12, y: 13.0, z: -50, scale: 0.75 },
        { x: -10, y: 12.0, z: -65, scale: 0.6 },
        { x: 14, y: 11.5, z: -85, scale: 0.7 },
        { x: -12, y: 12.5, z: -105, scale: 0.65 },
      ].map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <dodecahedronGeometry args={[1.8, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} flatShading />
          </mesh>
          <mesh position={[1.3, -0.2, 0.3]}>
            <dodecahedronGeometry args={[1.4, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} flatShading />
          </mesh>
          <mesh position={[-1.3, -0.2, 0.3]}>
            <dodecahedronGeometry args={[1.4, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <dodecahedronGeometry args={[1.3, 1]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
