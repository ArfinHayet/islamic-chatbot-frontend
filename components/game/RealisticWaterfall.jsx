"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function RealisticWaterfall({ position = [18, 0, -45] }) {
  const waterStream1Ref = useRef();
  const waterStream2Ref = useRef();
  const mistRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterStream1Ref.current) {
      waterStream1Ref.current.position.y = 3.5 - ((t * 4.5) % 1.5);
    }
    if (waterStream2Ref.current) {
      waterStream2Ref.current.position.y = 3.5 - (((t * 4.5) + 0.75) % 1.5);
    }
    if (mistRef.current) {
      mistRef.current.scale.x = 1 + Math.sin(t * 3) * 0.18;
      mistRef.current.scale.z = 1 + Math.cos(t * 3) * 0.18;
    }
  });

  return (
    <group position={position}>
      {/* High Rocky Cliff Mountain Base (Positioned at x = 18, z = -45 feeding into river) */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[6.5, 1]} />
        <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[2, 7.5, -1]} castShadow receiveShadow>
        <dodecahedronGeometry args={[4.8, 1]} />
        <meshStandardMaterial color="#334155" roughness={0.95} flatShading />
      </mesh>

      {/* Cascading Water Stream */}
      <group position={[-3.6, 0, 1]}>
        <mesh ref={waterStream1Ref} position={[0, 3.5, 0]}>
          <boxGeometry args={[1.8, 7.5, 0.4]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.05} metalness={0.9} transparent opacity={0.88} />
        </mesh>
        <mesh ref={waterStream2Ref} position={[0, 3.5, 0.05]}>
          <boxGeometry args={[1.5, 7.5, 0.3]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.1} transparent opacity={0.75} />
        </mesh>
        {/* Misty Splash Pool at Base */}
        <mesh ref={mistRef} position={[0, -0.3, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.8, 20]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.2} transparent opacity={0.85} />
        </mesh>
        <pointLight position={[0, 1.5, 0.6]} intensity={3.5} color="#38bdf8" distance={10} />
      </group>
    </group>
  );
}
