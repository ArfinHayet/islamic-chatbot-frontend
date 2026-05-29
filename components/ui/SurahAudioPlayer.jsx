"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "noorai:surah-player:v1";
const PLAY_EVENT = "noorai:surah-player-play";

function formatTime(value) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function readSavedState(media) {
  if (typeof window === "undefined") return null;

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || saved.surahNumber !== media.surahNumber || saved.audioUrl !== media.audioUrl) return null;
    return saved;
  } catch {
    return null;
  }
}

function saveState(media, state) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      surahNumber: media.surahNumber,
      audioUrl: media.audioUrl,
      currentTime: state.currentTime,
      duration: state.duration,
      paused: state.paused,
      updatedAt: Date.now(),
    }),
  );
}

export function SurahAudioPlayer({ media, theme }) {
  const audioRef = useRef(null);
  const playerId = useMemo(() => `${media.surahNumber}-${media.audioUrl}`, [media.audioUrl, media.surahNumber]);
  const restoredTimeRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = readSavedState(media);

    if (saved) {
      const savedTime = Number(saved.currentTime || 0);
      restoredTimeRef.current = savedTime > 0 ? savedTime : null;
      setCurrentTime(savedTime);
      setDuration(Number(saved.duration || 0));
      setPaused(true);
    } else {
      restoredTimeRef.current = null;
      setCurrentTime(0);
      setDuration(0);
      setPaused(true);
    }
  }, [media]);

  useEffect(() => {
    const handleOtherPlayer = (event) => {
      if (event.detail?.playerId !== playerId) {
        audioRef.current?.pause();
      }
    };

    window.addEventListener(PLAY_EVENT, handleOtherPlayer);
    return () => window.removeEventListener(PLAY_EVENT, handleOtherPlayer);
  }, [playerId]);

  useEffect(() => {
    saveState(media, { currentTime, duration, paused });
  }, [currentTime, duration, media, paused]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration || 0);

    if (restoredTimeRef.current != null && restoredTimeRef.current < audio.duration) {
      audio.currentTime = restoredTimeRef.current;
      restoredTimeRef.current = null;
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime || 0);
    setDuration(audio.duration || duration || 0);
    saveState(media, {
      currentTime: audio.currentTime || 0,
      duration: audio.duration || duration || 0,
      paused: audio.paused,
    });
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setError("");

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: { playerId } }));
      await audio.play();
    } catch {
      setError("Unable to start playback. Please try again.");
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    setCurrentTime(nextTime);
    if (audio) audio.currentTime = nextTime;
  };

  const progressMax = duration || currentTime || 0;

  return (
    <div
      style={{
        marginTop: 12,
        display: "grid",
        gap: 10,
        padding: 12,
        borderRadius: 8,
        border: `1px solid ${theme.borderMed}`,
        background: theme.bgSec,
      }}
    >
      <audio
        ref={audioRef}
        preload="metadata"
        src={media.audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          setPaused(false);
          saveState(media, { currentTime, duration, paused: false });
        }}
        onPause={() => {
          setPaused(true);
          saveState(media, { currentTime, duration, paused: true });
        }}
        onEnded={() => {
          setPaused(true);
          setCurrentTime(0);
          saveState(media, { currentTime: 0, duration, paused: true });
        }}
        onError={() => setError("Audio could not be loaded right now.")}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, lineHeight: 1.35 }}>
            Surah {media.surahName}
          </div>
          <div style={{ fontSize: 11.5, color: theme.textSec, lineHeight: 1.45 }}>
            {media.reciterName} · {media.source}
          </div>
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={paused ? "Play recitation" : "Pause recitation"}
          title={paused ? "Play" : "Pause"}
          style={{
            width: 38,
            height: 38,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: theme.accent,
            color: "white",
            fontSize: 15,
          }}
        >
          <i className={paused ? "pi pi-play" : "pi pi-pause"} />
        </button>
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <input
          type="range"
          min="0"
          max={progressMax}
          step="1"
          value={Math.min(currentTime, progressMax)}
          onChange={handleSeek}
          aria-label="Recitation progress"
          style={{ width: "100%", accentColor: theme.accent }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: theme.textTer, fontSize: 11 }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {error && <div style={{ color: "#c0392b", fontSize: 12, lineHeight: 1.4 }}>{error}</div>}
    </div>
  );
}
