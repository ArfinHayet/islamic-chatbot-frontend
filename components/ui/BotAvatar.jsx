"use client";

export function BotAvatar() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg, #1a6b5a 0%, #0d4a3e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(26,107,90,0.35)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)" />
        <path
          d="M8 11.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM13 11.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"
          fill="white"
        />
        <path
          d="M9 15.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
