"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function HomeDistrict() {
  const orbRef = useRef();
  const waterRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.position.y = 1.6 + Math.sin(t * 2) * 0.12;
    }
    if (waterRef.current) {
      waterRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Octagonal Marble Fountain */}
      <group position={[0, 0, -1.5]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[2.2, 2.4, 0.8, 8]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Fountain Water Surface */}
        <mesh ref={waterRef} position={[0, 0.75, 0]}>
          <cylinderGeometry args={[2.0, 2.0, 0.05, 8]} />
          <meshStandardMaterial color="#5fd4a9" roughness={0.1} metalness={0.9} transparent opacity={0.85} />
        </mesh>

        {/* Central Fountain Tier & Spout */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.5, 0.7, 0.8, 8]} />
          <meshStandardMaterial color="#c9a96e" roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#fceabb" roughness={0.1} />
        </mesh>
        <pointLight position={[0, 1.8, 0]} intensity={1.8} color="#5fd4a9" distance={8} />
      </group>

      {/* Courtyard Archways (Left & Right) */}
      <group position={[-5, 0, -4]}>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[0.6, 6, 4]} />
          <meshStandardMaterial color="#213242" roughness={0.6} />
        </mesh>
        {/* Arch ornament */}
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[0.8, 0.4, 4.2]} />
          <meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      <group position={[5, 0, -4]}>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[0.6, 6, 4]} />
          <meshStandardMaterial color="#213242" roughness={0.6} />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[0.8, 0.4, 4.2]} />
          <meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Cypress Trees / Plants in Courtyard */}
      {[-4, 4].map((x, idx) => (
        <group key={idx} position={[x, 0, 1]}>
          {/* Pot */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.5, 0.4, 0.8, 8]} />
            <meshStandardMaterial color="#8c5a3c" roughness={0.7} />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 2.2, 0]}>
            <coneGeometry args={[0.8, 3.2, 8]} />
            <meshStandardMaterial color="#1f5942" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Character Presence Orb (Soft Glowing Light for the scenario participant) */}
      <group ref={orbRef} position={[2.2, 1.6, -1]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshBasicMaterial color="#fceabb" />
        </mesh>
        {/* Outer Aura */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshStandardMaterial color="#1d9e75" transparent opacity={0.3} />
        </mesh>
        <pointLight intensity={2.5} color="#fceabb" distance={7} />
      </group>
    </group>
  );
}
