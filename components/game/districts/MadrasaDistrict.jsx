"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function MadrasaDistrict() {
  const quranGlowRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (quranGlowRef.current) {
      quranGlowRef.current.intensity = 1.8 + Math.sin(t * 2) * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Rehl / X-shaped Wooden Book Stand & Book */}
      <group position={[0, 0.4, -1]}>
        {/* Stand Base */}
        <mesh position={[0, 0.3, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.8]} />
          <meshStandardMaterial color="#5c3d2e" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.3, 0]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.8]} />
          <meshStandardMaterial color="#5c3d2e" roughness={0.4} />
        </mesh>

        {/* Open Book Pages */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.1, 0.06, 0.7]} />
          <meshStandardMaterial color="#fefae0" roughness={0.2} />
        </mesh>

        <pointLight ref={quranGlowRef} position={[0, 1.2, 0]} intensity={2} color="#5fd4a9" distance={6} />
      </group>

      {/* Madrasa Archway Frame */}
      <group position={[0, 0, -4.5]}>
        <mesh position={[-4, 3, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 6, 12]} />
          <meshStandardMaterial color="#2d4053" roughness={0.4} />
        </mesh>
        <mesh position={[4, 3, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 6, 12]} />
          <meshStandardMaterial color="#2d4053" roughness={0.4} />
        </mesh>
        {/* Upper Arch Beam */}
        <mesh position={[0, 5.8, 0]}>
          <boxGeometry args={[8.8, 0.6, 0.6]} />
          <meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Mashrabiya Geometric Lattice Screen Wall */}
      <mesh position={[0, 3, -5]}>
        <boxGeometry args={[7.5, 4.5, 0.1]} />
        <meshStandardMaterial color="#1a2f3d" roughness={0.6} />
      </mesh>
    </group>
  );
}
