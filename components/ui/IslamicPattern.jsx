"use client";

export function IslamicPattern({ dark }) {
  const c = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ip" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={c} strokeWidth="0.8" />
          <circle cx="30" cy="30" r="12" fill="none" stroke={c} strokeWidth="0.8" />
          <path d="M30 18 L42 30 L30 42 L18 30 Z" fill="none" stroke={c} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip)" />
    </svg>
  );
}
