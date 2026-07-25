"use client";

import React from "react";

export function OrganicTreesAndHills() {
  return (
    <group position={[0, 0, 0]}>
      {/* Stepping Stones Path along the Grass Meadow */}
      {[-8, -18, -28, -38, -48, -58, -68, -78, -88, -98].map((z, i) => (
        <group key={i} position={[-4.8 - Math.sin(i) * 0.6, 0.02, z]}>
          <mesh rotation={[-Math.PI / 2, 0, (i * 0.4)]}>
            <boxGeometry args={[0.8, 0.5, 0.04]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Ground-Anchored Angular Low-Poly Mountain Ranges */}
      {[-28, 28].map((hx, i) => (
        <group key={i} position={[hx, 0, 0]}>
          {[-110, -75, -40, -5, 30].map((hz, j) => (
            <group key={j} position={[0, 0, hz]}>
              {/* Angular Rocky Mountain Peak */}
              <mesh position={[0, 5.2, 0]} castShadow receiveShadow>
                <coneGeometry args={[8.2, 10.4, 6]} />
                <meshStandardMaterial color={j % 2 === 0 ? "#475569" : "#334155"} roughness={0.9} flatShading />
              </mesh>
              {/* Mountain Grassy Slope Base */}
              <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
                <coneGeometry args={[10.0, 4.8, 7]} />
                <meshStandardMaterial color={j % 2 === 0 ? "#3f6212" : "#4d7c0f"} roughness={0.85} flatShading />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Vibrant Low-Poly Trees (Golden Green & Leafy Oak) */}
      {Array.from({ length: 28 }).map((_, idx) => {
        const z = 8 - idx * 11;
        const isLeft = idx % 2 === 0;
        const xPos = isLeft ? -11.5 - (idx % 3) * 1.2 : 5.2; // Right side trees line up right beside river bank!
        const color = idx % 4 === 0 ? "#65a30d" : idx % 4 === 1 ? "#84cc16" : idx % 4 === 2 ? "#eab308" : "#15803d";

        return (
          <group key={idx} position={[xPos, 0, z]}>
            {/* Low-Poly Tree Trunk */}
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.32, 0.55, 3.0, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.85} />
            </mesh>
            {/* Fluffy Low-Poly Foliage Canopy */}
            <mesh position={[0, 4.2, 0]}>
              <dodecahedronGeometry args={[2.5]} />
              <meshStandardMaterial color={color} roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0.6, 5.2, 0.4]}>
              <dodecahedronGeometry args={[1.8]} />
              <meshStandardMaterial color="#84cc16" roughness={0.7} flatShading />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
