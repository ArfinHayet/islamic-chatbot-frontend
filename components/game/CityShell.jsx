"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function CityShell() {
  const lanternsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lanternsRef.current) {
      lanternsRef.current.position.y = Math.sin(t * 1.5) * 0.04;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Soft Warm Pastel Sky Dome (Matching Image 1) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[80, 32, 16]} />
        <meshBasicMaterial color="#eef5db" side={1} />
      </mesh>

      {/* Depth Fog & Warm Sun Light */}
      <directionalLight position={[15, 40, 20]} intensity={2.2} color="#fffbe6" castShadow />
      <ambientLight intensity={1.1} color="#e9edc9" />

      {/* River Stream in Foreground (Under Bridge) */}
      <group position={[0, -0.2, 8]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[70, 8]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.6} transparent opacity={0.85} />
        </mesh>
        {/* Lily pads on water */}
        {[-8, -3, 4, 9].map((x, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, (i % 2) - 1]}>
            <circleGeometry args={[0.35, 12]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        ))}
      </group>

      {/* Arched Wooden Bridge (Foreground over River - Matching Image 1) */}
      <group position={[0, 0, 8]}>
        {/* Arch Deck */}
        <mesh position={[0, 0.6, 0]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[4.2, 0.25, 6]} />
          <meshStandardMaterial color="#8c5a3c" roughness={0.7} />
        </mesh>
        {/* Bridge Side Railings */}
        {[-2.1, 2.1].map((x, i) => (
          <group key={i} position={[x, 1.1, 0]}>
            {/* Posts */}
            {[-2.5, -1.2, 0, 1.2, 2.5].map((z, j) => (
              <mesh key={j} position={[0, 0.4, z]}>
                <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
                <meshStandardMaterial color="#5c3a21" />
              </mesh>
            ))}
            {/* Top Bar */}
            <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[0.12, 0.12, 5.5]} />
              <meshStandardMaterial color="#5c3a21" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Winding Dirt Path stretching into distance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -25]} receiveShadow>
        <planeGeometry args={[6.5, 90]} />
        <meshStandardMaterial color="#e0a96d" roughness={0.8} />
      </mesh>

      {/* Lush Green Grass Fields on Left & Right */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-30, -0.02, -25]}>
        <planeGeometry args={[50, 90]} />
        <meshStandardMaterial color="#88b04b" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, -0.02, -25]}>
        <planeGeometry args={[50, 90]} />
        <meshStandardMaterial color="#88b04b" roughness={0.9} />
      </mesh>

      {/* Hanging Garland Poles & Red/Gold Lanterns Across the Path (Matching Image 1) */}
      {[-2, -14, -26, -38].map((zPos, idx) => (
        <group key={idx} position={[0, 0, zPos]}>
          {/* Left Pole */}
          <mesh position={[-3.8, 3.2, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 6.4, 8]} />
            <meshStandardMaterial color="#5c3a21" />
          </mesh>
          {/* Right Pole */}
          <mesh position={[3.8, 3.2, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 6.4, 8]} />
            <meshStandardMaterial color="#5c3a21" />
          </mesh>
          {/* Cable Wire */}
          <mesh position={[0, 5.8, 0]}>
            <boxGeometry args={[7.8, 0.04, 0.04]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
          {/* Hanging Red/Gold Lanterns */}
          <group ref={idx === 0 ? lanternsRef : undefined}>
            {[-2.2, -0.7, 0.7, 2.2].map((lx, li) => (
              <group key={li} position={[lx, 5.2, 0]}>
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[0.28, 12, 12]} />
                  <meshStandardMaterial color={li % 2 === 0 ? "#e63946" : "#f4a261"} roughness={0.3} metalness={0.4} />
                </mesh>
                <pointLight position={[0, 0, 0]} intensity={0.8} color="#ffb703" distance={5} />
              </group>
            ))}
          </group>
        </group>
      ))}

      {/* Low-Poly Trees & Village Pavilions lining both sides of path (Matching Image 1) */}
      {[-4, -12, -20, -28, -36, -44].map((zPos, idx) => (
        <group key={idx} position={[0, 0, zPos]}>
          {/* Left Side Low-Poly Tree Canopy */}
          <group position={[-7.5, 0, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.3, 0.45, 2.4, 8]} />
              <meshStandardMaterial color="#5c3a21" />
            </mesh>
            {/* Layered Blocky Low-Poly Foliage */}
            <mesh position={[0, 3.8, 0]}>
              <dodecahedronGeometry args={[2.2]} />
              <meshStandardMaterial color={idx % 2 === 0 ? "#2d5a27" : "#407b34"} roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0.6, 4.8, 0.4]}>
              <dodecahedronGeometry args={[1.6]} />
              <meshStandardMaterial color="#588b35" roughness={0.8} flatShading />
            </mesh>
          </group>

          {/* Left Side Village Pavilion Building */}
          {idx % 2 === 1 && (
            <group position={[-5.8, 0, 3]}>
              <mesh position={[0, 1.8, 0]}>
                <boxGeometry args={[3.8, 3.6, 4.2]} />
                <meshStandardMaterial color="#f4f1de" roughness={0.6} />
              </mesh>
              {/* Thatched Roof */}
              <mesh position={[0, 4.1, 0]}>
                <coneGeometry args={[3.2, 1.8, 4]} rotation={[0, Math.PI / 4, 0]} />
                <meshStandardMaterial color="#d4a373" roughness={0.9} flatShading />
              </mesh>
            </group>
          )}

          {/* Right Side Low-Poly Tree Canopy */}
          <group position={[7.5, 0, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.3, 0.45, 2.4, 8]} />
              <meshStandardMaterial color="#5c3a21" />
            </mesh>
            <mesh position={[0, 3.8, 0]}>
              <dodecahedronGeometry args={[2.2]} />
              <meshStandardMaterial color={idx % 2 === 0 ? "#407b34" : "#2d5a27"} roughness={0.8} flatShading />
            </mesh>
            <mesh position={[-0.6, 4.8, -0.4]}>
              <dodecahedronGeometry args={[1.6]} />
              <meshStandardMaterial color="#588b35" roughness={0.8} flatShading />
            </mesh>
          </group>

          {/* Right Side Village House / Mosque Pavilion */}
          {idx % 2 === 0 && (
            <group position={[5.8, 0, 3]}>
              <mesh position={[0, 1.8, 0]}>
                <boxGeometry args={[3.8, 3.6, 4.2]} />
                <meshStandardMaterial color="#fefae0" roughness={0.5} />
              </mesh>
              {/* Emerald Dome */}
              <mesh position={[0, 4.4, 0]}>
                <sphereGeometry args={[1.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#2a9d8f" roughness={0.3} metalness={0.4} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
