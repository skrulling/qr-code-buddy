import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 20% 20%, #0ea5e9, #111827)",
          color: "white",
          fontFamily: "Inter, Arial, sans-serif",
          padding: "72px",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 6,
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            QR Code Buddy
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>
            Paste URLs, get crisp PNG QR codes.
          </div>
          <div style={{ fontSize: 24, opacity: 0.85, maxWidth: 640 }}>
            Generate, rename, and download multiple QR codes instantly.
          </div>
        </div>
        <div
          style={{
            width: 240,
            height: 240,
            background: "white",
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              background:
                "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #f8fafc 100%)",
              borderRadius: 24,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
