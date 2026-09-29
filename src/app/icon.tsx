import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/theme";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.nightBg,
          borderRadius: 14,
          color: BRAND.accent,
          fontSize: 30,
          fontWeight: 700,
          fontStyle: "italic",
        }}
      >
        V
      </div>
    ),
    { ...size }
  );
}
