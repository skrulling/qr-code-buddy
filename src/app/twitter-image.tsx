import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function TwitterImage() {
  const logoBuffer = readFileSync(join(process.cwd(), "public", "logo-og.png"));
  const logoData = Uint8Array.from(logoBuffer).buffer;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #ffffff 0%, #ffffff 50%, #f7f7f799 100%)",
          color: "#252525",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 40,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              // @ts-ignore
              src={logoData}
              alt="QR Code Buddy logo"
              width={36}
              height={36}
              style={{ borderRadius: 6 }}
            />
            <span style={{ fontSize: 18, fontWeight: 500, color: "#252525" }}>
              QR Code Buddy
            </span>
          </div>

          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h1
              style={{
                fontSize: 60,
                fontWeight: 600,
                lineHeight: 1.1,
                margin: 0,
                color: "#252525",
              }}
            >
              Paste URLs, get crisp PNG QR codes.
            </h1>
            <p
              style={{
                fontSize: 22,
                lineHeight: 1.5,
                margin: 0,
                color: "#8e8e8e",
                maxWidth: 800,
              }}
            >
              Drop one or many links, generate high-quality PNG codes, rename
              them, then download a single file or a tidy zip.
            </p>
          </div>

          {/* Card mockup */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(235, 235, 235, 0.7)",
              borderRadius: 16,
              padding: 24,
              gap: 20,
              maxWidth: 900,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#252525" }}>
                  URLs (one per line)
                </span>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #ebebeb",
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 100,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      height: 12,
                      background: "#ebebeb",
                      borderRadius: 4,
                      width: "70%",
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      background: "#ebebeb",
                      borderRadius: 4,
                      width: "65%",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: 12, color: "#8e8e8e" }}>Output</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>PNG · 512px · Error correction H</div>
                <div
                  style={{
                    background: "#252525",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    marginTop: 8,
                  }}
                >
                  Generate QR codes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
