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
          background:
            "linear-gradient(180deg, #f8fafc 0%, #e0f2fe 35%, #e5e7eb 100%)",
          color: "#0f172a",
          fontFamily: "Inter, Arial, sans-serif",
          padding: "64px 72px",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #f8fafc 100%)",
                boxShadow: "0 8px 24px rgba(14,165,233,0.25)",
              }}
            />
            <span
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.4 }}
            >
              QR Code Buddy
            </span>
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 700,
            }}
          >
            Paste URLs, get crisp PNG QR codes.
          </div>
          <div
            style={{
              fontSize: 24,
              opacity: 0.8,
              maxWidth: 680,
              lineHeight: 1.4,
            }}
          >
            Generate high-quality QR codes, rename files, and download as PNG or
            a clean zip—all in one view.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 20,
            width: 360,
            height: 320,
            padding: 22,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 28,
            border: "1px solid rgba(15, 23, 42, 0.08)",
            boxShadow: "0 25px 80px rgba(15,23,42,0.18)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 60%, #f8fafc 100%)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: 12,
                  background: "#e2e8f0",
                  borderRadius: 999,
                  width: "80%",
                }}
              />
              <div
                style={{
                  height: 12,
                  background: "#e2e8f0",
                  borderRadius: 999,
                  width: "60%",
                }}
              />
              <div
                style={{
                  height: 12,
                  background: "#cbd5e1",
                  borderRadius: 999,
                  width: "50%",
                }}
              />
            </div>
          </div>
          <div
            style={{
              height: 16,
              background: "#0ea5e9",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(14,165,233,0.35)",
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
