"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";

export function AudioEngine() {
  const { state } = useGame();
  const { muted, phase, currentScenario } = state;
  const audioCtxRef = useRef(null);
  const ambientGainRef = useRef(null);
  const ambientOscRef = useRef(null);
  const prevPhaseRef = useRef(phase);

  const district = currentScenario?.district || "home";

  // Initialize Web Audio API context on mount / user interaction
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play a simple synthesized chime using Web Audio API oscillators
  const playChime = (freqs = [440, 554.37, 659.25], type = "sine", duration = 0.8) => {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(ctx.destination);

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration);
    });
  };

  // Play UI Sfx
  const playSelectSfx = () => playChime([523.25, 659.25], "sine", 0.2);
  const playVirtueGainChime = () => playChime([440, 554.37, 659.25, 880], "triangle", 0.6);
  const playLevelUpTone = () => playChime([329.63, 440, 554.37, 659.25, 880, 1108.73], "sine", 1.2);

  // Reaction to phase changes
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      if (phase === "choice_committed") {
        playSelectSfx();
      } else if (phase === "reflection") {
        playVirtueGainChime();
      } else if (phase === "level_up" || phase === "game_complete") {
        playLevelUpTone();
      }
      prevPhaseRef.current = phase;
    }
  }, [phase, muted]);

  // Ambient sound generation (soft wind/city bed using filtered noise)
  useEffect(() => {
    if (muted) {
      if (ambientGainRef.current) {
        ambientGainRef.current.gain.value = 0;
      }
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    // Set up ambient pink noise / filtered oscillator bed if not running
    if (!ambientOscRef.current) {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.015; // Low volume bed
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = district === "marketplace" ? 600 : district === "madrasa" ? 350 : 450;

      const gain = ctx.createGain();
      gain.gain.value = 0.03;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      ambientOscRef.current = whiteNoise;
      ambientGainRef.current = gain;
    } else if (ambientGainRef.current) {
      ambientGainRef.current.gain.value = 0.03;
    }
  }, [muted, district]);

  return null;
}
