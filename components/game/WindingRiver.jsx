"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function WindingRiver() {
  const waterRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.x = 10.5 + Math.sin(t * 0.4) * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Wide River Channel (Y = -0.12 prevents Z-fighting flickering with ground terrain!) */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0.03]} position={[10.5, -0.12, -70]}>
        <planeGeometry args={[8.5, 190]} />
        <meshStandardMaterial color="#0284c7" roughness={0.05} metalness={0.88} transparent opacity={0.92} />
      </mesh>

      {/* Shoreline Foam Strips (Y = -0.08) */}
      <mesh rotation={[-Math.PI / 2, 0, 0.03]} position={[6.25, -0.08, -70]}>
        <planeGeometry args={[0.6, 190]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.2} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.03]} position={[14.75, -0.08, -70]}>
        <planeGeometry args={[0.6, 190]} />
        <meshStandardMaterial color="#e0f2fe" roughness={0.2} transparent opacity={0.7} />
      </mesh>

      {/* Riverbank Boulders & Stones */}
      {[15, 0, -15, -30, -45, -60, -75, -90, -105, -120, -135].map((z, i) => (
        <group key={i} position={[6.4, 0, z]}>
          <mesh position={[0, 0.35, 0]}>
            <dodecahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.4, 0.22, 0.8]}>
            <dodecahedronGeometry args={[0.48, 1]} />
            <meshStandardMaterial color="#475569" roughness={0.85} flatShading />
          </mesh>
        </group>
      ))}

      {/* Wooden Footbridges Crossing Over River */}
      {[-20, -80, -140].map((z, i) => (
        <group key={i} position={[10.5, 0.4, z]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[9.2, 0.25, 3.2]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
          {[-1.5, 1.5].map((rz, j) => (
            <group key={j} position={[0, 0.6, rz]}>
              {[-4, -2, 0, 2, 4].map((px, k) => (
                <mesh key={k} position={[px, 0, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 1.0, 8]} />
                  <meshStandardMaterial color="#451a03" />
                </mesh>
              ))}
              <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[9.0, 0.12, 0.12]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Floating Lotus Lily Pads (Y = 0.02) */}
      {[10, -5, -20, -35, -50, -65, -80, -95, -110, -125].map((z, i) => (
        <group key={i} position={[10.5 + (i % 2 === 0 ? 1.2 : -1.2), 0.02, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.55, 12]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <coneGeometry args={[0.22, 0.32, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#f43f5e" : "#fde047"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
