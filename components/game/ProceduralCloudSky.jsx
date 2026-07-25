"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function ProceduralCloudSky() {
  const cloudsGroupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.position.x = Math.sin(t * 0.05) * 4;
    }
  });

  return (
    <group ref={cloudsGroupRef} position={[0, 22, -120]}>
      {/* Sun Orb on Horizon (Matching user request: sun & clouds at end of road) */}
      <mesh position={[0, -2, -60]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <pointLight position={[0, -2, -50]} intensity={4} color="#fde047" distance={150} />

      {/* Floating 3D Clouds Cluster 1 */}
      {[-45, -20, 0, 20, 45].map((cx, i) => (
        <group key={i} position={[cx, (i % 3) * 2, (i % 2) * -15]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[4.5, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.9} />
          </mesh>
          <mesh position={[2.5, -0.5, 1]}>
            <sphereGeometry args={[3.2, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.85} />
          </mesh>
          <mesh position={[-2.5, -0.5, 1]}>
            <sphereGeometry args={[3.2, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
