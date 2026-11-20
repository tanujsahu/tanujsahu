import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#070b14",
          color: "#e7eefc",
          padding: "72px",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#67e8f9" }}>
          JAIPUR
        </div>
        <div style={{ display: "flex", marginTop: 18, fontSize: 84, lineHeight: 1 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 32, color: "#cbd5e1" }}>
          {profile.title}
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 28, color: "#a5f3fc" }}>
          {profile.tagline}
        </div>
      </div>
    ),
    size,
  );
}
