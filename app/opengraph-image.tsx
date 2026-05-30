import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "UXCODESTUDIO — Web Design & Development Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050508 0%, #07091a 50%, #050508 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "400px",
          background: "radial-gradient(ellipse at center, rgba(79,110,247,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        {/* Logo text */}
        <div style={{
          fontSize: 72, fontWeight: 800, letterSpacing: "-2px",
          color: "white", marginBottom: 16,
        }}>
          UXCODESTUDIO
        </div>
        {/* Tagline */}
        <div style={{
          fontSize: 28, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em",
        }}>
          Web Design &amp; Development Studio
        </div>
        {/* Bottom accent */}
        <div style={{
          position: "absolute", bottom: 48,
          fontSize: 18, color: "rgba(0,212,255,0.8)", letterSpacing: "0.15em",
        }}>
          uxcodestudio.com
        </div>
      </div>
    ),
    { ...size }
  );
}
