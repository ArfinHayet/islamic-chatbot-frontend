"use client";

export function UserAvatar({ initials = "A" }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg, #2d5a8e 0%, #1a3a5c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        color: "white",
        boxShadow: "0 2px 8px rgba(45,90,142,0.35)",
      }}
    >
      {initials}
    </div>
  );
}
