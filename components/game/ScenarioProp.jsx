"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function ScenarioProp({ propType = "coin" }) {
  const propGroupRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (propGroupRef.current) {
      propGroupRef.current.position.y = 1.2 + Math.sin(t * 2) * 0.15;
      propGroupRef.current.rotation.y = t * 0.8;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Golden Focal Pedestal Ring on the Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial color="#fceabb" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.3, 1.45, 16]} />
        <meshBasicMaterial color="#1d9e75" />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={3} color="#fceabb" distance={6} />

      {/* Floating Thematic 3D Prop */}
      <group ref={propGroupRef} position={[0, 1.2, 0]}>
        {propType === "coin" && (
          <group>
            {/* Pouch body */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.45, 16, 16]} />
              <meshStandardMaterial color="#c9a96e" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Tie string */}
            <mesh position={[0, 0.35, 0]}>
              <torusGeometry args={[0.25, 0.05, 8, 16]} />
              <meshStandardMaterial color="#8c5a3c" />
            </mesh>
            {/* Gold coins top */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.1, 12]} />
              <meshStandardMaterial color="#ffe169" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>
        )}

        {propType === "scale" && (
          <group position={[0, -0.2, 0]}>
            {/* Base Pillar */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.08, 0.2, 0.8, 12]} />
              <meshStandardMaterial color="#c9a96e" metalness={0.8} />
            </mesh>
            {/* Beam */}
            <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 1.2, 12]} />
              <meshStandardMaterial color="#c9a96e" metalness={0.8} />
            </mesh>
            {/* Left Pan */}
            <mesh position={[-0.55, 0.4, 0]}>
              <cylinderGeometry args={[0.25, 0.1, 0.08, 12]} />
              <meshStandardMaterial color="#ffe169" metalness={0.9} />
            </mesh>
            {/* Right Pan */}
            <mesh position={[0.55, 0.4, 0]}>
              <cylinderGeometry args={[0.25, 0.1, 0.08, 12]} />
              <meshStandardMaterial color="#ffe169" metalness={0.9} />
            </mesh>
          </group>
        )}

        {propType === "book" && (
          <group position={[0, -0.1, 0]}>
            {/* Rehl stand */}
            <mesh position={[0, 0.2, 0]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.6]} />
              <meshStandardMaterial color="#5c3d2e" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.2, 0]} rotation={[-0.4, 0, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.6]} />
              <meshStandardMaterial color="#5c3d2e" roughness={0.4} />
            </mesh>
            {/* Book pages */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.7, 0.06, 0.5]} />
              <meshStandardMaterial color="#fefae0" roughness={0.2} />
            </mesh>
          </group>
        )}

        {propType === "gift" && (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial color="#1d9e75" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Ribbon */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.63, 0.63, 0.12]} />
              <meshStandardMaterial color="#fceabb" metalness={0.7} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
