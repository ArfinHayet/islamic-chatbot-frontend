"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EndlessRoadWorld } from "./EndlessRoadWorld";
import { useGame } from "@/context/GameContext";

export function getRoadZForScenario(scenarioIndex) {
  return -10 - scenarioIndex * 15;
}

function ContinuousWalkingCamera() {
  const { state } = useGame();
  const cameraZRef = useRef(10);

  useFrame((rState, delta) => {
    const t = rState.clock.getElapsedTime();
    const scenarioIdx = state.currentScenarioIndex || 0;
    const isWalking = state.phase === "loading_scenario" || state.phase === "scene_intro";

    // Dynamic FOV scaling for vertical Reel / mobile 9:16 aspect ratios
    const { width, height } = rState.size;
    const aspect = width / height;
    if (aspect < 1.0) {
      // Expand vertical FOV so 3D scene side environment is fully preserved in Reel aspect ratio
      rState.camera.fov = Math.min(68, Math.max(52, 50 / aspect));
    } else {
      rState.camera.fov = 50;
    }
    rState.camera.updateProjectionMatrix();

    const targetZ = state.phase === "idle" ? 10 : getRoadZForScenario(scenarioIdx);
    const walkSpeed = isWalking ? 2.5 : 4.0;
    cameraZRef.current += (targetZ - cameraZRef.current) * Math.min(1, delta * walkSpeed);

    const currentZ = cameraZRef.current;
    const distanceToTarget = Math.abs(currentZ - targetZ);

    const isMoving = distanceToTarget > 0.1;
    const bob = isMoving ? Math.sin(t * 7) * 0.06 : Math.sin(t * 1.5) * 0.02;

    rState.camera.position.x = 0;
    rState.camera.position.y = 2.4 + bob;
    rState.camera.position.z = currentZ + 6.0;

    rState.camera.lookAt(0, 1.5, currentZ - 4.0);
  });

  return null;
}

export function CityScene() {
  const { state } = useGame();
  const scenarioIdx = state.currentScenarioIndex || 0;
  const milestoneZ = getRoadZForScenario(scenarioIdx);

  return (
    <div className="game-canvas">
      <Canvas
        camera={{ position: [0, 2.4, 15], fov: 50 }}
        dpr={typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio) : 1}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#38bdf8"); // Rich Vibrant Sky Blue matching Reference Image 2!
        }}
      >
        <ContinuousWalkingCamera />
        <EndlessRoadWorld />

        {/* Golden Ring on Road at Active Milestone */}
        {state.phase !== "idle" && (
          <group position={[0, 0, milestoneZ]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[1.5, 1.8, 32]} />
              <meshBasicMaterial color="#fceabb" transparent opacity={0.85} />
            </mesh>
            <pointLight position={[0, 1, 0]} intensity={3} color="#fceabb" distance={10} />
          </group>
        )}
      </Canvas>
    </div>
  );
}
