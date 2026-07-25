"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function MarketDistrict() {
  const lanternRef1 = useRef();
  const lanternRef2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lanternRef1.current) lanternRef1.current.rotation.z = Math.sin(t * 1.5) * 0.08;
    if (lanternRef2.current) lanternRef2.current.rotation.z = Math.cos(t * 1.3) * 0.08;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Market Stall Left */}
      <group position={[-3.5, 0, -2]}>
        {/* Counter */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[2.5, 1.4, 3.5]} />
          <meshStandardMaterial color="#4a3525" roughness={0.7} />
        </mesh>
        {/* Canvas Awning */}
        <mesh position={[0.5, 3.2, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[3.2, 0.08, 4]} />
          <meshStandardMaterial color="#c96e48" roughness={0.5} />
        </mesh>
        {/* Goods Display Crates */}
        <mesh position={[0.4, 1.6, -0.8]}>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#e0a96d" />
        </mesh>
        <mesh position={[0.4, 1.6, 0.8]}>
          <boxGeometry args={[0.8, 0.4, 0.8]} />
          <meshStandardMaterial color="#1d9e75" />
        </mesh>
      </group>

      {/* Market Stall Right */}
      <group position={[3.5, 0, -2]}>
        {/* Counter */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[2.5, 1.4, 3.5]} />
          <meshStandardMaterial color="#4a3525" roughness={0.7} />
        </mesh>
        {/* Canvas Awning */}
        <mesh position={[-0.5, 3.2, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[3.2, 0.08, 4]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.5} />
        </mesh>
        {/* Goods Crates */}
        <mesh position={[-0.4, 1.6, 0]}>
          <boxGeometry args={[0.9, 0.5, 1.2]} />
          <meshStandardMaterial color="#d4a373" />
        </mesh>
      </group>

      {/* Hanging Market Lanterns */}
      <group ref={lanternRef1} position={[-1.8, 3.8, -1.5]}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshBasicMaterial color="#fca311" />
        </mesh>
        <pointLight intensity={2} color="#fca311" distance={7} />
      </group>

      <group ref={lanternRef2} position={[1.8, 3.8, -1.5]}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshBasicMaterial color="#5fd4a9" />
        </mesh>
        <pointLight intensity={2} color="#5fd4a9" distance={7} />
      </group>
    </group>
  );
}
