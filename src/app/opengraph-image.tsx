import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/theme";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: BRAND.nightBg,
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(212,161,94,0.18), transparent 45%)",
          color: BRAND.nightFg,
        }}
      >
        <div style={{ display: "flex", color: BRAND.accent, fontSize: 22, letterSpacing: 4, marginBottom: 28 }}>
          SOFTWARE ENGINEER · ONTARIO, CANADA
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
          A recent grad
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, fontStyle: "italic", color: BRAND.accent }}>
          who ships end to end
        </div>
        <div style={{ display: "flex", fontSize: 26, color: BRAND.nightMutedFg, marginTop: 32 }}>
          Vivek Salwan · github.com/VivekSalwan2000
        </div>
      </div>
    ),
    { ...size }
  );
}
