"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RealisticWaterfall } from "./RealisticWaterfall";
import { LowPolyClouds } from "./LowPolyClouds";
import { OrganicTreesAndHills } from "./OrganicTreesAndHills";
import { FullMosquePavilion } from "./FullMosquePavilion";
import { WindingRiver } from "./WindingRiver";

export function EndlessRoadWorld() {
  const lanternsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lanternsRef.current) {
      lanternsRef.current.position.y = Math.sin(t * 1.5) * 0.04;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sunlight & Atmospheric Ambient Light */}
      <directionalLight position={[30, 50, 30]} intensity={2.8} color="#fffbe6" castShadow />
      <ambientLight intensity={1.35} color="#e0f2fe" />

      {/* Fluffy Low-Poly White Clouds Visible Directly in Sky */}
      <LowPolyClouds />

      {/* Ground-Anchored Low-Poly Mountains, Stepping Stones & Trees */}
      <OrganicTreesAndHills />

      {/* Wide 8.5-meter Winding River Channel with Wooden Footbridges & Lotus Blooms */}
      <WindingRiver />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FOREGROUND: Wooden Bridge over River Stream at Z = 12 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 12]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
          <planeGeometry args={[90, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} transparent opacity={0.9} />
        </mesh>
        {[-12, -5, 3, 12].map((x, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, (i % 2) - 1]}>
            <circleGeometry args={[0.45, 12]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        ))}
        {/* Wooden Bridge Deck */}
        <mesh position={[0, 0.5, 0]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[5.2, 0.28, 7]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Railings */}
        {[-2.6, 2.6].map((x, i) => (
          <group key={i} position={[x, 1.1, 0]}>
            {[-3, -1.5, 0, 1.5, 3].map((z, j) => (
              <mesh key={j} position={[0, 0.4, z]}>
                <cylinderGeometry args={[0.09, 0.09, 1.1, 8]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
            ))}
            <mesh position={[0, 0.95, 0]}>
              <boxGeometry args={[0.14, 0.14, 6.5]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* OPEN MAIN ROAD: Brownish Dirt/Soil Path (Y = 0.04 prevents Z-fighting) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -150]} receiveShadow>
        <planeGeometry args={[8.0, 330]} />
        <meshStandardMaterial color="#6b4b32" roughness={0.85} />
      </mesh>

      {/* Stone Brown Curb Borders (Y = 0.08) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.1, 0.08, -150]}>
        <planeGeometry args={[0.35, 330]} />
        <meshStandardMaterial color="#9a7453" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.1, 0.08, -150]}>
        <planeGeometry args={[0.35, 330]} />
        <meshStandardMaterial color="#9a7453" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Lawn Green Meadow Terrain Ground (Y = -0.05) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-40, -0.05, -150]}>
        <planeGeometry args={[70, 330]} />
        <meshStandardMaterial color="#65a30d" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, -0.05, -150]}>
        <planeGeometry args={[70, 330]} />
        <meshStandardMaterial color="#65a30d" roughness={0.8} />
      </mesh>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FULL MOSQUE PAVILION & LANDMARKS (Positioned strictly on SIDES) */}
      {/* ───────────────────────────────────────────────────────────── */}

      {/* MILESTONE 1 (z = -35): Grand Mosque & Pavilion (Left Side at x = -15) */}
      <FullMosquePavilion position={[-15, 0, -35]} />

      {/* MILESTONE 3 (z = -75): Souk Market Square with Canvas Awnings (Left Side) */}
      <group position={[-6.5, 0, -75]}>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[3.2, 1.6, 4.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0.8, 3.4, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[4.0, 0.1, 5.2]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} />
        </mesh>
        {[-1.2, 0, 1.2].map((z, i) => (
          <mesh key={i} position={[1.2, 1.8, z]}>
            <cylinderGeometry args={[0.35, 0.25, 0.4, 12]} />
            <meshStandardMaterial color={i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#10b981"} />
          </mesh>
        ))}
      </group>

      {/* MILESTONE 4 (z = -45): Mountain Cliff & Cascading Waterfall (Right Side at x = 18 feeding into river!) */}
      <RealisticWaterfall position={[18, 0, -45]} />

      {/* MILESTONE 5 (z = -115): Second Grand Mosque Entrance (Right Side at x = 15) */}
      <FullMosquePavilion position={[15, 0, -115]} />

      {/* Roadside Festoon Garland Lights every 24m */}
      {Array.from({ length: 12 }).map((_, idx) => {
        const z = -idx * 24;
        return (
          <group key={idx} position={[0, 0, z]}>
            <mesh position={[-4.3, 3.2, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 6.4, 8]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
            <mesh position={[4.3, 3.2, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 6.4, 8]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
            <mesh position={[0, 5.8, 0]}>
              <boxGeometry args={[8.8, 0.04, 0.04]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {[-2.4, 2.4].map((lx, li) => (
              <group key={li} position={[lx, 5.1, 0]}>
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[0.26, 12, 12]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.2} />
                </mesh>
                <pointLight position={[0, 0, 0]} intensity={1} color="#fef08a" distance={6} />
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}
