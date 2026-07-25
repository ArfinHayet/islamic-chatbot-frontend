"use client";

import React from "react";

export function FullMosquePavilion({ position = [-15, 0, -25] }) {
  return (
    <group position={position}>
      {/* 1. Base Marble Foundation Platform */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[10.2, 0.5, 9.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* 2. Main Building Body (White Marble Walls) */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[8.8, 4.0, 7.8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* 3. Golden Roof Slab (Width 8.9m - Minarets positioned outside at x=+-5.2 to eliminate Z-fighting!) */}
      <mesh position={[0, 4.65, 0]}>
        <boxGeometry args={[9.0, 0.3, 8.0]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* 4. Cylindrical Dome Base Drum (Solid White - Connects roof to dome with ZERO floating gap!) */}
      <mesh position={[0, 5.15, 0]}>
        <cylinderGeometry args={[2.3, 2.3, 0.7, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* 5. Main Emerald Green Dome (Rests directly on top of drum at y=5.5) */}
      <group position={[0, 5.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#10b981" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Crescent Moon Finial */}
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[0.25, 1.2, 8]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* 6. Minaret Towers (Positioned cleanly at x=+-5.2 so they never intersect roof slab!) */}
      {[-5.2, 5.2].map((mx, i) => (
        <group key={i} position={[mx, 0, 2.8]}>
          {/* Minaret Square Base */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[1.3, 3.0, 1.3]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
          {/* Main Round Shaft */}
          <mesh position={[0, 7.5, 0]}>
            <cylinderGeometry args={[0.65, 0.8, 12, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          {/* Golden Balcony Ring */}
          <mesh position={[0, 13.5, 0]}>
            <cylinderGeometry args={[1.1, 0.8, 0.5, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
          {/* Spire Top & Emerald Cap */}
          <mesh position={[0, 15.2, 0]}>
            <coneGeometry args={[0.75, 3.0, 16]} />
            <meshStandardMaterial color="#10b981" roughness={0.2} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* 7. Front Entrance Columns & Doorway */}
      <group position={[0, 0, 4.0]}>
        {[-3.0, -1.0, 1.0, 3.0].map((px, i) => (
          <mesh key={i} position={[px, 2.1, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 3.6, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
        ))}
        {/* Wooden Entrance Door */}
        <mesh position={[0, 1.6, -0.1]}>
          <boxGeometry args={[1.6, 3.0, 0.1]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      </group>
    </group>
  );
}
